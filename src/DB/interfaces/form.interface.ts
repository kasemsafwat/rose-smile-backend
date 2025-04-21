import { Document, Types } from 'mongoose';

export interface Iform extends Document {
  name?: string;
  phone?: string;
  service?: Types.ObjectId;
  city?: string;
  comment?: string;
  status?: string;
  editedBy?: Types.ObjectId;
}
