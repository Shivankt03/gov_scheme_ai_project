from typing import List, Dict
from sqlalchemy.orm import Session
from ..models import User, Profile, Scheme


class RecommendationEngine:
    def __init__(self, user_profile: Dict):
        self.user_profile = user_profile

    def recommend_schemes(self, available_schemes: List[Dict]) -> List[Dict]:
        """
        Recommend schemes based on the user's profile and available schemes.
        Uses a simple matching algorithm.
        """
        recommended_schemes = []
        for scheme in available_schemes:
            if self.is_relevant(scheme):
                recommended_schemes.append(scheme)
        return recommended_schemes

    def is_relevant(self, scheme: Dict) -> bool:
        """
        Determine if the scheme is relevant to the user's profile.
        Checks age, income, occupation, and other attributes against the scheme's criteria.
        """
        profile = self.user_profile

        # Check age
        if 'min_age' in scheme and scheme['min_age']:
            if profile.get('age', 0) < scheme['min_age']:
                return False

        # Check income
        if 'max_income' in scheme and scheme['max_income']:
            if profile.get('income', 0) > scheme['max_income']:
                return False

        # Check occupation
        if 'target_occupation' in scheme and scheme['target_occupation']:
            if profile.get('occupation', '').lower() != scheme['target_occupation'].lower():
                return False

        # Check category
        if 'target_category' in scheme and scheme['target_category']:
            if profile.get('category', '').lower() != scheme['target_category'].lower():
                return False

        # Check state
        if 'state' in scheme and scheme['state']:
            if scheme['state'].lower() != 'all' and profile.get('state', '').lower() != scheme['state'].lower():
                return False

        return True


def get_recommendations_for_user(db: Session, user_id: int) -> List[Dict]:
    """
    Get scheme recommendations for a user from the database.
    """
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if not profile:
        return []

    user_data = {
        'age': profile.age,
        'income': profile.income,
        'state': profile.state,
        'category': profile.category,
        'occupation': profile.occupation,
        'education': profile.education,
        'is_farmer': profile.is_farmer,
        'disability': profile.disability,
    }

    schemes = db.query(Scheme).all()
    scheme_list = [
        {
            'id': s.id,
            'name': s.name,
            'description': s.description,
            'ministry': s.ministry,
            'min_age': s.min_age,
            'max_income': s.max_income,
            'target_occupation': s.target_occupation,
            'target_category': s.target_category,
            'state': s.state,
            'benefit': s.benefit,
            'application_link': s.application_link,
        }
        for s in schemes
    ]

    engine = RecommendationEngine(user_data)
    return engine.recommend_schemes(scheme_list)
