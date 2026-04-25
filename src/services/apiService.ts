/**
 * Comprehensive API Service for Future Foods
 * Production-ready API client with full CRUD operations
 */

import {
  ApiUser,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenRequest,
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  Product,
  ProductListResponse,
  ProductQueryParams,
  CreateProductRequest,
  UpdateProductRequest,
  Recipe,
  RecipeListResponse,
  RecipeQueryParams,
  CreateRecipeRequest,
  UpdateRecipeRequest,
  Blog,
  BlogListResponse,
  BlogQueryParams,
  CreateBlogRequest,
  UpdateBlogRequest,
  Cart,
  CartItem,
  AddToCartRequest,
  UpdateCartItemRequest,
  Order,
  CreateOrderRequest,
  CreatePaymentIntentResponse,
  ConfirmPaymentRequest,
  PaymentStatusResponse,
  OrderListResponse,
  ApiError,
  Review,
  CreateReviewRequest,
} from "./types/apiTypes";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5999/api";

/**
 * ApiService - Centralized API client
 * Handles all HTTP requests with automatic token management
 */
class ApiService {
  private baseUrl: string = API_BASE_URL;

  /**
   * Get authorization headers with Bearer token
   */
  private getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Get stored authentication token
   */
  private getToken(): string | null {
    return localStorage.getItem("authToken");
  }

  /**
   * Store authentication token
   */
  private setToken(token: string): void {
    localStorage.setItem("authToken", token);
  }

  /**
   * Clear all authentication data
   */
  private clearAuth(): void {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
  }

  /**
   * Generic HTTP request handler with error handling and auth
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeaders(),
        ...(options.headers || {}),
      },
      body: options.body,
      credentials: "include",
    };

    try {
      const response = await fetch(url, config);
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        const error: ApiError = {
          message:
            (data && (data.error || data.message)) ||
            `Request failed: ${response.status} ${response.statusText}`,
          status: response.status,
          data,
        };

        // Clear auth on 401
        if (response.status === 401) {
          this.clearAuth();
          window.dispatchEvent(new CustomEvent("auth:logout"));
        }

        throw error;
      }

      return data as T;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw {
          message: "Invalid response from server",
          status: 0,
        } as ApiError;
      }
      throw error;
    }
  }

  // ============ AUTH ENDPOINTS ============

  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await this.request<LoginResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (response.accessToken) {
      this.setToken(response.accessToken);
    }
    return response;
  }

  /**
   * Login with email and password
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (response.accessToken) {
      this.setToken(response.accessToken);
    }
    return response;
  }

  /**
   * Get current logged-in user
   */
  async getCurrentUser(): Promise<ApiUser> {
    return this.request<ApiUser>("/auth/me");
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
    if (response.accessToken) {
      this.setToken(response.accessToken);
    }
    return response;
  }

  /**
   * Logout (client-side only)
   */
  logout(): void {
    this.clearAuth();
  }

  // ============ CATEGORY ENDPOINTS ============

