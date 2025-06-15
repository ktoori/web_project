import React, { useState } from "react";
import { TextField, Button, Typography, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { updateMaterial } from "../api/api";

export default function EditMaterialForm({ open, onClose, material, onSuccess }) {
  const [values, setValues] = useState({ ...material });
  const [error, setError] = useState("");

  // Сброс формы при открытии нового материала для редактирования
  React.useEffect(() => {
    setValues({ ...material });
  }, [material]);

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      await updateMaterial(material.id, values, token);
      onSuccess && onSuccess();
      onClose();
    } catch {
      setError("Ошибка при сохранении изменений");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Редактировать материал</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField name="subject" label="Предмет" value={values.subject || ""} onChange={handleChange} fullWidth margin="normal" required />
          <TextField name="lecturer" label="ФИО преподавателя" value={values.lecturer || ""} onChange={handleChange} fullWidth margin="normal" required />
          <TextField name="title" label="Название лекции" value={values.title || ""} onChange={handleChange} fullWidth margin="normal" required />
          <TextField name="content" label="Текст лекции" value={values.content || ""} onChange={handleChange} fullWidth margin="normal" multiline rows={4} required />
          <TextField name="homework" label="Домашнее задание" value={values.homework || ""} onChange={handleChange} fullWidth margin="normal" />
          <TextField name="date" type="date" label="Дата лекции" value={values.date ? values.date.slice(0,10) : ""} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />
          <TextField name="homework_due" type="date" label="Срок сдачи ДЗ" value={values.homework_due ? values.homework_due.slice(0,10) : ""} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
          {error && <Typography color="error">{error}</Typography>}
          <DialogActions>
            <Button onClick={onClose}>Отмена</Button>
            <Button type="submit" variant="contained">Сохранить</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
