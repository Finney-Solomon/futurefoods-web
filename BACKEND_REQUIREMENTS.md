# 📋 Backend Team Checklist

## Required Backend Implementation for Stripe Integration

This checklist outlines what the **backend team** needs to implement to support the frontend Stripe integration.

---

## 🔐 Authentication Endpoints

### ✅ Already Expected (Verify/Implement)

- [ ] `POST /auth/register`
  - Input: `{ name, email, password, role }`
  - Output: `{ accessToken, refreshToken, user }`
  - Returns JWT tokens

- [ ] `POST /auth/login`
  - Input: `{ email, password }`
  - Output: `{ accessToken, refreshToken, user }`
  - Returns JWT tokens

- [ ] `GET /auth/me`
  - Auth: Bearer token required
  - Output: `{ id, email, name, role }`
  - Returns logged-in user details

- [ ] `POST /auth/refresh`
  - Input: `{ refreshToken }`
  - Output: `{ accessToken, refreshToken, user }`
  - Returns new access token

---

## 🛒 Cart Endpoints

### ✅ Must Implement

- [ ] `GET /cart`
  - Auth: Bearer token required
  - Output: `{ _id, user, items: [{ _id, product, quantity }], totalItems, totalPricePaise }`
  - Retrieves user's shopping cart

- [ ] `POST /cart/items`
  - Auth: Bearer token required
  - Input: `{ productId, quantity }`
  - Output: Updated cart object
  - Adds product to cart

- [ ] `PUT /cart/items/:itemId`
  - Auth: Bearer token required
  - Input: `{ quantity }`
  - Output: Updated cart object
  - Updates item quantity

- [ ] `DELETE /cart/items/:itemId`
  - Auth: Bearer token required
  - Output: Updated cart object
  - Removes item from cart

- [ ] `DELETE /cart`
  - Auth: Bearer token required
  - Output: `{ message: "Cart cleared" }`
  - Clears entire cart

---

## 📦 Order Endpoints

### ✅ Must Implement

- [ ] `POST /orders`
  - Auth: Bearer token required
  - Input: `{ address: { line1, city, state, pin, phone, country? }, notes? }`
  - Output: `{ _id, user, items, amountPaise, status: "created", address, createdAt }`
  - Actions:
    - Create order from cart
    - Clear user's cart after order created
    - Return order ID for payment

- [ ] `GET /orders/myOrders`
  - Auth: Bearer token required
  - Output: `{ items: [Order], total, page, limit }`
  - Returns user's orders (paginated)

- [ ] `GET /orders/:orderId`
  - Auth: Bearer token required
  - Output: Order object with full details
  - Returns specific order

- [ ] `GET /orders` (Admin only)
  - Auth: Bearer token required + admin role
  - Output: `{ items: [Order], total, page, limit }`
  - Returns all orders (for admin dashboard)

---

## 💳 Stripe Payment Endpoints

### ✅ CRITICAL - Must Implement

These endpoints handle **Stripe integration**. The frontend will call these.

#### 1. Create Payment Intent for Cart (NEW - Payment First Flow)

```
POST /payment-intent/cart
Auth: Bearer token required
Output: {
  paymentIntentId: "pi_xxxxx",
  clientSecret: "pi_xxxxx_secret_yyyyy",
  amountPaise: 5000,
  currency: "usd"
}
```

**Backend Logic**:

- Get user's cart
- Calculate total amount from cart items
- Create Stripe PaymentIntent with:
  ```javascript
  const intent = await stripe.paymentIntents.create({
    amount: cartTotalPaise, // Calculate from cart items
    currency: "usd",
    metadata: {
      userId: user._id,
      email: user.email,
      type: "cart_payment",
    },
  });
  ```
- Return clientSecret to frontend (no order created yet)

**Important Notes**:

- This creates payment intent BEFORE order creation
- Amount calculated from current cart contents
- No order ID in response (payment happens first)

#### 2. Create Order After Payment Success

```
POST /orders/create-after-payment
Auth: Bearer token required
Body: {
  address: {
    line1: "123 Main St",
    line2: "Apt 4B",
    city: "New York",
    state: "NY",
    pin: "10001",
    phone: "+1234567890",
    country: "US"
  },
  paymentIntentId: "pi_xxxxx_from_payment"
}
Output: Order object (same as regular order creation)
```

**Backend Logic**:

- Verify paymentIntentId with Stripe:
  ```javascript
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (paymentIntent.status !== "succeeded") {
    throw new Error("Payment not completed");
  }
  ```
- Create order with provided address
- Set order status to "paid"
- Store paymentIntentId in order
- Clear user's cart
- Return created order

**Important Notes**:

- Order is only created AFTER successful payment
- Payment verification is critical
- Cart should be cleared after successful order creation

#### 3. Create Payment Intent (Original - Order First Flow)

```
POST /orders/:orderId/payment-intent
Auth: Bearer token required
Output: {
  orderId: "order_id",
  paymentIntentId: "pi_xxxxx",
  clientSecret: "pi_xxxxx_secret_yyyyy",
  amountPaise: 5000,
  currency: "usd"
}
```

