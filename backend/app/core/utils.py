import re
from decimal import Decimal
from typing import Any, Dict

def validate_phone_number(phone: str) -> bool:

    pattern = r'^\+?[1-9]\d{1,14}$'
    return bool(re.match(pattern, phone))

def calculate_total_amount(items: list) -> Decimal:
    total = Decimal('0')
    for item in items:
        total += Decimal(str(item['price'])) * item['quantity']
    return total

def format_price(price: float) -> str:
    return f"{price:.2f}"

def sanitize_input(data: Dict[str, Any]) -> Dict[str, Any]:
    sanitized = {}
    for key, value in data.items():
        if isinstance(value, str):
            sanitized[key] = value.strip()
        else:
            sanitized[key] = value
    return sanitized