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
  ListItemAvatar,
  ListItemSecondaryAction,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment
} from "@mui/material";
import {
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  CloudUpload as CloudUploadIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  School as SchoolIcon
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

const PHOTO_KEY = "profile_photo";
const NAME_KEY = "profile_name";
const SURNAME_KEY = "profile_surname";

const ProfilePage: React.FC = () => {
  const role = localStorage.getItem("role") || "";
  const email = localStorage.getItem("email") || "";
  const [photo, setPhoto] = useState<string | null>(localStorage.getItem(`profile_photo_${email}`));
  const [name, setName] = useState<string>(localStorage.getItem(`profile_name_${email}`) || "");
  const [surname, setSurname] = useState<string>(localStorage.getItem(`profile_surname_${email}`) || "");
  const [saved, setSaved] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [completed, setCompleted] = useState<number[]>([]);

 useEffect(() => {
  if (role === "user") {
    const data = localStorage.getItem(`hw_done_${email}`);
    if (data) {
      // doneObj = { "1": true, "2": false, ... }
      const doneObj = JSON.parse(data);
      const completedIds = Object.entries(doneObj)
        .filter(([_, status]) => status)
        .map(([id]) => Number(id));
      setCompleted(completedIds);
    } else {
      setCompleted([]);
    }
  }
}, [role, email]);



const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPhoto(result);
      localStorage.setItem(`profile_photo_${email}`, result);
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  }
};

const handleSave = (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setTimeout(() => {
    localStorage.setItem(`profile_name_${email}`, name);
    localStorage.setItem(`profile_surname_${email}`, surname);
    setIsLoading(false);
    setSaved(true);
    setIsEditing(false);
    setTimeout(() => setSaved(false), 2000);
  }, 800);
};

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: { xs: 2, md: 4 },
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        background: "#c3b8ff",
      }}
    >
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        sx={{
          p: { xs: 3, md: 4 },
          width: "100%",
          maxWidth: 600,
          borderRadius: "24px",
          boxShadow: "0 12px 48px rgba(136, 162, 255, 0.15)",
          bgcolor: "background.paper",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            width: "120px",
            height: "120px",
            background: "radial-gradient(circle, rgba(255,178,247,0.08) 0%, transparent 70%)",
            borderRadius: "50%",
            zIndex: 0,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Личный кабинет
          </Typography>
          {!isEditing && (
            <IconButton
              onClick={() => setIsEditing(true)}
              sx={{
                bgcolor: "rgba(136, 162, 255, 0.1)",
                "&:hover": { bgcolor: "rgba(136, 162, 255, 0.2)" },
              }}
            >
              <EditIcon color="primary" />
            </IconButton>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          {/* Без Badge! */}
          <Avatar
            src={photo || undefined}
            sx={{
              width: 100,
              height: 100,
              mr: 3,
              boxShadow: "0 4px 16px rgba(136, 162, 255, 0.3)",
              border: "2px solid #88A2FF",
            }}
          >
            {!photo && <PersonIcon sx={{ fontSize: 50 }} />}
          </Avatar>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              disabled={isLoading}
              sx={{
                borderRadius: "12px",
                px: 3,
                py: 1.5,
                fontWeight: 600,
                borderColor: "#88A2FF",
                color: "#88A2FF",
                "&:hover": {
                  borderColor: "#7691E8",
                  bgcolor: "rgba(136, 162, 255, 0.05)",
                },
              }}
            >
              {isLoading ? "Загрузка..." : "Изменить фото"}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handlePhotoChange}
              />
            </Button>
          </motion.div>
        </Box>

        {isEditing ? (
          <form onSubmit={handleSave}>
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <TextField
                label="Имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    "& fieldset": {
                      borderColor: "rgba(136, 162, 255, 0.5)",
                    },
                  },
                }}
              />
              <TextField
                label="Фамилия"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    "& fieldset": {
                      borderColor: "rgba(136, 162, 255, 0.5)",
                    },
                  },
                }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              {/* Кнопка Сохранить — без перемещения при наведении */}
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                sx={{
                  flex: 1,
                  borderRadius: "12px",
                  bgcolor: "#88A2FF",
                  color: "white",
                  fontWeight: 600,
                  py: 1.5,
                  transition: "background 0.2s", // Только цвет
                  "&:hover": {
                    bgcolor: "#7691E8",
                  },
                }}
              >
                Сохранить
              </Button>
              {/* Кнопка Отмена — широкая */}
              <Button
                variant="outlined"
                onClick={() => setIsEditing(false)}
                sx={{
                  flex: 1.0, // Шире!
                  borderRadius: "12px",
                  borderColor: "rgba(136, 162, 255, 0.5)",
                  color: "#88A2FF",
                  fontWeight: 600,
                  py: 1.5,
                  minWidth: 90, 
                  "&:hover": {
                    borderColor: "#88A2FF",
                    bgcolor: "rgba(136, 162, 255, 0.05)",
                  },
                }}
              >
                Отмена
              </Button>
            </Box>
          </form>
        ) : (
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              {name} {surname}
            </Typography>
            <Typography
              sx={{
                mb: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "text.secondary",
              }}
            >
              <EmailIcon fontSize="small" /> {email}
            </Typography>
            <Chip
              icon={<SchoolIcon />}
              label={role === "admin" ? "Преподаватель" : "Студент"}
              color={role === "admin" ? "primary" : "default"}
              sx={{ borderRadius: "8px" }}
            />
          </Box>
        )}

        <AnimatePresence>
          {saved && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                sx={{
                  bgcolor: "rgba(166, 196, 159, 0.1)",
                  p: 2,
                  borderRadius: "12px",
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <CheckCircleIcon color="success" />
                <Typography color="success.main" fontWeight={500}>
                  Данные успешно сохранены!
                </Typography>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {role === "user" && (
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              Выполненные задания
            </Typography>

            {completed.length === 0 ? (
              <Typography color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
                Пока нет выполненных заданий
              </Typography>
            ) : (
              <List
                sx={{
                  bgcolor: "rgba(136, 162, 255, 0.03)",
                  borderRadius: "12px",
                  border: "1px solid rgba(136, 162, 255, 0.1)",
                }}
              >
                {completed.map((id) => (
                  <ListItem
                    key={id}
                    sx={{
                      borderBottom: "1px solid rgba(136, 162, 255, 0.05)",
                      "&:last-child": { borderBottom: "none" },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: "rgba(166, 196, 159, 0.1)",
                          color: "#A6C49F",
                        }}
                      >
                        <CheckCircleIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`Задание #${id}`}
                      secondary={`Выполнено ${new Date().toLocaleDateString()}`}
                    />
                    <ListItemSecondaryAction>
                      <Chip
                        label="Выполнено"
                        color="success"
                        size="small"
                        sx={{ borderRadius: "6px" }}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ProfilePage;
