from pydantic import BaseModel, Field
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


class Insight(InsightBase):
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
