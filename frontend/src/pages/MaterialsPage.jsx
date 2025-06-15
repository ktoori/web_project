import React, { useEffect, useState } from "react";
import { fetchMaterials, deleteMaterial } from "../api/api";
import AddMaterialForm from "../components/AddMaterialForm";
import EditMaterialForm from "../components/EditMaterialForm";
import MaterialComments from "../components/MaterialComments";
import { Box, Typography, Paper, CircularProgress, Grid, Button } from "@mui/material";

export default function MaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const role = localStorage.getItem("role");
  const [editOpen, setEditOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const handleEdit = (material) => {
    setSelectedMaterial(material);
    setEditOpen(true);
  };
  const handleEditClose = () => {
    setEditOpen(false);
    setSelectedMaterial(null);
  };

  const loadMaterials = () => {
    setLoading(true);
    fetchMaterials()
      .then(data => {
        setMaterials(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Ошибка загрузки материалов");
        setLoading(false);
      });
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  // Функция для удаления (только для admin)
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await deleteMaterial(id, token);
      loadMaterials();
    } catch {
      setError("Ошибка удаления материала");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Учебные материалы</Typography>
      {/* Показываем форму добавления только для admin */}
      {role === "admin" && <AddMaterialForm onSuccess={loadMaterials} />}
      {error && <Typography color="error">{error}</Typography>}
      <Grid container spacing={2}>
        {materials.map(mat => (
          <Grid item xs={12} md={6} lg={4} key={mat.id}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">{mat.title}</Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {mat.subject} | {mat.lecturer}
              </Typography>
              <Typography sx={{ mt: 1 }}>{mat.content}</Typography>
              <Typography sx={{ mt: 2, fontWeight: 'bold' }}>
                ДЗ: {mat.homework}
              </Typography>
              <Typography>Дата лекции: {mat.date}</Typography>
              <Typography>Срок сдачи ДЗ: {mat.homework_due}</Typography>
              {/* Кнопки для админа */}
              {role === "admin" && (
                <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleEdit(mat)}
                  >
                    Редактировать
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => handleDelete(mat.id)}
                  >
                    Удалить
                  </Button>
                </Box>
              )}
            </Paper>
           <MaterialComments materialId={mat.id} role={role} />
          </Grid>
        ))}
      </Grid>
      {/* Модалка для редактирования */}
      <EditMaterialForm
        open={editOpen}
        onClose={handleEditClose}
        material={selectedMaterial || {}}
        onSuccess={loadMaterials}
      />
    </Box>
  );
}
