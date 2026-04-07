import { useState, useCallback, useRef } from 'react';
import * as ort from 'onnxruntime-web';
import { InferenceState, CLASS_LABELS } from '../types';
import type { ClassificationResult, ModelInfo } from '../types';
import { preprocessImage } from '../utils/preprocessImage';
import { argmax, softmax } from '../utils/argmax';

export function useONNXInference() {
  const [state, setState] = useState<InferenceState>(InferenceState.IDLE);
  const [error, setError] = useState<string | null>(null);
  const sessionRef = useRef<ort.InferenceSession | null>(null);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);

  const loadModel = useCallback(async (modelUrl: string, modelName?: string) => {
    try {
      setState(InferenceState.LOADING_MODEL);
      setError(null);

      const session = await ort.InferenceSession.create(modelUrl);
      sessionRef.current = session;

      // По умолчанию используем NCHW для ResNet
      const isNCHW = true;
      const inputShape = [1, 3, 32, 32];

      setModelInfo({
        name: modelName || modelUrl.split('/').pop()!,
        inputShape,
        isNCHW,
      });

      setState(InferenceState.READY);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(`Ошибка загрузки модели: ${message}`);
      setState(InferenceState.ERROR);
    }
  }, []);

  const classify = useCallback(
    async (imageElement: HTMLImageElement | HTMLCanvasElement): Promise<ClassificationResult | null> => {
      if (!sessionRef.current || !modelInfo) {
        setError('Модель не загружена');
        setState(InferenceState.ERROR);
        return null;
      }

      try {
        setState(InferenceState.INFERRING);

        // Предобработка
        const tensorData = preprocessImage(imageElement, modelInfo.isNCHW);

        // Создаём входной тензор с batch dimension
        const shape = modelInfo.isNCHW
          ? [1, 3, 32, 32]
          : [1, 32, 32, 3];

        const inputTensor = new ort.Tensor('float32', tensorData, shape);

        // Инференс
        const feed: Record<string, ort.Tensor> = {};
        feed[sessionRef.current.inputNames[0]] = inputTensor;

        const results = await sessionRef.current.run(feed);

        const outputName = sessionRef.current.outputNames[0];
        const output = results[outputName].data as Float32Array;

        // Argmax для предсказания
        const classId = argmax(output);

        // Softmax для вероятностей
        const probabilities = softmax(output);

        setState(InferenceState.READY);
        return {
          classId,
          className: CLASS_LABELS[classId] as ClassificationResult['className'],
          confidence: probabilities[classId],
          probabilities,
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
        setError(`Ошибка классификации: ${message}`);
        setState(InferenceState.ERROR);
        return null;
      }
    },
    [modelInfo]
  );

  const loadModelFromFile = useCallback(async (file: File) => {
    try {
      setState(InferenceState.LOADING_MODEL);
      setError(null);

      const url = URL.createObjectURL(file);
      const session = await ort.InferenceSession.create(url);
      sessionRef.current = session;
      URL.revokeObjectURL(url);

      const inputShape = [1, 3, 32, 32];
      const isNCHW = true;

      setModelInfo({
        name: file.name,
        inputShape,
        isNCHW,
      });

      setState(InferenceState.READY);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(`Ошибка загрузки модели из файла: ${message}`);
      setState(InferenceState.ERROR);
    }
  }, []);

  return { state, error, modelInfo, loadModel, classify, loadModelFromFile };
}
