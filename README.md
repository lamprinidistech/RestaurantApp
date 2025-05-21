#  Restaurant  App

A full‑featured restaurant reservation application with a Node.js backend and React Native (Expo) frontend. Users can register, log in, make reservations, and view their booking history.
---

## 📽️  | Project Demo Video

[![Δείτε την παρουσίαση](https://img.youtube.com/vi/rPV9cfTbVoE/0.jpg)](https://youtube.com/shorts/rPV9cfTbVoE?feature=share)





▶️ Click the image to watch the demo.

##  Technologies

Backend

Node.js & Express.js

MariaDB

JWT for authentication

bcryptjs for password hashing

dotenv for environment variables

Frontend (Expo App)

React Native with Expo Router

Axios for API calls

AsyncStorage for storing the token

Animated API for UI transitions

##  Installation Guide

Backend

Create the database

Create a MariaDB database named restaurant_booking.

Create a .env file

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=admin123
DB_PORT=3308
DB_NAME=restaurant_booking
JWT_SECRET=your_secret_key

Install dependencies & start the server

npm install
node app.js

Frontend

Navigate to the frontend/ folder and install dependencies:

cd frontend
npm install
npx expo start

In config.js, replace LOCAL_IP with the IP address of your backend server.

## Features

Authentication

Registration and login forms

JWT token storage in AsyncStorage

Session‑based navigation

Reservations

Browse available restaurants

Search by name

Select date, time, and number of guests

Confirm reservation

Profile

View reservation history

Cancel reservations

Separate upcoming from past bookings

 Project Structure

## RestaurantApp/
├── app.js
├── db.js
├── .env
├── package.json
├── package-lock.json
├── middleware/
│   └── auth.js
├── routes/
│   ├── auth.js
│   ├── reservations.js
│   └── restaurants.js
└── frontend/
    └── app/
        ├── restaurants/
        │   ├── index.js
        │   └── RestaurantsScreen.js
        ├── booking.js
        ├── config.js
        ├── index.js
        ├── login.js
        ├── LoginScreen.js
        ├── profile.js
        ├── _layout.tsx
        └── +not-found.tsx

