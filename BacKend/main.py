from typing import Dict, List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from contextlib import asynccontextmanager
import os
import logging

from graph import run_chat
from rag import load_all, count_entries, list_topics

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    try:
        base_dir = os.path.dirname(__file__)
        docs_dir = os.path.join(base_dir, "docs")
        
        # Create docs directory if it doesn't exist
        if not os.path.exists(docs_dir):
            os.makedirs(docs_dir)
            logger.warning(f"Created docs directory: {docs_dir}")
        
        load_all(docs_dir)
        entries_count = count_entries()
        logger.info(f"[startup] loaded {entries_count} entries from {docs_dir}")
    except Exception as e:
        logger.error(f"[startup] Error loading docs: {e}")
    
    yield  
    
    logger.info("[shutdown] cleaning up...")


app = FastAPI(
    title="Portfolio Assistant API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration - Restrict in production
origins = [
    "http://localhost:3000",
    "https://suryateja000.github.io",
    "https://portfolio-t16g.onrender.com", 
    # Add other frontend deployment URLs here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    query: str = Field(..., description="User question", min_length=1, max_length=500)
    session_id: Optional[str] = Field(None, description="Client session id")


class ChatResponse(BaseModel):
    response: str = Field(..., description="Assistant answer")
    suggestions: List[str] = Field(default_factory=list, description="Up to 3 follow-up suggestions")


# In-memory session storage (simple bounded cache for Render)
from collections import OrderedDict
MAX_SESSIONS = 100
SESSIONS: OrderedDict[str, List[Dict[str, str]]] = OrderedDict()


def _sanitize_ws(s: str) -> str:
    """Remove non-breaking spaces"""
    return (s or "").replace("\u00A0", " ").strip()


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "status": "ok",
        "message": "Portfolio Assistant API is running",
        "version": "1.0.0"
    }


@app.get("/api/health")
async def health():
    """Health check endpoint"""
    try:
        entries = count_entries()
        return {
            "status": "healthy",
            "entries_loaded": entries,
            "sessions_active": len(SESSIONS)
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {"status": "unhealthy", "error": str(e)}


@app.post("/api/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    """Chat endpoint"""
    try:
        question = _sanitize_ws(req.query)
        
        if not question:
            raise HTTPException(status_code=400, detail="Question cannot be empty")
        
        session_id = req.session_id or "default-session"
        
        # Get or create session history
        history = SESSIONS.get(session_id, [])
        
        # Run chat
        result = run_chat(question=question, history=history)
        
        # Update session with LRU behavior
        if session_id in SESSIONS:
            del SESSIONS[session_id]
        SESSIONS[session_id] = result.get("history", history)
        
        # Enforce max sessions
        if len(SESSIONS) > MAX_SESSIONS:
            SESSIONS.popitem(last=False) # Remove oldest session
        
        # Extract response
        answer = result.get("answer", "I apologize, but I couldn't generate a response.")
        suggestions = (result.get("suggestions", []) or [])[:3]
        
        return ChatResponse(response=answer, suggestions=suggestions)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.get("/api/debug_count")
async def debug_count():
    """Debug endpoint to check loaded entries"""
    try:
        return {
            "entries": count_entries(),
            "sample_topics": list_topics(),
            "sessions": len(SESSIONS)
        }
    except Exception as e:
        logger.error(f"Debug count error: {e}")
        return {"error": str(e)}


@app.get("/api/sessions")
async def get_sessions():
    """Get active sessions count"""
    return {
        "active_sessions": len(SESSIONS),
        "session_ids": list(SESSIONS.keys())
    }


@app.delete("/api/sessions/{session_id}")
async def delete_session(session_id: str):
    """Delete a specific session"""
    if session_id in SESSIONS:
        del SESSIONS[session_id]
        return {"message": f"Session {session_id} deleted"}
    return {"message": "Session not found"}
