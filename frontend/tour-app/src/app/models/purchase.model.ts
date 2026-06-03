export interface OrderItem {
    id?: number;
    tourId: string;
    tourName: string;
    price: number;
}

export interface ShoppingCart {
    touristId: string;
    totalPrice: number;
    items: OrderItem[];
}

export interface CheckoutResponse {
    touristId: string;
    purchaseDate: Date;
    totalAmountPaid: number;
    numberOfToursPurchased: number;
    message: string;
}