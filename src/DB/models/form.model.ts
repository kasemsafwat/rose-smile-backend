import { Schema, model } from 'mongoose';
import { Iform } from '../interfaces/form.interface';

const formSchema = new Schema<Iform>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    service: { type: Schema.Types.ObjectId, ref: 'service', required: true },
    city: { type: String, required: true },
    comment: { type: String },
    status: {
      type: String,
      enum: ['pending', 'absent', 'completed'],
      default: 'pending',
    },
    editedBy: { type: Schema.Types.ObjectId, ref: 'user' },
  },
  { timestamps: true }
);

const formModel = model<Iform>('form', formSchema);

export default formModel;
