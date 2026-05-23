# 📦 ProFast - Parcel Delivery Management System

A scalable and role-based full-stack web application designed to streamline the management of parcel delivery, rider allocation, tracking, and customer administration.

The platform provides a centralized digital ecosystem where users, delivery riders, and administrators can efficiently manage and monitor parcel shipments through a modern, secure, and responsive web interface.

---

## 🌐 Live Links

- **Frontend**: https://ecommerce-ad492.web.app
- **Backend API**: https://backend-one-mauve-16.vercel.app

---

# Project Overview

The **ProFast - Parcel Delivery Management System** was developed to solve the limitations of manual or disjointed parcel booking systems conventionally used in logistics.

Traditional delivery management systems often suffer from:

* Difficult tracking and updates
* Inefficient rider allocation
* Lack of centralized administration
* Poor scalability
* Weak role-based access control
* Insecure or slow payment processing

To overcome these challenges, this system introduces a dynamic and scalable architecture that supports:

* Real-time parcel tracking
* Role-based administration
* Secure Stripe payment integration
* Dynamic rider assignments
* Profile and earnings management for riders
* Administrative dashboard for system governance
* Interactive map-based tracking

The system is designed with modular architecture principles to ensure maintainability, scalability, and future extensibility.

---

# Key Features

## Core Functionalities

* Full Stack MERN-Based Architecture
* Role-Based Access Control (RBAC)
* JWT Authentication via Firebase
* Secure Password Encryption
* Dynamic CRUD Operations
* Real-Time Data Synchronization
* Responsive User Interface
* Parcel Booking & Management
* Delivery Rider Allocation System
* Real-Time Event Tracking & Logging
* Secure Stripe Integration
* Administrative Dashboard
* Scalable Modular Structure
* Optimized Database Operations
* Cloudinary Image Upload Support

---

# User Roles & Permissions

The platform provides three different access levels to ensure secure and structured management of logistic resources.

---

## Customer / User

Users are regular customers looking to book parcels, track them, and make payments.

### User Capabilities

* Register and Login securely
* Create and schedule new parcels
* View parcel history and current statuses
* Process secure payments using Stripe
* Track assigned delivery riders
* Update profile and request to become a rider
* Access coverage and service metrics

---

## Delivery Rider

Riders act as the on-ground delivery personnel managing assigned logistical tasks.

### Rider Capabilities

* Access a personalized Rider Dashboard
* View pending and assigned deliveries
* Update parcel statuses (Picked Up, Delivered, etc.)
* View detailed delivery routes
* Track personal delivery earnings and history
* Oversee completed deliveries
* Request cashouts from administrators

---

## Administrator

Admins have complete authority over the entirety of the system's operational flow and workforce governance.

### Admin Capabilities

### Parcel Operations

* Oversee all system parcels
* Manually assign unallocated parcels to riders based on districts
* Update systemic parcel statuses

### Workforce Management

* Review and approve new Rider requests
* View active riders and track their performance
* Manage platform users and assign roles (Promote to Admin)
* Track and manage rider payouts

### System Governance

* Centralized performance dashboard
* Access aggregate delivery and revenue metrics
* Full System Monitoring & Control

---

# Technology Stack

## Frontend Technologies

| Technology       | Purpose                        |
| ---------------- | ------------------------------ |
| React.js (v19)   | Interactive UI Development     |
| Tailwind CSS     | Responsive Styling             |
| TanStack Query   | Data Fetching & Caching        |
| React-Leaflet    | Map & Geolocation Tracking     |
| Stripe React     | Payment Gateway UI             |

---

## Backend Technologies

| Technology       | Purpose                        |
| ---------------- | ------------------------------ |
| Node.js          | Server-Side Runtime            |
| Express.js       | REST API Development           |
| MongoDB          | NoSQL Database                 |
| Firebase Admin   | Authentication Verification    |
| Stripe Node      | Secure Payment Processing      |

---

## Development Tools

