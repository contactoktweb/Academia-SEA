/**
 * Utilidad para comprimir imágenes en el navegador antes de enviarlas al servidor.
 * Reduce fotos de cámaras/celulares (5-15MB) a ~150-300KB manteniendo excelente nitidez.
 * Si el archivo es un PDF o documento que no es imagen, se devuelve intacto.
 */
export async function compressImage(
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  } = {}
): Promise<File> {
  const {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 0.8,
  } = options;

  // Si no es imagen o es SVG, retornamos el archivo tal cual
  if (!file.type.startsWith("image/") || file.type.includes("svg")) {
    return file;
  }

  // Si ya pesa menos de 250 KB no hace falta comprimir
  if (file.size < 250 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;

        img.onload = () => {
          let width = img.width;
          let height = img.height;

          // Redimensionar manteniendo la relación de aspecto
          if (width > maxWidth || height > maxHeight) {
            if (width / height > maxWidth / maxHeight) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(file);
            return;
          }

          // Fondo blanco por si la imagen tiene transparencias PNG
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          // Convertir a JPEG comprimido
          canvas.toBlob(
            (blob) => {
              if (!blob || blob.size >= file.size) {
                resolve(file);
                return;
              }

              const cleanName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
              const compressedFile = new File([blob], cleanName, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });

              resolve(compressedFile);
            },
            "image/jpeg",
            quality
          );
        };

        img.onerror = () => {
          resolve(file);
        };
      };

      reader.onerror = () => {
        resolve(file);
      };
    } catch {
      resolve(file);
    }
  });
}
