import os
from sqlalchemy import create_engine, Column, Integer, String, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

DATABASE_URL = "sqlite:///./club.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Member(Base):
    __tablename__ = "members"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    team_key = Column(String, index=True, nullable=False)  # leadership, technical, community, event-management, event-coordination, marketing, founding, faculty
    role = Column(String, nullable=False)
    bio = Column(Text, nullable=True)
    avatar_url = Column(String, nullable=True)
    sticker = Column(String, nullable=True)
    
    # Social links
    email = Column(String, nullable=True)
    github = Column(String, nullable=True)
    linkedin = Column(String, nullable=True)
    instagram = Column(String, nullable=True)

    # Relationships
    skills = relationship("Skill", back_populates="member", cascade="all, delete-orphan")
    achievements = relationship("Achievement", back_populates="member", cascade="all, delete-orphan")

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(Integer, ForeignKey("members.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)

    member = relationship("Member", back_populates="skills")

class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(Integer, ForeignKey("members.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)

    member = relationship("Member", back_populates="achievements")

def init_db():
    Base.metadata.create_all(bind=engine)
