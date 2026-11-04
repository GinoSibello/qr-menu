import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "./env";

export interface AuthPayload {
  userId: number;
  role: string;
  username: string;
}

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: "12h" });
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No autorizado" });
    }
    try {
      const token = header.slice(7);
      const payload = jwt.verify(token, env.jwtSecret) as AuthPayload;
      if (!roles.includes(payload.role)) {
        return res.status(403).json({ error: "Permisos insuficientes" });
      }
      (req as any).auth = payload;
      next();
    } catch {
      return res.status(401).json({ error: "Token inválido" });
    }
  };
}
