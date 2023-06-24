import browserImageCompression from "browser-image-compression";

/**
 * Convertir la imagen a base64
 */
export const fileToBase64 = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result?.toString() || "")
    };

    fileReader.onerror = (err) => reject(err)
  })
};

/**
 * Comprimir una imagen a webp
 * 5 MB o 4000 px en su dimensión mayor
 */
export const imageProcessor = async (file: File): Promise<File> => {
  try {
    const compressedImage = await browserImageCompression(file, {
      fileType: "image/webp",
      maxSizeMB: 5,
      maxWidthOrHeight: 4000,
      initialQuality: 0.75,
      useWebWorker: true
    });

    return compressedImage;
    
  } catch (error: any) {
    console.log(error.message);
    throw new Error(error.message);
  }
};