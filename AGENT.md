# 🤖 MetroConnect — AI Agent Development Guide

> **Project:** MetroConnect  
> **Platform:** Metropolitan University Community Management System  
> **Backend:** Node.js + Express.js + MongoDB + Mongoose  
> **Language:** JavaScript ES Modules

---

## 📌 Project Overview

MetroConnect is a university community management platform for Metropolitan University students.

Students can:

- Communicate with other students
- Create community posts
- Ask questions
- Comment on posts
- React to posts
- Submit complaints
- View university announcements
- Report lost and found items

Admins can:

- Manage users
- Manage complaints
- Publish announcements
- Moderate posts and comments
- Remove inappropriate content

---

## 🚨 Important Instructions for AI Agents

This is an **existing production-style codebase**.

The goal is to **continue development from the existing implementation**, not rebuild the project.

### ❌ Do Not

- Rewrite the existing architecture
- Replace the existing authentication system
- Replace JWT authentication
- Replace Passport.js
- Replace Google OAuth
- Replace the existing user model
- Replace password reset functionality
- Replace validation middleware
- Replace Zod validation
- Replace Cloudinary configuration
- Replace Multer configuration
- Replace Redis configuration
- Remove existing features
- Create duplicate middleware
- Create duplicate utilities
- Create unnecessary collections
- Introduce unnecessary dependencies

### ✅ Always

- Inspect existing code before modifying it
- Understand the current architecture
- Reuse existing functionality
- Follow existing naming conventions
- Follow the existing coding style
- Make minimal changes
- Preserve backward compatibility
- Reuse existing middleware
- Reuse existing error handling
- Reuse existing QueryBuilder
- Reuse existing Cloudinary setup
- Reuse the existing notification system

---

## 🏗️ Existing Project Structure

```text
src/
├── app/
│   └── config/
│       ├── cloudinary.config.js
│       ├── db.js
│       ├── env.js
│       ├── multer.config.js
│       ├── passport.js
│       └── redis.config.js
│
├── errorHelpers/
├── helpers/
├── middlewares/
│
├── modules/
│   ├── auth/
│   ├── announcement/
│   ├── complains/
│   ├── notification/
│   ├── post/
│   └── user/
│
├── routes/
├── utils/
│
├── app.js
└── index.js

```




## Promt used in this project 

