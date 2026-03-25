from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User as UserModel, Scheme as SchemeModel, Application as ApplicationModel
from .. import schemas
from ..auth import get_password_hash, get_current_admin_user

router = APIRouter()


# ========================
# ADMIN USER MANAGEMENT
# ========================

@router.post("/users/", response_model=schemas.UserResponse)
def create_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db),
    admin: UserModel = Depends(get_current_admin_user),
):
    """Admin: Create a new user with hashed password."""
    db_user = db.query(UserModel).filter(UserModel.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pw = get_password_hash(user.password)
    new_user = UserModel(name=user.name, email=user.email, password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.get("/users/", response_model=list[schemas.UserResponse])
def list_users(
    db: Session = Depends(get_db),
    admin: UserModel = Depends(get_current_admin_user),
):
    """Admin: List all users."""
    return db.query(UserModel).all()


@router.put("/users/{user_id}", response_model=schemas.UserResponse)
def update_user(
    user_id: int,
    user: schemas.UserUpdate,
    db: Session = Depends(get_db),
    admin: UserModel = Depends(get_current_admin_user),
):
    """Admin: Update a user."""
    db_user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    for key, value in user.model_dump(exclude_unset=True).items():
        setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.delete("/users/{user_id}", response_model=schemas.UserResponse)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin: UserModel = Depends(get_current_admin_user),
):
    """Admin: Delete a user."""
    db_user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()
    return db_user


# ========================
# ADMIN SCHEME MANAGEMENT
# ========================

@router.post("/schemes/", response_model=schemas.SchemeResponse)
def create_scheme(
    scheme: schemas.SchemeCreate,
    db: Session = Depends(get_db),
    admin: UserModel = Depends(get_current_admin_user),
):
    """Admin: Create a new government scheme."""
    new_scheme = SchemeModel(**scheme.model_dump())
    db.add(new_scheme)
    db.commit()
    db.refresh(new_scheme)
    return new_scheme


@router.put("/schemes/{scheme_id}", response_model=schemas.SchemeResponse)
def update_scheme(
    scheme_id: int,
    scheme: schemas.SchemeUpdate,
    db: Session = Depends(get_db),
    admin: UserModel = Depends(get_current_admin_user),
):
    """Admin: Update a scheme."""
    db_scheme = db.query(SchemeModel).filter(SchemeModel.id == scheme_id).first()
    if not db_scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    for key, value in scheme.model_dump(exclude_unset=True).items():
        setattr(db_scheme, key, value)
    db.commit()
    db.refresh(db_scheme)
    return db_scheme


@router.delete("/schemes/{scheme_id}", response_model=schemas.SchemeResponse)
def delete_scheme(
    scheme_id: int,
    db: Session = Depends(get_db),
    admin: UserModel = Depends(get_current_admin_user),
):
    """Admin: Delete a scheme."""
    db_scheme = db.query(SchemeModel).filter(SchemeModel.id == scheme_id).first()
    if not db_scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    db.delete(db_scheme)
    db.commit()
    return db_scheme


# ========================
# ADMIN APPLICATION MANAGEMENT
# ========================

@router.get("/applications/", response_model=list[schemas.ApplicationResponse])
def list_all_applications(
    db: Session = Depends(get_db),
    admin: UserModel = Depends(get_current_admin_user),
):
    """Admin: View all scheme applications."""
    return db.query(ApplicationModel).all()


@router.put("/applications/{app_id}/status")
def update_application_status(
    app_id: int,
    status: str,
    db: Session = Depends(get_db),
    admin: UserModel = Depends(get_current_admin_user),
):
    """Admin: Update an application's status (e.g., Approved, Rejected, Under Review)."""
    application = db.query(ApplicationModel).filter(ApplicationModel.id == app_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    application.status = status
    db.commit()
    db.refresh(application)
    return {"message": f"Application {app_id} status updated to '{status}'", "application_id": app_id}
