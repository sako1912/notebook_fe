interface UploadResponse {
  message: string;
  file_url: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const uploadFile = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("filename", file.name);

  console.log("요청 URL:", `${API_URL}/upload`); // 실제 요청 URL 확인

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "파일 업로드에 실패했습니다.");
  }

  return response.json();
};
