# 🏗️ Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                 BROWSER (Frontend)                      │
│                   React + Vite + TS                     │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │           Pages & Components                      │  │
│  │  ├─ /shop - Product listing                     │  │
│  │  ├─ /product/:slug - Product detail             │  │
│  │  ├─ /cart - Shopping cart                       │  │
│  │  ├─ /checkout - Multi-step checkout ✨          │  │
│  │  ├─ /blog - Blog listing                        │  │
│  │  └─ /auth - Login/Register                      │  │
│  └──────────────────────────────────────────────────┘  │
│                          ▲                              │
│  ┌──────────────────────┼──────────────────────────┐  │
│  │   Services & Hooks   │                          │  │
│  │  ┌─────────────────────────────────────────┐   │  │
│  │  │ useCart                                │   │  │
│  │  │ useOrders                              │   │  │
│  │  │ useAuth                                │   │  │
│  │  └─────────────────────────────────────────┘   │  │
│  │  ┌─────────────────────────────────────────┐   │  │
│  │  │ Providers                               │   │  │
│  │  │ └─ StripeProvider (Stripe Elements) ✨  │   │  │
│  │  └─────────────────────────────────────────┘   │  │
│  │  ┌─────────────────────────────────────────┐   │  │
│  │  │ apiService                              │   │  │
│  │  │ ├─ Authentication                      │   │  │
│  │  │ ├─ Products/Categories                 │   │  │
│  │  │ ├─ Cart                                │   │  │
│  │  │ ├─ Orders                              │   │  │
│  │  │ ├─ Payments (Stripe) ✨                │   │  │
│  │  │ ├─ Recipes/Blog                        │   │  │
│  │  │ └─ Error handling                      │   │  │
│  │  └─────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────┘  │
│                          │                              │
└──────────────────────────┼──────────────────────────────┘
                           │
                           │ HTTPS
                           │
┌──────────────────────────▼──────────────────────────────┐
│         Express.js Backend API Server                   │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ API Routes                                       │  │
│  │ ├─ POST /auth/register                          │  │
│  │ ├─ POST /auth/login                             │  │
│  │ ├─ GET /products                                │  │
│  │ ├─ GET /categories                              │  │
│  │ ├─ POST /cart/items                             │  │
│  │ ├─ GET /cart                                    │  │
│  │ ├─ POST /orders                                 │  │
│  │ ├─ POST /orders/:id/payment-intent ✨           │  │
│  │ ├─ POST /orders/:id/confirm-payment ✨          │  │
│  │ ├─ POST /webhooks/stripe ✨                     │  │
│  │ └─ ... 40+ endpoints                            │  │
│  └──────────────────────────────────────────────────┘  │
│                          │                              │
│  ┌──────────────────────┴──────────────────────────┐  │
│  │                                                  │  │
│  ▼                                        ▼         │  │
│ MongoDB                                Stripe API  │  │
│ (Users, Orders,                    (Payments,      │  │
│  Products, Cart)                    PaymentIntent, │  │
│                                      Webhooks) ✨  │  │
│                                                    │  │
└────────────────────────────────────────────────────┘  │
```

## Data Flow: Complete Checkout

```
1. USER ADDS PRODUCT TO CART
   ┌─────────────┐
   │ User clicks │
   │ Add to Cart │
   └──────┬──────┘
          │
          ▼
   ┌──────────────────┐
   │ React Component  │
   │ calls useCart()  │
   └──────┬───────────┘
          │
          ▼
   ┌──────────────────────┐
   │ apiService.addToCart │
   │ POST /cart/items     │
   └──────┬───────────────┘
          │
          ▼
   ┌──────────────┐
   │ Backend      │
   │ API Handler  │
   └──────┬───────┘
          │
          ▼
   ┌──────────────────┐
   │ MongoDB          │
   │ Update cart      │
   └──────┬───────────┘
          │
          ▼
   ┌──────────────────────────┐
   │ Return updated cart      │
   │ (items, total)           │
   └──────┬────────────────────┘
          │
          ▼
   ┌────────────────────────┐
   │ Update React state     │
   │ Re-render cart view    │
   └────────────────────────┘


