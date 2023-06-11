import express from "express";
import { getBooks, getBookById, createBook, updateBook, deleteBook } from "../controllers/Books.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/books", getBooks);
router.get("/books/:id", getBookById);
router.post("/books", verifyUser, createBook);
router.patch("/books/:id", verifyUser, updateBook);
router.delete("/books/:id", verifyUser, deleteBook);

export default router;
