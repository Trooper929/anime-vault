# Anime Vault

A full-stack anime tracking web application where users can browse anime sourced from the MyAnimeList database, save titles to a personal vault, track watch status, rate anime, and view personalized stats.

---

## Features

- **JWT Authentication** — Secure register and sign-in flow using email and password
- **Anime of the Day** — A featured anime displayed on the sign-in page and home page, cached server-side and refreshed daily
- **Browse Anime** — Search, top anime, and seasonal tabs with genre filtering and pagination
- **Personal Vault** — Save anime, set a watch status (Planned / Watching / Completed), and rate titles 1–10 with a star rating UI
- **Vault Filtering and Sorting** — Filter and sort your vault by status, title, score, or date added
- **Stats Page** — Total saved count, animated status breakdown bars, average personal score, and completion rate
- **Polished UI** — Loading skeletons, toast notifications, page transitions, staggered card animations, and a splash screen
- **Responsive Layout** — Mobile-friendly design with a hamburger navigation menu

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI library |
| React Router v7 | Client-side routing |
| Vite | Build tool and dev server |
| Axios | HTTP client |
| CSS (custom theme) | Styling |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database and ODM |
| JSON Web Tokens (JWT) | Authentication |
| bcrypt | Password hashing |

### External API
| API | Purpose |
|---|---|
| Jikan API | MyAnimeList data (anime info, search, seasonal, top charts) |

---

## Project Structure

```
anime-vault/
├── server/                        # Express backend
│   ├── models/
│   │   ├── User.js
│   │   └── Favorite.js
│   ├── routes/
│   │   ├── authRouter.js
│   │   ├── favoritesRouter.js
│   │   └── animeOfTheDayRouter.js
│   └── middleware/
│       └── authMiddleware.js
│
└── AnimeApi/                      # React frontend
    └── src/
        ├── pages/
        │   ├── Home.jsx
        │   ├── Browse.jsx
        │   ├── Details.jsx
        │   ├── Vault.jsx
        │   ├── Stats.jsx
        │   ├── SignIn.jsx
        │   └── SignUp.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── AnimeOfTheDayCard.jsx
        │   ├── StarRating.jsx
        │   ├── SkeletonCard.jsx
        │   ├── GenreFilter.jsx
        │   ├── Pagination.jsx
        │   ├── ToastContainer.jsx
        │   ├── SplashScreen.jsx
        │   └── PrivateRoute.jsx
        ├── context/
        │   ├── AuthContext.jsx
        │   ├── FavoritesContext.jsx
        │   └── ToastContext.jsx
        └── services/
            ├── authApi.js
            ├── favoritesApi.js
            └── jikanApi.js
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/) instance (local or MongoDB Atlas)
- npm

### Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory (see [Environment Variables](#environment-variables) below), then start the development server:

```bash
npm run dev
```

The backend will run on **port 9000** by default.

### Frontend Setup

```bash
cd AnimeApi
npm install
npm run dev
```

The frontend will run on Vite's default port **5173**. Vite is configured to proxy all `/api` requests to the backend at `localhost:9000`.

---

## Environment Variables

Create a `.env` file inside the `server/` directory with the following variables:

```env
MONGO_URI=your_mongodb_connection_string
PORT=9000
JWT_SECRET=your_jwt_secret_key
```

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string (local or Atlas) |
| `PORT` | Port the Express server listens on (default: `9000`) |
| `JWT_SECRET` | Secret key used to sign and verify JWT tokens |

> Never commit your `.env` file to version control. A `.env.example` file is included in the repository as a reference.
