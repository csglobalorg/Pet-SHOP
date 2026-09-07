export type AnimalType = 'cat' | 'dog' | 'bird' | 'rabbit' | 'all';

export type ProductCategory = 
  | 'Pet Food'
  | 'Litter & Hygiene'
  | 'Accessories & Toys'
  | 'Grooming Essentials'
  | 'Healthcare & First Aid';

export interface ServiceItem {
  id: string;
  title: string;
  titleBn: string;
  iconName: string;
  description: string;
  descriptionBn: string;
  startingPrice: number;
  duration: string;
  features: string[];
  tag?: string;
  badge?: string;
  category?: 'Care' | 'Travel' | 'Social' | 'Adoption' | 'Health';
  isActive?: boolean;
}

export interface PetListing {
  id: string;
  name: string;
  breed: string;
  animalType: AnimalType;
  age: string;
  gender: 'Male' | 'Female' | 'Pair';
  price: number;
  originalPrice?: number;
  isAdoption?: boolean;
  imageUrl: string;
  vaccinated: boolean;
  dewormed: boolean;
  healthPassport: boolean;
  description: string;
  available: boolean;
  location: string;
  tag?: string;
}

export interface AppointmentBooking {
  id: string;
  serviceId: string;
  serviceName: string;
  ownerName: string;
  ownerPhone: string;
  petName: string;
  petType: AnimalType;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface Product {
  id: string;
  sku: string;
  title: string;
  category: ProductCategory;
  brand: string;
  price: number;
  originalPrice?: number;
  stock: number;
  image: string;
  description: string;
  animalType: AnimalType;
  weightOrSize?: string;
  rating: number;
  reviewCount: number;
  soldCount: number;
  costPrice?: number; // Dokan buying/wholesale price for profit calculation
  expiryDate?: string; // Expiry date for pet food & medicines
  isFlashSale?: boolean;
  isNewlyLaunched?: boolean;
  badgeText?: string;
  featured?: boolean;
  tags?: string[];
}

export interface ExpenseRecord {
  id: string;
  date: string;
  category: 'Shop Rent' | 'Electricity & Bills' | 'Tea & Snacks' | 'Staff Salary' | 'Courier & Transport' | 'Packaging & Bags' | 'Other Expense';
  title: string;
  amount: number;
  paymentSource: 'Drawer Cash' | 'bKash/Bank';
  notes?: string;
}

export interface CustomerDueRecord {
  id: string;
  customerName: string;
  customerPhone: string;
  petName?: string;
  totalDue: number;
  lastUpdated: string;
  notes?: string;
}

export interface SupplierRecord {
  id: string;
  supplierName: string;
  brandOrGoods: string;
  phone: string;
  address: string;
  totalPurchased: number;
  totalPaid: number;
  balanceDue: number; // Mahajon / Vendor due
  lastOrderDate: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentMethod = 'Cash on Delivery' | 'bKash' | 'Nagad' | 'Credit/Debit Card';
export type PaymentStatus = 'Pending' | 'Paid';

export interface OrderItem {
  productId: string;
  sku: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  category: ProductCategory;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string; // ISO string or format YYYY-MM-DD
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  city: string; // e.g. 'Inside Dhaka' | 'Outside Dhaka'
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
}

export interface InventoryLog {
  id: string;
  timestamp: string;
  productId: string;
  productTitle: string;
  changeType: 'sale' | 'restock' | 'adjustment' | 'new_product';
  quantityChange: number;
  resultingStock: number;
  note: string;
}

export interface Coupon {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  minSpend: number;
  description: string;
  isActive?: boolean;
}

export interface StoreSettings {
  name: string;
  brandName: string;
  phone: string;
  whatsapp: string;
  whatsappDigits: string;
  email: string;
  address: string;
  operatingHours: string;
  announcementNotice: string;
  isAnnouncementActive: boolean;
  deliveryFeeInside: number;
  deliveryFeeOutside: number;
  freeDeliveryThreshold: number;
  coupons: Coupon[];
}

export interface UserProfile {
  id?: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  address?: string;
  petName?: string;
  petType?: 'cat' | 'dog' | 'bird' | 'other';
  membershipPoints: number;
  isLoggedIn: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  titleBn?: string;
  date: string;
  category: 'Pet Care Guide' | 'Nutrition Advice' | 'Litter & Hygiene' | 'Veterinary Care' | 'Seasonal Care';
  excerpt: string;
  image: string;
  readTime: string;
  author: string;
  authorRole: string;
  content: {
    heading?: string;
    text: string;
  }[];
  keyTakeaways: string[];
  recommendedCategory?: ProductCategory;
  tags: string[];
}

export interface Testimonial {
  name: string;
  location: string;
  pet: string;
  rating: number;
  date: string;
  comment: string;
  avatar: string;
}
