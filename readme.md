**PWA Менеджер паролей**

Прогрессивное веб-приложение для безопасного хранения паролей локально в браузере.

1. **Возможности**

- Добавление паролей с URL, логином и паролем
- Генератор паролей
- Копирование паролей в буфер обмена
- Безопасное отображение паролей
- Локальное хранение в localStorage
- Установка как мобильное приложение
- Работа в offline режиме

2. **Структура файлов**

```bash
password-manager-pwa/
├── index.html          # Главная HTML страница
├── app.js              # Логика приложения
├── service-worker.js   # Service Worker для PWA
├── manifest.json       # Манифест PWA
├── favicon
└── README.md
```

3. **Локальный запуск**

Для работы PWA требуется HTTPS или localhost. Используйте любой из способов:

**Python:**
```bash
python -m http.server 8000
```

**Node.js (http-server):**
```bash
npx http-server -p 8000
```

**PHP:**
```bash
php -S localhost:8000
```

Затем откройте: http://localhost:8000

4. Тестирование

**Сохранить пароль**

<img width="791" height="642" alt="image" src="https://github.com/user-attachments/assets/4844a68b-a3cc-4ec1-8061-5e428346bb80" />

**Сохранённые пароли**

<img width="770" height="709" alt="image" src="https://github.com/user-attachments/assets/359634ac-2c63-4fcf-9587-cfdf1907c122" />

**Генератор паролей**

<img width="798" height="313" alt="image" src="https://github.com/user-attachments/assets/bf83e062-72e2-4f3d-ae1c-8cc793e4d097" />

**Скрыты паролей**

<img width="444" height="147" alt="image" src="https://github.com/user-attachments/assets/bdb6b3b9-d6a7-4bc6-847c-da3483369e35" />



