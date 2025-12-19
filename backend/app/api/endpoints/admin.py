from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import crud, schemas
from app.api.dependencies import get_current_admin_user

router = APIRouter()

@router.get("/products", response_model=List[schemas.Product])
def get_all_products(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin_user)
):
    products = crud.product.get_multi(db, skip=skip, limit=limit)
    return products