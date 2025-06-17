import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  TextField,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Box
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { updateMaterial } from "../api/api";
import { motion } from "framer-motion";

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

interface EditMaterialFormProps {
  open: boolean;
  onClose: () => void;
  material: Material;
  onSuccess?: () => void;
}

const initialErrors = {
  subject: false,
  lecturer: false,
  title: false,
  content: false,
  date: false,
  homework_due: false,
  dateLogic: false
};

const EditMaterialForm: React.FC<EditMaterialFormProps> = ({
  open,
  onClose,
  material,
  onSuccess
}) => {
  const [values, setValues] = useState<Material>({ ...material });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ ...initialErrors });
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (open) {
      setValues({ ...material });
      setFieldErrors({ ...initialErrors });
      setError("");
    }
  }, [material, open]);

  // Проверка логики дат (срок сдачи ДЗ >= дата лекции)
  const isDateLogicError = () => {
    if (!values.date || !values.homework_due) return false;
    return new Date(values.homework_due) < new Date(values.date);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFieldErrors((prev) => ({
      ...prev,
      [e.target.name]: false,
      dateLogic: false
    }));
  };

  const safeSlice = (value: string | number | undefined): string => {
    if (typeof value === "string") {
      return value.slice(0, 10);
    }
    return "";
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    let errors = { ...initialErrors };

    // Проверяем заполнение обязательных полей
    ["subject", "lecturer", "title", "content", "date"].forEach((key) => {
      if (!values[key as keyof Material]) errors[key as keyof typeof errors] = true;
    });

    // Проверяем логику дат
    if (isDateLogicError()) {
      errors.homework_due = true;
      errors.dateLogic = true;
    }

    setFieldErrors(errors);

    // Если есть хоть одна ошибка, не отправляем
    if (Object.values(errors).some(Boolean)) {
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await updateMaterial(material.id, values, token);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError("Ошибка при сохранении изменений");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          mt: 7,
          borderRadius: "24px",
          background: "#FFF9F5",
          boxShadow: "0 12px 48px rgba(136, 162, 255, 0.15)",
          overflow: "visible",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: -40,
            right: -40,
            width: "120px",
            height: "120px",
            background: "radial-gradient(circle, rgba(171, 157, 255, 0.08) 0%, transparent 70%)",
            borderRadius: "50%",
            zIndex: 0,
          },
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <DialogTitle
          sx={{
            px: 4,
            pt: 3,
            pb: 1,
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 40,
              width: "48px",
              height: "3px",
              background: "linear-gradient(90deg, #88A2FF 0%, #FFB2F7 100%)",
              borderRadius: "3px",
            }
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography
              variant="h5"
              fontWeight={700}
              fontFamily="Montserrat, sans-serif"
              color="#2D3748"
              letterSpacing={0.5}
            >
              Редактировать материал
            </Typography>
            <IconButton
              onClick={onClose}
              sx={{
                color: "#718096",
                "&:hover": {
                  background: "rgba(136, 162, 255, 0.1)",
                  color: "#88A2FF"
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent
          sx={{
            px: 4,
            pt: 3,
            pb: 0,
            maxHeight: { xs: "70vh", sm: "75vh", md: "75vh" },
            overflowY: "auto"
          }}
        >
          <form onSubmit={handleSubmit} autoComplete="off">
            <Box display="flex" flexDirection="column" gap={2.5} mb={3} mt={3}>
              <TextField
                name="subject"
                label="Предмет"
                value={values.subject}
                onChange={handleChange}
                fullWidth
                error={fieldErrors.subject}
                helperText={fieldErrors.subject ? "Заполните поле" : ""}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", background: "#fff" } }}
              />
              <TextField
                name="lecturer"
                label="ФИО преподавателя"
                value={values.lecturer}
                onChange={handleChange}
                fullWidth
                error={fieldErrors.lecturer}
                helperText={fieldErrors.lecturer ? "Заполните поле" : ""}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", background: "#fff" } }}
              />
              <TextField
                name="title"
                label="Название лекции"
                value={values.title}
                onChange={handleChange}
                fullWidth
                error={fieldErrors.title}
                helperText={fieldErrors.title ? "Заполните поле" : ""}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", background: "#fff" } }}
              />
              <TextField
                name="content"
                label="Текст лекции"
                value={values.content}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                error={fieldErrors.content}
                helperText={fieldErrors.content ? "Заполните поле" : ""}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", background: "#fff" } }}
              />
              <TextField
                name="homework"
                label="Домашнее задание"
                value={values.homework}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", background: "#fff" } }}
              />
              <TextField
                name="date"
                label="Дата лекции"
                type="date"
                value={values.date ? values.date.slice(0, 10) : ""}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={fieldErrors.date}
                helperText={fieldErrors.date ? "Заполните поле" : ""}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", background: "#fff" } }}
              />
              <TextField
                name="homework_due"
                label="Срок сдачи ДЗ"
                type="date"
                value={values.homework_due ? values.homework_due.slice(0, 10) : ""}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={fieldErrors.homework_due}
                helperText={
                  fieldErrors.dateLogic
                    ? "Срок сдачи ДЗ не может быть раньше даты лекции"
                    : ""
                }
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", background: "#fff" } }}
              />
              {error && (
                <Typography color="error" fontSize={15} fontFamily="Montserrat, sans-serif">
                  {error}
                </Typography>
              )}
            </Box>

            <DialogActions sx={{ px: 0, py: 2 }}>
              <Button
                onClick={onClose}
                sx={{
                  borderRadius: "12px",
                  px: 3,
                  py: 1,
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 600,
                  color: "#718096",
                  border: "1px solid #E2E8F0",
                  background: "transparent",
                  "&:hover": {
                    background: "rgba(136, 162, 255, 0.05)",
                    borderColor: "#88A2FF",
                    color: "#88A2FF"
                  }
                }}
              >
                Отмена
              </Button>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    borderRadius: "12px",
                    px: 3,
                    py: 1,
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 700,
                    background: "linear-gradient(90deg, #88A2FF 0%, #AB9DFF 100%)",
                    color: "#FFFFFF",
                    boxShadow: "0 4px 12px rgba(136, 162, 255, 0.24)",
                    "&:hover": {
                      background: "linear-gradient(90deg, #AB9DFF 0%, #88A2FF 100%)",
                      boxShadow: "0 6px 16px rgba(136, 162, 255, 0.32)",
                    },
                    position: "relative",
                    overflow: "hidden",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      top: "-50%",
                      left: "-50%",
                      width: "200%",
                      height: "200%",
                      background: "linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)",
                      transform: "rotate(45deg)",
                      transition: "all 0.5s ease",
                    },
                    "&:hover::after": {
                      left: "100%",
                    },
                  }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Сохранить изменения"
                  )}
                </Button>
              </motion.div>
            </DialogActions>
          </form>
        </DialogContent>
      </motion.div>
    </Dialog>
  );
};

export default EditMaterialForm;