2. USER GOES TO CHECKOUT
   ┌──────────────────┐
   │ User clicks      │
   │ Checkout button  │
   └──────┬───────────┘
          │
          ▼
   ┌──────────────────────┐
   │ Navigate to          │
   │ /checkout            │
   │ (Protected route)     │
   └──────┬───────────────┘
          │
          ▼
   ┌──────────────────────┐
   │ <Checkout />         │
   │ Component loaded     │
   └──────┬───────────────┘
          │
          ▼
   ┌──────────────────────┐
   │ Step 1: Review Cart  │
   │ Show items & total   │
   └──────┬───────────────┘
          │ (User continues)
          ▼
   ┌──────────────────────┐
   │ Step 2: Shipping     │
   │ Collect address      │
   └──────┬───────────────┘
          │ (User continues)
          ▼
   ┌────────────────────────────┐
   │ POST /payment-intent/cart  │
   │ Create payment intent      │
   │ (No order yet)             │
   └──────┬─────────────────────┘
          │
          ▼
   ┌────────────────────────┐
   │ Backend calculates     │
   │ total from cart        │
   └──────┬─────────────────┘
          │
          ▼
   ┌────────────────────────┐
   │ STRIPE API             │
   │ Create PaymentIntent   │
   └──────┬─────────────────┘
          │
          ▼
   ┌────────────────────────────────┐
   │ Return to frontend:             │
   │ - paymentIntentId               │
   │ - clientSecret                  │
   │ - amount                        │
   └──────┬─────────────────────────┘
          │
          ▼
   ┌──────────────────────────┐
   │ Step 3: Payment (Stripe) │
   │ Display CardElement      │
   └──────┬───────────────────┘


3. USER ENTERS CARD & PAYS
   ┌──────────────────────┐
   │ User enters card:    │
   │ 4242 4242...         │
   │ 12/26, 123           │
   └──────┬───────────────┘
          │


3. USER ENTERS CARD & PAYS
   ┌──────────────────────┐
   │ User enters card:    │
   │ 4242 4242...         │
   │ 12/26, 123           │
   └──────┬───────────────┘
          │
          ▼
   ┌──────────────────────────┐
   │ User clicks "Pay" button │
   └──────┬───────────────────┘
          │
          ▼
   ┌───────────────────────────────┐
   │ stripe.createPaymentMethod    │
   └──────┬────────────────────────┘
          │
          ▼
   ┌───────────────────────────────┐
   │ STRIPE API                    │
   │ Returns paymentMethodId       │
   └──────┬────────────────────────┘
          │
          ▼
   ┌──────────────────────────────────┐
   │ stripe.confirmCardPayment        │
   │ clientSecret + paymentMethodId   │
   └──────┬─────────────────────────┘
          │
          ▼
   ┌──────────────────────┐
   │ STRIPE API           │
   │ Process payment      │
   │ Returns intent data  │
   └──────┬───────────────┘
          │
          ▼
   ┌──────────────────────────────┐
   │ If status = "succeeded" ✓    │
   │ POST /orders/create-after-   │
   │ payment                      │
   │ (address + paymentIntentId)  │
   └──────┬──────────────────────┘
          │
          ▼
   ┌──────────────────────────┐
   │ Backend verifies with:   │
   │ stripe.paymentIntents    │
   │ .retrieve(paymentId)     │
   └──────┬───────────────────┘
          │
          ▼
   ┌──────────────────────┐
   │ STRIPE API           │
   │ Confirm payment was  │
   │ received & processed │
   └──────┬───────────────┘
          │
          ▼
   ┌──────────────────────────────┐
   │ Backend creates order:       │
   │ status: "paid"               │
   │ paymentIntentId: stored      │
   │ address: from request        │
   └──────┬───────────────────────┘
          │
          ▼
   ┌──────────────────────────┐
   │ Clear user's cart       │
   │ (Required after order)  │
   └──────┬───────────────────┘
          │
          ▼
   ┌──────────────────────────────┐
   │ Return created order to      │
   │ frontend                     │
   └──────┬───────────────────────┘
          │
          ▼
   ┌──────────────────────────────┐
   │ Show confirmation page       │
   │ - Order ID                   │
   │ - Total paid                 │
   │ - Success message            │
   └──────────────────────────────┘


4. WEBHOOK CONFIRMATION (ASYNC)
   ┌────────────────────────────────┐
   │ Stripe processes payment       │
   │ (may take seconds/minutes)     │
   └──────┬─────────────────────────┘
          │
          ▼
   ┌──────────────────────────────────┐
   │ Stripe sends webhook event:      │
   │ POST /webhooks/stripe            │
   │ Event: payment_intent.succeeded  │
   └──────┬───────────────────────────┘
          │
          ▼
   ┌────────────────────────────┐
   │ Backend receives webhook   │
   │ Verify signature (CRITICAL)│
   └──────┬─────────────────────┘
          │
          ▼
   ┌──────────────────────────────┐
   │ Find order by paymentIntentId│
   │ Update status confirmed ✓    │
   │ Log payment webhook event    │
   └──────┬───────────────────────┘
          │
          ▼
   ┌────────────────────────────┐
   │ Send confirmation email    │
   │ Trigger fulfillment        │
   │ Update inventory           │
   └────────────────────────────┘
