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

export interface InvoiceItem {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

export interface Invoice {
    id: string;
    orderIds: string[]; // Link to one or more Orders
    invoiceNumber: string;
    customerName?: string;
    customerEmail?: string; // Made optional
    customerPhone?: string;
    customerAddress?: string;
    issueDate: string;
    dueDate: string;
    amount: number; // Final amount after discounts
    status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
    items: InvoiceItem[];
    notes?: string;
    paymentMethod?: string; // Phương thức thanh toán
    generatedAt: string;
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

// Formatting utilities
export const formatCurrency = (amount: number): string => {
    return `${amount.toLocaleString("vi-VN")}đ`;
};

export const formatDateTime = (date: Date): string => {
    return date.toLocaleString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const formatTime = (date: Date): string => {
    return date.toLocaleString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const formatDate = (date: Date): string => {
    return date.toLocaleDateString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
};

// Business logic helpers
export const calculateTax = (subtotal: number): number => {
    // This is a simplified version. For a full implementation, fetch settings.
    const defaultTaxRate = 10;
    return subtotal * (defaultTaxRate / 100);
};

export const calculateServiceCharge = (subtotal: number): number => {
    return 0; // Simplified
};

export const calculateTotal = (subtotal: number): number => {
    const tax = calculateTax(subtotal);
    const serviceCharge = calculateServiceCharge(subtotal);
    return subtotal + tax + serviceCharge;
};

export default {};

export interface HistoricOrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export interface Order {
    id: string;
    tableId: string;
    tableName: string;
    guestCount: number;
    items: HistoricOrderItem[];
    startTime: string; // ISO 8601 string
    endTime?: string; // ISO 8601 string, optional until completed
    status: "pending" | "processing" | "completed" | "cancelled";
    subtotal: number;
    tax: number;
    total: number;
    paymentMethod?: string; // Optional until completed
    appliedPromotionId?: string;
    invoiceId?: string; // Link to the Invoice
}

export interface InventoryItem {
    id: string; // Corresponds to Product ID
    sku: string;
    currentStock: number;
    reorderPoint: number;
    unitCost: number;
    lastUpdated: string; // ISO 8601 string
}

export interface Promotion {
    id: string;
    name: string;
    description: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    applicableCustomers: string[]; // Array of phone numbers
}
