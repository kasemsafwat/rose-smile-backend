import { Document, Types } from "mongoose";

export enum Roles {
  User = "user",
  SuperAdmin = "superadmin",
  Admin = "admin",
}

export interface Iuser extends Document {
  _id: Types.ObjectId;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phone?: string;
  role?: Roles;
  isConfirmed?: boolean;
  isOnline?: boolean;
  image?: {
    id?: string;
    url?: string;
  };
}
