import React, { useState } from 'react';
import { 
  BookOpen, 
  Star, 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  X, 
  Phone, 
  MessageCircle, 
  Tag, 
  ShoppingBag, 
  Sparkles, 
  Share2,
  ChevronRight
} from 'lucide-react';
import { BLOG_POSTS, TESTIMONIALS, STORE_INFO } from '../data/initialData';
import { BlogPost, ProductCategory } from '../types';

interface PetCareBlogAndReviewsProps {
  onSelectCategory?: (category: ProductCategory) => void;
}

export const PetCareBlogAndReviews: React.FC<PetCareBlogAndReviewsProps> = ({ onSelectCategory }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const categories = [
    'All',
    'Seasonal Care',
    'Nutrition Advice',
    'Litter & Hygiene',
    'Veterinary Care',
    'Pet Care Guide'
  ];

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const query = searchQuery.trim().toLowerCase();
    if (!query) return matchesCategory;

    const matchesTitle = post.title.toLowerCase().includes(query) || (post.titleBn && post.titleBn.toLowerCase().includes(query));
    const matchesExcerpt = post.excerpt.toLowerCase().includes(query);
    const matchesTags = post.tags?.some(tag => tag.toLowerCase().includes(query));
    const matchesContent = post.content?.some(c => c.text.toLowerCase().includes(query) || (c.heading && c.heading.toLowerCase().includes(query)));

    return matchesCategory && (matchesTitle || matchesExcerpt || matchesTags || matchesContent);
  });

  const handleOpenArticle = (post: BlogPost) => {
    setSelectedPost(post);
    setCopiedLink(false);
  };

  const handleShare = (post: BlogPost) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href.split('#')[0] + `#blog-${post.id}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleShopRelated = (category?: ProductCategory) => {
    if (category && onSelectCategory) {
      onSelectCategory(category);
      setSelectedPost(null);
      const catalogEl = document.getElementById('product-catalog-section');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="space-y-16">
      
      {/* BLOG & GUIDES SECTION - WITH BOTH ID ANCHORS */}
      <section id="pet-care-blog-section" className="scroll-mt-24 space-y-6">
        <span id="blog-section" className="block -mt-24 pt-24" aria-hidden="true" />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-purple-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider">
              <span className="p-1 rounded-md bg-purple-100 text-purple-700">
                <BookOpen className="w-4 h-4" />
              </span>
              <span>Pet Care Guide & Doctor's Tips • কক্সবাজার পেট কেয়ার ব্লগ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Veterinary & Daily Pet Care Guides
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              Expert nutritional routines, seasonal coastal care, and veterinary tips from registered veterinarians and feline specialists in Cox's Bazar.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tips, fleas, nutrition..."
              className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const count = cat === 'All' 
              ? BLOG_POSTS.length 
              : BLOG_POSTS.filter(p => p.category === cat).length;

            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-purple-900 text-white shadow-xs'
                    : 'bg-white hover:bg-purple-50 text-slate-600 border border-slate-200'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-purple-800 text-purple-200' : 'bg-slate-100 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Blog Post Grid */}
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No pet care articles found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search terms or switch categories to read other health guides.
            </p>
            <button
              onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map(post => (
              <article 
                key={post.id}
                onClick={() => handleOpenArticle(post)}
                className="bg-white rounded-2xl border border-purple-100/80 overflow-hidden hover:shadow-lg hover:border-purple-300 transition-all duration-300 group flex flex-col cursor-pointer"
              >
                {/* Image & Category Pill */}
                <div className="relative aspect-video w-full overflow-hidden bg-purple-50">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                  <span className="absolute top-3 left-3 bg-purple-950/90 backdrop-blur-xs text-white text-[10px] font-semibold px-2.5 py-1 rounded-md shadow-xs">
                    {post.category}
                  </span>
                  <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
                    <Clock className="w-3 h-3 text-purple-300" />
                    <span>{post.readTime}</span>
                  </span>
                </div>

                {/* Article Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <Calendar className="w-3 h-3 text-purple-600" />
                      <span>{post.date}</span>
                      <span>•</span>
                      <span className="text-slate-600 font-medium truncate">{post.author}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors leading-snug">
                      {post.title}
                    </h3>

                    {post.titleBn && (
                      <p className="text-xs text-purple-900/80 font-medium line-clamp-1">
                        {post.titleBn}
                      </p>
                    )}

                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Tags & Read Action */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map((t, idx) => (
                          <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-bold text-purple-700 group-hover:text-purple-900 flex items-center gap-1">
                        <span>Read Full Guide</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <span className="text-[11px] text-slate-400 group-hover:text-purple-600 transition-colors">
                        Free Care Advice
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ================= FULL ARTICLE READING MODAL ================= */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
          <div 
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto border border-purple-100 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Bar */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                  {selectedPost.category}
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">•</span>
                <span className="text-xs text-slate-500 hidden sm:inline flex items-center gap-1">
                  <Clock className="w-3 h-3 text-purple-600" />
                  {selectedPost.readTime}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShare(selectedPost)}
                  className="p-2 text-slate-500 hover:text-purple-700 hover:bg-purple-50 rounded-full transition-colors relative cursor-pointer"
                  title="Share / Copy Link"
                >
                  <Share2 className="w-4 h-4" />
                  {copiedLink && (
                    <span className="absolute right-0 top-10 bg-purple-950 text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap">
                      Link copied!
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Article Content */}
            <div className="overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
              
              {/* Title & Bengali Translation */}
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                  {selectedPost.title}
                </h1>
                {selectedPost.titleBn && (
                  <p className="text-base sm:text-lg font-bold text-purple-800">
                    {selectedPost.titleBn}
                  </p>
                )}

                {/* Author Badge */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-sm ring-2 ring-purple-200">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{selectedPost.author}</h4>
                    <p className="text-[11px] text-slate-500">{selectedPost.authorRole}</p>
                    <p className="text-[10px] text-slate-400">{selectedPost.date}</p>
                  </div>
                </div>
              </div>

              {/* Cover Image */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-purple-50">
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Key Takeaways Callout Box */}
              {selectedPost.keyTakeaways && selectedPost.keyTakeaways.length > 0 && (
                <div className="p-5 rounded-2xl bg-purple-50/80 border border-purple-200/80 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-900">
                    <Sparkles className="w-4 h-4 text-purple-700" />
                    <span>Quick Summary & Doctor's Takeaways (গুরুত্বপূর্ণ পরামর্শ)</span>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                    {selectedPost.keyTakeaways.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Structured Article Paragraphs */}
              <div className="space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed">
                {selectedPost.content && selectedPost.content.map((sec, idx) => (
                  <div key={idx} className="space-y-2">
                    {sec.heading && (
                      <h3 className="text-lg font-bold text-slate-900 pt-2 border-b border-slate-100 pb-1">
                        {sec.heading}
                      </h3>
                    )}
                    <p className="text-slate-600 leading-relaxed text-sm sm:text-[15px]">
                      {sec.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Tags */}
              {selectedPost.tags && selectedPost.tags.length > 0 && (
                <div className="pt-4 border-t border-slate-100 flex items-center gap-2 flex-wrap">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-500 font-medium">Topic Tags:</span>
                  {selectedPost.tags.map((t, idx) => (
                    <span key={idx} className="text-xs bg-purple-50 text-purple-700 font-medium px-2.5 py-1 rounded-lg">
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* Consult Doctor / Shop Related Action Banner */}
              <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    Have questions about {selectedPost.title.split(':')[0]}?
                  </h4>
                  <p className="text-xs text-purple-200">
                    Get free guidance from our Cox's Bazar store pet consultants.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  {selectedPost.recommendedCategory && (
                    <button
                      onClick={() => handleShopRelated(selectedPost.recommendedCategory)}
                      className="px-4 py-2.5 rounded-xl bg-white text-purple-950 font-bold text-xs hover:bg-purple-50 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-purple-700" />
                      <span>Shop {selectedPost.recommendedCategory}</span>
                    </button>
                  )}

                  <a
                    href={`https://wa.me/${STORE_INFO.whatsappDigits}?text=${encodeURIComponent(`Hello Cox's Bazar Pet Shop! I read your article "${selectedPost.title}" and would like to ask a pet care question.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Doctor</span>
                  </a>
                </div>
              </div>

            </div>

            {/* Modal Bottom Close */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedPost(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                Close Guide
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CUSTOMER TESTIMONIALS */}
      <section className="bg-purple-50/50 rounded-3xl p-6 sm:p-10 border border-purple-100 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-700 bg-purple-100 px-3 py-1 rounded-full inline-block">
            Trusted by Cox's Bazar Pet Parents
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Verified Customer Experiences
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Real feedback from pet owners across Cox's Bazar Sadar, Kolatoli, Sugandha, and nearby neighborhoods.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((review, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-purple-100/90 shadow-xs space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
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
      <section className="rounded-3xl bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg border border-purple-800/40">
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

        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
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
