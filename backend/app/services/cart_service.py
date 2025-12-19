from typing import Dict, List, Optional
from sqlalchemy.orm import Session
from app.crud.product import get_product


class CartService:
    def __init__(self):
        self.carts: Dict[str, List[dict]] = {} 
    
    def get_cart(self, user_id: str) -> List[dict]:
        return self.carts.get(user_id, [])
    
    def add_to_cart(self, user_id: str, product_id: int, quantity: int, db: Session) -> List[dict]:
        if user_id not in self.carts:
            self.carts[user_id] = []
        
        for item in self.carts[user_id]:
            if item["product_id"] == product_id:
                item["quantity"] += quantity
                return self.carts[user_id]

        product = get_product(db, product_id)
        if not product:
            return self.carts[user_id]
        
        if product.stock_quantity < quantity:
            quantity = product.stock_quantity

        self.carts[user_id].append({
            "product_id": product_id,
            "product_name": product.name,
            "price": float(product.price),
            "quantity": quantity,
            "subtotal": float(product.price) * quantity
        })
        
        return self.carts[user_id]
    
    def update_cart_item(self, user_id: str, product_id: int, quantity: int, db: Session) -> List[dict]:
        if user_id not in self.carts:
            return []
        
        for item in self.carts[user_id]:
            if item["product_id"] == product_id:
                if quantity <= 0:
                    self.carts[user_id] = [i for i in self.carts[user_id] if i["product_id"] != product_id]
                else:
                    product = get_product(db, product_id)
                    if product and quantity > product.stock_quantity:
                        quantity = product.stock_quantity
                    
                    item["quantity"] = quantity
                    item["subtotal"] = item["price"] * quantity
                break
        
        return self.carts[user_id]
    
    def remove_from_cart(self, user_id: str, product_id: int) -> List[dict]:
        if user_id in self.carts:
            self.carts[user_id] = [item for item in self.carts[user_id] if item["product_id"] != product_id]
        
        return self.carts.get(user_id, [])
    
    def clear_cart(self, user_id: str):
        if user_id in self.carts:
            self.carts[user_id] = []
    
    def get_cart_total(self, user_id: str) -> float:
        cart = self.carts.get(user_id, [])
        return sum(item["subtotal"] for item in cart)
cart_service = CartService()