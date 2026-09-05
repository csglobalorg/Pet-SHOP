import React from 'react';
import { BookOpen, Star, MessageSquareQuote, Smartphone, ExternalLink, Calendar, Phone, MessageCircle } from 'lucide-react';
import { BLOG_POSTS, TESTIMONIALS, STORE_INFO } from '../data/initialData';

export const PetCareBlogAndReviews: React.FC = () => {
  return (
    <div className="space-y-16">
      
      {/* BLOG & GUIDES SECTION */}
      <section id="blog-section" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-100 pb-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Pet Care Guide • Expert Advice</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Nutrition & Veterinary Care Tips
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-xs">
            Practical advice tailored to coastal weather and daily wellness for your cats and dogs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {BLOG_POSTS.map(post => (
            <article 
              key={post.id}
              className="bg-white rounded-2xl border border-purple-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-purple-50">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 left-2.5 bg-purple-950/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                  {post.category}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <Calendar className="w-3 h-3 text-purple-600" />
                    <span>{post.date}</span>
                    <span>• {post.readTime}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-xs font-semibold text-purple-700 group-hover:underline flex items-center gap-1">
                    <span>Read Article</span>
                    <span>→</span>
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CUSTOMER TESTIMONIALS */}
      <section className="bg-purple-50/40 rounded-2xl p-6 sm:p-8 border border-purple-100 space-y-6">
        <div className="text-center max-w-md mx-auto space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-700">
            Trusted by Cox's Bazar Pet Parents
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Verified Customer Reviews
          </h2>
          <p className="text-xs text-slate-500">
            Real experiences from pet lovers across Cox's Bazar Sadar, Kolatoli, Sugandha, and nearby neighborhoods
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {TESTIMONIALS.map((review, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-purple-100 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  "{review.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-200"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{review.name}</h4>
                  <p className="text-[11px] text-slate-500">
                    {review.location} • <span className="text-purple-700 font-semibold">{review.pet}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DIRECT HOTLINE & WHATSAPP PROMO */}
      <section className="rounded-2xl bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-purple-800/40">
        <div className="space-y-3 max-w-xl text-center md:text-left">
          <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-[10px] font-bold uppercase tracking-wider text-purple-200 border border-purple-400/30">
            Cox's Bazar Direct Ordering
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            Order Directly via Phone or WhatsApp!
          </h3>
          <p className="text-xs sm:text-sm text-purple-100 leading-relaxed">
            Need urgent pet food, litter bags, or a grooming slot? Call our direct hotline or chat with us on WhatsApp. Fast doorstep delivery guaranteed across Cox's Bazar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a 
            href={`tel:${STORE_INFO.phone}`}
            className="px-5 py-3 rounded-xl bg-white hover:bg-purple-50 text-purple-950 font-bold text-xs flex items-center gap-2.5 shadow-sm transition-colors"
          >
            <Phone className="w-4 h-4 text-purple-700" />
            <span>Call Now: {STORE_INFO.phone}</span>
          </a>

          <a 
            href={`https://wa.me/${STORE_INFO.whatsappDigits}?text=${encodeURIComponent('Hello Cox\'s Bazar Pet Shop! I would like to place an order.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2.5 shadow-sm transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Message</span>
          </a>
        </div>
      </section>

    </div>
  );
};
