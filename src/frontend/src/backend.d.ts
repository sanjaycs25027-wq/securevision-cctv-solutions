import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Reply {
    id: bigint;
    content: string;
    createdAt: bigint;
    authorName: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface CctvService {
    id: bigint;
    duration: bigint;
    name: string;
    description: string;
    category: string;
    price: bigint;
}
export interface OrderItem {
    id: bigint;
    isService: boolean;
    name: string;
    quantity: bigint;
    price: bigint;
}
export interface ServiceBooking {
    id: bigint;
    customerName: string;
    status: string;
    scheduledDate: bigint;
    userId: Principal;
    email: string;
    address: string;
    notes: string;
    serviceId: string;
    phone: string;
}
export interface Order {
    id: bigint;
    status: string;
    userId: Principal;
    createdAt: bigint;
    paymentIntent: string;
    items: Array<OrderItem>;
    totalPrice: bigint;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface CommunityPost {
    id: bigint;
    title: string;
    content: string;
    createdAt: bigint;
    authorName: string;
    replies: Array<Reply>;
}
export interface ContactMessage {
    id: bigint;
    name: string;
    createdAt: bigint;
    read: boolean;
    email: string;
    message: string;
    phone: string;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface CctvProduct {
    id: bigint;
    name: string;
    description: string;
    stock: bigint;
    imageUrl: string;
    category: string;
    price: bigint;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface CartItem {
    isService: boolean;
    itemId: string;
    name: string;
    quantity: bigint;
    price: bigint;
}
export interface UserProfile {
    name: string;
    role: string;
    email: string;
    phone: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addContactMessage(message: ContactMessage): Promise<void>;
    addProduct(product: CctvProduct): Promise<void>;
    addReply(postId: bigint, reply: Reply): Promise<void>;
    addService(service: CctvService): Promise<void>;
    addToCart(item: CartItem): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bookService(booking: ServiceBooking): Promise<void>;
    clearCart(): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createCommunityPost(post: CommunityPost): Promise<void>;
    deleteProduct(id: bigint): Promise<void>;
    deleteService(id: bigint): Promise<void>;
    getAllBookings(): Promise<Array<ServiceBooking>>;
    getAllOrders(): Promise<Array<Order>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCartItems(): Promise<Array<CartItem>>;
    getCommunityPosts(): Promise<Array<CommunityPost>>;
    getContactMessages(): Promise<Array<ContactMessage>>;
    getProducts(): Promise<Array<CctvProduct>>;
    getServices(): Promise<Array<CctvService>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserBookings(userId: Principal): Promise<Array<ServiceBooking>>;
    getUserOrders(userId: Principal): Promise<Array<Order>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    markMessageAsRead(id: bigint): Promise<void>;
    placeOrder(items: Array<CartItem>, paymentIntent: string): Promise<Order>;
    removeFromCart(itemId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateBookingStatus(bookingId: bigint, status: string): Promise<void>;
    updateOrderStatus(orderId: bigint, status: string): Promise<void>;
    updateProduct(product: CctvProduct): Promise<void>;
    updateService(service: CctvService): Promise<void>;
    upgradeToPremium(user: Principal): Promise<void>;
}
