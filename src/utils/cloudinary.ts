import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { CLOUDINARY } from "../config/env";

interface imagesSetting {
  width: number;
  height: number;
  crop: string;
  quality: string;
  format: string;
  flags: string;
  effect: string;
}
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: CLOUDINARY.CLOUD_NAME,
      api_key: CLOUDINARY.API_KEY,
      api_secret: CLOUDINARY.API_SECRET,
    });
  }

  async uploadFile(
    filePath: string,
    folder: string = "uploads",
    setting: imagesSetting = {
      width: 1920,
      height: 1080,
      crop: "limit",
      quality: "auto:good",
      format: "auto",
      flags: "progressive",
      effect: "improve",
    }
  ): Promise<UploadApiResponse> {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder,
        transformation: [setting],
      });
      return result;
    } catch (error) {
      throw new Error(`Cloudinary Upload Error: ${(error as Error).message}`);
    }
  }

  async deleteFile(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === "ok";
    } catch (error) {
      throw new Error(`Cloudinary Delete Error: ${(error as Error).message}`);
    }
  }

  async deleteMultipleFiles(publicIds: string[]): Promise<boolean> {
    try {
      const result = await cloudinary.api.delete_resources(publicIds);
      const allDeleted = Object.values(result.deleted).every(
        (val) => val === "deleted"
      );
      return allDeleted;
    } catch (error) {
      throw new Error(
        `Cloudinary Bulk Delete Error: ${(error as Error).message}`
      );
    }
  }

  async updateFile(
    publicId: string,
    options: Record<string, any>
  ): Promise<UploadApiResponse> {
    try {
      const result = await cloudinary.uploader.explicit(publicId, {
        ...options,
        type: "upload",
      });
      return result;
    } catch (error) {
      throw new Error(`Cloudinary Update Error: ${(error as Error).message}`);
    }
  }

  generateImageUrl(
    publicId: string,
    width: number,
    height: number,
    format: string = "jpg"
  ): string {
    return cloudinary.url(publicId, {
      width,
      height,
      crop: "scale",
      format,
    });
  }
}
