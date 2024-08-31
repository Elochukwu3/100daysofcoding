
# 🛒 E-commerce | 100DaysOfCoding | Backend

## Overview
Welcome to the backend of our e-commerce platform. This project provides the server-side logic, API endpoints, and database integration necessary to power an online shopping experience. It's built using Node.js and TypeScript, ensuring a scalable and maintainable codebase.

## Features
- **User Authentication & Authorization**: Secure user registration, login, and role-based access using JSON Web Tokens (JWT).
- **Product Management**: APIs for adding, updating, and managing product listings, including categories, pricing, and inventory control.
- **Order Management**: Handle customer orders, including checkout, payment processing, and order history.
- **Shopping Cart**: Persistent shopping cart functionality allowing users to manage their items across sessions.
- **Admin Panel**: Administrative tools for managing products, users, and orders.
- **Database Integration**: MongoDB is used for efficient and flexible data storage.
- **API Documentation**: Comprehensive API documentation using Swagger.

## Tech Stack
- **Node.js**: JavaScript runtime for server-side programming.
- **TypeScript**: Adds static typing to JavaScript, improving code quality and maintainability.
- **Express.js**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database for data persistence.
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB and Node.js.
- **JWT**: JSON Web Tokens for secure authentication.
- **Bcrypt**: Password hashing for secure authentication.
- **Date-fns**: Utility library for date manipulation.
- **UUID**: Library for generating unique identifiers.
- **Joi**: Data validation library for handling user inputs.

## Getting Started

### Prerequisites
Ensure you have the following installed:
- Node.js (v18 or later)
- npm or yarn
- MongoDB

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Elochukwu3/100daysofcoding.git
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   or if you prefer yarn:
   ```bash
   yarn install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add the following:
   ```plaintext
   PORT=3000
   MONGO_URI=your-mongodb-uri
   JWT_SECRET=your-secret-key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:3000`.

5. **Access the API documentation:**
   Visit `http://localhost:3000/api-docs` to explore and test the API endpoints.

## Project Structure

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── controllers/
│   │   │   │   └── file
│   │   │   ├── models/
│   │   │   │   └── file
│   │   │   ├── routes/
│   │   │   │   └── file
│   │   │   └── utils/
│   │   │       └── auth.utils.ts
│   │   ├── products/
│   │   │   ├── controllers/
│   │   │   │   └── product.controller.ts
│   │   │   ├── models/
│   │   │   │   └── product.model.ts
│   │   │   ├── routes/
│   │   │   │   └── product.routes.ts
│   │   │   ├── services/
│   │   │   │   └── product.service.ts
│   │   │   └── utils/
│   │   │       └── product.utils.ts
│   │   └── common/
│   │       ├── middleware/
│   │       │   ├── auth.middleware.ts
│   │       │   ├── error.middleware.ts
│   │       ├── utils/
│   │       │   ├── logger.ts
│   │       │   ├── constants.ts
│   │       │   └── validation.ts
│   │       ├── configs/
│   │       │   ├── db.config.ts
│   │       │   ├── server.config.ts
│   │       └── interfaces/
│   │           └── index.ts
│   ├── app.ts
│   └── index.ts
├── .env
├── .gitignore
├── README.md
├── tsconfig.json
├── package.json
└── yarn.lock
           
```
## Branch / Commits Conventions

### Branch
**Format**: `<ft|fx>-#ticket-id-<ticket-title>`  
**Example**: `ft-#100-add-user-role`

### Commit
**Format**: `<fx|ft|test|rf|>-#ticket-id: <short description>`  
**Example**: `fx-#200: fix user permission`


