from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.base import get_db
from app.schemas.order import OrderInDB, OrderCreate, OrderUpdate
from app.api import deps
from app.crud.order import get_orders, create_order, update_order_status, delete_order
from app.models.user import User 
from app.models.order import Order 

router = APIRouter()

@router.get("/", response_model=List[OrderInDB])
def read_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    if current_user.is_admin:
        return get_orders(db)

    return db.query(Order).filter(Order.customer_email == current_user.email).all()

@router.post("/", response_model=OrderInDB)
def create_new_order(order_in: OrderCreate, db: Session = Depends(get_db)):
    return create_order(db, order=order_in)

@router.patch("/{order_id}", response_model=OrderInDB)
def update_status(order_id: int, order_in: OrderUpdate, db: Session = Depends(get_db)):
    db_order = update_order_status(db, order_id=order_id, order_in=order_in)
    if not db_order:
        raise HTTPException(status_code=404, detail="Замовлення не знайдено")
    return db_order

@router.delete("/{order_id}")
def delete_existing_order(
    order_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_superuser)
):
    if not delete_order(db, order_id=order_id):
        raise HTTPException(status_code=404, detail="Замовлення не знайдено")
    return {"status": "success"}