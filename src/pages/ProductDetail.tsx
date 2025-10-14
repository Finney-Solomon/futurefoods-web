// src/pages/ProductDetail.tsx
import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams, Link, useLocation } from 'react-router-dom';
import NewHeader from '@/components/NewHeader';
import NewsletterFooter from '@/components/NewsletterFooter';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { apiService } from '@/services/api';

type Product = {
  _id: string;
  name: string;
  imageUrl: string;
  pricePaise: number;
  description?: string;
  stock?: number;
  slug: string;
};

function formatINRFromPaise(paise?: number) {
  if (typeof paise !== 'number') return '—';
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(rupees);
}

const ProductDetail: React.FC = () => {
  const [params] = useSearchParams();
  const slug = params.get('slug') || ''; // optional, just for shareable URL
  const navigate = useNavigate();
  const location = useLocation();

  // Prefer product from navigation state; fallback to sessionStorage.
  const preloadedFromState = (location.state as any)?.product as Product | undefined;
  let cached: Product | null = null;
  try {
    cached = JSON.parse(sessionStorage.getItem('lastProduct') || 'null');
  } catch {
    cached = null;
  }

  const product = useMemo<Product | null>(() => {
    // If both exist, prefer state (most up-to-date). If slug exists, ensure it matches.
    const pick = preloadedFromState ?? cached ?? null;
    if (pick && slug && pick.slug !== slug) return null; // mismatch safety
    return pick;
  }, [preloadedFromState, cached, slug]);

  const [quantity, setQuantity] = useState(1);
  const inStock = (product?.stock ?? 0) > 0;

  // const handleAddToCart = () => {
  //   if (!product) return;
  //   navigate('/cart', {
  //     state: {
  //       item: {
  //         productId: product._id,
  //         name: product.name,
  //         imageUrl: product.imageUrl,
  //         pricePaise: product.pricePaise,
  //         quantity,
  //       },
  //     },
  //   });
  // };

  const handleAddToCart = async () => {
  if (!product) return;
  try {
    await apiService.addToCart(product._id, quantity);
    // optional: show a toast here
    // toast.success('Added to cart');
    // Go to cart
    navigate('/cart');
  } catch (e: any) {
    // toast.error(e?.message || 'Could not add to cart');
    if (e?.status === 401) navigate('/login', { state: { from: '/product-detail' } });
  }
};

  const handleBuyNow = () => {
    if (!product) return;
    navigate('/checkout', {
      state: {
        items: [
          {
            productId: product._id,
            name: product.name,
            pricePaise: product.pricePaise,
            quantity,
          },
        ],
      },
    });
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <NewHeader />
        <main className="py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">No product data</h1>
            <p className="text-gray-600 mb-6">
              Please open this page from the Shop, or select a product again.
            </p>
            <Button asChild className="rounded-full px-6">
              <Link to="/shop">Back to Shop</Link>
            </Button>
          </div>
        </main>
        <NewsletterFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <NewHeader />

      <main className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column - Image */}
          <div className="flex justify-center">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full max-w-md h-96 object-cover rounded-xl"
              loading="lazy"
            />
          </div>

          {/* Right Column - Product Details */}
          <div className="flex flex-col justify-center space-y-8">
            <h1 className="text-4xl font-bold text-[hsl(var(--ff-dark))]">
              {product.name}
            </h1>

            <div className="text-3xl font-bold text-[hsl(var(--ff-navy))]">
              {formatINRFromPaise(product.pricePaise)}
            </div>

            <p className="text-lg text-gray-700 leading-relaxed">
              {product.description}
            </p>

            {/* Stock indicator */}
            <div>
              {inStock ? (
                <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs text-green-700 border-green-300 bg-green-50">
                  In stock: {product.stock}
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs text-red-700 border-red-300 bg-red-50">
                  Out of stock
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-lg font-semibold text-[hsl(var(--ff-dark))]">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 hover:bg-gray-100 disabled:opacity-50"
                  disabled={!inStock}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-lg font-semibold min-w-10 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min((product?.stock ?? 1), q + 1))}
                  className="p-2 hover:bg-gray-100 disabled:opacity-50"
                  disabled={!inStock}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="bg-[hsl(var(--ff-yellow))] text-[hsl(var(--ff-dark))] hover:bg-[hsl(var(--ff-yellow))]/90 px-8 py-3 text-lg font-semibold rounded-full disabled:opacity-60"
                size="lg"
              >
                Add to Cart
              </Button>
              <Button
                onClick={handleBuyNow}
                disabled={!inStock}
                variant="outline"
                className="border-2 border-[hsl(var(--ff-navy))] text-[hsl(var(--ff-navy))] hover:bg-[hsl(var(--ff-navy))] hover:text-white px-8 py-3 text-lg font-semibold rounded-full disabled:opacity-60"
                size="lg"
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </main>

      <NewsletterFooter />
    </div>
  );
};

export default ProductDetail;
