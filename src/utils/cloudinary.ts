import fs from "fs";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { CLOUDINARY, CLOUDINARYOPTIONS } from "../config/env";

export interface imageOptions {
  width?: number;
  height?: number;
  crop?: string;
  quality?: string;
  format?: string;
  flags?: string;
  effect?: string;
  gravity?: string;
  radius?: string;
}

export interface CloudinaryResponse extends UploadApiResponse {
  secure_url: string;
  public_id: string;
  metadata: object;
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
    setting: imageOptions = CLOUDINARYOPTIONS.heroBanner
  ): Promise<UploadApiResponse> {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder,
        transformation: [setting],
      });

      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting local file:", err.message);
          } else {
            console.log("Local file deleted successfully");
          }
        });
      }

      return result as CloudinaryResponse;
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
    filePath: string,
    options: imageOptions = CLOUDINARYOPTIONS.heroBanner
  ): Promise<UploadApiResponse> {
    console.log({ publicId, filePath });

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        public_id: publicId,
        transformation: [options],
        invalidate: true,
      });

      if (!result || !result.secure_url) {
        throw new Error("Failed to upload image to Cloudinary");
      }

      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting local file:", err.message);
          }
        });
      }

      return result as CloudinaryResponse;
    } catch (error) {
      throw new Error(`Cloudinary Update Error: ${(error as Error).message}`);
    }
  }

  async imageVersions(publicId: string) {
    const [heroBanner, cardImage, thumbnailMedium, backgroundLarge] =
      await Promise.all([
        this.generateImageUrl(publicId as string, CLOUDINARYOPTIONS.heroBanner),
        this.generateImageUrl(publicId as string, CLOUDINARYOPTIONS.cardImage),
        this.generateImageUrl(publicId, CLOUDINARYOPTIONS.thumbnailMedium),
        this.generateImageUrl(publicId, CLOUDINARYOPTIONS.backgroundLarge),
      ]);

    return { heroBanner, cardImage, thumbnailMedium, backgroundLarge };
  }

  generateImageUrl(
    publicId: string,
    options: imageOptions = CLOUDINARYOPTIONS.heroBanner
  ): string {
    return cloudinary.url(publicId, {
      transformation: [options],
    });
  }
}
