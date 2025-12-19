import os
import sys
import time

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from sqlalchemy import create_engine, text
from app.core.config import settings

def check_database():
    print("🔍 Проверка подключения к базе данных...")
    print(f"📡 URL подключения: {settings.DATABASE_URL}")
    if "ecommerce_user" in settings.DATABASE_URL and "@postgres" in settings.DATABASE_URL:
        print(" URL содержит правильные параметры")
    else:
        print(" URL может содержать ошибки")
    max_attempts = 10
    for attempt in range(max_attempts):
        try:
            print(f"🔄 Попытка подключения {attempt + 1}/{max_attempts}...")
            engine = create_engine(settings.DATABASE_URL)
            with engine.connect() as conn:
                result = conn.execute(text("SELECT version();"))
                version = result.fetchone()[0]
                print(f" Подключение успешно!")
                print(f" Версия PostgreSQL: {version}")
                result = conn.execute(text("SELECT current_database();"))
                db_name = result.fetchone()[0]
                print(f"📊 Имя базы данных: {db_name}")
                result = conn.execute(text("""
                    SELECT table_name 
                    FROM information_schema.tables 
                    WHERE table_schema = 'public'
                """))
                tables = [row[0] for row in result]
                print(f" Таблицы в базе данных: {tables}")
                return True
        except Exception as e:
            print(f" Ошибка подключения: {e}")
            if attempt < max_attempts - 1:
                print(" Ждем 5 секунд перед следующей попыткой...")
                time.sleep(5)
            else:
                print(" Все попытки подключения провалились")
                return False

if __name__ == "__main__":
    check_database()