import { Router, Request, Response } from "express";
import { requireAuth } from "../roles/guard";
import * as UserModel from "../models/userModel";
import session from "express-session";

export const authRoutes = Router();
export const userModel = new UserModel.UserModel();

authRoutes.get("/login", (req: Request, res: Response) => {
  if (req.session.userId && req.session.role === 2) {
    return res.redirect("/tarefas");
  };
  res.render("login", { flash: req.session.flash || null });
});

authRoutes.get("/registro", (req: Request, res: Response) => {
  if (req.session.userId && req.session.role === 2) {
    return res.redirect("/tarefas");
  };
  res.render("registro", { flash: req.session.flash || null });
});

// 🎯 TODO 8: POST /registro
authRoutes.post("/registro", async (req: Request, res: Response) => {
  if (req.session.userId && req.session.role === 2) {
    return res.redirect("/tarefas");
  }
  userModel.registrar(req.body.nome, req.body.email, req.body.senha);
  if (!req.body.nome || !req.body.email || !req.body.senha || req.body.senha.length < 6) {
    req.session.flash = "Preencha todos os campos corretamente (senha mínimo 6 caracteres)";
    return res.redirect("/registro");
  }
  userModel.buscarPorEmail(req.body.email).then((existingUser) => {
    if (existingUser) {
      req.session.flash = "Email já registrado";
      return res.redirect("/registro");
    }
    userModel.registrar(req.body.nome, req.body.email, req.body.senha).then(() => {
      req.session.flash = "Conta criada!";
      return res.redirect("/login");
    });
  });
});
authRoutes.post("/registro", async (req: Request, res: Response) => {
  // TODO: implementar registro
  res.redirect("/registro");
});

// 🎯 TODO 9: POST /login
// UserModel.login(email, senha)
// Se null: flash "Email ou senha incorretos" + redirect /login
// Se ok: session.userId, session.userName, redirect /tarefas
authRoutes.post("/login", async (req: Request, res: Response) => {
  // TODO: implementar login
  res.redirect("/login");
});

// 🎯 TODO 10: GET /logout — req.session.destroy
authRoutes.get("/logout", (req: Request, res: Response) => {
  // TODO: destruir session
  res.redirect("/login");
});
