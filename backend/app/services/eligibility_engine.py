from sqlalchemy.orm import Session
from ..models import User, Profile, Scheme


def check_eligibility(user_data: dict, criteria: dict) -> bool:
    """Basic dict-based eligibility check."""
    for key, value in criteria.items():
        if key not in user_data or user_data[key] < value:
            return False
    return True


def get_eligible_schemes(user_data: dict, schemes: list) -> list:
    """Get a list of scheme names for which the user is eligible."""
    eligible_schemes = []
    for scheme in schemes:
        if check_eligibility(user_data, scheme['criteria']):
            eligible_schemes.append(scheme['name'])
    return eligible_schemes


def check_user_eligibility_for_scheme(db: Session, user_id: int, scheme_id: int) -> dict:
    """
    Check if a user is eligible for a specific scheme with confidence score and explanations.
    
    Returns:
        dict with: eligible (bool), score (float 0-1), reasons (list of explanation strings)
    """
    user = db.query(User).filter(User.id == user_id).first()
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    scheme = db.query(Scheme).filter(Scheme.id == scheme_id).first()

    if not user:
        return {"eligible": False, "score": 0.0, "reasons": ["❌ User not found"]}
    if not scheme:
        return {"eligible": False, "score": 0.0, "reasons": ["❌ Scheme not found"]}
    if not profile:
        return {"eligible": False, "score": 0.0, "reasons": [
            "❌ Profile not found — please fill your profile first",
            "⚠️ We need your age, income, state, occupation, and category to check eligibility"
        ]}

    matched = []      # ✅ criteria the user meets
    failed = []       # ❌ criteria the user fails
    warnings = []     # ⚠️ info/tips
    total_criteria = 0

    # --- Age Check ---
    if scheme.min_age:
        total_criteria += 1
        if profile.age:
            if profile.age >= scheme.min_age:
                matched.append(f"✅ Age {profile.age} meets minimum age requirement of {scheme.min_age}")
            else:
                failed.append(f"❌ Your age ({profile.age}) is below the minimum required age ({scheme.min_age})")
        else:
            warnings.append(f"⚠️ Age not provided — this scheme requires minimum age {scheme.min_age}")

    # --- Income Check ---
    if scheme.max_income:
        total_criteria += 1
        if profile.income is not None:
            if profile.income <= scheme.max_income:
                matched.append(f"✅ Income ₹{profile.income:,} is within the ₹{scheme.max_income:,} limit")
            else:
                failed.append(f"❌ Your income (₹{profile.income:,}) exceeds the maximum limit (₹{scheme.max_income:,})")
        else:
            warnings.append(f"⚠️ Income not provided — this scheme has a max income limit of ₹{scheme.max_income:,}")

    # --- Occupation Check ---
    if scheme.target_occupation:
        total_criteria += 1
        if profile.occupation:
            if scheme.target_occupation.lower() == profile.occupation.lower():
                matched.append(f"✅ You are a {profile.occupation} — this scheme targets {scheme.target_occupation}s")
            else:
                failed.append(f"❌ This scheme is for {scheme.target_occupation}s, your occupation is {profile.occupation}")
        else:
            warnings.append(f"⚠️ Occupation not provided — this scheme targets {scheme.target_occupation}s")

    # --- Category Check ---
    if scheme.target_category:
        total_criteria += 1
        if profile.category:
            if scheme.target_category.lower() == profile.category.lower():
                matched.append(f"✅ Your category ({profile.category}) matches the target category ({scheme.target_category})")
            else:
                failed.append(f"❌ This scheme is for {scheme.target_category} category, you belong to {profile.category}")
        else:
            warnings.append(f"⚠️ Category not provided — this scheme targets {scheme.target_category} category")

    # --- State Check ---
    if scheme.state and scheme.state.lower() != "all":
        total_criteria += 1
        if profile.state:
            if scheme.state.lower() == profile.state.lower():
                matched.append(f"✅ You are in {profile.state} — this scheme is available in {scheme.state}")
            else:
                failed.append(f"❌ This scheme is only available in {scheme.state}, you are in {profile.state}")
        else:
            warnings.append(f"⚠️ State not provided — this scheme is available in {scheme.state}")
    elif scheme.state and scheme.state.lower() == "all":
        matched.append("✅ This scheme is available in all states")

    # --- Farmer-specific ---
    if scheme.target_occupation and scheme.target_occupation.lower() == "farmer":
        if profile.is_farmer:
            matched.append("✅ You are registered as a farmer")
        else:
            warnings.append("⚠️ This scheme targets farmers — ensure you have valid farmer documentation")

        if profile.land_size and profile.land_size > 0:
            matched.append(f"✅ Land size: {profile.land_size} acres registered")
        elif scheme.target_occupation.lower() == "farmer":
            warnings.append("⚠️ Land ownership documents may be required for verification")

    # --- Disability benefit ---
    if profile.disability:
        warnings.append("ℹ️ You have a disability — you may qualify for additional benefits under this scheme")

    # --- Calculate confidence score ---
    if total_criteria == 0:
        # No specific criteria on the scheme — everyone is eligible
        score = 1.0
        matched.append("✅ This scheme has no specific eligibility restrictions")
    else:
        score = len(matched) / (len(matched) + len(failed) + len(warnings) * 0.5) if (matched or failed or warnings) else 0.0
        score = round(min(score, 1.0), 2)

    is_eligible = len(failed) == 0

    # Build combined reasons list: ✅ first, then ⚠️, then ❌
    reasons = matched + warnings + failed

    if is_eligible and not reasons:
        reasons = ["✅ You meet all eligibility criteria for this scheme!"]

    return {
        "eligible": is_eligible,
        "score": score,
        "reasons": reasons,
    }
