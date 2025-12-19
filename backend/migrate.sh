!/bin/bash

echo "⌛ Ожидание PostgreSQL..."
until pg_isready -h postgres -p 5432 -U ecommerce_user; do
    echo "⏳ PostgreSQL не готов, ждем..."
    sleep 2
done

echo "✅ PostgreSQL готов!"

echo "🔄 Создание миграций..."
alembic revision --autogenerate -m "Initial tables"

echo "🚀 Применение миграций..."
alembic upgrade head

echo "🎉 Миграции успешно применены!"