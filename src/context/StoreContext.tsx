import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Product, 
  Order, 
  InventoryLog, 
  CartItem, 
  OrderStatus, 
  PaymentStatus, 
  AppointmentBooking, 
  ServiceItem,
  ExpenseRecord,
  CustomerDueRecord,
  SupplierRecord,
  UserProfile,
  PetListing
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_INVENTORY_LOGS, 
  INITIAL_APPOINTMENTS, 
  STORE_SERVICES,
  INITIAL_EXPENSES,
  INITIAL_CUSTOMER_DUES,
  INITIAL_SUPPLIERS,
  INITIAL_PET_LISTINGS
} from '../data/initialData';

export interface DailySalesMetric {
  date: string;
  revenue: number;
  orders: number;
}

export type AdminTabType = 'dokan' | 'pos' | 'dues' | 'expenses' | 'inventory' | 'products' | 'suppliers' | 'appointments' | 'sales';

interface StoreContextType {
  products: Product[];
  orders: Order[];
  inventoryLogs: InventoryLog[];
  appointments: AppointmentBooking[];
  services: ServiceItem[];
  petListings: PetListing[];
  cart: CartItem[];
  wishlist: string[]; // product IDs
  activeView: 'store' | 'admin';
  adminTab: AdminTabType;
  selectedProductForDetail: Product | null;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  isOrderTrackOpen: boolean;
  isBookingModalOpen: boolean;
  selectedServiceForBooking: ServiceItem | null;
  salesAnalytics: DailySalesMetric[];

  // Customer Account & Profile
  currentUser: UserProfile;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  loginUser: (profileData: Partial<UserProfile>) => void;
  logoutUser: () => void;
  updateUserProfile: (profileData: Partial<UserProfile>) => void;

  // Grooming Appointment Reminders System
  upcomingGroomingAppointments: AppointmentBooking[];
  isReminderToastOpen: boolean;
  setIsReminderToastOpen: (open: boolean) => void;
  dismissedReminderIds: string[];
  dismissReminder: (appointmentId?: string) => void;
  triggerGroomingReminderCheck: () => void;

  // Admin Protection & Staff Security Gate
  isAdminAuthenticated: boolean;
  isAdminAuthModalOpen: boolean;
  setIsAdminAuthModalOpen: (open: boolean) => void;
  loginAdmin: (passcode: string) => boolean;
  logoutAdmin: () => void;
  openAdminPortal: (tab?: AdminTabType) => void;

  // Dokan Retail Khata State
  expenses: ExpenseRecord[];
  customerDues: CustomerDueRecord[];
  suppliers: SupplierRecord[];
  drawerOpeningCash: number;
  
  // Actions
  setActiveView: (view: 'store' | 'admin') => void;
  setAdminTab: (tab: AdminTabType) => void;
  setSelectedProductForDetail: (product: Product | null) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setIsOrderTrackOpen: (open: boolean) => void;
  setIsBookingModalOpen: (open: boolean) => void;
  setSelectedServiceForBooking: (service: ServiceItem | null) => void;
  openBookingModalForService: (service?: ServiceItem) => void;

  // Dokan Khata Handlers
  addExpense: (expense: Omit<ExpenseRecord, 'id'>) => void;
  deleteExpense: (id: string) => void;
  addCustomerDue: (due: Omit<CustomerDueRecord, 'id' | 'lastUpdated'>) => void;
  recordDuePayment: (id: string, amountPaid: number) => void;
  deleteCustomerDue: (id: string) => void;
  addSupplier: (supplier: Omit<SupplierRecord, 'id'>) => void;
  recordSupplierPayment: (id: string, amount: number) => void;
  setDrawerOpeningCash: (amount: number) => void;
  
  // Cart Actions
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  
  // Wishlist
  toggleWishlist: (productId: string) => void;
  
  // Product Management (Admin)
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Inventory Management (Admin)
  restockProduct: (id: string, amount: number, note?: string) => void;
  
  // Order Management (Admin & Customer)
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'date'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updatePaymentStatus: (orderId: string, status: PaymentStatus) => void;

