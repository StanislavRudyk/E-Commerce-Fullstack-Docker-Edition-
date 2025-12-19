from sqlalchemy.orm import Session
from typing import List, Optional
from decimal import Decimal
from app.models.order import Order, OrderItem 
from app.models.product import Product
from app.schemas.order import OrderCreate, OrderUpdate
from datetime import datetime

def get_order(db: Session, order_id: int) -> Optional[Order]:
    return db.query(Order).filter(Order.id == order_id).first()

def get_orders(db: Session, skip: int = 0, limit: int = 100) -> List[Order]:
    return db.query(Order).order_by(Order.created_at.desc()).offset(skip).limit(limit).all()

def create_order(db: Session, order: OrderCreate) -> Order:
    total_amount = Decimal('0')
    order_items_list = []
    
    for item in order.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            continue
            
        if product.stock_quantity < item.quantity:
            raise ValueError(f"Недостатньо товару {product.name} на складі")
        
        subtotal = Decimal(str(product.price)) * item.quantity
        total_amount += subtotal
    
        order_item = OrderItem(
            product_id=item.product_id,
            quantity=item.quantity,
            unit_price=product.price
        )
        order_items_list.append(order_item)
        product.stock_quantity -= item.quantity

    db_order = Order(
        customer_name=order.customer_name,
        customer_email=order.customer_email,
        customer_phone=order.customer_phone,
        delivery_address=order.delivery_address,
        total_amount=float(total_amount),
        status='pending',
        items=order_items_list
    )
    
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order


def update_order_status(db: Session, order_id: int, order_in: OrderUpdate) -> Optional[Order]:
    db_order = db.query(Order).filter(Order.id == order_id).first() 
    if db_order:
        update_data = order_in.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_order, field, value)
        db.commit() 
        db.refresh(db_order) 
    return db_order

def delete_order(db: Session, order_id: int) -> bool:
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if db_order:
        db.delete(db_order)
        db.commit()
        return True
    return False