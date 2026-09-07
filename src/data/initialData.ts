import { 
  Product, 
  Order, 
  InventoryLog, 
  Coupon, 
  ServiceItem, 
  AppointmentBooking,
  ExpenseRecord,
  CustomerDueRecord,
  SupplierRecord,
  PetListing,
  BlogPost,
  Testimonial
} from '../types';

export const STORE_INFO = {
  name: "Cox's Bazar Pet Shop & Care",
  brandName: "Cox's Bazar Pet Shop & Care",
  tagline: "Your Pet, Our Passion",
  phone: "01854-444344",
  mobile: "01854-444344",
  whatsapp: "+880 1854-444344",
  whatsappDigits: "8801854444344",
  email: "coxsbazarpetshop@gmail.com",
  messenger: "Cox's Bazar Pet Shop & Care",
  facebookUrl: "https://facebook.com",
  address: "Chittagong, Cox's Bazar, Bangladesh, 4700",
  shortLocation: "Cox's Bazar, Chittagong Division, Bangladesh",
  operatingHours: "Daily 10:00 AM – 10:00 PM (Everyday)",
  aboutBengali: "কক্সবাজারের পেট প্যারেন্টদের জন্য কক্সবাজার পেট শপ ও কেয়ার হলো একটি নির্ভরযোগ্য প্রতিষ্ঠান। বিশ্বমানের পুষ্টিকর খাবার, প্রয়োজনীয় এক্সেসরিজ, গ্রুমিং স্পা ও নিরাপদ ফস্টার সার্ভিসের মাধ্যমে আপনার আদরের পোষা প্রাণীর যত্ন নিশ্চিত করাই আমাদের লক্ষ্য।",
  heroHeadline: "আপনার প্রিয় পোষ্যের খাঁটি পুষ্টি ও স্বাস্থ্যকর যত্নে কক্সবাজারের বিশ্বস্ত প্রতিষ্ঠান",
  heroSubheadline: "কক্সবাজার সদরে সরাসরি আমদানিকৃত অথেনটিক পেট ফুড, ক্যাট লিটার, এক্সেসরিজ, প্রফেশনাল গ্রুমিং স্পা এবং ডেডিকেটেড ফস্টার কেয়ার সেবা।",
  developerName: "CGI IT Company",
  developerInfo: "Developed & Maintained by CGI IT Company"
};

export const STORE_SERVICES: ServiceItem[] = [
  {
    id: 'srv-foster',
    title: 'Pet Foster Care & Boarding',
    titleBn: 'ফস্টার কেয়ার ও বোর্ডিং (Foster Care & Boarding)',
    iconName: 'Home',
    description: 'Safe home-like temporary foster stay, clean suites, daily WhatsApp video check-ins, routine feeding & playtime in Cox\'s Bazar.',
    descriptionBn: 'ভ্রমণকালে বিশ্বস্ত ফস্টার কেয়ার, নিরাপদ রুম, পুষ্টিকর খাবার এবং সার্বক্ষণিক ভিডিও আপডেট।',
    startingPrice: 500,
    duration: 'Daily / Weekly',
    category: 'Care',
    badge: 'Popular',
    features: [
      'Daily Photo & Video WhatsApp Updates',
      'Clean Private Enclosure Suites',
      'Custom Diet & Timely Medication Routine',
      'Dedicated Pet Caregiver & Gentle Playtime'
    ]
  },
  {
    id: 'srv-grooming',
    title: 'Professional Pet Grooming & Spa',
    titleBn: 'প্রফেশনাল গ্রুমিং ও স্পা (Pet Grooming & Spa)',
    iconName: 'Scissors',
    description: 'Complete hygiene bath, breed fur styling, deshedding, nail clipping, sanitary trim, and medicated anti-tick bath.',
    descriptionBn: 'নখ কাটা, কান পরিষ্কার, অ্যান্টি-টিক মেডিসিনাল বাথ এবং প্রফেশনাল হেয়ার কাটিং।',
    startingPrice: 450,
    duration: '45-60 mins',
    category: 'Care',
    badge: 'Top Rated',
    features: [
      'Medicated Anti-Tick & Flea Deep Bath',
      'Breed-Specific Coat Trimming & Styling',
      'Painless Nail Clipping & Paw Balm Care',
      'Gentle Ear Cleaning & Fresh Scent Mist'
    ]
  },
  {
    id: 'srv-petsale',
    title: 'Pet Sale & Ethical Adoption',
    titleBn: 'পেট সেল ও ব্রিড অ্যাডপশন (Pet Sale & Adoption)',
    iconName: 'Sparkles',
    description: 'Healthy Persian kittens, puppies, cockatiel birds & aquarium fish with vaccination cards & health passports.',
    descriptionBn: 'সুস্থ ভ্যাকসিনযুক্ত পার্শিয়ান বিড়াল, কুকুরের ছানা, পাখি ও রঙিন মাছ। হেলথ পাসপোর্ট সহ।',
    startingPrice: 2500,
    duration: 'Instant Handover',
    category: 'Adoption',
    badge: 'Verified Breeds',
    features: [
      'Certified Veterinary Health Passport',
      'First Round Vaccinations & Deworming Done',
      'Parent Lineage & Breed Authenticity Guarantee',
      'Complimentary Starter Food Pack'
    ]
  },
  {
    id: 'srv-courier',
    title: 'Pet Courier & Safe Transport',
    titleBn: 'পেট কুরিয়ার ও ট্রান্সপোর্ট (Pet Courier Service)',
    iconName: 'Truck',
    description: 'Safe, stress-free climate-controlled door-to-door pet transport across Cox\'s Bazar, Chittagong, Dhaka & nationwide.',
    descriptionBn: 'কক্সবাজার-চট্টগ্রাম-ঢাকা সহ সারাদেশে নিরাপদ পেট ট্রান্সপোর্ট ও লাইভ ট্র্যাকিং।',
    startingPrice: 800,
    duration: 'Same Day / 24h',
    category: 'Travel',
    badge: 'Safe Transit',
    features: [
      'Air-Conditioned Secured Pet Crate Travel',
      'Live Location & Welfare Video Updates',
      'Trained Handler Supervision on Journey',
      'Doorstep Pickup & Safe Receiver Handover'
    ]
  },
  {
    id: 'srv-petcafe',
    title: 'Beachside Pet Cafe & Lounge',
    titleBn: 'পেট ক্যাফে ও মিটআপ লাউঞ্জ (Pet Cafe & Lounge)',
    iconName: 'Coffee',
    description: 'Cox\'s Bazar\'s premier pet-friendly cafe. Enjoy coffee & snacks while your pets play in dedicated play areas.',
    descriptionBn: 'সমুদ্রপাড়ে পোষা প্রাণীদের সাথে কফি, স্ন্যাকস এবং ফ্রেন্ডলি কিটেনদের সাথে খেলার সুযোগ।',
    startingPrice: 150,
    duration: 'Open 10 AM - 10 PM',
    category: 'Social',
    badge: 'New & Trendy',
    features: [
      'Beachside Pet Play & Agility Corner',
      'Artisanal Coffee & Dedicated Pet Treats Menu',
      'Meet & Cuddle with Friendly Kittens',
      'Weekend Pet Parent Meetups'
    ]
  },
  {
    id: 'srv-vet',
    title: 'Vaccination & Veterinary Liaison',
    titleBn: 'ভেটেরিনারি কেয়ার ও ভ্যাকসিনেশন (Vet & Vaccine)',
    iconName: 'HeartPulse',
    description: 'Routine vaccination scheduling, health checkups, and registered veterinary doctor liaison support in Cox\'s Bazar.',
    descriptionBn: 'রেজিস্টার্ড ভেটেরিনারি সার্জনের সাথে পরামর্শ, ভ্যাকসিনেশন চার্ট ও জরুরি স্বাস্থ্যসেবা।',
    startingPrice: 300,
    duration: 'Schedule Based',
    category: 'Health',
    badge: 'Clinical Care',
    features: [
      'Vaccination Schedule Cards & Reminders',
      'Registered Vet Doctor Consultation Referral',
      'General Health & Weight Assessment',
      'Prescription & Post-Care Guidance'
    ]
  }
];

