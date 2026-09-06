import React, { useState } from 'react';
import { Heart, ShoppingBag, Star, Eye, Check } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, wishlist, toggleWishlist, setSelectedProductForDetail } = useStore();
  const [justAdded, setJustAdded] = useState(false);

  const isWishlisted = wishlist.includes(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 8;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div 
      onClick={() => setSelectedProductForDetail(product)}
      className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-purple-300 hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Top Image Container */}
      <div className="relative aspect-square w-full bg-slate-50/90 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Discount & Deal Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {discountPercent && (
            <span className="bg-purple-700 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full shadow-xs tracking-tight">
              -{discountPercent}%
            </span>
          )}
          {product.badgeText && (
            <span className="bg-slate-900/90 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 rounded-full shadow-xs">
              {product.badgeText}
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-rose-700 text-white text-[9px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 rounded-full">
              Out of Stock
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2 right-2 p-1 sm:p-1.5 rounded-full backdrop-blur-md transition-all z-10 cursor-pointer ${
            isWishlisted 
              ? 'bg-rose-50 text-rose-600 shadow-xs ring-1 ring-rose-200' 
              : 'bg-white/90 text-slate-400 hover:text-rose-600 hover:bg-white shadow-xs'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Hover Button (desktop only) */}
        <div className="hidden sm:flex absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity justify-center z-10 pointer-events-none group-hover:pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProductForDetail(product);
            }}
            className="w-full py-1.5 bg-slate-900/90 hover:bg-slate-900 text-white rounded-xl text-xs font-medium backdrop-blur-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-purple-300" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between gap-2 sm:gap-2.5">
        <div>
          {/* Brand & Weight */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 font-medium">
            <span className="text-purple-700 font-semibold truncate mr-1">{product.brand}</span>
            {product.weightOrSize && <span className="text-slate-400 shrink-0">{product.weightOrSize}</span>}
          </div>

          {/* Title */}
          <h3 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 mt-0.5 sm:mt-1 group-hover:text-purple-700 transition-colors leading-snug">
            {product.title}
          </h3>

          {/* Stats: Rating & Sold */}
          <div className="flex items-center justify-between gap-1 mt-1 text-[10px] sm:text-xs">
            <div className="flex items-center text-amber-500 font-semibold gap-0.5 sm:gap-1 text-[10px] sm:text-[11px]">
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal">({product.reviewCount})</span>
            </div>
            <span className="text-slate-400 text-[10px] sm:text-[11px]">
              {product.soldCount > 1000 ? `${(product.soldCount / 1000).toFixed(1)}k+` : product.soldCount} sold
            </span>
          </div>

          {/* Stock Warning */}
          {isLowStock && (
            <p className="text-[10px] sm:text-[11px] text-amber-700 font-medium mt-0.5 sm:mt-1">
              Only {product.stock} left in stock
            </p>
          )}
        </div>

        {/* Price & Add to Cart button */}
        <div className="pt-1.5 sm:pt-2 border-t border-slate-100 flex flex-col gap-1.5 sm:gap-2">
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-sm sm:text-lg font-black text-slate-900">
              ৳{product.price.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                ৳{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-purple-700 hover:bg-purple-800 text-white shadow-xs active:scale-[0.98]'
            }`}
          >
            {isOutOfStock ? (
              <span>Out of Stock</span>
            ) : justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
