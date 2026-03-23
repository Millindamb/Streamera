# Backend Project – Chai aur Backend

This repository represents my backend learning project built while completing the **"Chai aur Backend"** series. The goal of this project is to understand and implement **real-world backend development concepts** using **JavaScript, Node.js, Express, and MongoDB**.

The project follows proper backend architecture with clean folder structure, authentication, error handling, and media handling using cloud services.

---

## Project Overview – YouTube‑like Video Platform Backend

This project is a **YouTube‑like video platform backend server** built to handle core functionalities such as **users, videos, tweets/posts, likes, comments, playlists, subscriptions, and dashboards**. It focuses purely on backend logic, APIs, authentication, and database design.

The backend is designed to be scalable and modular, following industry‑standard practices.

---

## What I Learned & Implemented

### User Management

* User registration and login
* JWT‑based authentication
* Access token & refresh token flow
* Secure logout and token rotation
* Profile handling

### Video Management

* Video upload using **multer**
* Cloudinary integration for video & thumbnail storage
* Store video metadata in MongoDB
* Like, comment, and playlist support for videos

### Comments System

* Add comments on videos and tweets
* Nested comment handling (basic)
* Fetch comments by content ID

### Likes System

* Like/unlike videos, comments, and tweets
* Single like model used across multiple content types

### Playlists

* Create and manage playlists
* Add/remove videos from playlists
* Fetch user‑specific playlists

### Tweets / Posts

* Short text‑based posts (tweet‑like)
* Like and comment support

### Subscriptions

* Subscribe/unsubscribe to channels
* Track subscribers and subscriptions

### Dashboard

* Creator dashboard controller
* Fetch aggregated stats (videos, likes, subscribers, views)

### Error Handling

* Centralized error handling middleware
* Custom **ApiError** and **ApiResponse** utilities
* Consistent API responses

---

## Tech Stack

* **Backend Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB
* **ODM:** Mongoose
* **Authentication:** JWT (Access & Refresh Tokens)
* **Media Storage:** Cloudinary
* **Cookies:** cookie-parser
* **Environment Variables:** dotenv

---

## Project Structure

````bash
src/
│── controllers/
│   ├── user.controller.js        # User auth & profile
│   ├── video.controller.js       # Video upload & management
│   ├── comment.controller.js     # Comments logic
│   ├── like.controller.js        # Like/unlike system
│   ├── playlist.controller.js    # Playlists handling
│   ├── subscription.controller.js# Channel subscriptions
│   ├── tweet.controller.js       # Tweet‑like posts
│   ├── dashboard.controller.js   # Creator dashboard stats
│   └── healthcheck.controller.js # Server health check
│
│── models/
│   ├── user.model.js
│   ├── video.model.js
│   ├── comment.model.js
│   ├── like.model.js
│   ├── playlist.model.js
│   ├── subscription.model.js
│   └── tweet.model.js
│
│── routes/
│   ├── comment.routes.js
│   ├── dashboard.routes.js
│   ├── like.routes.js
│   ├── playlist.routes.js
│   ├── subscription.routes.js
│   ├── tweet.routes.js
│   ├── user.routes.js
│   └── video.routes.js
│
│── middlewares/
│   ├── auth.middleware.js        # JWT authentication
│   └── multer.middleware.js      # File uploads
│
│── db/
│   └── index.js                  # MongoDB connection
│
│── utils/                        # ApiError, ApiResponse, helpers
│── app.js                        # Express app setup
│── index.js                      # Server entry point
```bash
src/
│── controllers/     # Business logic
│── models/          # Mongoose schemas
│── routes/          # API routes
│── middlewares/     # Auth & error middleware
│── utils/           # Helper functions
│── config/          # DB & cloudinary config
│── app.js           # Express app setup
│── index.js         # Server entry point
````

---

## Features

* YouTube‑like backend architecture
* JWT authentication with refresh tokens
* Secure cookie‑based auth
* Video & image upload with Cloudinary
* Like, comment, and playlist systems
* Tweet/post support
* Channel subscriptions
* Creator dashboard analytics
* Centralized error handling
* Clean RESTful APIs

---

## Model / Architecture Diagram

[Click here to view the backend architecture diagram](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj?origin=share)

---

## Learning Purpose

This project is **not production-ready** but is designed to:

* Understand backend fundamentals
* Practice real-world backend patterns
* Build confidence in API development
* Prepare for internships and backend roles

---

## Future Improvements

* Role-based access control (RBAC)
* Pagination and filtering
* Rate limiting
* API documentation with Swagger
* Unit and integration tests

---

## Acknowledgement

This project is inspired by and built while learning from the **Chai aur Backend** series by **Hitesh Choudhary**.

---

### If you find this project helpful, consider giving it a star