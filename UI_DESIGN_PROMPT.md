# Food Delivery Platform - Complete UI Design Prompt

## Project Overview
Design a modern, responsive, and user-friendly food delivery platform with four distinct user roles. The platform should feel premium, trustworthy, and easy to use across all devices.

---

## Design Requirements

### Brand Identity
- **Style**: Modern, clean, and minimalist with a touch of warmth
- **Color Palette**: 
  - Primary: Vibrant orange/red (food-related, appetite-stimulating)
  - Secondary: Deep green (fresh, healthy)
  - Accent: Warm yellow/gold (premium feel)
  - Neutrals: White, light gray, dark charcoal
- **Typography**: 
  - Headings: Bold, modern sans-serif (e.g., Inter, Poppins)
  - Body: Clean, readable sans-serif (e.g., Inter, Open Sans)
- **Mood**: Friendly, efficient, trustworthy, appetizing

---

## User Roles & Their Interfaces

### 1. CUSTOMER INTERFACE

#### Landing Page (Unauthenticated)
- **Hero Section**
  - Large hero image/video of delicious food
  - Clear value proposition: "Delicious food delivered to your door in minutes"
  - Prominent CTA buttons: "Order Now" and "Sign Up"
  - Location search bar: "Enter your delivery address"
  
- **Features Section**
  - Icon cards showing: Fast Delivery, Wide Selection, Live Tracking, Secure Payment
  - Each with icon, title, and brief description
  
- **Popular Restaurants Preview**
  - Horizontal scrollable carousel of restaurant cards
  - Each card: Restaurant image, name, rating, cuisine type, delivery time
  
- **How It Works**
  - 3-4 step visual guide: Browse → Order → Track → Enjoy
  - Simple icons and short text
  
- **Mobile App Download**
  - App store badges
  - Phone mockup showing the app
  
- **Footer**
  - Links: About, Help, Terms, Privacy
  - Social media icons
  - Contact information

#### Customer Home (Authenticated)
- **Header/Navigation**
  - Logo (top left)
  - Search bar (center): "Search for restaurants or dishes"
  - Icons: Cart (with badge), Notifications, Profile dropdown
  - Current delivery address with edit option
  
- **Main Content**
  - **Quick Filters**: Cuisine type chips (Italian, Chinese, Mexican, etc.)
  - **Promotional Banner**: Current deals/offers (carousel)
  - **Restaurant Grid**
    - Card design: 
      - Large food image
      - Restaurant logo overlay
      - Name, rating (stars), delivery time, delivery fee
      - Cuisine tags
      - "Free Delivery" or "Discount" badges
    - Hover effect: Slight elevation, quick view button
  
- **Sidebar (Optional)**
  - Active orders status
  - Favorite restaurants
  - Recent orders

#### Restaurant Detail Page
- **Restaurant Header**
  - Cover image
  - Restaurant logo, name, rating, reviews count
  - Cuisine type, price range ($$), delivery time
  - Action buttons: Favorite, Share, Info
  
- **Menu Navigation**
  - Sticky horizontal tabs: Popular, Appetizers, Main Course, Desserts, Drinks
  
- **Menu Items Grid/List**
  - Each item card:
    - Food image (left or top)
    - Name, description
    - Price
    - Dietary icons (vegetarian, vegan, gluten-free, spicy)
    - Add to cart button with quantity selector
  
- **Floating Cart Summary**
  - Bottom sticky bar showing: Items count, Total, "View Cart" button

#### Cart & Checkout
- **Cart Page**
  - List of items with: Image, name, quantity selector, price, remove button
  - Special instructions text area
  - Promo code input
  - Order summary: Subtotal, Delivery fee, Tax, Total
  - "Proceed to Checkout" button
  
- **Checkout Flow**
  - Step indicator: Delivery → Payment → Confirm
  - **Delivery Step**: Address selection/edit, delivery instructions, time preference
  - **Payment Step**: Saved cards, add new card, alternative payment methods
  - **Confirm Step**: Order review, final total, "Place Order" button

#### Order Tracking
- **Live Tracking Interface**
  - Map showing: Restaurant location, driver location, delivery address
  - Animated route line
  - Driver info card: Photo, name, rating, vehicle info
  - Order status timeline: Confirmed → Preparing → On the way → Delivered
  - Estimated arrival time (large, prominent)
  - Contact buttons: Call driver, Call restaurant
  - Order details accordion

