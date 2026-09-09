// Ridimensiona e comprime un'immagine nel browser, PRIMA di caricarla.
// Una foto da iPhone può pesare 3-8 MB: qui la portiamo a poche centinaia di KB,
// così il sito si carica molto più velocemente per chi lo visita.
export async function compressImage(
  file: File,
  maxWidth = 1600,
  quality = 0.82
): Promise<File> {
  // Le immagini già piccole non hanno bisogno di essere toccate
  if (file.size < 300 * 1024) {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);

    const scale = Math.min(1, maxWidth / bitmap.width);
    const targetWidth = Math.round(bitmap.width * scale);
    const targetHeight = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);

    // Il PNG resta PNG (per non perdere la trasparenza), tutto il resto diventa JPEG
    const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, outputType, quality)
    );

    if (!blob) return file;

    const newName =
      file.name.replace(/\.(heic|heif|jpg|jpeg|png|webp)$/i, "") +
      (outputType === "image/png" ? ".png" : ".jpg");

    return new File([blob], newName, { type: outputType });
  } catch {
    // Se per qualche motivo la compressione fallisce, carichiamo comunque
    // il file originale piuttosto che bloccare tutto
    return file;
  }
}
