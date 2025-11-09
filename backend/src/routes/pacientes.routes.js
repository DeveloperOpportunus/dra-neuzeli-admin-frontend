import { Router } from "express";
import {
    listPacientes,
    getPaciente,
    createPaciente,
    updatePaciente
} from "../controllers/pacientes.controller.js";

const router = Router();

router.post("/pacientes/novo", createPaciente);
router.get("/pacientes", listPacientes);
router.get("/pacientes/:id", getPaciente);
router.put("/pacientes/:id", updatePaciente);

export default router;