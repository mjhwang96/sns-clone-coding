// Cloudinary API 재사용을 위한 서비스 파일
import imageCompression from "browser-image-compression";

// Cloudinary에 저장하기 위한 이미지 압축
const compressImage = async(file: File) => {
  const options = {
    maxSizeMB: 0.5,        // 최대 용량
    maxWidthOrHeight: 512, // 해상도 제한
    useWebWorker: true
  }

  const compressedFile = await imageCompression(file, options);
  return compressedFile;
}

export const uploadImage = async (file: File, folder: string): Promise<string> => {
  try {
    // 1. 이미지 압축
    const compressedFile = await compressImage(file);

    // 2. Cloudinary 업로드
    const url =
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;
    const formData = new FormData();
    formData.append("file", compressedFile);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", folder); // folder: profile, post

    const res = await fetch(url, {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    return data.secure_url; // Cloudinary에 이미지 업로드 후 URL 확보

  } catch (error) {
    console.error(error);
    return "";
  }
}