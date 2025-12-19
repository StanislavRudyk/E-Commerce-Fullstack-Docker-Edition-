from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, Token

router = APIRouter()

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email уже зарегистрирован")

    db_user = User(
        name=user.name,
        email=user.email,
        phone=user.phone,
        password_hash="hashed_" + user.password 
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return {
        "message": "Пользователь успешно создан",
        "user_id": db_user.id,
        "email": db_user.email
    }

@router.post("/login", response_model=Token)
def login(user_login: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_login.email).first()
    

    if not user or user.password_hash != "hashed_" + user_login.password:
        raise HTTPException(status_code=401, detail="Неверные учетные данные")
    
    return Token(
        access_token=f"fake-jwt-token-{user.id}",
        token_type="bearer"
    )