* Visual Studio Code
* Git & GitHub
* Vercel (Deployment)
* Firebase Console
* MongoDB Atlas

---

# System Architecture

The project follows a modern multi-tier architecture for scalability and maintainability.

## Frontend Layer

Handles user interaction, map rendering, API polling, and responsive UI using React.js and Vite.

## Backend Layer

Provides RESTful APIs, Firebase token verification, role-based authorization, and business logic using Node.js and Express.js.

## Database Layer

Stores structured logistic objects, user profiles, financial logs, and tracking states using MongoDB and Mongoose.

---

# Installation Guide

## Prerequisites

Before running the project locally, make sure you have:

* Node.js 18 or later
* npm or yarn
* MongoDB Atlas account or local MongoDB instance
* Firebase project (for Auth)
* Stripe account (for payments)
* Cloudinary account (for imagery)

## Setup Steps

1. Clone the repository.

```bash
git clone https://github.com/Murad134/E_Commerce_Platform.git
cd E_Commerse_Project
```

2. Install backend dependencies.

```bash
cd Backend
npm install
```

3. Install frontend dependencies.

```bash
cd ../Frontend/E-commerce
npm install
```

4. Create the backend environment file.

Create a `.env` file inside the `Backend` folder and add the required values.

```env
PORT=3050
DB_URI=YOUR_MONGODB_URI
STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET
CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET
FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL=YOUR_FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY="YOUR_FIREBASE_PRIVATE_KEY"
```

5. Create the frontend environment file.

Create a `.env.local` file inside `Frontend/E-commerce`.

```env
VITE_backend_url=http://localhost:3050
VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
VITE_STRIPE_PUBLIC_KEY=YOUR_STRIPE_PUBLIC_KEY
```

## How to Run

### Development Mode

Start the backend server.

```bash
cd Backend
npm run dev
```

Start the frontend application.

```bash
cd Frontend/E-commerce
npm run dev
```

Visit:

```text
http://localhost:5173
```

### Production Build

Build the frontend.

```bash
cd Frontend/E-commerce
npm run build
```

---

# Folder Structure

```text
├── Backend/
│   ├── config/
│   │   ├── cloudinary.js
│   │   ├── db.js
│   │   ├── firebase.js
│   │   └── stripe.js
│   ├── controllers/
│   │   ├── parcelController.js
│   │   ├── paymentController.js
│   │   ├── riderController.js
│   │   ├── trackingController.js
│   │   ├── uploadController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── verifyAdmin.js
│   │   ├── verifyFBToken.js
│   │   └── verifyRider.js
│   ├── models/
│   │   ├── parcelModel.js
│   │   ├── paymentModel.js
│   │   ├── riderModel.js
│   │   ├── trackingModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── parcelRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── riderRoutes.js
│   │   ├── trackingRoutes.js
│   │   ├── uploadRoutes.js
│   │   └── userRoutes.js
│   ├── utility/
│   │   └── initModels.js
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── vercel.json
│
├── Frontend/
│   └── E-commerce/
│       ├── public/
│       │   └── districtsData.json
│       ├── src/
│       │   ├── assets/
│       │   ├── Components/
│       │   ├── Contexts/
│       │   ├── Firebase/
│       │   ├── hooks/
│       │   ├── Layouts/
│       │   ├── Pages/
│       │   ├── Router/
│       │   ├── routes/
│       │   ├── App.css
│       │   ├── App.jsx
│       │   ├── index.css
│       │   └── main.jsx
│       ├── eslint.config.js
│       ├── firebase.json
│       ├── index.html
│       ├── package.json
│       ├── README.md
│       └── vite.config.js
│
└── README.md
```

---

# Security Features

* Authentication via Firebase Identity
* Role-Based Authorization Guards (Admin/Rider/User)
* Protected API Routes via verifyFBToken Middleware
* Dynamic Payload Validation for Requests
* Secure Gateway Interfacing (Stripe API)

---

# Real-Time Functionalities