#### Order History
- **List View**
  - Each order card: Date, restaurant name, items summary, total, status
  - Filter options: All, Completed, Cancelled
  - Reorder button
  - Rate & Review button (for completed orders)

#### Profile & Settings
- **Profile Section**
  - Profile photo upload
  - Name, email, phone
  - Edit button
  
- **Saved Addresses**
  - List of addresses with: Label (Home, Work), full address
  - Add new, edit, delete options
  - Set default
  
- **Payment Methods**
  - Saved cards (masked numbers)
  - Add new, remove options
  
- **Preferences**
  - Dietary restrictions
  - Favorite cuisines
  - Notification settings
  
- **Order History** (link)
- **Help & Support** (link)
- **Logout** button

---

### 2. RESTAURANT OWNER INTERFACE

#### Restaurant Dashboard
- **Header**
  - Restaurant name and logo
  - Status toggle: Open/Closed
  - Notifications icon
  - Profile dropdown
  
- **Key Metrics Cards**
  - Today's Orders (number with trend)
  - Today's Revenue (amount with trend)
  - Average Rating (stars)
  - Active Orders (number)
  
- **Quick Actions**
  - Large buttons: View Orders, Manage Menu, View Analytics, Settings
  
- **Recent Orders Table**
  - Columns: Order ID, Customer, Items, Total, Status, Time
  - Status badges: New, Preparing, Ready, Completed
  - Action buttons: View details, Update status

#### Order Management
- **Tabs**: New Orders, In Progress, Completed, Cancelled
- **Order Cards** (Kanban style or list)
  - Order number, time received
  - Customer name, delivery address
  - Items list with quantities
  - Special instructions (highlighted)
  - Total amount
  - Status update dropdown
  - Print receipt button
  - Contact customer button
  
- **Filters**: Date range, status, order type (delivery/pickup)
- **Sound/visual notification for new orders**

#### Menu Management
- **Category Sidebar**
  - List of categories with item counts
  - Add category button
  - Drag to reorder
  
- **Menu Items Grid**
  - Each item card:
    - Image
    - Name, description, price
    - Available toggle switch
    - Edit and Delete icons
  - Add new item button (prominent)
  
- **Add/Edit Item Modal**
  - Image upload with preview
  - Name, description (rich text)
  - Price, category dropdown
  - Dietary tags (checkboxes)
  - Preparation time
  - Availability toggle
  - Save/Cancel buttons

#### Analytics & Reports
- **Date Range Selector**
- **Charts**
  - Revenue over time (line chart)
  - Orders by day of week (bar chart)
  - Popular items (horizontal bar chart)
  - Order sources (pie chart: web, mobile app)
  
- **Export Reports** button (PDF, CSV)

#### Restaurant Settings
- **Business Information**
  - Restaurant name, description
  - Logo and cover image upload
  - Cuisine type, price range
  - Contact info
  
- **Operating Hours**
  - Days of week with time pickers
  - Special hours/holidays
  
- **Delivery Settings**
  - Delivery radius
  - Delivery fee
  - Minimum order amount
  - Estimated preparation time
  
- **Notifications**
  - Email, SMS, push notification preferences

---

### 3. DELIVERY DRIVER INTERFACE

#### Driver Dashboard
- **Header**
  - Driver name and photo
  - Online/Offline toggle (prominent)
  - Earnings today (large display)
  - Notifications
  
- **Status Card**
  - Current status: Available, On delivery, Break
  - Today's stats: Deliveries completed, Hours online, Average rating
  
- **Available Deliveries**
  - List of delivery requests
  - Each card:
    - Restaurant name and address
    - Delivery address
    - Distance, estimated time
    - Delivery fee
    - "Accept" button
  - Auto-refresh indicator

#### Active Delivery View
- **Map** (full screen or large section)
  - Pickup location (restaurant)
  - Delivery location (customer)
  - Current driver location
  - Optimized route
  
- **Delivery Details Panel**
  - Order number
  - Customer name, phone (call button)
  - Restaurant name, phone (call button)
  - Pickup address with navigation button
  - Delivery address with navigation button
  - Special instructions
  - Items list (collapsible)
  - Delivery fee
  
