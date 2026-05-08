from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP, Boolean, Float, Text
from datetime import datetime
from sqlalchemy.orm import relationship
from .database import Base


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
