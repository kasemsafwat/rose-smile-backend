import { NextFunction, Request, Response } from "express";
import serviceModel from "../../../DB/models/service.model";
import { CustomError } from "../../../utils/errorHandling";
import {
  CloudinaryResponse,
  CloudinaryService,
} from "../../../utils/cloudinary";
import sectionModel from "../../../DB/models/section.model";
import ApiPipeline from "../../../utils/apiFeacture";
import mongoose from "mongoose";

export const createService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, desc, sectionId } = req.body;

  if (!req?.file) {
    return next(new CustomError("No files uploaded", 400));
  }

  const section = await sectionModel.findById(sectionId).lean().select("_id");
  if (!section) return next(new CustomError("Section not found", 404));

  const service = new serviceModel({
    title,
    desc,
    sectionId: section._id,
  });

  const { secure_url, public_id } = await new CloudinaryService().uploadFile(
    req.file.path,
    `service/${service._id}`
  );

  service.image = { url: secure_url, id: public_id };

  const savedService = await service.save();

  if (!savedService) {
    await new CloudinaryService().deleteFile(public_id);
    return next(new CustomError("Failed to create service", 500));
  }

  return res.status(201).json({
    message: "Service created successfully",
    success: true,
    statusCode: 201,
    service: savedService,
  });
};

export const getServiceById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const service = await serviceModel
    .findById(id)
    .populate({
      path: "sectionId",
      select: "_id title image desc",
    })
    .lean();

  // if service not found
  if (!service) return next(new CustomError("Service not found", 404));

  const versions = await new CloudinaryService().imageVersions(
    service.image?.id
  );
  service.image = { ...service.image, ...versions };

  //response
  res.status(200).json({
    message: "Service fetched successfully",
    success: true,
    statusCode: 200,
    service,
  });
};

export const updateService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { title, desc, sectionId } = req.body;

  const findService = await serviceModel.findById(id);

  // if service not found
  if (!findService) return next(new CustomError("Service not found", 404));

  // update data
  const updateData: any = {};
  if (title) updateData.title = title;
  if (desc) updateData.desc = desc;

  if (sectionId && sectionId.toString() !== findService.sectionId.toString()) {
    const findSection = await sectionModel.findById(sectionId);
    if (!findSection) return next(new CustomError("Section not found", 404));
    updateData.sectionId = sectionId;
  }

  // update service
  const service = await serviceModel.findByIdAndUpdate(id, updateData, {
    new: true,
    lean: true,
  });

  // response
  return res.status(200).json({
    message: "Service updated successfully",
    success: true,
    statusCode: 200,
    service,
  });
};

export const updateServiceImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (!req?.file) {
    return next(new CustomError("No file uploaded", 400));
  }

  const findService = await serviceModel.findById(id);
  if (!findService) return next(new CustomError("Service not found", 404));

  const { secure_url, public_id } = await new CloudinaryService().updateFile(
    findService.image.id,
    req.file?.path
  );

  findService.image = { url: secure_url, id: public_id };

  await findService.save();

  return res.status(200).json({
    message: "Service image updated successfully",
    success: true,
    statusCode: 200,
    service: findService,
  });
};

export const deleteService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const service = await serviceModel.findByIdAndDelete(id);
  if (!service) {
    return next(new CustomError("Service not found", 404));
  }

  await new CloudinaryService().deleteFile(service.image.id);

  return res.status(200).json({
    message: "Service deleted successfully",
    success: true,
    statusCode: 200,
  });
};

