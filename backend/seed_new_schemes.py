"""
Seed script: Adds 35+ government schemes to the database.
Run from the backend directory:
    python seed_new_schemes.py

Safe to run multiple times — skips schemes already present by name.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine
from app.models import Base, Scheme, auto_migrate_columns
from datetime import datetime

Base.metadata.create_all(bind=engine)
auto_migrate_columns()

NEW_SCHEMES = [
    # ── AGRICULTURE ──────────────────────────────────────────────────────────
    Scheme(
        name="PM Fasal Bima Yojana (PMFBY)",
        ministry="Ministry of Agriculture and Farmers Welfare",
        description="A crop insurance scheme that provides financial support to farmers suffering crop loss/damage due to unforeseen events like natural calamities, pests and diseases.",
        benefit="Insurance coverage for crop loss; premium as low as 1.5% for Kharif, 2% for Rabi and 5% for commercial crops.",
        min_age=18, max_income=None, target_occupation="Farmer", target_category="All",
        state="All", scheme_type="Central",
        application_link="https://pmfby.gov.in/",
        documents_required="Aadhaar Card, Land Records (Khasra), Bank Passbook, Sowing Certificate, Passport Photo",
        how_to_apply="Step 1: Visit your nearest CSC or bank.\nStep 2: Fill crop insurance application form with land details.\nStep 3: Submit land records (Khasra) and bank passbook copy.\nStep 4: Pay the applicable premium amount.\nStep 5: Collect acknowledgement slip with policy number.\nStep 6: In case of crop loss, intimate within 72 hours via 14447 helpline.",
    ),
    Scheme(
        name="Kisan Credit Card (KCC)",
        ministry="Ministry of Agriculture and Farmers Welfare",
        description="Provides farmers with affordable credit for purchasing seeds, fertilizers, pesticides and for allied activities and maintenance of farm assets.",
        benefit="Credit up to Rs. 3 lakh at 4% interest rate. Flexible repayment tied to harvest season.",
        min_age=18, max_income=None, target_occupation="Farmer", target_category="All",
        state="All", scheme_type="Central",
        application_link="https://www.nabard.org/content.aspx?id=572",
        documents_required="Aadhaar, PAN Card, Land records, Passport size photo, Bank account details",
        how_to_apply="Step 1: Visit nearest cooperative bank, RRB, or commercial bank.\nStep 2: Request KCC application form.\nStep 3: Fill form with personal and land details.\nStep 4: Bank verifies land ownership and sets credit limit.\nStep 5: KCC card issued within 14 working days.",
    ),
    Scheme(
        name="PM Krishi Sinchayee Yojana (PMKSY)",
        ministry="Ministry of Agriculture and Farmers Welfare",
        description="Enhances water use efficiency and brings more cultivated area under irrigation. Promotes 'Har Khet Ko Pani' and 'More Crop Per Drop'.",
        benefit="Subsidy up to 55% for small/marginal farmers, 45% for others on drip/sprinkler micro-irrigation systems.",
        min_age=18, max_income=None, target_occupation="Farmer", target_category="All",
        state="All", scheme_type="Central",
        application_link="https://pmksy.gov.in/",
        documents_required="Aadhaar Card, Land Records, Bank Passbook, Farmer Registration",
        how_to_apply="Step 1: Register at pmksy.gov.in or visit Agriculture Department.\nStep 2: Apply for micro-irrigation subsidy.\nStep 3: Get technical survey done by agriculture officer.\nStep 4: Acquire approved drip/sprinkler system from empanelled supplier.\nStep 5: Subsidy credited to bank after installation verification.",
    ),

    # ── EDUCATION ────────────────────────────────────────────────────────────
    Scheme(
        name="PM Scholarship Scheme (CAPF)",
        ministry="Ministry of Home Affairs",
        description="Scholarships for wards of deceased/disabled Central Armed Police Forces personnel to pursue professional technical degree courses.",
        benefit="Rs. 2,500/month for boys and Rs. 3,000/month for girls for approved technical/professional courses.",
        min_age=17, max_income=None, target_occupation="Student", target_category="All",
        state="All", scheme_type="Central",
        application_link="https://scholarships.gov.in/",
        documents_required="Aadhaar, Mark sheets (10th/12th), College admissions letter, Parent's service certificate, Bank passbook",
        how_to_apply="Step 1: Register on National Scholarship Portal (scholarships.gov.in).\nStep 2: Login and fill application form under Central Schemes.\nStep 3: Upload required documents.\nStep 4: Submit before deadline.\nStep 5: Track status on NSP.",
    ),
    Scheme(
        name="National Means cum Merit Scholarship (NMMSS)",
        ministry="Ministry of Education",
        description="Scholarship for meritorious students of economically weaker sections to encourage them to continue education at secondary and higher secondary stages.",
        benefit="Rs. 12,000 per annum (Rs. 1,000/month) for Class 9 to 12 students.",
        min_age=13, max_income=150000, target_occupation="Student", target_category="All",
        state="All", scheme_type="Central",
        application_link="https://scholarships.gov.in/",
        documents_required="Aadhaar, 8th class marksheet, Income certificate, Bank passbook, School enrollment certificate",
        how_to_apply="Step 1: Appear in state-level NMMS exam in Class 8.\nStep 2: If selected, register on scholarships.gov.in.\nStep 3: Fill fresh/renewal application.\nStep 4: Get verification from school principal.\nStep 5: Submit before state deadline.",
    ),
    Scheme(
        name="Post Matric Scholarship for SC Students",
        ministry="Ministry of Social Justice and Empowerment",
        description="Financial assistance to SC students for post-matriculation education to enable them to complete their education without financial hardship.",
        benefit="Full tuition fees + maintenance allowance Rs. 380 to Rs. 1,200/month depending on course and accommodation.",
        min_age=15, max_income=250000, target_occupation="Student", target_category="SC",
        state="All", scheme_type="Central",
        application_link="https://scholarships.gov.in/",
        documents_required="Aadhaar, SC Caste certificate, Income certificate, Previous year marksheet, College fee receipt, Bank passbook",
        how_to_apply="Step 1: Apply on National Scholarship Portal after admission.\nStep 2: Upload caste certificate and income certificate.\nStep 3: Institution verifies enrollment.\nStep 4: State approves and disburses funds to bank account.",
    ),
    Scheme(
        name="PM YASASVI Scheme",
        ministry="Ministry of Social Justice and Empowerment",
        description="Top class school education support for OBC, EBC and DNT students. Scholarships for studies in the best schools in India.",
        benefit="Rs. 75,000/year for Class 9-10; Rs. 1,25,000/year for Class 11-12.",
        min_age=14, max_income=250000, target_occupation="Student", target_category="OBC",
        state="All", scheme_type="Central",
        application_link="https://yet.nta.ac.in/",
        documents_required="Aadhaar, Caste Certificate (OBC/EBC/DNT), Income Certificate, 8th/10th marksheet",
        how_to_apply="Step 1: Appear in PM YASASVI Entrance Test (YET) by NTA.\nStep 2: Register on yet.nta.ac.in.\nStep 3: If selected, apply for scholarship on NSP portal.\nStep 4: Submit documents and get school verification.\nStep 5: Scholarship disbursed annually.",
    ),

    # ── HEALTH ───────────────────────────────────────────────────────────────
    Scheme(
        name="Pradhan Mantri Suraksha Bima Yojana (PMSBY)",
        ministry="Ministry of Finance",
        description="Accidental death and disability insurance scheme for bank account holders, renewable annually.",
        benefit="Rs. 2 lakh for accidental death/total disability; Rs. 1 lakh for partial disability. Premium: Only Rs. 20/year.",
        min_age=18, max_income=None, target_occupation="All", target_category="All",
        state="All", scheme_type="Central",
        application_link="https://jansuraksha.gov.in/",
        documents_required="Aadhaar Card, Bank Account linked to Aadhaar, Mobile number",
        how_to_apply="Step 1: Visit your bank branch or use net/mobile banking.\nStep 2: Fill PMSBY enrollment form.\nStep 3: Give auto-debit consent for Rs. 20 annual premium.\nStep 4: Policy certificate received via SMS/branch.\nStep 5: Claim by submitting death/disability certificate to bank.",
    ),
    Scheme(
        name="Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)",
        ministry="Ministry of Finance",
        description="Life insurance scheme offering Rs. 2 lakh coverage for death due to any reason, renewable annually at Rs. 436/year.",
        benefit="Rs. 2 lakh life insurance coverage. Annual premium auto-debited from bank account.",
        min_age=18, max_income=None, target_occupation="All", target_category="All",
        state="All", scheme_type="Central",
        application_link="https://jansuraksha.gov.in/",
        documents_required="Aadhaar Card, Bank Account, Mobile Number",
        how_to_apply="Step 1: Visit bank branch or use banking app.\nStep 2: Fill PMJJBY enrollment form.\nStep 3: Give auto-debit consent for Rs. 436/year.\nStep 4: Submit nominee details.\nStep 5: Nominee submits death certificate and claim form for settlement.",
    ),
    Scheme(
        name="Janani Suraksha Yojana (JSY)",
        ministry="Ministry of Health and Family Welfare",
        description="Promotes institutional delivery among poor pregnant women. Cash assistance provided for delivering in government hospitals.",
        benefit="Rs. 1,400 rural / Rs. 1,000 urban for institutional delivery. ASHA also gets incentive.",
        min_age=19, max_income=None, target_occupation="All", target_category="BPL",
        state="All", scheme_type="Central",
        application_link="https://nhm.gov.in/",
        documents_required="JSY card, BPL card or Aadhaar, Delivery certificate from hospital",
        how_to_apply="Step 1: Register at nearest government health centre/ANM during pregnancy.\nStep 2: Obtain JSY card through ASHA worker.\nStep 3: Deliver at government or accredited private hospital.\nStep 4: Cash assistance paid by nurse/ASHA at hospital or credited to bank.",
    ),
    Scheme(
        name="PM TB Mukt Bharat (Nikshay Poshan Yojana)",
        ministry="Ministry of Health and Family Welfare",
        description="Nutritional support and additional diagnostic/treatment benefits to TB patients detected and notified under NIKSHAY.",
        benefit="Rs. 500/month nutritional support for entire TB treatment duration (minimum 6 months).",
        min_age=0, max_income=None, target_occupation="All", target_category="All",
        state="All", scheme_type="Central",
        application_link="https://nikshay.in/",
        documents_required="Aadhaar Card, Bank Account, TB test report from DOTS centre",
        how_to_apply="Step 1: Get diagnosed at any DOTS government TB centre.\nStep 2: Register on Nikshay portal through health worker.\nStep 3: Bank account linked in system.\nStep 4: Rs. 500/month auto-credited monthly during treatment.\nStep 5: Collect free medicines from DOTS centre.",
    ),

    # ── WOMEN & CHILDREN ─────────────────────────────────────────────────────
    Scheme(
        name="Pradhan Mantri Matru Vandana Yojana (PMMVY)",
        ministry="Ministry of Women and Child Development",
        description="Maternity benefit for pregnant women and lactating mothers for the first living child. Financial support for nutrition and health.",
        benefit="Rs. 5,000 in three installments directly to bank account. Additional Rs. 1,000 through JSY for institutional delivery.",
        min_age=19, max_income=None, target_occupation="All", target_category="All",
        state="All", scheme_type="Central",
        application_link="https://pmmvy.wcd.gov.in/",
        documents_required="Aadhaar Card, MCP card, Bank Passbook, Mobile Number",
        how_to_apply="Step 1: Register at Anganwadi Centre or approved health facility.\nStep 2: Fill Form 1-A within 150 days of pregnancy.\nStep 3: Fill Form 1-B after 6 months.\nStep 4: Fill Form 1-C after child birth and first vaccination for final installment.",
    ),
    Scheme(
        name="One Stop Centre – Sakhi",
        ministry="Ministry of Women and Child Development",
        description="Integrated support for women affected by violence — police, medical, legal and psychological support all under one roof.",
        benefit="Free shelter (up to 5 days), police assistance, legal aid, medical aid, psychological counselling.",
        min_age=18, max_income=None, target_occupation="All", target_category="Female",
        state="All", scheme_type="Central",
        application_link="https://wcd.nic.in/schemes-listing/2626",
        documents_required="No documents mandatory — any woman in distress can walk in",
        how_to_apply="Step 1: Call 181 (Women Helpline) or walk directly into nearest Sakhi Centre.\nStep 2: Case manager assesses needs.\nStep 3: Services provided including shelter, legal aid, police support.\nStep 4: Referral to rehabilitation and long-term support.",
    ),

    # ── EMPLOYMENT & SKILL ───────────────────────────────────────────────────
    Scheme(
        name="PM Kaushal Vikas Yojana (PMKVY) 4.0",
        ministry="Ministry of Skill Development and Entrepreneurship",
        description="Flagship scheme enabling youth to take up industry-relevant skill training in emerging sectors like AI, robotics, coding, drones, and soft skills.",
        benefit="Free training (2-6 months) + cash reward up to Rs. 8,000 + Government recognized NSQF-aligned certificate.",
        min_age=15, max_income=None, target_occupation="Unemployed", target_category="All",
        state="All", scheme_type="Central",
        application_link="https://www.pmkvyofficial.org/",
        documents_required="Aadhaar Card, Educational certificates, Bank Passbook, Passport photo",
        how_to_apply="Step 1: Find nearest training centre on pmkvyofficial.org.\nStep 2: Walk in and fill enrollment form.\nStep 3: Choose a skill course from 30+ sectors.\nStep 4: Complete free training (3 hours/day).\nStep 5: Appear in assessment, get certificate and cash reward.",
    ),
    Scheme(
        name="Startup India Seed Fund Scheme",
        ministry="Ministry of Commerce and Industry",
        description="Financial assistance to startups for proof of concept, prototype development, product trials, market entry and commercialization.",
        benefit="Up to Rs. 20 lakh for prototype; up to Rs. 50 lakh for market entry via grants/debt through empanelled incubators.",
        min_age=21, max_income=None, target_occupation="Self-employed", target_category="All",
        state="All", scheme_type="Central",
        application_link="https://seedfund.startupindia.gov.in/",
        documents_required="Startup India registration, Business plan, PAN, Aadhaar of founders, Financial projections",
        how_to_apply="Step 1: Register startup on startupindia.gov.in.\nStep 2: Get DPIIT recognition certificate.\nStep 3: Apply to empanelled incubator on seedfund portal.\nStep 4: Present pitch to incubator committee.\nStep 5: If selected, sign grant agreement and receive funds.",
    ),
    Scheme(
        name="PM SVANidhi (Street Vendor Loan)",
        ministry="Ministry of Housing and Urban Affairs",
        description="Collateral-free working capital loans to street vendors to restart their livelihoods.",
        benefit="Loan: Rs. 10,000 (1st) → Rs. 20,000 (2nd) → Rs. 50,000 (3rd). 7% interest subsidy. Digital payments incentivized.",
        min_age=18, max_income=None, target_occupation="Self-employed", target_category="All",
        state="All", scheme_type="Central",
        application_link="https://pmsvanidhi.mohua.gov.in/",
        documents_required="Aadhaar Card, Vendor Certificate/Letter of Recommendation from ULB, Bank Passbook, Passport photo",
        how_to_apply="Step 1: Apply online at pmsvanidhi.mohua.gov.in or through lending institution.\nStep 2: Submit Vendor Certificate from Urban Local Body.\nStep 3: Loan sanctioned by MFI/bank within 30 days.\nStep 4: Repay within 12 months via digital payments to unlock higher loan.",
    ),
    Scheme(
        name="Mahatma Gandhi NREGA (MGNREGS)",
        ministry="Ministry of Rural Development",
        description="Guarantees 100 days of unskilled wage employment per year to adult rural household members willing to do public works.",
        benefit="100 days of wage employment/year. State-specific wage rate (avg Rs. 200-300/day). Unemployment allowance if work not given.",
        min_age=18, max_income=None, target_occupation="Unemployed", target_category="All",
        state="All", scheme_type="Central",
        application_link="https://nrega.nic.in/",
        documents_required="Aadhaar Card, Bank/Post Office Account, Residence Proof, Job Card from Gram Panchayat",
        how_to_apply="Step 1: Apply for Job Card at Gram Panchayat office.\nStep 2: Job card issued within 15 days with photo.\nStep 3: Submit written work demand at least 14 days in advance.\nStep 4: Work allocated within 15 days within 5 km of village.\nStep 5: Wages paid within 15 days to bank account.",
    ),

    # ── HOUSING ──────────────────────────────────────────────────────────────
    Scheme(
        name="Pradhan Mantri Awas Yojana - Gramin (PMAY-G)",
        ministry="Ministry of Rural Development",
        description="Financial assistance to rural households to construct a pucca house with basic amenities selected through SECC database.",
        benefit="Rs. 1.2 lakh (plains) / Rs. 1.3 lakh (hills) for house + Rs. 12,000 for toilet under SBM + MGNREGS wage for labour.",
        min_age=18, max_income=None, target_occupation="All", target_category="BPL",
        state="All", scheme_type="Central",
        application_link="https://pmayg.nic.in/",
        documents_required="Aadhaar Card, SECC inclusion proof, BPL card, Bank Passbook, Land ownership documents",
        how_to_apply="Step 1: Check if your name is in SECC 2011 list at Gram Panchayat.\nStep 2: Gram Sabha selects beneficiaries.\nStep 3: District authorities verify and approve.\nStep 4: Funds released in 3 installments based on construction stage.\nStep 5: Construction monitored via geotagged photos.",
    ),
    Scheme(
        name="PM Vishwakarma Scheme",
        ministry="Ministry of MSME",
        description="End-to-end support for artisans and craftspeople in 18 traditional trades (carpenter, blacksmith, potter, cobbler, tailor, etc.).",
        benefit="Rs. 15,000 toolkit grant + business loan: Rs. 1 lakh (1st), Rs. 2 lakh (2nd) at 5% + free skill training with stipend.",
        min_age=18, max_income=None, target_occupation="Self-employed", target_category="All",
        state="All", scheme_type="Central",
        application_link="https://pmvishwakarma.gov.in/",
        documents_required="Aadhaar Card, Mobile linked to Aadhaar, Ration Card, Caste certificate (if applicable), Bank Passbook",
        how_to_apply="Step 1: Register at nearest CSC (Common Service Centre).\nStep 2: Aadhaar biometric verification.\nStep 3: Select your trade from 18 eligible trades.\nStep 4: Gram Panchayat/ULB verification done.\nStep 5: PM Vishwakarma certificate issued.\nStep 6: Apply for skill training, toolkit grant, and loan online.",
    ),

    # ── FINANCE & BANKING ────────────────────────────────────────────────────
    Scheme(
        name="PM Mudra Yojana (PMMY)",
        ministry="Ministry of Finance",
        description="Business loans up to Rs. 10 lakh for small/micro non-farm businesses without collateral. Three tiers: Shishu, Kishore, Tarun.",
        benefit="Shishu: Up to Rs. 50,000 | Kishore: Rs. 50,001-5 lakh | Tarun: Rs. 5-10 lakh. No processing fee. Mudra card provided.",
        min_age=18, max_income=None, target_occupation="Self-employed", target_category="All",
        state="All", scheme_type="Central",
        application_link="https://www.mudra.org.in/",
        documents_required="Aadhaar, PAN, Business proof/plan, Address proof, Passport photos, 6-month bank statement",
        how_to_apply="Step 1: Prepare business plan or funding requirement.\nStep 2: Visit any bank, RRB, MFI or NBFC.\nStep 3: Fill Mudra loan application and submit documents.\nStep 4: Loan sanctioned within 7-14 working days.\nStep 5: Mudra RuPay card issued for working capital.",
    ),
    Scheme(
        name="Stand Up India Scheme",
        ministry="Ministry of Finance",
        description="Bank loans from Rs. 10 lakh to Rs. 1 crore for SC/ST and women entrepreneurs setting up greenfield enterprises.",
        benefit="Composite loan Rs. 10 lakh to Rs. 1 crore for first-time business owners. 7-year repayment. Handholding support.",
        min_age=18, max_income=None, target_occupation="Self-employed", target_category="SC",
        state="All", scheme_type="Central",
        application_link="https://www.standupmitra.in/",
        documents_required="Aadhaar, PAN, Caste certificate (SC/ST) or gender proof, Business plan, Bank statements",
        how_to_apply="Step 1: Register on standupmitra.in.\nStep 2: Connect with SIDBI handholding agencies if needed.\nStep 3: Apply to nearest bank branch.\nStep 4: Bank assesses business plan.\nStep 5: Loan disbursed in tranches based on progress.",
    ),

    # ── DISABILITY ───────────────────────────────────────────────────────────
    Scheme(
        name="Unique Disability ID (UDID) Card",
        ministry="Ministry of Social Justice and Empowerment",
        description="A universal disability card for Divyang persons to access all disability benefits and entitlements across India.",
        benefit="One-stop card valid pan-India. 80% rail concession. Priority in government services. Gateway to all disability schemes.",
        min_age=0, max_income=None, target_occupation="All", target_category="All",
        state="All", scheme_type="Central",
        application_link="https://www.swavlambancard.gov.in/",
        documents_required="Aadhaar Card, Medical Certificate from government doctor, Passport photo, Address proof",
        how_to_apply="Step 1: Apply at swavlambancard.gov.in or DDRC office.\nStep 2: Fill form with disability details.\nStep 3: CMO/government medical authority examines and certifies disability type and percentage.\nStep 4: UDID card generated and sent by post within 30 days.",
    ),
    Scheme(
        name="Assistance to Disabled Persons (ADIP) Scheme",
        ministry="Ministry of Social Justice and Empowerment",
        description="Provides free, modern assistive devices to disabled persons from low-income families.",
        benefit="Free wheelchairs, hearing aids, prosthetic limbs, tricycles, Braille kits, smart phones for blind persons.",
        min_age=0, max_income=20000, target_occupation="All", target_category="All",
        state="All", scheme_type="Central",
        application_link="https://alimco.in/adip.aspx",
        documents_required="Disability Certificate, Income Certificate, Aadhaar, Passport photo",
        how_to_apply="Step 1: Contact nearest Social Welfare office or ALIMCO.\nStep 2: Fill application with disability and income details.\nStep 3: Medical verification of device requirement.\nStep 4: Devices distributed through ALIMCO camps.",
    ),

    # ── SENIOR CITIZENS ───────────────────────────────────────────────────────
    Scheme(
        name="PM Vaya Vandana Yojana (PMVVY)",
        ministry="Ministry of Finance",
        description="Pension scheme for senior citizens operated by LIC, providing assured monthly pension at 7.4% guaranteed return.",
        benefit="Assured pension of 7.4% p.a. Max investment Rs. 15 lakh. Monthly pension Rs. 1,000 to Rs. 9,250.",
        min_age=60, max_income=None, target_occupation="Retired", target_category="All",
        state="All", scheme_type="Central",
        application_link="https://licindia.in/",
        documents_required="Aadhaar Card, Age proof, Bank Passbook, PAN Card, Passport photo",
        how_to_apply="Step 1: Visit LIC branch or apply online at licindia.in.\nStep 2: Fill PMVVY proposal form.\nStep 3: Choose pension frequency.\nStep 4: Pay up to Rs. 15 lakh as purchase price.\nStep 5: Policy and pension start from chosen date.",
    ),
    Scheme(
        name="Indira Gandhi National Old Age Pension Scheme (IGNOAPS)",
        ministry="Ministry of Rural Development",
        description="Social protection for poor elderly persons aged 60+ who are destitute and below poverty line.",
        benefit="Rs. 200/month for 60-79 age; Rs. 500/month for 80+ years. States add their contribution.",
        min_age=60, max_income=None, target_occupation="All", target_category="BPL",
        state="All", scheme_type="Central",
        application_link="https://nsap.nic.in/",
        documents_required="Aadhaar Card, Age Proof, BPL Card, Bank Passbook, Passport photo",
        how_to_apply="Step 1: Apply at Gram Panchayat or Urban Local Body office.\nStep 2: Submit age and BPL documentation.\nStep 3: Gram Sabha or ULB verifies and forwards to district.\nStep 4: Pension credited monthly to bank account.",
    ),

    # ── STATE-SPECIFIC ────────────────────────────────────────────────────────
    Scheme(
        name="Mukhyamantri Ladki Bahin Yojana",
        ministry="Maharashtra State Government",
        description="Monthly financial assistance to women from economically weaker sections in Maharashtra to promote financial independence.",
        benefit="Rs. 1,500/month directly credited to bank account of eligible women.",
        min_age=21, max_income=250000, target_occupation="All", target_category="All",
        state="Maharashtra", scheme_type="State",
        application_link="https://ladakibahin.maharashtra.gov.in/",
        documents_required="Aadhaar Card, Ration card, Income certificate, Domicile certificate, Bank passbook",
        how_to_apply="Step 1: Apply at Anganwadi centre or online at ladakibahin.maharashtra.gov.in.\nStep 2: Upload ration card and income certificate.\nStep 3: Aadhaar authentication done.\nStep 4: Rs. 1,500 credited monthly to bank account.",
    ),
    Scheme(
        name="Kalia Yojana",
        ministry="Odisha State Government",
        description="Krushak Assistance for Livelihood and Income Augmentation for small, marginal and landless farmers in Odisha.",
        benefit="Rs. 4,000/season (Kharif + Rabi) = Rs. 8,000/year + Rs. 10,000 for vulnerable cultivators once a year.",
        min_age=18, max_income=None, target_occupation="Farmer", target_category="All",
        state="Odisha", scheme_type="State",
        application_link="https://kalia.odisha.gov.in/",
        documents_required="Aadhaar Card, Bank Account linked to Aadhaar, Land records, Farmer registration",
        how_to_apply="Step 1: Register on kalia.odisha.gov.in or at CSC/Gram Panchayat.\nStep 2: Provide land records or landless farmer declaration.\nStep 3: Aadhaar verification done.\nStep 4: Financial assistance credited through DBT.",
    ),
    Scheme(
        name="Rythu Bandhu Scheme",
        ministry="Telangana State Government",
        description="Investment support to farmers in Telangana — direct financial aid per acre to buy seeds, fertilizers and meet farming needs.",
        benefit="Rs. 10,000 per acre per year (Rs. 5,000 per crop season). No upper limit on land holding.",
        min_age=18, max_income=None, target_occupation="Farmer", target_category="All",
        state="Telangana", scheme_type="State",
        application_link="https://rythubandhu.telangana.gov.in/",
        documents_required="Pattadar passbook (land records), Aadhaar, Bank Account",
        how_to_apply="Step 1: Ensure land records (pattadar) are updated in Dharani portal.\nStep 2: Aadhaar seeded to land records.\nStep 3: Benefits auto-credited before each crop season — no separate application needed.",
    ),
    Scheme(
        name="Jai Bhim Mukhyamantri Pratibha Vikas Yojana",
        ministry="Delhi State Government",
        description="Free coaching for SC/ST students for competitive exams like UPSC, SSC, Banks, IIT-JEE, NEET, CA etc.",
        benefit="Free coaching worth up to Rs. 1 lakh + Rs. 2,500/month stipend + Rs. 1,000 for special preparation.",
        min_age=18, max_income=200000, target_occupation="Student", target_category="SC",
        state="Delhi", scheme_type="State",
        application_link="https://edistrict.delhigovt.nic.in/",
        documents_required="Aadhaar, SC/ST certificate, 10th/12th marksheets, Income certificate, Delhi domicile proof",
        how_to_apply="Step 1: Apply on edistrict.delhigovt.nic.in portal.\nStep 2: Select coaching institute from government-approved list.\nStep 3: Attach caste certificate and income proof.\nStep 4: Eligible students admitted to coaching.\nStep 5: Monthly stipend credited to bank account.",
    ),
    Scheme(
        name="Mukhyamantri Mahila Utkarsh Yojana",
        ministry="Gujarat State Government",
        description="Interest-free loans to women self-help groups (SHGs) in Gujarat for livelihood enhancement and entrepreneurship.",
        benefit="Interest-free loan of Rs. 1 lakh per SHG member. No collateral required.",
        min_age=18, max_income=None, target_occupation="Self-employed", target_category="All",
        state="Gujarat", scheme_type="State",
        application_link="https://sje.gujarat.gov.in/",
        documents_required="Aadhaar Card, SHG membership certificate, Bank passbook, Passport photo",
        how_to_apply="Step 1: Join a registered SHG or SEWA group.\nStep 2: Group applies collectively through district rural development agency.\nStep 3: Bank account of SHG receives interest-free loan.\nStep 4: Members use their share for livelihood.",
    ),
    Scheme(
        name="PM Gramin Digital Saksharta Abhiyan (PMGDISHA)",
        ministry="Ministry of Electronics and IT",
        description="Makes rural households digitally literate to operate computers, smartphones and access government e-services and digital payments.",
        benefit="Free 20-hour digital literacy training, government certification, access to e-governance services.",
        min_age=14, max_income=None, target_occupation="All", target_category="All",
        state="All", scheme_type="Central",
        application_link="https://www.pmgdisha.in/",
        documents_required="Aadhaar Card, Mobile Number",
        how_to_apply="Step 1: Register at pmgdisha.in or contact nearest CSC.\nStep 2: Enroll for 20-hour training.\nStep 3: Training covers internet, digital payments, and e-services.\nStep 4: Appear in online assessment.\nStep 5: Digital Saksharta certificate issued on passing.",
    ),
    Scheme(
        name="National Social Assistance Programme (NSAP) – Widow Pension",
        ministry="Ministry of Rural Development",
        description="Financial support to widows who are BPL and have little or no support from family or other sources.",
        benefit="Rs. 300/month for 40-79 years; Rs. 500/month for 80+ years from central govt. States add additional amounts.",
        min_age=40, max_income=None, target_occupation="All", target_category="BPL",
        state="All", scheme_type="Central",
        application_link="https://nsap.nic.in/",
        documents_required="Aadhaar Card, Husband's death certificate, Age proof, BPL card, Bank passbook",
        how_to_apply="Step 1: Apply at Gram Panchayat or Municipal office with death certificate.\nStep 2: Document verification by local authority.\nStep 3: District officer approves.\nStep 4: Monthly pension credited to bank account.",
    ),
    Scheme(
        name="PM Ujjwala Yojana 2.0 (PMUY)",
        ministry="Ministry of Petroleum and Natural Gas",
        description="Provides LPG connections to BPL households especially women to protect health and reduce indoor air pollution caused by burning biomass.",
        benefit="Free LPG connection with first cylinder + regulator free. EMI-based stove also available. Subsidy on refills.",
        min_age=18, max_income=None, target_occupation="All", target_category="BPL",
        state="All", scheme_type="Central",
        application_link="https://pmuy.gov.in/",
        documents_required="Aadhaar Card, BPL ration card, Bank passbook, Address proof, Passport size photo",
        how_to_apply="Step 1: Visit nearest LPG distributor or apply online on pmuy.gov.in.\nStep 2: Fill PMUY application form.\nStep 3: Submit BPL card and Aadhaar.\nStep 4: LPG connection issued free within 7 days.\nStep 5: First refill at subsidized rate.",
    ),
]


def seed_new():
    db = SessionLocal()
    try:
        existing_names = {row[0] for row in db.query(Scheme.name).all()}
        to_add = [s for s in NEW_SCHEMES if s.name not in existing_names]

        if not to_add:
            print("All schemes already in database. Nothing new to add.")
            return

        db.add_all(to_add)
        db.commit()
        print(f"\nSuccessfully added {len(to_add)} new schemes!")
        print(f"Skipped {len(NEW_SCHEMES) - len(to_add)} already-existing schemes.")
        print("\nSchemes added:")
        for s in to_add:
            print(f"  + {s.name}")
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_new()
