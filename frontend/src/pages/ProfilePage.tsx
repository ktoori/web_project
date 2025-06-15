import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const PHOTO_KEY = "profile_photo";
const NAME_KEY = "profile_name";
const SURNAME_KEY = "profile_surname";

const ProfilePage: React.FC = () => {
  const role = localStorage.getItem("role") || "";
  const email = localStorage.getItem("email") || "";
  const [photo, setPhoto] = useState<string | null>(localStorage.getItem(PHOTO_KEY));
  const [name, setName] = useState<string>(localStorage.getItem(NAME_KEY) || "");
  const [surname, setSurname] = useState<string>(localStorage.getItem(SURNAME_KEY) || "");

  // Для студентов: выполненные ДЗ
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    if (role === "user") {
      const raw = localStorage.getItem("completed_homeworks");
      setCompleted(raw ? JSON.parse(raw) : []);
    }
  }, [role]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPhoto(result);
        localStorage.setItem(PHOTO_KEY, result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(NAME_KEY, name);
    localStorage.setItem(SURNAME_KEY, surname);
  };

  return (
    <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
      <Paper sx={{
        p: 4,
        minWidth: 400,
        maxWidth: 540,
        borderRadius: 3,
        boxShadow: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
        <Typography variant="h4" gutterBottom>
          Личный кабинет
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar src={photo || undefined} sx={{ width: 72, height: 72, mr: 3 }} />
          <Button variant="outlined" component="label">
            Загрузить фото
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handlePhotoChange}
            />
          </Button>
        </Box>
        <form onSubmit={handleSave} style={{ width: "100%" }}>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="Имя"
              value={name}
              onChange={e => setName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Фамилия"
              value={surname}
              onChange={e => setSurname(e.target.value)}
              fullWidth
            />
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mb: 2 }}
          >
            Сохранить
          </Button>
        </form>
        <Box sx={{ width: "100%", mb: 2 }}>
          <Typography>
            <b>Почта/логин:</b> {email}
          </Typography>
          <Typography>
            <b>Роль:</b> {role === "admin" ? "Преподаватель" : "Студент"}
          </Typography>
        </Box>
        {/* Только для студентов */}
        {role === "user" && (
          <>
            <Typography sx={{ mt: 1, mb: 1 }} variant="subtitle1">
              Выполненные ДЗ:
            </Typography>
            <List dense sx={{ width: "100%" }}>
              {completed.length === 0 && (
                <ListItem>
                  <ListItemText primary="Пока нет выполненных заданий." />
                </ListItem>
              )}
              {completed.map((id) => (
                <ListItem key={id}>
                  <ListItemText primary={`Задание №${id}`} />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default ProfilePage;