  /**
   * Get all categories (public)
   */
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>("/categories");
  }

  /**
   * Get category by ID
   */
  async getCategoryById(id: string): Promise<Category> {
    return this.request<Category>(`/categories/${id}`);
  }

  /**
   * Create new category (admin only)
   */
  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    return this.request<Category>("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * Update category (admin only)
   */
  async updateCategory(
    id: string,
    data: UpdateCategoryRequest,
  ): Promise<Category> {
    return this.request<Category>(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete category (admin only)
   */
  async deleteCategory(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/categories/${id}`, {
      method: "DELETE",
    });
  }

  // ============ PRODUCT ENDPOINTS ============

  /**
   * Get all products with filtering and pagination (public)
   */
  async getProducts(params?: ProductQueryParams): Promise<ProductListResponse> {
    const query = this.buildQueryString(params || {});
    return this.request<ProductListResponse>(
      `/products${query ? `?${query}` : ""}`,
    );
  }

  /**
   * Get product by slug (public)
   */
  async getProductBySlug(slug: string): Promise<Product> {
    return this.request<Product>(`/products/${slug}`);
  }

  /**
   * Get product by ID (public)
   */
  async getProductById(id: string): Promise<Product> {
    return this.request<Product>(`/products/id/${id}`);
  }

  /**
   * Create new product (admin only)
   */
  async createProduct(data: CreateProductRequest): Promise<Product> {
    return this.request<Product>("/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * Update product (admin only)
   */
  async updateProduct(
    id: string,
    data: UpdateProductRequest,
  ): Promise<Product> {
    return this.request<Product>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete product (admin only)
   */
  async deleteProduct(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/products/${id}`, {
      method: "DELETE",
    });
  }

  /**
   * Add review to product
   */
  async createProductReview(data: CreateReviewRequest): Promise<Review> {
    return this.request<Review>(`/products/${data.productId}/reviews`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * Get product reviews
   */
  async getProductReviews(productId: string): Promise<Review[]> {
    return this.request<Review[]>(`/products/${productId}/reviews`);
  }

  // ============ RECIPE ENDPOINTS ============

  /**
   * Get all recipes with filtering and pagination (public)
   */
  async getRecipes(params?: RecipeQueryParams): Promise<RecipeListResponse> {
    const query = this.buildQueryString(params || {});
    return this.request<RecipeListResponse>(
      `/recipes${query ? `?${query}` : ""}`,
    );
  }

  /**
   * Get recipe by slug (public)
   */
  async getRecipeBySlug(slug: string): Promise<Recipe> {
    return this.request<Recipe>(`/recipes/${slug}`);
  }

  /**
   * Get featured recipes (public)
   */
  async getFeaturedRecipes(): Promise<Recipe[]> {
    return this.request<Recipe[]>("/recipes/featured");
  }

  /**
   * Create new recipe (admin only)
   */
  async createRecipe(data: CreateRecipeRequest): Promise<Recipe> {
    return this.request<Recipe>("/recipes", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * Update recipe (admin only)
   */
  async updateRecipe(id: string, data: UpdateRecipeRequest): Promise<Recipe> {
    return this.request<Recipe>(`/recipes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete recipe (admin only)
   */
  async deleteRecipe(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/recipes/${id}`, {
      method: "DELETE",
    });
  }

  // ============ BLOG ENDPOINTS ============

  /**
   * Get all blog posts with filtering (public)
   */
  async getBlogs(params?: BlogQueryParams): Promise<BlogListResponse> {
    const query = this.buildQueryString(params || {});
    return this.request<BlogListResponse>(`/blog${query ? `?${query}` : ""}`);
  }

  /**
   * Get featured blog post (public)
   */
  async getFeaturedBlog(): Promise<Blog> {
    return this.request<Blog>("/blog/featured");
  }

  /**
   * Get blog post by slug (public)
   */
  async getBlogBySlug(slug: string): Promise<Blog> {
    return this.request<Blog>(`/blog/${slug}`);
  }

  /**
   * Create new blog post (admin only)
   */
  async createBlog(data: CreateBlogRequest): Promise<Blog> {
    return this.request<Blog>("/blog", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * Update blog post (admin only)
   */
  async updateBlog(id: string, data: UpdateBlogRequest): Promise<Blog> {
    return this.request<Blog>(`/blog/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete blog post (admin only)
   */
  async deleteBlog(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/blog/${id}`, {
      method: "DELETE",
    });
  }

  /**
   * Restore deleted blog post (admin only)
   */
  async restoreBlog(id: string): Promise<Blog> {
    return this.request<Blog>(`/blog/${id}/restore`, {
      method: "POST",
    });
  }

  // ============ CART ENDPOINTS ============

  /**
   * Get current user's cart (authenticated)
   */
  async getCart(): Promise<Cart> {
    return this.request<Cart>("/cart");
  }

  /**
   * Add item to cart (authenticated)
   */
  async addToCart(data: AddToCartRequest): Promise<Cart> {
    return this.request<Cart>("/cart/items", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * Update cart item quantity (authenticated)
   */
  async updateCartItem(
    itemId: string,
    data: UpdateCartItemRequest,
  ): Promise<Cart> {
    return this.request<Cart>(`/cart/items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * Remove item from cart (authenticated)
   */
  async removeCartItem(itemId: string): Promise<Cart> {
    return this.request<Cart>(`/cart/items/${itemId}`, {
      method: "DELETE",
    });
  }

  /**
   * Clear entire cart (authenticated)
   */
  async clearCart(): Promise<{ message: string }> {
    return this.request<{ message: string }>("/cart", {
      method: "DELETE",
    });
  }

  // ============ ORDER ENDPOINTS ============

  /**
   * Create order from cart (authenticated)
   */
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    return this.request<Order>("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * Get user's orders (authenticated)
   */
  async getMyOrders(): Promise<OrderListResponse> {
    return this.request<OrderListResponse>("/orders/myOrders");
  }

  /**
   * Get order by ID (authenticated)
   */
  async getOrderById(id: string): Promise<Order> {
    return this.request<Order>(`/orders/${id}`);
  }

  /**
   * Get all orders (admin only)
   */
  async getAllOrders(): Promise<OrderListResponse> {
    return this.request<OrderListResponse>("/orders");
  }

  // ============ PAYMENT ENDPOINTS ============

  /**
   * Create Stripe payment intent for cart (before order creation)
   * This allows payment processing before placing the order
   */
  async createPaymentIntentForCart(): Promise<CreatePaymentIntentResponse> {
    return this.request<CreatePaymentIntentResponse>(`/payment-intent/cart`, {
      method: "POST",
    });
  }

  /**
   * Create Stripe payment intent for order (authenticated)
   */
  async createPaymentIntent(
    orderId: string,
  ): Promise<CreatePaymentIntentResponse> {
    return this.request<CreatePaymentIntentResponse>(
      `/orders/${orderId}/payment-intent`,
      {
        method: "POST",
      },
    );
  }

  /**
   * Confirm payment with Stripe payment intent ID (authenticated)
   */
  async confirmPayment(
    orderId: string,
    data: ConfirmPaymentRequest,
  ): Promise<Order> {
    return this.request<Order>(`/orders/${orderId}/confirm-payment`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * Create order after successful payment (authenticated)
   * This places the order only after payment has been confirmed
   */
  async createOrderAfterPayment(
    data: CreateOrderRequest & { paymentIntentId: string },
  ): Promise<Order> {
    return this.request<Order>(`/orders/create-after-payment`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * Get payment status for order (authenticated)
   */
  async getPaymentStatus(orderId: string): Promise<PaymentStatusResponse> {
    return this.request<PaymentStatusResponse>(
      `/orders/${orderId}/payment-status`,
    );
  }

  // ============ UTILITY METHODS ============

  /**
   * Build query string from params object
   */
  private buildQueryString(params: Record<string, any>): string {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        query.set(key, String(value));
      }
    });

    return query.toString();
  }

  /**
   * Format price from paise (1/100 INR) to rupees
   */
  static formatPrice(paise: number): number {
    return paise / 100;
  }

  /**
   * Convert price from rupees to paise
   */
  static toPaise(rupees: number): number {
    return Math.round(rupees * 100);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Get base URL for API
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export type
export type { ApiService };