* Dynamic Data Synchronization via TanStack Query
* Live Parcel Tracking visually synced onto Leaflet Maps
* Real-Time Dashboard Analytics (Recharts)
* Automated status transitions based on Rider input

---

# System Modules

The platform is divided into multiple independent and scalable modules to ensure maintainability, flexibility, and efficient governance of logistics.

---

## Authentication Module

Acts as the entry layer for all roles, facilitating account safety.

### Functionalities

* JWT Sign-ins and State persistence
* External Identity integrations (Google Login)
* Token validity checking and Role mapping
* Admin-backed Privilege Escalations

---

## Customer Interactions Module

Enables the end user to handle their needs effectively.

### Functionalities

* Dynamic Parcel Scheduling (District allocation)
* Weight-based price estimators
* Access tracked parcels mapping interfaces
* User Profile image updates

---

## Rider Operations Module

Manages the core delivery workflow directly affecting systemic logistics.

### Functionalities

* Proximity-based parcel distribution viewing
* Delivery status patching logic
* Geo-spatial validation endpoints
* Payment ledger access and Cashout initiation

---

## System Administrator Module

Provides panoramic oversight over the system’s lifecycle.

### Functionalities

* District-specific Rider assignments
* Complete Parcel oversight
* Performance logging and Analytics reporting
* Payout management for delivery personnel

---

## Payment & Gateway Module

Safely arbitrates financial commitments and histories.

### Functionalities

* Intent Generation for checkout procedures
* Transaction history aggregation (User and Rider variants)
* Ledger syncing alongside backend

---

# Database Design & Management

The platform uses MongoDB as the primary operational database via Mongoose ODMs for seamless aggregation logic.

## Database Features

* Scalable NoSQL Document Nodes
* Referential Integrity modeled in Mongoose schemas
* Efficient Tracking aggregations and Geo mapping capabilities
* Secure User Data Management

---

# API & Backend Functionalities

The backend architecture is designed using RESTful architecture.

## Backend Features

* Comprehensive REST routes per system resource
* Express Middleware implementation (Token checking, Upload interceptions)
* Separation of Concerns (Routes -> Controllers -> Services/Models)
* Error Handling & Logging capabilities

---

# Responsive Design

The entire platform interface is carefully crafted entirely within TailwindCSS ensuring high adaptability across resolutions.

## Responsive Features

* Grid/Flex Mobile-First Fallbacks
* Adaptive Dashboard Sidebar and Drawers
* Scalable charts and Map canvases
* Unified Mobile and Desktop workflows

---

# Screenshots

*(Please replace with relevant application screenshots)*

# Authentication  page
# Register page 
<img src="https://i.ibb.co.com/kg1MS36M/Screenshot-2026-05-23-221827.png" alt="Register Page" />

# Login page
<img src="placeholder.png" alt="Send Parcel" />


## Customer Interface
### Send Parcel Page
<img src="placeholder.png" alt="Send Parcel" />

### Tracking Map
<img src="placeholder.png" alt="Parcel Tracking" />

---

## Rider Dashboard
### Assigned Deliveries
<img src="placeholder.png" alt="Assigned Deliveries" />

### Expected Earnings
<img src="placeholder.png" alt="Earning Overview" />

---

## Admin Panel
### Parcel & Fleet Management
<img src="placeholder.png" alt="System Admin Analytics" />

---

# Future Enhancements

The platform is designed to effortlessly facilitate upgrades in logistics technology.

## Planned Improvements

* OTP & SMS Integration (Twilio/Vonage)
* Route-Optimization AI for automatic Rider paths
* International Multi-language support (i18n)
* PWA / Native Mobile Application iteration
* In-app dispute and rating systems

---

# Conclusion

The ProFast Parcel Delivery Management System successfully delivers a centralized, scalable, and secure solution for managing logistics networks and shipment handling.

By integrating modern cloud infrastructure, secure real-time workflows, and a refined interface accessible to varied roles, ProFast empowers all aspects of parcel transportation.

---

