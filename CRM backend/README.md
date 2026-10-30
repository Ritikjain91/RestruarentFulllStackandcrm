# CRM Backend REST API

A Customer Relationship Management (CRM) backend designed with **Node.js**, **Express.js**, **MongoDB (Mongoose)**, and **JWT Authentication**.

---

## 📋 Business Logic & Requirements Overview

1. **Employee / Counselor Accounts:**
   - Each employee/counselor is registered with their unique email address and authenticated using JSON Web Tokens (JWT).
   - Passwords are encrypted using `bcryptjs` with salt rounds.

2. **Public Enquiry / Lead Form:**
   - Accessible by prospective clients **without any authentication**.
   - Captures client details: Name, Email, Phone, Course interest, and optional message/notes.
   - Initial lead status is set to `unclaimed`.

3. **Public Enquiries (Inside CRM):**
   - Visible to all authenticated employees/counselors inside the CRM.
   - Shows all active enquiries that have not yet been claimed.

4. **Claiming an Enquiry (Private CRM Leads):**
   - Any authenticated counselor can "Claim" an unclaimed enquiry.
   - **Atomic Concurrency:** Uses MongoDB atomic operations (`findOneAndUpdate` with filter `{ _id, status: 'unclaimed', claimedBy: null }`) to prevent race conditions if multiple counselors attempt to claim the exact same lead simultaneously.
   - Once claimed, the enquiry is assigned exclusively to that counselor and becomes a **private enquiry** — it is no longer visible in the public unclaimed feed and other counselors are forbidden from accessing it.

5. **My Claimed Leads:**
   - Logged-in counselors can view the list of leads assigned to them.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js 5
- **Database:** MongoDB via Mongoose ORM
- **Authentication:** JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **Validation:** `express-validator`
- **Security:** `helmet`, `cors`
- **Logging:** `morgan`
- **Testing:** `jest`, `supertest`

---

## 📁 Project Structure

```
CRM backend/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & lifecycle management
│   ├── controllers/
│   │   ├── authController.js     # Employee register, login, me
│   │   └── leadController.js     # Public form, unclaimed, claim, claimed leads
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT Bearer token authentication guard
│   │   ├── errorHandler.js       # Global error and 404 handler
│   │   └── validateMiddleware.js # express-validator error formatter
│   ├── models/
│   │   ├── Lead.js               # Enquiry/Lead schema & compound indexes
│   │   └── User.js               # Employee/Counselor schema & password hashing
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   └── leadRoutes.js         # /api/leads routes
│   ├── utils/
│   │   └── jwt.js                # JWT sign & verify utilities
│   ├── app.js                    # Express application configuration
│   └── server.js                 # Server entry point & graceful shutdown
├── tests/
│   ├── auth.test.js              # Authentication unit & integration tests
│   └── lead.test.js              # Lead workflow & claiming tests
├── CRM_Backend_API.postman_collection.json  # Postman Collection
├── .env.example                  # Environment variables template
├── .env                          # Local environment variables
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local Community Server, Docker, or MongoDB Atlas cluster)

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```
Default configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/crm_db
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
```

### 4. Running the Server

**Development mode (with nodemon):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will be accessible at `http://localhost:5000`.

---

## 🧪 Running Automated Tests

Run the test suite with Jest:
```bash
npm test
```
All 20 integration tests verify authentication, input validation, public enquiry submissions, atomic claiming, conflict handling, and lead privacy controls.

---

## 📡 REST API Reference

### 🔐 1. Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new employee/counselor |
| `POST` | `/api/auth/login` | Public | Employee login & receive JWT token |
| `GET` | `/api/auth/me` | Protected | Get authenticated employee profile |

#### Register Employee
- **URL:** `POST /api/auth/register`
- **Body:**
```json
{
  "name": "Sarah Jenkins",
  "email": "sarah.jenkins@crm.com",
  "password": "Password123!",
  "phone": "+1234567890",
  "role": "counselor"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "Employee registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "_id": "6724...",
    "name": "Sarah Jenkins",
    "email": "sarah.jenkins@crm.com",
    "role": "counselor",
    "createdAt": "2026-10-31T02:00:00.000Z"
  }
}
```

#### Login Employee
- **URL:** `POST /api/auth/login`
- **Body:**
```json
{
  "email": "sarah.jenkins@crm.com",
  "password": "Password123!"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "_id": "6724...",
    "name": "Sarah Jenkins",
    "email": "sarah.jenkins@crm.com",
    "role": "counselor"
  }
}
```

---

### 📝 2. Public Enquiry Endpoint (`/api/leads/public`)

Accessible **without** authentication. Used for website forms, lead generation landing pages, or counselor-shared links.

