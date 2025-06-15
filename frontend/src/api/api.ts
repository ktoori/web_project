import axios from "axios";

export const API_URL = "http://localhost:4000/api";

// Типы для материалов и комментариев
export interface Material {
  id: number;
  subject: string;
  lecturer: string;
  title: string;
  content: string;
  homework: string;
  date: string;
  homework_due: string;
}

export interface Comment {
  id: number;
  material_id: number;
  user_email: string;
  text: string;
  file_path?: string;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  role: "user" | "admin";
}

// Логин
export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await axios.post<AuthResponse>(`${API_URL}/auth/login`, { email, password });
  return res.data;
}

// Регистрация
export async function register(email: string, password: string, role: "user" | "admin" = "user"): Promise<{ message: string }> {
  const res = await axios.post<{ message: string }>(`${API_URL}/auth/register`, { email, password, role });
  return res.data;
}

// Получить все материалы
export async function fetchMaterials(): Promise<Material[]> {
  const res = await axios.get<Material[]>(`${API_URL}/materials`);
  return res.data;
}

// Удаление материала
export async function deleteMaterial(id: number, token: string | null): Promise<void> {
  await axios.delete(`${API_URL}/materials/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

// Создать новый материал
export async function createMaterial(data: Partial<Material>, token: string | null): Promise<void> {
  await axios.post(`${API_URL}/materials`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

// Обновить материал
export async function updateMaterial(id: number, data: Partial<Material>, token: string | null): Promise<void> {
  await axios.put(`${API_URL}/materials/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

// Получить комментарии к материалу
export async function fetchComments(materialId: number): Promise<Comment[]> {
  const res = await axios.get<Comment[]>(`${API_URL}/materials/${materialId}/comments`);
  return res.data;
}

// Оставить комментарий с файлом
export async function addComment(
  materialId: number,
  text: string,
  file?: File | null,
  user_email: string = "anon"
): Promise<void> {
  const formData = new FormData();
  formData.append("text", text);
  formData.append("user_email", user_email);
  if (file) {
    formData.append("file", file);
  }
  await axios.post(`${API_URL}/materials/${materialId}/comments`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
