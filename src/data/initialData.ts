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
  PetListing
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
  aboutBengali: "Cox's Bazar Pet Shop & Care is the premier one-stop destination for pet parents in Cox's Bazar. From world-class nutrition and essentials to caring grooming and hygiene services, we are dedicated to keeping your cats, dogs, and pets healthy, joyful, and thriving.",
  heroHeadline: "All Your Pet Care Solutions in One Place",
  heroSubheadline: "Cox's Bazar's premier pet store & grooming center — authentic international food brands, accessories, hygiene products, and dedicated care."
};

export const STORE_SERVICES: ServiceItem[] = [
  {
    id: 'srv-foster',
    title: 'Pet Foster Care & Boarding',
    titleBn: 'ফস্টার কেয়ার ও বোর্ডিং (Foster Care & Boarding)',
    iconName: 'Home',
    description: 'Safe home-like temporary foster stay, climate-controlled suites, daily video check-ins, routine feeding & playtime in Cox\'s Bazar.',
    descriptionBn: 'ভ্রমণকালে বিশ্বস্ত ফস্টার কেয়ার, এসি রুম, পুষ্টিকর খাবার এবং সার্বক্ষণিক ভিডিও আপডেট।',
    startingPrice: 500,
    duration: 'Daily / Weekly',
    category: 'Care',
    badge: 'Popular',
    features: [
      'Daily Photo & Video WhatsApp Updates',
      'AC & Clean Private Enclosure Suites',
      'Custom Diet & Timely Medication Routine',
      'Dedicated Pet Caregiver & Gentle Playtime'
    ]
  },
  {
    id: 'srv-grooming',
    title: 'Professional Pet Grooming & Spa',
    titleBn: 'প্রফেশনাল গ্রুমিং ও স্পা (Pet Grooming & Spa)',
    iconName: 'Scissors',
    description: 'Complete hygiene bath, breed fur styling, deshedding, nail clipping, sanitary trim, and medicated tick/flea bath.',
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
    description: 'Healthy, active Persian cats, purebred puppies, cockatiel birds & exotic fish. 100% vet-checked, dewormed with vaccination passports.',
    descriptionBn: 'সুস্থ ভ্যাকসিনযুক্ত পার্শিয়ান বিড়াল, কুকুরের ছানা, পাখি ও রঙিন মাছ। হেলথ পাসপোর্ট সহ।',
    startingPrice: 2500,
    duration: 'Instant Handover',
    category: 'Adoption',
    badge: 'Verified Breeds',
    features: [
      'Certified Veterinary Health Passport',
      'First Round Vaccinations & Deworming Done',
      'Parent Lineage & Breed Authenticity Guarantee',
      'Complimentary 7-Day Starter Food Pack'
    ]
  },
  {
    id: 'srv-courier',
    title: 'Pet Courier & Safe Transport',
    titleBn: 'পেট কুরিয়ার ও ট্রান্সপোর্ট (Pet Courier Service)',
    iconName: 'Truck',
    description: 'Stress-free, climate-controlled door-to-door pet courier across Cox\'s Bazar, Chittagong, Dhaka & nationwide with sanitized crates.',
    descriptionBn: 'কক্সবাজার-চট্টগ্রাম-ঢাকা সহ সারাদেশে নিরাপদ এসি যুক্ত পেট ট্রান্সপোর্ট ও লাইভ ট্র্যাকিং।',
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
    description: 'Cox\'s Bazar\'s premier pet-friendly cafe. Enjoy specialty coffee & snacks while your pets play with resident friendly cats & dogs.',
    descriptionBn: 'সমুদ্রপাড়ে পোষা প্রাণীদের সাথে কফি, স্ন্যাকস, কিউট কিটেনদের সাথে খেলার সুযোগ ও মিটআপ।',
    startingPrice: 150,
    duration: 'Open 10 AM - 10 PM',
    category: 'Social',
    badge: 'New & Trendy',
    features: [
      'Beachside Pet Play & Agility Corner',
      'Artisanal Coffee & Dedicated Pet Treats Menu',
      'Meet & Cuddle with Resident Friendly Kittens',
      'Weekend Pet Parent Meetups & Birthday Events'
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

export const INITIAL_PET_LISTINGS: PetListing[] = [
  {
    id: 'pet-1',
    name: 'Snowball',
    breed: 'Doll-Face Persian Kitten',
    animalType: 'cat',
    age: '2.5 Months',
    gender: 'Female',
    price: 14500,
    originalPrice: 16000,
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80',
    vaccinated: true,
    dewormed: true,
    healthPassport: true,
    description: 'Playful and gentle pure white Persian kitten with striking blue eyes, litter-box trained and eating Reflex kitten food.',
    available: true,
    location: 'Cox\'s Bazar Store Display',
    tag: 'Vaccinated & Dewormed'
  },
  {
    id: 'pet-2',
    name: 'Mochi',
    breed: 'Golden British Shorthair',
    animalType: 'cat',
    age: '3 Months',
    gender: 'Male',
    price: 18500,
    originalPrice: 20000,
    imageUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&auto=format&fit=crop&q=80',
    vaccinated: true,
    dewormed: true,
    healthPassport: true,
    description: 'Chubby round cheeks, calm temperament, affectionate British Shorthair kitten. Very social and family friendly.',
    available: true,
    location: 'Cox\'s Bazar Store Display',
    tag: 'Certified Lineage'
  },
  {
    id: 'pet-3',
    name: 'Rocky',
    breed: 'Golden Retriever Pedigree Puppy',
    animalType: 'dog',
    age: '2 Months',
    gender: 'Male',
    price: 24000,
    originalPrice: 26500,
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&auto=format&fit=crop&q=80',
    vaccinated: true,
    dewormed: true,
    healthPassport: true,
    description: 'High energy, exceptionally smart golden retriever puppy with pure breed certificate. Already started basic leash training.',
    available: true,
    location: 'Cox\'s Bazar Partner Kennel',
    tag: 'Purebred Champion'
  },
  {
    id: 'pet-4',
    name: 'Sunny & Mango',
    breed: 'Hand-Tamed Cockatiel Pair',
    animalType: 'bird',
    age: '4.5 Months',
    gender: 'Pair',
    price: 3800,
    originalPrice: 4200,
    imageUrl: 'https://images.unsplash.com/photo-1522858547137-f1dcec554f55?w=600&auto=format&fit=crop&q=80',
    vaccinated: true,
    dewormed: true,
    healthPassport: true,
    description: 'Bright yellow crested whistles, sits on hands and shoulders comfortably. Loves millet treats and singing.',
    available: true,
    location: 'Cox\'s Bazar Store Aviary',
    tag: 'Hand Tamed Pair'
  },
  {
    id: 'pet-5',
    name: 'Bella',
    breed: 'Calico Rescue Kitten (Adoption)',
    animalType: 'cat',
    age: '2 Months',
    gender: 'Female',
    price: 1200,
    isAdoption: true,
    imageUrl: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600&auto=format&fit=crop&q=80',
    vaccinated: true,
    dewormed: true,
    healthPassport: true,
    description: 'Sweet rescued tricolor kitten rehabilitated by Cox\'s Bazar Pet Care foster team. Looking for a warm, forever home.',
    available: true,
    location: 'Foster Care Unit',
    tag: 'Adoption Star'
  },
  {
    id: 'pet-6',
    name: 'Fluffy',
    breed: 'Holland Lop Dwarf Rabbit',
    animalType: 'rabbit',
    age: '2 Months',
    gender: 'Male',
    price: 2200,
    originalPrice: 2500,
    imageUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&auto=format&fit=crop&q=80',
    vaccinated: true,
    dewormed: true,
    healthPassport: true,
    description: 'Adorable floppy ears, docile and calm pet rabbit. Loves hay treats and is safe around gentle children.',
    available: true,
    location: 'Cox\'s Bazar Store Display',
    tag: 'Docile & Cuddly'
  }
];

export const STORE_POLICIES = [
  {
    id: 'pol-delivery',
    title: 'Fast City Delivery',
    titleEn: 'Citywide Fast Delivery',
    description: 'Doorstep delivery across Cox\'s Bazar municipality within 24 to 48 hours; express same-day delivery available for urgent needs.'
  },
  {
    id: 'pol-return',
    title: 'Authentic Food Guarantee & Returns',
    titleEn: 'Hassle-Free Returns',
    description: '100% genuine sealed packs guaranteed. Unopened bags with verified expiration concerns are replaceable within 48 hours.'
  },
  {
    id: 'pol-safety',
    title: 'Ethical Healthcare Standards',
    titleEn: 'Vet Prescription Safety',
    description: 'We do not dispense prescription-restricted veterinary medications without a valid prescription from a registered veterinarian.'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // 1. PET FOOD (Reflex, SmartHeart, Drools, Me-O, Whiskas, Lara)
  {
    id: 'prod-1',
    sku: 'REF-KIT-15KG',
    title: 'Reflex Plus Kitten Food - Chicken Formula 1.5kg',
    category: 'Pet Food',
    brand: 'Reflex Plus',
    price: 980,
    originalPrice: 1100,
    stock: 28,
    image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=600&auto=format&fit=crop&q=80',
    description: 'Complete and balanced dry kitten food containing Xylo-oligosaccharides (XOS) super prebiotics, Omega 3 & 6, and Antarctic krill.',
    animalType: 'cat',
    weightOrSize: '1.5kg',
    rating: 4.9,
    reviewCount: 312,
    soldCount: 8900,
    isFlashSale: true,
    badgeText: 'Bestseller in Cox\'s Bazar',
    featured: true,
    tags: ['dry food', 'kitten', 'reflex', 'chicken']
  },
  {
    id: 'prod-2',
    sku: 'MEO-SEAFOOD-12KG',
    title: 'Me-O Adult Cat Food - Seafood Cocktail Crunch 1.2kg',
    category: 'Pet Food',
    brand: 'Me-O',
    price: 540,
    originalPrice: 600,
    stock: 22,
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80',
    description: 'Delicious seafood crunch enriched with Calcium, Phosphorus, Taurine and Vitamin D for sparkling eyes and strong bones.',
    animalType: 'cat',
    weightOrSize: '1.2kg',
    rating: 4.8,
    reviewCount: 220,
    soldCount: 7100,
    isFlashSale: true,
    badgeText: '10% OFF',
    featured: true,
    tags: ['me-o', 'cat food', 'dry food', 'seafood']
  },
  {
    id: 'prod-3',
    sku: 'WHISK-TUNA-85G',
    title: 'Whiskas Adult Wet Pouch - Tuna in Savory Jelly 85g',
    category: 'Pet Food',
    brand: 'Whiskas',
    price: 85,
    originalPrice: 100,
    stock: 65,
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&auto=format&fit=crop&q=80',
    description: 'Made with selected real tuna fish gently cooked in gravy jelly. Provides 100% complete nutrition with moisture hydration.',
    animalType: 'cat',
    weightOrSize: '85g',
    rating: 4.9,
    reviewCount: 410,
    soldCount: 15400,
    isFlashSale: true,
    badgeText: 'Buy 5 Get Offer',
    featured: true,
    tags: ['whiskas', 'wet food', 'tuna', 'pouch']
  },
  {
    id: 'prod-4',
    sku: 'LARA-ADL-SALM-2KG',
    title: 'Lara Adult Cat Food - Salmon Flavour 2kg (Belgium)',
    category: 'Pet Food',
    brand: 'Lara',
    price: 1350,
    originalPrice: 1500,
    stock: 14,
    image: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=600&auto=format&fit=crop&q=80',
    description: 'Crispy kibbles with delicate salmon taste made in Belgium. Supports urinary tract health and keeps coat soft and glossy.',
    animalType: 'cat',
    weightOrSize: '2kg',
    rating: 4.9,
    reviewCount: 88,
    soldCount: 2100,
    isFlashSale: false,
    badgeText: 'Belgian Quality',
    featured: true,
    tags: ['lara', 'belgium', 'salmon', 'premium']
  },
  {
    id: 'prod-5',
    sku: 'DROOLS-ADL-3KG',
    title: 'Drools Adult Dog Food - Real Chicken & Egg 3kg',
    category: 'Pet Food',
    brand: 'Drools',
    price: 1250,
    originalPrice: 1400,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&auto=format&fit=crop&q=80',
    description: '100% real chicken and egg formula with optimized protein-to-fat ratio. Strengthens dog muscles, joint mobility and active agility.',
    animalType: 'dog',
    weightOrSize: '3kg',
    rating: 4.8,
    reviewCount: 175,
    soldCount: 5400,
    isFlashSale: true,
    badgeText: 'High Protein',
    featured: true,
    tags: ['drools', 'dog food', 'chicken', 'adult']
  },
  {
    id: 'prod-6',
    sku: 'SMART-PUP-3KG',
    title: 'SmartHeart Puppy Food - Beef & Milk Kibble 3kg',
    category: 'Pet Food',
    brand: 'SmartHeart',
    price: 1180,
    originalPrice: 1320,
    stock: 16,
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80',
    description: 'Enriched with DHA from fish oil and choline for brain development. Contains calcium and phosphorus for healthy skeletal growth.',
    animalType: 'dog',
    weightOrSize: '3kg',
    rating: 4.7,
    reviewCount: 130,
    soldCount: 3900,
    isFlashSale: false,
    badgeText: 'Puppy Growth',
    featured: false,
    tags: ['smartheart', 'puppy', 'beef', 'milk']
  },

  // 2. LITTER & HYGIENE (Bentonite, Charcoal, Tray, Scooper, Spray, Pads)
  {
    id: 'prod-7',
    sku: 'LIT-BENT-LAV-5L',
    title: 'Premium Natural Bentonite Clumping Cat Litter - Lavender 5L',
    category: 'Litter & Hygiene',
    brand: 'Sanicat',
    price: 490,
    originalPrice: 550,
    stock: 55,
    image: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=600&auto=format&fit=crop&q=80',
    description: '99.9% dust-free sodium bentonite granules with instant rock-hard clumping and soothing natural lavender odor neutralizer.',
    animalType: 'cat',
    weightOrSize: '5L / 4kg',
    rating: 4.9,
    reviewCount: 360,
    soldCount: 12400,
    isFlashSale: true,
    badgeText: 'Top Clumping',
    featured: true,
    tags: ['bentonite', 'cat litter', 'lavender', 'dust free']
  },
  {
    id: 'prod-8',
    sku: 'LIT-CHAR-SILICA-10L',
    title: 'Activated Charcoal & Silica Odor-Lock Clumping Litter 10L',
    category: 'Litter & Hygiene',
    brand: 'MeowClean',
    price: 920,
    originalPrice: 1050,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&auto=format&fit=crop&q=80',
    description: 'Infused with activated charcoal carbon particles to trap ammonia odors instantly. Perfect for apartments and multiple cats.',
    animalType: 'cat',
    weightOrSize: '10L',
    rating: 4.8,
    reviewCount: 140,
    soldCount: 3200,
    isFlashSale: false,
    badgeText: 'Heavy Duty',
    featured: false,
    tags: ['charcoal', 'silica', 'litter', 'odor lock']
  },
  {
    id: 'prod-9',
    sku: 'TRY-SCP-SET-XL',
    title: 'High-Rim Cat Litter Box Tray with Ergonomic Mesh Scooper',
    category: 'Litter & Hygiene',
    brand: 'PawPlanet',
    price: 680,
    originalPrice: 800,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=600&auto=format&fit=crop&q=80',
    description: 'Durable anti-spill rim prevents litter scattering on floors. Includes heavy-duty ergonomic scooper with hanging hook.',
    animalType: 'cat',
    weightOrSize: 'XL Size (48x38x18cm)',
    rating: 4.8,
    reviewCount: 95,
    soldCount: 1800,
    isFlashSale: false,
    badgeText: 'Anti-Spill',
    featured: false,
    tags: ['tray', 'scooper', 'litter box', 'hygiene']
  },
  {
    id: 'prod-10',
    sku: 'PAD-POTTY-50PCS',
    title: 'Super Absorbent Puppy & Kitten Training Potty Pads (50 Pcs)',
    category: 'Litter & Hygiene',
    brand: 'PetPals',
    price: 780,
    originalPrice: 900,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=80',
    description: '6-layer leak-proof diamond quilting with attractant pheromone. Absorbs up to 4 cups of liquid instantly without floor stains.',
    animalType: 'all',
    weightOrSize: '50 Pieces (60x60cm)',
    rating: 4.7,
    reviewCount: 78,
    soldCount: 1400,
    isFlashSale: false,
    badgeText: '6-Layer Core',
    featured: false,
    tags: ['potty pad', 'training', 'puppy', 'hygiene']
  },

  // 3. ACCESSORIES & TOYS (Collar, Leash, Harness, Bowl, Carrier, Scratching)
  {
    id: 'prod-11',
    sku: 'CAR-ASTRONAUT-CAPS',
    title: 'Panoramic Astronaut Capsule Breathable Pet Travel Backpack',
    category: 'Accessories & Toys',
    brand: 'PetVoyage',
    price: 1850,
    originalPrice: 2200,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&auto=format&fit=crop&q=80',
    description: 'Aerospace-grade transparent bubble sphere with 9 ventilation holes and comfortable chest buckles. Safe travel for cats & toy dogs.',
    animalType: 'cat',
    weightOrSize: 'Fits up to 7kg',
    rating: 4.9,
    reviewCount: 198,
    soldCount: 1950,
    isFlashSale: true,
    badgeText: 'Travel Essential',
    featured: true,
    tags: ['backpack', 'carrier', 'capsule', 'travel']
  },
  {
    id: 'prod-12',
    sku: 'SCR-TREE-CATNIP',
    title: 'Natural Sisal Cat Scratching Post with Hanging Play Pom-Pom',
    category: 'Accessories & Toys',
    brand: 'PawFun',
    price: 850,
    originalPrice: 990,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=600&auto=format&fit=crop&q=80',
    description: 'Wrapped in durable natural sisal rope to protect sofa cushions and curtains. Weighted wooden base prevents tipping over during play.',
    animalType: 'cat',
    weightOrSize: '45cm Height',
    rating: 4.8,
    reviewCount: 112,
    soldCount: 2200,
    isFlashSale: false,
    badgeText: 'Claw Healthy',
    featured: true,
    tags: ['scratching post', 'sisal', 'toy', 'furniture savior']
  },
  {
    id: 'prod-13',
    sku: 'HARN-LEASH-PRO',
    title: 'Reflective Step-In Dog & Cat Harness with 1.5m Leash Set',
    category: 'Accessories & Toys',
    brand: 'WalkPro',
    price: 480,
    originalPrice: 580,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&auto=format&fit=crop&q=80',
    description: 'No-pull breathable air mesh chest vest with 3M reflective safety stitching for evening walks along Cox\'s Bazar sea beach.',
    animalType: 'all',
    weightOrSize: 'Adjustable M / L',
    rating: 4.7,
    reviewCount: 84,
    soldCount: 1650,
    isFlashSale: false,
    badgeText: 'Reflective Safety',
    featured: false,
    tags: ['harness', 'leash', 'collar', 'walking']
  },
  {
    id: 'prod-14',
    sku: 'BWL-STEEL-DOUBLE',
    title: 'Anti-Slip Stainless Steel Double Feeding & Water Bowl Stand',
    category: 'Accessories & Toys',
    brand: 'PureDine',
    price: 390,
    originalPrice: 480,
    stock: 28,
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80',
    description: 'Rust-proof food grade stainless steel bowls sitting in a silicone base that prevents tipping, sliding, and water spillage.',
    animalType: 'all',
    weightOrSize: 'Twin 350ml Bowls',
    rating: 4.8,
    reviewCount: 65,
    soldCount: 940,
    isFlashSale: false,
    badgeText: 'Food Grade',
    featured: false,
    tags: ['feeding bowl', 'stainless steel', 'dining']
  },

  // 4. GROOMING ESSENTIALS (Shampoo, Brush, Clipper, Ear cleaner, Dry bath)
  {
    id: 'prod-15',
    sku: 'SHMP-BIO-FLEA-250ML',
    title: 'Bioline Anti-Tick & Flea Medicated Pet Shampoo 250ml',
    category: 'Grooming Essentials',
    brand: 'Bioline',
    price: 460,
    originalPrice: 530,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&auto=format&fit=crop&q=80',
    description: 'Natural herbal formulation containing margosa extract. Eradicates parasites, soothes itchy bitten skin and leaves a fresh scent.',
    animalType: 'all',
    weightOrSize: '250ml Bottle',
    rating: 4.9,
    reviewCount: 290,
    soldCount: 6800,
    isFlashSale: true,
    badgeText: 'German Formula',
    featured: true,
    tags: ['shampoo', 'anti-tick', 'flea', 'bioline']
  },
  {
    id: 'prod-16',
    sku: 'BRSH-DESHED-AUTO',
    title: 'One-Click Self-Cleaning De-Shedding Fur Undercoat Brush',
    category: 'Grooming Essentials',
    brand: 'GroomEase',
    price: 380,
    originalPrice: 450,
    stock: 32,
    image: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=600&auto=format&fit=crop&q=80',
    description: 'Fine bent wire bristles with rounded massage tips. Push the back button to instantly release trapped loose fur into the bin.',
    animalType: 'all',
    weightOrSize: 'Universal Hand Grip',
    rating: 4.8,
    reviewCount: 155,
    soldCount: 3100,
    isFlashSale: false,
    badgeText: 'Self-Cleaning',
    featured: true,
    tags: ['brush', 'deshedding', 'grooming', 'fur tool']
  },
  {
    id: 'prod-17',
    sku: 'CLIP-NAIL-GUARD',
    title: 'Heavy Duty Pet Nail Clipper with Safety Guard & Emery Filer',
    category: 'Grooming Essentials',
    brand: 'PetCare Pro',
    price: 260,
    originalPrice: 320,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=600&auto=format&fit=crop&q=80',
    description: 'Surgical stainless steel angled blades with quick-stop guard prevents cutting into pet blood vessels. Includes hidden nail file.',
    animalType: 'all',
    weightOrSize: 'Full Set',
    rating: 4.7,
    reviewCount: 92,
    soldCount: 1900,
    isFlashSale: false,
    badgeText: 'Safety Guard',
    featured: false,
    tags: ['nail clipper', 'trimming', 'nail file']
  },
  {
    id: 'prod-18',
    sku: 'FOAM-DRY-BATH',
    title: 'Rinse-Free Waterless Cleansing Dry Bath Foam 200ml',
    category: 'Grooming Essentials',
    brand: 'Bioline',
    price: 490,
    originalPrice: 580,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80',
    description: 'No water needed! Simply pump foam, massage into fur, and towel dry. Ideal for scared cats, cold winter days, or post-surgery hygiene.',
    animalType: 'all',
    weightOrSize: '200ml Foam Pump',
    rating: 4.8,
    reviewCount: 110,
    soldCount: 2200,
    isFlashSale: false,
    badgeText: 'Waterless',
    featured: false,
    tags: ['dry bath', 'foam', 'rinse free', 'cat bath']
  },

  // 5. HEALTHCARE & FIRST AID (OTC Dewormer, Skin spray, Eye drops, Probiotics, Energy paste)
  {
    id: 'prod-19',
    sku: 'GEL-NUTRI-CAL-120G',
    title: 'High-Calorie Nutri-Energy Gel Supplement for Cats & Dogs 120g',
    category: 'Healthcare & First Aid',
    brand: 'GimCat',
    price: 680,
    originalPrice: 780,
    stock: 24,
    image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=600&auto=format&fit=crop&q=80',
    description: 'Palatable malt paste packed with 12 essential vitamins, zinc, and beta-glucan to boost immune resistance and stimulate appetite.',
    animalType: 'all',
    weightOrSize: '120g Tube',
    rating: 4.9,
    reviewCount: 180,
    soldCount: 4200,
    isFlashSale: true,
    badgeText: 'Immune Booster',
    featured: true,
    tags: ['nutri gel', 'vitamins', 'energy paste', 'appetite']
  },
  {
    id: 'prod-20',
    sku: 'SPRY-SKIN-HEAL-100ML',
    title: 'Natural Antiseptic Wound & Hot Spot Skin Healing Spray 100ml',
    category: 'Healthcare & First Aid',
    brand: 'VetaDerm',
    price: 360,
    originalPrice: 420,
    stock: 26,
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&auto=format&fit=crop&q=80',
    description: 'Non-stinging hypochlorous spray relieves itching, hot spots, fungal dermatitis, and minor scratches fast. Safe if licked.',
    animalType: 'all',
    weightOrSize: '100ml Mist Spray',
    rating: 4.8,
    reviewCount: 94,
    soldCount: 1750,
    isFlashSale: false,
    badgeText: 'Wound Care',
    featured: false,
    tags: ['skin spray', 'wound care', 'first aid', 'antiseptic']
  },
  {
    id: 'prod-21',
    sku: 'PROB-DIGEST-PASTE',
    title: 'Vet-Recommended Daily Probiotic Digestive Care Paste 30ml',
    category: 'Healthcare & First Aid',
    brand: 'ProDigest',
    price: 520,
    originalPrice: 600,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=80',
    description: 'Restores healthy intestinal microflora after antibiotic treatment or dietary changes. Stops loose stool and diarrhea in pets.',
    animalType: 'all',
    weightOrSize: '30ml Dial Syringe',
    rating: 4.8,
    reviewCount: 76,
    soldCount: 1300,
    isFlashSale: false,
    badgeText: 'Gut Health',
    featured: false,
    tags: ['probiotic', 'digestion', 'stomach care', 'paste']
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'CBP-2001',
    date: '2026-09-05T11:30:00',
    customerName: 'Md. Arman Chowdhury',
    customerPhone: '01854444344',
    customerEmail: 'arman.cb@gmail.com',
    deliveryAddress: 'Hotel Motel Zone, Kolatoli, Cox\'s Bazar',
    city: 'Cox\'s Bazar Municipality',
    notes: 'Please call before delivery',
    items: [
      {
        productId: 'prod-1',
        sku: 'REF-KIT-15KG',
        title: 'Reflex Plus Kitten Food - Chicken Formula 1.5kg',
        price: 980,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=600&auto=format&fit=crop&q=80',
        category: 'Pet Food'
      },
      {
        productId: 'prod-7',
        sku: 'LIT-BENT-LAV-5L',
        title: 'Premium Natural Bentonite Clumping Cat Litter - Lavender 5L',
        price: 490,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=600&auto=format&fit=crop&q=80',
        category: 'Litter & Hygiene'
      }
    ],
    subtotal: 1960,
    deliveryFee: 60,
    discount: 196,
    couponCode: 'CBZPET10',
    total: 1824,
    paymentMethod: 'bKash',
    paymentStatus: 'Paid',
    orderStatus: 'Processing'
  },
  {
    id: 'ord-102',
    orderNumber: 'CBP-2002',
    date: '2026-09-05T13:45:00',
    customerName: 'Nusrat Jahan Rimi',
    customerPhone: '01712998877',
    customerEmail: 'rimijahan@yahoo.com',
    deliveryAddress: 'Jhawtala Road, Ward 2, Cox\'s Bazar Sadar',
    city: 'Cox\'s Bazar Municipality',
    items: [
      {
        productId: 'prod-3',
        sku: 'WHISK-TUNA-85G',
        title: 'Whiskas Adult Wet Pouch - Tuna in Savory Jelly 85g',
        price: 85,
        quantity: 6,
        image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&auto=format&fit=crop&q=80',
        category: 'Pet Food'
      },
      {
        productId: 'prod-15',
        sku: 'SHMP-BIO-FLEA-250ML',
        title: 'Bioline Anti-Tick & Flea Medicated Pet Shampoo 250ml',
        price: 460,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&auto=format&fit=crop&q=80',
        category: 'Grooming Essentials'
      }
    ],
    subtotal: 970,
    deliveryFee: 60,
    discount: 0,
    total: 1030,
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Pending',
    orderStatus: 'Pending'
  }
];

export const INITIAL_INVENTORY_LOGS: InventoryLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-09-05 13:45',
    productId: 'prod-1',
    productTitle: 'Reflex Plus Kitten Food - Chicken 1.5kg',
    changeType: 'sale',
    quantityChange: -1,
    resultingStock: 28,
    note: 'Fulfilled in Order #CBP-2001'
  },
  {
    id: 'log-2',
    timestamp: '2026-09-05 10:00',
    productId: 'prod-7',
    productTitle: 'Premium Natural Bentonite Clumping Litter 5L',
    changeType: 'restock',
    quantityChange: +40,
    resultingStock: 55,
    note: 'Fresh shipment received at Cox\'s Bazar warehouse'
  }
];

export const INITIAL_APPOINTMENTS: AppointmentBooking[] = [
  {
    id: 'apt-101',
    serviceId: 'srv-grooming',
    serviceName: 'Basic Grooming & Spa',
    ownerName: 'Tanvir Ahmed',
    ownerPhone: '01854444344',
    petName: 'Milo',
    petType: 'cat',
    preferredDate: '2026-09-07',
    preferredTime: '11:00 AM',
    notes: 'Persian cat, needs special care with nail trimming',
    status: 'Confirmed',
    createdAt: '2026-09-05 12:00'
  }
];

export const COUPONS: Coupon[] = [
  {
    code: 'CBZPET10',
    discountPercent: 10,
    minSpend: 500,
    description: '10% OFF on your 1st order at Cox\'s Bazar Pet Shop!'
  },
  {
    code: 'COX50',
    discountAmount: 50,
    minSpend: 600,
    description: '৳50 Flat Discount'
  },
  {
    code: 'FREESHIP',
    discountAmount: 60,
    minSpend: 1200,
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

export const BLOG_POSTS = [
  {
    id: 'blog-1',
    title: 'Coastal Weather Pet Care: Protecting Pets from Humidity and Seasonal Fleas',
    date: 'September 4, 2026',
    category: 'Pet Care Guide',
    excerpt: 'Essential guidelines to safeguard cats and dogs from coastal dampness, fungal skin irritations, and ticks in Cox\'s Bazar.',
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80',
    readTime: '4 min read'
  },
  {
    id: 'blog-2',
    title: 'Balanced Feeding Guide: Dry Food vs Wet Food Proportions',
    date: 'August 30, 2026',
    category: 'Nutrition Advice',
    excerpt: 'How to combine crunchy kibbles with savory hydration pouches according to age, weight, and activity level.',
    image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=600&auto=format&fit=crop&q=80',
    readTime: '5 min read'
  },
  {
    id: 'blog-3',
    title: 'Cat Litter Best Practices: Maximum Hygiene & Odor Neutralization',
    date: 'August 21, 2026',
    category: 'Litter & Hygiene',
    excerpt: 'Simple clumping bentonite and activated charcoal techniques to maintain a fresh, hygienic home environment.',
    image: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=600&auto=format&fit=crop&q=80',
    readTime: '4 min read'
  }
];

export const TESTIMONIALS = [
  {
    name: 'Asif Mahmud',
    location: 'Kolatoli, Cox\'s Bazar',
    pet: 'Persian Cat Parent',
    rating: 5,
    date: '2 days ago',
    comment: 'Having such a professional pet shop in Cox\'s Bazar is a blessing! Ordered Reflex food and litter, and got doorstep delivery in just a few hours.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
  },
  {
    name: 'Tanzila Tasnim',
    location: 'Jhawtola, Cox\'s Bazar Sadar',
    pet: 'Golden Retriever Parent',
    rating: 5,
    date: '1 week ago',
    comment: 'Wonderful grooming and claw trimming session! The staff was gentle and attentive. Drools food packaging was 100% fresh and authentic.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
  },
  {
    name: 'Saiful Islam',
    location: 'Tekpara, Cox\'s Bazar',
    pet: 'Calico Cat Owner',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Easy WhatsApp confirmation and quick bKash payment. Delivered safely with warm customer service!',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80'
  }
];

// Dokan Daily Expenses
export const INITIAL_EXPENSES: ExpenseRecord[] = [
  {
    id: 'exp-1',
    date: new Date().toISOString().slice(0, 10),
    category: 'Tea & Snacks',
    title: 'Staff tea, biscuits and customer hospitality',
    amount: 180,
    paymentSource: 'Drawer Cash',
    notes: 'Afternoon refreshment'
  },
  {
    id: 'exp-2',
    date: new Date().toISOString().slice(0, 10),
    category: 'Courier & Transport',
    title: 'Local doorstep parcel delivery van & transport fare',
    amount: 150,
    paymentSource: 'Drawer Cash',
    notes: '3 home delivery orders in Kolatoli & Jhawtola'
  },
  {
    id: 'exp-3',
    date: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
    category: 'Packaging & Bags',
    title: 'Custom shopping poly bags & parcel packaging roll (200 pcs)',
    amount: 550,
    paymentSource: 'Drawer Cash',
    notes: 'Wholesale purchase from Cox\'s Bazar main market'
  },
  {
    id: 'exp-4',
    date: new Date(Date.now() - 86400000 * 2).toISOString().slice(0, 10),
    category: 'Electricity & Bills',
    title: 'Store electricity bill & high-speed Wi-Fi internet',
    amount: 2200,
    paymentSource: 'bKash/Bank',
    notes: 'Prepaid meter recharge'
  }
];

// Customer Credit / Due Ledger
export const INITIAL_CUSTOMER_DUES: CustomerDueRecord[] = [
  {
    id: 'due-1',
    customerName: 'Kamrul Hasan',
    customerPhone: '01819-458921',
    petName: 'Persian Cat (Lucy)',
    totalDue: 1450,
    lastUpdated: '2026-09-03',
    notes: 'Reflex 1.5kg cat food and bentonite litter taken on credit; promised Friday'
  },
  {
    id: 'due-2',
    customerName: 'Dr. Tanvir Ahmed',
    customerPhone: '01712-389140',
    petName: 'Golden Retriever (Max)',
    totalDue: 2200,
    lastUpdated: '2026-09-02',
    notes: 'Drools 3kg puppy food and anti-tick medicated shampoo'
  },
  {
    id: 'due-3',
    customerName: 'Nusrat Jahan',
    customerPhone: '01680-112233',
    petName: 'Mixed Kitten (Tom)',
    totalDue: 480,
    lastUpdated: '2026-09-04',
    notes: 'SmartHeart kitten pouch and cat grass seeds'
  },
  {
    id: 'due-4',
    customerName: 'Rafiqul Islam',
    customerPhone: '01822-990011',
    petName: 'Local Rescue Cat',
    totalDue: 850,
    lastUpdated: '2026-09-01',
    notes: 'Litter box tray and claw trimmer'
  }
];

// Suppliers & Wholesaler Ledger
export const INITIAL_SUPPLIERS: SupplierRecord[] = [
  {
    id: 'sup-1',
    supplierName: 'Reflex Bangladesh Official (Chittagong Depot)',
    brandOrGoods: 'Reflex Plus Cat & Dog Dry Food',
    phone: '01711-223344',
    address: 'Kadamtali Commercial Area, Chittagong',
    totalPurchased: 85000,
    totalPaid: 65000,
    balanceDue: 20000,
    lastOrderDate: '2026-08-28'
  },
  {
    id: 'sup-2',
    supplierName: 'Drools & SmartHeart Distribution BD',
    brandOrGoods: 'Drools, SmartHeart & Me-O Food',
    phone: '01819-887766',
    address: 'Muradpur, Chittagong',
    totalPurchased: 62000,
    totalPaid: 52000,
    balanceDue: 10000,
    lastOrderDate: '2026-08-30'
  },
  {
    id: 'sup-3',
    supplierName: 'Bengal Pet Hygiene & Accessories Importers',
    brandOrGoods: 'Bentonite Litter, Cages, Leashes & Grooming Tools',
    phone: '01912-334455',
    address: 'Chawkbazar, Dhaka',
    totalPurchased: 45000,
    totalPaid: 45000,
    balanceDue: 0,
    lastOrderDate: '2026-08-25'
  }
];