```

You are a senior full-stack engineer with 8+ years of experience building scalable MERN applications.

You are working on an existing project called "MetroConnect", a university community management platform for Metropolitan University students.


IMPORTANT RULES:
1. Do NOT rewrite or replace my existing code structure.
2. Do NOT change existing user authentication, user model, JWT system, passport Google login, password reset, validation middleware, Cloudinary setup, Redis setup, or existing user functionalities unless absolutely required.
3. First analyze my existing project structure and understand the current implementation.
4. Continue development from my current codebase like an experienced developer joining an existing team.
5. Maintain the same coding style, folder structure, naming conventions, and architecture.
6. Use JavaScript ES Modules syntax.
7. Write clean production-level code with proper error handling.
8. Before creating new files, check whether similar functionality already exists.
9. Do not remove existing features.

Current project structure:

src/
 ├── app/
 │    ├── config/
 │    │    ├── cloudinary.config.js
 │    │    ├── db.js
 │    │    ├── env.js
 │    │    ├── multer.config.js
 │    │    ├── passport.js
 │    │    └── redis.config.js
 │
 ├── errorHelpers/
 ├── helpers/
 ├── middlewares/
 ├── modules/
 │    ├── auth/
 │    ├── announcement/
 │    ├── complains/
 │    ├── notification/
 │    ├── post/
 │    └── user/
 │
 ├── routes/
 ├── utils/
 ├── app.js
 └── index.js

PROJECT GOAL:

MetroConnect is a university community platform where students can:
- communicate with each other
- create posts
- ask questions
- comment and react
- submit complaints
- view announcements
- report lost/found items

Admins can:
- manage users
- manage complaints
- publish announcements
- moderate content


IMPLEMENT THE REMAINING FEATURES:

====================================================
1. POST / COMMUNITY MODULE
====================================================

- Improve the existing post module.

Post features:

- Users can create posts.

A post should support:


{
 title,
 description,
 category,
 images,
 author,
 isAnonymous,
 reactions[],
 comments[],
 createdAt
}


Anonymous posting:
- User can choose to post anonymously.
- If anonymous:
    - Other students cannot see the author's identity.
    - Admin can still see the real author.
- If not anonymous:
    - Show user profile information.


Post reactions:

- Users can react to posts.

- Do NOT only store reaction count.

- Store detailed reaction data inside the post document.


Example:

reactions:[
 {
    user: ObjectId,
    reactionType:"like",
    createdAt:Date
 }
]


Requirements:
- One user should not create duplicate reactions.
- If user reacts again, update/remove previous reaction.
- Store who reacted.

Post comments:

Comments must be stored as an array in the post document.

Example:

comments:[
 {
    user:ObjectId,
    text:"Great post",
    createdAt:Date
 }
]

Requirements:
- Store commenter information.
- Users can add comments.
- Users can delete their own comments.
- Admin can remove inappropriate comments.


Post permissions:

Students:
- Create posts
- Edit their own posts
- Delete their own posts
- React
- Comment
- View posts


Admin:
- Manage all posts
- Delete inappropriate posts


====================================================
2. COMPLAINT MODULE
====================================================

IMPORTANT:

The complaint section must NOT be visible to normal users.

Only:
- Admin
- Complaint management authority

can access complaints.


Students can:
- Submit complaints
- Choose anonymous or public complaint


Complaint model should support:

{
 title,
 description,
 category,
 status,
 submittedBy,
 isAnonymous,
 adminResponse,
 createdAt
}

Rules:

Anonymous complaint:
- Students cannot see who submitted it.
- Admin can see the real user.


Complaint status:

Pending
In Progress
Resolved
Rejected


Admin can:
- View complaints
- Change status
- Add response
- Delete complaints


Normal users:
- Cannot view other complaints.
- Cannot access complaint list API.


Protect complaint routes with authorization middleware.


====================================================
3. ANNOUNCEMENT MODULE
====================================================

Implement:

Admin:
- Create announcement
- Update announcement
- Delete announcement


Students:
- View announcements


Announcement example:

{
 title,
 description,
 createdBy,
 createdAt
}


====================================================
4. NOTIFICATION SYSTEM
====================================================

Use existing notification module.

Implement notifications for:

- Comment on post
- React on post
- Admin announcement


Notification example:

{
 receiver,
 sender,
 type,
 message,
 isRead,
 createdAt
}


====================================================
5. LOST AND FOUND MODULE
====================================================

Create a new module:

lostFound


Features:

Students can:
- Create lost item report
- Create found item report
- Upload image using existing Cloudinary setup


Schema:

{
 title,
 description,
 type:"lost"|"found",
 image,
 location,
 contactInfo,
 createdBy,
 status,
 createdAt
}


Users can view lost/found posts.


====================================================
6. SEARCH AND FILTER
====================================================

Add search/filter support using existing QueryBuilder.

Support:

Posts:
- search title
- search description
- filter category


Announcements:
- search title


Lost and Found:
- search item name


====================================================
7. SECURITY REQUIREMENTS
====================================================

Maintain:

- JWT authentication
- Role based authorization
- bcrypt password security
- Zod validation
- Error handling system


All protected routes must use existing middleware.


====================================================
8. DATABASE DESIGN
====================================================

Use MongoDB + Mongoose.

Do not create unnecessary collections.

Use references where needed.

For posts:
Store comments and reactions inside the post document as arrays.


====================================================
9. CODE QUALITY
====================================================

For every module create:

module/
 ├── model.js
 ├── controller.js
 ├── service.js
 ├── routes.js
 ├── validation.js


Follow existing project style.


====================================================
10. DEVELOPMENT APPROACH
====================================================

Before coding:

1. Analyze existing models.
2. Analyze current authentication.
3. Analyze current middleware.
4. Analyze existing routes.
5. Then implement features step by step.

Do not generate everything at once.

Start with:
1. Improve Post Module
2. Complaint authorization system
3. Lost and Found module
4. Notification integration
5. Announcement improvements


Act as a senior developer reviewing and extending an existing production application.

```