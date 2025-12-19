from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import crud, schemas
from app.api.dependencies import get_current_user

router = APIRouter()

@router.get("/", response_model=List[schemas.Order])
def get_orders(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if current_user.role.value == "admin":
        orders = crud.order.get_multi(db, skip=skip, limit=limit)
    else:
        orders = crud.order.get_by_user(
            db, user_id=current_user.id, skip=skip, limit=limit
        )
    return orders