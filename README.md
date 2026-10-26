# 💸 SmartSpend – Smart Expense Manager & Personal Finance Dashboard

**[🌐 Live Demo](https://smartspend-ajay.netlify.app/) | [📂 GitHub Repository](https://github.com/ajaychoudhary15/SmartSpend) | [⚙️ Backend Health Check](https://smartspend-api-yegd.onrender.com/api/health)**

SmartSpend is a full-stack personal finance application built with **React + Vite**, **Recharts**, **Lucide React**, **Node.js + Express**, and **MongoDB**. It helps users manage income and expenses, plan monthly budgets, and understand their financial activity through interactive charts and a centralized dashboard.

---

## 🌟 Key Features

- **Summary Metric Cards:** Net balance, total income, total expenses, and savings rate.
- **Interactive Financial Charts:**
  - Category breakdown with spending distribution.
  - Monthly income vs. expense charts.
  - Net savings trend visualization.
- **Budget Management:**
  - Configure monthly spending limits.
  - Set spending alert thresholds.
  - View budget progress and warnings where implemented.
- **Transaction Management (CRUD):**
  - Add income and expense transactions.
  - Edit and delete transactions.
  - Store transaction titles, amounts, dates, categories, and notes where supported.
- **Search and Filtering:**
  - Search and filter transactions.
  - Filter by transaction type, category, and date.
  - Sort transactions by date or amount where supported.
- **Authentication and Data Privacy:**
  - User registration and login.
  - Password hashing using `bcryptjs`.
  - JWT-based authentication for protected API routes.
  - User-specific data access enforced by the backend.
- **Modern Responsive UI:**
  - Responsive dashboard and reusable components.
  - Financial charts, loading states, and notifications where implemented.

---

## 🏗️ Architecture & Project Structure

```text
SmartSpend/
├── client/
│   ├── public/
│   └── src/
│       ├── api/
│       │   ├── axiosClient.js
│       │   ├── authApi.js
│       │   ├── transactionApi.js
│       │   └── budgetApi.js
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── app.js
│   ├── index.js
│   └── package.json
├── .gitignore
├── .env.example
├── package.json
└── README.md
```

---

## ⚙️ Prerequisites

Before running SmartSpend locally, make sure you have:

1. **Node.js and npm**
2. **MongoDB Atlas** or a local MongoDB instance
3. **Git**

---

## 🚀 Quick Start Guide

### 1. Clone the Repository

```bash
git clone https://github.com/ajaychoudhary15/SmartSpend.git
cd SmartSpend
```

### 2. Install Dependencies

Install dependencies in the backend and frontend directories.

**Backend:**

```bash
cd server
npm install
```

**Frontend:** Open a second terminal in the project root and run:

```bash
cd client
npm install
```

### 3. Configure Environment Variables

Create `server/.env` with the variables required by your backend:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

Create `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Use the exact environment variable names required by your code. Replace placeholders with your own values.

**Important:** Never commit real database credentials, JWT secrets, or `.env` files to GitHub.

### 4. Start the Application

Start the backend from the `server` directory:

```bash
npm run dev
```

Start the frontend from the `client` directory in a separate terminal:

```bash
npm run dev
```

Open the local frontend URL shown in the terminal, usually:

http://localhost:5173

---

## 📡 API Endpoints Reference

The following endpoint patterns describe the application's main API areas. Confirm exact routes against the current backend code.

### 🔐 Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register an account |
| POST | `/api/auth/login` | Log in and receive an authentication token |
| GET | `/api/auth/me` | Retrieve the authenticated user |

### 💳 Transactions

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/transactions` | Retrieve transactions |
| POST | `/api/transactions` | Create a transaction |
| PUT | `/api/transactions/:id` | Update a transaction |
| DELETE | `/api/transactions/:id` | Delete a transaction |

### 🎯 Budgets

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/budget` | Retrieve budget information |
| POST | `/api/budget` | Create or update a budget |

**Production API Health Check:** [Check Backend Status](https://smartspend-api-yegd.onrender.com/api/health)

---

## 🔒 Security & Data Privacy

- Passwords are hashed using `bcryptjs`.
- Protected routes use JWT authentication.
- Backend authorization should restrict access to each user's own financial data.
- Sensitive configuration is stored in environment variables.
- Database credentials and secrets must not be committed to source control.
- Database permissions should follow the principle of least privilege.

---

## 🚀 Deployment

SmartSpend is deployed using the following services:

- **Frontend:** [Netlify Live App](https://smartspend-ajay.netlify.app/)
- **Backend:** [Render API](https://smartspend-api-yegd.onrender.com/api/health)
- **Database:** MongoDB Atlas

---

## 🔮 Future Improvements

- CSV transaction export.
- More financial reports and analytics.
- Enhanced budget planning and alerts.
- Automated tests and additional API validation.

---

## 👨‍💻 Author

**Ajay Tomar**

- **GitHub:** [ajaychoudhary15](https://github.com/ajaychoudhary15)
- **LinkedIn:** [Ajay Tomar](https://linkedin.com/in/ajay-tomar-509a29385)

---

*Built with React, Node.js, Express.js, and MongoDB.*
