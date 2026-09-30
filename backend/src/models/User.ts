import { Schema, model, Document, Types } from "mongoose";
import { UserRole } from "../types";

export interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: { url: string; publicId: string };
  phone?: string;
  address?: IAddress;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<IAddress>(
  {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  { _id: false }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.CUSTOMER },
    avatar: { url: String, publicId: String },
    phone: { type: String, trim: true },
    address: addressSchema,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default model<IUser>("User", userSchema);
