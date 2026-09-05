import React, { useState } from 'react';
import { X, Star, Heart, ShoppingBag, ShieldCheck, Truck, Check, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProductForDetail, 
    setSelectedProductForDetail, 
    addToCart, 
    wishlist, 
    toggleWishlist,
    setIsCheckoutOpen 
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  if (!selectedProductForDetail) return null;
  const product = selectedProductForDetail;

  const isWishlisted = wishlist.includes(product.id);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setSelectedProductForDetail(null);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-hidden my-6">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductForDetail(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-purple-100 text-slate-600 hover:text-purple-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
          
          {/* Left: Product Image & Badges */}
          <div className="space-y-3">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-purple-50/40 border border-purple-100">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover object-center"
              />
              {product.badgeText && (
                <span className="absolute top-3 left-3 bg-purple-800 text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-xs">
                  {product.badgeText}
                </span>
              )}
            </div>

            {/* Micro value props */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5 p-2 bg-purple-50/50 rounded-xl border border-purple-100">
                <Truck className="w-4 h-4 text-purple-700 shrink-0" />
                <span>24-48 Hour Delivery</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 bg-purple-50/50 rounded-xl border border-purple-100">
                <ShieldCheck className="w-4 h-4 text-purple-700 shrink-0" />
                <span>100% Genuine Brand</span>
              </div>
            </div>
          </div>

          {/* Right: Info & Actions */}
          <div className="flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              {/* Category, SKU & Brand */}
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Brand: <strong className="text-purple-950 font-bold">{product.brand}</strong></span>
                <span className="font-mono">SKU: {product.sku}</span>
              </div>

              {/* Title */}
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {product.title}
              </h2>

              {/* Ratings & Sold */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center text-amber-500 font-semibold gap-1 bg-amber-50 px-2 py-0.5 rounded-md">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{product.rating.toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">({product.reviewCount} reviews)</span>
                </div>
                <span className="text-slate-300">•</span>
                <span className="text-purple-700 font-semibold">
                  {product.soldCount > 1000 ? `${(product.soldCount/1000).toFixed(1)}k+` : product.soldCount} sold
                </span>
              </div>

              {/* Price & Stock */}
              <div className="flex items-baseline gap-3 p-3.5 rounded-2xl bg-purple-50/40 border border-purple-100">
                <span className="text-2xl font-black text-slate-900">
                  ৳{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    ৳{product.originalPrice.toLocaleString()}
                  </span>
                )}
                {product.stock > 0 ? (
                  <span className="ml-auto text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    ✓ In Stock ({product.stock} left)
                  </span>
                ) : (
                  <span className="ml-auto text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900">Product Description</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Specs & Weight */}
              {product.weightOrSize && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500 font-medium">Weight / Size:</span>
                  <span className="font-semibold text-purple-900 bg-purple-100 px-2 py-0.5 rounded-md">
                    {product.weightOrSize}
                  </span>
                </div>
              )}
            </div>

            {/* Actions: Quantity + Add to cart + Buy now */}
            <div className="space-y-2.5 pt-3 border-t border-purple-100">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))}
                    disabled={isOutOfStock || quantity >= product.stock}
                    className="w-7 h-7 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer disabled:opacity-30"
                  >
                    +
                  </button>
                </div>

                {/* Wishlist toggle */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                    isWishlisted 
                      ? 'border-red-200 bg-red-50 text-red-500' 
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                  title="Save to wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isOutOfStock
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : justAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-purple-950 hover:bg-purple-900 text-white'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                    isOutOfStock
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-purple-700 hover:bg-purple-800 text-white shadow-purple-900/20'
                  }`}
                >
                  <Zap className="w-4 h-4 text-purple-200 fill-current" />
                  <span>Buy Now (৳{(product.price * quantity).toLocaleString()})</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
