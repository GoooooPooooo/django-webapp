#  Быстрый старт - Домашнее задание №1

## 1⃣ Установка зависимостей

```bash
cd homework
make install
```

---

## 2⃣ Подготовка данных

### Вариант A: Тестовые заглушки (для демонстрации)
```bash
make download-placeholders
```
Создаёт по 10 тестовых изображений для каждого класса.

### Вариант B: Скачать вручную (для реального обучения)
```bash
# См. подробную инструкцию
cat DATA_DOWNLOAD.md

# Кратко:
# 1. Установите расширение Image downloader - Imageye для Chrome
# 2. Скачайте изображения: крокодил, аллигатор, кайман (≥100 на класс)
# 3. Разложите в папки: data/крокодил/, data/аллигатор/, data/кайман/
```

---

## 3⃣ Запуск приложения

### Вариант 1: Docker с MinIO S3 (рекомендуется)
```bash
# Запустить всё (Django + MinIO S3)
make docker-up

# Доступ:
# - Django: http://localhost:8000
# - MinIO Console: http://localhost:9001 (minioadmin/minioadmin)

# Остановить
make docker-down
```

### Вариант 2: Локальный запуск
```bash
# Запустить MinIO
make minio-up

# Загрузить данные в S3
make upload-all

# Запустить Django
make migrate
make run
```

---

## 4⃣ Обучение модели (Google Colab)

1. Откройте `colab_notebook.ipynb` в Google Colab
2. Загрузите изображения в `/content/крокодил/`, `/content/аллигатор/`, `/content/кайман/`
3. Запустите все ячейки
4. Скачайте готовую модель `cifar100.onnx`
5. Положите модель в `media/models/`

---

##  Основные команды Makefile

### Данные
```bash
make download-placeholders     # Создать тестовые заглушки
make download-all              # Скачать все классы (требуется Chrome)
make download-class CLASS=тигр # Скачать один класс
```

### S3 / MinIO
```bash
make minio-up          # Запустить MinIO
make upload-all        # Загрузить всё в S3
make upload-model MODEL=model.onnx  # Загрузить модель
make s3-list           # Показать файлы в S3
```

### Django
```bash
make run               # Запустить сервер
make migrate           # Применить миграции
make docker-up         # Запустить Docker
```

### Очистка
```bash
make clean             # Очистить кэш
make clean-all         # Полная очистка
```

---

##  Структура проекта

```
homework/
├── data/                    # Исходные изображения
│   ├── крокодил/
│   ├── аллигатор/
│   └── кайман/
├── dz1/                     # Django проект
│   ├── settings.py
│   ├── urls.py
│   ├── views.py
│   └── templates/
│       └── scorepage.html
├── media/                   # Медиа файлы
│   ├── images/             # Загруженные изображения
│   └── models/             # ONNX модели
├── colab_notebook.ipynb    # Ноутбук для обучения
├── Makefile                # Команды управления
├── docker-compose.yml      # Docker с MinIO
├── requirements.txt        # Зависимости
├── DATA_DOWNLOAD.md        # Инструкция по скачиванию
└── README.md               # Полная документация
```

---

##  Решение проблем

### Ошибка: externally-managed-environment
```bash
# Используйте виртуальное окружение
make venv
source venv/bin/activate
make install
```

### Ошибка: Chrome failed to start
Используйте ручной способ скачивания (см. DATA_DOWNLOAD.md)

### Ошибка: ModuleNotFoundError
```bash
make install
# или
pip install -r requirements.txt --break-system-packages
```

---

##  Контакты

Вопросы и проблемы:
- Проверьте `README.md`
- Проверьте `DATA_DOWNLOAD.md`
- Запустите `make help` для списка команд

---

##  Чек-лист готовности

- [ ] Установлены зависимости (`make install`)
- [ ] Скачаны изображения (≥100 на класс)
- [ ] Запущен MinIO (`make minio-up`)
- [ ] Данные загружены в S3 (`make upload-all`)
- [ ] Приложение запущено (`make docker-up`)
- [ ] Модель обучена в Colab и загружена в `media/models/`
- [ ] Веб-приложение классифицирует изображения

---

**Удачи с домашним заданием! **
