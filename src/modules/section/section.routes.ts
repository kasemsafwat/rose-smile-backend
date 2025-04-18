import { Router, RequestHandler } from "express";
import { valid } from "../../middleware/validation";
import * as sectionService from "./service/section.service";
import { configureMulter } from "../../utils/multer";
import { asyncHandler } from "../../utils/errorHandling";
import {
  addsectionSchema,
  sectionIdSchema,
  searchSchema,
  updatesectionSchema,
} from "./section.vaild";

import { isAuth } from "../../middleware/auth";
import { Roles } from "../../DB/interfaces/user.interface";
const router = Router();

router.post(
  "/add",
  configureMulter().single("image"),
  valid(addsectionSchema) as RequestHandler,
  isAuth([Roles.Admin, Roles.SuperAdmin]),
  asyncHandler(sectionService.addsection)
);

router.patch(
  "/update",
  configureMulter().single("image"),
  valid(updatesectionSchema) as RequestHandler,
  isAuth([Roles.Admin, Roles.SuperAdmin]),
  asyncHandler(sectionService.updatesection)
);

// get section By Id
router.get(
  "/:id",
  valid(sectionIdSchema) as RequestHandler,
  asyncHandler(sectionService.getsectionById)
);

// search section
router.get(
  "/",
  valid(searchSchema) as RequestHandler,
  asyncHandler(sectionService.searchsection)
);

// delete section
router.delete(
  "/:id",
  valid(sectionIdSchema) as RequestHandler,
  isAuth([Roles.Admin, Roles.SuperAdmin]),
  asyncHandler(sectionService.deletesection)
);

export default router;
