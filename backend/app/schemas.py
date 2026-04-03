from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime


# ========================
# AUTH SCHEMAS
# ========================

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None


# ========================
# USER SCHEMAS
# ========================

class UserBase(BaseModel):
    name: str
    email: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None

class UserResponse(UserBase):
    id: int
    role: str = "user"

    class Config:
        from_attributes = True


# ========================
# PROFILE SCHEMAS
# ========================

class ProfileCreate(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    income: Optional[int] = None
    state: Optional[str] = None
    category: Optional[str] = None
    occupation: Optional[str] = None
    education: Optional[str] = None
    is_farmer: Optional[bool] = False
    land_size: Optional[float] = None
    disability: Optional[bool] = False

class ProfileUpdate(ProfileCreate):
    """Same fields as ProfileCreate, all optional for partial updates."""
    pass

class ProfileResponse(ProfileCreate):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class UserWithProfile(UserBase):
    id: int
    role: str
    profile: Optional[ProfileResponse] = None

    class Config:
        from_attributes = True


# ========================
# SCHEME SCHEMAS
# ========================

class SchemeBase(BaseModel):
    name: str
    description: str

class SchemeCreate(BaseModel):
    name: str
    ministry: Optional[str] = None
    description: str
    min_age: Optional[int] = None
    max_income: Optional[int] = None
    target_occupation: Optional[str] = None
    target_category: Optional[str] = None
    state: Optional[str] = None
    benefit: Optional[str] = None
    application_link: Optional[str] = None

class SchemeUpdate(BaseModel):
    name: Optional[str] = None
    ministry: Optional[str] = None
    description: Optional[str] = None
    min_age: Optional[int] = None
    max_income: Optional[int] = None
    target_occupation: Optional[str] = None
    target_category: Optional[str] = None
    state: Optional[str] = None
    benefit: Optional[str] = None
    application_link: Optional[str] = None

class SchemeResponse(BaseModel):
    id: int
    name: str
    ministry: Optional[str] = None
    description: Optional[str] = None
    min_age: Optional[int] = None
    max_income: Optional[int] = None
    target_occupation: Optional[str] = None
    target_category: Optional[str] = None
    state: Optional[str] = None
    benefit: Optional[str] = None
    application_link: Optional[str] = None

    class Config:
        from_attributes = True


# ========================
# APPLICATION SCHEMAS
# ========================

class ApplicationCreate(BaseModel):
    scheme_id: int

class ApplicationTrackingUpdate(BaseModel):
    tracking_id: Optional[str] = None
    tracking_link: Optional[str] = None

class ApplicationResponse(BaseModel):
    id: int
    user_id: int
    scheme_id: int
    status: str
    tracking_id: Optional[str] = None
    tracking_link: Optional[str] = None
    application_date: Optional[datetime] = None
    scheme: Optional[SchemeResponse] = None

    class Config:
        from_attributes = True


# ========================
# ELIGIBILITY SCHEMAS
# ========================

class EligibilityRequest(BaseModel):
    user_id: int
    scheme_id: int

class EligibilityResponse(BaseModel):
    eligible: bool
    score: float
    reasons: List[str]
    scheme: Optional[SchemeResponse] = None


# ========================
# RECOMMENDATION SCHEMAS
# ========================

class RecommendationResponse(BaseModel):
    id: int
    name: str
    ministry: Optional[str] = None
    description: Optional[str] = None
    benefit: Optional[str] = None
    application_link: Optional[str] = None
    state: Optional[str] = None
    score: float = 0.0
    match_level: str = "Low Match"
    reasons: List[str] = []
