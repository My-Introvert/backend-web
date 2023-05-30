import express from "express";
import { getUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/Users.js";
import { verifyUser, isAdmin } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/users", verifyUser, isAdmin, getUsers);
router.get("/user/:id", verifyUser, isAdmin, getUserById);
router.post("/user", verifyUser, isAdmin, createUser);
router.patch("/user/:id", verifyUser, isAdmin, updateUser);
router.delete("/user/:id", verifyUser, isAdmin, deleteUser);

export default router;
