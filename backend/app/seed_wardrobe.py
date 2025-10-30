"""
Seed the default user's wardrobe with sample items.
Run with:
  python -m app.seed_wardrobe
"""
from typing import List, Tuple
from sqlalchemy.orm import Session

from .database import SessionLocal
from .models import User, WardrobeItem, ItemCategory


SAMPLE_ITEMS: List[Tuple[ItemCategory, str, str, str]] = [
    # category, name, color, season
    (ItemCategory.clothing, "Black hoodie", "black", "all-season"),
    (ItemCategory.clothing, "White oversized tee", "white", "summer"),
    (ItemCategory.clothing, "Light blue denim jeans", "light blue", "all-season"),
    (ItemCategory.clothing, "Slim black jeans", "black", "winter"),
    (ItemCategory.clothing, "Grey sweatpants", "grey", "fall"),
    (ItemCategory.clothing, "Olive cargo pants", "olive", "fall"),
    (ItemCategory.clothing, "Beige chinos", "beige", "spring"),
    (ItemCategory.clothing, "Navy bomber jacket", "navy", "fall"),
    (ItemCategory.clothing, "Denim jacket", "mid blue", "spring"),
    (ItemCategory.clothing, "Black leather jacket", "black", "fall"),
    (ItemCategory.clothing, "Cream kurta", "cream", "summer"),
    (ItemCategory.clothing, "White kurta pant set", "white", "summer"),
    (ItemCategory.clothing, "Charcoal blazer", "charcoal", "winter"),
    (ItemCategory.clothing, "Black turtleneck", "black", "winter"),
    (ItemCategory.clothing, "Striped oxford shirt", "blue/white", "spring"),

    (ItemCategory.footwear, "White low-top sneakers", "white", "all-season"),
    (ItemCategory.footwear, "Black high-top sneakers", "black", "all-season"),
    (ItemCategory.footwear, "Brown leather loafers", "brown", "spring"),
    (ItemCategory.footwear, "Chelsea boots", "suede tan", "fall"),
    (ItemCategory.footwear, "Black dress shoes", "black", "winter"),
    (ItemCategory.footwear, "Black mojaris", "black", "summer"),

    (ItemCategory.accessory, "Black leather belt", "black", "all-season"),
    (ItemCategory.accessory, "Brown leather belt", "brown", "all-season"),
    (ItemCategory.accessory, "Silver chain necklace", "silver", "all-season"),
    (ItemCategory.accessory, "Black beanie", "black", "winter"),
    (ItemCategory.accessory, "Aviator sunglasses", "gold", "summer"),
    (ItemCategory.accessory, "Emerald green dupatta", "emerald green", "summer"),
    (ItemCategory.accessory, "Minimalist watch", "black/silver", "all-season"),
    (ItemCategory.accessory, "Grey wool scarf", "grey", "winter"),
    (ItemCategory.accessory, "Canvas tote bag", "cream", "spring"),
]


def get_or_create_default_user(db: Session) -> User:
    user = db.query(User).filter(User.id == 1).first()
    if user:
        return user
    user = User(id=1, name="Guest")
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def seed(db: Session):
    user = get_or_create_default_user(db)
    existing_names = {
        (wi.category.value, wi.name.lower().strip())
        for wi in db.query(WardrobeItem).filter(WardrobeItem.user_id == user.id).all()
    }

    created = 0
    for cat, name, color, season in SAMPLE_ITEMS:
        key = (cat.value, name.lower().strip())
        if key in existing_names:
            continue
        item = WardrobeItem(
            user_id=user.id,
            category=cat,
            name=name,
            color=color,
            season=season,
        )
        db.add(item)
        created += 1

    if created:
        db.commit()
    print(f"Seed complete. Added {created} items. Total intended sample: {len(SAMPLE_ITEMS)}")


def main():
    db = SessionLocal()
    try:
        seed(db)
    finally:
        db.close()


if __name__ == "__main__":
    main()
