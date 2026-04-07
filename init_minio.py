"""
Скрипт инициализации MinIO:
1. Создаёт бакет dz1-media
2. Загружает ONNX модели из media/models/
3. Делает бакет публичным
"""
import boto3
import os
from pathlib import Path

# Настройки подключения
ENDPOINT_URL = os.environ.get('AWS_S3_ENDPOINT_URL', 'http://localhost:9000')
ACCESS_KEY = os.environ.get('AWS_ACCESS_KEY_ID', 'minioadmin')
SECRET_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY', 'minioadmin')
BUCKET_NAME = os.environ.get('AWS_STORAGE_BUCKET_NAME', 'dz1-media')

# Путь к моделям
PROJECT_DIR = Path(__file__).resolve().parent / 'web-site-dl'
MODELS_DIR = PROJECT_DIR / 'media' / 'models'

def create_bucket(s3_client):
    """Создание бакета"""
    try:
        s3_client.head_bucket(Bucket=BUCKET_NAME)
        print(f'✅ Бакет {BUCKET_NAME} уже существует')
    except Exception:
        print(f'📦 Создание бакета {BUCKET_NAME}...')
        s3_client.create_bucket(Bucket=BUCKET_NAME)
        print(f'✅ Бакет {BUCKET_NAME} создан')

def set_public_policy(s3_client):
    """Делаем бакет публичным для чтения"""
    policy = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": "*",
                "Action": ["s3:GetObject"],
                "Resource": [f"arn:aws:s3:::{BUCKET_NAME}/*"]
            }
        ]
    }
    try:
        s3_client.put_bucket_policy(Bucket=BUCKET_NAME, Policy=str(policy).replace("'", '"'))
        print(f'✅ Бакет {BUCKET_NAME} сделан публичным')
    except Exception as e:
        print(f'⚠️ Ошибка установки политики: {e}')

def upload_models(s3_client):
    """Загрузка ONNX моделей в S3"""
    if not MODELS_DIR.exists():
        print(f'❌ Директория моделей не найдена: {MODELS_DIR}')
        return

    onnx_files = list(MODELS_DIR.glob('*.onnx'))
    if not onnx_files:
        print('❌ ONNX модели не найдены')
        return

    print(f'\n📤 Загрузка {len(onnx_files)} моделей...')
    for model_file in onnx_files:
        key = f'media/models/{model_file.name}'
        print(f'  ⬆️  {model_file.name}...')
        s3_client.upload_file(
            str(model_file),
            BUCKET_NAME,
            key,
            ExtraArgs={'ContentType': 'application/octet-stream'}
        )
        print(f'  ✅ {model_file.name} загружена')

def list_files(s3_client):
    """Список файлов в бакете"""
    print(f'\n📋 Файлы в бакете {BUCKET_NAME}:')
    response = s3_client.list_objects_v2(Bucket=BUCKET_NAME)
    if 'Contents' in response:
        for obj in response['Contents']:
            size_kb = obj['Size'] / 1024
            print(f'  📄 {obj["Key"]} ({size_kb:.1f} KB)')
    else:
        print('  (пусто)')

def main():
    print('=' * 50)
    print('Инициализация MinIO S3')
    print('=' * 50)
    print(f'Endpoint: {ENDPOINT_URL}')
    print(f'Bucket: {BUCKET_NAME}')
    print(f'Models: {MODELS_DIR}')
    print('=' * 50)

    # Подключение к MinIO
    try:
        s3_client = boto3.client(
            's3',
            endpoint_url=ENDPOINT_URL,
            aws_access_key_id=ACCESS_KEY,
            aws_secret_access_key=SECRET_KEY,
            region_name='us-east-1'
        )
        # Проверка подключения
        s3_client.list_buckets()
        print('✅ Подключение к MinIO успешно\n')
    except Exception as e:
        print(f'❌ Ошибка подключения к MinIO: {e}')
        print(f'   Убедитесь что MinIO запущен: {ENDPOINT_URL}')
        return

    # Инициализация
    create_bucket(s3_client)
    set_public_policy(s3_client)
    upload_models(s3_client)
    list_files(s3_client)

    print('\n' + '=' * 50)
    print('✅ Инициализация завершена!')
    print(f'🌐 MinIO Console: http://localhost:9001')
    print(f'🔑 Логин: minioadmin / Пароль: minioadmin')
    print('=' * 50)

if __name__ == '__main__':
    main()
