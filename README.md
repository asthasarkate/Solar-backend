# Solara AI — Solar Panel Fault Detection Backend

This is the backend API for **Solara AI**, an application designed to detect and categorize faults in solar panels (such as Dust, Cracks, Physical Damage, and Shading) using AI image analysis.

## 🚀 Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (with Mongoose)
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **File Uploads:** Multer

## ✨ Features
- **User Authentication:** Secure registration and login with password hashing and JWT.
- **Image Upload:** Upload images of solar panels for analysis.
- **AI Integration:** Forwards images to an external AI service for fault detection. Features an automatic fallback to mock data if the AI service is unreachable.
- **History Tracking:** Stores and retrieves user scan history with advanced filtering, sorting (e.g., by severity), and pagination.
- **Profile Management:** View scan statistics and update user profiles.

## 📋 Prerequisites
Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally or a MongoDB Atlas URI)

## 🛠️ Installation & Setup

1. **Clone the repository (if applicable)**
   ```bash
   git clone <your-repo-url>
   cd Solar-backend
   ```

2. **Install Dependencies**
   Run the following command in the root directory to install all required packages:
   ```bash
   npm install
   ```

3. **Environment Variables Configuration**
   Create a `.env` file in the root directory of the project. You can copy the provided `.env.example` file:
   ```bash
   cp .env.example .env
   ```
   Open the `.env` file and configure the following variables:
   ```env
   # Server Configuration
   PORT=5000
   CLIENT_URL=http://localhost:3000

   # Database
   MONGO_URI=mongodb://localhost:27017/solara_ai

   # JWT Authentication
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=30d

   # AI Service (FastAPI / Python endpoint)
   AI_SERVICE_URL=http://localhost:8000/predict
   ```

4. **Ensure the Uploads Directory Exists**
   The application uses an `uploads/` folder to store incoming images. (It should already be in the repo, but if not, create it):
   ```bash
   mkdir uploads
   ```

## 🚀 Running the Application

**Development Mode:**
To run the server with hot-reloading (using nodemon), use:
```bash
npm run dev
```

**Production Mode:**
To run the standard Node server, use:
```bash
npm start
```

You should see the following in your console if successful:
```
Server running on port 5000
MongoDB Connected: <host>, DB: solara_ai
```

## 📡 API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - Authenticate a user and get a token

### User & Predictions (`/api`)
- `GET /profile` - Get logged-in user profile & stats (Protected)
- `PUT /profile` - Update user profile (Protected)
- `POST /analyze` - Upload an image for fault prediction (Protected)
- `GET /history` - Get user's scan history with filtering/sorting (Protected)
- `GET /predictions/:id` - Get details of a specific scan (Protected)

## 📁 Project Structure
```text
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route logic and handlers
│   ├── middleware/      # JWT, Error, and Multer middlewares
│   ├── models/          # Mongoose schemas (User, Prediction)
│   ├── routes/          # Express route definitions
│   ├── services/        # External API services (AI service)
│   ├── utils/           # Helper functions (JWT generator)
│   └── server.js        # Main application entry point
├── uploads/             # Stores uploaded image files
├── package.json         # Project metadata and dependencies
└── .env                 # Environment variables
```