# 📦 ProFast - Parcel Delivery Management System

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green?style=flat-square)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=flat-square)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square)](https://react.dev/)
[![Express.js](https://img.shields.io/badge/Express.js-5.2-gray?style=flat-square)](https://expressjs.com/)
[![Vite](https://img.shields.io/badge/Vite-7.2-purple?style=flat-square)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-ISC-yellow?style=flat-square)](#license)
[![Deployment](https://img.shields.io/badge/Deployment-Vercel-black?style=flat-square)](https://vercel.com/)

---

## 📌 Project Overview

**ProFast** is a comprehensive **MERN Stack Parcel Delivery Management System** built to revolutionize parcel booking, rider management, and delivery tracking across all 64 districts of Bangladesh. The platform provides seamless integration with payment gateways, real-time tracking, and role-based access control for Users, Riders, and Administrators.

With robust authentication via Firebase, Stripe payment integration, and district-based rider assignment, ProFast ensures efficient delivery operations with transparency and security at its core.

---

## 🌐 Live Demo

- **Frontend:** [https://ecommerce-ad492.web.app/](https://ecommerce-ad492.web.app/)
- **Backend API:** [https://backend-one-mauve-16.vercel.app/](https://backend-one-mauve-16.vercel.app/)

---

## ✨ Key Features

### 👤 User Features
- ✅ Register & Login with email verification
- ✅ Role-based dashboard access
- ✅ Create and manage parcels
- ✅ Secure payment via Stripe (Visa/Card)
- ✅ Track parcel delivery in real-time
- ✅ View parcel history and payment records
- ✅ Request to become a rider
- ✅ Profile management

### 🛵 Rider Features
- ✅ Create parcels and manage shipments
- ✅ Secure payment processing
- ✅ View assigned and pending parcels
- ✅ Update delivery status and track progress
- ✅ View completed deliveries
- ✅ Monitor earnings and payment history
- ✅ District-based parcel assignment

### 👨‍💼 Admin Features
- ✅ Manage all parcels and deliveries
- ✅ Assign riders based on district availability
- ✅ Approve/manage rider requests
- ✅ View active riders and performance metrics
- ✅ Create additional admin accounts
- ✅ Monitor all payments and transactions
- ✅ Comprehensive reporting dashboard

### 🌍 General Features
- ✅ Firebase authentication with email verification
- ✅ Role-based access control (RBAC)
- ✅ District coverage mapping (64 districts of Bangladesh)
- ✅ Real-time parcel tracking with Leaflet maps
- ✅ Responsive design for mobile and desktop
- ✅ Image upload and management via Cloudinary
- ✅ Protected API routes with token verification

---

## 🛠️ Tech Stack

### Frontend Stack
| Technology | Purpose |
|--|--|
| **React.js** v19.2 | UI Library |
| **Vite** v7.2 | Build Tool & Dev Server |
| **Tailwind CSS** v4.1 | Styling & Responsive Design |
| **React Router** v7.11 | Client-side Routing |
| **Axios** v1.13 | HTTP Client |
| **React Hook Form** v7.69 | Form Management |
| **TanStack React Query** v5.90 | Data Fetching & Caching |
| **Recharts** v3.7 | Charts & Analytics |
| **Leaflet/React-Leaflet** v5.0 | Maps & Geolocation |
| **Stripe React** v5.6 | Payment Processing |
| **Firebase** v12.7 | Authentication & Hosting |

### Backend Stack
| Technology | Purpose |
|--|--|
| **Node.js** | Runtime Environment |
| **Express.js** v5.2 | Web Framework |
| **MongoDB** v7.0 | NoSQL Database |
| **Mongoose** v9.1 | ODM for MongoDB |
| **Firebase Admin** v13.6 | Authentication Verification |
| **Stripe** v20.3 | Payment Gateway |
| **Cloudinary** v1.41 | Image Upload & Storage |
| **Multer** v2.0 | File Handling |
| **CORS** v2.8 | Cross-Origin Requests |
| **dotenv** v17.2 | Environment Variables |

---

## 📥 Installation Steps

### Prerequisites
Ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local or Atlas cloud instance)
- **Git** for version control

### 1. Clone the Repository
```bash
git clone https://github.com/Murad134/E_Commerce_Platform.git
cd Web_Project
```

### 2. Backend Setup

#### Navigate to Backend Directory
```bash
cd Backend
```

#### Install Dependencies
```bash
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `Backend` directory:
```env
PORT=3050
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
STRIPE_SECRET_KEY=your_stripe_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=development
```

#### Start Backend Server
```bash
npm run dev          # Development mode with nodemon
# or
npm start            # Production mode
```

Backend will run on: `http://localhost:3050`

### 3. Frontend Setup

#### Navigate to Frontend Directory
```bash
cd Frontend/E-commerce
```

#### Install Dependencies
```bash
npm install
```

#### Start Frontend Development Server
```bash
npm run dev
```

Frontend will run on: `http://localhost:5173`

---

##  Running the Application

### Development Environment

#### Terminal 1 - Backend
```bash
cd Backend
npm run dev
```

#### Terminal 2 - Frontend
```bash
cd Frontend/E-commerce
npm run dev
```

Then open your browser and navigate to: `http://localhost:5173`

### Production Build

#### Build Frontend
```bash
cd Frontend/E-commerce
npm run build
```

#### Deploy Backend
Deploy to Vercel or your preferred hosting:
```bash
# Using Vercel CLI
vercel deploy
```

---

## 📡 API Overview

### Base URL
- **Development:** `http://localhost:3050`
- **Production:** `https://backend-one-mauve-16.vercel.app`

### Authentication Endpoints

#### `/users` - User Management
| Method | Endpoint | Description | Auth |
|--|--|--|--|
| `POST` | `/users` | Create or update user | ❌ |
| `GET` | `/users/check` | Check if user exists | ❌ |
| `GET` | `/users/role` | Get user role | ❌ |
| `GET` | `/users/search` | Search users | ✅ Admin |
| `PATCH` | `/users/:id/role` | Change user role | ✅ Admin |

### Parcel Endpoints

#### `/parcels` - Parcel Management
| Method | Endpoint | Description | Auth |
|--|--|--|--|
| `POST` | `/parcels` | Create new parcel | ✅ User |
| `GET` | `/parcels` | Fetch parcels (with filters) | ✅ User |
| `GET` | `/parcels/:id` | Get parcel by ID | ✅ User |
| `PATCH` | `/parcels/:id` | Update parcel | ✅ User |
| `DELETE` | `/parcels/:id` | Delete parcel | ✅ User |
| `PATCH` | `/parcels/:id/assign` | Assign rider to parcel | ✅ Admin |
| `PATCH` | `/parcels/:id/status` | Update delivery status | ✅ Rider |
| `PATCH` | `/parcels/:id/cashout` | Process cashout | ✅ Rider |
| `GET` | `/parcels/delivery/status-count` | Get status statistics | ✅ User |

### Rider Endpoints

#### `/rider` - Rider Management
| Method | Endpoint | Description | Auth |
|--|--|--|--|
| `POST` | `/rider` | Create/request rider profile | ✅ User |
| `GET` | `/rider` | Get all riders | ✅ Admin |
| `GET` | `/rider/:id` | Get rider by ID | ✅ User |
| `PATCH` | `/rider/:id` | Update rider profile | ✅ Rider |

### Payment Endpoints

#### `/payments` - Payment Processing
| Method | Endpoint | Description | Auth |
|--|--|--|--|
| `POST` | `/payments` | Create payment intent | ✅ User |
| `GET` | `/payments` | Get payment history | ✅ User |
| `GET` | `/payments/:id` | Get payment by ID | ✅ User |

### Tracking Endpoints

#### `/tracking` - Parcel Tracking
| Method | Endpoint | Description | Auth |
|--|--|--|--|
| `POST` | `/tracking` | Log tracking event | ✅ Rider |
| `GET` | `/tracking/:parcelId` | Get tracking history | ✅ User |

### Upload Endpoints

#### `/api` - File Upload
| Method | Endpoint | Description | Auth |
|--|--|--|--|
| `POST` | `/api/upload` | Upload image to Cloudinary | ✅ User |

---

## 📁 Folder Structure

```
Web_Project/
│
├── Backend/
│   ├── config/
│   │   ├── db.js                    # MongoDB connection
│   │   ├── firebase.js              # Firebase configuration
│   │   ├── cloudinary.js            # Cloudinary setup
│   │   └── stripe.js                # Stripe configuration
│   │
│   ├── controllers/
│   │   ├── userController.js        # User logic (register, role)
│   │   ├── parcelController.js      # Parcel CRUD & management
│   │   ├── riderController.js       # Rider profile management
│   │   ├── paymentController.js     # Payment processing
│   │   ├── trackingController.js    # Delivery tracking
│   │   └── uploadController.js      # Image upload handling
│   │
│   ├── middleware/
│   │   ├── verifyFBToken.js         # Firebase token validation
│   │   ├── verifyAdmin.js           # Admin role verification
│   │   └── verifyRider.js           # Rider role verification
│   │
│   ├── models/
│   │   ├── userModel.js             # User schema
│   │   ├── parcelModel.js           # Parcel schema
│   │   ├── riderModel.js            # Rider schema
│   │   ├── paymentModel.js          # Payment schema
│   │   └── trackingModel.js         # Tracking schema
│   │
│   ├── routes/
│   │   ├── userRoutes.js            # User endpoints
│   │   ├── parcelRoutes.js          # Parcel endpoints
│   │   ├── riderRoutes.js           # Rider endpoints
│   │   ├── paymentRoutes.js         # Payment endpoints
│   │   ├── trackingRoutes.js        # Tracking endpoints
│   │   └── uploadRoutes.js          # Upload endpoints
│   │
│   ├── utility/
│   │   └── initModels.js            # Initialize database models
│   │
│   ├── app.js                       # Express app setup
│   ├── server.js                    # Server entry point
│   ├── package.json
│   └── .env                         # Environment variables
│
├── Frontend/E-commerce/
│   ├── public/
│   │   └── districtsData.json       # Bangladesh districts data
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   ├── banner/              # Banner images
│   │   │   ├── brands/              # Brand logos
│   │   │   └── Tracker/             # Tracking assets
│   │   │
│   │   ├── Components/
│   │   │   └── Loading.jsx          # Loading component
│   │   │
│   │   ├── Contexts/
│   │   │   └── AuthContext/
│   │   │       ├── AuthContext.jsx  # Auth context
│   │   │       └── AuthProvider.jsx # Auth provider
│   │   │
│   │   ├── Firebase/
│   │   │   └── firebase.init.js     # Firebase configuration
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.jsx          # Authentication hook
│   │   │   ├── useAxios.jsx         # Axios instance hook
│   │   │   ├── useAxiosSecure.jsx   # Secure Axios hook
│   │   │   ├── useTrackingLogger.jsx# Tracking hook
│   │   │   └── useUserRole.jsx      # User role hook
│   │   │
│   │   ├── Layouts/
│   │   │   ├── RootLayout.jsx       # Main layout
│   │   │   ├── AuthLayout.jsx       # Auth pages layout
│   │   │   └── DashboardLayout.jsx  # Dashboard layout
│   │   │
│   │   ├── Pages/
│   │   │   ├── Home/                # Home page & sections
│   │   │   ├── Authentication/      # Login & Register
│   │   │   ├── SendParcel/          # Parcel booking
│   │   │   ├── Coverage/            # Coverage & map
│   │   │   ├── AboutUs/             # About page
│   │   │   ├── Dashboard/           # Dashboard pages
│   │   │   │   ├── MyParcels/
│   │   │   │   ├── TrackParcel/
│   │   │   │   ├── Payment/
│   │   │   │   ├── AssignRider/
│   │   │   │   ├── ActiveRider/
│   │   │   │   ├── MakeAdmin/
│   │   │   │   ├── BeARider/
│   │   │   │   ├── MyEarning/
│   │   │   │   ├── UpdateProfile/
│   │   │   │   ├── PendingDeliveries/
│   │   │   │   ├── CompletedDeliveries/
│   │   │   │   └── DashboardHome/
│   │   │   ├── Shared/              # Shared components
│   │   │   │   ├── Navbar/
│   │   │   │   ├── Footer/
│   │   │   │   └── ProFastLogo/
│   │   │   └── Forbidden/           # 403 page
│   │   │
│   │   ├── Router/
│   │   │   └── router.jsx           # Route configuration
│   │   │
│   │   ├── routes/
│   │   │   ├── PrivateRoute.jsx     # Protected routes
│   │   │   ├── AdminRoutes.jsx      # Admin-only routes
│   │   │   └── RiderRoute.jsx       # Rider-only routes
│   │   │
│   │   ├── App.jsx                  # Root component
│   │   ├── main.jsx                 # Entry point
│   │   ├── App.css
│   │   └── index.css
│   │
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── index.html
│   └── .env.local                   # Environment variables
│
└── README.md                        # Project documentation
```

---

## 📸 Screenshots

### User Features
- **Home Page:** Browse and explore parcel delivery services
- **Send Parcel:** Easy-to-use parcel booking interface with district selection
- **Parcel Tracking:** Real-time tracking with interactive map integration
- **Payment:** Secure Stripe payment integration for parcel shipping

### Rider Dashboard
- **Pending Deliveries:** View and manage assigned parcels
- **Earnings Dashboard:** Monitor income and payment history
- **Delivery Map:** District-based parcel assignment

### Admin Panel
- **Rider Management:** Approve, view, and manage riders
- **Parcel Assignment:** Assign riders based on district availability
- **Payment Monitoring:** Track all transactions and payments
- **Admin Control:** Create additional admins and manage users

---

## 🔧 Configuration Details

### Firebase Setup
1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Authentication (Email/Password & Google Sign-in)
3. Download service account key for backend
4. Copy web config for frontend `.env.local`

### Stripe Setup
1. Sign up at [stripe.com](https://stripe.com)
2. Get API keys from dashboard
3. Add to backend and frontend environment files

### Cloudinary Setup
1. Create account at [cloudinary.com](https://cloudinary.com)
2. Get API credentials from account settings
3. Add to backend `.env` file

### MongoDB Setup
1. Create MongoDB Atlas account at [mongodb.com](https://mongodb.com)
2. Create cluster and get connection URI
3. Add to backend `.env` file

---

## 🚀 Deployment

### Frontend Deployment (Firebase Hosting)
```bash
cd Frontend/E-commerce
npm run build
firebase deploy
```

### Backend Deployment (Vercel)
```bash
cd Backend
vercel deploy
```

---

## 🔮 Future Improvements

- [ ] **SMS Notifications:** Send delivery updates via SMS
- [ ] **Email Notifications:** Automated email alerts for parcel status
- [ ] **Advanced Analytics:** Dashboard analytics for admin users
- [ ] **Rating & Review System:** Allow users to rate rider performance
- [ ] **Scheduled Pickups:** Allow users to schedule parcel pickups
- [ ] **Multiple Payment Methods:** Add PayPal, bKash, Nagad integration
- [ ] **AI-based Rider Assignment:** ML-powered optimal rider assignment
- [ ] **Mobile App:** React Native mobile application
- [ ] **Insurance Options:** Add insurance coverage for valuable parcels
- [ ] **Return Management:** Easy return and refund processing
- [ ] **API Documentation:** Swagger/OpenAPI documentation
- [ ] **Unit & Integration Tests:** Comprehensive test coverage
- [ ] **Performance Optimization:** Caching, CDN integration
- [ ] **Internationalization:** Multi-language support (i18n)

---

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author & Contact

**Murad Hasan**
- GitHub: [@Murad134](https://github.com/Murad134)
- Email: [muradcse.25@example.com](mailto:muradcse.25@example.com)
- Portfolio: [your-portfolio.com](https://your-portfolio.com)

### Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

For major changes, please open an issue first to discuss what you would like to change.

---

## ⭐ Support

If you find this project helpful, please consider giving it a star ⭐ on GitHub!

---

## 🙏 Acknowledgments

- MongoDB community for excellent database solutions
- Firebase for authentication infrastructure
- Stripe for secure payment processing
- React and Node.js communities for amazing tools
- All contributors and users of this project

---

**Last Updated:** May 2026