**Backend Logic**:

- Get order by ID (verify user owns it)
- Calculate total amount (order.amountPaise)
- Create Stripe PaymentIntent with:
  ```javascript
  const intent = await stripe.paymentIntents.create({
    amount: order.amountPaise, // Already in cents/smallest unit
    currency: "usd",
    metadata: {
      orderId: order._id,
      userId: user._id,
      email: user.email,
    },
  });
  ```
- Store `paymentIntentId` in order document
- Return clientSecret to frontend

**Important Notes**:

- Amount is in **paise** (1/100 of USD) - don't divide!
- `clientSecret` is needed for frontend payment confirmation
- Store `paymentIntentId` in order for later verification

---

#### 2. Confirm Payment

```
POST /orders/:orderId/confirm-payment
Auth: Bearer token required
Input: { paymentIntentId: "pi_xxxxx" }
Output: { _id, status: "paid", ... }
```

**Backend Logic**:

- Get order by ID
- Verify `paymentIntentId` matches order.paymentIntentId
- Retrieve PaymentIntent from Stripe:
  ```javascript
  const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
  ```
- Verify status is "succeeded"
- If succeeded:
  - Update order: `status = "paid"`, `paymentStatus = "succeeded"`
  - Create/trigger fulfillment process
  - Send order confirmation email
  - Return updated order
- If failed:
  - Update order: `status = "cancelled"`, `paymentStatus = "failed"`
  - Return error

**Important**:

- Always verify with Stripe - don't trust frontend alone!
- Store Stripe response in order document
- Don't process order until Stripe confirms

---

#### 3. Get Payment Status

```
GET /orders/:orderId/payment-status
Auth: Bearer token required
Output: {
  orderId: "order_id",
  status: "pending|succeeded|failed",
  paymentIntentId: "pi_xxxxx",
  error?: "error message"
}
```

**Backend Logic**:

- Get order by ID
- Check order.paymentStatus
- If unknown, retrieve from Stripe and update
- Return current payment status

---

## 🔔 Stripe Webhook (IMPORTANT!)

### Setup in Stripe Dashboard

1. Go to https://dashboard.stripe.com/webhooks
2. Create new endpoint:
   - **URL**: `https://your-api.example.com/api/webhooks/stripe`
   - **Version**: Use latest API version
   - **Events**: Select:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `charge.refunded` (optional)

### Implement Webhook Handler

```
POST /webhooks/stripe
Input: Stripe webhook event (in body)
```

**Backend Logic**:

```javascript
// 1. Verify webhook signature (CRITICAL!)
const sig = req.headers["stripe-signature"];
const event = stripe.webhooks.constructEvent(
  req.rawBody,
  sig,
  process.env.STRIPE_WEBHOOK_SECRET,
);

// 2. Handle payment.intent.succeeded
if (event.type === "payment_intent.succeeded") {
  const paymentIntent = event.data.object;

  // Find order by paymentIntentId
  const order = await Order.findOne({
    paymentIntentId: paymentIntent.id,
  });

  if (order) {
    // Update order status
    order.status = "paid";
    order.paymentStatus = "succeeded";
    order.stripePaymentMethodId = paymentIntent.payment_method;
    await order.save();

    // Create fulfillment/shipment
    // Send confirmation email
    // Update inventory
  }
}

// 3. Handle payment_intent.payment_failed
if (event.type === "payment_intent.payment_failed") {
  const paymentIntent = event.data.object;

  const order = await Order.findOne({
    paymentIntentId: paymentIntent.id,
  });

  if (order) {
    order.status = "failed";
    order.paymentStatus = "failed";
    await order.save();

    // Send failure email to user
  }
}

// 4. Return 200 to Stripe
return res.status(200).json({ received: true });
```

**Why Webhooks?**

- Webhooks are the **authoritative source** for payment status
- Used for:
  - Confirming payments after network issues
  - Handling async payment methods
  - Reconciliation
  - Processing backlog

---

## 📄 Order & Product Endpoints

### ✅ Verify These Exist

Products:

- [ ] `GET /products` (with filters: limit, page, category, search)
- [ ] `GET /products/:slug`
- [ ] `POST /products` (admin only)

Categories:

- [ ] `GET /categories`
- [ ] `POST /categories` (admin only)

Recipes:

- [ ] `GET /recipes`
- [ ] `GET /recipes/:slug`

Blog:

- [ ] `GET /blog`
- [ ] `GET /blog/:slug`

---

## 🔒 Security Requirements

### ✅ Must Implement

- [ ] JWT token validation on all protected routes

  ```javascript
  // Expected: Authorization: Bearer <token>
  // Verify token signature & expiration
  ```

- [ ] Admin role checking for admin endpoints

  ```javascript
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  ```

- [ ] CORS configuration for frontend origin

  ```
  Access-Control-Allow-Origin: https://yourfrontend.com (or localhost:5173 for dev)
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE
  Access-Control-Allow-Headers: Content-Type, Authorization
  ```

- [ ] Rate limiting
  - Prevent abuse
  - Especially on auth endpoints

