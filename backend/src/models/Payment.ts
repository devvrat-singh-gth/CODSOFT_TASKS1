import { Schema, model, Document, Types } from "mongoose";
import { PaymentMethod, PaymentStatus } from "../types";

export interface IPayment extends Document {
  _id: Types.ObjectId;
  order: Types.ObjectId;
  user: Types.ObjectId;
  provider: PaymentMethod;
  providerOrderId?: string;
  providerPaymentId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method?: string;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    provider: { type: String, enum: Object.values(PaymentMethod), required: true },
    providerOrderId: String,
    providerPaymentId: String,
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    status: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING },
    method: String,
    verifiedAt: Date,
  },
  { timestamps: true }
);

export default model<IPayment>("Payment", paymentSchema);
