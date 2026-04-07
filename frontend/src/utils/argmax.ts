export function argmax(arr: number[] | Float32Array | Float64Array): number {
  let maxIdx = 0;
  let maxVal = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > maxVal) {
      maxVal = arr[i];
      maxIdx = i;
    }
  }
  return maxIdx;
}

export function softmax(arr: number[] | Float32Array | Float64Array): number[] {
  const exps = Array.from(arr).map((v) => Math.exp(v - Math.max(...Array.from(arr))));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}
