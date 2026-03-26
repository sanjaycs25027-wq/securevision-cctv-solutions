import Map "mo:core/Map";
import Array "mo:core/Array";
import List "mo:core/List";
import Queue "mo:core/Queue";
import Set "mo:core/Set";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import OutCall "http-outcalls/outcall";
import MixinStorage "blob-storage/Mixin";
import Stripe "stripe/stripe";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  module CctvProduct {
    public func compare(a : CctvProduct, b : CctvProduct) : { #less; #equal; #greater } {
      Nat.compare(a.id, b.id);
    };
  };

  module CctvService {
    public func compare(a : CctvService, b : CctvService) : { #less; #equal; #greater } {
      Nat.compare(a.id, b.id);
    };
  };

  module CommunityPost {
    public func compare(a : CommunityPost, b : CommunityPost) : { #less; #equal; #greater } {
      Nat.compare(a.id, b.id);
    };
  };

  module Reply {
    public func compare(a : Reply, b : Reply) : { #less; #equal; #greater } {
      Nat.compare(a.id, b.id);
    };
  };

  module ServiceBooking {
    public func compare(a : ServiceBooking, b : ServiceBooking) : { #less; #equal; #greater } {
      Nat.compare(a.id, b.id);
    };
  };

  type ContactMessage = {
    id : Nat;
    name : Text;
    email : Text;
    phone : Text;
    message : Text;
    createdAt : Int;
    read : Bool;
  };

  public type CctvProduct = {
    id : Nat;
    name : Text;
    category : Text;
    description : Text;
    price : Nat;
    stock : Nat;
    imageUrl : Text;
  };

  type CctvService = {
    id : Nat;
    name : Text;
    category : Text;
    description : Text;
    price : Nat;
    duration : Nat; // in minutes
  };

  type ServiceBooking = {
    id : Nat;
    userId : Principal;
    serviceId : Text;
    customerName : Text;
    phone : Text;
    email : Text;
    address : Text;
    scheduledDate : Int;
    notes : Text;
    status : Text;
  };

  type OrderItem = {
    id : Nat;
    name : Text;
    price : Nat;
    quantity : Nat;
    isService : Bool;
  };

  type Order = {
    id : Nat;
    userId : Principal;
    items : [OrderItem];
    totalPrice : Nat;
    status : Text;
    paymentIntent : Text;
    createdAt : Int;
  };

  public type CartItem = {
    itemId : Text;
    name : Text;
    price : Nat;
    quantity : Nat;
    isService : Bool;
  };

  public type CommunityPost = {
    id : Nat;
    authorName : Text;
    title : Text;
    content : Text;
    createdAt : Int;
    replies : [Reply];
  };

  public type Reply = {
    id : Nat;
    authorName : Text;
    content : Text;
    createdAt : Int;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
    role : Text; // "customer", "premium", "admin"
  };

  var nextProductId = 1;
  var nextServiceId = 1;
  var nextOrderId = 1;
  var nextBookingId = 1;
  var nextMessageId = 1;
  var nextPostId = 1;
  var nextReplyId = 1;

  let products = Map.empty<Nat, CctvProduct>();
  let services = Map.empty<Nat, CctvService>();
  let orders = Map.empty<Nat, Order>();
  let bookings = Map.empty<Nat, ServiceBooking>();
  let messages = Map.empty<Nat, ContactMessage>();
  let carts = Map.empty<Principal, [CartItem]>();
  let communityPosts = Map.empty<Nat, CommunityPost>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var stripeConfig : ?Stripe.StripeConfiguration = null;

  func getProductsInternal() : [CctvProduct] {
    products.values().toArray().sort();
  };

  func getServicesInternal() : [CctvService] {
    services.values().toArray().sort();
  };

  func getContactMessagesInternal() : [ContactMessage] {
    messages.values().toArray();
  };

  func getCommunityPostsInternal() : [CommunityPost] {
    communityPosts.values().toArray().sort();
  };

  func getProductInternal(id : Nat) : CctvProduct {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  func getProductWithCheck(id : Nat, _ : Principal) : CctvProduct {
    getProductInternal(id);
  };

  func getService(id : Nat) : CctvService {
    switch (services.get(id)) {
      case (null) { Runtime.trap("Service not found") };
      case (?service) { service };
    };
  };

  // User Profile Management (required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Public endpoints (guest-allowed)
  public query ({ caller }) func getProducts() : async [CctvProduct] {
    getProductsInternal();
  };

  public query ({ caller }) func getServices() : async [CctvService] {
    getServicesInternal();
  };

  public query ({ caller }) func getCommunityPosts() : async [CommunityPost] {
    getCommunityPostsInternal();
  };

  // Admin-only: View contact messages
  public query ({ caller }) func getContactMessages() : async [ContactMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view contact messages");
    };
    getContactMessagesInternal();
  };

  // Admin-only: Product management
  public shared ({ caller }) func addProduct(product : CctvProduct) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    let updatedProduct = { product with id = nextProductId };
    nextProductId += 1;
    products.add(updatedProduct.id, updatedProduct);
  };

  public shared ({ caller }) func updateProduct(product : CctvProduct) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    ignore getProductInternal(product.id);
    products.add(product.id, product);
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    ignore getProductInternal(id);
    products.remove(id);
  };

  // Admin-only: Service management
  public shared ({ caller }) func addService(service : CctvService) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add services");
    };
    let updatedService = { service with id = nextServiceId };
    nextServiceId += 1;
    services.add(updatedService.id, updatedService);
  };

  public shared ({ caller }) func updateService(service : CctvService) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update services");
    };
    ignore getService(service.id);
    services.add(service.id, service);
  };

  public shared ({ caller }) func deleteService(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete services");
    };
    ignore getService(id);
    services.remove(id);
  };

  // User-only: Cart management
  public shared ({ caller }) func addToCart(item : CartItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage cart");
    };
    let currentCart = switch (carts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart };
    };
    let existingItemIndex = currentCart.findIndex(func(ci) { ci.itemId == item.itemId });
    switch (existingItemIndex) {
      case (?index) {
        let existingItem = currentCart[index];
        let updatedItem = { existingItem with quantity = existingItem.quantity + item.quantity };
        let newCartCurrent = currentCart.filter(func(ci) { ci.itemId != item.itemId });
        let updatedCart = newCartCurrent.concat([updatedItem]);
        carts.add(caller, updatedCart);
      };
      case (null) {
        let updatedCart = currentCart.concat([item]);
        carts.add(caller, updatedCart);
      };
    };
  };

  public shared ({ caller }) func removeFromCart(itemId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage cart");
    };
    switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?cart) {
        let newCart = cart.filter(func(ci) { ci.itemId != itemId });
        carts.add(caller, newCart);
      };
    };
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage cart");
    };
    carts.add(caller, []);
  };

  public query ({ caller }) func getCartItems() : async [CartItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view cart");
    };
    switch (carts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart };
    };
  };

  // User-only: Place order
  public shared ({ caller }) func placeOrder(items : [CartItem], paymentIntent : Text) : async Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };
    if (items.isEmpty()) { Runtime.trap("Cart is empty") };
    let orderItems = items.map(
      func(ci) {
        {
          id = nextOrderId;
          name = ci.name;
          price = ci.price;
          quantity = ci.quantity;
          isService = ci.isService;
        };
      }
    );
    let totalPrice = orderItems.foldLeft(0, func(acc, oi) { acc + oi.price * oi.quantity });
    let order : Order = {
      id = nextOrderId;
      userId = caller;
      items = orderItems;
      totalPrice;
      status = "pending";
      paymentIntent;
      createdAt = Time.now();
    };
    orders.add(nextOrderId, order);
    nextOrderId += 1;
    await clearCart();
    order;
  };

  // User-only: Book service
  public shared ({ caller }) func bookService(booking : ServiceBooking) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can book services");
    };
    let updatedBooking = {
      booking with
      id = nextBookingId;
      userId = caller;
    };
    nextBookingId += 1;
    bookings.add(updatedBooking.id, updatedBooking);
  };

  // Guest-allowed: Submit contact message
  public shared ({ caller }) func addContactMessage(message : ContactMessage) : async () {
    let updatedMessage = {
      message with
      id = nextMessageId;
      createdAt = Time.now();
      read = false;
    };
    nextMessageId += 1;
    messages.add(updatedMessage.id, updatedMessage);
  };

  // Admin-only: Mark message as read
  public shared ({ caller }) func markMessageAsRead(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can mark messages as read");
    };
    let message = switch (messages.get(id)) {
      case (null) { Runtime.trap("Message not found") };
      case (?msg) { msg };
    };
    let updatedMessage = { message with read = true };
    messages.add(id, updatedMessage);
  };

  // User-only: Create community post
  public shared ({ caller }) func createCommunityPost(post : CommunityPost) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create posts");
    };
    let updatedPost = {
      post with
      id = nextPostId;
      createdAt = Time.now();
      replies = [];
    };
    nextPostId += 1;
    communityPosts.add(updatedPost.id, updatedPost);
  };

  // User-only: Add reply to post
  public shared ({ caller }) func addReply(postId : Nat, reply : Reply) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add replies");
    };
    let post = switch (communityPosts.get(postId)) {
      case (null) { Runtime.trap("Post not found") };
      case (?p) { p };
    };
    let updatedReply = {
      reply with
      id = nextReplyId;
      createdAt = Time.now();
    };
    nextReplyId += 1;
    let updatedPost = { post with replies = post.replies.concat([updatedReply]) };
    communityPosts.add(postId, updatedPost);
  };

  // Admin-only: Set Stripe configuration
  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set Stripe config");
    };
    stripeConfig := ?config;
  };

  // User-only: Get Stripe session status
  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check session status");
    };
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe not configured") };
      case (?config) { await Stripe.getSessionStatus(config, sessionId, transform) };
    };
  };

  // User-only: Create checkout session
  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create checkout sessions");
    };
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe not configured") };
      case (?config) { await Stripe.createCheckoutSession(config, caller, items, successUrl, cancelUrl, transform) };
    };
  };

  // Admin-only: Upgrade user to premium
  public shared ({ caller }) func upgradeToPremium(user : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can upgrade users");
    };
    AccessControl.assignRole(accessControlState, caller, user, #user);
  };

  // Admin-only: Get all orders
  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  // User can view own orders, admin can view all
  public query ({ caller }) func getUserOrders(userId : Principal) : async [Order] {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own orders");
    };
    orders.values().toArray().filter(func(o) { o.userId == userId });
  };

  // Admin-only: Get all bookings
  public query ({ caller }) func getAllBookings() : async [ServiceBooking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all bookings");
    };
    bookings.values().toArray().sort();
  };

  // User can view own bookings, admin can view all
  public query ({ caller }) func getUserBookings(userId : Principal) : async [ServiceBooking] {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own bookings");
    };
    bookings.values().toArray().filter(func(b) { b.userId == userId }).sort();
  };

  // Admin-only: Update order status
  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    let order = switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?o) { o };
    };
    let updatedOrder = { order with status };
    orders.add(orderId, updatedOrder);
  };

  // Admin-only: Update booking status
  public shared ({ caller }) func updateBookingStatus(bookingId : Nat, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update booking status");
    };
    let booking = switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?b) { b };
    };
    let updatedBooking = { booking with status };
    bookings.add(bookingId, updatedBooking);
  };

  // New functions
  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };
};
