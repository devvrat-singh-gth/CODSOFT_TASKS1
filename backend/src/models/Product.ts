import { Schema, model, Document, Types } from "mongoose";

export interface IProductImage {
  url: string;
  publicId: string;
  alt?: string;
}

export interface ISpecification {
  key: string;
  value: string;
}

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  brand?: string;
  category: Types.ObjectId;
  subcategory?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  sku: string;
  images: IProductImage[];
  specifications: ISpecification[];
  ratingAverage: number;
  ratingCount: number;
  reviewCount: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    brand: { type: String, trim: true, index: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    subcategory: { type: String, trim: true },

    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },

    stock: { type: Number, required: true, min: 0, default: 0 },
    sku: { type: String, required: true, unique: true },

    images: {
      type: [
        {
          url: { type: String, required: true },
          publicId: { type: String, required: true },
          alt: String,
        },
      ],
      default: [],
    },

    specifications: {
      type: [{ key: String, value: String }],
      default: [],
    },

    ratingAverage: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },

    isFeatured: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

// Text index for search; compound indexes for the most common filter/sort combos.
productSchema.index({ name: "text", description: "text", brand: "text" });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ isActive: 1, isFeatured: 1 });

export default model<IProduct>("Product", productSchema);