- **Status Actions**
  - "Arrived at Restaurant" button
  - "Picked Up Order" button
  - "Arrived at Destination" button
  - "Complete Delivery" button (with photo upload option)
  
- **Navigation Integration**
  - "Open in Maps" button

#### Delivery History
- **List View**
  - Date, customer name, delivery address
  - Distance, time taken
  - Earnings
  - Customer rating
  
- **Filters**: Date range, status
- **Total Earnings Summary**

#### Driver Profile & Earnings
- **Profile Section**
  - Photo, name, phone
  - Vehicle info (type, license plate)
  - Rating and reviews
  
- **Earnings Dashboard**
  - Weekly/monthly earnings chart
  - Breakdown: Delivery fees, tips, bonuses
  - Payout history
  - Bank account info for payouts
  
- **Performance Metrics**
  - Acceptance rate
  - Completion rate
  - Average delivery time
  - Customer ratings

---

### 4. ADMIN INTERFACE

#### Admin Dashboard
- **Header**
  - Platform logo
  - Global search
  - Notifications
  - Admin profile dropdown
  
- **Overview Cards**
  - Total Users (with breakdown: customers, restaurants, drivers)
  - Total Orders (today, this week, this month)
  - Total Revenue (with trend)
  - Active Deliveries
  - Platform Rating
  
- **Charts**
  - Revenue over time (line chart)
  - Orders by status (pie chart)
  - User growth (area chart)
  - Top performing restaurants (bar chart)

#### User Management
- **Tabs**: Customers, Restaurants, Drivers, Admins
- **Table View**
  - Columns: ID, Name, Email, Phone, Status, Joined Date, Actions
  - Search and filter options
  - Bulk actions
  - Export to CSV
  
- **User Detail Modal**
  - Full profile information
  - Activity history
  - Orders/deliveries (depending on role)
  - Status change (active, suspended, banned)
  - Send notification

#### Restaurant Management
- **Restaurant List**
  - Table with: Name, Owner, Cuisine, Rating, Status, Actions
  - Filters: Status (pending, approved, rejected), cuisine type
  
- **Restaurant Detail View**
  - All restaurant information
  - Approval workflow (for new restaurants)
  - Menu review
  - Performance metrics
  - Customer reviews
  - Suspend/activate controls

#### Order Management
- **Order List**
  - All platform orders
  - Filters: Status, date range, restaurant, driver
  - Search by order ID or customer
  
- **Order Detail View**
  - Complete order information
  - Customer, restaurant, driver details
  - Timeline of order status changes
  - Refund/cancel options
  - Communication logs

#### Analytics & Reports
- **Comprehensive Dashboard**
  - Revenue analytics
  - User analytics (acquisition, retention, churn)
  - Order analytics (volume, average order value, peak times)
  - Restaurant performance
  - Driver performance
  - Geographic heatmaps
  
- **Custom Report Builder**
  - Date range selector
  - Metric selector
  - Dimension selector
  - Export options

#### Platform Settings
- **General Settings**
  - Platform name, logo, favicon
  - Contact information
  - Social media links
  
- **Business Settings**
  - Commission rates (restaurant, driver)
  - Delivery fee structure
  - Tax settings
  - Currency settings
  
- **Payment Gateway**
  - Configure payment providers
  - API keys management
  
- **Notifications**
  - Email templates
  - SMS templates
  - Push notification settings
  
- **System Settings**
  - Maintenance mode
  - API rate limits
  - Feature flags

---

## Common UI Components

### Navigation
- **Top Navigation Bar**: Logo, search, user menu, notifications
- **Sidebar** (for dashboards): Collapsible, icon + text, active state highlighting
- **Mobile**: Bottom tab bar or hamburger menu

### Cards
- **Elevation**: Subtle shadow, rounded corners (8-12px)
- **Hover State**: Slight lift, shadow increase
- **Content**: Well-spaced, clear hierarchy

### Buttons
- **Primary**: Solid color, white text, rounded
- **Secondary**: Outlined, colored text
- **Ghost**: Text only, subtle hover background
- **Sizes**: Small, medium, large
- **States**: Default, hover, active, disabled, loading

