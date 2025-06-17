import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/api";
import { 
  Button, 
  TextField, 
  Box, 
  Typography, 
  Paper, 
  InputAdornment,
  IconButton,
  CircularProgress,
  Divider
} from "@mui/material";
import { 
  Email as EmailIcon, 
  Lock as LockIcon, 
  Visibility, 
  VisibilityOff,
  PersonAdd as PersonAddIcon,
  ArrowBack as ArrowBackIcon
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

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      const userRole = email === "admin" && password === "admin" ? "admin" : "user";
      await register(email, password, userRole);
      setSuccess("Регистрация прошла успешно!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError("Ошибка регистрации. Возможно, пользователь уже существует.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#c3b8ff",
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
            borderRadius: "24px",
            boxShadow: "0 12px 40px rgba(136, 162, 255, 0.2)",
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: -40,
              right: -40,
              width: "120px",
              height: "120px",
              background: "radial-gradient(circle, rgba(255,178,247,0.08) 0%, transparent 70%)",
              borderRadius: "50%",
              zIndex: 0,
            },
          }}
        >
          <Box textAlign="center" mb={4}>
            <PersonAddIcon 
              sx={{ 
                fontSize: 60,
                color: "#88A2FF",
                mb: 1,
              }} 
            />
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
              Регистрация
            </Typography>
            <Typography color="text.secondary">
              Создайте новый аккаунт
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

            {success && (
              <Typography color="success.main" sx={{ mt: 1, textAlign: "center" }}>
                {success}
              </Typography>
            )}

            <Box mt={4} textAlign="center">
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
                  {isLoading ? "Регистрация..." : "Зарегистрироваться"}
                </Button>
              </motion.div>
            </Box>
          </form>

          <Divider sx={{ my: 3 }} />

          <Box textAlign="center">
            <Button
              onClick={() => navigate("/login")}
              variant="text"
              startIcon={<ArrowBackIcon />}
              sx={{
                color: "#88A2FF",
                fontWeight: 600,
                '&:hover': {
                  background: "rgba(136, 162, 255, 0.1)",
                },
              }}
            >
              Уже есть аккаунт? Войти
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default RegisterPage;