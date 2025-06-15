import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/api";
import { Button, TextField, Box, Typography, Paper } from "@mui/material";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    let userRole: "user" | "admin" = "user";
    // Если вводим admin admin — делаем преподавателем:
    if (email === "admin" && password === "admin") {
      userRole = "admin";
    }
    try {
      await register(email, password, userRole);
      setSuccess("Регистрация прошла успешно!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError("Ошибка регистрации");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
      <Paper sx={{ p: 4, width: 350 }}>
        <Typography variant="h5" gutterBottom>Регистрация</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Почта"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Пароль"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          {error && <Typography color="error">{error}</Typography>}
          {success && <Typography color="primary">{success}</Typography>}
          <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
            Зарегистрироваться
          </Button>
        </form>
        <Button onClick={() => navigate("/login")} sx={{ mt: 2 }}>
          Уже есть аккаунт? Войти
        </Button>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
