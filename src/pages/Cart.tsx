// src/pages/Cart.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NewHeader from '@/components/NewHeader';
import NewsletterFooter from '@/components/NewsletterFooter';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { apiService, Cart, CartItem } from '@/services/api';

function formatINRFromPaise(paise?: number) {
  if (typeof paise !== 'number') return '—';
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(rupees);
}

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  // Load cart on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await apiService.getCart();
        if (mounted) setCart(data);
      } catch (e: any) {
        if (e?.status === 401) navigate('/login', { state: { from: '/cart' } });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [navigate]);

  const subtotalPaise = useMemo(() => {
    if (!cart) return 0;
    return cart.items.reduce((sum, item) => sum + item.product.pricePaise * item.quantity, 0);
  }, [cart]);

  const shippingPaise = 150 * 100; // demo flat shipping: ₹150
  const totalPaise = subtotalPaise + (cart ? (cart.items.length > 0 ? shippingPaise : 0) : 0);

  // Update quantity (+/-)
  const changeQty = async (item: CartItem, nextQty: number) => {
    if (nextQty < 1) return;
    try {
      const updated = await apiService.updateCartItem(item._id, nextQty);
      setCart(updated);
    } catch (e: any) {
      // toast.error(e?.message || 'Could not update item');
      if (e?.status === 401) navigate('/login', { state: { from: '/cart' } });
    }
  };

  // Remove item
  const removeItem = async (item: CartItem) => {
    try {
      const updated = await apiService.removeCartItem(item._id);
      setCart(updated);
    } catch (e: any) {
      if (e?.status === 401) navigate('/login', { state: { from: '/cart' } });
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <NewHeader />
        <main className="py-20 px-6">
          <div className="max-w-7xl mx-auto">Loading cart…</div>
        </main>
        <NewsletterFooter />
      </div>
    );
  }

  const items = cart?.items ?? [];

  return (
    <div className="min-h-screen bg-white">
      <NewHeader />

      <main className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold text-[hsl(var(--ff-dark))] mb-16 text-center">My Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.length === 0 && (
                <div className="p-8 rounded-xl bg-gray-50 text-gray-600">Your cart is empty.</div>
              )}

              {items.map((item) => (
                <div key={item._id} className="flex items-center space-x-4 p-6 bg-gray-50 rounded-xl">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[hsl(var(--ff-dark))]">{item.product.name}</h3>
                    <p className="text-[hsl(var(--ff-navy))] font-semibold">
                      {formatINRFromPaise(item.product.pricePaise)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      className="p-1 hover:bg-gray-200 rounded"
                      onClick={() => changeQty(item, item.quantity - 1)}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-1 bg-white rounded text-center min-w-[50px]">{item.quantity}</span>
                    <button
                      className="p-1 hover:bg-gray-200 rounded"
                      onClick={() => changeQty(item, item.quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button className="p-2 text-red-500 hover:bg-red-50 rounded" onClick={() => removeItem(item)}>
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-[hsl(var(--ff-navy))] text-white p-8 rounded-xl h-fit">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatINRFromPaise(subtotalPaise)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{items.length > 0 ? formatINRFromPaise(shippingPaise) : '—'}</span>
                </div>
                <hr className="border-white/20" />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>{formatINRFromPaise(totalPaise)}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={items.length === 0}
                className="w-full bg-[hsl(var(--ff-yellow))] text-[hsl(var(--ff-dark))] hover:bg-[hsl(var(--ff-yellow))]/90 py-4 text-lg font-semibold rounded-full disabled:opacity-60"
                size="lg"
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </main>

      <NewsletterFooter />
    </div>
  );
};

export default CartPage;
