import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  setIsAuth?: (val: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setIsAuth }) => {
  const navigate = useNavigate();
  const isAuth = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    setIsAuth && setIsAuth(false);
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: "pointer" }}
          onClick={() => navigate("/materials")}
        >
          Образовательный портал
        </Typography>
        {isAuth ? (
          <>
            <Button color="inherit" onClick={() => navigate("/profile")}>
              Профиль
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Выйти
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" onClick={() => navigate("/login")}>
              Войти
            </Button>
            <Button color="inherit" onClick={() => navigate("/register")}>
              Регистрация
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
