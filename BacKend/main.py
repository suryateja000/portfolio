from typing import Dict, List, Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from contextlib import asynccontextmanager
import os

from graph import run_chat
from rag import load_all, count_entries, list_topics

@asynccontextmanager
async def lifespan(app: FastAPI):
    base_dir = os.path.dirname(__file__)
    docs_dir = os.path.join(base_dir, "docs")
    load_all(docs_dir)
    print(f"[startup] loaded {count_entries()} entries from {docs_dir}")
    
    yield  
    print("[shutdown] cleaning up...")

app = FastAPI(title="Portfolio Assistant API", lifespan=lifespan)

origins = [
    "*",
    "https://suryateja0.netlify.app",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    query: str = Field(..., description="User question")
    session_id: Optional[str] = Field(None, description="Client session id")

class ChatResponse(BaseModel):
    response: str = Field(..., description="Assistant answer")
    suggestions: List[str] = Field(default_factory=list, description="Up to 3 follow-up suggestions")

SESSIONS: Dict[str, List[Dict[str, str]]] = {}

def _sanitize_ws(s: str) -> str:
    return (s or "").replace("\u00A0", " ")

@app.get("/api/health")
async def health():
    return {"status": "ok"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    question = _sanitize_ws(req.query)
    session_id = req.session_id or "default-session"

    history = SESSIONS.get(session_id, [])
    result = run_chat(question=question, history=history)

    SESSIONS[session_id] = result.get("history", history)

    answer = result.get("answer", "")
    suggestions = (result.get("suggestions", []) or [])[:3]
    return ChatResponse(response=answer, suggestions=suggestions)

@app.get("/api/debug_count")
async def debug_count():
    return {"entries": count_entries(), "sample_topics": list_topics()}
