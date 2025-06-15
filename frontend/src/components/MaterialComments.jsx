import React, { useEffect, useState } from "react";
import { fetchComments, addComment } from "../api/api";
import { Box, Typography, TextField, Button, Paper, List, ListItem, Link } from "@mui/material";

export default function MaterialComments({ materialId, role }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  // Берём email из localStorage
  const userEmail = localStorage.getItem("email");

  const loadComments = async () => {
    setLoading(true);
    const data = await fetchComments(materialId);
    setComments(data);
    setLoading(false);
  };

  useEffect(() => {
    loadComments();
    // eslint-disable-next-line
  }, [materialId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Передаём email в addComment!
    await addComment(materialId, text, file, userEmail || "anon");
    setText("");
    setFile(null);
    loadComments();
  };

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>Комментарии к ДЗ</Typography>
      {role !== "admin" && (
        <form onSubmit={handleSubmit}>
          <TextField
            label="Ваш комментарий"
            value={text}
            onChange={e => setText(e.target.value)}
            fullWidth
            margin="dense"
            required
          />
          <input
            type="file"
            accept=".txt,.doc,.docx"
            onChange={e => setFile(e.target.files[0])}
            style={{ margin: "8px 0" }}
          />
          <Button variant="contained" type="submit" disabled={loading}>Отправить</Button>
        </form>
      )}
      <List dense>
        {comments.map(com => (
          <ListItem key={com.id} sx={{ display: "block", borderBottom: "1px solid #eee" }}>
            <Typography fontWeight="bold">{com.user_email}:</Typography>
            <Typography sx={{ whiteSpace: "pre-line" }}>{com.text}</Typography>
            {com.file_path && (
              <Link
                href={`http://localhost:4000/uploads/${com.file_path}`}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
              >
                Скачать файл
              </Link>
            )}
            <Typography variant="caption" color="text.secondary">
              {new Date(com.created_at).toLocaleString()}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
