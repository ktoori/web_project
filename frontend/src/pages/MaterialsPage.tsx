import React, { useEffect, useState } from "react";
import { fetchMaterials, deleteMaterial } from "../api/api";
import AddMaterialForm from "../components/AddMaterialForm";
import EditMaterialForm, { Material } from "../components/EditMaterialForm";
import MaterialComments from "../components/MaterialComments";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const MaterialsPage: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const role = localStorage.getItem("role") || "";
  const email = localStorage.getItem("email") || "";
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [done, setDone] = useState<{ [key: string]: boolean }>({});

  // Загружаем статус "выполнено" из localStorage
  useEffect(() => {
    const data = localStorage.getItem("hw_done_" + email);
    if (data) setDone(JSON.parse(data));
  }, [email]);

  // Сохраняем статус "выполнено" в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem("hw_done_" + email, JSON.stringify(done));
  }, [done, email]);

  const handleMarkDone = (id: number) => {
    setDone(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEdit = (material: Material) => {
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
      .then((data: Material[]) => {
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
  const handleDelete = async (id: number) => {
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
      <Typography variant="h4" gutterBottom>
        Учебные материалы
      </Typography>
      {role === "admin" && <AddMaterialForm onSuccess={loadMaterials} />}
      {error && <Typography color="error">{error}</Typography>}
      <Grid container spacing={2}>
        {materials.map((mat) => (
          <Grid item xs={12} md={6} lg={4} key={mat.id}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" sx={{ flex: 1 }}>
                  {mat.title}
                </Typography>
                {/* Показываем статус для студента */}
                {role !== "admin" && done[mat.id] && (
                  <Typography color="success.main" sx={{ ml: 2 }}>
                    Выполнено
                  </Typography>
                )}
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="subtitle2" color="text.secondary">
                  {mat.subject} | {mat.lecturer}
                </Typography>
                <Typography sx={{ mt: 1 }}>{mat.content}</Typography>
                <Typography sx={{ mt: 2, fontWeight: "bold" }}>
                  ДЗ: {mat.homework}
                </Typography>
                <Typography>Дата лекции: {mat.date}</Typography>
                <Typography>Срок сдачи ДЗ: {mat.homework_due}</Typography>
                {/* Кнопка для студента */}
                {role !== "admin" && (
                  <Button
                    variant={done[mat.id] ? "contained" : "outlined"}
                    color={done[mat.id] ? "success" : "primary"}
                    onClick={() => handleMarkDone(mat.id)}
                    sx={{ mt: 2 }}
                  >
                    {done[mat.id] ? "Выполнено" : "Отметить как выполнено"}
                  </Button>
                )}
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
                <MaterialComments materialId={mat.id} role={role} />
              </AccordionDetails>
            </Accordion>
          </Grid>
        ))}
      </Grid>
      {/* Модалка для редактирования */}
      <EditMaterialForm
        open={editOpen}
        onClose={handleEditClose}
        material={selectedMaterial || ({} as Material)}
        onSuccess={loadMaterials}
      />
    </Box>
  );
};

export default MaterialsPage;
