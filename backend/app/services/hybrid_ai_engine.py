import json
from openai import OpenAI
from app.config import settings

# Language name map for prompts
LANGUAGE_NAMES = {
    'en': 'English',
    'hi': 'Hindi (हिन्दी)',
    'mr': 'Marathi (मराठी)',
    'ta': 'Tamil (தமிழ்)',
    'te': 'Telugu (తెలుగు)',
    'bn': 'Bengali (বাংলা)',
    'gu': 'Gujarati (ગુજરાતી)',
}

def get_language_name(code: str) -> str:
    return LANGUAGE_NAMES.get(code, 'English')

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


def analyze_schemes_openrouter(user_profile: str, schemes_data: str, language: str = 'en') -> str:
    """
    Main Logic: Uses OpenRouter to find the best schemes from the list based on user profile.
    Responds in the user's selected language.
    """
    client = get_openrouter_client()
    if not client:
        return "OpenRouter API Key not configured."

    lang_name = get_language_name(language)

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

    IMPORTANT: You MUST respond ENTIRELY in {lang_name}. Every word of your response, including scheme names' explanations, must be in {lang_name}. Do not mix languages.
    """

    try:
        completion = client.chat.completions.create(
            model="meta-llama/llama-3.3-70b-instruct",
            messages=[
                {"role": "system", "content": f"You are a helpful and precise scheme recommender assistant. Always respond in {lang_name} only."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"Error connecting to OpenRouter: {str(e)}"


def fast_chat_groq(message: str, history: list = None, language: str = 'en') -> str:
    """
    Fallback Logic: Uses Groq for blazingly fast conversational responses.
    Responds in the user's selected language.
    """
    client = get_groq_client()
    if not client:
        return "Groq API Key not configured."

    lang_name = get_language_name(language)

    system_prompt = (
        f"You are a fast, helpful government scheme assistant. Answer general queries briefly. "
        f"You MUST always respond in {lang_name} only. Do not use any other language."
    )

    messages = [{"role": "system", "content": system_prompt}]
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


def translate_schemes_batch(schemes_text: str, language: str) -> str:
    """
    Translates a batch of scheme descriptions into the target language using Groq.
    Returns the translated text as a JSON string.
    Fast, cheap, and single API call.
    """
    if language == 'en':
        return schemes_text

    client = get_groq_client()
    if not client:
        return schemes_text

    lang_name = get_language_name(language)

    prompt = f"""Translate the following scheme descriptions from English to {lang_name}.
Keep scheme names, ministry names, and proper nouns in English (do not translate them).
Only translate description and benefit text.
Return only the translated text - preserve the exact same format and structure.

Text to translate:
{schemes_text}"""

    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": f"You are a professional translator. Translate to {lang_name} accurately."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1,
        )
        return completion.choices[0].message.content
    except Exception:
        # On failure, return original English
        return schemes_text
