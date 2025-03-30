import { Document } from 'mongoose';

export interface INotification extends Document {
    userId: string;
    message: string;
    courseId: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}
