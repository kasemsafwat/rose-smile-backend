import fs from "fs";
import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../../utils/errorHandling";
import { CloudinaryService } from "../../../utils/cloudinary";
import categoryModel from "../../../DB/models/category.model";
import { CLOUDINARYOPTIONS } from "../../../config/env";
import ApiPipeline from "../../../utils/apiFeacture";
import { forEach, update } from "lodash";

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

  const response = await new CloudinaryService().uploadFile(
    req.file.path,
    `category/${category._id}`
  );

  if (!response) {
    return next(new CustomError("Failed to upload image", 500));
  }

  category.image.imageUrl = response.secure_url;
  category.image.id = response.public_id;

  // Save the category to the database
  await category.save();

  return res.status(201).json({
    message: "Category created successfully",
    category,
  });
};

export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const category = await categoryModel.findById(id).lean();
  if (!category) {
    return next(new CustomError("category not found", 404));
  }

  const versions = await new CloudinaryService().imageVersions(
    category.image?.id
  );
  category.image = { ...category.image, ...versions };

  return res.status(200).json({
    message: "Category fetched successfully",
    statusCode: 200,
    success: true,
    category,
  });
};

// search in categorys
const allowSearchFields = ["title", "desc"];
const defaultFields = ["title", "desc", "image"];
export const searchCategory = async (
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

  const [total, categories] = await Promise.all([
    categoryModel.countDocuments().lean(),
    categoryModel.aggregate(pipeline).exec(),
  ]);

  // add image versions
  for await (const category of categories) {
    if (category.image) {
      const versions = await new CloudinaryService().imageVersions(
        category.image?.id
      );
      category.image = { ...category.image, ...versions };
    }
  }

  return res.status(200).json({
    message: "categories fetched successfully",
    statusCode: 200,
    totalcategories: total,
    totalPages: Math.ceil(total / Number(size || 21)),
    success: true,
    categories: categories,
  });
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { categoryId } = req.query;
  const { title, desc } = req.body;

  if (!title && !desc && !req.file) {
    return next(new CustomError("No fields provided to update", 400));
  }

  const updatedFields: any = {};

  if (req.file) {
    const category = await categoryModel.findById(categoryId).lean();
    if (!category) {
      return next(new CustomError("Category not found", 404));
    }
    const { metadata, secure_url, public_id } =
      await new CloudinaryService().updateFile(
        category.image.id,
        req.file.path
      );
    const image: any = {};
    image.imageUrl = secure_url;
    image.id = public_id;
    updatedFields.image = image;
  }

  if (title) updatedFields.title = title;
  if (desc) updatedFields.desc = desc;

  const updatedCategory = await categoryModel.findByIdAndUpdate(
    categoryId,
    { $set: updatedFields },
    { new: true, runValidators: true }
  );

  if (!updatedCategory) {
    return next(new CustomError("Category not found", 404));
  }

  return res.status(200).json({
    message: "Category updated successfully",
    statusCode: 200,
    success: true,
    category: updatedCategory,
  });
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const category = await categoryModel.findByIdAndDelete(
    { _id: id },
    { new: true }
  );

  if (!category) {
    return next(new CustomError("category not found", 404));
  }

  new CloudinaryService().deleteFile(category.image.id).then((result) => {
    console.log("deleted successfully", result);
  });

  return res.status(200).json({
    message: "Category deleted successfully",
    statusCode: 200,
    success: true,
    category,
  });
};

// export const ------ = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {};
