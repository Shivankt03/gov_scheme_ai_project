from sqlalchemy.orm import Session
from ..models import User, Profile, Scheme


def check_eligibility(user_data: dict, criteria: dict) -> bool:
    """
    Check if the user meets the eligibility criteria for a government scheme.

    Parameters:
    - user_data (dict): A dictionary containing user information such as age, income, etc.
    - criteria (dict): A dictionary containing the eligibility criteria for the scheme.

    Returns:
    - bool: True if the user is eligible, False otherwise.
    """
    for key, value in criteria.items():
        if key not in user_data or user_data[key] < value:
            return False
    return True


def get_eligible_schemes(user_data: dict, schemes: list) -> list:
    """
    Get a list of schemes for which the user is eligible.

    Parameters:
    - user_data (dict): A dictionary containing user information.
    - schemes (list): A list of schemes with their eligibility criteria.

    Returns:
    - list: A list of eligible schemes.
    """
    eligible_schemes = []
    for scheme in schemes:
        if check_eligibility(user_data, scheme['criteria']):
            eligible_schemes.append(scheme['name'])
    return eligible_schemes


def check_user_eligibility_for_scheme(db: Session, user_id: int, scheme_id: int) -> dict:
    """
    Check if a user is eligible for a specific scheme based on their profile.
    
    Returns a dict with eligibility result and reasons.
    """
    user = db.query(User).filter(User.id == user_id).first()
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    scheme = db.query(Scheme).filter(Scheme.id == scheme_id).first()

    if not user or not profile or not scheme:
        return {"eligible": False, "reason": "User, profile, or scheme not found"}

    reasons = []

    # Check age eligibility
    if scheme.min_age and profile.age and profile.age < scheme.min_age:
        reasons.append(f"Minimum age required: {scheme.min_age}, your age: {profile.age}")

    # Check income eligibility
    if scheme.max_income and profile.income and profile.income > scheme.max_income:
        reasons.append(f"Maximum income allowed: {scheme.max_income}, your income: {profile.income}")

    # Check occupation
    if scheme.target_occupation and profile.occupation:
        if scheme.target_occupation.lower() != profile.occupation.lower():
            reasons.append(f"Target occupation: {scheme.target_occupation}, your occupation: {profile.occupation}")

    # Check category
    if scheme.target_category and profile.category:
        if scheme.target_category.lower() != profile.category.lower():
            reasons.append(f"Target category: {scheme.target_category}, your category: {profile.category}")

    # Check state
    if scheme.state and profile.state:
        if scheme.state.lower() != "all" and scheme.state.lower() != profile.state.lower():
            reasons.append(f"Scheme available in: {scheme.state}, your state: {profile.state}")

    if reasons:
        return {"eligible": False, "reasons": reasons}
    
    return {"eligible": True, "reasons": ["You meet all eligibility criteria!"]}
