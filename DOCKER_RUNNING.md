#  Проект полностью готов!

##  Статус

Все сервисы запущены и работают!

---

##  Запущенные сервисы

### Django веб-приложение
- **URL:** http://localhost:8000
- **Статус:**  Работает
- **Контейнер:** homework-web-1

### MinIO S3 хранилище
- **API:** http://localhost:9000
- **Console:** http://localhost:9001
- **Логин/пароль:** minioadmin/minioadmin
- **Статус:**  Работает
- **Контейнер:** dz1-minio

---

##  Команды управления

### Запуск проекта
```bash
cd homework

# Запустить всё (Django + MinIO)
docker-compose up -d

# Остановить всё
docker-compose down

# Перезапустить
docker-compose restart
```

### Просмотр логов
```bash
# Логи Django
docker-compose logs web

# Логи MinIO
docker-compose logs minio

# Все логи в реальном времени
docker-compose logs -f
```

### Остановка
```bash
# Остановить всё
docker-compose down

# Остановить только Django
docker-compose stop web

# Остановить только MinIO
docker-compose stop minio
```

---

##  Веб-интерфейс

### Django приложение
1. Откройте http://localhost:8000
2. Загрузите изображение
3. Нажмите "Классифицировать"

**Примечание:** Для работы классификации нужна обученная модель ONNX.

### MinIO Console
1. Откройте http://localhost:9001
2. Логин: `minioadmin`
3. Пароль: `minioadmin`
4. Просматривайте файлы в бакете `dz1-media`

---

##  Структура данных

```
homework/
├── web-site-dl/
│   ├── media/              # Том Docker (media_volume)
│   │   ├── images/         # Загруженные пользователями изображения
│   │   └── models/         # ONNX модели
│   ├── mysite/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── views.py
│   │   └── templates/
│   │       └── scorepage.html
│   └── manage.py
├── data/                   # Исходные данные (не в Docker)
│   ├── крокодил/
│   ├── аллигатор/
│   └── кайман/
├── docker-compose.yml
├── Dockerfile
├── requirements-django.txt
└── Makefile
```

---

##  Следующие шаги

### 1. Скачать реальные изображения
См. **[DATA_DOWNLOAD.md](DATA_DOWNLOAD.md)**

```bash
# Установите расширение Chrome: Image downloader - Imageye
# Скачайте ≥100 изображений на каждый класс
# Разложите в папки: data/крокодил/, data/аллигатор/, data/кайман/
```

### 2. Загрузить данные в S3
```bash
# Установите boto3 если ещё не установлен
pip install boto3 --break-system-packages

# Загрузить всё в S3
python s3_upload.py --dir data/крокодил media/images/крокодил/
python s3_upload.py --dir data/аллигатор media/images/аллигатор/
python s3_upload.py --dir data/кайман media/images/кайман/
```

### 3. Обучить модель в Google Colab
1. Откройте `colab_notebook.ipynb` в Google Colab
2. Загрузите изображения в `/content/`
3. Запустите все ячейки
4. Скачайте `cifar100.onnx`

### 4. Добавить модель в Docker
```bash
# Скопируйте модель в папку media
cp cifar100.onnx web-site-dl/media/models/

# Перезапустите Django
docker-compose restart web
```

---

##  Полезные команды

### Docker
```bash
docker-compose up -d           # Запустить всё
docker-compose down            # Остановить всё
docker-compose ps              # Статус контейнеров
docker-compose logs -f         # Логи в реальном времени
docker-compose restart web     # Перезапустить Django
```

### Makefile
```bash
make help              # Справка по всем командам
make download-placeholders  # Создать тестовые изображения
make upload-all        # Загрузить данные в S3
make s3-list         # Показать файлы в S3
make minio-console   # Показать доступ к MinIO Console
```

### Django в Docker
```bash
# Выполнить команду внутри контейнера
docker-compose exec web python manage.py <command>

# Например
docker-compose exec web python manage.py createsuperuser
docker-compose exec web python manage.py shell
```

---

##  Решение проблем

### Порт 8000 занят
```bash
# Найти процесс
lsof -i :8000

# Убить процесс
kill -9 <PID>

# Или изменить порт в docker-compose.yml
ports:
  - "8001:8000"  # Использовать порт 8001
```

### Ошибки в логах
```bash
# Посмотреть логи
docker-compose logs web

# Перезапустить Django
docker-compose restart web

# Пересобрать и перезапустить
docker-compose up -d --build
```

### MinIO не доступен
```bash
# Проверить статус
docker-compose ps

# Перезапустить
docker-compose restart minio minio-init
```

---

##  Чек-лист

- [x] Docker Compose настроен
- [x] Django запущен
- [x] MinIO запущен
- [x] Веб-интерфейс доступен
- [ ] Скачаны реальные изображения (≥100 на класс)
- [ ] Модель обучена в Colab
- [ ] Модель загружена в `media/models/`
- [ ] Классификация работает

---

##  Документация

- **[README.md](README.md)** - Полная документация
- **[DATA_DOWNLOAD.md](DATA_DOWNLOAD.md)** - Как скачать изображения
- **[QUICKSTART.md](QUICKSTART.md)** - Быстрый старт
- **[PROJECT_READY.md](PROJECT_READY.md)** - Общая информация о проекте

---

**Проект готов к использованию! **
