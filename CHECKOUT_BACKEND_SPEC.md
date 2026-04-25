# 🚀 Production-Ready Checkout Flow - Backend Requirements

## Complete End-to-End Flow Specification

Your frontend is now production-ready. This document specifies exactly what your **backend must do** for the checkout to work perfectly.

---

## Flow Overview

```
User adds items to cart
        ↓
Click "Place Order" button
        ↓
Create Order (POST /api/orders)
        ↓
Create Payment Intent (POST /api/orders/{orderId}/payment-intent)
        ↓
User enters card details and clicks "Pay"
        ↓
Confirm Payment (POST /api/orders/{orderId}/confirm-payment)
        ↓
Clear Cart (DELETE /api/cart) ← Only after successful payment
        ↓
Show Order Confirmation Page
```

---

## Key Requirements

### 1. ✅ Create Order Endpoint

**Endpoint:** `POST /api/orders`

**Request Body:**
```json
{
  "address": {
    "line1": "123 Main Street, Apt 4B",
    "line2": "Optional apartment",
    "city": "New York",
    "state": "NY",
    "pin": "10001",
    "phone": "+1234567890",
    "country": "US"
  }
}
```

**Response:** 
```json
{
  "orderId": "68ee621cae957de5b9dab718",
  "order": {
    "_id": "68ee621cae957de5b9dab718",
    "user": "user_id_here",
    "items": [
      {
        "product": "product_id",
        "quantity": 2,
        "pricePaise": 5000
      }
    ],
    "amountPaise": 10000,
    "status": "created",
    "address": { ... },
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "message": "Order created. Proceed to payment."
}
```

**Backend Logic:**
- Authenticate user (verify JWT token)
- Get user's current cart from DB
- Create order document with items from cart
- Copy shipping address to order
- Calculate total amount: `sum(product.pricePaise × quantity)`
- Set status to `"created"`
- **DO NOT clear cart yet** (will be cleared after payment succeeds)
- Return order with explicit `orderId` field

**Important:** The `orderId` MUST be explicitly returned in the response body

---

### 2. ✅ Create Payment Intent Endpoint

**Endpoint:** `POST /api/orders/{orderId}/payment-intent`

**Request:** No body needed

**Response:**
```json
{
  "orderId": "68ee621cae957de5b9dab718",
  "paymentIntentId": "pi_1234567890abc",
  "clientSecret": "pi_1234567890abc_secret_xyz",
  "amountPaise": 10000,
  "currency": "inr"
}
```

**Backend Logic:**
- Authenticate user (verify JWT token)
- Get order by ID from DB
- Verify order belongs to authenticated user
- **Validate orderId is not undefined/null**
- Get order total: `order.amountPaise`
- **Validate amount is >= 50 paise** (Stripe minimum for INR)
- Create Stripe PaymentIntent:
  ```javascript
  const paymentIntent = await stripe.paymentIntents.create({
    amount: order.amountPaise,      // In paise (lowest unit)
    currency: "inr",
    metadata: {
      orderId: order._id,
      userId: user._id,
      email: user.email,
    },
  });
  ```
- Store `paymentIntent.id` in order document
- **Return `amountPaise` in response** (frontend needs this!)
- Return clientSecret for frontend

**Critical Validation:**
- `amountPaise` must be a valid number and >= 50
- Must include `amountPaise` in response
- Must include `orderId` in response
- clientSecret must be valid

---

### 3. ✅ Confirm Payment Endpoint

**Endpoint:** `POST /api/orders/{orderId}/confirm-payment`

**Request Body:**
```json
{
  "paymentIntentId": "pi_1234567890abc"
}
```

**Response:**
```json
{
  "_id": "68ee621cae957de5b9dab718",
  "user": "user_id_here",
  "items": [...],
  "amountPaise": 10000,
  "status": "paid",
  "paymentIntentId": "pi_1234567890abc",
  "address": {...},
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:35:00Z"
}
```

**Backend Logic:**
- Authenticate user (verify JWT token)
- **Validate orderId is provided and not undefined**
- **Validate paymentIntentId is provided**
- Get order by ID
- Verify order belongs to authenticated user
- Verify with Stripe that payment succeeded:
  ```javascript
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (paymentIntent.status !== 'succeeded') {
    throw new Error('Payment not confirmed');
  }
  ```
- Update order status to `"paid"`
- Store paymentIntentId in order
- Return updated order

---

### 4. ✅ Clear Cart Endpoint

**Endpoint:** `DELETE /api/cart`

**Response:**
```json
{
  "_id": "cart_id",
  "user": "user_id",
  "items": [],
  "message": "Cart cleared"
}
```

**Backend Logic:**
- Authenticate user
- Delete all items from user's cart
- Return empty cart

**Frontend Timing:** This is called ONLY after successful payment confirmation

---

## 🚨 Critical Validations

### orderId Validation
```javascript
// WRONG ❌
if (!orderId) throw new Error('Order not found');

// CORRECT ✅
if (!orderId || orderId === 'undefined') throw new Error('Order not found');
```

