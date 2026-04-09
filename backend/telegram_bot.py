import os
import sys
import logging
from dotenv import load_dotenv


sys.path.append(os.path.dirname(os.path.abspath(__file__)))
load_dotenv()

from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
from app.services.hybrid_ai_engine import analyze_schemes_openrouter, fast_chat_groq
from app.database import SessionLocal
from app.models import Scheme


logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
logger = logging.getLogger(__name__)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send a message when the command /start is issued."""
    user = update.effective_user
    await update.message.reply_text(
        f"Hi {user.first_name}! I am your Government Scheme AI Assistant.\n\n"
        "Send me details like your age, income, and occupation to get personalized scheme recommendations, "
        "or just chat with me if you have general queries!"
    )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send a message when the command /help is issued."""
    await update.message.reply_text(
        "You can ask me to recommend schemes for you. E.g., 'I am a 30 year old farmer with 50,000 income, what schemes apply to me?'"
    )

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle incoming messages and route them to OpenRouter or Groq."""
    message_text = update.message.text
    
  
    keywords = ["age", "year", "income", "farmer", "rs", "rupees", "recommend", "scheme", "student"]
    needs_recommendation = any(kw in message_text.lower() for kw in keywords)
    
    if needs_recommendation:
        await update.message.reply_text("Analyzing your profile to find the best schemes... (using OpenRouter)")
        
        # Fetch schemes from the database
        db = SessionLocal()
        schemes = db.query(Scheme).all()
        schemes_data = []
        for s in schemes:
            schemes_data.append(f"Name: {s.name}\nDesc: {s.description}\nProvides: {s.benefit}\nEligibility: Min age {s.min_age}, Max Income {s.max_income}, Targets {s.target_occupation}/{s.target_category}")
        db.close()
        
        schemes_text = "\n\n".join(schemes_data)
        
        # Call OpenRouter Main Logic
        response = analyze_schemes_openrouter(message_text, schemes_text)
        await update.message.reply_text(response)
        
    else:
        # For general chat, fallback to fast Groq chat
        response = fast_chat_groq(message_text)
        await update.message.reply_text(response)

async def error_handler(update: object, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Log the error and send a telegram message to notify the developer."""
    logger.error("Exception while handling an update:", exc_info=context.error)

def main() -> None:
    """Start the bot."""
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    if not token or token == "your_telegram_bot_token":
        logger.error("TELEGRAM_BOT_TOKEN is not set or is effectively empty. Exiting.")
        return

    # Create the Application and pass it your bot's token.
    application = Application.builder().token(token).build()

    # on different commands - answer in Telegram
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))

    # on non command i.e message - echo the message on Telegram
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    # log all errors
    application.add_error_handler(error_handler)

    # Run the bot until the user presses Ctrl-C
    logger.info("Starting Telegram Bot Polling...")
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == "__main__":
    main()
