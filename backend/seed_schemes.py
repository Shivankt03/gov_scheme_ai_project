from app.database import SessionLocal, engine
from app.models import Base, Scheme

# Ensure tables exist
Base.metadata.create_all(bind=engine)

def seed():
    db = SessionLocal()
    # Check if schemes already exist
    if db.query(Scheme).count() > 0:
        print("Schemes already seeded.")
        return
        
    schemes = [
        Scheme(
            name="PM Kisan Samman Nidhi",
            ministry="Ministry of Agriculture and Farmers Welfare",
            description="Under the scheme an income support of 6,000/- per year in three equal installments will be provided to all land holding farmer families.",
            min_age=18,
            max_income=None,
            target_occupation="Farmer",
            target_category="All",
            state="All",
            benefit="Rs. 6000 per year",
            application_link="https://pmkisan.gov.in/"
        ),
        Scheme(
            name="Pradhan Mantri Awas Yojana - Urban (PMAY-U)",
            ministry="Ministry of Housing and Urban Affairs",
            description="Aimed at providing housing for all in urban areas as well as repairing existing kucha houses.",
            min_age=18,
            max_income=300000,
            target_occupation="All",
            target_category="EWS/LIG",
            state="All",
            benefit="Subsidized Housing / Financial Assistance",
            application_link="https://pmaymis.gov.in/"
        ),
        Scheme(
            name="Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)",
            ministry="Ministry of Health and Family Welfare",
            description="Aims to provide health cover of Rs. 5 lakhs per family per year for secondary and tertiary care hospitalization to eligible families.",
            min_age=0,
            max_income=100000,
            target_occupation="All",
            target_category="BPL",
            state="All",
            benefit="Health insurance cover of Rs. 5 lakhs per year",
            application_link="https://pmjay.gov.in/"
        ),
        Scheme(
            name="Sukanya Samriddhi Yojana",
            ministry="Ministry of Finance",
            description="A small savings scheme backed by the Government of India targeted at the parents of girl children. The scheme encourages parents to build a fund for the future education and marriage expenses for their female child.",
            min_age=0,
            max_income=None,
            target_occupation="All",
            target_category="Female Child",
            state="All",
            benefit="High interest rate savings for female child",
            application_link="https://www.nsiindia.gov.in/"
        ),
        Scheme(
            name="Atal Pension Yojana",
            ministry="Ministry of Finance",
            description="A pension scheme primarily focused on the unorganized sector. The subscriber receives a guaranteed minimum pension of Rs. 1,000 to Rs. 5,000 per month.",
            min_age=18,
            max_income=None,
            target_occupation="Unorganized Sector",
            target_category="All",
            state="All",
            benefit="Minimum pension of Rs 1000 - 5000 / month",
            application_link="https://npscra.nsdl.co.in/scheme-details.php"
        )
    ]
    
    db.add_all(schemes)
    db.commit()
    print(f"Successfully seeded {len(schemes)} schemes.")
    db.close()

if __name__ == "__main__":
    seed()
