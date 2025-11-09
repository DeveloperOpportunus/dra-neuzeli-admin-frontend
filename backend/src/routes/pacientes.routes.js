import { Router } from "express";
import {
    listPacientes,
    getPaciente,
    createPaciente
} from "../controllers/pacientes.controller";

const router = Router();

router.get("/pacientes", listPacientes);
router.get("/pacientes/:id", getPaciente);
router.post("/pacientes/novo", createPaciente);

export default router;