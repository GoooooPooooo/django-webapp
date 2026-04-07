export function preprocessImage(
  imageElement: HTMLImageElement | HTMLCanvasElement,
  isNCHW: boolean
): Float32Array {
  const size = 32;

  // Создаём canvas для ресайза
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(imageElement, 0, 0, size, size);

  // Получаем пиксели
  const imageData = ctx.getImageData(0, 0, size, size);
  const { data } = imageData;

  // Создаём тензор
  const tensor = new Float32Array(3 * size * size);

  for (let i = 0; i < size * size; i++) {
    // Нормализация [0, 1]
    const r = data[i * 4] / 255.0;
    const g = data[i * 4 + 1] / 255.0;
    const b = data[i * 4 + 2] / 255.0;

    if (isNCHW) {
      // [C, H, W] — каналы сначала
      tensor[i] = r;
      tensor[size * size + i] = g;
      tensor[2 * size * size + i] = b;
    } else {
      // [H, W, C] — каналы в конце
      tensor[i * 3] = r;
      tensor[i * 3 + 1] = g;
      tensor[i * 3 + 2] = b;
    }
  }

  return tensor;
}
