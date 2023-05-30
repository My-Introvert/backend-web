import express from "express";
import { getNotes, getNoteById, createNote, updateNote, deleteNote } from "../controllers/Notes.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/notes", verifyUser, getNotes);
router.get("/note/:id", verifyUser, getNoteById);
router.post("/note", verifyUser, createNote);
router.patch("/note/:id", verifyUser, updateNote);
router.delete("/note/:id", verifyUser, deleteNote);

export default router;
