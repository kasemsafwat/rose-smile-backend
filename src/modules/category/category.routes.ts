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
import {
  addcategorySchema,
  categoryIdSchema,
  searchSchema,
  updatecategorySchema,
} from "./category.vaild";
import { isAuth } from "../../middleware/auth";
import { Roles } from "../../DB/interfaces/user.interface";
import { cokkiesSchema } from "../auth/auth.validation";
const router = Router();

router.post(
  "/add",
  configureMulter().single("image"),
  valid(cokkiesSchema) as RequestHandler,
  valid(addcategorySchema) as RequestHandler,
  isAuth([Roles.Admin, Roles.SuperAdmin]),
  asyncHandler(categoryService.addCategory)
);

router.patch(
  "/update",
  configureMulter().single("image"),
  valid(cokkiesSchema) as RequestHandler,
  valid(updatecategorySchema) as RequestHandler,
  isAuth([Roles.Admin, Roles.SuperAdmin]),
  asyncHandler(categoryService.updateCategory)
);

// get Category By Id
router.get(
  "/:id",
  valid(categoryIdSchema) as RequestHandler,
  asyncHandler(categoryService.getCategoryById)
);

// search Category
router.get(
  "/",
  valid(searchSchema) as RequestHandler,
  asyncHandler(categoryService.searchCategory)
);

// delete Category
router.delete(
  "/:id",
  valid(categoryIdSchema) as RequestHandler,
  isAuth([Roles.Admin, Roles.SuperAdmin]),
  asyncHandler(categoryService.deleteCategory)
);

export default router;
