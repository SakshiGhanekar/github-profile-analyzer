# GitHub Profile Analyzer API 🚀

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v4-blue.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-v8+-orange.svg)](https://www.mysql.com/)
[![Redis](https://img.shields.io/badge/Redis-v6+-red.svg)](https://redis.io/)
[![Swagger](https://img.shields.io/badge/Swagger-API%20Docs-85EA2D.svg)](https://swagger.io/)

## 1. Project Overview

The **GitHub Profile Analyzer API** is a robust backend service designed to fetch, analyze, and store GitHub user profiles and repository data. Built with Node.js, Express, and MySQL, it goes beyond basic data fetching by computing custom profile scores, tracking account ages, and determining a user's most used programming language based on their public repositories.

## 2. Features

- **Deep GitHub Integration:** Fetches user profiles and aggregates analytics from up to 100 recent repositories.
- **Custom Scoring Logic:** Evaluates profiles based on a weighted scoring system (followers, public repos, and total stars).
- **Caching Layer:** Utilizes **Redis** to cache GitHub API responses for 1 hour, reducing rate limits and improving response times.
- **Data Persistence:** Uses **Sequelize ORM** to sync and store analyzed profiles in a **MySQL** database.
- **Interactive Documentation:** Fully integrated **Swagger UI** for testing and exploring API endpoints.
- **Production Ready:** Includes **Joi** request validation, **Express Rate Limiting** (100 req/15min), centralized error handling, and **Morgan** HTTP request logging.

---

## 3. Folder Structure

```text
github-profile-analyzer/
│
├── src/
│   ├── config/             # Database, Redis, and Swagger configurations
│   ├── controllers/        # Request handling and response logic
│   ├── middleware/         # Rate Limiting, Joi Validation, Error Handling
│   ├── models/             # Sequelize Database Models
│   ├── routes/             # Express routing definitions
│   ├── services/           # External API calls (GitHub API) & Caching (Redis)
│   ├── utils/              # Custom analytics and scoring algorithms
│   └── app.js              # Express application bootstrap
│
├── .env.example            # Example environment variables
├── package.json            # Node.js dependencies and scripts
├── schema.sql              # Raw SQL Database Schema
└── server.js               # Application Entry Point
```

---

## 4. Installation Steps

1. **Clone the repository** (or navigate to the directory):
   ```bash
   cd github-profile-analyzer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start Redis Server:**
   Ensure you have a Redis server running locally. If you have Docker:
   ```bash
   docker run -d -p 6379:6379 --name redis redis
   ```

4. **Run the application:**
   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

---

## 5. Environment Variables

Create a `.env` file in the root directory by copying the example file:
```bash
cp .env.example .env
```

Ensure your `.env` contains:
```env
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=github_analyzer

# Redis Cache URL
REDIS_URL=redis://localhost:6379

# GitHub API (Optional but recommended to avoid rate limits)
GITHUB_TOKEN=your_personal_access_token
```

---

## 6. Database Setup

1. Open your MySQL client or CLI.
2. Create the database:
   ```sql
   CREATE DATABASE github_analyzer;
   ```
3. *(Optional)* Run the raw queries found in `schema.sql`.
4. **Note:** Sequelize is configured with `.sync({ alter: true })` inside `server.js`, meaning it will automatically create or alter the tables for you when you start the server!

---

## 7. API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/health` | Enhanced health check (verifies MySQL connection). |
| **POST** | `/api/github/analyze/:username` | Fetches, analyzes, and saves a GitHub profile to the database. |
| **GET** | `/api/github/profiles` | Fetches all stored profiles (supports pagination, search, and sorting). |
| **GET** | `/api/github/profile/:username` | Fetches a single analyzed profile from the database by username. |
| **DELETE** | `/api/github/profile/:username` | Deletes a stored profile from the database. |

---

## 8. Swagger Usage

The API is fully documented using **Swagger UI**. Once the server is running, you can access the interactive documentation via your browser:

👉 **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

From there, you can view the schemas, read detailed endpoint descriptions, and execute test requests directly against the API.

---

## 9. Sample Requests

### Analyze a new profile (POST)
```bash
curl -X POST http://localhost:3000/api/github/analyze/torvalds
```

### Search and Sort Profiles (GET)
```bash
curl -X GET "http://localhost:3000/api/github/profiles?page=1&limit=5&search=tor&sortBy=profile_score&order=DESC"
```

---

## 10. Sample Responses

### Success Response (`POST /api/github/analyze/torvalds`)
```json
{
  "success": true,
  "message": "Profile analyzed successfully",
  "data": {
    "id": 1,
    "github_id": 1024025,
    "username": "torvalds",
    "name": "Linus Torvalds",
    "bio": null,
    "company": "Linux Foundation",
    "location": "Portland, OR",
    "public_repos": 7,
    "followers": 195000,
    "following": 0,
    "account_age_days": 4350,
    "profile_score": 110,
    "total_stars": 156000,
    "most_used_language": "C",
    "avatar_url": "https://avatars.githubusercontent.com/u/1024025?v=4",
    "github_url": "https://github.com/torvalds",
    "created_at": "2024-05-29T10:00:00.000Z",
    "updated_at": "2024-05-29T10:00:00.000Z"
  }
}
```

### Error Response (Rate Limit Exceeded)
```json
{
  "success": false,
  "error": "Too many requests from this IP, please try again after 15 minutes"
}
```

### Error Response (Joi Validation Failure)
```json
{
  "success": false,
  "error": "Invalid GitHub username format"
}
```

---

## 11. Future Improvements

- **Authentication:** Add JWT-based authentication for the API endpoints to restrict access.
- **Automated Testing:** Implement unit and integration tests using Jest and Supertest.
- **Dockerization:** Create a `docker-compose.yml` file to spin up the Node app, MySQL, and Redis seamlessly.
- **GraphQL API:** Expose a GraphQL endpoint alongside REST for more flexible client queries.
- **Cron Jobs:** Implement a background job to periodically refresh cached or outdated profiles stored in the database.
