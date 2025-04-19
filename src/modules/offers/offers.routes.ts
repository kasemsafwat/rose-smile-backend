import { RequestHandler, Router } from "express";
import * as offersService from "./service/offers.service";
import { asyncHandler } from "../../utils/errorHandling";
import { isAuth } from "../../middleware/auth";
import { Roles } from "../../DB/interfaces/user.interface";
import { valid } from "../../middleware/validation";
import {
  createOfferSchema,
  deleteOfferSchema,
  getOfferByIdSchema,
  getOffersSchema,
  updateOfferImageSchema,
  updateOfferSchema,
} from "./offer.vaild";
import { configureMulter, FileType } from "../../utils/multer";
const router = Router();

//create offer
router.post(
  "/",
  configureMulter().single("image"),
  valid(createOfferSchema) as RequestHandler,
  isAuth([Roles.Admin, Roles.SuperAdmin]),
  asyncHandler(offersService.createOffer)
);

//get all offers
router.get(
  "/",
  valid(getOffersSchema) as RequestHandler,
  asyncHandler(offersService.getOffers)
);

//get offer by id
router.get(
  "/:id",
  valid(getOfferByIdSchema) as RequestHandler,
  asyncHandler(offersService.getOfferById)
);

//update offer
router.put(
  "/:id",
  valid(updateOfferSchema) as RequestHandler,
  isAuth([Roles.Admin, Roles.SuperAdmin]),
  asyncHandler(offersService.updateOffer)
);

//update offer image
router.put(
  "/image/:id",
  configureMulter(1024 * 1024 * 7, FileType.Images).single("image"),
  valid(updateOfferImageSchema) as RequestHandler,
  isAuth([Roles.Admin, Roles.SuperAdmin]),
  asyncHandler(offersService.updateOfferImage)
);

//delete offer
router.delete(
  "/:id",
  valid(deleteOfferSchema) as RequestHandler,
  isAuth([Roles.Admin, Roles.SuperAdmin]),
  asyncHandler(offersService.deleteOffer)
);

export default router;
