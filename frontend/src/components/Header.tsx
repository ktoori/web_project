import React from "react";
import { Box, Button, Typography, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";

interface HeaderProps {
  setIsAuth?: (val: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setIsAuth }) => {
  const navigate = useNavigate();
  const isAuth = !!localStorage.getItem("token");
  const userEmail = localStorage.getItem("email") || "";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    setIsAuth && setIsAuth(false);
    navigate("/login");
  };

  return (
    <Box
      component="header"
      sx={{
        width: "100%",
        bgcolor: "#ffffff",
        boxShadow: "0 4px 24px rgba(38, 93, 117, 0.1)",
        borderRadius: "0 0 24px 24px",
        px: { xs: 3, sm: 6 },
        py: 2,
        mb: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 1100,
        fontFamily: "'Montserrat', sans-serif",
        backdropFilter: "blur(8px)",
        background: "rgba(255, 255, 255, 0.85)",
        borderBottom: "1px solid rgba(136, 162, 255, 0.1)"
      }}
    >
      <Box
        component={motion.div}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        sx={{ display: "flex", alignItems: "center", gap: 2, cursor: "pointer" }}
        onClick={() => navigate("/materials")}
      >
        <SchoolIcon 
          sx={{ 
            fontSize: 32,
            color: "#88A2FF",
            background: "rgba(136, 162, 255, 0.1)",
            p: 1,
            borderRadius: "12px"
          }} 
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1.2rem", sm: "1.5rem" },
            background: "linear-gradient(90deg,rgb(35, 39, 107) 0%,rgb(118, 142, 230) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "0.02em",
            display: { xs: "none", sm: "block" }
          }}
        >
          Образовательный портал
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {isAuth ? (
          <>
            <Button
              component={motion.div}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              variant="outlined"
              size="medium"
              startIcon={<PersonIcon />}
              sx={{
                fontWeight: 600,
                borderRadius: "12px",
                borderColor: "#E2E8F0",
                color: "#2D3748",
                "&:hover": {
                  borderColor: "#88A2FF",
                  background: "rgba(136, 162, 255, 0.05)"
                }
              }}
              onClick={() => navigate("/profile")}
            >
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                Профиль
              </Box>
              <Box sx={{ display: { xs: "flex", sm: "none" } }}>
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: "#88A2FF",
                    fontSize: 14
                  }}
                >
                  {userEmail.charAt(0).toUpperCase()}
                </Avatar>
              </Box>
            </Button>
            
            <Button
              component={motion.div}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variant="contained"
              size="medium"
              startIcon={<ExitToAppIcon />}
              sx={{
                fontWeight: 600,
                borderRadius: "12px",
                background: "linear-gradient(90deg, #FF8FC7 0%, #FF5EAE 100%)",
                color: "#FFFFFF",
                boxShadow: "0 4px 12px rgba(255, 143, 199, 0.2)",
                "&:hover": {
                  background: "linear-gradient(90deg, #FF5EAE 0%, #FF8FC7 100%)",
                  boxShadow: "0 6px 16px rgba(255, 143, 199, 0.3)"
                }
              }}
              onClick={handleLogout}
            >
              Выйти
            </Button>
          </>
        ) : (
          <>
            <Button
              component={motion.div}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              variant="outlined"
              size="medium"
              sx={{
                fontWeight: 600,
                borderRadius: "12px",
                borderColor: "#E2E8F0",
                color: "#2D3748",
                "&:hover": {
                  borderColor: "#88A2FF",
                  background: "rgba(136, 162, 255, 0.05)"
                }
              }}
              onClick={() => navigate("/login")}
            >
              Войти
            </Button>
            
            <Button
              component={motion.div}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variant="contained"
              size="medium"
              sx={{
                fontWeight: 600,
                borderRadius: "12px",
                background: "linear-gradient(90deg, #88A2FF 0%, #AB9DFF 100%)",
                color: "#FFFFFF",
                boxShadow: "0 4px 12px rgba(136, 162, 255, 0.2)",
                "&:hover": {
                  background: "linear-gradient(90deg, #AB9DFF 0%, #88A2FF 100%)",
                  boxShadow: "0 6px 16px rgba(136, 162, 255, 0.3)"
                }
              }}
              onClick={() => navigate("/register")}
            >
              Регистрация
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Header;