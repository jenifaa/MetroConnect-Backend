# MetroConnect — Backend Implementation Plan (13 Days)

Stack: Node.js + Express + MongoDB Atlas + Mongoose + JWT + bcrypt + Cloudinary

---

## Day 1 — Project Setup & Database Connection
- Initialize project: `npm init -y`, install `express`, `mongoose`, `dotenv`, `cors`, `nodemon`
- Set up folder structure:
  ```
  src/
    config/       (db.ts, cloudinary.ts)
    models/
    routes/
    middlewares/
    utils/
    app.ts
    server.ts
  ```
- Create `.env` with `PORT`, `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`
- Connect to MongoDB Atlas via Mongoose (use standard non-SRV connection string if your ISP blocks SRV DNS lookups)
- Set up base Express app: JSON body parser, CORS, error-handling middleware, health-check route (`/api/health`)
- Push initial commit to GitHub, set up `.gitignore`

## Day 2 — User Model & Authentication (Register/Login)
- Build `User` schema: name, email, password (hashed), studentId, role (`student`/`admin`), createdAt
- Add password hashing with bcrypt (pre-save hook or in controller)
- Build `POST /api/auth/register` — validate input, check duplicate email, hash password, save user
- Build `POST /api/auth/login` — verify email/password, generate JWT, return token + user info
- Add basic input validation (Zod or Joi) for register/login payloads

## Day 3 — Auth Middleware & Profile Management
- Build `authMiddleware` to verify JWT from Authorization header and attach `req.user`
- Build `adminMiddleware` to restrict admin-only routes
- Build `GET /api/users/me` — get logged-in user's profile
- Build `PUT /api/users/me` — update profile (name, bio, avatar URL)
- Build `GET /api/users/:id` — view public profile
- Test all auth routes in Postman, save as a collection

## Day 4 — Community Post Module
- Build `Post` schema: author (ref User), title, content, category, createdAt, updatedAt
- Build `POST /api/posts` — create post (auth required)
- Build `GET /api/posts` — list posts (with pagination, category filter)
- Build `GET /api/posts/:id` — get single post
- Build `PUT /api/posts/:id` — edit own post (ownership check)
- Build `DELETE /api/posts/:id` — delete own post (ownership check)

## Day 5 — Comments & Replies Module
- Build `Comment` schema: post (ref Post), author (ref User), content, parentComment (for replies), createdAt
- Build `POST /api/posts/:postId/comments` — add comment or reply
- Build `GET /api/posts/:postId/comments` — list comments (nested/threaded structure)
- Build `DELETE /api/comments/:id` — delete own comment
- Add comment count to post responses (aggregation or virtual field)

## Day 6 — Question & Answer Module
- Build `Question` schema: author, title, description, tags, createdAt
- Build `Answer` schema: question (ref), author, content, upvotes, createdAt
- Build routes: `POST /api/questions`, `GET /api/questions`, `GET /api/questions/:id`
- Build routes: `POST /api/questions/:id/answers`, `GET /api/questions/:id/answers`
- Add "mark as accepted answer" feature (question owner only)

## Day 7 — Complaint Module (Anonymous/Public + Tracking)
- Build `Complaint` schema: author (ref User, but `isAnonymous` flag hides identity in public responses), subject, description, status (`pending`/`in-review`/`resolved`), adminResponse, createdAt
- Build `POST /api/complaints` — submit complaint, support `isAnonymous: true/false`
- Build `GET /api/complaints/me` — student views their own submitted complaints + status
- Ensure anonymous complaints never expose author info in any non-admin route
- Build `GET /api/complaints/:id` — track single complaint status

## Day 8 — Lost and Found Module
- Build `LostFoundItem` schema: author, type (`lost`/`found`), itemName, description, location, imageUrl, status (`open`/`claimed`), createdAt
- Build `POST /api/lost-found` — create listing (with optional image upload via Cloudinary)
- Build `GET /api/lost-found` — list all items (filter by type/status)
- Build `PUT /api/lost-found/:id` — update status to "claimed" (owner only)
- Set up Cloudinary config and image upload utility (multer + Cloudinary SDK)

## Day 9 — Announcement Module
- Build `Announcement` schema: title, content, author (admin ref), createdAt
- Build `POST /api/announcements` — admin-only creation
- Build `GET /api/announcements` — public list (paginated)
- Build `PUT /api/announcements/:id` and `DELETE /api/announcements/:id` — admin-only
- Add optional email notification trigger when a new announcement is published

## Day 10 — Admin Module (Dashboard Backend)
- Build `GET /api/admin/users` — list all students (admin only)
- Build `PUT /api/admin/users/:id/status` — activate/suspend a user
- Build `GET /api/admin/complaints` — list all complaints with filters (status, date)
- Build `PUT /api/admin/complaints/:id` — respond to complaint, update status
- Build `DELETE /api/admin/posts/:id` — moderate/remove inappropriate posts
- Build `GET /api/admin/stats` — basic counts (total users, posts, complaints) for dashboard cards

## Day 11 — Notifications, Search, and Final Backend Features
- Build `Notification` schema: recipient, message, type, isRead, createdAt
- Trigger notifications on: new comment on your post, complaint status update, new announcement
- Build `GET /api/notifications` and `PUT /api/notifications/:id/read`
- Build search endpoint: `GET /api/posts/search?q=` (text index on title/content in MongoDB)
- Add rate limiting on auth routes and centralize error responses across all controllers

## Day 12 — Testing, Bug Fixing, and Deployment
- Run through the full Postman collection for every module, fix any broken endpoints
- Add basic input validation checks on all remaining routes (Zod/Joi)
- Write a `.env.example` file and finalize environment variable documentation
- Deploy backend to Render: connect GitHub repo, set environment variables, confirm HTTPS works
- Test deployed API against the deployed frontend (CORS config, base URL updates)
- Write final API documentation (routes, request/response examples) for the report

---

