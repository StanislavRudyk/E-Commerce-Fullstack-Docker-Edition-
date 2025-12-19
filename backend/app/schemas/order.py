from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int
    unit_price: float

class OrderBase(BaseModel):
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    delivery_address: str  
    total_amount: float


class OrderCreate(OrderBase):
    items: List[OrderItemCreate] 

class OrderInDB(OrderBase):
    id: int

    created_at: datetime 
    status: str
    
    class Config:
        from_attributes = True

class OrderUpdate(BaseModel):
    status: Optional[str] = None
    delivery_address: Optional[str] = None