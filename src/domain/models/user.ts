import mongoose, { Document, Schema, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export interface User extends Document {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<User>(
  {
    userId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });
UserSchema.plugin(mongoosePaginate);

export type UserPaginationModel = PaginateModel<User>;
export const User = mongoose.model<User, UserPaginationModel>("User", UserSchema);