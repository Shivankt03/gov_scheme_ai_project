from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session, joinedload
from datetime import timedelta
import uuid

from ..database import get_db
from ..models import User as UserModel, Profile as ProfileModel, Application as ApplicationModel, Scheme as SchemeModel
from .. import schemas
from ..auth import (
    get_password_hash,
    authenticate_user,
    create_access_token,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)
from ..services.recommendation_engine import get_recommendations_for_user

router = APIRouter()


# ========================
# AUTH ENDPOINTS
# ========================

@router.post("/register", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Register a new user with hashed password."""
    db_user = db.query(UserModel).filter(UserModel.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = UserModel(name=user.name, email=user.email, password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Login with email and password, returns JWT token."""
    user = authenticate_user(db, email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=schemas.UserResponse)
def get_current_user_info(current_user: UserModel = Depends(get_current_user)):
    """Get current logged-in user's info."""
    return current_user


# ========================
# PROFILE ENDPOINTS
# ========================

@router.post("/profile", response_model=schemas.ProfileResponse)
def create_profile(
    profile: schemas.ProfileCreate,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a profile for the logged-in user."""
    existing = db.query(ProfileModel).filter(ProfileModel.user_id == current_user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Profile already exists. Use PUT to update.")
    
    new_profile = ProfileModel(user_id=current_user.id, **profile.model_dump())
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    return new_profile


@router.get("/profile/me", response_model=schemas.UserWithProfile)
def get_my_profile(
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get the logged-in user's profile with all details."""
    return current_user


@router.put("/profile/me", response_model=schemas.ProfileResponse)
def update_my_profile(
    profile: schemas.ProfileUpdate,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update the logged-in user's profile."""
    db_profile = db.query(ProfileModel).filter(ProfileModel.user_id == current_user.id).first()
    if not db_profile:
        raise HTTPException(status_code=404, detail="Profile not found. Create one first via POST /profile.")
    
    for key, value in profile.model_dump(exclude_unset=True).items():
        setattr(db_profile, key, value)
    db.commit()
    db.refresh(db_profile)
    return db_profile


# ========================
# RECOMMENDATIONS
# ========================

@router.get("/recommendations", response_model=list[schemas.RecommendationResponse])
def get_recommendations(
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get AI-powered scheme recommendations for the logged-in user."""
    recommendations = get_recommendations_for_user(db, current_user.id)
    if not recommendations:
        raise HTTPException(status_code=404, detail="No recommendations found. Please fill your profile first.")
    return recommendations


# ========================
# APPLICATION ENDPOINTS
# ========================

@router.post("/apply/{scheme_id}", response_model=schemas.ApplicationResponse)
def apply_for_scheme(
    scheme_id: int,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Apply for a government scheme."""
    scheme = db.query(SchemeModel).filter(SchemeModel.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    
    # Check if already applied
    existing = db.query(ApplicationModel).filter(
        ApplicationModel.user_id == current_user.id,
        ApplicationModel.scheme_id == scheme_id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already applied for this scheme")
    
    tracking_id = f"GOV-{uuid.uuid4().hex[:8].upper()}"
    application = ApplicationModel(
        user_id=current_user.id,
        scheme_id=scheme_id,
        tracking_id=tracking_id,
        status="Applied",
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return application


@router.get("/applications", response_model=list[schemas.ApplicationResponse])
def get_my_applications(
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all applications for the logged-in user with scheme details."""
    applications = (
        db.query(ApplicationModel)
        .options(joinedload(ApplicationModel.scheme))
        .filter(ApplicationModel.user_id == current_user.id)
        .all()
    )
    return applications


@router.put("/applications/{app_id}/tracking", response_model=schemas.ApplicationResponse)
def update_application_tracking(
    app_id: int,
    tracking_data: schemas.ApplicationTrackingUpdate,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update tracking ID and tracking link for an application after applying on the govt website."""
    application = (
        db.query(ApplicationModel)
        .options(joinedload(ApplicationModel.scheme))
        .filter(
            ApplicationModel.id == app_id,
            ApplicationModel.user_id == current_user.id,
        )
        .first()
    )
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    if tracking_data.tracking_id is not None:
        application.tracking_id = tracking_data.tracking_id
    if tracking_data.tracking_link is not None:
        application.tracking_link = tracking_data.tracking_link

    db.commit()
    db.refresh(application)
    return application
