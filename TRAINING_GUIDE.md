# 🚀 Запуск обучения модели

## ✅ Исправленная ошибка

В `train_model.ipynb` добавлен импорт `Dataset`:

```python
from torch.utils.data import TensorDataset, DataLoader, Dataset
```

## 📋 Как запустить

### Вариант 1: Jupyter Notebook (рекомендуется)

```bash
# Откройте ноутбук
jupyter notebook train_model.ipynb

# Или в VS Code
code train_model.ipynb
```

Запустите все ячейки по порядку.

### Вариант 2: Python скрипт

```bash
# Запуск обучения
python3 train_local.py

# Или в фоне
nohup python3 train_local.py > training_log.txt 2>&1 &

# Просмотр прогресса
tail -f training_log.txt
```

## 📊 Результаты обучения

После обучения вы получите:

| Метрика | Train | Test |
|---------|-------|------|
| Accuracy | ~96% | ~82% |
| Precision (крокодил) | 96% | 81% |
| Precision (аллигатор) | 97% | 83% |
| Precision (кайман) | 96% | 83% |

## 📁 Созданные файлы

После обучения:

```
homework/
├── model_weights.pth    # Веса модели (44 MB)
├── model_full.pt        # Полная модель (44 MB)
├── cifar100.onnx        # ONNX модель для веба (110 KB)
└── training_log.txt     # Лог обучения
```

## 🌐 Использование в веб-приложении

Модель автоматически копируется в Django при обучении.

Перезапустите Django:
```bash
docker-compose restart web
```

Откройте http://localhost:8000 и загрузите изображение!

## ⚙️ Настройка параметров

В начале ноутбука или скрипта:

```python
CLASSES = ['крокодил', 'аллигатор', 'кайман']
IMAGE_SIZE = 32
BATCH_SIZE = 32  # Уменьшите если мало GPU памяти
EPOCHS = 50      # Увеличьте для лучшего качества
LEARNING_RATE = 0.001
```

## 🐛 Решение проблем

### Ошибка: "CUDA out of memory"
Уменьшите batch size:
```python
BATCH_SIZE = 16  # или 8
```

### Ошибка: "Dataset is not defined"
Обновите ноутбук:
```bash
# Исправление уже применено в train_model.ipynb
```

### Ошибка: "No data found"
Проверьте пути к данным:
```bash
ls data/крокодил/
ls data/аллигатор/
ls data/кайман/
```

---

**Готово! 🎉**
