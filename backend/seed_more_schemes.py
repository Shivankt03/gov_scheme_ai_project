"""
Seed script: Adds additional targeted government schemes to the database across categories.
Run from the backend directory:
    python seed_more_schemes.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine
from app.models import Base, Scheme, auto_migrate_columns

Base.metadata.create_all(bind=engine)
auto_migrate_columns()

NEW_SCHEMES = [
    # ── HEALTH ──────────────────────────────────────────────────────────────
    Scheme(
        name="Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)",
        ministry="Ministry of Health and Family Welfare",
        description="A national public health insurance fund aiming to provide free access to health insurance coverage for low income earners in the country.",
        benefit="Health insurance cover of up to ₹5 lakh per family per year for secondary and tertiary care hospitalization.",
        min_age=None, max_income=250000, target_occupation=None, target_category=None, state="All",
        application_link="https://pmjay.gov.in"
    ),
    Scheme(
        name="Pradhan Mantri Surakshit Matritva Abhiyan (PMSMA)",
        ministry="Ministry of Health and Family Welfare",
        description="Aims to provide assured, comprehensive and quality antenatal care, free of cost, universally to all pregnant women on the 9th of every month.",
        benefit="Free health checkups and antenatal care for pregnant women.",
        min_age=18, max_income=None, target_occupation=None, target_category="Women", state="All",
        application_link="https://pmsma.nhp.gov.in"
    ),
    
    # ── EDUCATION ───────────────────────────────────────────────────────────
    Scheme(
        name="National Means-cum-Merit Scholarship (NMMS)",
        ministry="Ministry of Education",
        description="Scholarships for meritorious students of economically weaker sections to arrest their drop out at class VIII and encourage them to continue study at secondary stage.",
        benefit="Scholarship of ₹12,000 per annum (₹1000 per month).",
        min_age=12, max_income=350000, target_occupation="Student", target_category=None, state="All",
        application_link="https://scholarships.gov.in"
    ),
    Scheme(
        name="Post Matric Scholarship for Minorities",
        ministry="Ministry of Minority Affairs",
        description="Scholarship to encourage students belonging to minority communities to pursue higher education.",
        benefit="Admission and tuition fee coverage + maintenance allowance up to ₹10,000 per year.",
        min_age=15, max_income=200000, target_occupation="Student", target_category="Minority", state="All",
        application_link="https://scholarships.gov.in"
    ),

    # ── ENTREPRENEURSHIP & FINANCE ──────────────────────────────────────────
    Scheme(
        name="Pradhan Mantri Mudra Yojana (PMMY) - Shishu",
        ministry="Ministry of Finance",
        description="Provides loans up to ₹50,000 to non-corporate, non-farm small/micro enterprises to start their businesses.",
        benefit="Working capital loan up to ₹50,000 without collateral.",
        min_age=18, max_income=None, target_occupation="Entrepreneur", target_category=None, state="All",
        application_link="https://www.mudra.org.in"
    ),
    Scheme(
        name="Stand-Up India Scheme",
        ministry="Ministry of Finance",
        description="Facilitates bank loans between 10 lakh and 1 Crore to at least one SC/ST borrower and at least one woman borrower per bank branch for setting up a greenfield enterprise.",
        benefit="Bank loan between ₹10 lakh and ₹1 Crore.",
        min_age=18, max_income=None, target_occupation="Business", target_category="SC/ST or Women", state="All",
        application_link="https://www.standupmitra.in"
    ),

    # ── HOUSING & INFRASTRUCTURE ────────────────────────────────────────────
    Scheme(
        name="Pradhan Mantri Awas Yojana (PMAY) - Urban",
        ministry="Ministry of Housing and Urban Affairs",
        description="Ensures housing for all in urban areas by providing central assistance to implementing agencies.",
        benefit="Interest subsidy on housing loans up to ₹2.67 lakh for purchasing or constructing a house.",
        min_age=18, max_income=1800000, target_occupation=None, target_category="Urban", state="All",
        application_link="https://pmaymis.gov.in"
    ),

    # ── WOMEN & CHILD DEVELOPMENT ───────────────────────────────────────────
    Scheme(
        name="Beti Bachao Beti Padhao (BBBP)",
        ministry="Ministry of Women and Child Development",
        description="Addresses the declining Child Sex Ratio (CSR) and related issues of women empowerment over a life-cycle continuum.",
        benefit="Promotes girls' education and welfare; linked to Sukanya Samriddhi Yojana deposit scheme.",
        min_age=0, max_income=None, target_occupation=None, target_category="Women", state="All",
        application_link="https://wcd.nic.in/bbbp-schemes"
    ),

    # ── STATE SPECIFIC (Maharashtra) ─────────────────────────────────────────
    Scheme(
        name="Mahatma Jyotirao Phule Jan Arogya Yojana",
        ministry="State Government of Maharashtra",
        description="State health insurance scheme for below poverty line (BPL) and above poverty line (APL) families.",
        benefit="Health insurance coverage up to ₹1.5 lakh per family per year.",
        min_age=None, max_income=100000, target_occupation=None, target_category=None, state="Maharashtra",
        application_link="https://www.jeevandayee.gov.in"
    ),

    # ── STATE SPECIFIC (Uttar Pradesh) ─────────────────────────────────────────
    Scheme(
        name="UP Mukhyamantri Kanya Sumangala Yojana",
        ministry="State Government of Uttar Pradesh",
        description="Financial assistance provided at different stages of a girl child's life to promote education and health.",
        benefit="Total financial aid of ₹15,000 from birth to graduation.",
        min_age=0, max_income=300000, target_occupation=None, target_category="Women", state="Uttar Pradesh",
        application_link="https://mksy.up.gov.in"
    ),
]

def seed_db():
    db = SessionLocal()
    try:
        added_count = 0
        for scheme in NEW_SCHEMES:
            # Check if scheme with same name exists
            existing = db.query(Scheme).filter(Scheme.name == scheme.name).first()
            if not existing:
                db.add(scheme)
                added_count += 1
                
        if added_count > 0:
            db.commit()
            print(f"✅ Successfully seeded {added_count} new category-specific schemes!")
        else:
            print("ℹ️ No new schemes added. They may already exist in the database.")
            
    except Exception as e:
        print(f"❌ Error during seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
