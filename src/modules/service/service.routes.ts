import { RequestHandler, Router } from "express";
import * as serviceController from "./service/service.service";
import { isAuth } from "../../middleware/auth";
import { Roles } from "../../DB/interfaces/user.interface";
import { valid } from "../../middleware/validation";
import {
  addServiceSchema,
  deleteServiceSchema,
  getServiceByIdSchema,
  getServicesSchema,
  updateServiceSchema,
} from "./sevice.valid";

const router = Router();

// create a new service
router.post(
  "/",
  valid(addServiceSchema) as RequestHandler,
  isAuth([Roles.Admin, Roles.SuperAdmin]),
  serviceController.createService
);

// update a service by id
router.put(
  "/:id",
  valid(updateServiceSchema) as RequestHandler,
  isAuth([Roles.Admin, Roles.SuperAdmin]),
  serviceController.updateService
);

// delete a service by id
router.delete(
  "/:id",
  valid(deleteServiceSchema) as RequestHandler,
  isAuth([Roles.Admin, Roles.SuperAdmin]),
  serviceController.deleteService
);

// get all services
router.get(
  "/",
  valid(getServicesSchema) as RequestHandler,
  serviceController.getServices
);

// get a service by id
router.get(
  "/:id",
  valid(getServiceByIdSchema) as RequestHandler,
  serviceController.getServiceById
);

export default router;
