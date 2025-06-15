import axios from "axios";
const API_URL = "http://localhost:4000/api";

export async function login(email, password) {
  const res = await axios.post(`${API_URL}/auth/login`, { email, password });
  return res.data;
}

export async function register(email, password, role = "user") {
  const res = await axios.post(`${API_URL}/auth/register`, {
    email,
    password,
    role,
  });
  return res.data;
}

export async function fetchMaterials() {
  const res = await axios.get(`${API_URL}/materials`);
  return res.data;
}

// Удаление материала
export async function deleteMaterial(id, token) {
  await axios.delete(
    `${API_URL}/materials/${id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

export async function createMaterial(data, token) {
  await axios.post(
    "http://localhost:4000/api/materials",
    data,
    { headers: { Authorization: `Bearer ${token}` } }
  );
}
export async function updateMaterial(id, data, token) {
  await axios.put(
    `${API_URL}/materials/${id}`,
    data,
    { headers: { Authorization: `Bearer ${token}` } }
  );
}
// Получить комментарии
export async function fetchComments(materialId) {
  const res = await axios.get(`${API_URL}/materials/${materialId}/comments`);
  return res.data;
}

// Оставить комментарий с файлом
export async function addComment(materialId, text, file, user_email = "anon") {
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