from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP, Boolean, Float, Text, DateTime, event
from sqlalchemy import inspect as sa_inspect
from datetime import datetime
from sqlalchemy.orm import relationship
from .database import Base, engine



class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(100), unique=True, index=True)
    password = Column(String)
    role = Column(String(20), default="user")
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    profile = relationship("Profile", back_populates="user", uselist=False)
    applications = relationship("Application", back_populates="user")
    recommendations = relationship("Recommendation", back_populates="user")


class Profile(Base):
    __tablename__ = 'profiles'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    age = Column(Integer)
    gender = Column(String(10))
    income = Column(Integer)
    state = Column(String(50))
    category = Column(String(20))
    occupation = Column(String(50))
    education = Column(String(50))

    is_farmer = Column(Boolean, default=False)
    land_size = Column(Float)
    disability = Column(Boolean, default=False)

    # Optional extended profile fields
    marital_status = Column(String(20), nullable=True)
    is_bpl = Column(Boolean, nullable=True)          # Below Poverty Line
    domicile_certificate = Column(Boolean, nullable=True)

    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    user = relationship("User", back_populates="profile")


class Scheme(Base):
    __tablename__ = 'schemes'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200))
    ministry = Column(String(100))
    description = Column(Text)

    min_age = Column(Integer)
    max_income = Column(Integer)
    target_occupation = Column(String(50))
    target_category = Column(String(20))
    state = Column(String(50))

    benefit = Column(Text)
    application_link = Column(Text)

    # New scheme detail fields
    application_deadline = Column(DateTime, nullable=True)
    documents_required = Column(Text, nullable=True)
    how_to_apply = Column(Text, nullable=True)           # Step-by-step application instructions
    scheme_type = Column(String(20), nullable=True)   # e.g. 'Central' or 'State'

    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    applications = relationship("Application", back_populates="scheme")
    recommendations = relationship("Recommendation", back_populates="scheme")


class Application(Base):
    __tablename__ = 'applications'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    scheme_id = Column(Integer, ForeignKey("schemes.id"))

    application_date = Column(TIMESTAMP, default=datetime.utcnow)
    status = Column(String(50), default="Applied")

    tracking_id = Column(String(100))
    tracking_link = Column(Text)

    user = relationship("User", back_populates="applications")
    scheme = relationship("Scheme", back_populates="applications")


class Recommendation(Base):
    __tablename__ = 'recommendations'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    scheme_id = Column(Integer, ForeignKey("schemes.id"))
    score = Column(Float, default=0.0)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    user = relationship("User", back_populates="recommendations")
    scheme = relationship("Scheme", back_populates="recommendations")


# ── Auto-migration: add missing columns without dropping data ─────────────────
def auto_migrate_columns():
    """Add new columns to existing tables if they don't exist yet."""
    try:
        inspector = sa_inspect(engine)
        existing_cols = {c['name'] for c in inspector.get_columns('schemes')}

        migrations = []
        if 'how_to_apply' not in existing_cols:
            migrations.append("ALTER TABLE schemes ADD COLUMN how_to_apply TEXT")
        if 'documents_required' not in existing_cols:
            migrations.append("ALTER TABLE schemes ADD COLUMN documents_required TEXT")
        if 'scheme_type' not in existing_cols:
            migrations.append("ALTER TABLE schemes ADD COLUMN scheme_type VARCHAR(20)")
        if 'application_deadline' not in existing_cols:
            migrations.append("ALTER TABLE schemes ADD COLUMN application_deadline DATETIME")
        # Profile optional fields
        existing_profile_cols = {c['name'] for c in inspector.get_columns('profiles')}
        if 'marital_status' not in existing_profile_cols:
            migrations.append("ALTER TABLE profiles ADD COLUMN marital_status VARCHAR(20)")
        if 'is_bpl' not in existing_profile_cols:
            migrations.append("ALTER TABLE profiles ADD COLUMN is_bpl BOOLEAN")
        if 'domicile_certificate' not in existing_profile_cols:
            migrations.append("ALTER TABLE profiles ADD COLUMN domicile_certificate BOOLEAN")

        if migrations:
            from sqlalchemy import text
            with engine.connect() as conn:
                for stmt in migrations:
                    try:
                        conn.execute(text(stmt))
                        print(f"✅ Migration applied: {stmt[:60]}...")
                    except Exception as e:
                        if "duplicate" in str(e).lower() or "already exists" in str(e).lower():
                            pass  # Column already exists, skip
                        else:
                            print(f"⚠️  Migration warning: {e}")
                conn.commit()
    except Exception as e:
        print(f"⚠️  Auto-migration skipped: {e}")

