import express, { NextFunction, Request, Response } from "express";
import session from "express-session";

const app = express();

export enum Role {
    ADMIN,
    USER
}

export function requireAuth (req: Request, res: Response, next: NextFunction) {
    if(!req.session.userId) {
        req.session.flash = "Faça login para acessar esta página!";
        return res.redirect("/login");
    }
}

export function requireRole (req: Request, res: Response, next: NextFunction) {
    if(req.session.userId && req.session.role === Role.ADMIN) {
        return next();
    }
    req.session.flash = "Requerimento de Admin inválido.";
    return res.redirect("/login");
}