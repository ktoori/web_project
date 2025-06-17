import React, { useState, ChangeEvent, FormEvent } from "react";
import { TextField, Button, Typography, Paper, Box } from "@mui/material";
import { createMaterial } from "../api/api";
import { motion } from "framer-motion";

interface AddMaterialFormProps {
  onSuccess?: () => void;
}

interface MaterialFormValues {
  subject: string;
  lecturer: string;
  title: string;
  content: string;
  homework: string;
  date: string;
  homework_due: string;
}

const initialValues: MaterialFormValues = {
  subject: "",
  lecturer: "",
  title: "",
  content: "",
  homework: "",
  date: "",
  homework_due: "",
};

const AddMaterialForm: React.FC<AddMaterialFormProps> = ({ onSuccess }) => {
  const [values, setValues] = useState<MaterialFormValues>(initialValues);
  const [error, setError] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      await createMaterial(values, token);
      setValues(initialValues);
      onSuccess && onSuccess();
    } catch {
      setError("Ошибка при добавлении материала");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Paper
        sx={{
          p: { xs: 2, md: 4 },
          mb: 4,
          boxShadow: "0 8px 32px rgba(136, 162, 255, 0.12)",
          maxWidth: 520,
          mx: "auto",
          background: "#E3FC87",
          borderRadius: "24px",
          fontFamily: "Montserrat, sans-serif",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: -50,
            right: -50,
            width: "120px",
            height: "120px",
            background: "radial-gradient(circle, rgba(255,178,247,0.08) 0%, transparent 70%)",
            borderRadius: "50%",
            zIndex: 0,
          },
        }}
        elevation={0}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          gutterBottom
          sx={{
            fontFamily: "Montserrat, sans-serif",
            color: "#2D3748",
            letterSpacing: 0.5,
            mb: 3,
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -8,
              left: 0,
              width: "48px",
              height: "3px",
              background: "linear-gradient(90deg, #88A2FF 0%, #FFB2F7 100%)",
              borderRadius: "3px",
            },
          }}
        >
          Добавить лекцию
        </Typography>
        <form onSubmit={handleSubmit} autoComplete="off">
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, position: "relative", zIndex: 1 }}>
            {[
              { name: "subject", label: "Предмет", required: true },
              { name: "lecturer", label: "ФИО преподавателя", required: true },
              { name: "title", label: "Название лекции", required: true },
              { name: "content", label: "Текст лекции", required: true, multiline: true, minRows: 3 },
              { name: "homework", label: "Домашнее задание", multiline: true, minRows: 2 },
              { name: "date", label: "Дата лекции", type: "date", required: true },
              { name: "homework_due", label: "Срок сдачи ДЗ", type: "date" },
            ].map((field) => (
              <TextField
                key={field.name}
                name={field.name}
                label={field.label}
                value={values[field.name as keyof MaterialFormValues]}
                onChange={handleChange}
                fullWidth
                required={field.required}
                type={field.type as any}
                multiline={field.multiline}
                minRows={field.minRows}
                InputLabelProps={field.type === "date" ? { shrink: true } : undefined}
                InputProps={{
                  style: {
                    borderRadius: "12px",
                    background: "#FFFFFF",
                    fontFamily: "Montserrat, sans-serif",
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#E2E8F0",
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

            {error && (
              <Typography color="error" fontSize={15} sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  borderRadius: "18px",
                  mt: 2,
                  fontWeight: 700,
                  fontSize: "16px",
                  letterSpacing: "0.5px",
                  background: "linear-gradient(90deg, #88A2FF 0%, #AB9DFF 100%)",
                  color: "#FFFFFF",
                  boxShadow: "0 4px 16px rgba(136, 162, 255, 0.24)",
                  "&:hover": {
                    background: "linear-gradient(90deg, #AB9DFF 0%, #88A2FF 100%)",
                    boxShadow: "0 6px 20px rgba(136, 162, 255, 0.32)",
                  },
                  py: 1.5,
                  fontFamily: "Montserrat, sans-serif",
                  textTransform: "none",
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
                Добавить материал
              </Button>
            </motion.div>
          </Box>
        </form>
      </Paper>
    </motion.div>
  );
};

export default AddMaterialForm;