export async function validateModel(file: File): Promise<boolean> {
  if (!file.name.endsWith('.onnx')) {
    return false;
  }

  try {
    // Проверяем, что файл можно прочитать как ArrayBuffer
    const buffer = await file.arrayBuffer();
    if (buffer.byteLength === 0) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
