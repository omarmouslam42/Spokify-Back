import { Router } from "express";
import * as authControllers from "./auth.controller.js";

const router = new Router();

router.post("/register", authControllers.authController);
router.post("/login", authControllers.loginController);
router.put("/updateProfile/:id", authControllers.updateUserController);
router.post("/forgot-password", authControllers.resetPassword);
router.post("/reset-password", authControllers.confirmResetPassword);

export default router;
