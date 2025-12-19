from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.base import get_db 
from app.models.product import Product 
from app.models.order import Order, OrderItem 
from app.schemas.order import OrderCreate, OrderInDB

router = APIRouter()

@router.get("/", response_model=List[OrderInDB])
def read_orders(db: Session = Depends(get_db)):
    return db.query(Order).order_by(Order.created_at.desc()).all()

@router.post("/")
def create_order(order_in: OrderCreate, db: Session = Depends(get_db)):
    products_to_update = []
    
    for item in order_in.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Товар {item.product_id} не знайдено")
        if product.stock_quantity < item.quantity:
            raise HTTPException(status_code=400, detail=f"Недостатньо товару {product.name} на складі")
        products_to_update.append((product, item.quantity))
    new_order = Order(
        customer_name=order_in.customer_name,
        customer_email=order_in.customer_email,
        customer_phone=order_in.customer_phone,
        delivery_address=order_in.delivery_address, 
        total_amount=order_in.total_amount,
        status="pending"
    )
    
    try:
        db.add(new_order)
        db.flush() 

        for product, quantity in products_to_update:
            order_item = OrderItem(
                order_id=new_order.id, 
                product_id=product.id, 
                quantity=quantity, 
                unit_price=product.price
            )
            db.add(order_item)
            product.stock_quantity -= quantity 

        db.commit()
        db.refresh(new_order)
        return new_order
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))