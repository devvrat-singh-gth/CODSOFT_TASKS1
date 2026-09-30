/* eslint-disable no-console */
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db";
import mongoose from "mongoose";
import User from "../models/User";
import Category from "../models/Category";
import Product from "../models/Product";
import { toSlug } from "../utils/slugify";
import { UserRole } from "../types";

const CATEGORY_NAMES = [
  "Electronics",
  "Fashion",
  "Home & Kitchen",
  "Beauty & Personal Care",
  "Sports & Fitness",
  "Books",
  "Accessories",
  "Toys & Games",
  "Grocery",
  "Furniture",
];

const BRANDS = ["Aurora", "Nexo", "Vantex", "Solace", "Kairo", "Meridian", "Pulseon", "Driftwood"];

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPrice() {
  return randInt(299, 24999);
}

async function seed() {
  await connectDB();
  console.log("[seed] Connected. Clearing existing catalog + demo users...");

  await Promise.all([
    Product.deleteMany({}),
    Category.deleteMany({}),
    User.deleteMany({ email: { $in: ["admin@example.com", "customer@example.com"] } }),
  ]);

  const categories = await Category.insertMany(
    CATEGORY_NAMES.map((name) => ({
      name,
      slug: toSlug(name, false),
      description: `${name} products`,
      isActive: true,
    }))
  );
  console.log(`[seed] Created ${categories.length} categories`);

  const productDocs = [];
  const PRODUCTS_PER_CATEGORY = 15; // ~150 total, within the 100-300 target range

  for (const category of categories) {
    for (let i = 0; i < PRODUCTS_PER_CATEGORY; i++) {
      const brand = BRANDS[randInt(0, BRANDS.length - 1)];
      const price = randomPrice();
      const hasDiscount = Math.random() < 0.35;
      const name = `${brand} ${category.name.split(" ")[0]} ${["Pro", "Max", "Lite", "Plus", "Edge", "Core"][randInt(0, 5)]} ${i + 1}`;

      productDocs.push({
        name,
        slug: toSlug(name),
        description: `A well-built ${category.name.toLowerCase()} product from ${brand}, designed for everyday reliability and value.`,
        brand,
        category: category._id,
        price,
        discountPrice: hasDiscount ? Math.round(price * (1 - randInt(5, 30) / 100)) : undefined,
        stock: randInt(0, 200),
        sku: `${brand.slice(0, 3).toUpperCase()}-${category.name.slice(0, 3).toUpperCase()}-${randInt(1000, 9999)}`,
        images: [],
        specifications: [
          { key: "Warranty", value: `${randInt(0, 2)} year(s)` },
          { key: "Weight", value: `${(Math.random() * 3 + 0.1).toFixed(2)} kg` },
        ],
        ratingAverage: Math.round((Math.random() * 5) * 10) / 10,
        ratingCount: randInt(0, 500),
        reviewCount: randInt(0, 500),
        isFeatured: Math.random() < 0.12,
        isActive: true,
      });
    }
  }

  await Product.insertMany(productDocs);
  console.log(`[seed] Created ${productDocs.length} products`);

  const adminPassword = await bcrypt.hash("Admin@12345", 10);
  const customerPassword = await bcrypt.hash("Customer@12345", 10);

  await User.create([
    {
      name: "Admin User",
      email: "admin@example.com",
      password: adminPassword,
      role: UserRole.ADMIN,
    },
    {
      name: "Test Customer",
      email: "customer@example.com",
      password: customerPassword,
      role: UserRole.CUSTOMER,
    },
  ]);
  console.log("[seed] Created admin@example.com / Admin@12345");
  console.log("[seed] Created customer@example.com / Customer@12345");

  console.log("[seed] Done.");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("[seed] Failed:", err);
  process.exit(1);
});
