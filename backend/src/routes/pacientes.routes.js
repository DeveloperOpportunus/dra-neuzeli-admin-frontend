import { Router } from "express";
import {
    listPacientes,
    getPaciente,
    createPaciente
} from "../controllers/pacientes.controller.js";

const router = Router();

router.post("/api/pacientes/novo", createPaciente);
router.get("/api/pacientes", listPacientes);
router.get("/api/pacientes/:id", getPaciente);

export default router;