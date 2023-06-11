import express from "express";
import { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog } from "../controllers/Blogs.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/blogs", getBlogs);
router.get("/blogs/:id", getBlogById);
router.post("/blogs", verifyUser, createBlog);
router.patch("/blogs/:id", verifyUser, updateBlog);
router.delete("/blogs/:id", verifyUser, deleteBlog);

export default router;
