import tableData from "@/data/tables.json";
import menuData from "@/data/menu.json";
import settingsData from "@/data/settings.json";

// Type definitions for JSON data
export interface TableJSON {
  id: string;
  name: string;
  capacity: number;
  status: "available" | "occupied" | "reserved" | "cleaning" | "maintenance";
  position: {
    x: number;
    y: number;
  };
  zone: string;
  description: string;
  currentOrder?: {
    id: string;
    startTime: string;
    totalAmount: number;
    itemCount: number;
  };
  reservation?: {
    customerName: string;
    phone: string;
    time: string;
    note: string;
  };
}

// Type definitions for runtime data (with Date objects)
export interface Table {
  id: string;
  name: string;
  capacity: number;
  status: "available" | "occupied" | "reserved" | "cleaning" | "maintenance";
  position: {
    x: number;
    y: number;
  };
  zone: string;
  description: string;
  currentOrder?: {
    id: string;
    startTime: Date;
    totalAmount: number;
    itemCount: number;
  };
  reservation?: {
    customerName: string;
    phone: string;
    time: Date;
    note: string;
  };
}

export interface Zone {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface TableStatus {
  value: string;
  label: string;
  color: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string;
  ingredients: string[];
  allergens: string[];
  isAvailable: boolean;
  preparationTime: number;
  isSpicy: boolean;
  isAlcoholic?: boolean;
  servingSize?: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
}

export interface Allergen {
  id: string;
  name: string;
  description: string;
}

export interface Promotion {
  id: string;
  name: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  applicableCategories?: string[];
  applicableProducts?: string[];
  requiredProducts?: string[];
  startTime?: string;
  endTime?: string;
  isActive: boolean;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  isEnabled: boolean;
  requiresChange: boolean;
  accountNumber?: string;
  bankName?: string;
  accountName?: string;
  qrCode?: string;
}

export interface Settings {
  restaurant: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    taxCode: string;
    logo: string;
    description: string;
  };
  business: {
    openTime: string;
    closeTime: string;
    timezone: string;
    currency: string;
    currencySymbol: string;
    language: string;
    dateFormat: string;
    timeFormat: string;
    weekStartsOn: number;
  };
  tax: {
    defaultTaxRate: number;
    vatNumber: string;
    includeTaxInPrice: boolean;
    taxRounding: string;
    serviceCharge: number;
    serviceChargeType: string;
  };
  receipt: {
    header: string;
    footer: string;
    showTaxBreakdown: boolean;
    showServiceCharge: boolean;
    showQRCode: boolean;
    qrCodeType: string;
    printCopies: number;
    paperSize: string;
    autoprint: boolean;
  };
  payment: {
    methods: PaymentMethod[];
    defaultMethod: string;
    allowMultiplePayments: boolean;
    requireCustomerInfo: boolean;
  };
  pos: {
    autoSaveInterval: number;
    defaultQuantity: number;
    maxQuantityPerItem: number;
    allowNegativeInventory: boolean;
    showProductImages: boolean;
    showProductDescription: boolean;
    showPreparationTime: boolean;
    defaultView: string;
    itemsPerPage: number;
    enableBarcode: boolean;
    enableVoiceCommands: boolean;
    soundEffects: boolean;
  };
  [key: string]: any;
}

// Helper function to convert JSON table data to runtime data
const convertTableData = (jsonTable: TableJSON): Table => {
  return {
    ...jsonTable,
    currentOrder: jsonTable.currentOrder
      ? {
          ...jsonTable.currentOrder,
          startTime: new Date(jsonTable.currentOrder.startTime),
        }
      : undefined,
    reservation: jsonTable.reservation
      ? {
          ...jsonTable.reservation,
          time: new Date(jsonTable.reservation.time),
        }
      : undefined,
  };
};

// Data access functions
export const getTablesData = (): {
  tables: Table[];
  zones: Zone[];
  tableStatuses: TableStatus[];
} => {
  const jsonTables = tableData.tables as TableJSON[];
  const convertedTables = jsonTables.map(convertTableData);

  return {
    tables: convertedTables,
    zones: tableData.zones as Zone[],
    tableStatuses: tableData.tableStatuses as TableStatus[],
  };
};

export const getMenuData = (): {
  categories: Category[];
  products: Product[];
  allergens: Allergen[];
  promotions: Promotion[];
} => {
  return {
    categories: menuData.categories as Category[],
    products: menuData.products as Product[],
    allergens: menuData.allergens as Allergen[],
    promotions: menuData.promotions as Promotion[],
  };
};

export const getSettings = (): Settings => {
  return settingsData as Settings;
};

// Helper functions
export const getTableById = (id: string): Table | undefined => {
  const { tables } = getTablesData();
  return tables.find((table) => table.id === id);
};

export const getTablesByZone = (zoneId: string): Table[] => {
  const { tables } = getTablesData();
  return tables.filter((table) => table.zone === zoneId);
};

export const getTablesByStatus = (status: Table["status"]): Table[] => {
  const { tables } = getTablesData();
  return tables.filter((table) => table.status === status);
};

export const getAvailableTables = (): Table[] => {
  return getTablesByStatus("available");
};

export const getOccupiedTables = (): Table[] => {
  return getTablesByStatus("occupied");
};

