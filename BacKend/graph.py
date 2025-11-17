# backend/graph.py
from typing import TypedDict, Dict, Any, List
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import HumanMessage, SystemMessage
from pydantic import BaseModel, Field, ValidationError
import json

from llm import get_llm
from rag import retrieve, format_citation  # retrieve is used for validation
from prompts import UNIFIED_SYSTEM, SUGGESTIONS_SYSTEM

# LLM instance
LLM = get_llm(temperature=0.3)

class ChatState(TypedDict):
    question: str
    retrieved: List[Dict[str, Any]]
    cite_map: Dict[str, str]
    answer: str
    history: List[Dict[str, str]]
    suggestions: List[str]

def _sanitize_ws(s: str) -> str:
    return (s or "").replace("\u00A0", " ")

def retrieve_node(state: ChatState) -> ChatState:
    res = retrieve(query=_sanitize_ws(state["question"]), k=6)
    cmap: Dict[str, str] = {format_citation(e): e.get("section", "Unknown") for e in res}
    return {"retrieved": res, "cite_map": cmap}

def unified_answer_node(state: ChatState) -> ChatState:
    res = state.get("retrieved", [])
    parts: List[str] = []
    for e in res:
        cite = format_citation(e)
        section = e.get("section", "Unknown")
        excerpt = (e.get("content", "") or "")[:700]
        parts.append(f"{cite} (Section: {section})\n{excerpt}\n")
    profile_text = "\n\n".join(parts) if parts else (
        "No relevant profile context found for this query."
    )

    msgs = [
        SystemMessage(content=UNIFIED_SYSTEM),
        HumanMessage(content=(
            "Profile Context:\n"
            f"{profile_text}\n\n"
            "Conversation History (most recent last):\n"
            + "\n".join([f"{h['role']}: {h['content']}" for h in state.get('history', [])[-8:]])
            + "\n\n"
            f"User question: {state['question']}"
        ))
    ]
    r = LLM.invoke(msgs)

    new_hist = list(state.get("history", []))
    new_hist.append({"role": "user", "content": state["question"]})
    new_hist.append({"role": "assistant", "content": r.content})
    return {"answer": r.content, "history": new_hist}

# Lightweight, local JSON parser
class SuggestionList(BaseModel):
    suggestions: List[str] = Field(default_factory=list, max_items=5) # Generate more to filter from

def _parse_suggestions(text: str) -> List[str]:
    cleaned = text.replace("``````", "")
    start, end = cleaned.find("{"), cleaned.rfind("}")
    if start != -1 and end != -1 and start < end:
        chunk = cleaned[start:end+1]
        try:
            obj = json.loads(chunk)
            parsed = SuggestionList.model_validate(obj)
            return [s.strip().rstrip(".") for s in parsed.suggestions if s]
        except (json.JSONDecodeError, ValidationError):
            pass

    # Fallback for non-JSON text
    return [
        ln.strip().lstrip("-•* ").rstrip(".")
        for ln in text.splitlines()
        if ln.strip() and len(ln.split()) < 10
    ]

def suggestions_node(state: ChatState) -> ChatState:
    hist = state.get("history", [])
    last_user, last_asst = "", ""
    for h in reversed(hist):
        if h["role"] == "assistant" and not last_asst:
            last_asst = h["content"]
        elif h["role"] == "user" and not last_user:
            last_user = h["content"]
        if last_user and last_asst:
            break

    # 1. Generate more candidates than needed (e.g., 5)
    prompt = (
        "Return up to 5 short, chip-friendly follow-ups as JSON:\n"
        '{ "suggestions": ["...", "...", "..."] }\n'
        "Each under 8 words, no numbering or labels.\n"
        f"Last user: {last_user}\nLast assistant: {last_asst}"
    )
    msgs = [SystemMessage(content=SUGGESTIONS_SYSTEM), HumanMessage(content=prompt)]
    r = LLM.invoke(msgs)
    candidate_suggestions = _parse_suggestions(r.content)

    # 2. Validate each candidate to ensure it's answerable
    answerable_suggestions = []
    for sugg in candidate_suggestions:
        if not sugg: continue
        # If retrieve() finds any documents, the question is considered answerable
        hits = retrieve(query=sugg, k=1)
        if hits:
            answerable_suggestions.append(sugg)
        # Stop once we have 3 good ones
        if len(answerable_suggestions) == 3:
            break

    # 3. If we still don't have 3, pad with safe, generic fallbacks
    if len(answerable_suggestions) < 3:
        safe_fallbacks = [
            "Tell me about your projects",
            "What are your main skills?",
            "What are your career goals?"
        ]
        for fb in safe_fallbacks:
            if fb not in answerable_suggestions:
                answerable_suggestions.append(fb)
            if len(answerable_suggestions) == 3:
                break

    return {"suggestions": answerable_suggestions[:3]}

# Build graph
builder = StateGraph(ChatState)
builder.add_node("retrieve_node", retrieve_node)
builder.add_node("unified_answer_node", unified_answer_node)
builder.add_node("suggestions_node", suggestions_node)

builder.add_edge(START, "retrieve_node")
builder.add_edge("retrieve_node", "unified_answer_node")
builder.add_edge("unified_answer_node", "suggestions_node")
builder.add_edge("suggestions_node", END)

GRAPH = builder.compile()

def run_chat(question: str, history: List[Dict[str, str]]) -> ChatState:
    state: ChatState = {
        "question": _sanitize_ws(question),
        "retrieved": [], "cite_map": {}, "answer": "",
        "history": history or [], "suggestions": [],
    }
    return GRAPH.invoke(state)
