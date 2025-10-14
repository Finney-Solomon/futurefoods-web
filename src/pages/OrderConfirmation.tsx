import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NewHeader from '@/components/NewHeader';
import NewsletterFooter from '@/components/NewsletterFooter';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Order } from '@/services/api';

function formatINRFromPaise(paise?: number) {
  if (typeof paise !== 'number') return '—';
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(rupees);
}

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order = (location.state as { order?: Order } | null)?.order || null;

  const orderNumber =
    order?._id ? `FFZ-${order._id.toUpperCase()}` : 'FFZ-NEW';

  const handleContinueShopping = () => {
    navigate('/shop');
  };

  return (
    <div className="min-h-screen bg-white">
      <NewHeader />
      
      <main className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
            <h1 className="text-5xl font-bold text-[hsl(var(--ff-dark))] mb-6">
              {order ? 'Thank You For Your Order!' : 'Order Placed'}
            </h1>
          </div>

          <div className="bg-gray-50 p-12 rounded-xl mb-12">
            {order ? (
              <>
                <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                  Your order has been successfully placed. We’ve sent a confirmation email with your order details.
                </p>

                <div className="bg-[hsl(var(--ff-navy))] text-white p-6 rounded-lg inline-block mb-6">
                  <p className="text-lg mb-2">Order Number</p>
                  <p className="text-2xl font-bold text-[hsl(var(--ff-yellow))]">
                    {orderNumber}
                  </p>
                </div>

                <div className="text-gray-700 text-left max-w-xl mx-auto">
                  <p className="mb-2"><span className="font-semibold">Total:</span> {formatINRFromPaise(order.amountPaise)}</p>
                  <p className="mb-2"><span className="font-semibold">Status:</span> {order.status}</p>
                  <p className="mb-2">
                    <span className="font-semibold">Ship To:</span>{' '}
                    {order.address?.line1}, {order.address?.city}
                    {order.address?.state ? `, ${order.address.state}` : ''} — {order.address?.pin}
                  </p>
                </div>
              </>
            ) : (
              <>
                <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                  Your order has been placed. (If you reloaded this page, we couldn’t fetch details—please check your email.)
                </p>
                <div className="bg-[hsl(var(--ff-navy))] text-white p-6 rounded-lg inline-block">
                  <p className="text-lg mb-2">Order Number</p>
                  <p className="text-2xl font-bold text-[hsl(var(--ff-yellow))]">
                    {orderNumber}
                  </p>
                </div>
              </>
            )}
          </div>
          
          <div className="space-y-6">
            <Button 
              onClick={handleContinueShopping}
              className="bg-[hsl(var(--ff-yellow))] text-[hsl(var(--ff-dark))] hover:bg-[hsl(var(--ff-yellow))]/90 px-12 py-4 text-lg font-semibold rounded-full"
              size="lg"
            >
              Continue Shopping
            </Button>
            
            <div className="text-center text-gray-600">
              <p>Questions about your order?</p>
              <p>Contact us at <span className="text-[hsl(var(--ff-navy))] font-semibold">support@futurefoodz.com</span></p>
            </div>
          </div>
        </div>
      </main>

      <NewsletterFooter />
    </div>
  );
};

export default OrderConfirmation;
