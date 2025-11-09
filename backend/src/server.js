import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pacientesRouter from './routes/pacientes.routes.js';
import authRouter from './routes/auth.routes.js';


dotenv.config();
const app = express();

// CORS, url's at the .env, this is important for security. Put the url of your frontend in the .env file.
const allowList = (process.env.CORS_ORIGIN || "")
    .split(",")
    .map(s => s.trim())
    // wtf?
    .filter(Boolean);

app.use(cors({
    origin: (origin, cb ) => {
        if (!origin ) return cb(null, true);
        if (allowList.length === 0 ) return cb(null, true);
        if (allowList.includes(origin)) return cb(null, true);
        return cb(new Error("CORS policy: não autorizado pelo CORS."));
    },
    credentials: true,
    methods: "GET,PUT,POST,DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization"
}));

app.use(express.json());
app.get("/health", (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

app.use('/api', authRouter)
app.use('/api', pacientesRouter);

app.use((req, res) => res.status(404).json({ error: "Endpoint não encontrado." }));

const port = process.env.PORT || 3001;
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Backend rodando em http://0.0.0.0:${port}`);
});