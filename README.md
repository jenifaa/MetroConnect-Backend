# MetroConnect — Backend

MetroConnect is a campus community platform for Metropolitan University students. This repository contains the backend REST API, built with **Node.js**, **Express**, and **MongoDB**, providing authentication, community posts, complaints, notifications, announcements, and lost & found services.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js + Express | Backend runtime & REST API framework |
| MongoDB + Mongoose | Database & schema modeling |
| JWT | Authentication |
| bcrypt | Password hashing |
| Cloudinary | Image upload & storage |

---

## Project Structure

```
metroconnect-backend/
├── node_modules/
├── src/
│   ├── config/
│   │   ├── cloudinary.js       # Cloudinary connection config
│   │   ├── db.js               # MongoDB connection setup
│   │   └── env.js              # Environment variable loader
│   │
│   ├── modules/
│   │   ├── announcement/       # Admin announcements
│   │   ├── auth/                # Register, login, JWT auth
│   │   ├── complains/            # Anonymous/public complaint system
│   │   ├── notification/        # User notifications
│   │   ├── post/                 # Community posts, comments, Q&A
│   │   └── user/
│   │       ├── user.controller.js
│   │       ├── user.router.js
│   │       └── user.service.js
│   │
│   ├── utils/
│   │   ├── cloudinaryUploader.js  # Image upload helper
│   │   ├── generateToken.js        # JWT token generator
│   │   └── sendResponse.js         # Standardized API response formatter
│   │
│   ├── app.js                    # Express app setup (middleware, routes)
│   └── index.js                  # Server entry point
│
├── .env
├── .gitignore
├── IMPLEMENTATION.md
├── package.json
└── package-lock.json
```

Each feature module under `src/modules/` follows the same **controller → router → service** pattern (as seen in `user/`):
- **`*.router.js`** — defines the routes for the module
- **`*.controller.js`** — handles requests/responses
- **`*.service.js`** — contains the business logic & database queries

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/jenifaa/metroconnect-backend.git
cd metroconnect-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Run the server
```bash
# development
npm run dev

# production
npm start
```

The API will run at `http://localhost:5000` by default.

---

## API Modules

| Module | Base Route | Description |
|---|---|---|
| Auth | `/api/auth` | Register, login, JWT-based authentication |
| User | `/api/users` | Profile view/update |
| Post | `/api/posts` | Community posts, comments, Q&A |
| Complains | `/api/complains` | Submit & track complaints (anonymous/public) |
| Announcement | `/api/announcements` | Admin-published university notices |
| Notification | `/api/notifications` | User notifications |

> See `IMPLEMENTATION.md` for the full day-by-day backend development plan.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start server with nodemon (auto-restart on changes) |
| `npm start` | Start server in production mode |

---

## Contributors

- Nahida Akter Jenifa
- Urmi Chakraborty

**Course:** CSE 323 — Web Programming Lab
**Institution:** Metropolitan University