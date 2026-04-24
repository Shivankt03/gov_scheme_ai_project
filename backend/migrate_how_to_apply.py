"""
Run this script ONCE to add the 'how_to_apply' column to the schemes table
and populate it for all existing schemes using the AI.

Usage:
    cd backend
    python migrate_how_to_apply.py
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, SessionLocal
from app.models import Scheme
from sqlalchemy import text
from app.services.hybrid_ai_engine import fast_chat_groq

def run_migration():
    # 1. Add column if it doesn't exist
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE schemes ADD COLUMN how_to_apply TEXT"))
            conn.commit()
            print("✅ Column 'how_to_apply' added to schemes table.")
        except Exception as e:
            if "already exists" in str(e).lower() or "duplicate" in str(e).lower():
                print("ℹ️  Column 'how_to_apply' already exists. Skipping ALTER.")
            else:
                print(f"⚠️  DB error: {e}")

    # 2. Populate how_to_apply for schemes that don't have it yet
    db = SessionLocal()
    try:
        schemes = db.query(Scheme).filter(
            (Scheme.how_to_apply == None) | (Scheme.how_to_apply == "")
        ).all()
        print(f"\n📋 Found {len(schemes)} schemes needing 'how_to_apply'...")

        for i, scheme in enumerate(schemes, 1):
            print(f"  [{i}/{len(schemes)}] Generating for: {scheme.name}...")
            prompt = (
                f"Scheme: {scheme.name}\n"
                f"Ministry: {scheme.ministry}\n"
                f"Description: {scheme.description}\n"
                f"Benefit: {scheme.benefit}\n\n"
                "Provide a clear, numbered step-by-step 'How to Apply' guide for this Indian government scheme. "
                "Keep it practical (4-6 steps). Format as:\n"
                "Step 1: ...\nStep 2: ...\nStep 3: ...\n"
                "Include: where to apply (online portal or offline office), what documents to carry, "
                "and any important tips. Be concise and helpful."
            )
            try:
                guide = fast_chat_groq(prompt, language='en')
                scheme.how_to_apply = guide
                db.commit()
                print(f"     ✓ Done")
            except Exception as e:
                print(f"     ✗ Error: {e}")
                db.rollback()

        print(f"\n✅ Migration complete! {len(schemes)} schemes updated.")
    finally:
        db.close()

if __name__ == "__main__":
    run_migration()