```

---

## Component Hierarchy

```
<App>
  ├─ <StripeProvider> ← Stripe Elements Setup
  │   ├─ <BrowserRouter>
  │   │   ├─ <AuthProvider> ← Auth Context
  │   │   │   ├─ <Header> → Uses useAuth()
  │   │   │   ├─ <Routes>
  │   │   │   │   ├─ <Index /> (/)
  │   │   │   │   ├─ <Shop /> (/shop)
  │   │   │   │   ├─ <Cart /> (/cart) → Uses useCart()
  │   │   │   │   ├─ <Checkout /> (/checkout) ✨
  │   │   │   │   │   ├─ Review  Cart Step
  │   │   │   │   │   ├─ Shipping Address Step
  │   │   │   │   │   ├─ <PaymentForm /> Step ✨
  │   │   │   │   │   │   └─ <CardElement /> (Stripe)
  │   │   │   │   │   └─ Success Confirmation
  │   │   │   │   ├─ <Profile /> → Uses useOrders()
  │   │   │   │   ├─ <AuthScreens /> (/login)
  │   │   │   │   └─ <NotFound />
  │   │   │   └─ <Footer>
  │   │   └─ <TooltipProvider>
  │   │       └─ <Toaster /> (Toast notifications)
  │   └─
  │
  └─ Other Providers / Utilities
      ├─ <QueryClientProvider> (React Query)
      └─ <ErrorBoundary> (if added)
```

---

## State Management Flow

```
┌─────────────────────────────────────────────┐
│            Global State                     │
├─────────────────────────────────────────────┤
│                                             │
│  AuthContext                                │
│  ├─ user: ApiUser | null                   │
│  ├─ isAuthenticated: boolean               │
│  ├─ login() → calls apiService.login()     │
│  ├─ register() → calls apiService.register│
│  └─ logout() → clears localStorage         │
│                                             │
│  localStorage                              │
│  ├─ authToken: JWT                         │
│  ├─ refreshToken: JWT                      │
│  └─ userData: User object                  │
│                                             │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│           Component-Level State             │
├─────────────────────────────────────────────┤
│                                             │
│  useCart() Hook                             │
│  ├─ cart: Cart object                       │
│  ├─ isLoading: boolean                      │
│  ├─ error: string | null                    │
│  └─ Provides: add, remove, update, clear    │
│                                             │
│  useOrders() Hook                           │
│  ├─ orders: Order[]                         │
│  ├─ currentOrder: Order | null              │
│  ├─ isLoading, isCreating, error            │
│  └─ Provides: load, create, getStatus       │
│                                             │
│  Checkout Component State                   │
│  ├─ currentStep: review|shipping|payment    │
│  ├─ order: Order | null                     │
│  ├─ paymentIntent: PaymentIntent data       │
│  ├─ shippingData: OrderAddress              │
│  ├─ isLoading, isProcessing, error          │
│  └─ Handles multi-step flow                 │
│                                             │
│  PaymentForm Component State                │
│  ├─ cardholderName: string                  │
│  ├─ email: string                           │
│  ├─ isProcessing: boolean                   │
│  ├─ success: boolean                        │
│  └─ error: string | null                    │
│                                             │
└─────────────────────────────────────────────┘
```

---

## API Call Flow

```
Component
    │
    └─> Hook (useCart, useOrders, useAuth)
        │
        └─> apiService method
            │
            ├─> Add authorization header
            │   (GET token from localStorage)
            │
            ├─> Build URL + query params
            │
            ├─> Make fetch request
            │   (with credentials: 'include')
            │
            └─> Handle response
                │
                ├─ If 200-299
                │   └─> Return parsed JSON
                │       └─> Update component state
                │           └─> Re-render UI
                │
                ├─ If 401 (Unauthorized)
                │   ├─> Clear localStorage
                │   ├─> Dispatch logout event
                │   └─> Throw error
                │
                ├─ If 400 (Bad request)
                │   └─> Return error details
                │
                └─ If 5xx (Server error)
                    └─> Return generic error
```

---

## Error Handling Flow

```
Component
    │
    └─> HTTP call fails
        │
        └─> apiService catches error
            │
            └─> Call errorHandler
                │
                ├─> Check error type
                │   ├─ Authentication → handleAuthError()
                │   ├─ Validation → handleValidationError()
                │   ├─ Cart → handleCartError()
                │   ├─ Payment → handlePaymentError()
                │   ├─ Network → handleNetworkError()
                │   └─ Other → getUserFriendlyMessage()
                │
                ├─> Generate user message
                │   (Not technical jargon)
                │
                ├─> Log if needed
                │   (ErrorLogger.log())
                │
                └─> Return to component
                    │
                    └─> Display in UI
                        ├─ Toast notification
                        ├─ Alert component
                        └─ Form error message