- [ ] Input validation
  - Validate all incoming data
  - Use Joi or Zod

- [ ] PCI Compliance
  - **NEVER store raw card data**
  - **NEVER log card numbers**
  - Always use Stripe for card processing

- [ ] HTTPS/TLS (production)
  - All sensitive endpoints

- [ ] Webhook signature verification
  - Verify events come from Stripe

---

## 💾 Database Schema Updates Needed

### Order Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  items: [
    {
      _id: ObjectId,
      product: ObjectId (ref: Product),
      name: String,
      quantity: Number,
      pricePaise: Number
    }
  ],
  amountPaise: Number, // Total before tax
  status: String, // "created|paid|shipped|delivered|cancelled"
  paymentStatus: String, // "pending|succeeded|failed"
  paymentIntentId: String, // Stripe paymentIntent.id
  stripePaymentMethodId: String, // Saved for receipts
  address: {
    line1: String,
    line2: String,
    city: String,
    state: String,
    pin: String,
    country: String,
    phone: String
  },
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🧪 Testing Checklist

### ✅ Test These Flows

- [ ] Register → Login → Get current user
- [ ] Add product to cart
- [ ] Create order from cart
- [ ] Create payment intent (cart cleared?)
- [ ] Confirm payment with test card (4242...)
- [ ] Verify order status updated to "paid"
- [ ] Confirm payment with declined card (4000...)
- [ ] Verify order status updated to "failed"
- [ ] Test webhook payload handling
- [ ] Test JWT token refresh
- [ ] Test 401 auto-logout on expired token
- [ ] Test admin endpoints (403 when not admin)

### Test Stripe Keys

```
Development: Use test keys
- Publishable: pk_test_...
- Secret: sk_test_...

Production: Use live keys
- Publishable: pk_live_...
- Secret: sk_live_...
```

---

## 📧 Email Templates Needed

Create these email templates (optional but recommended):

- [ ] Order Confirmation
  - Order ID, items, total, shipping address
  - Link to order tracking

- [ ] Payment Confirmation
  - Receipt, payment method, transaction ID
  - Support contact

- [ ] Order Shipped
  - Tracking number, estimated delivery
  - Support contact

- [ ] Payment Failed
  - Reason, retry link
  - Support contact

---

## 🔗 Environment Variables Needed

Set these on backend:

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_YOUR_TEST_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

# Database
DATABASE_URL=mongodb+srv://...

# JWT
JWT_SECRET=your-secret-key-change-this-in-prod
JWT_EXPIRATION=24h

# API
API_PORT=5999
CORS_ORIGIN=http://localhost:5173,https://yourdomain.com

# Email (if implementing)
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASS=...
```

---

## 📞 Question & Answer

**Q: Frontend sends payment amount, should I trust it?**
A: No! Always recalculate on backend:

```javascript
const order = await Order.findById(orderId);
const amount = order.amountPaise; // Trust order total, not frontend
const intent = await stripe.paymentIntents.create({ amount });
```

**Q: How do I handle payment processing delays?**
A: Use webhooks! Don't rely on the confirm payment response.

**Q: What if Stripe webhook fails to deliver?**
A:

1. Log webhook attempts
2. Implement retry mechanism
3. Manual reconciliation job (optional)

**Q: Should I send order confirmation email after confirm-payment?**
A: Preferably after webhook succeeds, but you can send after both.

**Q: What about refunds?**
A: Implement later as separate endpoint. Not needed for MVP.

---

## ✅ Sign-Off Checklist

- [ ] All endpoints implemented & tested
- [ ] Stripe keys configured (test for dev)
- [ ] Webhook endpoint working
- [ ] CORS configured for frontend origin
- [ ] Database schema updated
- [ ] JWT tokens generating correctly
- [ ] Admin role checking working
- [ ] All test cases passing
- [ ] Error messages user-friendly
- [ ] Logging in place for debugging
- [ ] Documentation updated
- [ ] Ready for frontend testing

---

## 🚀 Deployment Steps

### Before Going Live

1. [ ] Get production Stripe keys
2. [ ] Update `.env` with `sk_live_` key
3. [ ] Configure webhook with production URL
4. [ ] Update frontend with `pk_live_` key
5. [ ] Test full flow in production environment
6. [ ] Setup error monitoring (Sentry)
7. [ ] Setup performance monitoring
8. [ ] Backup database
9. [ ] Document runbooks
10. [ ] Test payment with real card (if approved)

---

## 📚 Useful Resources

- [Stripe Server Documentation](https://stripe.com/docs/payments)
- [PaymentIntents API](https://stripe.com/docs/payments/payment-intents)
- [Webhook Documentation](https://stripe.com/docs/webhooks)
- [Testing Guide](https://stripe.com/docs/testing)

---

## 📞 Questions?

If anything is unclear:

1. Check Stripe documentation
2. Review this checklist
3. Ask frontend team about their implementation
4. Check Postman collection for expected request/response formats

---

**Version**: 1.0.0
**Updated**: April 2026
**Status**: Ready for Backend Implementation ✅
