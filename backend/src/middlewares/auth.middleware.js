import { verifyJwt } from "../utils/jwt.js";
export function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [, token] = header.split(" ");
    if (!token) return res.status(401).json({ error: "Token ausente." });
    req.user = verifyJwt(token);
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido." });
  }
}