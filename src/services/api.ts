import { Blog } from "./types/blogsTypes";

// src/services/api.ts
const API_BASE_URL = "http://localhost:5999/api";

export type ApiUser = {
 id: string;
 name?: string;
 email: string;
 role: "admin" | "user" | string;
};

type LoginResponse = {
 accessToken: string;
 refreshToken?: string;
 user: ApiUser;
};
type RegisterResponse = {
 accessToken?: string;
 refreshToken?: string;
 user?: ApiUser;
 message?: string;
};

/** ---- Cart / Product types ---- */
export type CartProduct = {
 _id: string;
 name: string;
 imageUrl: string;
 pricePaise: number;
};
export type CartItem = { _id: string; product: CartProduct; quantity: number };
export type Cart = { _id: string; user: string; items: CartItem[] };

/** ---- Order types ---- */
export type OrderItem = {
 product: string;
 quantity: number;
 pricePaise: number;
};
export type OrderAddress = {
 line1: string;
 city: string;
 state?: string;
 pin: string;
 phone?: string;
};
export type Order = {
 _id: string;
 user: string;
 items: OrderItem[];
 amountPaise: number;
 status: "created" | "paid" | "shipped" | "delivered" | "cancelled";
 address: OrderAddress;
 createdAt: string;
 updatedAt: string;
};

class ApiService {
 private getAuthHeaders() {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
 }

 private async request<T>(
  endpoint: string,
  options: RequestInit = {}
 ): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
   method: options.method || "GET",
   headers: {
    "Content-Type": "application/json",
    ...this.getAuthHeaders(),
    ...(options.headers || {}),
   },
   body: options.body,
   credentials: "include", // harmless with bearer auth
  };

  let response: Response | undefined;
  try {
   response = await fetch(url, config);
   const text = await response.text();
   const data = text ? JSON.parse(text) : {};

   if (!response.ok) {
    const err = {
     message:
      (data && (data.error || data.message)) ||
      `Request failed: ${response.status} ${response.statusText}`,
     status: response.status,
     data,
    };
    if (response.status === 401) {
     localStorage.removeItem("authToken");
     localStorage.removeItem("refreshToken");
     localStorage.removeItem("userData");
    }
    throw err;
   }
   return data as T;
  } catch (error) {
   throw error;
  }
 }

 // ---- Auth ----
 async login(email: string, password: string) {
  return this.request<LoginResponse>("/auth/login", {
   method: "POST",
   body: JSON.stringify({ email, password }),
  });
 }
 async register(name: string, email: string, password: string) {
  return this.request<RegisterResponse>("/auth/register", {
   method: "POST",
   body: JSON.stringify({ name, email, password }),
  });
 }
 async me() {
  return this.request<ApiUser>("/auth/me", { method: "GET" });
 }

 // ---- Products ----
 async getProducts(
  pageOrParams:
   | number
   | {
      page?: number;
      limit?: number;
      q?: string;
      category?: string;
      featured?: boolean;
      isActive?: boolean;
      sort?: string;
     } = 1,
  limit = 20
 ) {
  // Allow both `getProducts(1, 20)` and `getProducts({ featured: true })`
  const params =
   typeof pageOrParams === "number"
    ? { page: pageOrParams, limit }
    : pageOrParams;

  const query = new URLSearchParams();

  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.q) query.set("q", params.q);
  if (params.category) query.set("category", params.category);
  if (params.featured !== undefined)
   query.set("featured", String(params.featured));
  if (params.isActive !== undefined)
   query.set("isActive", String(params.isActive));
  if (params.sort) query.set("sort", params.sort);

  const url = `/products${query.toString() ? `?${query.toString()}` : ""}`;

  return this.request<{
   items: any[];
   total: number;
   page: number;
   limit: number;
  }>(url);
 }

 async getProductBySlug(slug: string) {
  return this.request<any>(`/products/slug/${slug}`);
 }

 // ---- Cart ----
 async getCart() {
  return this.request<Cart>("/cart", { method: "GET" });
 }
 async addToCart(productId: string, quantity = 1) {
  return this.request<Cart>("/cart/items", {
   method: "POST",
   body: JSON.stringify({ productId, quantity }),
  });
 }
 async updateCartItem(itemId: string, quantity: number) {
  return this.request<Cart>(`/cart/items/${itemId}`, {
   method: "PUT",
   body: JSON.stringify({ quantity }),
  });
 }
 async removeCartItem(itemId: string) {
  return this.request<Cart>(`/cart/items/${itemId}`, { method: "DELETE" });
 }
 async clearCart() {
  return this.request<Cart>("/cart", { method: "DELETE" });
 }

 // ---- Orders ----
 /** Creates an order from the current cart and clears the cart. */
 async createOrder(address: OrderAddress) {
  return this.request<Order>("/orders", {
   method: "POST",
   body: JSON.stringify({ address }),
  });
 }
 /** Admin-only list; included for completeness */
 async listOrders() {
  return this.request<Order[]>("/orders/myOrders", { method: "GET" });
 }

 // ⬇️ put these inside the ApiService class, below the admin blog methods

 // ---- Blogs (Public) ----
 async getBlogsPublic({
  page = 1,
  limit = 12,
  tag,
  category,
  q,
 }: {
  page?: number;
  limit?: number;
  tag?: string;
  category?: string;
  q?: string;
 }) {
  return this.request<{
   items: Blog[];
   page: number;
   limit: number;
   total: number;
   totalPages: number;
  }>("/blogs", {
   // qs: { page, limit, tag, category, q }, // ✅ send query params
  });
 }

 async getFeaturedBlog() {
  return this.request<Blog>("/blogs/featured");
 }

 async getBlogBySlug(slug: string) {
  return this.request<Blog>(`/blogs/${encodeURIComponent(slug)}`);
 }
}

export const apiService = new ApiService();
