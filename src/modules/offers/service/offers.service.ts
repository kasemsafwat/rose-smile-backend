import { Ioffer } from "./../../../DB/interfaces/offer.interface";
import { NextFunction, Request, Response } from "express";
import { offerModel } from "../../../DB/models/offers.model";
import { CustomError } from "../../../utils/errorHandling";
import sectionModel from "../../../DB/models/section.model";
import serviceModel from "../../../DB/models/service.model";
import { CloudinaryService } from "../../../utils/cloudinary";
import ApiPipeline from "../../../utils/apiFeacture";

//create offer
export const createOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, desc, type, display, reference } = req.body;

  if (!req.file) {
    return next(new CustomError("Please upload an image", 400));
  }

  if (type == "section") {
    const isValidReference = await sectionModel.findById(reference);
    if (!isValidReference) {
      return next(new CustomError("section reference not found", 404));
    }
  } else {
    const isValidReference = await serviceModel.findById(reference);
    if (!isValidReference) {
      return next(new CustomError("service reference not found", 404));
    }
  }

  const offerSchema = new offerModel({
    title,
    desc,
    reference,
    display,
    type,
  });

  const { secure_url, public_id } = await new CloudinaryService().uploadFile(
    req.file.path,
    `offers/${offerSchema._id}`
  );

  offerSchema.image = { url: secure_url, id: public_id };

  const offer = await offerSchema.save();

  if (!offer) {
    await new CloudinaryService().deleteFile(public_id);
    return next(new CustomError("Offer not created", 400));
  }

  return res.status(201).json({
    message: "Offer created successfully",
    success: true,
    statusCode: 201,
    offer,
  });
};

//allow search fields
const allowSearchFields = ["title", "desc"];

//default fields
const defaultFields = [
  "title",
  "desc",
  "image",
  "display",
  "type",
  "reference",
  "section",
  "service",
];

//get all offers
export const getOffers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { page, size, search, sort, select } = req.query;

  const pipeline = new ApiPipeline()
    .match({
      fields: allowSearchFields,
      search: search?.toString() || "",
      op: "$or",
    })
    .sort(sort?.toString() || "")
    .paginate(Number(page) || 1, Number(size) || 100)
    .projection({
      allowFields: defaultFields,
      defaultFields: defaultFields,
      select: select?.toString() || "",
    })
    .build();

  const [total, offers] = await Promise.all([
    offerModel.countDocuments().lean(),
    offerModel.aggregate(pipeline).exec(),
  ]);

  // add image versions
  const updatedOffers = await Promise.all(
    offers.map(async (offer) => {
      if (offer.image) {
        const versions = await new CloudinaryService().imageVersions(
          offer.image.id
        );
        return { ...offer, image: { ...offer.image, ...versions } };
      }
      return offer;
    })
  );

  return res.status(200).json({
    message: "offers fetched successfully",
    statusCode: 200,
    totalOffers: total,
    totalPages: Math.ceil(total / Number(size || 21)),
    success: true,
    offers: updatedOffers,
  });
};

//get offer by id
export const getOfferById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const offer = await offerModel.findById(id);
  if (!offer) {
    return next(new CustomError("Offer not found", 404));
  }

  const versions = await new CloudinaryService().imageVersions(offer.image?.id);
  offer.image = { ...offer.image, ...versions };

  return res.status(200).json({
    message: "Offer fetched successfully",
    success: true,
    statusCode: 200,
    offer,
  });
};

//update offer
export const updateOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { title, desc, display, type, reference } = req.body;

  const offer = await offerModel.findById(id);
  if (!offer) {
    return next(new CustomError("Offer not found", 404));
  }

  const updateFeilds: Partial<Ioffer> = {};
  if (title) updateFeilds.title = title;
  if (desc) updateFeilds.desc = desc;
  if (display !== undefined) updateFeilds.display = display;

  if (reference && offer.reference.toString() !== reference.toString()) {
    //update reference
    if (!type) return next(new CustomError("type is required", 400));
    if (type == "section") {
      const isValidReference = await sectionModel.findById(reference);
      if (!isValidReference) {
        return next(new CustomError("section reference not found", 404));
      }
    } else {
      const isValidReference = await serviceModel.findById(reference);
      if (!isValidReference) {
        return next(new CustomError("service reference not found", 404));
      }
    }
    updateFeilds.type = type;
    updateFeilds.reference = reference;
  }
  const updatedOffer = await offerModel.findByIdAndUpdate(id, updateFeilds, {
    new: true,
    lean: true,
  });

  return res.status(200).json({
    message: "Offer updated successfully",
    success: true,
    statusCode: 200,
    offer: updatedOffer,
  });
};

//update offer image
export const updateOfferImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  if (!req.file) {
    return next(new CustomError("Please upload an image", 400));
  }

  const offer = await offerModel.findById(id);
  if (!offer) {
    return next(new CustomError("Offer not found", 404));
  }

  await new CloudinaryService().updateFile(offer.image?.id, req.file.path);

  return res.status(200).json({
    message: "Offer image updated successfully",
    success: true,
    statusCode: 200,
    offer,
  });
};
//delete offer
export const deleteOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const offer = await offerModel.findByIdAndDelete(id);

  if (!offer) {
    return next(new CustomError("Offer not found", 404));
  }

  await new CloudinaryService().deleteFile(offer.image?.id);

  return res.status(200).json({
    message: "Offer deleted successfully",
    success: true,
    statusCode: 200,
    offer,
  });
};
