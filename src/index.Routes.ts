import { Router } from "express";
import authRouter from "./modules/auth/auth.routes";
import userRouter from "./modules/user/user.routes";
import categoryRouter from "./modules/category/category.routes";
const router = Router();
router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/category", categoryRouter);

export default router;
