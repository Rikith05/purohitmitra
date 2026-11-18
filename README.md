# PurohitMitra — Your Trusted Purohit Companion 🪔

A complete web platform connecting devotees with verified Vedic Purohits for authentic rituals, pujas, and spiritual ceremonies at home or temples.

---

## 🌟 Key Highlights

- **Dual-Flow Architecture**:
  - **Public Guest Flow (14 Static Pages)**: Discovery and marketing experience with full horizontal navigation (`Home`, `Pujas`, `Purohits`, `How It Works`, `About Us`) and prominent `Login` / `Sign Up` action triggers.
  - **Logged-In Devotee Flow (26 Customer Module Pages)**: Dedicated personal devotee portal (`Srinivas Somisetti`) featuring a clean header with devotee identity (`📍 Hyderabad`, `🔔 3` unread alerts, profile avatar) and a smooth slide-out `☰ Menu` drawer.
- **Continuous In-Portal Booking**: Devotees can discover rituals, review pandit profiles, book ceremonies, customize samagri kits, and complete checkout without ever losing their logged-in session.
- **High-Definition Authentic Photography**: Razor-sharp ritual photography and verified pandit profiles upscaled with Lanczos sharpening.
- **Interactive Modals & Tools**: Cancellation & refund policies, terms of service, privacy compliance, and verified Purohit partner registration modals.
- **Zero Dependencies**: Lightweight, performant, standards-compliant HTML5, CSS3, and modern Vanilla JavaScript.

---

## 📁 Repository Structure

```text
purohitmitra/
├── index.html                   # Public Landing & Discovery Page
├── pujas.html                   # Public Puja Catalog & Filter Sidebar
├── puja-details.html            # Public Ritual Overview & Package Selection
├── purohits.html                # Public Verified Pandits Directory
├── purohit-details.html         # Public Pandit Bio, Vedic Tradition & Reviews
├── book-puja.html               # Public Booking Flow: Step 1 (Muhurtham & Samagri)
├── choose-purohit.html          # Public Booking Flow: Step 2 (Select Pandit)
├── review-puja-booking.html     # Public Booking Flow: Step 3 (Review & Pricing)
├── book-purohit.html            # Public Pandit Booking: Step 1
├── review-booking.html          # Public Pandit Booking: Step 2
├── payment.html                 # Public Payment Gateway Simulation (UPI / Cards)
├── processing-payment.html      # Public Payment Timer (Redirects to Devotee Portal)
├── how-it-works.html            # Public Devotee Journey & FAQ Guide
├── about.html                   # Public Vedic Heritage, Mission & Leadership
├── css/
│   └── style.css                # Global Design Tokens & Typography
├── js/
│   └── main.js                  # Modals, Policies & Location Selection
├── images/                      # High-Resolution Ritual & Pandit Assets
└── CustomerModule/              # Dedicated Logged-In Devotee Portal
    ├── dashboard.html           # Devotee Home, Stats & Quick Actions
    ├── my-bookings.html         # Upcoming, Completed & Cancelled Bookings
    ├── booking-details.html     # Complete Invoice & Ceremony Muhurtham Details
    ├── payments.html            # Payment History, Receipts & Invoices
    ├── offers.html              # Festive Coupons & Referral Discounts
    ├── favorites.html           # Saved Pujas & Shortlisted Pandits
    ├── notifications.html       # Sacred Alerts, Dispatches & Reminders
    ├── my-profile.html          # Devotee Bio, Gotram & Family Members
    ├── saved-addresses.html     # Puja Locations & Delivery Addresses
    ├── my-reviews.html          # Devotee Feedback & Testimonials
    ├── messages.html            # Direct Messaging with Pandits & Support
    ├── help-support.html        # Devotee Help Center, FAQs & Ticket Creation
    ├── settings.html            # Account, Privacy & Security Preferences
    ├── pujas.html               # In-Portal Logged-in Puja Discovery
    ├── puja-details.html        # In-Portal Ritual Details
    ├── purohits.html            # In-Portal Verified Pandits Directory
    ├── purohit-details.html     # In-Portal Pandit Profile
    ├── book-puja.html           # In-Portal Booking Initiation
    ├── choose-purohit.html      # In-Portal Pandit Selection
    ├── review-puja-booking.html # In-Portal Booking Review
    ├── book-purohit.html        # In-Portal Pandit Booking
    ├── review-booking.html      # In-Portal Pandit Review
    ├── payment.html             # In-Portal Secure Payment Checkout
    ├── processing-payment.html  # In-Portal Processing & Instant Confirmation
    ├── how-it-works.html        # In-Portal User Guide
    ├── about.html               # In-Portal Heritage & Story
    ├── css/
    │   ├── common.css           # Customer Module Layout & Slide-Out Drawer
    │   └── style.css            # Component Styling
    └── js/
        ├── common.js            # Customer Data Schema & Drawer Controls
        ├── dashboard.js         # Dynamic Dashboard Stats & Recommendations
        ├── bookings.js          # Booking Actions & Filters
        ├── payments.js          # Invoices & Transaction Processing
        ├── profile.js           # Profile & Address Management
        ├── other-pages.js       # Dynamic Rendering (Offers, Favorites, Reviews)
        └── main.js              # Portal Modals & Handlers
```

---

## 🚀 Getting Started

No build step or Node.js server required. Clone and open directly in any modern browser:

```bash
# Clone the repository
git clone https://github.com/Rikith05/purohitmitra.git

# Navigate into the project
cd purohitmitra

# Open in browser
# (On Windows)
start index.html

# Or open the Devotee Portal directly
start CustomerModule/dashboard.html
```

---

## 📜 License

Created for PurohitMitra. All rights reserved.