```

---

## Stripe Integration Flow

```
Checkout Component
    │
    ├─ User enters shipping address
    │
    ├─ POST /payment-intent/cart
    │   └─> Backend calculates total from cart
    │       └─> Creates PaymentIntent (no order yet)
    │           └─> Return (clientSecret, paymentIntentId)
    │
    ├─ Move to payment step
    │
    ├─ Display <PaymentForm />
    │   │
    │   └─> StripeProvider provides Stripe instance
    │       └─> PaymentForm renders <CardElement />
    │
    ├─ User enters card details
    │
    ├─ User clicks "Pay"
    │   │
    │   ├─ stripe.createPaymentMethod()
    │   │   └─> STRIPE API returns paymentMethodId
    │   │
    │   ├─ stripe.confirmCardPayment(clientSecret)
    │   │   └─> STRIPE API charges card
    │   │       └─> Returns PaymentIntent with status
    │   │
    │   └─ If confirmed:
    │
    ├─ POST /orders/create-after-payment
    │   │
    │   └─> Backend verifies payment with Stripe
    │       └─ stripe.paymentIntents.retrieve()
    │           └─ Confirm status = succeeded
    │
    ├─ Backend creates order (status: paid)
    │   └─> Stores paymentIntentId and address
    │       └─> Clears user's cart
    │
    ├─ Frontend shows success
    │   └─> Order confirmation page
    │
    └─ (Async) Stripe webhook fires
        │
        └─> Backend listener
            ├─ Verifies signature
            ├─ Updates order confirmed
            └─ Sends email & starts fulfillment
```

---

## Security & Token Management

```
┌────────────────────────────────────────────┐
│          Login / Register                  │
└────────────────────────────────────────────┘
                    │
                    ▼
        ┌──────────────────────┐
        │ User credentials     │
        │ POST /auth/login     │
        └──────┬───────────────┘
               │
               ▼
     ┌──────────────────────────┐
     │ Backend verifies:        │
     │ - User exists            │
     │ - Password matches       │
     │ - Sign JWT token         │
     └──────┬───────────────────┘
            │
            ▼
    ┌────────────────────────────────┐
    │ Return to frontend:            │
    │ {                              │
    │   accessToken: "jwt...",       │
    │   refreshToken: "jwt...",      │
    │   user: { id, email, role }    │
    │ }                              │
    └──────┬───────────────────────┘
           │
           ▼
    ┌──────────────────────────────┐
    │ Frontend stores:             │
    │ localStorage:                │
    │ - authToken: accessToken     │
    │ - refreshToken: refreshToken │
    │ - userData: user object      │
    │ React state:                 │
    │ - user: user object          │
    │ - isAuthenticated: true      │
    └──────┬───────────────────────┘
           │
           ▼
 ┌──────────────────────────────────┐
 │ All Subsequent API Calls         │
 ├──────────────────────────────────┤
 │ Include auth header:             │
 │ Authorization: Bearer <token>    │
 │                                  │
 │ Backend verifies (JWT middleware)│
 │ ✓ Token signature                │
 │ ✓ Token not expired              │
 │ ✓ Set req.user from token        │
 │                                  │
 │ If invalid (401):                │
 │ ├─ Clear localStorage            │
 │ ├─ Clear React state             │
 │ ├─ Redirect to /login            │
 │ └─ Show re-login message         │
 └──────────────────────────────────┘
           │
           ▼
 ┌──────────────────────────────────┐
 │ Token Refresh (Optional)         │
 ├──────────────────────────────────┤
 │ If access token near expiration: │
 │ POST /auth/refresh with          │
 │ refreshToken                     │
 │                                  │
 │ Backend returns:                 │
 │ - New accessToken 🔄             │
 │ - (Optional) new refreshToken    │
 │                                  │
 │ Frontend updates localStorage    │
 │ and auth state                   │
 └──────────────────────────────────┘
           │
           ▼
    ┌──────────────────────────┐
    │ Logout                   │
    │                          │
    │ Frontend:                │
    │ - Clear localStorage     │
    │ - Clear React state      │
    │ - Redirect to home       │
    │                          │
    │ Backend:                 │
    │ - (Optional) invalidate  │
    │   token on server        │
    └──────────────────────────┘
```

---

**This architecture ensures:**

- ✅ Type safety (TypeScript)
- ✅ Error handling (try-catch + error handlers)
- ✅ Security (JWT + HTTPS ready)
- ✅ Performance (lazy loading, optimization)
- ✅ Maintainability (modular, well-organized)
- ✅ Scalability (can easily add more endpoints)
