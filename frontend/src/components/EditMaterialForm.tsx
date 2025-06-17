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

// ...импорты и типы как раньше

const EditMaterialForm: React.FC<EditMaterialFormProps> = ({
  open,
  onClose,
  material,
  onSuccess
}) => {
  const [values, setValues] = useState<Material>({ ...material });
  const [error, setError] = useState<string>("");
  const [dateError, setDateError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setValues({ ...material });
      setError("");
      setDateError("");
    }
  }, [material, open]);

  useEffect(() => {
    if (values.homework_due && values.date) {
      const date = new Date(values.date);
      const due = new Date(values.homework_due);
      if (due < date) {
        setDateError("Срок сдачи ДЗ не может быть раньше даты лекции");
      } else {
        setDateError("");
      }
    } else {
      setDateError("");
    }
  }, [values.homework_due, values.date]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (values.homework_due && values.date) {
      const date = new Date(values.date);
      const due = new Date(values.homework_due);
      if (due < date) {
        setDateError("Срок сдачи ДЗ не может быть раньше даты лекции");
        setIsSubmitting(false);
        return;
      }
    }

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

  const safeSlice = (value: string | number | undefined): string => {
    if (typeof value === "string") {
      return value.slice(0, 10);
    }
    return "";
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
          mt:7,
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
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={2.5} mb={3} mt={3}>
              {[
                { name: "subject", label: "Предмет", required: true },
                { name: "lecturer", label: "ФИО преподавателя", required: true },
                { name: "title", label: "Название лекции", required: true },
                { name: "content", label: "Текст лекции", required: true, multiline: true, rows: 4 },
                { name: "homework", label: "Домашнее задание", multiline: true, rows: 2 },
                { name: "date", label: "Дата лекции", type: "date", required: true },
                { name: "homework_due", label: "Срок сдачи ДЗ", type: "date" },
              ].map((field) => (
                <TextField
                  key={field.name}
                  name={field.name}
                  label={field.label}
                  value={
                    field.type === "date"
                      ? safeSlice(values[field.name as keyof Material])
                      : values[field.name as keyof Material] || ""
                  }
                  onChange={handleChange}
                  type={field.type as any}
                  required={field.required}
                  multiline={field.multiline}
                  rows={field.rows}
                  fullWidth
                  InputLabelProps={field.type === "date" ? { shrink: true } : undefined}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      background: "#FFFFFF",
                      fontFamily: "Montserrat, sans-serif",
                      "& fieldset": {
                        borderColor: "#E2E8F0",
                        transition: "all 0.3s ease",
                      },
                      "&:hover fieldset": {
                        borderColor: "#88A2FF",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#88A2FF",
                        boxShadow: "0 0 0 2px rgba(136, 162, 255, 0.2)",
                      },
                    },
                  }}
                />
              ))}

              {dateError && (
                <Typography color="error" fontSize={14} sx={{ mt: -2, mb: 1, ml: 1 }}>
                  {dateError}
                </Typography>
              )}
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
                  disabled={isSubmitting || !!dateError}
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
