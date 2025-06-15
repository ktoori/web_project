import express from "express";
import { addComment, getComments, uploadMiddleware } from "../controllers/comment.controller";

const router = express.Router();

router.get("/:id/comments", getComments);
router.post("/:id/comments", uploadMiddleware, addComment);

export default router;
