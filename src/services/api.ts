import { Blog } from "./types/blogsTypes";

const API_BASE_URL = "http://localhost:5858/api";

export type ApiUser = {
  id: string;
  _id?: string;
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

export type CartProduct = {
  _id: string;
  name: string;
  imageUrl: string;
  pricePaise: number;
};

export type CartItem = { _id: string; product: CartProduct; quantity: number };

export type Cart = { _id: string; user: string; items: CartItem[] };

export type OrderItem = {
  product:
    | string
    | {
        _id: string;
        name?: string;
        imageUrl?: string;
        pricePaise?: number;
      };
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

export type OrderTimelineEvent = {
  status: "created" | "paid" | "shipped" | "delivered" | "cancelled";
  note?: string;
  actorType?: "system" | "user" | "admin" | "stripe";
  actorId?: string;
  at?: string;
};

export type OrderShipping = {
  shippingId?: string;
  carrier?: string;
  service?: string;
  trackingUrl?: string;
  estimatedDeliveryAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
};

export type PaymentDetails = {
  last4?: string;
  brand?: string;
  expMonth?: number;
  expYear?: number;
  errorMessage?: string;
};

export type Order = {
  _id: string;
  orderNumber?: string;
  user: string | ApiUser;
  items: OrderItem[];
  amountPaise: number;
  status: "created" | "paid" | "shipped" | "delivered" | "cancelled";
  paymentStatus?: "pending" | "succeeded" | "failed" | "processing";
  address: OrderAddress;
  paymentDetails?: PaymentDetails;
  shipping?: OrderShipping;
  timeline?: OrderTimelineEvent[];
  paidAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateOrderResponse = {
  orderId: string;
  order: Order;
  message?: string;
};

export type CreatePaymentIntentResponse = {
  orderId: string;
  orderNumber?: string;
  paymentIntentId: string;
  clientSecret: string;
  amount?: number;
  currency?: string;
};

export type CreateCheckoutSessionResponse = {
  orderId?: string;
  orderNumber?: string;
  sessionId?: string;
  url?: string;
  checkoutUrl?: string;
  message?: string;
};

export type PaymentStatusResponse = {
  orderId: string;
  orderNumber?: string;
  status: string;
  paymentStatus?: string;
  amount?: number;
  paymentDetails?: PaymentDetails;
};

export type CreateReviewRequest = {
  reviewerName: string;
  title?: string;
  comment: string;
  rating: number;
  imageUrl?: string;
};

export type Review = CreateReviewRequest & {
  _id: string;
  user?: string | ApiUser;
  isVisible?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ReviewListResponse =
  | Review[]
  | {
      data?: Review[];
      items?: Review[];
      reviews?: Review[];
      total?: number;
      page?: number;
      limit?: number;
      totalPages?: number;
    };

export type PaginatedOrderResponse = {
  data: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem("authToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
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
      credentials: "include",
    };

    const response = await fetch(url, config);
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
  }

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
    limit = 20,
  ) {
    const params =
      typeof pageOrParams === "number"
        ? { page: pageOrParams, limit }
        : pageOrParams;

    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.q) query.set("q", params.q);
    if (params.category) query.set("category", params.category);
    if (params.featured !== undefined) {
      query.set("featured", String(params.featured));
    }
    if (params.isActive !== undefined) {
      query.set("isActive", String(params.isActive));
    }
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

  async createOrder(address: OrderAddress) {
    return this.request<CreateOrderResponse>("/orders", {
      method: "POST",
      body: JSON.stringify({ address }),
    });
  }

  async createPaymentIntent(orderId: string) {
    return this.request<CreatePaymentIntentResponse>(
      `/orders/${orderId}/payment-intent`,
      {
        method: "POST",
      },
    );
  }

  async createCheckoutSession(orderId: string) {
    return this.request<CreateCheckoutSessionResponse>(
      `/orders/${orderId}/checkout-session`,
      {
        method: "POST",
      },
    );
  }

  async confirmPayment(orderId: string, paymentIntentId: string) {
    return this.request<{ message: string; order: Order; paymentStatus: string }>(
      `/orders/${orderId}/confirm-payment`,
      {
        method: "POST",
        body: JSON.stringify({ paymentIntentId }),
      },
    );
  }

  async getPaymentStatus(orderId: string) {
    return this.request<PaymentStatusResponse>(
      `/orders/${orderId}/payment-status`,
      { method: "GET" },
    );
  }

  async getOrderById(orderId: string) {
    return this.request<Order>(`/orders/${orderId}`, { method: "GET" });
  }

  async getMyOrders(params?: { page?: number; limit?: number; status?: string }) {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.status) query.set("status", params.status);
    return this.request<PaginatedOrderResponse>(
      `/orders/myOrders${query.toString() ? `?${query.toString()}` : ""}`,
      { method: "GET" },
    );
  }

  async cancelMyOrder(orderId: string, reason?: string) {
    return this.request<{ message: string; order: Order }>(
      `/orders/${orderId}/cancel`,
      {
        method: "PATCH",
        body: JSON.stringify(reason ? { reason } : {}),
      },
    );
  }

  async createReview(data: CreateReviewRequest) {
    return this.request<Review>("/reviews", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getReviews() {
    return this.request<ReviewListResponse>("/reviews", { method: "GET" });
  }

  async listOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    paymentStatus?: string;
    userId?: string;
    orderNumber?: string;
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.status) query.set("status", params.status);
    if (params?.paymentStatus) query.set("paymentStatus", params.paymentStatus);
    if (params?.userId) query.set("userId", params.userId);
    if (params?.orderNumber) query.set("orderNumber", params.orderNumber);
    return this.request<PaginatedOrderResponse>(
      `/orders${query.toString() ? `?${query.toString()}` : ""}`,
      { method: "GET" },
    );
  }

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
    }>("/blogs");
  }

  async getFeaturedBlog() {
    return this.request<Blog>("/blogs/featured");
  }

  async getBlogBySlug(slug: string) {
    return this.request<Blog>(`/blogs/${encodeURIComponent(slug)}`);
  }

  async getRecipes(
    params: {
      page?: number;
      limit?: number;
      q?: string;
      tag?: string;
      category?: string;
      featured?: boolean | string;
      isActive?: boolean | string;
      sort?: string;
    } = {},
  ) {
    const qs = new URLSearchParams(
      Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null && v !== "")
        .reduce(
          (acc, [k, v]) => {
            acc[k] = String(v);
            return acc;
          },
          {} as Record<string, string>,
        ),
    ).toString();

    return this.request<{
      items: any;
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(`/recipes${qs ? `?${qs}` : ""}`);
  }
}

export const apiService = new ApiService();
