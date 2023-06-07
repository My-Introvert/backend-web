import express from "express";
import { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog } from "../controllers/Blogs.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/blogs", verifyUser, getBlogs);
router.get("/blogs/:id", verifyUser, getBlogById);
router.post("/blogs", verifyUser, createBlog);
router.patch("/blogs/:id", verifyUser, updateBlog);
router.delete("/blogs/:id", verifyUser, deleteBlog);

export default router;
