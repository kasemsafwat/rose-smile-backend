// utils/multerConfig.ts

import multer from "multer";
import { Request } from "express";
import { CustomError } from "./errorHandling";
import fs from "fs";
import path from "path";

export const FileType = {
  Images: [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "image/bmp",
    "image/webp",
    "image/tiff",
    "image/svg+xml",
    "image/heif",
    "image/heic",
    "image/avif",
    "image/x-icon",
    "image/vnd.microsoft.icon",
    "image/vnd.wap.wbmp",
    "image/jp2",
    "image/jxr",
    "image/x-citrix-jpeg",
    "image/x-citrix-png",
    "image/x-portable-anymap",
    "image/x-portable-bitmap",
    "image/x-portable-graymap",
    "image/x-portable-pixmap",
    "image/x-tga",
    "image/x-xbitmap",
    "image/x-xpixmap",
  ],
  Videos: [
    "video/mp4",
    "video/mpeg",
    "video/webm",
    "video/ogg",
    "video/avi",
    "video/mov",
    "video/wmv",
    "video/flv",
    "video/mkv",
  ],
  Audios: [
    "audio/mpeg",
    "audio/wav",
    "audio/ogg",
    "audio/mp3",
    "audio/flac",
    "audio/aac",
    "audio/m4a",
    "audio/wma",
    "audio/amr",
  ],
  Files: [
    "application/pdf",
    "application/javascript",
    "application/json",
    "text/plain",
    "text/html",
    "application/xml",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ],
  Archives: [
    "application/zip",
    "application/x-rar-compressed",
    "application/x-7z-compressed",
    "application/gzip",
    "application/x-tar",
  ],
  Others: ["application/octet-stream", "application/x-msdownload"],
};




export const configureMulter = (
  fileSize: number = 7 * 1024 * 1024,
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
  allowedFileTypes: Array<string> = FileType.Images
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
