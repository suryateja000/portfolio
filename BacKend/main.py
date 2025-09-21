from typing import TypedDict, List, Union
from langchain_core.messages import HumanMessage, AIMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import StateGraph, START, END
from dotenv import load_dotenv
import os

load_dotenv()

class Agent(TypedDict):
    messages: List[Union[HumanMessage, AIMessage]]
    
GOOGLE_API_KEY = "AIzaSyBa_Sj6rgz7l2-LHA-Bbe66BGV6LdU_nJo"

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash", 
    temperature=0.7,
    max_tokens=1024,
    google_api_key=GOOGLE_API_KEY,
)

def process(state: Agent) -> Agent:
    response = llm.invoke(state["messages"])
    state["messages"].append(response)
    return state

graph = StateGraph(Agent)
graph.add_node("process", process)
graph.add_edge(START, "process")
graph.add_edge("process", END)

agent = graph.compile()

history = []

user_input = input("User: ")
while user_input.lower() != "exit":
    history.append(HumanMessage(content=user_input))
    result = agent.invoke({"messages": history})
    history = result["messages"]
    user_input = input("User: ")
