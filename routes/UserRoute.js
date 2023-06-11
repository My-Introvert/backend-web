import express from "express";
import { getUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/Users.js";
import { verifyUser, isAdmin } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/users", verifyUser, isAdmin, getUsers);
router.get("/users/:id", verifyUser, isAdmin, getUserById);
router.post("/users", createUser);
router.patch("/users/:id", verifyUser, updateUser);
router.delete("/users/:id", verifyUser, isAdmin, deleteUser);

export default router;
