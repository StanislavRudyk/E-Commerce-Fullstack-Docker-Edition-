from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.base import get_db
from app.schemas.product import ProductInDB, ProductCreate, ProductUpdate
from app.crud.product import (
    get_product, get_products, create_product, update_product, delete_product
)

router = APIRouter()

@router.get("/", response_model=List[ProductInDB])
def read_products(
    skip: int = 0,
    limit: int = 100,
    category_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    products = get_products(db, skip=skip, limit=limit, category_id=category_id)
    return products

@router.get("/{product_id}", response_model=ProductInDB)
def read_product(product_id: int, db: Session = Depends(get_db)):
    db_product = get_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.post("/", response_model=ProductInDB, status_code=201)
def create_new_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
):
    return create_product(db=db, product=product)

@router.put("/{product_id}", response_model=ProductInDB)
def update_existing_product(
    product_id: int,
    product: ProductUpdate,
    db: Session = Depends(get_db),
):
    db_product = update_product(db, product_id=product_id, product=product)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.delete("/{product_id}")
def delete_existing_product(
    product_id: int,
    db: Session = Depends(get_db),

):
    success = delete_product(db, product_id=product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}