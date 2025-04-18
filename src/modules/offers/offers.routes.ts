import { Router, Request, Response, NextFunction } from "express";
import * as offersService from "./service/offers.service";
import { asyncHandler } from "../../utils/errorHandling";
const router = Router();

router.post("/", asyncHandler(offersService.createOffer));
router.get("/", asyncHandler(offersService.getOffers));
router.get("/:id", asyncHandler(offersService.getOfferById));
router.put("/:id", asyncHandler(offersService.updateOffer));
router.delete("/:id", asyncHandler(offersService.deleteOffer));

export default router;
