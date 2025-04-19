import { Router } from "express";
import authRouter from "./modules/auth/auth.routes";
import userRouter from "./modules/user/user.routes";
import sectionRouter from "./modules/section/section.routes";
import serviceRouter from "./modules/service/service.routes";
import offersRouter from "./modules/offers/offers.routes";
const router = Router();
router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/section", sectionRouter);
router.use("/service", serviceRouter);
router.use("/offer", offersRouter);

export default router;
