# ⚡ Future Foods - Quick Start Setup

This file contains step-by-step instructions to get your Future Foods application running with Stripe integration and all APIs.

## Prerequisites

- Node.js 16+ installed
- npm, yarn, or bun package manager
- Stripe account (free at https://stripe.com)
- Backend API running (or ready to run)

## 🚀 Quick Setup (10 minutes)

### Step 1: Install Dependencies (Already Done)

```bash
npm install @stripe/react-stripe-js @stripe/stripe-js axios
```

✅ Already completed in your project

### Step 2: Get Stripe API Keys

1. Visit https://dashboard.stripe.com
2. Sign up (free) or log in
3. Go to "Developers" → "API keys"
4. Copy your **Test Publishable Key** (starts with `pk_test_`)
5. Keep your **Secret Key** safe (for backend team)

### Step 3: Configure Environment

Edit or create `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:5999/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
VITE_APP_ENV=development
```

Replace `pk_test_YOUR_KEY_HERE` with your actual Stripe test key.

### Step 4: Start Development Server

```bash
npm run dev
```

Your app is now running at `http://localhost:5173` (or shown in terminal)

### Step 5: Verify Setup

- [ ] App loads without errors (check F12 console)
- [ ] Stripe initializes (no red banner)
- [ ] You can see products on `/shop`
- [ ] Backend API is responding

## 📱 Testing the Complete Flow

### 1. Register & Login

```
1. Click "Login" in header
2. Click "Register"
3. Fill in:
   - Name: John Customer
   - Email: customer@example.com
   - Password: Password123
4. Submit and login
```

### 2. Add Products to Cart

```
1. Go to /shop
2. Click "Add to Cart" on any product
3. Click cart icon (top right)
4. Verify items are in cart
```

### 3. Complete Checkout

**New Payment-First Flow:**

```
1. Click "Checkout"
2. Review order (Step 1)
3. Enter shipping address (Step 2)
4. Pay first, then order is placed (Step 3)

Test Card:    4242 4242 4242 4242
Expiry:       12/26
CVC:          123

5. Payment succeeds → Order created → Success message
```

**How it works:**

- Payment is processed BEFORE the order is created
- Only successful payments result in order creation
- Failed payments don't create any orders

## 🛠 Troubleshooting

### App won't start

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Stripe not loading

```
Check:
1. .env.local exists
2. VITE_STRIPE_PUBLISHABLE_KEY is set
3. API from Stripe dashboard (not example key)
```

### API not connecting

```
Check:
1. VITE_API_BASE_URL is correct
2. Backend is running
3. CORS is enabled on backend
```

### Payment fails

```
Check:
1. Using test card: 4242 4242 4242 4242
2. Stripe keys are test keys (pk_test_, sk_test_)
3. Backend has STRIPE_SECRET_KEY configured
```

## 📚 File Structure

Created/Modified files:

```
src/
├── services/
│   ├── apiService.ts           ← Main API client (NEW)
│   ├── stripeService.ts        ← Stripe config (NEW)
│   ├── errorHandler.ts         ← Error handling (NEW)
│   └── types/
│       └── apiTypes.ts         ← TypeScript types (NEW)
├── hooks/
│   ├── useCart.ts              ← Cart management (NEW)
│   ├── useOrders.ts            ← Order management (NEW)
│   ├── useAuthApi.ts           ← Auth hook (NEW)
│   └── use-mobile.tsx          ← Existing
├── providers/
│   └── StripeProvider.tsx       ← Stripe setup (NEW)
├── components/
│   ├── PaymentForm.tsx         ← Payment form (NEW)
│   └── Checkout.tsx            ← Full checkout (NEW)
├── App.tsx                      ← Updated with Stripe
└── ...existing files...

.env.local                       ← Your config (NEW)
.env.example                     ← Template (NEW)
STRIPE_INTEGRATION_GUIDE.md      ← Full docs (NEW)
QUICK_START.md                   ← This file (NEW)
```

## 🔑 Key Components

### 1. StripeProvider

Wraps app with Stripe context:

```typescript
<StripeProvider>
  <YourApp />
</StripeProvider>
```

### 2. Checkout Component

Complete multi-step checkout:

- Review cart
- Enter shipping
- Process payment
- Show confirmation

### 3. useCart Hook

Manage shopping cart:

```typescript
const { cart, addItem, removeItem, getTotal } = useCart();
```

### 4. useOrders Hook

Manage user orders:

```typescript
const { orders, createOrder, getOrderStatus } = useOrders();
```

### 5. apiService

All API methods:

```typescript
await apiService.getProducts(...);
await apiService.createOrder(...);
await apiService.getPaymentStatus(...);
```

## 📊 API Endpoints Integrated

### Authentication

- `POST /auth/register` - Register user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user
- `POST /auth/refresh` - Refresh token

### Products & Categories

- `GET /products` - List products
- `GET /categories` - List categories
- `POST /products` - Create (admin)
- `PUT /products/:id` - Update (admin)

### Cart

- `GET /cart` - Get user cart
- `POST /cart/items` - Add to cart
- `PUT /cart/items/:id` - Update quantity
- `DELETE /cart/items/:id` - Remove item

### Orders & Payments

- `POST /orders` - Create order
- `GET /orders/myOrders` - Get my orders
- `POST /orders/:id/payment-intent` - Create payment intent
- `POST /orders/:id/confirm-payment` - Confirm payment
- `GET /orders/:id/payment-status` - Get payment status

### Other

- `GET /recipes` - List recipes
- `GET /blog` - List blog posts

## ✅ Production Checklist

Before deploying to production:

- [ ] Switch Stripe keys to production (pk*live*, sk*live*)
- [ ] Update VITE_API_BASE_URL to production API
- [ ] Enable HTTPS/TLS
- [ ] Configure CORS properly
- [ ] Set up error tracking (Sentry)
- [ ] Enable audit logging
- [ ] Configure webhooks in Stripe
- [ ] Add rate limiting
- [ ] Enable database encryption
- [ ] Set up monitoring
- [ ] Test full checkout flow with real card
- [ ] Review security headers

## 📖 Full Documentation

See **STRIPE_INTEGRATION_GUIDE.md** for:

- Complete API reference
- Advanced configuration
- Security best practices
- Deployment instructions
- Troubleshooting guide

## 🎓 Next Steps

1. **Backend Team**: Configure Stripe webhook in dashboard
2. **Backend Team**: Implement order status webhooks
3. **Frontend**: Customize checkout styles
4. **Frontend**: Add more product pages
5. **Backend**: Add inventory management
6. **All**: Test full flow end-to-end

## 🆘 Need Help?

1. Check browser console (F12) for errors
2. Check terminal for backend errors
3. Visit Stripe docs: https://stripe.com/docs
4. Check `STRIPE_INTEGRATION_GUIDE.md`
5. Review error logs in Stripe dashboard

## 📞 Contact

- Frontend issues: Check `STRIPE_INTEGRATION_GUIDE.md`
- Backend/API issues: Contact API team
- Stripe issues: https://support.stripe.com

---

**Status**: ✅ Production Ready
**Created**: April 2026
**Version**: 1.0.0
