import json
from openai import OpenAI
from app.config import settings

def get_openrouter_client():
    if not settings.OPENROUTER_API_KEY:
        return None
    return OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=settings.OPENROUTER_API_KEY,
    )

def get_groq_client():
    if not settings.GROQ_API_KEY:
        return None
    return OpenAI(
        base_url="https://api.groq.com/openai/v1",
        api_key=settings.GROQ_API_KEY,
    )

def analyze_schemes_openrouter(user_profile: str, schemes_data: str) -> str:
    """
    Main Logic: Uses OpenRouter to find the best schemes from the list based on user profile.
    """
    client = get_openrouter_client()
    if not client:
        return "OpenRouter API Key not configured."
    
    prompt = f"""
    You are an empathetic, expert consultant for government schemes and citizen problem-solving.
    A user has come to you with their profile or a specific problem (e.g., crop destruction, starting a business, financial trouble).

    Current User Input/Problem:
    {user_profile}

    Schemes from our Local Database:
    {schemes_data}

    Your Instructions:
    1. First, prioritize analyzing the user's situation and see if any of the 'Schemes from our Local Database' can help them. 
    2. If the local database doesn't have a perfect solution, use your vast internal knowledge to suggest highly accurate, real-world Government of India/State schemes (like PMFBY for crops, Startup India, etc.) that directly solve their problem.
    3. Be empathetic and practical. Don't just list scheme names—explain exactly how it solves their specific problem and give them the best actionable advice on how to apply or proceed.
    4. Keep your response concise, well-structured, and easy to read.
    """
    
    try:
        completion = client.chat.completions.create(
            # Using deep reasoning model via OpenRouter
            model="meta-llama/llama-3.3-70b-instruct",
            messages=[
                {"role": "system", "content": "You are a helpful and precise scheme recommender assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"Error connecting to OpenRouter: {str(e)}"

def fast_chat_groq(message: str, history: list = None) -> str:
    """
    Fallback Logic: Uses Groq for blazingly fast conversational responses.
    """
    client = get_groq_client()
    if not client:
        return "Groq API Key not configured."
    
    messages = [{"role": "system", "content": "You are a fast, helpful government scheme assistant. Answer general queries briefly."}]
    if history:
        messages.extend(history)
    messages.append({"role": "user", "content": message})
    
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.6,
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"Error connecting to Groq: {str(e)}"
