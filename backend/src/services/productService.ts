import { FilterQuery } from "mongoose";
import Product, { IProduct } from "../models/Product";
import Category from "../models/Category";
import { ApiError } from "../utils/apiError";
import { toSlug } from "../utils/slugify";
import {
  parsePagination,
  buildPaginationMeta,
} from "../utils/pagination";
import {
  deleteImage,
  uploadImage,
} from "./cloudinaryService";

export interface ProductQuery {
  page?: string;
  limit?: string;
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  rating?: string;
  featured?: string;
  sort?: string;
  [key: string]: unknown;
}

const SORT_MAP: Record<
  string,
  Record<string, 1 | -1>
> = {
  newest: {
    createdAt: -1,
  },

  "price-asc": {
    price: 1,
  },

  "price-desc": {
    price: -1,
  },

  "name-asc": {
    name: 1,
  },

  "name-desc": {
    name: -1,
  },

  rating: {
    ratingAverage: -1,
  },

  popularity: {
    reviewCount: -1,
  },
};

// Escape user input before using it in a regular expression.
// This keeps live search safe and prevents regex syntax from
// changing the intended database query.
function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Public product listing:
// - only active products
// - live partial-text search
// - category filtering
// - brand filtering
// - price filtering
// - rating filtering
// - featured filtering
// - database-side sorting
// - database-side pagination
export async function listProducts(
  query: ProductQuery
) {
  const { page, limit, skip } = parsePagination(query);

  const filter: FilterQuery<IProduct> = {
    isActive: true,
  };

  /*
   * LIVE PRODUCT SEARCH
   *
   * This intentionally uses partial regex matching instead of
   * MongoDB $text search.
   *
   * Examples:
   *
   * "s"    → Samsung
   * "sa"   → Samsung
   * "sam"  → Samsung
   * "sams" → Samsung
   *
   * Search checks the product name, brand, description,
   * and SKU.
   */
  if (query.search?.trim()) {
    const searchText = escapeRegex(
      query.search.trim()
    );

    const searchRegex = new RegExp(
      searchText,
      "i"
    );

    filter.$or = [
      {
        name: searchRegex,
      },
      {
        brand: searchRegex,
      },
      {
        description: searchRegex,
      },
      {
        sku: searchRegex,
      },
    ];
  }

  /*
   * CATEGORY FILTER
   */
  if (query.category) {
    filter.category = query.category;
  }

  /*
   * BRAND FILTER
   *
   * Partial and case-insensitive matching.
   */
  if (query.brand?.trim()) {
    const brandRegex = new RegExp(
      escapeRegex(query.brand.trim()),
      "i"
    );

    filter.brand = brandRegex;
  }

  /*
   * FEATURED PRODUCTS
   */
  if (query.featured === "true") {
    filter.isFeatured = true;
  }

  /*
   * PRICE RANGE
   */
  if (query.minPrice || query.maxPrice) {
    filter.price = {};

    if (query.minPrice) {
      const minPrice = Number(
        query.minPrice
      );

      if (Number.isFinite(minPrice)) {
        filter.price.$gte = minPrice;
      }
    }

    if (query.maxPrice) {
      const maxPrice = Number(
        query.maxPrice
      );

      if (Number.isFinite(maxPrice)) {
        filter.price.$lte = maxPrice;
      }
    }
  }

  /*
   * RATING FILTER
   */
  if (query.rating) {
    const rating = Number(
      query.rating
    );

    if (Number.isFinite(rating)) {
      filter.ratingAverage = {
        $gte: rating,
      };
    }
  }

  /*
   * SORTING
   *
   * The frontend currently sends:
   *
   * newest
   * price-asc
   * price-desc
   * name-asc
   * name-desc
   */
  const sort =
    SORT_MAP[query.sort || ""] ||
    SORT_MAP.newest;

  /*
   * Run the product query and total count together.
   */
  const [products, total] =
    await Promise.all([
      Product.find(filter)
        .populate(
          "category",
          "name slug"
        )
        .sort(sort)
        .skip(skip)
        .limit(limit),

      Product.countDocuments(filter),
    ]);

  return {
    products,
    pagination: buildPaginationMeta(
      total,
      page,
      limit
    ),
  };
}

