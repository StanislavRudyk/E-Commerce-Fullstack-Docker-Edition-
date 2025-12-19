from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from app.api import deps
from app.schemas.user import UserResponse, UserUpdate, UserCreate
from app.crud.user import get_users, update_user 
from app.models.user import User


router = APIRouter()

@router.get("/", response_model=List[UserResponse])
def read_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_superuser),
):
    users = get_users(db, skip=skip, limit=limit)
    return users

@router.get("/me", response_model=UserResponse)
def read_user_me(
    current_user: User = Depends(deps.get_current_active_user),
):
    return current_user

@router.put("/me", response_model=UserResponse)
def update_current_user(
    user_update: UserUpdate,
    current_user: User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
):
    try:
        user = update_user(db, user_id=current_user.id, user_update=user_update)
        if not user:
            raise HTTPException(status_code=404, detail="Пользователь не найден")
        return user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))