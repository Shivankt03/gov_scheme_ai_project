from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from ..database import get_db
from ..models import Scheme as SchemeModel
from .. import schemas
from ..services.eligibility_engine import check_user_eligibility_for_scheme
from ..services.hybrid_ai_engine import translate_schemes_batch

router = APIRouter()


def _translate_scheme_list(schemes: list, language: str) -> list:
    """
    If language != 'en', translate description and benefit fields of all schemes
    in a single AI batch call. Name, ministry, and metadata stay in English.
    Returns a list of dicts (not ORM objects).
    """
    if language == 'en' or not schemes:
        # Return ORM objects directly — FastAPI will serialize via response_model
        return schemes

    # Build a numbered batch text for translation
    lines = []
    for i, s in enumerate(schemes):
        lines.append(f"[{i}] DESCRIPTION: {s.description or ''}")
        lines.append(f"[{i}] BENEFIT: {s.benefit or ''}")
        lines.append(f"[{i}] HOW_TO_APPLY: {getattr(s, 'how_to_apply', '') or ''}")

    batch_text = "\n".join(lines)
    translated_text = translate_schemes_batch(batch_text, language)

    # Parse back the translated fields
    translated_desc = {}
    translated_benefit = {}
    translated_how = {}
    for line in translated_text.splitlines():
        line = line.strip()
        if line.startswith('[') and '] DESCRIPTION: ' in line:
            idx_end = line.index(']')
            idx = int(line[1:idx_end])
            translated_desc[idx] = line.split('] DESCRIPTION: ', 1)[1]
        elif line.startswith('[') and '] BENEFIT: ' in line:
            idx_end = line.index(']')
            idx = int(line[1:idx_end])
            translated_benefit[idx] = line.split('] BENEFIT: ', 1)[1]
        elif line.startswith('[') and '] HOW_TO_APPLY: ' in line:
            idx_end = line.index(']')
            idx = int(line[1:idx_end])
            translated_how[idx] = line.split('] HOW_TO_APPLY: ', 1)[1]

    # Build plain dicts with translated fields merged in
    result = []
    for i, s in enumerate(schemes):
        result.append({
            "id": s.id,
            "name": s.name,
            "ministry": s.ministry,
            "description": translated_desc.get(i, s.description),
            "benefit": translated_benefit.get(i, s.benefit),
            "how_to_apply": translated_how.get(i, getattr(s, 'how_to_apply', None)),
            "min_age": s.min_age,
            "max_income": s.max_income,
            "target_occupation": s.target_occupation,
            "target_category": s.target_category,
            "state": s.state,
            "application_link": s.application_link,
            "scheme_type": s.scheme_type,
            "application_deadline": s.application_deadline,
            "documents_required": s.documents_required,
            "created_at": s.created_at,
        })
    return result



# ========================
# PUBLIC SCHEME ENDPOINTS
# ========================

@router.get("/schemes/")
def list_schemes(
    state: Optional[str] = Query(None, description="Filter by state"),
    category: Optional[str] = Query(None, description="Filter by target category"),
    occupation: Optional[str] = Query(None, description="Filter by target occupation"),
    language: Optional[str] = Query('en', description="Language code for description translation"),
    db: Session = Depends(get_db),
):
    """List all government schemes with optional filters. Descriptions are translated if language != 'en'."""
    query = db.query(SchemeModel)

    if state:
        query = query.filter(SchemeModel.state.ilike(f"%{state}%"))
    if category:
        query = query.filter(SchemeModel.target_category.ilike(f"%{category}%"))
    if occupation:
        query = query.filter(SchemeModel.target_occupation.ilike(f"%{occupation}%"))

    schemes = query.all()
    return _translate_scheme_list(schemes, language or 'en')


@router.get("/schemes/search")
def search_schemes(
    q: str = Query(..., description="Search query for scheme name or description"),
    language: Optional[str] = Query('en', description="Language code for description translation"),
    db: Session = Depends(get_db),
):
    """Search schemes by name or description. Descriptions are translated if language != 'en'."""
    schemes = db.query(SchemeModel).filter(
        SchemeModel.name.ilike(f"%{q}%") | SchemeModel.description.ilike(f"%{q}%")
    ).all()
    return _translate_scheme_list(schemes, language or 'en')


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
