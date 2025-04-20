import { Roles } from "./../../DB/interfaces/user.interface";
import {
  Router,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import { valid } from "../../middleware/validation";
import { asyncHandler } from "../../utils/errorHandling";
import * as userServices from "./services/user.service";
import { cokkiesSchema } from "../auth/auth.validation";
import { isAuth } from "../../middleware/auth";
import { configureMulter, multerMemory } from "../../utils/multer";
import { changePassSchema, updateSchema } from "./user.validation";

const router = Router();

router.get(
  "/profile",
  valid(cokkiesSchema) as RequestHandler,
  isAuth([Roles.User, Roles.SuperAdmin, Roles.Admin]),
  asyncHandler(userServices.profile)
);

router.post(
  "/avatar",
  isAuth([Roles.Admin, Roles.SuperAdmin, Roles.User]),
  configureMulter().single("avatar"),
  asyncHandler(userServices.uploadImage)
);

router.put(
  "/change/password",
  valid(changePassSchema) as RequestHandler,
  isAuth([Roles.Admin, Roles.SuperAdmin, Roles.User]),
  asyncHandler(userServices.changePassword)
);

router.put(
  "/update",
  valid(updateSchema) as RequestHandler,
  isAuth([Roles.User, Roles.SuperAdmin, Roles.Admin]),
  asyncHandler(userServices.updateUser)
);

router.delete(
  "/",
  isAuth([Roles.Admin, Roles.SuperAdmin, Roles.User]),
  asyncHandler(userServices.deleteAccount)
);

router.post(
  "/logout",
  isAuth([Roles.Admin, Roles.SuperAdmin, Roles.User]),
  asyncHandler(userServices.logout)
);

export default router;
