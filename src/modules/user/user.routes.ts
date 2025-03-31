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
import { configureMulter } from "../../utils/multer";
import { changePassSchema } from "./user.validation";

const router = Router();
const upload = configureMulter();

router.get(
  "/profile",
  valid(cokkiesSchema) as RequestHandler,
  isAuth([Roles.User, Roles.SuperAdmin, Roles.Admin]),
  asyncHandler(userServices.profile)
);

router.post(
  "/avatar",
  isAuth([Roles.Admin, Roles.SuperAdmin, Roles.User]),
  upload.single("avatar"),
  asyncHandler(userServices.uploadImage)
);

router.put(
  "/changePass",
  valid(changePassSchema) as RequestHandler,
  isAuth([Roles.Admin, Roles.SuperAdmin, Roles.User]),
  asyncHandler(userServices.changePassword)
);

router.put(
  "/userProfile",
  isAuth([Roles.User, Roles.SuperAdmin]),
  asyncHandler(userServices.userProfile)
);

router.delete(
  "/:id",
  isAuth([Roles.SuperAdmin, Roles.User]),
  asyncHandler(userServices.deleteAccount)
);

router.post(
  "/checkPass",
  valid(changePassSchema) as RequestHandler,
  isAuth([Roles.SuperAdmin, Roles.User]),
  asyncHandler(userServices.checkPass)
);

router.post(
  "/logout",
  isAuth([Roles.Admin, Roles.SuperAdmin, Roles.User]),
  asyncHandler(userServices.logout)
);

export default router;
