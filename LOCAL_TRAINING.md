# 🚀 Локальное обучение модели

## 📋 Быстрый старт

### 1. Запуск обучения

```bash
cd homework
python3 train_local.py
```

Или в фоне (чтобы не занимало терминал):

```bash
nohup python3 train_local.py > training_log.txt 2>&1 &

# Просмотр прогресса
tail -f training_log.txt
```

### 2. Что делает скрипт

1. **Загружает данные** из папок:
   - `data/крокодил/`
   - `data/аллигатор/`
   - `data/кайман/`

2. **Разделяет** на train (80%) и test (20%)

3. **Применяет аугментацию**:
   - RandomHorizontalFlip
   - RandomRotation
   - ColorJitter

4. **Обучает модель** ResNet18 с Transfer Learning

5. **Сохраняет**:
   - `model_weights.pth` - веса модели
   - `model_full.pt` - полная модель
   - `cifar100.onnx` - модель для веба
   - Копирует ONNX в `web-site-dl/media/models/`

### 3. После обучения

```bash
# Перезапустите Django
docker-compose restart web

# Откройте веб-приложение
http://localhost:8000

# Загрузите изображение для классификации
```

---

## 📊 Статистика данных

Сейчас в папках:

| Класс | Изображений | Train | Test |
|-------|-------------|-------|------|
| Крокодил | 168 | 134 | 34 |
| Аллигатор | 164 | 131 | 33 |
| Кайман | 270 | 216 | 54 |
| **ВСЕГО** | **602** | **481** | **121** |

---

## ⚙️ Конфигурация

В начале скрипта `train_local.py`:

```python
# Ваши классы
CLASSES = ['крокодил', 'аллигатор', 'кайман']
IMAGE_SIZE = 32
BATCH_SIZE = 32
EPOCHS = 50
LEARNING_RATE = 0.001

# Пути к данным
DATA_DIR = Path('data')
```

### Изменение параметров

```python
# Больше эпох для лучшего качества
EPOCHS = 100

# Больше batch size (если есть GPU память)
BATCH_SIZE = 64

# Меньше learning rate для тонкой настройки
LEARNING_RATE = 0.0001
```

---

## 🎯 Требования

### Минимальные

- Python 3.8+
- 4 GB RAM
- 2 GB свободного места

### Рекомендуемые

- GPU с CUDA (ускорение в 10-50 раз)
- 8 GB RAM
- SSD диск

---

## 📁 Структура после обучения

```
homework/
├── data/
│   ├── крокодил/      # Исходные данные
│   ├── аллигатор/
│   └── кайман/
├── model_weights.pth  # Веса модели
├── model_full.pt      # Полная модель
├── cifar100.onnx      # Модель для веба
├── training_log.txt   # Лог обучения (если в фоне)
└── web-site-dl/
    └── media/
        └── models/
            └── cifar100.onnx  # Копия для Django
```

---

## 🔍 Мониторинг обучения

### В реальном времени

```bash
# Если запущено в фоне
tail -f training_log.txt
```

### После обучения

```bash
# Посмотреть последние строки
tail -50 training_log.txt

# Посмотреть ошибки
grep -i error training_log.txt
```

---

## 🐛 Решение проблем

### Ошибка: "No module named 'torch'"

```bash
pip install torch torchvision --break-system-packages
```

### Ошибка: "CUDA out of memory"

Уменьшите batch size:
```python
BATCH_SIZE = 16  # или 8
```

### Ошибка: "No data found"

Проверьте пути:
```bash
ls data/крокодил/
ls data/аллигатор/
ls data/кайман/
```

### Обучение слишком медленное

- Используйте GPU (CUDA автоматически определяется)
- Уменьшите EPOCHS до 30
- Уменьшите размер изображения до 224

---

## 📊 Интерпретация результатов

После обучения вы увидите:

```
TRAIN
              precision    recall  f1-score   support
    крокодил     0.9500    0.9400    0.9450       134
   аллигатор     0.9200    0.9300    0.9250       131
      кайман     0.9300    0.9300    0.9300       216

    accuracy                         0.9335       481
```

**Хорошие результаты:**
- Accuracy > 0.90
- Precision/Recall > 0.85 для всех классов

**Если accuracy низкий:**
- Увеличьте EPOCHS
- Добавьте больше данных
- Проверьте баланс классов

---

## 🎓 Примеры

### Пример 1: Быстрое тестирование

```python
# Измените в train_local.py
EPOCHS = 10  # Быстрый тест
BATCH_SIZE = 16
```

### Пример 2: Полное обучение

```python
EPOCHS = 100
BATCH_SIZE = 32
LEARNING_RATE = 0.001
```

### Пример 3: Тонкая настройка

```python
# После базового обучения
EPOCHS = 50
LEARNING_RATE = 0.0001  # Меньше для fine-tuning
```

---

**Готово! 🎉**
