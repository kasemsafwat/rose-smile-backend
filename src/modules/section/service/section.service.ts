import fs from "fs";
import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../../utils/errorHandling";
import { CloudinaryService } from "../../../utils/cloudinary";
import sectionModel from "../../../DB/models/section.model";
import { CLOUDINARYOPTIONS } from "../../../config/env";
import ApiPipeline from "../../../utils/apiFeacture";
import { forEach, update } from "lodash";

export const addsection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, desc } = req.body;

  if (!req.file) {
    return next(new CustomError("Image not provided", 400));
  }

  const section = new sectionModel({
    title,
    desc,
  });

  const response = await new CloudinaryService().uploadFile(
    req.file.path,
    `section/${section._id}`
  );

  if (!response) {
    return next(new CustomError("Failed to upload image", 500));
  }

  section.image.imageUrl = response.secure_url;
  section.image.id = response.public_id;

  // Save the section to the database
  await section.save();

  return res.status(201).json({
    message: "section created successfully",
    section,
  });
};

export const getsectionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const section = await sectionModel.findById(id).lean();
  if (!section) {
    return next(new CustomError("section not found", 404));
  }

  const versions = await new CloudinaryService().imageVersions(
    section.image?.id
  );
  section.image = { ...section.image, ...versions };

  return res.status(200).json({
    message: "section fetched successfully",
    statusCode: 200,
    success: true,
    section,
  });
};

// search in sections
const allowSearchFields = ["title", "desc"];
const defaultFields = ["title", "desc", "image"];
export const searchsection = async (
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

  const [total, sections] = await Promise.all([
    sectionModel.countDocuments().lean(),
    sectionModel.aggregate(pipeline).exec(),
  ]);

  // add image versions
  for await (const section of sections) {
    if (section.image) {
      const versions = await new CloudinaryService().imageVersions(
        section.image?.id
      );
      section.image = { ...section.image, ...versions };
    }
  }

  return res.status(200).json({
    message: "sections fetched successfully",
    statusCode: 200,
    totalsections: total,
    totalPages: Math.ceil(total / Number(size || 21)),
    success: true,
    sections: sections,
  });
};

export const updatesection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { sectionId } = req.query;
  const { title, desc } = req.body;

  if (!title && !desc && !req.file) {
    return next(new CustomError("No fields provided to update", 400));
  }

  const updatedFields: any = {};

  if (req.file) {
    const section = await sectionModel.findById(sectionId).lean();
    if (!section) {
      return next(new CustomError("section not found", 404));
    }
    const { metadata, secure_url, public_id } =
      await new CloudinaryService().updateFile(section.image.id, req.file.path);
    const image: any = {};
    image.imageUrl = secure_url;
    image.id = public_id;
    updatedFields.image = image;
  }

  if (title) updatedFields.title = title;
  if (desc) updatedFields.desc = desc;

  const updatedsection = await sectionModel.findByIdAndUpdate(
    sectionId,
    { $set: updatedFields },
    { new: true, runValidators: true }
  );

  if (!updatedsection) {
    return next(new CustomError("section not found", 404));
  }

  return res.status(200).json({
    message: "section updated successfully",
    statusCode: 200,
    success: true,
    section: updatedsection,
  });
};

export const deletesection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const section = await sectionModel.findByIdAndDelete(
    { _id: id },
    { new: true }
  );

  if (!section) {
    return next(new CustomError("section not found", 404));
  }

  new CloudinaryService().deleteFile(section.image.id).then((result) => {
    console.log("deleted successfully", result);
  });

  return res.status(200).json({
    message: "section deleted successfully",
    statusCode: 200,
    success: true,
    section,
  });
};

// export const ------ = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {};
