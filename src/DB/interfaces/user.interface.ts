import { Document, Types } from "mongoose";

export interface ISocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  facebook?: string;
  portfolio?: string;
}

export enum Roles {
  User = "user",
  Admin = "admin",
  Instructor = "instructor",
}

export interface Iuser extends Document {
  _id: Types.ObjectId;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  age?: number;
  phone?: string;
  role?: Roles;
  isConfirmed?: boolean;
  isOnline?: boolean;
  avatar?: string;
  frontId?: string;
  backId?: string;
  requiredVideo?: string;
  optionalVideo?: string;
  jobTitle?: string;
  code?: number;
  verificationStatus: 'pending' | 'approved' | 'rejected' | 'none'; 
  socialLinks?: ISocialLinks;
}


