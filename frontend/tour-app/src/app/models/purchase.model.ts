export interface OrderItem {
    id?: number;
    tourId: number;
    tourName: string;
    price: number;
}

export interface ShoppingCart {
    touristId: number;
    totalPrice: number;
    items: OrderItem[];
}

export interface CheckoutResponse {
    touristId: number;
    purchaseDate: Date;
    totalAmountPaid: number;
    numberOfToursPurchased: number;
    message: string;
}