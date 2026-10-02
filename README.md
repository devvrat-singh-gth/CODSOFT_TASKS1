I want 3 final production level readme (but want you to make the future advancements to do section have the entire production level stuff we have left for now- such that when is done i can simply remove that section instead of regenerating the entire readme again), one primary main readme for entire site consisting entire project explanation, tech stack, workflow and cmds, and other stuff but do not make it extravagant, make it simple but with entire working covered, and then 2 readme for separate frontend and backend folders such that each have their own working, idk if folder structure should be included or not but still i am giving for reference, and also give an about description small but genuine brief for adding github repo about section
Ecommerce/
├── backend/
│   ├── node_modules/
│   ├── src/
│   │   ├── config/
│   │   │   ├── cloudinary.ts
│   │   │   ├── db.ts
│   │   │   ├── env.ts
│   │   │   └── razorpay.ts
│   │   ├── controllers/
│   │   │   ├── adminController.ts
│   │   │   ├── authController.ts
│   │   │   ├── cartController.ts
│   │   │   ├── categoryController.ts
│   │   │   ├── orderController.ts
│   │   │   ├── paymentController.ts
│   │   │   ├── productController.ts
│   │   │   ├── reviewController.ts
│   │   │   ├── userController.ts
│   │   │   └── wishlistController.ts
│   │   ├── middleware/
│   │   │   ├── adminMiddleware.ts
│   │   │   ├── authMiddleware.ts
│   │   │   ├── errorMiddleware.ts
│   │   │   ├── notFoundMiddleware.ts
│   │   │   ├── rateLimitMiddleware.ts
│   │   │   ├── uploadMiddleware.ts
│   │   │   └── validateMiddleware.ts
│   │   ├── models/
│   │   │   ├── Cart.ts
│   │   │   ├── Category.ts
│   │   │   ├── Order.ts
│   │   │   ├── Payment.ts
│   │   │   ├── Product.ts
│   │   │   ├── Review.ts
│   │   │   ├── User.ts
│   │   │   └── Wishlist.ts
│   │   ├── routes/
│   │   │   ├── adminRoutes.ts
│   │   │   ├── authRoutes.ts
│   │   │   ├── cartRoutes.ts
│   │   │   ├── categoryRoutes.ts
│   │   │   ├── orderRoutes.ts
│   │   │   ├── paymentRoutes.ts
│   │   │   ├── productRoutes.ts
│   │   │   ├── reviewRoutes.ts
│   │   │   ├── reviewStandaloneRoute.ts
│   │   │   ├── userRoutes.ts
│   │   │   └── wishlistRoutes.ts
│   │   ├── scripts/
│   │   │   └── seed.ts
│   │   ├── services/
│   │   │   ├── adminService.ts
│   │   │   ├── authService.ts
│   │   │   ├── cartService.ts
│   │   │   ├── categoryService.ts
│   │   │   ├── cloudinaryService.ts
│   │   │   ├── orderService.ts
│   │   │   ├── paymentService.ts
│   │   │   ├── productService.ts
│   │   │   ├── reviewService.ts
│   │   │   ├── userService.ts
│   │   │   └── wishlistService.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   ├── apiError.ts
│   │   │   ├── apiResponse.ts
│   │   │   ├── catchAsync.ts
│   │   │   ├── generateToken.ts
│   │   │   ├── pagination.ts
│   │   │   ├── slugify.ts
│   │   │   └── verifySignature.ts
│   │   ├── validators/
│   │   │   ├── authValidators.ts
│   │   │   ├── cartValidators.ts
│   │   │   ├── categoryValidators.ts
│   │   │   ├── orderValidators.ts
│   │   │   ├── paymentValidators.ts
│   │   │   ├── productValidators.ts
│   │   │   └── reviewValidators.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env.example
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   └── tsconfig.json
├── frontend/
│   ├── .next/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/
│   │   │   │   ├── categories/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── orders/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── products/
│   │   │   │   │   ├── [id]\edit/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── reviews/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── users/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── cart/
│   │   │   │   └── page.tsx
│   │   │   ├── categories/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   ├── checkout/
│   │   │   │   └── page.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── orders/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── products/
│   │   │   │   ├── [slug]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   ├── wishlist/
│   │   │   │   └── page.tsx
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── providers.tsx
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── AdminHeader.tsx
│   │   │   │   ├── AdminSidebar.tsx
│   │   │   │   ├── AdminStats.tsx
│   │   │   │   ├── DataTable.tsx
│   │   │   │   └── ProductForm.tsx
│   │   │   ├── auth/
│   │   │   │   ├── AuthForm.tsx
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   ├── cart/
│   │   │   │   ├── CartItem.tsx
│   │   │   │   ├── CartSummary.tsx
│   │   │   │   └── QuantitySelector.tsx
│   │   │   ├── checkout/
│   │   │   │   ├── AddressForm.tsx
│   │   │   │   ├── OrderSummary.tsx
│   │   │   │   ├── PaymentSelector.tsx
│   │   │   │   └── RazorpayButton.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Container.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Navbar.tsx
│   │   │   │   └── ThemeToggle.tsx
│   │   │   ├── orders/
│   │   │   │   ├── OrderCard.tsx
│   │   │   │   ├── OrderStatus.tsx
│   │   │   │   └── OrderTimeline.tsx
│   │   │   ├── products/
│   │   │   │   ├── FeaturedHeroCarousel.tsx 
│   │   │   │   ├── PriceDisplay.tsx
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   ├── ProductFilters.tsx
│   │   │   │   ├── ProductGrid.tsx
│   │   │   │   ├── ProductRating.tsx
│   │   │   │   ├── ProductSearch.tsx
│   │   │   │   └── ProductSort.tsx
│   │   │   └── ui/
│   │   │        ├── Badge.tsx
│   │   │        ├── Button.tsx
│   │   │        ├── EmptyState.tsx
│   │   │        ├── Input.tsx
│   │   │        ├── Pagination.tsx
│   │   │        ├── Skeleton.tsx
│   │   │        └── Spinner.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useCart.ts
│   │   │   ├── useDebounce.ts
│   │   │   ├── useProducts.ts
│   │   │   └── useWishlist.ts
│   │   ├── lib/
│   │   │   └── constants.ts
│   │   ├── providers/
│   │   │   ├── AuthProvider.tsx
│   │   │   └── ThemeProvider.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── authService.ts
│   │   │   ├── cartService.ts
│   │   │   ├── categoryService.ts
│   │   │   ├── orderService.ts
│   │   │   ├── paymentService.ts
│   │   │   ├── productService.ts
│   │   │   ├── reviewService.ts
│   │   │   └── wishlistService.ts
│   │   ├── store/
│   │   │   ├── authStore.ts
│   │   │   ├── cartStore.ts
│   │   │   ├── uiStore.ts
│   │   │   └── wishlistStore.ts
│   │   ├── types/
│   │   │   ├── cart.ts
│   │   │   ├── category.ts
│   │   │   ├── order.ts
│   │   │   ├── product.ts
│   │   │   └── user.ts
│   │   └── utils/
│   │       ├── cn.ts
│   │       ├── formatCurrency.ts
│   │       ├── formatDate.ts
│   │       └── loadRazorpayScript.ts
│   ├── .env.example
│   ├── .env.local
│   ├── .gitignore
│   ├── next-env.d.ts
│   ├── next.config.ts
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── README.md
│   ├── tailwind.config.ts
│   └── tsconfig.json
└── README.md