  // Appointment Bookings
  bookAppointment: (bookingData: Omit<AppointmentBooking, 'id' | 'createdAt' | 'status'>) => AppointmentBooking;
  updateAppointmentStatus: (id: string, status: AppointmentBooking['status']) => void;
  
  // Reset demo data
  resetToDefaults: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('cbz_pet_products_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { console.error(e); }
    }
    return INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('cbz_pet_orders_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { console.error(e); }
    }
    return INITIAL_ORDERS;
  });

  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>(() => {
    const saved = localStorage.getItem('cbz_pet_inventory_logs_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { console.error(e); }
    }
    return INITIAL_INVENTORY_LOGS;
  });

  const [appointments, setAppointments] = useState<AppointmentBooking[]>(() => {
    const saved = localStorage.getItem('cbz_pet_appointments_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { console.error(e); }
    }
    return INITIAL_APPOINTMENTS;
  });

  const services = STORE_SERVICES;

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cbz_pet_cart_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) { console.error(e); }
    }
    return [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('cbz_pet_wishlist_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) { console.error(e); }
    }
    return ['prod-1', 'prod-7'];
  });

  const [activeView, setActiveView] = useState<'store' | 'admin'>('store');
  const [adminTab, setAdminTab] = useState<AdminTabType>('dokan');
  const [pendingAdminTab, setPendingAdminTab] = useState<AdminTabType>('dokan');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('cbz_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);

  const loginAdmin = (passcode: string): boolean => {
    const cleanPin = passcode.trim();
    // Default Owner PIN is 1234 or admin
    if (cleanPin === '1234' || cleanPin.toLowerCase() === 'admin' || cleanPin === 'admin123') {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem('cbz_admin_auth', 'true');
      } catch {}
      setIsAdminAuthModalOpen(false);
      setAdminTab(pendingAdminTab);
      setActiveView('admin');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem('cbz_admin_auth');
    } catch {}
    setActiveView('store');
  };

  const openAdminPortal = (tab?: AdminTabType) => {
    const target = tab || 'dokan';
    setPendingAdminTab(target);
    if (isAdminAuthenticated) {
      setAdminTab(target);
      setActiveView('admin');
    } else {
      setIsAdminAuthModalOpen(true);
    }
  };

  // Keyboard shortcut listener for staff access (Ctrl+Shift+A, Ctrl+Shift+P, Alt+A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isKeyA = e.key.toLowerCase() === 'a';
      const isKeyP = e.key.toLowerCase() === 'p';
      if ((e.altKey && isKeyA) || (e.ctrlKey && e.shiftKey && (isKeyA || isKeyP))) {
        e.preventDefault();
        openAdminPortal(isKeyP ? 'pos' : 'dokan');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminAuthenticated]);

  // URL trigger listener for staff: /?admin, /?pos, /?erp, #admin, #pos
  useEffect(() => {
    const checkUrlForAdmin = () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const hash = (window.location.hash || '').toLowerCase();
        if (params.has('admin') || hash === '#admin') {
          openAdminPortal('dokan');
        } else if (params.has('pos') || hash === '#pos') {
          openAdminPortal('pos');
        } else if (params.has('erp') || hash === '#erp') {
          openAdminPortal('dokan');
        }
      }
    };
    checkUrlForAdmin();
    window.addEventListener('hashchange', checkUrlForAdmin);
    return () => window.removeEventListener('hashchange', checkUrlForAdmin);
  }, [isAdminAuthenticated]);

  // Customer Account & Profile
  const DEFAULT_USER: UserProfile = {
    name: 'Tanvir Ahmed',
    phone: '01854-444344',
    email: 'tanvir.petcare@gmail.com',
    city: "Cox's Bazar Municipality",
    membershipPoints: 450,
    isLoggedIn: true
  };

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('cbz_pet_user_profile_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.isLoggedIn === 'boolean') return parsed;
      } catch (e) { console.error(e); }
    }
    return DEFAULT_USER;
  });

  useEffect(() => {
    try {
      localStorage.setItem('cbz_pet_user_profile_v2', JSON.stringify(currentUser));
    } catch (e) { console.error(e); }
  }, [currentUser]);

  const [dismissedReminderIds, setDismissedReminderIds] = useState<string[]>(() => {
    try {
      const saved = sessionStorage.getItem('cbz_dismissed_apt_reminders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isReminderToastOpen, setIsReminderToastOpen] = useState(false);

  const loginUser = (profileData: Partial<UserProfile>) => {
    setCurrentUser(prev => ({
      ...prev,
      ...profileData,
      isLoggedIn: true
    }));
    setIsReminderToastOpen(true);
  };

  const logoutUser = () => {
    setCurrentUser(prev => ({
      ...prev,
      isLoggedIn: false
    }));
    setIsReminderToastOpen(false);
  };

  const updateUserProfile = (profileData: Partial<UserProfile>) => {
    setCurrentUser(prev => ({
      ...prev,
      ...profileData
    }));
  };

  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderTrackOpen, setIsOrderTrackOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<ServiceItem | null>(null);

  // Dokan Khata States
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    const saved = localStorage.getItem('cbz_pet_expenses_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) { console.error(e); }
    }
    return INITIAL_EXPENSES;
  });

  const [customerDues, setCustomerDues] = useState<CustomerDueRecord[]>(() => {
    const saved = localStorage.getItem('cbz_pet_dues_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) { console.error(e); }
    }
    return INITIAL_CUSTOMER_DUES;
  });

  const [suppliers, setSuppliers] = useState<SupplierRecord[]>(() => {
    const saved = localStorage.getItem('cbz_pet_suppliers_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) { console.error(e); }
    }
    return INITIAL_SUPPLIERS;
  });

  const [drawerOpeningCash, setDrawerOpeningCash] = useState<number>(() => {
    const saved = localStorage.getItem('cbz_pet_opening_cash_v1');
    return saved ? Number(saved) : 5000;
  });

  // Sync Dokan Khata to local storage
  useEffect(() => {
    localStorage.setItem('cbz_pet_expenses_v1', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('cbz_pet_dues_v1', JSON.stringify(customerDues));
  }, [customerDues]);

  useEffect(() => {
    localStorage.setItem('cbz_pet_suppliers_v1', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('cbz_pet_opening_cash_v1', drawerOpeningCash.toString());
  }, [drawerOpeningCash]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('cbz_pet_products_v2', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('cbz_pet_orders_v2', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('cbz_pet_inventory_logs_v2', JSON.stringify(inventoryLogs));
  }, [inventoryLogs]);

  useEffect(() => {
    localStorage.setItem('cbz_pet_appointments_v2', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('cbz_pet_cart_v2', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('cbz_pet_wishlist_v2', JSON.stringify(wishlist));
  }, [wishlist]);

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = Math.min(product.stock, updated[existingIndex].quantity + quantity);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty
        };
        return updated;
      } else {
        const validQuantity = Math.min(product.stock, Math.max(1, quantity));
        return [...prevCart, { product, quantity: validQuantity }];
      }
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.product.id === productId) {
          const clampedQty = Math.min(item.product.stock, quantity);
          return { ...item, quantity: clampedQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist toggle
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Admin: Add Product
  const addProduct = (newProdData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...newProdData,
      id: `prod-${Date.now()}`
    };

    setProducts(prev => [newProduct, ...prev]);

    // Add inventory log for new product
    const log: InventoryLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      productId: newProduct.id,
      productTitle: newProduct.title,
      changeType: 'new_product',
      quantityChange: newProduct.stock,
      resultingStock: newProduct.stock,
      note: 'Initial stock added with product creation'
    };
    setInventoryLogs(prev => [log, ...prev]);
  };

  // Admin: Update Product
  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          // If stock was modified manually, log it
          if (updated.stock !== undefined && updated.stock !== p.stock) {
            const diff = updated.stock - p.stock;
            const log: InventoryLog = {
              id: `log-${Date.now()}`,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
              productId: p.id,
              productTitle: updated.title || p.title,
              changeType: 'adjustment',
              quantityChange: diff,
              resultingStock: updated.stock,
              note: 'Manual stock adjustment in admin dashboard'
            };
            setInventoryLogs(prevLogs => [log, ...prevLogs]);
          }
          return { ...p, ...updated };
        }
        return p;
      })
    );
  };

  // Admin: Delete Product
  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setCart(prev => prev.filter(item => item.product.id !== id));
    setWishlist(prev => prev.filter(wishId => wishId !== id));
  };

  // Admin: Restock Product
  const restockProduct = (id: string, amount: number, note: string = 'Stock replenishment') => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const newStock = p.stock + amount;
          const log: InventoryLog = {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            productId: p.id,
            productTitle: p.title,
            changeType: 'restock',
            quantityChange: amount,
            resultingStock: newStock,
            note: note
          };
          setInventoryLogs(prevLogs => [log, ...prevLogs]);
          return { ...p, stock: newStock };
        }
        return p;
      })
    );
  };

  // Create Order (Fulfillment & Inventory Deduction)
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'date'>): Order => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `CBP-${randomSuffix}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      date: new Date().toISOString()
    };

    // Deduct stock for each ordered item & log it
    setProducts(prevProducts => {
      return prevProducts.map(prod => {
        const orderedItem = orderData.items.find(i => i.productId === prod.id);
        if (orderedItem) {
          const newStock = Math.max(0, prod.stock - orderedItem.quantity);
          const newSold = (prod.soldCount || 0) + orderedItem.quantity;
          
          const log: InventoryLog = {
            id: `log-${Date.now()}-${prod.id}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            productId: prod.id,
            productTitle: prod.title,
            changeType: 'sale',
            quantityChange: -orderedItem.quantity,
            resultingStock: newStock,
            note: `Fulfilled in Order #${orderNumber} (${orderData.customerName})`
          };
          setInventoryLogs(prevLogs => [log, ...prevLogs]);

          return {
            ...prod,
            stock: newStock,
            soldCount: newSold
          };
        }
        return prod;
      });
    });

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          const updatedPaymentStatus = (status === 'Delivered' && o.paymentMethod === 'Cash on Delivery')
            ? 'Paid'
            : o.paymentStatus;
          return { ...o, orderStatus: status, paymentStatus: updatedPaymentStatus };
        }
        return o;
      })
    );
  };

  const updatePaymentStatus = (orderId: string, status: PaymentStatus) => {
    setOrders(prev =>
      prev.map(o => o.id === orderId ? { ...o, paymentStatus: status } : o)
    );
  };

  // Dynamic Sales Analytics for Admin Charts
  const salesAnalytics = useMemo(() => {
    const days: { [key: string]: { revenue: number; orders: number } } = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days[key] = { revenue: 0, orders: 0 };
    }

    orders.forEach(o => {
      const orderDate = (o.date || new Date().toISOString()).slice(0, 10);
      if (days[orderDate]) {
        days[orderDate].revenue += o.total;
        days[orderDate].orders += 1;
      }
    });

    return Object.entries(days).map(([date, val]) => ({
      date,
      revenue: val.revenue > 0 ? val.revenue : Math.floor(2500 + Math.random() * 2000),
      orders: val.orders > 0 ? val.orders : Math.floor(2 + Math.random() * 3)
    }));
  }, [orders]);

  // Grooming Appointments & Notification / Reminder Engine
  const upcomingGroomingAppointments = useMemo(() => {
    if (!currentUser.isLoggedIn) return [];

    const cleanUserPhone = currentUser.phone.replace(/\D/g, '');
    const cleanUserName = currentUser.name.trim().toLowerCase();

    return appointments.filter(apt => {
      // Exclude cancelled or completed appointments
      if (apt.status === 'Cancelled' || apt.status === 'Completed') return false;

      // Phone match (last 6 digits or substring) or name match
      const cleanAptPhone = (apt.ownerPhone || '').replace(/\D/g, '');
      const cleanAptName = (apt.ownerName || '').trim().toLowerCase();
      
      const phoneMatch = cleanUserPhone.length >= 6 && cleanAptPhone.length >= 6 &&
        (cleanUserPhone.endsWith(cleanAptPhone.slice(-6)) || 
         cleanAptPhone.endsWith(cleanUserPhone.slice(-6)) ||
         cleanUserPhone.includes(cleanAptPhone) || 
         cleanAptPhone.includes(cleanUserPhone));
         
      const nameMatch = cleanUserName.length >= 3 && 
        (cleanAptName.includes(cleanUserName) || cleanUserName.includes(cleanAptName));

      if (!phoneMatch && !nameMatch) return false;

      // Grooming / Spa / Bath service match
      const sId = (apt.serviceId || '').toLowerCase();
      const sName = (apt.serviceName || '').toLowerCase();
      const isGrooming = sId.includes('grooming') || sName.includes('grooming') || 
        sName.includes('spa') || sName.includes('bath') || sName.includes('trimming') || 
        sName.includes('haircut') || sId === 'srv-grooming' || sId === 'srv-vet';

      if (!isGrooming) return false;

      // Relative date check: upcoming within 14 days
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const parts = (apt.preferredDate || '').split('-');
      if (parts.length === 3) {
        const aptDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        aptDate.setHours(0, 0, 0, 0);
        const diffTime = aptDate.getTime() - today.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        // Include upcoming appointments (e.g. today, tomorrow, or within next 14 days)
        return diffDays >= -1 && diffDays <= 14;
      }

      return true;
    });
  }, [currentUser, appointments]);

  const dismissReminder = (appointmentId?: string) => {
    if (appointmentId) {
      setDismissedReminderIds(prev => {
        const updated = Array.from(new Set([...prev, appointmentId]));
        try { sessionStorage.setItem('cbz_dismissed_apt_reminders', JSON.stringify(updated)); } catch {}
        return updated;
      });
    } else {
      const allIds = upcomingGroomingAppointments.map(a => a.id);
      setDismissedReminderIds(prev => {
        const updated = Array.from(new Set([...prev, ...allIds]));
        try { sessionStorage.setItem('cbz_dismissed_apt_reminders', JSON.stringify(updated)); } catch {}
        return updated;
      });
    }
    setIsReminderToastOpen(false);
  };

  const triggerGroomingReminderCheck = () => {
    setIsReminderToastOpen(true);
  };

  // Auto trigger reminder toast on session mount / when user logs in if there are active undismissed grooming appointments
  useEffect(() => {
    if (!currentUser.isLoggedIn) {
      setIsReminderToastOpen(false);
      return;
    }

    const activeUndismissed = upcomingGroomingAppointments.filter(
      apt => !dismissedReminderIds.includes(apt.id)
    );

    if (activeUndismissed.length > 0) {
      const timer = setTimeout(() => {
        setIsReminderToastOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [currentUser.isLoggedIn, upcomingGroomingAppointments, dismissedReminderIds]);

  // Appointment Bookings
  const bookAppointment = (bookingData: Omit<AppointmentBooking, 'id' | 'createdAt' | 'status'>): AppointmentBooking => {
    const newBooking: AppointmentBooking = {
      ...bookingData,
      id: `apt-${Date.now()}`,
      status: 'Pending',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setAppointments(prev => [newBooking, ...prev]);

    // Make sure newly booked appointment will notify the user
    setDismissedReminderIds(prev => prev.filter(id => id !== newBooking.id));
    setIsReminderToastOpen(true);

    return newBooking;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentBooking['status']) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const openBookingModalForService = (service?: ServiceItem) => {
    if (service) {
      setSelectedServiceForBooking(service);
    } else {
      setSelectedServiceForBooking(services[0]);
    }
    setIsBookingModalOpen(true);
  };

  // Dokan Retail Handlers
  const addExpense = (newExp: Omit<ExpenseRecord, 'id'>) => {
    const expense: ExpenseRecord = {
      ...newExp,
      id: `exp-${Date.now()}`
    };
    setExpenses(prev => [expense, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const addCustomerDue = (dueData: Omit<CustomerDueRecord, 'id' | 'lastUpdated'>) => {
    const newDue: CustomerDueRecord = {
      ...dueData,
      id: `due-${Date.now()}`,
      lastUpdated: new Date().toISOString().slice(0, 10)
    };
    setCustomerDues(prev => [newDue, ...prev]);
  };

  const recordDuePayment = (id: string, amountPaid: number) => {
    setCustomerDues(prev => prev.map(d => {
      if (d.id === id) {
        const remaining = Math.max(0, d.totalDue - amountPaid);
        return {
          ...d,
          totalDue: remaining,
          lastUpdated: new Date().toISOString().slice(0, 10),
          notes: `${d.notes || ''} [Paid ৳${amountPaid} on ${new Date().toLocaleDateString()}]`
        };
      }
      return d;
    }));
  };

  const deleteCustomerDue = (id: string) => {
    setCustomerDues(prev => prev.filter(d => d.id !== id));
  };

  const addSupplier = (supData: Omit<SupplierRecord, 'id'>) => {
    const newSup: SupplierRecord = {
      ...supData,
      id: `sup-${Date.now()}`
    };
    setSuppliers(prev => [newSup, ...prev]);
  };

  const recordSupplierPayment = (id: string, amount: number) => {
    setSuppliers(prev => prev.map(s => {
      if (s.id === id) {
        const updatedPaid = s.totalPaid + amount;
        const updatedDue = Math.max(0, s.balanceDue - amount);
        return {
          ...s,
          totalPaid: updatedPaid,
          balanceDue: updatedDue
        };
      }
      return s;
    }));
  };

  const resetToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setInventoryLogs(INITIAL_INVENTORY_LOGS);
    setAppointments(INITIAL_APPOINTMENTS);
    setExpenses(INITIAL_EXPENSES);
    setCustomerDues(INITIAL_CUSTOMER_DUES);
    setSuppliers(INITIAL_SUPPLIERS);
    setDrawerOpeningCash(5000);
    setCart([]);
    setWishlist(['prod-1', 'prod-7']);
    localStorage.removeItem('cbz_pet_products_v2');
    localStorage.removeItem('cbz_pet_orders_v2');
    localStorage.removeItem('cbz_pet_inventory_logs_v2');
    localStorage.removeItem('cbz_pet_appointments_v2');
    localStorage.removeItem('cbz_pet_cart_v2');
    localStorage.removeItem('cbz_pet_wishlist_v2');
    localStorage.removeItem('cbz_pet_expenses_v1');
    localStorage.removeItem('cbz_pet_dues_v1');
    localStorage.removeItem('cbz_pet_suppliers_v1');
    localStorage.removeItem('cbz_pet_opening_cash_v1');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        orders,
        inventoryLogs,
        appointments,
        services,
        petListings: INITIAL_PET_LISTINGS,
        cart,
        wishlist,
        activeView,
        adminTab,
        selectedProductForDetail,
        isCartOpen,
        isCheckoutOpen,
        isOrderTrackOpen,
        isBookingModalOpen,
        selectedServiceForBooking,
        currentUser,
        setCurrentUser,
        loginUser,
        logoutUser,
        updateUserProfile,
        upcomingGroomingAppointments,
        isReminderToastOpen,
        setIsReminderToastOpen,
        dismissedReminderIds,
        dismissReminder,
        triggerGroomingReminderCheck,
        setActiveView,
        setAdminTab,
        setSelectedProductForDetail,
        setIsCartOpen,
        setIsCheckoutOpen,
        setIsOrderTrackOpen,
        setIsBookingModalOpen,
        setSelectedServiceForBooking,
        openBookingModalForService,
        salesAnalytics,
        isAdminAuthenticated,
        isAdminAuthModalOpen,
        setIsAdminAuthModalOpen,
        loginAdmin,
        logoutAdmin,
        openAdminPortal,
        expenses,
        customerDues,
        suppliers,
        drawerOpeningCash,
        addExpense,
        deleteExpense,
        addCustomerDue,
        recordDuePayment,
        deleteCustomerDue,
        addSupplier,
        recordSupplierPayment,
        setDrawerOpeningCash,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        addProduct,
        updateProduct,
        deleteProduct,
        restockProduct,
        createOrder,
        updateOrderStatus,
        updatePaymentStatus,
        bookAppointment,
        updateAppointmentStatus,
        resetToDefaults
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
