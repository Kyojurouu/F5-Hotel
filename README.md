# F5 Hotel Booking System

## Overview
Full-stack hotel booking system with user authentication, booking management, and admin dashboard connected to MongoDB Atlas.

## Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)
- MongoDB Atlas account (configured in `.env`)

## Quick Start

### 1. Install Dependencies
```powershell
npm install
```

### 2. Create Admin Account
```powershell
node seed-admin.js
```
Creates admin user: **Username:** `AdminUser` | **Password:** `admin12345`

### 3. Start Server
```powershell
npm start
```

Access:
- **User Login:** http://localhost:3000/login.html
- **Admin Login:** http://localhost:3000/adminlogin.html

**Note:** MongoDB connection string is configured in `.env` file. Never commit this file to public repositories.

## Project Structure
```
f5-hotel/
├── server.js          # Express server
├── seed-admin.js      # Create admin user
├── models/            # User & Booking schemas
├── routes/            # auth.js & bookings.js
└── utils/             # PDF generator
```

## Features

### User Features
- Register and login
- Browse rooms
- Create bookings
- View booking history
- Download booking receipts (PDF)

### Admin Features
- Manage all users
- Manage all bookings
- Update booking status
- Delete users/bookings

## API Endpoints

**Auth:** `/api/auth/`
- `POST /signup` - Register user
- `POST /login` - User login
- `POST /admin-login` - Admin login
- `GET /users` - Get all users (admin)
- `PUT /users/:id` - Update user (admin)
- `DELETE /users/:id` - Delete user (admin)

**Bookings:** `/api/bookings/`
- `POST /create` - Create booking
- `GET /user/:userId` - Get user's bookings
- `GET /all` - Get all bookings (admin)
- `PUT /:id/status` - Update status (admin)
- `DELETE /:id` - Delete booking (admin)

## Database Schema

**Users:** firstName, lastName, email (unique), username (unique), password (hashed), dateOfBirth, contactNumber, isAdmin, lastLogin

**Bookings:** userId (ref), roomType, checkInDate, checkOutDate, numberOfGuests, numberOfRooms, totalNights, totalPrice, specialRequests, status (Pending/Confirmed/Cancelled/Completed), pdfUrl

## Security
- Bcrypt password hashing (10 salt rounds)
- JWT token authentication (7-day expiration)
- Input validation with express-validator
- Role-based access control (Admin/User)
- Protected admin routes
- User ID validation to prevent errors

## Troubleshooting

**Server won't start:** Check if port 3000 is available, verify Node.js installation with `node --version`, or reinstall dependencies with `npm install`

**MongoDB connection error:** Verify internet connection, check MongoDB Atlas cluster is running, confirm credentials in `.env` file, whitelist your IP in MongoDB Atlas

**User ID errors:** Make sure you're logged in properly. Clear localStorage/sessionStorage and login again if needed

**Frontend can't reach API:** Ensure server is running on port 3000, check browser console for errors

## Pages

**User Pages:**
- `home.html` - Homepage
- `signup.html` - Register
- `login.html` - Login
- `rooms.html` - Browse rooms
- `booking.html` - Make reservation
- `user-bookings.html` - View bookings
- `about-us.html` - About hotel
- `contact.html` - Contact & Profile

**Admin Pages:**
- `adminlogin.html` - Admin login
- `admin-dashboard.html` - Dashboard
- `admin-users.html` - Manage users
- `admin-bookings.html` - Manage bookings

---
**Important:** Keep MongoDB credentials secure. Change admin password after first login.
