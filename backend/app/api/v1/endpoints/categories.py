from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.base import get_db
from app.schemas.category import CategoryResponse, CategoryCreate, CategoryUpdate
from app.crud.category import (
    get_category, get_categories, create_category,
    update_category, delete_category
)
from app.api import deps

router = APIRouter()

@router.get("/", response_model=List[CategoryResponse])
def read_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_categories(db, skip=skip, limit=limit)

@router.get("/{category_id}", response_model=CategoryResponse)
def read_category(category_id: int, db: Session = Depends(get_db)):
    db_category = get_category(db, category_id=category_id)
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return db_category

@router.post("/", response_model=CategoryResponse)
def create_new_category(category: CategoryCreate, db: Session = Depends(get_db)):
    return create_category(db=db, category=category)

@router.put("/{category_id}", response_model=CategoryResponse)
def update_existing_category(
    category_id: int, category: CategoryUpdate, db: Session = Depends(get_db)
):
    db_category = update_category(db, category_id=category_id, category=category)
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return db_category

@router.delete("/{category_id}")
def delete_existing_category(category_id: int, db: Session = Depends(get_db)):
    success = delete_category(db, category_id=category_id)
    if not success:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted successfully"}

@router.put("/{category_id}", response_model=CategoryResponse)
def update_existing_category(
    category_id: int, 
    category: CategoryUpdate, 
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_active_superuser) 
):
    return update_category(db, category_id=category_id, category=category)


@router.delete("/{category_id}")
def delete_existing_category(
    category_id: int, 
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_active_superuser) 
):
    success = delete_category(db, category_id=category_id)
    if not success:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"status": "success"}