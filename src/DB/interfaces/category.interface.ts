import { Document, Types } from "mongoose";

export interface Icategory extends Document {
  _id: Types.ObjectId;
  title: string;
  desc: string;
  image: string;
}

export interface Iservice extends Document {
  _id: Types.ObjectId;
  title: string;
  desc: string;
  images: Array<string>;
  categoryId: Types.ObjectId;
}
