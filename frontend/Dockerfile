# Используем официальный Node.js образ
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем зависимости и устанавливаем их
COPY package*.json ./
RUN npm install

# Копируем остальной исходный код
COPY . .

# Собираем production-сборку
RUN npm run build

# Открываем порт
EXPOSE 3000

# Устанавливаем окружение и запускаем production-сервер
ENV NODE_ENV=production
CMD ["npm", "run", "start"]