export const getProductById = (id: string): Product | undefined => {
  const { products } = getMenuData();
  return products.find((product) => product.id === id);
};

export const getProductsByCategory = (categoryId: string): Product[] => {
  const { products } = getMenuData();
  return products.filter((product) => product.categoryId === categoryId);
};

export const getAvailableProducts = (): Product[] => {
  const { products } = getMenuData();
  return products.filter((product) => product.isAvailable);
};

export const getCategoryById = (id: string): Category | undefined => {
  const { categories } = getMenuData();
  return categories.find((category) => category.id === id);
};

export const getActivePromotions = (): Promotion[] => {
  const { promotions } = getMenuData();
  return promotions.filter((promotion) => promotion.isActive);
};

export const getPromotionsForProduct = (productId: string): Promotion[] => {
  const activePromotions = getActivePromotions();
  return activePromotions.filter((promotion) =>
    promotion.applicableProducts?.includes(productId),
  );
};

export const getPromotionsForCategory = (categoryId: string): Promotion[] => {
  const activePromotions = getActivePromotions();
  return activePromotions.filter((promotion) =>
    promotion.applicableCategories?.includes(categoryId),
  );
};

export const getPaymentMethods = (): PaymentMethod[] => {
  const settings = getSettings();
  return settings.payment.methods.filter((method) => method.isEnabled);
};

export const getDefaultPaymentMethod = (): PaymentMethod | undefined => {
  const settings = getSettings();
  const paymentMethods = getPaymentMethods();
  return paymentMethods.find(
    (method) => method.id === settings.payment.defaultMethod,
  );
};

// Formatting utilities
export const formatCurrency = (amount: number): string => {
  const settings = getSettings();
  return `${amount.toLocaleString("vi-VN")}${settings.business.currencySymbol}`;
};

export const formatDateTime = (date: Date): string => {
  const settings = getSettings();
  return date.toLocaleString("vi-VN", {
    timeZone: settings.business.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatTime = (date: Date): string => {
  const settings = getSettings();
  return date.toLocaleString("vi-VN", {
    timeZone: settings.business.timezone,
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDate = (date: Date): string => {
  const settings = getSettings();
  return date.toLocaleDateString("vi-VN", {
    timeZone: settings.business.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

// Business logic helpers
export const calculateTax = (subtotal: number): number => {
  const settings = getSettings();
  return subtotal * (settings.tax.defaultTaxRate / 100);
};

export const calculateServiceCharge = (subtotal: number): number => {
  const settings = getSettings();
  if (settings.tax.serviceChargeType === "percentage") {
    return subtotal * (settings.tax.serviceCharge / 100);
  }
  return settings.tax.serviceCharge;
};

export const calculateTotal = (subtotal: number): number => {
  const tax = calculateTax(subtotal);
  const serviceCharge = calculateServiceCharge(subtotal);
  return subtotal + tax + serviceCharge;
};

export const isRestaurantOpen = (): boolean => {
  const settings = getSettings();
  const now = new Date();
  const currentTime = now.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    currentTime >= settings.business.openTime &&
    currentTime <= settings.business.closeTime
  );
};

export const getBusinessHours = (): {
  openTime: string;
  closeTime: string;
  isOpen: boolean;
} => {
  const settings = getSettings();
  return {
    openTime: settings.business.openTime,
    closeTime: settings.business.closeTime,
    isOpen: isRestaurantOpen(),
  };
};

// Search and filter utilities
export const searchProducts = (query: string): Product[] => {
  const { products } = getMenuData();
  const searchTerm = query.toLowerCase();

  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.ingredients.some((ingredient) =>
        ingredient.toLowerCase().includes(searchTerm),
      ),
  );
};

export const filterProductsByAllergens = (
  excludeAllergens: string[],
): Product[] => {
  const { products } = getMenuData();

  return products.filter(
    (product) =>
      !product.allergens.some((allergen) =>
        excludeAllergens.includes(allergen),
      ),
  );
};

export const getProductsByPreparationTime = (maxMinutes: number): Product[] => {
  const { products } = getMenuData();
  return products.filter((product) => product.preparationTime <= maxMinutes);
};

export const getSpicyProducts = (): Product[] => {
  const { products } = getMenuData();
  return products.filter((product) => product.isSpicy);
};

export const getAlcoholicProducts = (): Product[] => {
  const { products } = getMenuData();
  return products.filter((product) => product.isAlcoholic);
};

export default {
  getTablesData,
  getMenuData,
  getSettings,
  getTableById,
  getTablesByZone,
  getTablesByStatus,
  getAvailableTables,
  getOccupiedTables,
  getProductById,
  getProductsByCategory,
  getAvailableProducts,
  getCategoryById,
  getActivePromotions,
  getPromotionsForProduct,
  getPromotionsForCategory,
  getPaymentMethods,
  getDefaultPaymentMethod,
  formatCurrency,
  formatDateTime,
  formatTime,
  formatDate,
  calculateTax,
  calculateServiceCharge,
  calculateTotal,
  isRestaurantOpen,
  getBusinessHours,
  searchProducts,
  filterProductsByAllergens,
  getProductsByPreparationTime,
  getSpicyProducts,
  getAlcoholicProducts,
};
