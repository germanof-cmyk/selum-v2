const extensions: Record<string, string> = {
  "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/avif": "avif",
};

export async function validateImageUpload(file: File) {
  const extension = extensions[file.type];
  if (!extension || file.size < 1 || file.size > 15 * 1024 * 1024) throw new Error("Use PNG, JPG, WebP ou AVIF de até 15 MB.");
  const bytes = new Uint8Array(await file.arrayBuffer());
  const ascii = (start: number, end: number) => new TextDecoder("ascii").decode(bytes.slice(start, end));
  const valid = file.type === "image/png" ? [137, 80, 78, 71, 13, 10, 26, 10].every((value, index) => bytes[index] === value)
    : file.type === "image/jpeg" ? bytes[0] === 255 && bytes[1] === 216
    : file.type === "image/webp" ? ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP"
    : ascii(4, 8) === "ftyp" && ["avif", "avis"].includes(ascii(8, 12));
  if (!valid) throw new Error("O arquivo não corresponde ao formato da imagem.");
  return { bytes, extension };
}
