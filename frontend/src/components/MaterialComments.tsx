import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { fetchComments, addComment } from "../api/api";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  Link,
  Avatar,
  CircularProgress,
  Tooltip
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface Comment {
  id: number;
  user_email: string;
  text: string;
  file_path?: string;
  created_at: string;
}

interface MaterialCommentsProps {
  materialId: number;
  role: string;
}

const MaterialComments: React.FC<MaterialCommentsProps> = ({ materialId, role }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const userEmail = localStorage.getItem("email") || "Аноним";

  const loadComments = async () => {
    setLoading(true);
    try {
      const data = await fetchComments(materialId);
      setComments(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [materialId]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addComment(materialId, text, file, userEmail);
      setText("");
      setFile(null);
      await loadComments();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const getUserInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMMM yyyy, HH:mm", { locale: ru });
  };

  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      sx={{
        p: { xs: 2, md: 3 },
        mt: 3,
        borderRadius: "18px",
        boxShadow: "0 8px 32px rgba(136, 162, 255, 0.1)",
        bgcolor: "background.paper",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "4px",
          height: "100%",
          bgcolor: "#88A2FF",
        }
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          mb: 3,
          color: "#2D3748",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Box
          sx={{
            width: 24,
            height: 24,
            bgcolor: "#88A2FF",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 14,
          }}
        >
          {comments.length}
        </Box>
        Обсуждение задания
      </Typography>

      {role !== "admin" && (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            mb: 3,
            p: 2,
            borderRadius: "12px",
            bgcolor: "rgba(136, 162, 255, 0.03)",
            border: "1px solid rgba(136, 162, 255, 0.1)",
          }}
        >
          <TextField
            label="Ваш комментарий"
            value={text}
            onChange={(e) => setText(e.target.value)}
            fullWidth
            multiline
            minRows={3}
            required
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                bgcolor: "background.paper",
                "& fieldset": {
                  borderColor: "rgba(136, 162, 255, 0.3)",
                },
                "&:hover fieldset": {
                  borderColor: "#88A2FF",
                },
              },
            }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <input
              type="file"
              accept=".txt,.doc,.docx,.pdf,.zip"
              id={`comment-file-${materialId}`}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <Tooltip title="Прикрепить файл">
              <label htmlFor={`comment-file-${materialId}`}>
                {/* Обёртка motion.div для анимации */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outlined"
                    startIcon={<AttachFileIcon />}
                    sx={{
                      borderRadius: "12px",
                      borderColor: "rgba(136, 162, 255, 0.5)",
                      color: "#88A2FF",
                    }}
                  >
                    {file ? file.name : "Файл"}
                  </Button>
                </motion.div>
              </label>
            </Tooltip>

            {/* Обёртка motion.div для кнопки отправки */}
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : <SendIcon />}
                sx={{
                  borderRadius: "12px",
                  bgcolor: "#88A2FF",
                  color: "white",
                  fontWeight: 600,
                  ml: "auto",
                  px: 3,
                  "&:hover": {
                    bgcolor: "#7691E8",
                  },
                }}
              >
                Отправить
              </Button>
            </motion.div>
          </Box>
        </Box>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress color="inherit" size={32} />
        </Box>
      ) : (
        <List sx={{ mt: 1 }}>
          <AnimatePresence>
            {comments.map((comment) => (
              <ListItem
                key={comment.id}
                component={motion.div}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                sx={{
                  p: 0,
                  mb: 2,
                  "&:last-child": { mb: 0 },
                }}
              >
                <Paper
                  sx={{
                    width: "100%",
                    p: 2,
                    borderRadius: "14px",
                    bgcolor: "background.paper",
                    boxShadow: "0 4px 16px rgba(136, 162, 255, 0.08)",
                    border: "1px solid rgba(136, 162, 255, 0.1)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: "#AB9DFF",
                        color: "white",
                        fontSize: 14,
                        mr: 1.5,
                      }}
                    >
                      {getUserInitials(comment.user_email)}
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: 15 }}>
                        {comment.user_email}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: 12 }}
                      >
                        {formatDate(comment.created_at)}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    sx={{
                      whiteSpace: "pre-line",
                      mb: 1.5,
                      lineHeight: 1.6,
                      color: "#2D3748",
                    }}
                  >
                    {comment.text}
                  </Typography>

                  {comment.file_path && (
                    <Button
                      component={Link}
                      href={`http://localhost:4000/uploads/${comment.file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outlined"
                      size="small"
                      startIcon={<DownloadIcon />}
                      sx={{
                        borderRadius: "8px",
                        borderColor: "rgba(136, 162, 255, 0.3)",
                        color: "#88A2FF",
                        textTransform: "none",
                        "&:hover": {
                          borderColor: "#88A2FF",
                          bgcolor: "rgba(136, 162, 255, 0.05)",
                        },
                      }}
                    >
                      Скачать файл
                    </Button>
                  )}
                </Paper>
              </ListItem>
            ))}
          </AnimatePresence>

          {comments.length === 0 && (
            <Box
              sx={{
                textAlign: "center",
                py: 4,
                color: "text.secondary",
              }}
            >
              <Typography variant="body1">
                Пока нет комментариев. Будьте первым!
              </Typography>
            </Box>
          )}
        </List>
      )}
    </Paper>
  );
};

export default MaterialComments;
