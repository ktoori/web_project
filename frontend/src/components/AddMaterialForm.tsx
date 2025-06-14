import React, { useState, ChangeEvent, FormEvent } from "react";
import { TextField, Button, Typography, Paper } from "@mui/material";
import { createMaterial } from "../api/api";

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
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6">Добавить лекцию</Typography>
      <form onSubmit={handleSubmit}>
        <TextField name="subject" label="Предмет" value={values.subject} onChange={handleChange} fullWidth margin="normal" required />
        <TextField name="lecturer" label="ФИО преподавателя" value={values.lecturer} onChange={handleChange} fullWidth margin="normal" required />
        <TextField name="title" label="Название лекции" value={values.title} onChange={handleChange} fullWidth margin="normal" required />
        <TextField name="content" label="Текст лекции" value={values.content} onChange={handleChange} fullWidth margin="normal" multiline rows={4} required />
        <TextField name="homework" label="Домашнее задание" value={values.homework} onChange={handleChange} fullWidth margin="normal" />
        <TextField name="date" type="date" label="Дата лекции" value={values.date} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />
        <TextField name="homework_due" type="date" label="Срок сдачи ДЗ" value={values.homework_due} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>Добавить</Button>
      </form>
    </Paper>
  );
};

export default AddMaterialForm;
