import { Router } from "express";
import authRouter from "./modules/auth/auth.routes";
import userRouter from "./modules/user/user.routes";

const router = Router();
router.use("/auth", authRouter);
router.use("/user", userRouter);

export default router;
