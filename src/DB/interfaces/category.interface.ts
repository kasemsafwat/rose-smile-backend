import { Document, Types } from "mongoose";

export interface Icategory extends Document {
  _id: Types.ObjectId;
  title: string;
  desc: string;
  image: {
    imageUrl: string;
    thumbnailSmall?: string; // 150x100 - Very small image for lists
    thumbnailMedium?: string; // 300x200 - Medium-sized thumbnail for articles
    backgroundLarge?: string; // 1920x1080 - Large background image
    logoSmall?: string; // 100x100 - Small logo for header or corners
    heroBanner?: string; // 1280x720 - Main hero image for the page
    socialIcon?: string; // 32x32 - Social media icon
    profilePicture?: string; // 400x400 - Profile picture for user profiles
    cardImage?: string; // 600x400 - Image used in cards or previews
    id: string;
  };
}

export interface Iservice extends Document {
  _id: Types.ObjectId;
  title: string;
  desc: string;
  images: Array<string>;
  categoryId: Types.ObjectId;
}
