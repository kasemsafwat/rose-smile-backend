// utils/multerConfig.ts

import multer, { MulterError } from "multer";
import { Request } from "express";
import { FileType } from "./files.allowed";
import { CustomError } from "./errorHandling";
import fs from "fs";
import path from "path";

export const configureMulter = (
  fileSize: number = 5 * 1024 * 1024,
  allowedFileTypes: Array<string> = FileType.Images,
  folder: string = "uploads"
) => {
  const storage = multer.diskStorage({
    destination(req, file, callback) {
      try {
        const uploadPath = path.join(process.cwd(), folder);
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        callback(null, uploadPath);
      } catch (error) {
        callback(new Error("Failed to create upload directory"), "");
      }
    },
    filename(req, file, callback) {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      callback(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
    },
  });

  const fileFilter = (req: Request, file: any, callback: any) => {
    if (allowedFileTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(
        new CustomError(`Invalid file type: ${file.mimetype}.`, 400),
        false
      );
    }
  };

  const limits = { fileSize };

  return multer({ storage, fileFilter, limits });
};

export const multerMemory = (
  fileSize: number = 5 * 1024 * 1024,
  allowedFileTypes: Array<string> = [...FileType.Images]
) => {
  const storage = multer.memoryStorage();

  const fileFilter = (req: Request, file: any, callback: any) => {
    if (allowedFileTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(
        new CustomError(`Invalid file type: ${file.mimetype}.`, 400),
        false
      );
    }
  };

  const limits = { fileSize };

  return multer({ storage, fileFilter, limits });
};
