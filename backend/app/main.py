from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import user_routes, scheme_routes, admin_routes, chatbot_routes
from . import models
from .database import engine
import uvicorn

app = FastAPI(
    title="Government Scheme AI API",
    description="AI-powered platform to help citizens discover and apply for government schemes",
    version="1.0.0",
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(user_routes.router, tags=["Users & Auth"])
app.include_router(scheme_routes.router, tags=["Schemes"])
app.include_router(admin_routes.router, prefix="/admin", tags=["Admin"])
app.include_router(chatbot_routes.router, prefix="/chatbot", tags=["Chatbot"])

# Create tables + auto-migrate new columns
try:
    models.Base.metadata.create_all(bind=engine)
    print("✅ Database tables created/verified successfully")
except Exception as e:
    print(f"⚠️  Could not create DB tables: {e}")

try:
    models.auto_migrate_columns()
    print("✅ Column migrations checked")
except Exception as e:
    print(f"⚠️  Column migration warning: {e}")


@app.get("/", tags=["Health"])
def read_root():
    return {"message": "Welcome to the Government Scheme AI Project API!"}


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok"}


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
