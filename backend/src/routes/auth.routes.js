import { Router } from "express";
import { login } from "../controllers/auth.controller.js";

const router = Router();
router.post("/api/auth/login", login);

export default router;