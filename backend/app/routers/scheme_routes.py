from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from ..database import get_db
from ..models import Scheme as SchemeModel
from .. import schemas
from ..services.eligibility_engine import check_user_eligibility_for_scheme

router = APIRouter()


# ========================
# PUBLIC SCHEME ENDPOINTS
# ========================

@router.get("/schemes/", response_model=list[schemas.SchemeResponse])
def list_schemes(
    state: Optional[str] = Query(None, description="Filter by state"),
    category: Optional[str] = Query(None, description="Filter by target category"),
    occupation: Optional[str] = Query(None, description="Filter by target occupation"),
    db: Session = Depends(get_db),
):
    """List all government schemes with optional filters."""
    query = db.query(SchemeModel)
    
    if state:
        query = query.filter(SchemeModel.state.ilike(f"%{state}%"))
    if category:
        query = query.filter(SchemeModel.target_category.ilike(f"%{category}%"))
    if occupation:
        query = query.filter(SchemeModel.target_occupation.ilike(f"%{occupation}%"))
    
    return query.all()


@router.get("/schemes/search", response_model=list[schemas.SchemeResponse])
def search_schemes(
    q: str = Query(..., description="Search query for scheme name or description"),
    db: Session = Depends(get_db),
):
    """Search schemes by name or description."""
    schemes = db.query(SchemeModel).filter(
        SchemeModel.name.ilike(f"%{q}%") | SchemeModel.description.ilike(f"%{q}%")
    ).all()
    return schemes


@router.get("/schemes/{scheme_id}", response_model=schemas.SchemeResponse)
def get_scheme(scheme_id: int, db: Session = Depends(get_db)):
    """Get a specific scheme by ID."""
    scheme = db.query(SchemeModel).filter(SchemeModel.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return scheme


@router.get("/schemes/{scheme_id}/eligibility/{user_id}", response_model=schemas.EligibilityResponse)
def check_eligibility(
    scheme_id: int,
    user_id: int,
    db: Session = Depends(get_db),
):
    """Check if a user is eligible for a specific scheme."""
    result = check_user_eligibility_for_scheme(db, user_id, scheme_id)
    
    scheme = db.query(SchemeModel).filter(SchemeModel.id == scheme_id).first()
    if scheme:
        result["scheme"] = scheme
    
    return result
