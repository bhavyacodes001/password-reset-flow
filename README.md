# Password Reset Flow

A full-stack web application implementing a complete **password reset flow** with email verification using React, Node.js, MongoDB, and Bootstrap.

## Features

- **User Authentication** — Register, Login, Logout
- **Forgot Password** — Enter email to receive a reset link
- **Email Verification** — Real emails sent via Gmail SMTP with HTML templates
- **Token-Based Reset** — Cryptographically random tokens with 15-minute expiry
- **One-Time Use Tokens** — Tokens are cleared from DB after password is reset
- **Secure Password Storage** — All passwords hashed with bcrypt (12 salt rounds)
- **Profile Management** — Update display name, change password
- **Responsive UI** — Works on desktop, tablet, and mobile
- **Modern Dark Theme** — Glassmorphism design with animations and transitions

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, React Router, React Bootstrap, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Email | Nodemailer (Gmail SMTP) |
| Security | bcrypt.js, crypto |
| Styling | Bootstrap 5, Custom CSS, Google Fonts (Inter) |

## Password Reset Flow

```
User enters email
       |
       v
Check if user exists in DB
      / \
    No    Yes
    |      |
  Error   Generate random token
           |
           v
     Store token + expiry in DB
           |
           v
     Send email with reset link
           |
           v
   User clicks link in email
           |
           v
   Verify token matches DB & not expired
          / \
        No    Yes
        |      |
     Reject   Show reset form
               |
               v
         Save new password
         Clear token from DB
```

## Project Structure

```
password-reset-app/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection setup
│   ├── models/
│   │   └── User.js            # User schema with password hashing
│   ├── routes/
│   │   └── auth.js            # All authentication endpoints
│   ├── utils/
│   │   └── sendEmail.js       # Email sending utility
│   ├── server.js              # Express server entry point
│   ├── seed.js                # Seed script for test user
│   ├── .env.example           # Environment variables template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js       # Login page
│   │   │   ├── Register.js    # Registration page
│   │   │   ├── ForgotPassword.js  # Forgot password page
│   │   │   ├── ResetPassword.js   # Reset password page
│   │   │   └── Home.js        # Dashboard with tabs
│   │   ├── App.js             # Route configuration
│   │   ├── index.js           # App entry with Router & Bootstrap
│   │   └── index.css          # Global styles, theme, animations
│   └── package.json
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create a new user account |
| POST | `/api/auth/login` | Authenticate user |
| PUT | `/api/auth/profile` | Update display name |
| POST | `/api/auth/change-password` | Change password (logged in) |
| POST | `/api/auth/forgot-password` | Send password reset email |
| GET | `/api/auth/reset-password/:token` | Verify reset token |
| POST | `/api/auth/reset-password/:token` | Set new password |

## Setup & Installation

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account (free tier)
- Gmail account with App Password enabled

### 1. Clone the repository

```bash
git clone https://github.com/bhavyacodes001/password-reset-flow.git
cd password-reset-flow
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder (see `.env.example`):

```
PORT=5001
MONGO_URI=your_mongodb_connection_string
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:3000
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
```

### 4. Run the Application

Start the backend (from `backend/` folder):
```bash
node server.js
```

Start the frontend (from `frontend/` folder):
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. (Optional) Seed a Test User

```bash
cd backend
node seed.js
```

This creates a test user: `testuser@example.com` / `password123`

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Backend server port (default: 5001) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `EMAIL_USER` | Gmail address for sending reset emails |
| `EMAIL_PASS` | Gmail App Password (16-character code) |
| `CLIENT_URL` | Frontend URL (for CORS and email links) |

## License

This project is for educational purposes.