export const STORE_POLICIES = [
  {
    id: 'pol-delivery',
    title: 'Fast City Delivery',
    titleBn: 'দ্রুত হোম ডেলিভারি',
    description: 'Doorstep delivery across Cox\'s Bazar municipality within 24 to 48 hours; express same-day delivery available for urgent needs.'
  },
  {
    id: 'pol-return',
    title: '100% Authentic Food Guarantee',
    titleBn: '১০০% অরিজিনাল ফুড গ্যারান্টি',
    description: '100% genuine sealed packs guaranteed. Unopened bags with verified expiration concerns are replaceable within 48 hours.'
  },
  {
    id: 'pol-safety',
    title: 'Ethical Healthcare Standards',
    titleBn: 'চিকিৎসা পরামর্শ ও নিরাপত্তা',
    description: 'We do not dispense prescription-restricted veterinary medications without a valid prescription from a registered veterinarian.'
  }
];

// ZERO Demo Data - Production Clean Catalog
export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_PET_LISTINGS: PetListing[] = [];

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_INVENTORY_LOGS: InventoryLog[] = [];

export const INITIAL_APPOINTMENTS: AppointmentBooking[] = [];

export const INITIAL_EXPENSES: ExpenseRecord[] = [];

export const INITIAL_CUSTOMER_DUES: CustomerDueRecord[] = [];

export const INITIAL_SUPPLIERS: SupplierRecord[] = [];

export const BLOG_POSTS: BlogPost[] = [];

export const TESTIMONIALS: Testimonial[] = [];

export const COUPONS: Coupon[] = [
  {
    code: 'CBZPET10',
    discountPercent: 10,
    minSpend: 500,
    description: '10% OFF on your 1st order at Cox\'s Bazar Pet Shop!'
  },
  {
    code: 'FREESHIP',
    discountAmount: 60,
    minSpend: 1500,
    description: 'Free Home Delivery in Cox\'s Bazar Municipality'
  }
];

export const POPULAR_BRANDS = [
  { name: 'Reflex Plus', origin: 'Turkish Premium Nutrition', logoText: 'REFLEX+' },
  { name: 'SmartHeart', origin: 'Canine & Feline Nutrition', logoText: 'SmartHeart' },
  { name: 'Drools', origin: 'Real Meat Superfood', logoText: 'DROOLS' },
  { name: 'Me-O', origin: 'Thailand Premium Formula', logoText: 'Me-O' },
  { name: 'Whiskas', origin: 'Global Cat Care Leader', logoText: 'Whiskas' },
  { name: 'Lara', origin: 'Belgian Quality Recipe', logoText: 'LARA' },
  { name: 'Bioline', origin: 'German Pet Healthcare', logoText: 'BIOLINE' },
  { name: 'Sanicat', origin: 'European Odor-Lock Litter', logoText: 'SANICAT' }
];
