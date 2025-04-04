import {
  Router,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import { valid } from "../../middleware/validation";
import * as categoryService from "./service/category.service";
import { multerMemory, configureMulter } from "../../utils/multer";
import { asyncHandler } from "../../utils/errorHandling";
import { addcategorySchema } from "./category.vaild";
import { isAuth } from "../../middleware/auth";
import { Roles } from "../../DB/interfaces/user.interface";
const router = Router();

router.post(
  "/",
  valid(addcategorySchema) as RequestHandler,
  isAuth([Roles.Admin, Roles.SuperAdmin]),
  configureMulter().single("image"),
  asyncHandler(categoryService.addCategory)
);

// update course images
router.patch(
  "/update/image/:id"
  //   valid(cokkiesSchema) as RequestHandler,
  //   multerMemory().single("image"), // defult max 5mb and file allow is images
  //   isAuth([Roles.Instructor]),
  //   asyncHandler(courseServices.updatecourseImage)
);
export default router;