### Forms
- **Input Fields**: Clear labels, placeholder text, validation states
- **Dropdowns**: Searchable when many options
- **Checkboxes/Radio**: Custom styled, clear labels
- **File Upload**: Drag & drop area with preview
- **Error Messages**: Red text below field, icon
- **Success Messages**: Green text, checkmark icon

### Modals & Dialogs
- **Overlay**: Semi-transparent dark background
- **Modal**: Centered, white background, rounded corners
- **Header**: Title, close button
- **Footer**: Action buttons (right-aligned)

### Tables
- **Header**: Bold, slightly darker background
- **Rows**: Alternating background (zebra striping) or hover highlight
- **Actions**: Icon buttons or dropdown menu
- **Pagination**: Bottom, showing range and total
- **Responsive**: Horizontal scroll or card view on mobile

### Notifications/Toasts
- **Position**: Top-right corner
- **Types**: Success (green), error (red), warning (yellow), info (blue)
- **Auto-dismiss**: 3-5 seconds
- **Close Button**: X icon

### Loading States
- **Skeleton Screens**: For content loading
- **Spinners**: For actions/buttons
- **Progress Bars**: For multi-step processes

### Empty States
- **Illustration**: Simple, friendly graphic
- **Message**: Clear explanation
- **Action**: CTA button to resolve (e.g., "Add your first item")

---

## Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Considerations
- **Touch Targets**: Minimum 44x44px
- **Navigation**: Bottom tab bar or hamburger menu
- **Forms**: Full-width inputs, larger text
- **Tables**: Convert to cards or horizontal scroll
- **Maps**: Full-screen option
- **Gestures**: Swipe for actions (e.g., delete)

---

## Accessibility

- **Color Contrast**: WCAG AA compliant (4.5:1 for text)
- **Keyboard Navigation**: All interactive elements accessible
- **Screen Reader**: Proper ARIA labels and semantic HTML
- **Focus States**: Clear visual indicators
- **Alt Text**: For all images
- **Form Labels**: Associated with inputs

---

## Animations & Micro-interactions

- **Page Transitions**: Smooth fade or slide (200-300ms)
- **Button Clicks**: Subtle scale or ripple effect
- **Loading**: Skeleton screens, spinners
- **Success Actions**: Checkmark animation, confetti (for orders)
- **Hover Effects**: Smooth color/shadow transitions
- **Scroll Animations**: Fade in on scroll (subtle)
- **Live Updates**: Smooth number counting, status changes

---

## Key User Flows to Design

1. **Customer**: Browse → Select Restaurant → Add Items → Checkout → Track Order
2. **Restaurant**: Receive Order → Update Status → Complete Order
3. **Driver**: Accept Delivery → Navigate → Pick Up → Deliver → Complete
4. **Admin**: Monitor Platform → Manage Users → Review Analytics

---

## Design Deliverables Needed

1. **High-Fidelity Mockups** for all pages (desktop & mobile)
2. **Component Library** (buttons, forms, cards, etc.)
3. **Color Palette** with hex codes
4. **Typography Scale** (font sizes, weights, line heights)
5. **Icon Set** (consistent style)
6. **Spacing System** (4px, 8px, 16px, 24px, 32px, etc.)
7. **Interactive Prototype** (clickable flows)
8. **Design System Documentation**

---

## Tools Recommended

- **Figma** (collaborative, component-based)
- **Adobe XD** (prototyping)
- **Sketch** (Mac-based design)

---

## Inspiration & References

- **Uber Eats**: Clean, map-focused
- **DoorDash**: Bold colors, clear CTAs
- **Grubhub**: Restaurant-focused imagery
- **Deliveroo**: Modern, minimalist
- **Swiggy**: Vibrant, playful (Indian market)

---

## Final Notes

- Prioritize **clarity and ease of use** over visual complexity
- Ensure **fast perceived performance** (skeleton screens, optimistic UI)
- Design for **trust** (secure payment indicators, verified badges)
- Make it **appetizing** (high-quality food photography, warm colors)
- Keep **consistency** across all user roles while adapting to their specific needs

---

**This design should make users hungry, drivers efficient, restaurants successful, and admins powerful!** 🍔🚀
