from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from ..services.hybrid_ai_engine import fast_chat_groq, analyze_schemes_openrouter
from ..database import get_db, SessionLocal
from ..models import Scheme, User, Profile
from ..auth import get_current_user

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    language: Optional[str] = 'en'   # ← NEW: language code from frontend

class ChatMessage(BaseModel):
    role: str
    content: str

class ConversationRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []
    language: Optional[str] = 'en'   # ← NEW: language code from frontend


def format_user_profile(user: User) -> str:
    """Format the user and their profile into a readable string for the AI."""
    profile_str = f"Name: {user.name}\nEmail: {user.email}\n"
    if user.profile:
        p = user.profile
        profile_str += f"State: {p.state}\nAge: {p.age}\nGender: {p.gender}\nCategory: {p.category}\n"
        profile_str += f"Occupation: {p.occupation}\nAnnual Income: ₹{p.income}\n"
        profile_str += f"Disability: {'Yes' if p.disability else 'No'}\n"
        profile_str += f"Education: {p.education}\n"
        profile_str += f"Farmer: {'Yes' if p.is_farmer else 'No'}\n"
    else:
        profile_str += "The user has not completed their profile yet."
    return profile_str


@router.post("/chat")
def chat_with_bot(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Main chatbot endpoint. Routes to scheme reasoning (OpenRouter) or 
    fast conversation (Groq) based on keyword detection.
    Responds in the user's selected language.
    """
    message_text = request.message
    language = request.language or 'en'

    # Keyword detection — same as before
    keywords = [
        "age", "year", "income", "farmer", "rs", "rupees", "recommend",
        "scheme", "student", "help", "startup", "crop", "apply", "business",
        "problem", "yojana", "sarkar", "government", "subsidy", "loan",
        # Hindi/regional keywords
        "योजना", "सरकार", "मदद", "किसान", "आवेदन", "पैसा",
        "திட்டம்", "সরকার", "ਯੋਜਨਾ", "yojana",
    ]
    needs_recommendation = any(kw in message_text.lower() for kw in keywords)

    if needs_recommendation:
        schemes = db.query(Scheme).all()
        schemes_data = []
        for s in schemes:
            schemes_data.append(
                f"Name: {s.name}\nDesc: {s.description}\nProvides: {s.benefit}\n"
                f"Eligibility: Min age {s.min_age}, Max Income {s.max_income}, "
                f"Targets {s.target_occupation}/{s.target_category}"
            )

        schemes_text = "\n\n".join(schemes_data)
        user_profile_text = format_user_profile(current_user)
        user_context_with_msg = (
            f"User Profile Background:\n{user_profile_text}\n\n"
            f"User Question/Problem:\n{message_text}"
        )

        response = analyze_schemes_openrouter(user_context_with_msg, schemes_text, language=language)
        return {"response": response, "model_used": "OpenRouter", "language": language}
    else:
        response = fast_chat_groq(message_text, language=language)
        return {"response": response, "model_used": "Groq", "language": language}


@router.post("/conversation")
def deep_chat_with_bot(
    request: ConversationRequest,
    current_user: User = Depends(get_current_user)
):
    """
    General conversation endpoint with memory, routed to Groq.
    Responds in the user's selected language.
    """
    language = request.language or 'en'
    history_dicts = [{"role": msg.role, "content": msg.content} for msg in request.history]

    user_context_msg = {
        "role": "system",
        "content": f"The user you are speaking to is named {current_user.name}."
    }
    messages = [user_context_msg] + history_dicts

    response = fast_chat_groq(request.message, history=messages, language=language)
    return {"response": response, "model_used": "Groq", "language": language}
