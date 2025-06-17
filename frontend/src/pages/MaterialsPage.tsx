import React, { useEffect, useState } from "react";
import { fetchMaterials, deleteMaterial } from "../api/api";
import AddMaterialForm from "../components/AddMaterialForm";
import EditMaterialForm, { Material } from "../components/EditMaterialForm";
import MaterialComments from "../components/MaterialComments";
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Grid, 
  Button, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Chip,
  Avatar,
  IconButton,
  Tooltip
} from "@mui/material";
import { 
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Book as BookIcon,
  Event as EventIcon
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

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

  // Сохраняем статус "выполнено" в localStorage
  useEffect(() => {
    localStorage.setItem("hw_done_" + email, JSON.stringify(done));
  }, [done, email]);

  const handleMarkDone = (id: number) => {
    setDone((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEdit = (material: Material) => {
    setSelectedMaterial(material);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setSelectedMaterial(null);
  };

  const loadMaterials = async () => {
    setLoading(true);
    try {
      const data = await fetchMaterials();
      setMaterials(data);
    } catch (err) {
      setError("Ошибка загрузки материалов");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      await deleteMaterial(id, token);
      loadMaterials();
    } catch {
      setError("Ошибка удаления материала");
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: ru });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        bgcolor: "#c3b8ff",
        minHeight: "100vh",
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        sx={{ mb: 4 }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mb: 2,
            background: "linear-gradient(45deg,rgb(32, 28, 100) 0%,rgb(120, 145, 233) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          Учебные материалы
        </Typography>

        {role === "admin" && (
          <AddMaterialForm onSuccess={loadMaterials} />
        )}
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Grid container spacing={3}>
        <AnimatePresence>
          {materials.map((mat) => (
            <Grid item xs={12} md={6} lg={4} key={mat.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <Accordion
                  sx={{
                    borderRadius: "16px",
                    boxShadow: "0 8px 24px rgba(136, 162, 255, 0.1)",
                    overflow: "hidden",
                    "&.Mui-expanded": {
                      boxShadow: "0 12px 32px rgba(136, 162, 255, 0.15)",
                    },
                    bgcolor: "background.paper",
                  }}
                  disableGutters
                >
                  <AccordionSummary
                    expandIcon={
                      <ExpandMoreIcon sx={{ color: "#88A2FF", fontSize: 28 }} />
                    }
                    sx={{
                      minHeight: 80,
                      px: 3,
                      py: 1,
                      bgcolor: done[mat.id] ? "rgba(166, 196, 159, 0.1)" : "rgba(136, 162, 255, 0.05)",
                      borderLeft: `4px solid ${done[mat.id] ? "#A6C49F" : "#88A2FF"}`,
                    }}
                  >
                    <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
                      <AssignmentIcon
                        sx={{ 
                          color: done[mat.id] ? "#A6C49F" : "#88A2FF",
                          mr: 2,
                          fontSize: 28
                        }}
                      />
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          fontFamily: "'Montserrat', sans-serif",
                          color: "#2D3748",
                        }}
                      >
                        {mat.title}
                      </Typography>
                    </Box>
                    {done[mat.id] && (
                      <Chip
                        icon={<CheckCircleIcon />}
                        label="Выполнено"
                        color="success"
                        size="small"
                        sx={{ ml: 2 }}
                      />
                    )}
                  </AccordionSummary>

                  <AccordionDetails sx={{ px: 3, pb: 3, pt: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <BookIcon sx={{ color: "#718096", mr: 1, fontSize: 18 }} />
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "#718096", fontWeight: 500 }}
                      >
                        {mat.subject}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <PersonIcon sx={{ color: "#718096", mr: 1, fontSize: 18 }} />
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "#718096", fontWeight: 500 }}
                      >
                        {mat.lecturer}
                      </Typography>
                    </Box>

                    <Typography
                      sx={{
                        mt: 2,
                        mb: 3,
                        fontFamily: "'Montserrat', sans-serif",
                        lineHeight: 1.7,
                        color: "#4A5568",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {mat.content}
                    </Typography>

                    <Box
                      sx={{
                        p: 2,
                        mb: 3,
                        borderRadius: "12px",
                        bgcolor: "rgba(255, 178, 247, 0.05)",
                        border: "1px solid rgba(255, 178, 247, 0.2)",
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          color: "#E53E3E",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <AssignmentIcon sx={{ mr: 1, fontSize: 20 }} />
                        Домашнее задание
                      </Typography>
                      <Typography sx={{ whiteSpace: "pre-line" }}>
                        {mat.homework || "Нет задания"}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Дата лекции
                        </Typography>
                        <Typography sx={{ fontWeight: 500 }}>
                          {formatDate(mat.date)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Срок сдачи
                        </Typography>
                        <Typography sx={{ fontWeight: 500 }}>
                          {formatDate(mat.homework_due)}
                        </Typography>
                      </Box>
                    </Box>

                    {role !== "admin" && (
                      <Button
                        component={motion.div}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        variant={done[mat.id] ? "contained" : "outlined"}
                        color={done[mat.id] ? "success" : "primary"}
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleMarkDone(mat.id)}
                        sx={{
                          borderRadius: "12px",
                          px: 3,
                          py: 1.5,
                          fontWeight: 600,
                          mb: 3,
                        }}
                      >
                        {done[mat.id] ? "Выполнено" : "Отметить выполненным"}
                      </Button>
                    )}

                    {role === "admin" && (
                      <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                        <Tooltip title="Редактировать">
                          <IconButton
                            onClick={() => handleEdit(mat)}
                            sx={{
                              bgcolor: "rgba(136, 162, 255, 0.1)",
                              "&:hover": {
                                bgcolor: "rgba(136, 162, 255, 0.2)",
                              },
                            }}
                          >
                            <EditIcon color="primary" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Удалить">
                          <IconButton
                            onClick={() => handleDelete(mat.id)}
                            sx={{
                              bgcolor: "rgba(255, 86, 86, 0.1)",
                              "&:hover": {
                                bgcolor: "rgba(255, 86, 86, 0.2)",
                              },
                            }}
                          >
                            <DeleteIcon color="error" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}

                    <MaterialComments materialId={mat.id} role={role} />
                  </AccordionDetails>
                </Accordion>
              </motion.div>
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>

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