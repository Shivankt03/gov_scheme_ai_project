import re
from datetime import datetime


def some_utility_function(param1, param2):
    """Example utility function that performs a calculation."""
    return param1 + param2


def another_utility_function(data):
    """Example utility function that processes data (removes None values)."""
    processed_data = [item for item in data if item is not None]
    return processed_data


def validate_email(email: str) -> bool:
    """Validate email format."""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def format_datetime(dt: datetime) -> str:
    """Format datetime to readable string."""
    return dt.strftime("%d %B %Y, %I:%M %p")


def format_currency(amount: int) -> str:
    """Format amount in Indian Rupee format."""
    return f"₹{amount:,}"


# Additional utility functions can be added here as needed.
