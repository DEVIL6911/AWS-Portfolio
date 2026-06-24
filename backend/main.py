from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import List, Optional
import uvicorn

from database import SessionLocal, Member, Skill, Achievement, init_db

app = FastAPI(title="AWS Cloud Club API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify React app host
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic schemas
class SkillSchema(BaseModel):
    name: str

    class Config:
        orm_mode = True

class AchievementSchema(BaseModel):
    title: str

    class Config:
        orm_mode = True

class MemberResponse(BaseModel):
    id: int
    name: str
    team_key: str
    role: str
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    sticker: Optional[str] = None
    email: Optional[str] = None
    github: Optional[str] = None
    linkedin: Optional[str] = None
    instagram: Optional[str] = None
    skills: List[SkillSchema] = []
    achievements: List[AchievementSchema] = []

    class Config:
        orm_mode = True

class MemberCreate(BaseModel):
    name: str
    team_key: str
    role: str
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    sticker: Optional[str] = None
    email: Optional[str] = None
    github: Optional[str] = None
    linkedin: Optional[str] = None
    instagram: Optional[str] = None
    skills: List[str] = []
    achievements: List[str] = []

@app.on_event("startup")
def startup_event():
    init_db()
    seed_db()

@app.get("/api/members", response_model=List[MemberResponse])
def get_members(db: Session = Depends(get_db)):
    return db.query(Member).all()

@app.get("/api/members/{team_key}", response_model=List[MemberResponse])
def get_members_by_team(team_key: str, db: Session = Depends(get_db)):
    members = db.query(Member).filter(Member.team_key == team_key).all()
    return members

@app.post("/api/members", response_model=MemberResponse)
def create_member(member_data: MemberCreate, db: Session = Depends(get_db)):
    new_member = Member(
        name=member_data.name,
        team_key=member_data.team_key,
        role=member_data.role,
        bio=member_data.bio,
        avatar_url=member_data.avatar_url,
        sticker=member_data.sticker,
        email=member_data.email,
        github=member_data.github,
        linkedin=member_data.linkedin,
        instagram=member_data.instagram
    )
    db.add(new_member)
    db.commit()
    db.refresh(new_member)

    for skill_name in member_data.skills:
        skill = Skill(member_id=new_member.id, name=skill_name)
        db.add(skill)

    for ach_title in member_data.achievements:
        ach = Achievement(member_id=new_member.id, title=ach_title)
        db.add(ach)

    db.commit()
    db.refresh(new_member)
    return new_member

def seed_db():
    db = SessionLocal()
    try:
        if db.query(Member).first() is not None:
            return  # Already seeded

        # Seed data
        seeds = [
            # Leadership
            {
                "name": "Arjun Mehta",
                "team_key": "leadership",
                "role": "Club President · AWS Student Builder Group Leader",
                "bio": "Architecting scalable cloud solutions and leading workshops that turn curiosity into production-ready skills. Drives club strategy, AWS partnerships, and mentorship programs across campus.",
                "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&h=1000&fit=crop&crop=face",
                "sticker": "Club President",
                "email": "arjun.mehta@example.com",
                "github": "#",
                "linkedin": "#",
                "skills": ["AWS", "Terraform", "Lambda", "DevOps", "Python", "React"],
                "achievements": [
                    "AWS Solutions Architect Associate",
                    "Cloud Track Hackathon Winner 2025",
                    "200+ students mentored",
                    "AWS Student Builder Group Leader"
                ]
            },
            # Faculty
            {
                "name": "Avinash Sharma",
                "team_key": "faculty",
                "role": "Faculty Advisor · Department of Computer Science",
                "bio": "Provides academic guidance, institutional support, and mentorship to help students bridge classroom learning with real-world cloud engineering practices on AWS.",
                "avatar_url": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=900&fit=crop&crop=face",
                "sticker": "Faculty Advisor",
                "email": "avinash.sharma@example.com",
                "linkedin": "#",
                "skills": [],
                "achievements": []
            },
            # Technical Team
            {
                "name": "Priya Sharma",
                "team_key": "technical",
                "role": "Technical Team Head",
                "bio": "Oversees all technical workshops, cloud projects, and the club's AWS infrastructure stack.",
                "avatar_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=700&h=1000&fit=crop&crop=face",
                "sticker": "Team Head",
                "email": "priya.sharma@example.com",
                "github": "#",
                "linkedin": "#",
                "skills": ["AWS", "Docker", "Terraform", "DevOps"],
                "achievements": ["AWS Developer Associate", "Built club CI/CD pipeline"]
            },
            {
                "name": "Aditya Verma",
                "team_key": "technical",
                "role": "Technical Team Co-Lead · Cloud Infrastructure",
                "bio": "Manages AWS infrastructure, Terraform modules, and deployment pipelines for club projects.",
                "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=900&fit=crop&crop=face",
                "sticker": "Co-Lead",
                "email": "aditya.verma@example.com",
                "github": "#",
                "skills": ["Terraform", "AWS", "Lambda"],
                "achievements": ["AWS Cloud Practitioner"]
            },
            {
                "name": "Kavya Nair",
                "team_key": "technical",
                "role": "Technical Team Co-Lead · Serverless",
                "bio": "Specializes in serverless architectures, Lambda functions, and API Gateway integrations.",
                "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=900&fit=crop&crop=face",
                "sticker": "Co-Lead",
                "email": "kavya.nair@example.com",
                "github": "#",
                "skills": ["Lambda", "Python", "AWS"],
                "achievements": ["6 serverless workshops delivered"]
            },
            {
                "name": "Rohan Desai",
                "team_key": "technical",
                "role": "Technical Team Co-Lead · DevOps",
                "bio": "Leads CI/CD practices, containerization, and automated testing for club repositories.",
                "avatar_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=900&fit=crop&crop=face",
                "sticker": "Co-Lead",
                "email": "rohan.desai@example.com",
                "github": "#",
                "skills": ["Docker", "DevOps", "React"],
                "achievements": ["10+ pipeline deployments"]
            },
            {
                "name": "Meera Iyer",
                "team_key": "technical",
                "role": "Technical Team Co-Lead · Full Stack",
                "bio": "Builds full-stack club applications with React frontends and AWS backend services.",
                "avatar_url": "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&h=900&fit=crop&crop=face",
                "sticker": "Co-Lead",
                "email": "meera.iyer@example.com",
                "github": "#",
                "skills": ["React", "Python", "AWS"],
                "achievements": ["Launched club event portal"]
            },
            # Community Team
            {
                "name": "Rahul Kapoor",
                "team_key": "community",
                "role": "Community Team Head",
                "bio": "Builds and nurtures the club community through engagement programs, onboarding, and member experience initiatives.",
                "avatar_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=700&h=1000&fit=crop&crop=face",
                "sticker": "Team Head",
                "email": "rahul.kapoor@example.com",
                "linkedin": "#",
                "skills": ["AWS", "Community", "Leadership"],
                "achievements": ["10+ industry partnerships", "3x membership growth"]
            },
            {
                "name": "Sameer Khan",
                "team_key": "community",
                "role": "Community Team Co-Lead · Onboarding",
                "bio": "Designs onboarding flows and welcome programs for new club members.",
                "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=900&fit=crop&crop=face",
                "sticker": "Co-Lead",
                "email": "sameer.khan@example.com",
                "linkedin": "#",
                "skills": ["Onboarding", "AWS"],
                "achievements": []
            },
            {
                "name": "Divya Patel",
                "team_key": "community",
                "role": "Community Team Co-Lead · Engagement",
                "bio": "Runs weekly meetups, study groups, and peer mentorship pairings.",
                "avatar_url": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=900&fit=crop&crop=face",
                "sticker": "Co-Lead",
                "email": "divya.patel@example.com",
                "linkedin": "#",
                "skills": ["Engagement", "Mentorship"],
                "achievements": []
            },
            {
                "name": "Karan Joshi",
                "team_key": "community",
                "role": "Community Team Co-Lead · Alumni Network",
                "bio": "Connects current members with alumni and industry professionals for career guidance.",
                "avatar_url": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=900&fit=crop&crop=face",
                "sticker": "Co-Lead",
                "email": "karan.joshi@example.com",
                "linkedin": "#",
                "skills": ["Networking", "AWS"],
                "achievements": []
            },
            # Event Management Team
            {
                "name": "Ananya Reddy",
                "team_key": "event-management",
                "role": "Event Management Team Head",
                "bio": "Leads end-to-end event planning from concept to post-event analysis.",
                "avatar_url": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=700&h=1000&fit=crop&crop=face",
                "sticker": "Team Head",
                "email": "ananya.reddy@example.com",
                "linkedin": "#",
                "skills": ["Events", "AWS", "Management"],
                "achievements": ["8 workshops delivered"]
            },
            {
                "name": "Tanvi Rao",
                "team_key": "event-management",
                "role": "Event Management Team Co-Lead · Logistics",
                "bio": "Manages on-ground logistics, seating, and attendee experience during events.",
                "avatar_url": "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&h=900&fit=crop&crop=face",
                "sticker": "Co-Lead",
                "email": "tanvi.rao@example.com",
                "linkedin": "#",
                "skills": ["Logistics", "Operations"],
                "achievements": []
            },
            {
                "name": "Harsh Ahuja",
                "team_key": "event-management",
                "role": "Event Management Team Co-Lead · Hackathons",
                "bio": "Specializes in hackathon planning, judging coordination, and prize logistics.",
                "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=900&fit=crop&crop=face",
                "sticker": "Co-Lead",
                "email": "harsh.ahuja@example.com",
                "linkedin": "#",
                "skills": ["Hackathons", "AWS"],
                "achievements": []
            },
            {
                "name": "Pooja Menon",
                "team_key": "event-management",
                "role": "Event Management Team Co-Lead · Workshops",
                "bio": "Plans and executes hands-on AWS workshop sessions and lab setups.",
                "avatar_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=900&fit=crop&crop=face",
                "sticker": "Co-Lead",
                "email": "pooja.menon@example.com",
                "linkedin": "#",
                "skills": ["Workshops", "AWS"],
                "achievements": []
            },
            # Event Coordination Team
            {
                "name": "Vikram Singh",
                "team_key": "event-coordination",
                "role": "Event Coordination Team Head",
                "bio": "Coordinates cross-team workflows, timelines, and resources to ensure every club event runs on schedule.",
                "avatar_url": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=700&h=1000&fit=crop&crop=face",
                "sticker": "Team Head",
                "email": "vikram.singh@example.com",
                "linkedin": "#",
                "skills": ["Coordination", "AWS", "Planning"],
                "achievements": ["12+ events coordinated"]
            },
            {
                "name": "Ishita Malhotra",
                "team_key": "event-coordination",
                "role": "Event Coordination Team Co-Lead · Scheduling",
                "bio": "Manages event timelines, schedules, and resource allocation across teams.",
                "avatar_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=900&fit=crop&crop=face",
                "sticker": "Co-Lead",
                "email": "ishita.malhotra@example.com",
                "linkedin": "#",
                "skills": ["Scheduling", "Logistics"],
                "achievements": []
            },
            {
                "name": "Arnav Ghosh",
                "team_key": "event-coordination",
                "role": "Event Coordination Team Co-Lead · Resources",
                "bio": "Handles vendor coordination, equipment, and venue resource management.",
                "avatar_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=900&fit=crop&crop=face",
                "sticker": "Co-Lead",
                "email": "arnav.ghosh@example.com",
                "linkedin": "#",
                "skills": ["Resources", "Vendor Mgmt"],
                "achievements": []
            },
            # Marketing Team
            {
                "name": "Neha Gupta",
                "team_key": "marketing",
                "role": "Marketing & Social Media Team Head",
                "bio": "Leads brand strategy, campaign planning, and the club's digital presence.",
                "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=700&h=1000&fit=crop&crop=face",
                "sticker": "Team Head",
                "email": "neha.gupta@example.com",
                "instagram": "#",
                "linkedin": "#",
                "skills": ["Marketing", "Branding", "Analytics"],
                "achievements": ["5x social media reach growth"]
            },
            {
                "name": "Rishabh Sinha",
                "team_key": "marketing",
                "role": "Marketing Co-Lead · Content Strategy",
                "bio": "Creates content calendars, blog posts, and event promotion materials.",
                "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=900&fit=crop&crop=face",
                "sticker": "Co-Lead",
                "email": "rishabh.sinha@example.com",
                "linkedin": "#",
                "skills": ["Content", "Copywriting"],
                "achievements": []
            },
            {
                "name": "Sneha Kulkarni",
                "team_key": "marketing",
                "role": "Marketing Co-Lead · Social Media",
                "bio": "Manages Instagram, LinkedIn, and Twitter accounts with engaging cloud content.",
                "avatar_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=900&fit=crop&crop=face",
                "sticker": "Co-Lead",
                "email": "sneha.kulkarni@example.com",
                "instagram": "#",
                "skills": ["Instagram", "LinkedIn"],
                "achievements": []
            },
            {
                "name": "Ayush Tiwari",
                "team_key": "marketing",
                "role": "Marketing Co-Lead · Design",
                "bio": "Designs posters, banners, and visual assets for all club campaigns.",
                "avatar_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=900&fit=crop&crop=face",
                "sticker": "Co-Lead",
                "email": "ayush.tiwari@example.com",
                "linkedin": "#",
                "skills": ["Design", "Figma"],
                "achievements": []
            },
            {
                "name": "Lakshmi Prasad",
                "team_key": "marketing",
                "role": "Marketing Co-Lead · Video & Media",
                "bio": "Produces event recap videos, reels, and multimedia content for social channels.",
                "avatar_url": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=900&fit=crop&crop=face",
                "sticker": "Co-Lead",
                "email": "lakshmi.prasad@example.com",
                "instagram": "#",
                "skills": ["Video", "Media"],
                "achievements": []
            },
            # Founding Members
            {
                "name": "Aarav Choudhary",
                "team_key": "founding",
                "role": "Founding Member · Cloud Enthusiast",
                "bio": "Helped establish the club's first AWS workshop series and initial member onboarding framework.",
                "avatar_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=900&fit=crop&crop=face",
                "sticker": "Founding Member",
                "email": "aarav.choudhary@example.com",
                "github": "#",
                "linkedin": "#",
                "skills": ["AWS", "Python"],
                "achievements": ["Built the first workshop roadmap"]
            },
            {
                "name": "Isha Banerjee",
                "team_key": "founding",
                "role": "Founding Member · Cloud Enthusiast",
                "bio": "Co-created the club's certification study group and peer learning model.",
                "avatar_url": "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&h=900&fit=crop&crop=face",
                "sticker": "Founding Member",
                "email": "isha.banerjee@example.com",
                "linkedin": "#",
                "skills": ["AWS", "DevOps"],
                "achievements": ["Launched the study circle format"]
            },
            {
                "name": "Manish Reddy",
                "team_key": "founding",
                "role": "Founding Member · Cloud Enthusiast",
                "bio": "Built the club's first serverless project demo used in recruitment drives.",
                "avatar_url": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=900&fit=crop&crop=face",
                "sticker": "Founding Member",
                "email": "manish.reddy@example.com",
                "github": "#",
                "skills": ["Lambda", "AWS"],
                "achievements": ["First serverless demo owner"]
            },
            {
                "name": "Sanya Oberoi",
                "team_key": "founding",
                "role": "Founding Member · Cloud Enthusiast",
                "bio": "Designed the original club branding and social media launch strategy.",
                "avatar_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=900&fit=crop&crop=face",
                "sticker": "Founding Member",
                "email": "sanya.oberoi@example.com",
                "instagram": "#",
                "skills": ["Design", "Marketing"],
                "achievements": ["Defined the first brand system"]
            },
            {
                "name": "Dev Malhotra",
                "team_key": "founding",
                "role": "Founding Member · Cloud Enthusiast",
                "bio": "Organized the club's inaugural hackathon with 100+ participants.",
                "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=900&fit=crop&crop=face",
                "sticker": "Founding Member",
                "email": "dev.malhotra@example.com",
                "linkedin": "#",
                "skills": ["Events", "AWS"],
                "achievements": ["Ran the first club hackathon"]
            },
            {
                "name": "Ritu Agarwal",
                "team_key": "founding",
                "role": "Founding Member · Cloud Enthusiast",
                "bio": "Pioneered the club's mentorship program connecting seniors with newcomers.",
                "avatar_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=900&fit=crop&crop=face",
                "sticker": "Founding Member",
                "email": "ritu.agarwal@example.com",
                "linkedin": "#",
                "skills": ["Mentorship", "AWS"],
                "achievements": ["Built the mentorship framework"]
            },
            {
                "name": "Nitin Rao",
                "team_key": "founding",
                "role": "Founding Member · Cloud Enthusiast",
                "bio": "Set up the club's GitHub organization and open-source contribution guidelines.",
                "avatar_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=900&fit=crop&crop=face",
                "sticker": "Founding Member",
                "email": "nitin.rao@example.com",
                "github": "#",
                "skills": ["GitHub", "DevOps"],
                "achievements": ["Created the GitHub org and guidelines"]
            },
            {
                "name": "Pallavi Shukla",
                "team_key": "founding",
                "role": "Founding Member · Cloud Enthusiast",
                "bio": "Authored the club's first AWS Cloud Practitioner study guide used by 50+ members.",
                "avatar_url": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=900&fit=crop&crop=face",
                "sticker": "Founding Member",
                "email": "pallavi.shukla@example.com",
                "linkedin": "#",
                "skills": ["AWS", "Education"],
                "achievements": ["Authored the first study guide"]
            },
            {
                "name": "Yash Mittal",
                "team_key": "founding",
                "role": "Founding Member · Cloud Enthusiast",
                "bio": "Established partnerships with local tech companies for club sponsorships.",
                "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=900&fit=crop&crop=face",
                "sticker": "Founding Member",
                "email": "yash.mittal@example.com",
                "linkedin": "#",
                "skills": ["Partnerships", "AWS"],
                "achievements": ["Secured first sponsorship leads"]
            },
            {
                "name": "Kritika Das",
                "team_key": "founding",
                "role": "Founding Member · Cloud Enthusiast",
                "bio": "Co-founded the club's weekly cloud news digest and learning newsletter.",
                "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=900&fit=crop&crop=face",
                "sticker": "Founding Member",
                "email": "kritika.das@example.com",
                "linkedin": "#",
                "skills": ["Content", "AWS"],
                "achievements": ["Launched the club digest"]
            }
        ]

        for s in seeds:
            m = Member(
                name=s["name"],
                team_key=s["team_key"],
                role=s["role"],
                bio=s.get("bio"),
                avatar_url=s.get("avatar_url"),
                sticker=s.get("sticker"),
                email=s.get("email"),
                github=s.get("github"),
                linkedin=s.get("linkedin"),
                instagram=s.get("instagram")
            )
            db.add(m)
            db.commit()
            db.refresh(m)

            for skill_name in s.get("skills", []):
                sk = Skill(member_id=m.id, name=skill_name)
                db.add(sk)

            for ach_title in s.get("achievements", []):
                ac = Achievement(member_id=m.id, title=ach_title)
                db.add(ac)

            db.commit()
    finally:
        db.close()

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
