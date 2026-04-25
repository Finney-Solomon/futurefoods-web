/**
 * Comprehensive API Types for Future Foods
 * Production-ready type definitions for all API endpoints
 */

// ============ AUTH TYPES ============
export interface ApiUser {
  id: string;
  _id?: string;
  name?: string;
  email: string;
  role: "admin" | "customer" | "user";
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: ApiUser;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: "customer" | "admin";
}

export interface RegisterResponse {
  accessToken?: string;
  refreshToken?: string;
  user?: ApiUser;
  message?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// ============ CATEGORY TYPES ============
export interface Category {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  slug?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  icon?: string;
  imageUrl?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  icon?: string;
  imageUrl?: string;
}

// ============ PRODUCT TYPES ============
export interface Product {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  description: string;
  pricePaise: number;
  imageUrl: string;
  category?: Category | string;
  stock: number;
  isActive: boolean;
  rating?: number;
  reviews?: Review[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductWithCategory extends Product {
  category: Category;
}

export interface CreateProductRequest {
  name: string;
  slug: string;
  description: string;
  pricePaise: number;
  imageUrl: string;
  category: string;
  stock: number;
  isActive?: boolean;
}

export interface UpdateProductRequest {
  name?: string;
  slug?: string;
  description?: string;
  pricePaise?: number;
  imageUrl?: string;
  category?: string;
  stock?: number;
  isActive?: boolean;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  q?: string;
  category?: string;
  featured?: boolean;
  isActive?: boolean;
  sort?: string;
}

// ============ REVIEW TYPES ============
export interface Review {
  _id: string;
  product: string;
  user: ApiUser;
  rating: number;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateReviewRequest {
  productId: string;
  rating: number;
  comment: string;
}

// ============ RECIPE TYPES ============
export interface Recipe {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  ingredients: string[];
  instructions: string;
  cookTime?: number;
  servings?: number;
  imageUrl: string;
  isFeatured?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRecipeRequest {
  title: string;
  slug: string;
  description: string;
  content: string;
  ingredients: string[];
  instructions: string;
  cookTime?: number;
  servings?: number;
  imageUrl: string;
  isFeatured?: boolean;
}

export interface UpdateRecipeRequest {
  title?: string;
  slug?: string;
  description?: string;
  content?: string;
  ingredients?: string[];
  instructions?: string;
  cookTime?: number;
  servings?: number;
  imageUrl?: string;
  isFeatured?: boolean;
  isActive?: boolean;
}

export interface RecipeListResponse {
  items: Recipe[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RecipeQueryParams {
  page?: number;
  limit?: number;
  q?: string;
  tag?: string;
  category?: string;
  featured?: boolean;
  isActive?: boolean;
  sort?: string;
}

// ============ BLOG TYPES ============
export interface Blog {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author?: string;
  imageUrl?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  views?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface CreateBlogRequest {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author?: string;
  imageUrl?: string;
  isFeatured?: boolean;
  isActive?: boolean;
}

export interface UpdateBlogRequest {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  author?: string;
  imageUrl?: string;
  isFeatured?: boolean;
  isActive?: boolean;
}

export interface BlogListResponse {
  items: Blog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BlogQueryParams {
  page?: number;
  limit?: number;
  q?: string;
  tag?: string;
  category?: string;
  featured?: boolean;
  isActive?: boolean;
  sort?: string;
}

// ============ CART TYPES ============
export interface CartProduct {
  _id: string;
  id?: string;
  name: string;
  imageUrl: string;
  pricePaise: number;
  slug: string;
}

export interface CartItem {
  _id: string;
  id?: string;
  product: CartProduct | string;
  quantity: number;
  createdAt?: string;
}

export interface Cart {
  _id: string;
  id?: string;
  user: string;
  items: CartItem[];
  totalItems?: number;
  totalPricePaise?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddToCartRequest {
  productId: string;
  quantity?: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

// ============ ORDER TYPES ============
export interface OrderAddress {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  pin: string;
  country?: string;
  phone?: string;
}

export interface OrderItem {
  product: string;
  name?: string;
  quantity: number;
  pricePaise: number;
}

export interface Order {
  _id: string;
  id?: string;
  user: string;
  items: OrderItem[];
  amountPaise: number;
  status: "created" | "paid" | "shipped" | "delivered" | "cancelled";
  address: OrderAddress;
  paymentIntentId?: string;
  paymentStatus?: "pending" | "succeeded" | "failed";
  stripePaymentMethodId?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrderRequest {
  address: OrderAddress;
  notes?: string;
}

export interface CreatePaymentIntentResponse {
  orderId: string;
  paymentIntentId: string;
  clientSecret: string;
  amountPaise: number;
  currency: string;
}

export interface ConfirmPaymentRequest {
  paymentIntentId: string;
}

export interface PaymentStatusResponse {
  orderId: string;
  status: "pending" | "succeeded" | "failed";
  paymentIntentId: string;
  error?: string;
}

export interface OrderListResponse {
  items: Order[];
  total: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

// ============ ERROR TYPES ============
export interface ApiError {
  message: string;
  status: number;
  data?: any;
  code?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

// ============ STRIPE TYPES ============
export interface StripeConfig {
  publishableKey: string;
}

export interface PaymentMethod {
  id: string;
  object: string;
  card: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

// ============ PAGINATION TYPES ============
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============ API RESPONSE TYPES ============
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
