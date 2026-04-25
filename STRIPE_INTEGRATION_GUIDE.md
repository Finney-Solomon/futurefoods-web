# Future Foods - Production-Ready Stripe Integration Guide

## 🎯 Overview

This guide provides comprehensive instructions for integrating Stripe payments and all API endpoints into the Future Foods web application. The setup includes:

- ✅ Complete API service layer with TypeScript types
- ✅ Stripe payment integration (frontend)
- ✅ Multi-step checkout flow
- ✅ Cart management
- ✅ Order management
- ✅ Error handling and validation
- ✅ Production-ready security practices

## 📋 Table of Contents

1. [Installation](#installation)
2. [Environment Setup](#environment-setup)
3. [Configuration](#configuration)
4. [API Integration](#api-integration)
5. [Stripe Integration](#stripe-integration)
6. [Component Usage](#component-usage)
7. [Testing](#testing)
8. [Deployment](#deployment)

## 🚀 Installation

### Prerequisites

- Node.js 16+ and npm/yarn/bun
- Stripe account (https://stripe.com)
- Backend API running on `http://localhost:5999/api` (or your custom URL)

### Dependencies Already Installed

```bash
npm install @stripe/react-stripe-js @stripe/stripe-js axios
```

If not installed, run:

```bash
npm install
```

## 🔧 Environment Setup

### 1. Create `.env.local` file

Copy from `.env.example`:

```bash
cp .env.example .env.local
```

### 2. Get Stripe Keys

1. Go to https://dashboard.stripe.com/apikeys
2. Copy your **Publishable Key** (starts with `pk_test_`)
3. Copy your **Secret Key** (starts with `sk_test_`) - BACKEND ONLY

### 3. Configure Environment Variables

**`.env.local` (Frontend)**:

```env
VITE_API_BASE_URL=http://localhost:5999/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
VITE_APP_ENV=development
VITE_ENABLE_GUEST_CHECKOUT=true
VITE_ENABLE_SAVED_CARDS=true
```

**Backend `.env`** (Provide to backend team):

```env
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
```

## 📡 API Integration

### Available API Service Methods

The `apiService` module provides complete API coverage:

#### Authentication

```typescript
await apiService.login({ email, password });
await apiService.register({ name, email, password });
await apiService.getCurrentUser();
await apiService.refreshToken(refreshToken);
await apiService.logout();
```

#### Products

```typescript
await apiService.getProducts({ page: 1, limit: 10, category: "..." });
await apiService.getProductBySlug(slug);
await apiService.getProductById(id);
```

#### Cart

```typescript
await apiService.getCart();
await apiService.addToCart({ productId, quantity: 1 });
await apiService.updateCartItem(itemId, { quantity: 5 });
await apiService.removeCartItem(itemId);
await apiService.clearCart();
```

#### Orders & Payments

```typescript
await apiService.createOrder({ address: {...} });
await apiService.getMyOrders();
await apiService.createPaymentIntent(orderId);
await apiService.confirmPayment(orderId, { paymentIntentId });
await apiService.getPaymentStatus(orderId);
```

#### Categories

```typescript
await apiService.getCategories();
await apiService.createCategory({ name, description, icon });
```

#### Recipes

```typescript
await apiService.getRecipes({ featured: true, limit: 10 });
await apiService.getRecipeBySlug(slug);
```

#### Blog

```typescript
await apiService.getBlogs({ limit: 10, page: 1 });
await apiService.getBlogBySlug(slug);
await apiService.getFeaturedBlog();
```

## 💳 Stripe Integration

### Test Card Numbers

Use these for testing (US cards):

```
✅ Successful Payment:    4242 4242 4242 4242
❌ Declined:               4000 0000 0000 0002
💳 Mastercard:             5555 5555 5555 4444
🎫 American Express:       3782 822463 10005
```

Use any future expiry date and any 3-digit CVC (4-digit for Amex).

### StripeProvider Setup

Wrap your main app with `StripeProvider`:

```typescript
import { StripeProvider } from './providers/StripeProvider';

function App() {
  return (
    <StripeProvider>
      <YourAppRoutes />
    </StripeProvider>
  );
}
```

## 🛒 Component Usage

### 1. Checkout Component

```typescript
import { Checkout } from './components/Checkout';

// In your routes
<Route path="/checkout" element={<Checkout />} />
```

Features:

- **Payment-First Flow**: Payment is processed BEFORE order creation
- Multi-step checkout (review → shipping → payment → order creation)
- Address validation
- Real-time price calculation
- Stripe payment processing
- Success confirmation
- **No failed payment orders**: Only successful payments create orders

### 2. Cart Hook

```typescript
import { useCart } from './hooks/useCart';

function MyComponent() {
  const { cart, addItem, removeItem, getTotal, isLoading } = useCart();

  return (
    <>
      <p>Total: ${(getTotal() / 100).toFixed(2)}</p>
      <button onClick={() => addItem(productId, 2)}>Add to Cart</button>
    </>
  );
}
```

### 3. Orders Hook

```typescript
import { useOrders } from './hooks/useOrders';

function OrderHistory() {
  const { orders, loadOrders, getOrderStatus } = useOrders();

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <>
      {orders.map(order => (
        <div key={order._id}>
          <p>Status: {getOrderStatus(order.status)}</p>
          <p>Total: ${(order.amountPaise / 100).toFixed(2)}</p>
        </div>
      ))}
    </>
  );
}
```

### 4. Auth Hook

```typescript
import { useAuth } from './hooks/useAuthApi';

function LoginForm() {
  const { login, isLoading, error } = useAuth();

  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
      // Redirect to checkout or orders
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {error && <Alert>{error}</Alert>}
      <button disabled={isLoading} onClick={() => handleLogin(email, password)}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </>
  );
}
```

## 🧪 Testing

### 1. Test Authentication

```bash
# Register
POST /auth/register
{
  "name": "John Customer",
  "email": "customer@example.com",
  "password": "Password123",
  "role": "customer"
}

# Login
POST /auth/login
{
  "email": "customer@example.com",
  "password": "Password123"
}
```

### 2. Test Cart Operations

```bash
# Get cart
GET /cart

# Add item
POST /cart/items
{
  "productId": "product_id_here",
  "quantity": 2
}

# Update quantity
PUT /cart/items/item_id
{
  "quantity": 5
}

# Remove item
DELETE /cart/items/item_id
```

### 3. Test Payment Flow

```bash
# Create order
POST /orders
{
  "address": {
    "line1": "123 Green St",
    "city": "New York",
    "state": "NY",
    "pin": "10001",
    "phone": "+14155552671"
  }
}

# Create payment intent
POST /orders/order_id/payment-intent

# Confirm payment (after Stripe confirms)
POST /orders/order_id/confirm-payment
{
  "paymentIntentId": "pi_xxxxxxxxxxx"
}

# Check payment status
GET /orders/order_id/payment-status
```

### 4. Using Postman Collection

A complete Postman collection is available in the repository:

- **File**: `future-foods-postman-collection.json`
- **Base URL**: `http://localhost:5999/api`
- **Variables**: Set `adminToken` and `customerToken` after login

## 🔐 Security Best Practices

### Frontend Security

✅ **DO:**

- Store JWT tokens in `localStorage` (accessible via JS)
- Store sensitive keys in `.env` files (never in code)
- Validate input before API calls
- Handle errors gracefully
- Use HTTPS in production
- Implement token refresh logic
- Clear tokens on logout

❌ **DON'T:**

- Store passwords in localStorage
- Expose secret keys in frontend
- Log sensitive information
- Use Stripe secret keys on frontend
- Trust client-side validation alone
- Hardcode API URLs

### Backend Requirements (for API team)

✅ Implement:

- JWT token validation on all protected routes
- CORS configuration
- Rate limiting
- Input validation with Zod/Joi
- Stripe webhook signature verification
- PCI compliance (never store raw card data)
- HTTPS/TLS encryption
- Database encryption for sensitive fields
- Audit logging

## 📦 Price Format

Prices are stored in **paise** (1/100 USD) to avoid floating-point issues:

```typescript
// Convert from display price to paise
const paise = 50.0 * 100; // 5000

// Convert from paise to display price
const displayPrice = paise / 100; // 50.00

// Using the helper
import { apiService } from "./services/apiService";

const paise = apiService.constructor.toPaise(50.0);
const dollars = apiService.constructor.formatPrice(5000);
```

## 🚀 Deployment

### Before Production

1. **Stripe Configuration**
   - Switch to production API keys
   - Update `VITE_STRIPE_PUBLISHABLE_KEY` in deployment environment
   - Configure webhook endpoints in Stripe dashboard
   - Update backend with production secret keys

2. **Environment Configuration**

   ```env
   VITE_API_BASE_URL=https://your-api.example.com/api
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_KEY
   VITE_APP_ENV=production
   ```

3. **Security Checklist**
   - [ ] HTTPS enabled
   - [ ] CORS properly configured
   - [ ] Rate limiting enabled
   - [ ] Database backups automated
   - [ ] Error logging configured (Sentry)
   - [ ] Security headers set
   - [ ] 3D Secure configured
   - [ ] Webhook encryption enabled

4. **Testing**

   ```bash
   npm run build
   npm run preview
   ```

5. **Monitoring**
   - Set up Stripe webhook monitoring
   - Monitor API error rates
   - Track conversion funnel
   - Monitor payment success rates

## 📚 Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe React Library](https://stripe.com/docs/stripe-js/react)
- [Future Foods API Docs](http://localhost:5999/api/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🐛 Troubleshooting

### Stripe Not Initializing

**Error**: "VITE_STRIPE_PUBLISHABLE_KEY environment variable is not set"

**Solution**:

1. Check `.env.local` file exists
2. Verify `VITE_STRIPE_PUBLISHABLE_KEY` is set
3. Restart dev server: `npm run dev`

### Payment Intent Creation Failed

**Error**: "Failed to create payment intent"

**Solution**:

1. Verify order was created successfully
2. Check backend Stripe configuration
3. Ensure order total > $0.50 (Stripe minimum)
4. Check Stripe API keys are correct

### Cart Empty After Login

**Error**: "Cart shows 0 items after authentication"

**Solution**:

1. Ensure `addToCart` is called with correct `productId`
2. Check cart API endpoint authentication
3. Verify JWT token is being sent with request

### CORS Errors

**Error**: "Access-Control-Allow-Origin missing"

**Solution**:

1. Backend must be running
2. Verify `VITE_API_BASE_URL` matches backend URL
3. Check backend CORS configuration

## 📞 Support

For issues or questions:

1. Check the Troubleshooting section
2. Review error logs in browser console (F12)
3. Check Stripe dashboard for payment details
4. Contact backend API team for API issues

## 📄 License

This integration guide and code are part of the Future Foods project.

---

**Last Updated**: April 2026
**Version**: 1.0.0
**Status**: Production Ready ✅
