from app.db import SessionLocal, engine, Base
from app.models.category import Category
from app.models.product import Product

def seed_db():

    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        if db.query(Category).first():
            print("База уже содержит данные, пропускаем запуск seed.")
            return

        electronics = Category(name="Электроника", description="Гаджеты и девайсы")
        home = Category(name="Дом и сад", description="Товары для уюта")
        db.add_all([electronics, home])
        db.commit()
        db.refresh(electronics)
        db.refresh(home)

        p1 = Product(
            name="Смартфон X10", 
            description="Мощный смартфон", 
            price=15000.0, 
            stock_quantity=10, 
            category_id=electronics.id,
            is_active=True
        )
        p2 = Product(
            name="Кофеварка Turbo", 
            description="Идеальный кофе", 
            price=4500.0, 
            stock_quantity=5, 
            category_id=home.id,
            is_active=True
        )
        
        db.add_all([p1, p2])
        db.commit()
        print("✅ База данных успешно наполнена товарами!")
    except Exception as e:
        print(f"❌ Ошибка при заполнении базы: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()