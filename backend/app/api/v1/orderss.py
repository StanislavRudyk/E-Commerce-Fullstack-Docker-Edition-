from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.base import get_db 
from app.models.product import Product 
from app.models.order import Order, OrderItem 
from app.schemas.order import OrderCreate

router = APIRouter()

@router.get("/")
def get_orders(db: Session = Depends(get_db)):
    return db.query(Order).all()

@router.post("/")
def create_order(order_in: OrderCreate, db: Session = Depends(get_db)):
    products_to_update = []
    
    for item in order_in.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Товар ID {item.product_id} не найден")
        if product.stock_quantity < item.quantity:
            raise HTTPException(
                status_code=400, 
                detail=f"Недостаточно товара {product.name}. В наличии: {product.stock_quantity}"
            )
        products_to_update.append((product, item.quantity, item.unit_price))

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

        for product, quantity, price in products_to_update:

            product.stock_quantity -= quantity
            
            order_item = OrderItem(
                order_id=new_order.id,
                product_id=product.id,
                quantity=quantity,
                unit_price=price
            )
            db.add(order_item)

        db.commit()
        db.refresh(new_order)
        return new_order
        
    except Exception as e:
        db.rollback()

        print(f"ERROR: {str(e)}") 
        raise HTTPException(status_code=500, detail=f"Ошибка базы данных: {str(e)}")

