from typing import List, Dict
from sqlalchemy.orm import Session
from ..models import User, Profile, Scheme


class RecommendationEngine:
    """AI-powered scheme recommendation engine with confidence scoring."""

    def __init__(self, user_profile: Dict):
        self.user_profile = user_profile

    def recommend_schemes(self, available_schemes: List[Dict]) -> List[Dict]:
        """
        Recommend schemes with confidence scores and explanations.
        Returns schemes sorted by score (highest first).
        """
        scored_schemes = []
        for scheme in available_schemes:
            result = self.score_scheme(scheme)
            # Include schemes as long as they aren't explicitly rejected (score 0)
            if result['score'] > 0.0:
                scheme_with_score = {**scheme, **result}
                scored_schemes.append(scheme_with_score)

        # Sort by score descending
        scored_schemes.sort(key=lambda x: x['score'], reverse=True)
        return scored_schemes

    def score_scheme(self, scheme: Dict) -> Dict:
        """
        Score a scheme against the user's profile.
        Returns: {'score': float, 'reasons': list, 'match_level': str}
        """
        profile = self.user_profile
        matched = []
        failed = []
        warnings = []
        total_criteria = 0

        # --- Age ---
        if scheme.get('min_age'):
            total_criteria += 1
            user_age = profile.get('age', 0)
            if user_age and user_age >= scheme['min_age']:
                matched.append(f"✅ Age {user_age} meets minimum age {scheme['min_age']}")
            elif user_age:
                failed.append(f"❌ Your age ({user_age}) is below minimum ({scheme['min_age']})")
            else:
                warnings.append(f"⚠️ Age not provided — min age required: {scheme['min_age']}")

        # --- Income ---
        if scheme.get('max_income'):
            total_criteria += 1
            user_income = profile.get('income', 0)
            if user_income is not None and user_income <= scheme['max_income']:
                matched.append(f"✅ Income ₹{user_income:,} is within ₹{scheme['max_income']:,} limit")
            elif user_income:
                failed.append(f"❌ Income ₹{user_income:,} exceeds ₹{scheme['max_income']:,} limit")
            else:
                warnings.append(f"⚠️ Income not provided — max income: ₹{scheme['max_income']:,}")

        # --- Occupation ---
        schema_occ = scheme.get('target_occupation')
        if schema_occ and schema_occ.lower() != 'all':
            total_criteria += 1
            user_occ = profile.get('occupation', '')
            if user_occ and user_occ.lower() == schema_occ.lower():
                matched.append(f"✅ You are a {user_occ} — this scheme targets {schema_occ}s")
            elif user_occ:
                failed.append(f"❌ Scheme is for {schema_occ}s, you are a {user_occ}")
            else:
                warnings.append(f"⚠️ Occupation not set — scheme targets {schema_occ}s")
        elif schema_occ and schema_occ.lower() == 'all':
            matched.append("✅ Open to all occupations")

        # --- Category ---
        schema_cat = scheme.get('target_category')
        if schema_cat and schema_cat.lower() != 'all':
            total_criteria += 1
            user_cat = profile.get('category', '')
            if user_cat and user_cat.lower() == schema_cat.lower():
                matched.append(f"✅ Category {user_cat} matches target {schema_cat}")
            elif user_cat:
                failed.append(f"❌ Scheme targets {schema_cat}, you are {user_cat}")
            else:
                warnings.append(f"⚠️ Category not set — scheme targets {schema_cat}")
        elif schema_cat and schema_cat.lower() == 'all':
            matched.append("✅ Open to all social categories")

        # --- State ---
        if scheme.get('state') and scheme['state'].lower() != 'all':
            total_criteria += 1
            user_state = profile.get('state', '')
            if user_state and user_state.lower() == scheme['state'].lower():
                matched.append(f"✅ Available in your state ({user_state})")
            elif user_state:
                # State mismatch is a hard failure
                return {'score': 0, 'match_level': 'No Match', 'reasons': [f"❌ Only in {scheme['state']}, you are in {user_state}"]}
            else:
                warnings.append(f"⚠️ State not set — scheme is for {scheme['state']}")
        elif scheme.get('state') and scheme['state'].lower() == 'all':
            matched.append("✅ Available in all states")

        # --- Base Constraints (Hard failures) ---
        if failed:
            # If any strict criteria like age, income or occupation explicitly failed
            raw = len(matched) - (len(failed) * 2) + len(warnings) * 0.3
            score = max(0, min(1.0, raw / max(total_criteria, 1)))
            # If income or age is explicitly violated, we heavily penalize or zero it out
            for f in failed:
                if "exceeds" in f or "below minimum" in f:
                    return {'score': 0, 'match_level': 'No Match', 'reasons': failed + matched + warnings}
        else:
            # No hard failures
            if total_criteria == 0:
                score = 0.8  # No criteria = likely open to all
                matched.append("✅ No specific restrictions — open to all eligible citizens")
            else:
                # Weighted: matches +1, warnings +0.3
                raw = len(matched) + len(warnings) * 0.3
                score = max(0, min(1.0, raw / max(total_criteria, 1)))

        score = round(score, 2)

        # Determine match level
        if score >= 0.8:
            match_level = "Excellent Match"
        elif score >= 0.6:
            match_level = "Good Match"
        elif score >= 0.4:
            match_level = "Partial Match"
        else:
            match_level = "Info Required"

        reasons = matched + warnings + failed

        return {
            'score': score,
            'match_level': match_level,
            'reasons': reasons,
        }


def get_recommendations_for_user(db: Session, user_id: int) -> List[Dict]:
    """
    Get scored scheme recommendations for a user from the database.
    Returns schemes sorted by relevance with confidence scores and explanations.
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
