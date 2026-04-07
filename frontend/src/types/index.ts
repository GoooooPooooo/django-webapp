export const CLASS_LABELS = ['Варан', 'Хамелеон', 'Геккон'] as const;

export type ClassLabel = (typeof CLASS_LABELS)[number];

export interface ClassificationResult {
  classId: number;
  className: ClassLabel;
  confidence: number;
  probabilities: number[];
}

export interface ModelInfo {
  name: string;
  inputShape: number[];
  isNCHW: boolean;
}

export const InferenceState = {
  IDLE: 'idle',
  LOADING_MODEL: 'loading_model',
  READY: 'ready',
  INFERRING: 'inferring',
  ERROR: 'error',
} as const;

export type InferenceState = (typeof InferenceState)[keyof typeof InferenceState];
