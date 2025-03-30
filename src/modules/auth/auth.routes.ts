import { RequestHandler, Router } from "express";
import * as authServices from "./services/auth.service";
import {
  confirmEmailSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "./auth.validation";
import { valid } from "../../middleware/validation";
import { asyncHandler } from "../../utils/errorHandling";

const router = Router();

router.post(
  "/register",
  valid(registerSchema) as RequestHandler,
  asyncHandler(authServices.register)
);

router.post(
  "/login",
  valid(loginSchema) as RequestHandler,
  asyncHandler(authServices.login)
);

router.get(
  "/confirm/email/:token",
  valid(confirmEmailSchema) as RequestHandler,
  asyncHandler(authServices.confirmEmail)
);

router.post(
  "/reset",
  valid(resetPasswordSchema) as RequestHandler,
  asyncHandler(authServices.forgetPassword)
);

export default router;