- **Method:** `POST`
- **URL:** `/api/leads/public` (also supports `/api/enquiries/public`)
- **Body:**
```json
{
  "name": "Alex River",
  "email": "alex.river@student.com",
  "phone": "+1-555-0199",
  "courseInterest": "Full Stack Web Development",
  "message": "Interested in weekend batch options."
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "Enquiry submitted successfully. A counselor will connect with you soon.",
  "data": {
    "_id": "6724...",
    "name": "Alex River",
    "email": "alex.river@student.com",
    "phone": "+1-555-0199",
    "courseInterest": "Full Stack Web Development",
    "message": "Interested in weekend batch options.",
    "status": "unclaimed",
    "claimedBy": null,
    "claimedAt": null,
    "source": "public_form",
    "createdAt": "2026-10-31T02:05:00.000Z"
  }
}
```

---

### 👥 3. Counselor Leads Management (Protected with JWT)

Pass the JWT token in request headers:
```
Authorization: Bearer <counselor_token>
```

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/leads/unclaimed` | Protected | Fetch all unclaimed public enquiries |
| `PATCH` | `/api/leads/:id/claim` | Protected | Claim an unclaimed enquiry (Atomic) |
| `GET` | `/api/leads/claimed` | Protected | Fetch leads claimed by logged-in counselor |
| `GET` | `/api/leads/:id` | Protected | Get single lead details (Privacy enforced) |

#### Fetch Unclaimed Leads (Public Enquiries)
- **URL:** `GET /api/leads/unclaimed?page=1&limit=20&search=Full+Stack`
- **Query Params (Optional):**
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 20)
  - `search`: Search across name, email, or course interest
- **Response (200 OK):**
```json
{
  "success": true,
  "count": 1,
  "total": 1,
  "page": 1,
  "totalPages": 1,
  "data": [
    {
      "_id": "6724...",
      "name": "Alex River",
      "email": "alex.river@student.com",
      "phone": "+1-555-0199",
      "courseInterest": "Full Stack Web Development",
      "status": "unclaimed",
      "claimedBy": null,
      "createdAt": "2026-10-31T02:05:00.000Z"
    }
  ]
}
```

#### Claim an Enquiry
- **URL:** `PATCH /api/leads/:id/claim` (also accepts `POST /api/leads/:id/claim`)
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Enquiry claimed successfully. It is now private to your account.",
  "data": {
    "_id": "6724...",
    "name": "Alex River",
    "email": "alex.river@student.com",
    "phone": "+1-555-0199",
    "courseInterest": "Full Stack Web Development",
    "status": "claimed",
    "claimedBy": {
      "_id": "6724...",
      "name": "Sarah Jenkins",
      "email": "sarah.jenkins@crm.com",
      "role": "counselor"
    },
    "claimedAt": "2026-10-31T02:10:00.000Z"
  }
}
```
- **Error Responses:**
  - `409 Conflict`: If the enquiry was already claimed by another counselor.
  - `400 Bad Request`: If the enquiry was already claimed by you.
  - `404 Not Found`: If the enquiry does not exist.

#### Fetch My Claimed Leads
- **URL:** `GET /api/leads/claimed?page=1&limit=20`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
```json
{
  "success": true,
  "count": 1,
  "total": 1,
  "page": 1,
  "totalPages": 1,
  "data": [
    {
      "_id": "6724...",
      "name": "Alex River",
      "email": "alex.river@student.com",
      "phone": "+1-555-0199",
      "courseInterest": "Full Stack Web Development",
      "status": "claimed",
      "claimedBy": {
        "_id": "6724...",
        "name": "Sarah Jenkins",
        "email": "sarah.jenkins@crm.com"
      },
      "claimedAt": "2026-10-31T02:10:00.000Z"
    }
  ]
}
```

---

## 🔒 Race-Condition-Free Claim Logic

In high-concurrency environments, multiple counselors might click **"Claim"** on the same enquiry at the same millisecond. 

To eliminate race conditions, the backend uses MongoDB's atomic `findOneAndUpdate`:

```javascript
const claimedLead = await Lead.findOneAndUpdate(
  {
    _id: leadId,
    status: 'unclaimed',
    claimedBy: null
  },
  {
    status: 'claimed',
    claimedBy: req.user._id,
    claimedAt: new Date()
  },
  {
    new: true,
    runValidators: true
  }
);
```

Only one transaction can update the document when `status == 'unclaimed'`. The second concurrent request fails the query condition and safely returns `409 Conflict` (`"This enquiry has already been claimed by another counselor"`).

---

## 📮 Postman Collection

Import `CRM_Backend_API.postman_collection.json` into Postman or Insomnia. It includes:
- Pre-configured requests for all endpoints.
- Auto-extract scripts that save the JWT token and Lead ID into collection variables upon login and lead submission.

