from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime


class InsightBase(BaseModel):
    title: str
    excerpt: str
    content: str
    author: Optional[str] = "DREAMATIC Team"
    imageUrl: Optional[str] = None
    page: str = "ai-work"
    published: bool = True
    # Research specific fields
    journal: Optional[str] = None
    year: Optional[str] = None
    authors: Optional[str] = None
    pdfUrl: Optional[str] = None
    linkType: Optional[str] = "download"


class InsightCreate(InsightBase):
    pass


class InsightUpdate(BaseModel):
    title: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    author: Optional[str] = None
    imageUrl: Optional[str] = None
    page: Optional[str] = None
    published: Optional[bool] = None
    journal: Optional[str] = None
    year: Optional[str] = None
    authors: Optional[str] = None
    pdfUrl: Optional[str] = None
    linkType: Optional[str] = None


class Insight(InsightBase):
    id: str = Field(alias="_id")
    createdAt: datetime
    updatedAt: datetime

    class Config:
        populate_by_name = True


class ResearchBase(BaseModel):
    title: str
    journal: str
    year: str
    authors: str
    excerpt: str
    abstract: Optional[str] = None
    content: str
    imageUrl: Optional[str] = None
    pdfUrl: Optional[str] = None
    linkType: str = "download"
    published: bool = True


class ResearchCreate(ResearchBase):
    pass


class ResearchUpdate(BaseModel):
    title: Optional[str] = None
    journal: Optional[str] = None
    year: Optional[str] = None
    authors: Optional[str] = None
    excerpt: Optional[str] = None
    abstract: Optional[str] = None
    content: Optional[str] = None
    imageUrl: Optional[str] = None
    pdfUrl: Optional[str] = None
    linkType: Optional[str] = None
    published: Optional[bool] = None


class Research(ResearchBase):
    id: str = Field(alias="_id")
    createdAt: datetime
    updatedAt: datetime

    class Config:
        populate_by_name = True


class UserBase(BaseModel):
    username: str
    email: str
    role: str = "admin"


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: str = Field(alias="_id")
    createdAt: datetime

    class Config:
        populate_by_name = True


class Token(BaseModel):
    access_token: str
    token_type: str


class WebAuthnCredential(BaseModel):
    id: str = Field(alias="_id")
    username: str
    credential_id: str  # Base64 encoded ID from YubiKey
    public_key: str    # Base64 encoded public key
    sign_count: int
    transports: Optional[list[str]] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True


class WebAuthnChallenge(BaseModel):
    username: str
    challenge: str
    expires_at: datetime


class TokenData(BaseModel):
    username: Optional[str] = None


class ShowcaseItemBase(BaseModel):
    title: str
    description: Optional[str] = None
    mediaUrl: str
    mediaType: str  # 'image' or 'video'
    tag: str
    product: str
    order: int = 0
    active: bool = True
    size: str = "medium"  # "small", "medium", "large"


class ShowcaseItemCreate(ShowcaseItemBase):
    pass


class ShowcaseItemUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    mediaUrl: Optional[str] = None
    mediaType: Optional[str] = None
    tag: Optional[str] = None
    product: Optional[str] = None
    order: Optional[int] = None
    active: Optional[bool] = None
    size: Optional[str] = None


class ShowcaseItem(ShowcaseItemBase):
    id: str = Field(alias="_id")
    createdAt: datetime
    updatedAt: datetime
    likes: int = 0
    views: int = 0

    class Config:
        populate_by_name = True


class JobBase(BaseModel):
    title: str
    team: str
    location: str
    description: str
    requirements: str
    company: str = "DREAMATIC"
    tags: Optional[str] = ""  # comma-separated tags
    type: str = "Full-time"  # "Full-time", "Contract", "Internship"
    active: bool = True
    isArchived: bool = False


class JobCreate(JobBase):
    pass


class JobUpdate(BaseModel):
    title: Optional[str] = None
    team: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[str] = None
    company: Optional[str] = None
    tags: Optional[str] = None
    type: Optional[str] = None
    active: Optional[bool] = None
    isArchived: Optional[bool] = None


class Job(JobBase):
    id: str = Field(alias="_id")
    createdAt: datetime
    updatedAt: datetime

    class Config:
        populate_by_name = True


class JobApplicationBase(BaseModel):
    name: str
    email: EmailStr
    phone: str
    location: str
    experience: str
    salary: str
    linkedin: str
    portfolio: str
    notice: str
    resume: str
    message: str
    role: str
    jobId: Optional[str] = None
    status: str = "Applied"
    history: Optional[list] = []
    isDeleted: bool = False


class JobApplicationCreate(JobApplicationBase):
    pass


class JobApplication(JobApplicationBase):
    id: str = Field(alias="_id")
    createdAt: datetime

    class Config:
        populate_by_name = True


# --- Dynamic Page Management models ---

class SolutionItem(BaseModel):
    id: int
    title: str
    subtitle: str
    description: str
    features: list[str]
    accent: str
    icon: str


class PageConfigBase(BaseModel):
    page_id: str  # e.g., 'ai-work', 'ai-service'
    hero_badge: Optional[str] = None
    hero_title: Optional[str] = None
    hero_subtitle: Optional[str] = None
    solutions: Optional[list[dict]] = None
    approaches: Optional[list[dict]] = None
    values: Optional[list[dict]] = None
    stats: Optional[list[dict]] = None
    team: Optional[list[dict]] = None
    advisors: Optional[list[dict]] = None
    perks: Optional[list[dict]] = None
    # Modular Page extensions
    content: Optional[list[dict]] = None
    theme: Optional[dict] = None
    isCustom: Optional[bool] = False
    label: Optional[str] = None
    path: Optional[str] = None
    visible: Optional[bool] = True
    group: Optional[str] = None


class PageConfigCreate(PageConfigBase):
    pass


class PageConfigUpdate(BaseModel):
    hero_badge: Optional[str] = None
    hero_title: Optional[str] = None
    hero_subtitle: Optional[str] = None
    solutions: Optional[list[dict]] = None
    approaches: Optional[list[dict]] = None
    values: Optional[list[dict]] = None
    stats: Optional[list[dict]] = None
    team: Optional[list[dict]] = None
    advisors: Optional[list[dict]] = None
    perks: Optional[list[dict]] = None
    content: Optional[list[dict]] = None
    theme: Optional[dict] = None
    isCustom: Optional[bool] = None
    label: Optional[str] = None
    path: Optional[str] = None
    visible: Optional[bool] = None
    group: Optional[str] = None


class PageConfig(PageConfigBase):
    id: str = Field(alias="_id")
    updatedAt: datetime

    class Config:
        populate_by_name = True