// search in sections
const allowSearchFields = ["title", "desc"];
const defaultFields = ["title", "desc", "image", "section"];
export const getServices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { page, size, search, sort, select, sectionIds } = req.query;

  const pipeline = new ApiPipeline()
    .searchIds(
      "sectionId",
      sectionIds as unknown as Array<mongoose.Types.ObjectId>
    )
    .match({
      fields: allowSearchFields,
      search: search?.toString() || "",
      op: "$or",
    })
    .sort(sort?.toString() || "")
    .paginate(Number(page) || 1, Number(size) || 100)
    .lookUp(
      {
        from: "sections",
        localField: "sectionId",
        foreignField: "_id",
        as: "section",
        isArray: false,
      },
      {
        title: 1,
        image: 1,
      }
    )
    .projection({
      allowFields: defaultFields,
      defaultFields: defaultFields,
      select: select?.toString() || "",
    })
    .build();

  const [total, services] = await Promise.all([
    serviceModel.countDocuments().lean(),
    serviceModel.aggregate(pipeline).exec(),
  ]);

  // add image versions
  const updatedServices = await Promise.all(
    services.map(async (service) => {
      if (service.image) {
        const versions = await new CloudinaryService().imageVersions(
          service.image.id
        );
        return { ...service, image: { ...service.image, ...versions } };
      }
      return service;
    })
  );

  return res.status(200).json({
    message: "services fetched successfully",
    statusCode: 200,
    totalServices: total,
    totalPages: Math.ceil(total / Number(size || 21)),
    success: true,
    services: updatedServices,
  });
};

// export const addNewImagesService = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { id } = req.params;

//   // check if files are uploaded
//   if (!req?.files) {
//     return next(new CustomError("No files uploaded", 400));
//   }

//   // find service
//   const findService = await serviceModel.findById(id);
//   if (!findService) return next(new CustomError("Service not found", 404));

//   // upload files to cloudinary
//   const imagesPromises = (req.files as Express.Multer.File[]).map((file) => {
//     return new CloudinaryService().uploadFile(
//       file.path,
//       `service/${findService._id}`
//     );
//   });

//   // get responses
//   const responses: CloudinaryResponse[] = await Promise.all(imagesPromises);
//   const newImages = responses.map((response: CloudinaryResponse) => {
//     return {
//       url: response.secure_url,
//       id: response.public_id,
//     };
//   });

//   // update service
//   const updateService = await serviceModel.findByIdAndUpdate(
//     id,
//     {
//       $push: {
//         images: { $each: newImages },
//       },
//     },
//     {
//       new: true,
//       lean: true,
//     }
//   );

//   // response
//   return res.status(200).json({
//     message: "Images added successfully",
//     success: true,
//     statusCode: 200,
//     service: updateService,
//   });
// };

// export const updateServiceImage = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { id } = req.params;
//   const { imageId } = req.body;

//   if (!req?.file) {
//     return next(new CustomError("No file uploaded", 400));
//   }

//   const findService = await serviceModel.findById(id);
//   if (!findService) return next(new CustomError("Service not found", 404));

//   // upload file to cloudinary
//   const response = await new CloudinaryService().updateFile(
//     imageId,
//     req.file.path
//   );

//   const newImage = {
//     url: response.secure_url,
//     id: response.public_id,
//   };

//   // update images
//   const updateService = await serviceModel.updateOne(
//     {
//       _id: id,
//       "images.id": newImage.id,
//     },
//     {
//       $set: {
//         "images.$.url": newImage.url,
//       },
//     }
//   );

//   // response
//   return res.status(200).json({
//     message: "Image updated successfully",
//     success: true,
//     statusCode: 200,
//     service: updateService,
//   });
// };

// export const deleteServiceImage = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { id } = req.params;
//   const { imageIds } = req.body;

//   if (!req?.files) {
//     return next(new CustomError("No files uploaded", 400));
//   }

//   const findService = await serviceModel.findById(id);
//   if (!findService) return next(new CustomError("Service not found", 404));

//   // delete images
//   const deleteImages = await new CloudinaryService().deleteMultipleFiles(
//     imageIds
//   );

//   if (!deleteImages)
//     return next(new CustomError("Failed to delete images", 500));

//   // update images
//   const updateService = await serviceModel.updateOne(
//     {
//       _id: id,
//       "images.id": { $in: imageIds },
//     },
//     {
//       $pull: {
//         images: { id: { $in: imageIds } },
//       },
//     }
//   );

//   // response
//   return res.status(200).json({
//     message: "Image deleted successfully",
//     success: true,
//     statusCode: 200,
//     service: updateService,
//   });
// };
