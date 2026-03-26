# SecureVision CCTV Solutions

## Current State
New project -- no existing code.

## Requested Changes (Diff)

### Add
- Full product catalog: CCTV cameras, DVR/NVR kits, cables, accessories with descriptions, images, pricing
- Service catalog: CCTV installation (home & commercial), automation/smart home, alarm systems, access control, automation door systems (auto door install, keypad/card reader/remote access, maintenance)
- Order system: customers can browse products/services, add to cart, checkout with Stripe payment
- Service booking form: customers can book installation or service appointments
- Premium/Business account tier: role-based, business clients get priority support badge and special pricing view
- Customer contact form: name, email, phone, message -- submissions stored in backend
- Community forum: customers can post messages/questions, others can reply
- User authentication: register, login, manage profile and order history
- Admin dashboard: view orders, contact submissions, manage products/services

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend (Motoko):
   - User profiles with roles (customer, premium, admin)
   - Products: CRUD with category, name, description, price, stock
   - Services: CRUD with category, name, description, price
   - Orders: create order with items, status tracking, Stripe payment integration
   - Service bookings: name, contact, service type, date/time, status
   - Contact messages: store submissions
   - Community posts and replies
2. Frontend:
   - Landing page: hero, featured products, services overview, call to action
   - Products page: grid with filters by category, add to cart
   - Services page: CCTV install, smart home, door automation cards with booking CTA
   - Cart & Checkout: review items, Stripe payment
   - Community page: post list, create post, reply
   - Contact page: contact form
   - Account pages: login, register, profile, order history
   - Premium upgrade page
   - Admin dashboard: orders, bookings, messages