export async function getProductById(
  id: string
) {
  const product =
    await Product.findById(id).populate(
      "category",
      "name slug"
    );

  if (
    !product ||
    !product.isActive
  ) {
    throw ApiError.notFound(
      "Product not found"
    );
  }

  return product;
}

// Admin variant: returns inactive products too,
// since admins manage the full catalog.
export async function getProductByIdForAdmin(
  id: string
) {
  const product =
    await Product.findById(id).populate(
      "category",
      "name slug"
    );

  if (!product) {
    throw ApiError.notFound(
      "Product not found"
    );
  }

  return product;
}

interface CreateProductInput {
  name: string;
  description: string;
  brand?: string;
  category: string;
  subcategory?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  sku: string;
  specifications?: {
    key: string;
    value: string;
  }[];
  isFeatured?: boolean;
}

export async function createProduct(
  data: CreateProductInput,
  files: Express.Multer.File[] = []
) {
  const category =
    await Category.findById(
      data.category
    );

  if (!category) {
    throw ApiError.badRequest(
      "Selected category does not exist"
    );
  }

  const existingSku =
    await Product.findOne({
      sku: data.sku,
    });

  if (existingSku) {
    throw ApiError.conflict(
      "A product with this SKU already exists"
    );
  }

  const images = await Promise.all(
    files.map(async (file) => {
      const uploaded =
        await uploadImage(
          file.buffer,
          "ecommerce/products"
        );

      return {
        url: uploaded.url,
        publicId: uploaded.publicId,
      };
    })
  );

  const slug = toSlug(
    data.name
  );

  return Product.create({
    ...data,
    slug,
    images,
  });
}

export async function updateProduct(
  id: string,
  data: Partial<CreateProductInput> & {
    isActive?: boolean;
  },
  files: Express.Multer.File[] = []
) {
  const product =
    await getProductByIdForAdmin(id);

  if (data.category) {
    const category =
      await Category.findById(
        data.category
      );

    if (!category) {
      throw ApiError.badRequest(
        "Selected category does not exist"
      );
    }
  }

  /*
   * Upload newly added images.
   */
  if (files.length) {
    const uploaded =
      await Promise.all(
        files.map(async (file) => {
          const result =
            await uploadImage(
              file.buffer,
              "ecommerce/products"
            );

          return {
            url: result.url,
            publicId: result.publicId,
          };
        })
      );

    product.images.push(
      ...uploaded
    );
  }

  /*
   * Regenerate slug if product name changes.
   */
  if (
    data.name &&
    data.name !== product.name
  ) {
    product.slug = toSlug(
      data.name
    );
  }

  Object.assign(
    product,
    data
  );

  await product.save();

  return product;
}

export async function deleteProductImage(
  productId: string,
  publicId: string
) {
  const product =
    await getProductByIdForAdmin(
      productId
    );

  product.images =
    product.images.filter(
      (image) =>
        image.publicId !== publicId
    );

  await product.save();

  await deleteImage(
    publicId
  );

  return product;
}

export async function deleteProduct(
  id: string
) {
  const product =
    await getProductByIdForAdmin(id);

  await Promise.all(
    product.images.map(
      (image) =>
        deleteImage(
          image.publicId
        )
    )
  );

  await product.deleteOne();
}

export async function setProductActive(
  id: string,
  isActive: boolean
) {
  const product =
    await getProductByIdForAdmin(id);

  product.isActive =
    isActive;

  await product.save();

  return product;
}

// Used by cartService/orderService.
// Never trust a price sent by the client.
export async function getProductForPurchase(
  id: string
) {
  const product =
    await Product.findById(id);

  if (
    !product ||
    !product.isActive
  ) {
    throw ApiError.badRequest(
      "One of the products in your request is no longer available"
    );
  }

  return product;
}

export function effectivePrice(
  product: IProduct
): number {
  return product.discountPrice &&
    product.discountPrice > 0
    ? product.discountPrice
    : product.price;
}