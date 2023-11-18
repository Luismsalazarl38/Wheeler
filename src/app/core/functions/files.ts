export async function readFile(file: File): Promise<string | ArrayBuffer> {
  return new Promise<string | ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const target = e.target as FileReader;
      const result = target.result;
      if (result !== null) {
        return resolve(result);
      }
      return reject(null);
    };
    reader.onerror = () => {
      console.error(`FileReader failed on file ${file.name}.`);
      return reject(null);
    };
    if (!file) {
      console.error('No file to read.');
      return reject(null);
    }
    reader.readAsDataURL(file);
  });
}

export function base64ToFile(base64: string, type = 'image/png') {
  const byteString = window.atob(base64);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const int8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    int8Array[i] = byteString.charCodeAt(i);
  }
  return new Blob([int8Array], { type: type });
}

export function base64ToFile2(
  url: string,
  filename: string,
  mimeType = 'image/png'
) {
  if (url.startsWith('data:')) {
    const split = url.split(',');
    if (split && split[0]) {
      const zero = split[0];
      const match = zero.match(/:(.*?);/);
      if (match && match[1]) {
        const mime = match[1];
        const bstr = atob(split[split.length - 1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const file = new File([u8arr], filename, { type: mime || mimeType });
        return Promise.resolve(file);
      }
    }
  }
  return fetch(url)
    .then(res => res.arrayBuffer())
    .then(buf => new File([buf], filename, { type: mimeType }));
}
