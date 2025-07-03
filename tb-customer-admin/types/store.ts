export interface ShopData {
    _id: string;
    domain: string;
    country: string;
    customerEmail: string;
    email: string;
    planDisplayName: string;
    planName: string;
    productCategories: string[];
    shopCreatedAt: string;
    shopId: string;
    storeName: string;
    id: string;
    apps: string[];
    storeCountInSameCountry: number;
    categoryStoreStats: {[categoryName: string]: number };
    orderStatistics?: {
        totalOrders: number;
        averageOrderValue: number;
        orderDateRange: {
            from: string;
            to: string;
        };
        currencyCode: string
    };
    createdAt: string;
    updatedAt: string;
}