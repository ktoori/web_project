import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/api";
import { Button, TextField, Box, Typography, Paper } from "@mui/material";

interface LoginPageProps {
  setIsAuth: (auth: boolean) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setIsAuth }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("email", email);
      setIsAuth(true); // <-- тут обновляем состояние авторизации
      navigate("/materials");
    } catch (err) {
      setError("Неверная почта или пароль");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
      <Paper sx={{ p: 4, width: 350 }}>
        <Typography variant="h5" gutterBottom>Вход</Typography>
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
          <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>Войти</Button>
        </form>
        <Button onClick={() => navigate("/register")} sx={{ mt: 2 }}>Нет аккаунта? Зарегистрироваться</Button>
      </Paper>
    </Box>
  );
};

export default LoginPage;
