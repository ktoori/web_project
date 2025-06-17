import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/api";
import { 
  Button, 
  TextField, 
  Box, 
  Typography, 
  Paper, 
  InputAdornment,
  IconButton,
  CircularProgress
} from "@mui/material";
import { 
  Email as EmailIcon, 
  Lock as LockIcon, 
  Visibility, 
  VisibilityOff 
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { styled } from "@mui/material/styles";

const GradientButton = styled(Button)({
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  border: 0,
  borderRadius: 12,
  color: 'white',
  height: 48,
  padding: '0 30px',
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  '&:hover': {
    background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
  },
});

const LoginPage: React.FC<{ setIsAuth: (auth: boolean) => void }> = ({ setIsAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("email", email);
      setIsAuth(true);
      navigate("/materials");
    } catch (err) {
      setError("Неверная почта или пароль");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#c3b8ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, sm: 4 },
            width: { xs: "100%", sm: 400 },
            borderRadius: "18px",
            boxShadow: "0 12px 40px rgba(136, 162, 255, 0.2)",
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <Box textAlign="center" mb={4}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              Добро пожаловать
            </Typography>
            <Typography color="text.secondary">
              Введите свои данные для входа
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: "12px",
                  '& fieldset': {
                    borderColor: "rgba(136, 162, 255, 0.5)",
                  },
                  '&:hover fieldset': {
                    borderColor: "#88A2FF",
                  },
                },
              }}
            />

            <TextField
              label="Пароль"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: "12px",
                  '& fieldset': {
                    borderColor: "rgba(136, 162, 255, 0.5)",
                  },
                  '&:hover fieldset': {
                    borderColor: "#88A2FF",
                  },
                },
              }}
            />

            {error && (
              <Typography color="error" sx={{ mt: 1, textAlign: "center" }}>
                {error}
              </Typography>
            )}

            <Box mt={3} textAlign="center">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                  sx={{
                    borderRadius: "12px",
                    background: "linear-gradient(45deg, #88A2FF 0%, #AB9DFF 100%)",
                    color: "white",
                    fontWeight: 600,
                    fontSize: 16,
                    py: 1.5,
                    px: 4,
                    width: "100%",
                    boxShadow: "0 4px 12px rgba(136, 162, 255, 0.3)",
                    '&:hover': {
                      background: "linear-gradient(45deg, #AB9DFF 0%, #88A2FF 100%)",
                    },
                  }}
                >
                  {isLoading ? "Вход..." : "Войти"}
                </Button>
              </motion.div>
            </Box>
          </form>

          <Box mt={3} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Ещё нет аккаунта?
            </Typography>
            <Button
              onClick={() => navigate("/register")}
              variant="text"
              sx={{
                mt: 1,
                color: "#88A2FF",
                fontWeight: 600,
                '&:hover': {
                  background: "rgba(136, 162, 255, 0.1)",
                },
              }}
            >
              Зарегистрироваться
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default LoginPage;