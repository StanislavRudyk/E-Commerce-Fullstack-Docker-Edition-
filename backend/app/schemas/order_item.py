from pydantic import BaseModel
from decimal import Decimal
from datetime import datetime

class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    unit_price: Decimal

class OrderItemCreate(OrderItemBase):
    pass

class OrderItemInDB(OrderItemBase):
    id: int
    order_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True