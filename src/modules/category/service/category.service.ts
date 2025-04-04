import fs from "fs";
import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../../utils/errorHandling";
import { CloudinaryService } from "../../../utils/cloudinary";
import categoryModel from "../../../DB/models/category.model";

export const addCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, desc } = req.body;

  if (!req.file) {
    return next(new CustomError("Image not provided", 400));
  }

  const category = new categoryModel({
    title,
    desc,
  });
  const sanitizedFileName = `${category._id}-${req.file.originalname.replace(
    /\s+/g,
    "_"
  )}`;

  const response = await new CloudinaryService().uploadFile(
    req.file.path,
    `category/${category._id}/${sanitizedFileName}`
  );

  if (!response) {
    return next(new CustomError("Failed to upload image", 500));
  }

  category.image.imageUrl = response.secure_url;
  category.image.id = response.public_id;

  // Save the category to the database
  await category.save();

  // Delete the local file after uploading to Cloudinary

  fs.unlink(req.file.path, (err) => {
    if (err) {
      console.error("Failed to delete local file:", err);
    } else {
      console.log("Local file deleted successfully");
    }
  });

  return res.status(201).json({
    message: "Category created successfully",
    category,
  });
};

// export const ------ = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {};
