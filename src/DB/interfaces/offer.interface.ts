import { Types } from "mongoose";

export interface IofferSection extends Document {
  _id?: Types.ObjectId;
  title: string;
  desc: string;
  image: string;
  offers: Array<Types.ObjectId>;
}

export interface Ioffer extends Document {
  _id?: Types.ObjectId;
  title: string;
  desc: string;
  display: Boolean;
  discount?: number;
  type: "category" | "service";
  reference: Types.ObjectId;
}
