from fastapi import APIRouter
from app import schemas

router = APIRouter()

@router.get("/", response_model=schemas.Cart)
def get_cart():
    return {"items": [], "total_amount": 0.0}

@router.post("/items", response_model=schemas.Cart)
def add_to_cart(item: schemas.CartItem):
    return {"items": [item], "total_amount": 0.0}