import { RequestHandler, Router } from "express";
import * as serviceController from "./service/service.service";
import { isAuth } from "../../middleware/auth";
import { Roles } from "../../DB/interfaces/user.interface";
import { valid } from "../../middleware/validation";
import {
  deleteServiceSchema,
  addServiceSchema,
  getServiceByIdSchema,
  getServicesSchema,
  updateServiceSchema,
  updateServiceImageSchema,
} from "./sevice.valid";
import { asyncHandler } from "../../utils/errorHandling";
import { configureMulter, FileType } from "../../utils/multer";
const router = Router();

// create a new service
router.post(
  "/",
  configureMulter(1024 * 1024 * 5, FileType.Images).single("image"),
  valid(addServiceSchema) as RequestHandler,
  isAuth([Roles.Admin, Roles.SuperAdmin]),
  asyncHandler(serviceController.createService)
);

// update a service by id
router.put(
  "/:id",
  valid(updateServiceSchema) as RequestHandler,
  isAuth([Roles.Admin, Roles.SuperAdmin]),
  asyncHandler(serviceController.updateService)
);

// update a service image
router.put(
  "/image/:id",
  configureMulter(1024 * 1024 * 5, FileType.Images).single("image"),
  valid(updateServiceImageSchema) as RequestHandler,
  isAuth([Roles.Admin, Roles.SuperAdmin]),
  asyncHandler(serviceController.updateServiceImage)
);

// delete a service by id
router.delete(
  "/:id",
  valid(deleteServiceSchema) as RequestHandler,
  isAuth([Roles.Admin, Roles.SuperAdmin]),
  asyncHandler(serviceController.deleteService)
);

// get all services
router.get(
  "/",
  valid(getServicesSchema) as RequestHandler,
  asyncHandler(serviceController.getServices)
);

// get a service by id
router.get(
  "/:id",
  valid(getServiceByIdSchema) as RequestHandler,
  asyncHandler(serviceController.getServiceById)
);

// add new images to a service
// router.post(
//   "/:id/images",
//   valid(addServiceImagesSchema) as RequestHandler,
//   isAuth([Roles.Admin, Roles.SuperAdmin]),
//   asyncHandler(serviceController.addNewImagesService)
// );

// delete a service image
// router.delete(
//   "/:id/images/:imageId",
//   valid(deleteServiceImageSchema) as RequestHandler,
//   isAuth([Roles.Admin, Roles.SuperAdmin]),
//   asyncHandler(serviceController.deleteServiceImage)
// );

export default router;
