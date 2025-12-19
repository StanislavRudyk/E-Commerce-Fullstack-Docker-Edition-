from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import Optional
from app.db.base import get_db
from app.api.dependencies import get_current_user
from app.schemas.cart import CartItemCreate, CartResponse, CartItemResponse
from app.crud.cart import (
    get_cart_with_details,
    add_to_cart,
    update_cart_item,
    remove_from_cart,
    clear_cart
)

router = APIRouter()

def get_session_id(x_session_id: Optional[str] = Header(None, alias="X-Session-ID")) -> str:
    if not x_session_id:

        import uuid
        x_session_id = str(uuid.uuid4())
    return x_session_id

@router.get("/", response_model=CartResponse)
def read_cart(
    session_id: str = Depends(get_session_id),
    db: Session = Depends(get_db)
):
    cart_data = get_cart_with_details(session_id, db)
    return CartResponse(
        items=[CartItemResponse(**item) for item in cart_data["items"]],
        total=cart_data["total"]
    )

@router.post("/items", response_model=CartResponse)
def add_item_to_cart(
    item: CartItemCreate,
    session_id: str = Depends(get_session_id),
    db: Session = Depends(get_db)
):
    try:
        add_to_cart(session_id, item, db)
        cart_data = get_cart_with_details(session_id, db)
        return CartResponse(
            items=[CartItemResponse(**item) for item in cart_data["items"]],
            total=cart_data["total"]
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/items/{product_id}", response_model=CartResponse)
def update_cart_item_quantity(
    product_id: int,
    quantity: int,
    session_id: str = Depends(get_session_id),
    db: Session = Depends(get_db)
):
    try:
        update_cart_item(session_id, product_id, quantity, db)
        cart_data = get_cart_with_details(session_id, db)
        return CartResponse(
            items=[CartItemResponse(**item) for item in cart_data["items"]],
            total=cart_data["total"]
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/items/{product_id}", response_model=CartResponse)
def remove_item_from_cart(
    product_id: int,
    session_id: str = Depends(get_session_id),
    db: Session = Depends(get_db)
):
    remove_from_cart(session_id, product_id)
    cart_data = get_cart_with_details(session_id, db)
    return CartResponse(
        items=[CartItemResponse(**item) for item in cart_data["items"]],
        total=cart_data["total"]
    )

@router.delete("/", response_model=dict)
def clear_user_cart(session_id: str = Depends(get_session_id)):
    clear_cart(session_id)
    return {"message": "Cart cleared successfully"}

@router.post("/merge")
def merge_carts(
    guest_session_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    return {"message": "Cart merge functionality would be implemented here"}