import { Router } from "express";
import {
    listPacientes,
    getPaciente,
    createPaciente
} from "../controllers/pacientes.controller";

const router = Router();

router.post("/pacientes/novo", createPaciente);
router.get("/pacientes", listPacientes);
router.get("/pacientes/:id", getPaciente);

export default router;