# SmartSpend — Personal Finance & Expense Tracker

SmartSpend is a personal finance management web application designed to help users track transactions, monitor spending, and manage their finances through a dashboard.

## Features

- **User Authentication:** Register and log in to your account.
- **Expense Tracking:** Add and view financial transactions.
- **Dashboard:** View your financial activity in one place.
- **Transaction Persistence:** Existing transactions remain available after refreshing the application.
- **Responsive Interface:** A dashboard designed for convenient use.
- **Full-Stack Architecture:** React frontend with a Node.js and Express backend.
- **Database Integration:** MongoDB with Mongoose for data storage.

## Tech Stack

**Frontend**
- React.js
- Vite
- JavaScript
- CSS
- Recharts

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose

## Project Structure

```text
SmartSpend/
├── client/          # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── server/          # Express backend
│   ├── src/
│   ├── index.js
│   └── package.json
├── .env.example
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB running locally or a MongoDB Atlas database

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd SmartSpend
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your repository's HTTPS URL.

### 2. Configure environment variables

Check the `.env.example` files in the project root, `client`, and `server` folders. Create the required local `.env` files using the variable names specified in the corresponding examples.

Never commit actual passwords, database credentials, or JWT secrets.

### 3. Install dependencies

Install dependencies in the root, client, and server folders wherever a `package.json` exists and dependencies are required.

```bash
npm install
```

For the frontend:

```bash
cd client
npm install
npm run dev
```

For the backend, open a separate terminal:

```bash
cd server
npm install
npm run dev
```

Use the configured local frontend and backend URLs shown in your terminals and environment files.

## Production Build

To create a production build of the frontend:

```bash
cd client
npm run build
```

## Security

- Keep `.env` files out of version control.
- Use environment variables for credentials and secrets.
- Do not publish real database passwords or authentication tokens.

## Future Improvements

- Production deployment and live database configuration
- Advanced spending analytics
- Export transactions to CSV
- Improved budget notifications

## Author

**Ajay Tomar**

GitHub: [@ajaychoudhary15](https://github.com/ajaychoudhary15)

---

*SmartSpend is a portfolio project focused on personal finance management and full-stack web development.*
