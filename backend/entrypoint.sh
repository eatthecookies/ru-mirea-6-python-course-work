#!/bin/bash

# Ждём базу данных
echo "Waiting for postgres..."
while ! nc -z db 5432; do
  sleep 0.1
done
echo "PostgreSQL started"

# Выполняем миграции
python manage.py migrate

# Собираем статику (если нужно)
python manage.py collectstatic --noinput

# Создаём пользователей
python manage.py shell << EOF
from django.contrib.auth.models import User

# Создаём первого пользователя
User.objects.create_user('user1', 'user1@example.com', 'password1')

# Создаём второго пользователя
User.objects.create_user('user2', 'user2@example.com', 'password2')

EOF

# Запуск приложения
exec "$@"
