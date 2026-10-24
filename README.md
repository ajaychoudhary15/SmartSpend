# 💸 SmartSpend – Smart Expense Manager & Personal Finance Dashboard

SmartSpend is a complete, production-ready full-stack personal finance application built with **React + Vite**, **Recharts**, **Lucide React**, **Node.js + Express**, and **MongoDB**. It empowers individuals to manage income and expenses, plan monthly budgets with automated threshold warnings, and gain actionable insights with interactive financial charts.

---

## 🌟 Key Features

- **Summary Metric Cards**: Live calculations for **Net Balance**, **Total Income**, **Total Expenses**, and **Savings Rate %**.
- **Interactive Expense & Cash Flow Charts**:
  - **Category Breakdown**: Dynamic donut/pie chart displaying top spending categories with hover tooltips and legend percentages.
  - **Cash Flow History**: 6-month side-by-side bar chart (Income vs Expenses) and Net Savings trend area chart.
- **Budget Management & Warning System**:
  - Configure monthly spending limit targets.
  - Set custom alert thresholds (e.g., 80%).
  - Visual color-coded progress bars: **Safe / On Track** (Green), **Budget Warning** (Amber, ≥ threshold), and **Budget Exceeded** (Rose Red, > 100%).
- **Transaction CRUD**:
  - Record and categorize income or expenses with custom titles, amounts, dates, and notes.
  - Edit or delete any transaction with instant balance updates.
- **Advanced Filtering & Search**:
  - Live search by title, description, or notes.
  - Filter by transaction type (*All*, *Expenses*, *Income*).
  - Filter by category (*Food & Dining*, *Housing*, *Utilities*, *Transportation*, *Healthcare*, *Entertainment*, *Shopping*, *Salary*, *Freelance*, etc.).
  - Browse by specific calendar month or view all-time history.
  - Sort by date or transaction amount.
- **User Authentication & Security**:
  - Secure registration and login using **bcryptjs** password hashing (10 salt rounds).
  - Stateless **JWT (JSON Web Token)** authentication with automatic session expiration handling.
  - User-isolated data: each user's financial transactions and budgets are strictly private.
  - Multi-currency preference support (`$`, `€`, `£`, `₹`, `¥`, `C$`).
- **Responsive Modern UI**:
  - Built with custom fintech styling, subtle gradients, accessible contrast, and smooth micro-interactions.
  - Fully responsive across mobile, tablet, and desktop screens.
  - Skeletons, loading spinners, empty states, and dismissible toast notifications.

---

## 🏗️ Architecture & Project Structure

```
SmartSpend/
├── client/                     # Frontend React + Vite application
│   ├── public/
│   │   └── favicon.svg         # SmartSpend icon
│   ├── src/
│   │   ├── api/                # Axios instance & API services
│   │   │   ├── axiosClient.js
│   │   │   ├── authApi.js
│   │   │   ├── transactionApi.js
│   │   │   └── budgetApi.js
│   │   ├── components/         # Reusable dashboard & UI components
│   │   │   ├── AnalyticsCharts.jsx
│   │   │   ├── BudgetProgress.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── NotificationToast.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── SetBudgetModal.jsx
│   │   │   ├── SummaryCards.jsx
│   │   │   ├── TransactionList.jsx
│   │   │   └── TransactionModal.jsx
│   │   ├── context/            # React Context state management
│   │   │   ├── AuthContext.jsx
│   │   │   └── FinanceContext.jsx
│   │   ├── pages/              # Routed pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── App.jsx             # Routes & layout structure
│   │   ├── index.css           # Modern Fintech stylesheet
│   │   └── main.jsx            # Entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── .env
│
├── server/                     # Backend Node.js + Express + MongoDB
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js           # Mongoose MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── transactionController.js
│   │   │   └── budgetController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js # JWT verification
│   │   │   └── errorHandler.js   # Global Express error handler
│   │   ├── models/             # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Transaction.js
│   │   │   └── Budget.js
│   │   ├── routes/             # Express API endpoints
│   │   │   ├── authRoutes.js
│   │   │   ├── transactionRoutes.js
│   │   │   └── budgetRoutes.js
│   │   └── app.js              # Express app configuration & CORS
│   ├── index.js                # Server entry point
│   ├── package.json
│   ├── .env.example
│   └── .env
│
├── .gitignore                  # Git ignore rules for node_modules & .env
├── .env.example                # Unified environment variables template
├── package.json                # Root orchestration scripts
└── README.md
```

---

## ⚙️ Prerequisites

Before running SmartSpend, ensure you have:
1. **Node.js** (v18.x or higher, v24+ recommended)
2. **MongoDB** installed and running locally on port `27017` (e.g. `mongodb://127.0.0.1:27017/smartspend`), or a MongoDB Atlas URI.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
Run the install command from the root directory:
```bash
# On Windows PowerShell:
npm.cmd run install:all

# On Linux/macOS/Git Bash:
npm run install:all
```

*(Alternatively, run `npm install` inside the root, `server/`, and `client/` folders).*

---

### 2. Environment Variables Setup

Ensure that `server/.env` and `client/.env` exist (these are already generated for you with secure local defaults):

**Server (`server/.env`):**
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/smartspend
JWT_SECRET=smartspend_dev_jwt_secret_9f82a17b8c34e621
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Client (`client/.env`):**
```env
VITE_API_BASE_URL=/api
```

---

### 3. Run the Full Application

You can start both backend and frontend simultaneously with a single command from the project root:

```bash
# In Windows PowerShell:
npm.cmd run dev

# In standard shell:
npm run dev
```

Or run them in separate terminal tabs:

**Terminal 1 (Backend Server):**
```bash
npm.cmd run dev:server
# Server will run at: http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
npm.cmd run dev:client
# Client will run at: http://localhost:5173
```

Now open **[http://localhost:5173](http://localhost:5173)** in your browser!

---

## 📡 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new account | Public |
| `POST` | `/api/auth/login` | Login and receive JWT token | Public |
| `GET` | `/api/auth/me` | Get currently authenticated user | Private (Bearer Token) |
| `PUT` | `/api/auth/profile` | Update user currency preference | Private (Bearer Token) |

### 💳 Transactions (`/api/transactions`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/transactions` | Query user transactions with filters, search, and sorting | Private |
| `POST` | `/api/transactions` | Create a new transaction | Private |
| `GET` | `/api/transactions/stats` | Summary totals, category distribution, & monthly trends | Private |
| `GET` | `/api/transactions/categories` | Predefined transaction categories | Private |
| `PUT` | `/api/transactions/:id` | Update an existing transaction | Private |
| `DELETE` | `/api/transactions/:id` | Delete a transaction | Private |

### 🎯 Budget (`/api/budget`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/budget?month=YYYY-MM` | Fetch budget target, current spend, and warning status | Private |
| `POST` | `/api/budget` | Set or update monthly budget limit and warning threshold | Private |

---

## 🔒 Security & Data Privacy

- Passwords are encrypted with **bcrypt** before saving into MongoDB.
- API routes are strictly protected with **JWT middleware**.
- MongoDB queries filter by `req.user._id`, ensuring users cannot view, edit, or delete transactions belonging to other accounts.
- Sensitive environment files (`.env`) are excluded in `.gitignore`.
