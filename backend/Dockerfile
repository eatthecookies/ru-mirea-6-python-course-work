# Используем официальный образ Python
FROM python:3.13-slim

# Установка зависимостей системы
RUN apt-get update && apt-get install -y \
    libpq-dev gcc netcat-traditional curl && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Устанавливаем рабочую директорию
WORKDIR /app

# Установка Python-зависимостей
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Копируем проект
COPY . .

# Создаем директории, если они ещё не созданы (на случай отсутствия в .git)
RUN mkdir -p /app/static /app/staticfiles /app/media

# Копируем и даём права на entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Команда запуска
ENTRYPOINT ["/entrypoint.sh"]
