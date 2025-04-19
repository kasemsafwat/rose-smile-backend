import { Types } from "mongoose";

export interface IofferSection extends Document {
  _id?: Types.ObjectId;
  title: string;
  desc: string;
  offers: Array<Types.ObjectId>;
}

export interface Ioffer extends Document {
  _id?: Types.ObjectId;
  title: string;
  image: {
    url: string;
    id: string;
  };
  desc: string;
  display: Boolean;
  type: "section" | "service";
  reference: Types.ObjectId;
}