### Amount Validation
```javascript
const STRIPE_MIN_PAISE = 50; // ₹0.50

if (!amountPaise || amountPaise < STRIPE_MIN_PAISE) {
  throw new Error(`Amount must be at least ₹${(STRIPE_MIN_PAISE/100).toFixed(2)}`);
}
```

### Payment Intent Response
```javascript
// Must include amountPaise ✅
return {
  orderId: order._id,
  paymentIntentId: intent.id,
  clientSecret: intent.client_secret,
  amountPaise: order.amountPaise,  // ← REQUIRED
  currency: "inr"
};
```

---

## Test Cases for Your Backend

### ✅ Happy Path
1. Create order with ₹10 total
2. Create payment intent (returns amountPaise: 1000)
3. Confirm payment (updates status to "paid")
4. Clear cart succeeds

### ❌ Error Cases to Handle
1. Order with amount < ₹0.50 → Error: "Minimum amount required"
2. Invalid orderId format → Error: "Order not found"
3. orderId = undefined → Error: "Invalid order ID"
4. Payment not verified with Stripe → Error: "Payment not confirmed"
5. Wrong user accessing order → Error: "Unauthorized"

---

## Database Schema Updates

### Order Model
```javascript
{
  _id: ObjectId,
  user: ObjectId,           // Link to user
  items: [
    {
      product: ObjectId,
      quantity: Number,
      pricePaise: Number
    }
  ],
  amountPaise: Number,      // Total in paise
  status: String,           // "created" | "paid" | "shipped" | "delivered"
  paymentIntentId: String,  // ← Store Stripe PaymentIntent ID
  address: {
    line1: String,
    line2: String,
    city: String,
    state: String,
    pin: String,
    phone: String,
    country: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## Environment Variables Needed

```bash
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_xxxxx     # From Stripe Dashboard
STRIPE_PUBLISHABLE_KEY=pk_test_xxx  # (Frontend will use this)

# Webhook Signing Secret (for payment.intent.succeeded events)
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# API Configuration
API_PORT=5999
NODE_ENV=development
```

---

## Stripe Webhook Setup (Optional but Recommended)

**Webhook Endpoint:** `POST /api/webhooks/stripe`

**Events to Listen For:**
- `payment_intent.succeeded` - Update order status if not already updated
- `payment_intent.payment_failed` - Update order status to failed

```javascript
app.post('/api/webhooks/stripe', (req, res) => {
  const event = req.body;
  
  switch(event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Update order status to "paid" if not already
      // Send confirmation email
      break;
  }
  
  res.json({received: true});
});
```

---

## Frontend → Backend Communication Timeline

| Step | Frontend Action | Backend Response | Frontend Next |
|------|---|---|---|
| 1 | POST /api/orders (address) | Returns orderId + order | Store order state |
| 2 | POST /api/orders/{id}/payment-intent | Returns amount + clientSecret | Show payment form |
| 3 | User enters card + clicks Pay | (Stripe handles) | Wait for success |
| 4 | POST /api/orders/{id}/confirm-payment | Returns updated order | Navigate to confirmation |
| 5 | DELETE /api/cart | Returns empty cart | Clear UI cart |

---

## Frontend Error Handling

The frontend now handles:
- ✅ Missing amountPaise → Shows clear error
- ✅ Invalid payment intent → Shows payer to retry
- ✅ Payment confirmation fails → Lets user try again
- ✅ Cart clear fails → Still shows success (graceful fallback)

---

## Test with Postman

### 1. Create Order
```
POST http://localhost:5999/api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "address": {
    "line1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "pin": "10001",
    "phone": "+1234567890"
  }
}
```

**Expected Response:**
```json
{
  "orderId": "...",
  "order": {...},
  "message": "Order created. Proceed to payment."
}
```

### 2. Create Payment Intent
```
POST http://localhost:5999/api/orders/{orderId}/payment-intent
Authorization: Bearer <token>
```

**Expected Response:**
```json
{
  "orderId": "...",
  "paymentIntentId": "pi_...",
  "clientSecret": "pi_..._secret_...",
  "amountPaise": 1000,
  "currency": "inr"
}
```

### 3. Confirm Payment
```
POST http://localhost:5999/api/orders/{orderId}/confirm-payment
Authorization: Bearer <token>
Content-Type: application/json

{
  "paymentIntentId": "pi_..."
}
```

**Expected Response:**
```json
{
  "_id": "...",
  "status": "paid",
  "paymentIntentId": "pi_...",
  ...
}
```

---

## Debugging Checklist

- [ ] Backend returns explicit `orderId` in create order response
- [ ] Backend returns `amountPaise` in payment intent response
- [ ] Backend validates `orderId` is not undefined
- [ ] Backend validates amount >= 50 paise
- [ ] Payment intent is created with correct amount in paise
- [ ] Order status changes to "paid" after confirmation
- [ ] Cart is cleared only after successful payment
- [ ] Stripe webhook is configured (optional)

---

## Frontend is Ready ✅

Your React checkout is now production-ready and will work perfectly once your backend implements these specs.

