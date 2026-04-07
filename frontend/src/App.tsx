import { useState, useEffect, useCallback } from 'react';
import { useONNXInference } from './hooks/useONNXInference';
import { InferenceState } from './types';
import type { ClassificationResult } from './types';
import ImageUpload from './components/ImageUpload/ImageUpload';
import ModelSelector from './components/ModelSelector/ModelSelector';
import PredictionResult from './components/PredictionResult/PredictionResult';
import ClassCards from './components/ClassCards/ClassCards';
import ProgressIndicator from './components/ProgressIndicator/ProgressIndicator';
import './App.css';

const DEFAULT_MODELS = ['resnet20.onnx'];

function App() {
  const { state, error, modelInfo, loadModel, classify, loadModelFromFile } = useONNXInference();
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODELS[0]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [prediction, setPrediction] = useState<ClassificationResult | null>(null);

  // Загрузка модели по умолчанию
  useEffect(() => {
    loadModel(`./models/${selectedModel}`);
  }, []);

  // Смена модели
  const handleModelSelect = useCallback(
    (model: string) => {
      setSelectedModel(model);
      loadModel(`./models/${model}`);
      setPrediction(null);
    },
    [loadModel]
  );

  // Загрузка изображения
  const handleImageSelect = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    setPrediction(null);

    // Создаём Image элемент для ONNX
    const img = new Image();
    img.onload = () => {
      setImageElement(img);
    };
    img.src = url;
  }, []);

  // Классификация
  const handleClassify = useCallback(async () => {
    if (!imageElement) return;
    const result = await classify(imageElement);
    if (result) {
      setPrediction(result);
    }
  }, [imageElement, classify]);

  // Загрузка своей модели
  const handleModelUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        loadModelFromFile(file);
      }
    },
    [loadModelFromFile]
  );

  const isLoadingModel = state === InferenceState.LOADING_MODEL;
  const isClassifying = state === InferenceState.INFERRING;

  return (
    <div className="app">
      <div className="app-bg" />
      <main className="app-content">
        <header className="app-header">
          <h1>🦎 Классификация рептилий</h1>
          <p className="app-subtitle">ResNet20 • ONNX Runtime Web • Браузерный инференс</p>
        </header>

        <div className="app-container">
          {/* Выбор модели */}
          <ModelSelector
            models={DEFAULT_MODELS}
            selectedModel={selectedModel}
            onSelect={handleModelSelect}
            isLoading={isLoadingModel}
          />

          {/* Загрузка своей модели */}
          <div className="upload-model">
            <label htmlFor="model-upload" className="upload-model-btn">
              📁 Загрузить свою .onnx модель
            </label>
            <input
              id="model-upload"
              type="file"
              accept=".onnx"
              onChange={handleModelUpload}
              style={{ display: 'none' }}
            />
            {modelInfo && <span className="current-model">Текущая: {modelInfo.name}</span>}
          </div>

          {/* Drag & Drop зона */}
          <ImageUpload onImageSelect={handleImageSelect} />

          {/* Прогресс */}
          <ProgressIndicator
            state={isLoadingModel ? 'loading' : isClassifying ? 'inferring' : null}
          />

          {/* Ошибка */}
          {error && <div className="error">{error}</div>}

          {/* Предпросмотр + Классификация */}
          {imagePreview && (
            <div className="preview-section">
              <img src={imagePreview} alt="Preview" className="preview-image" />
              <button
                className="classify-btn"
                onClick={handleClassify}
                disabled={isClassifying || state === InferenceState.LOADING_MODEL}
              >
                {isClassifying ? 'Классификация...' : '🔍 Классифицировать'}
              </button>
            </div>
          )}

          {/* Результат */}
          {prediction && imagePreview && (
            <PredictionResult result={prediction} imageUrl={imagePreview} />
          )}

          {/* Карточки классов */}
          <ClassCards />
        </div>

        <footer className="app-footer">
          <p>Домашнее задание №1 • Распознавание природных сигналов • МГТУ им. Баумана</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
