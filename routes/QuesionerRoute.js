import express from "express";
import { getQuesioners, getQuesionerById, createQuesioner, updateQuesioner, deleteQuesioner } from "../controllers/Quesioner.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/quesioners", verifyUser, getQuesioners);
router.get("/quesioners/:id", verifyUser, getQuesionerById);
router.post("/quesioners", verifyUser, createQuesioner);
router.patch("/quesioners/:id", verifyUser, updateQuesioner);
router.delete("/quesioners/:id", verifyUser, deleteQuesioner);

export default router;
