from pydantic import BaseModel
from typing import List
from decimal import Decimal

class CartItemBase(BaseModel):
    product_id: int
    quantity: int

class CartItemCreate(CartItemBase):
    pass

class CartItemResponse(CartItemBase):
    product_name: str
    unit_price: Decimal
    subtotal: Decimal

class CartResponse(BaseModel):
    items: List[CartItemResponse] = []
    total: Decimal = 0