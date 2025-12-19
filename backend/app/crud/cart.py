from typing import Dict, List, Optional
from decimal import Decimal
from app.schemas.cart import CartItemCreate, CartItemResponse
from sqlalchemy.orm import Session
from app.models.product import Product

carts: Dict[str, List[CartItemCreate]] = {}

def get_cart(session_id: str) -> List[CartItemCreate]:
    return carts.get(session_id, [])

def add_to_cart(session_id: str, item: CartItemCreate, db: Session) -> List[CartItemCreate]:
    if session_id not in carts:
        carts[session_id] = []
    
    product = db.query(Product).filter(Product.id == item.product_id).first()
    if not product:
        raise ValueError("Товар не найден")
    
    if product.stock_quantity < item.quantity:
        raise ValueError("Недостаточно товара на складе")
    
    for cart_item in carts[session_id]:
        if cart_item.product_id == item.product_id:
            cart_item.quantity += item.quantity
            break
    else:
        carts[session_id].append(item)
    
    return carts[session_id]

def update_cart_item(session_id: str, product_id: int, quantity: int, db: Session) -> List[CartItemCreate]:
    if session_id not in carts:
        carts[session_id] = []
        return carts[session_id]

    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise ValueError("Товар не найден")
    
    if product.stock_quantity < quantity:
        raise ValueError("Недостаточно товара на складе")
    
    for cart_item in carts[session_id]:
        if cart_item.product_id == product_id:
            if quantity <= 0:
                carts[session_id].remove(cart_item)
            else:
                cart_item.quantity = quantity
            break
    
    return carts[session_id]

def remove_from_cart(session_id: str, product_id: int) -> List[CartItemCreate]:
    if session_id not in carts:
        return []
    
    carts[session_id] = [item for item in carts[session_id] if item.product_id != product_id]
    return carts[session_id]

def clear_cart(session_id: str):
    if session_id in carts:
        del carts[session_id]

def get_cart_with_details(session_id: str, db: Session) -> dict:
    cart_items = get_cart(session_id)
    cart_response = []
    total = Decimal('0')
    
    for item in cart_items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if product:
            subtotal = product.price * item.quantity
            cart_response.append({
                "product_id": item.product_id,
                "quantity": item.quantity,
                "product_name": product.name,
                "unit_price": product.price,
                "subtotal": subtotal
            })
            total += subtotal
    
    return {
        "items": cart_response,
        "total": total
    }