import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

def get_llm(model: str="gemini-2.5-flash", temperature: float=0.3):
    return ChatGoogleGenerativeAI(
        model=model,
        temperature=temperature,
        google_api_key=os.getenv("GOOGLE_API_KEY")
    )
