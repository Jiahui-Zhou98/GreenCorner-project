# GreenCorner

A community platform for plant lovers to share plant care knowledge and exchange plants locally.

## Members

- Jiahui Zhou
- Yi-Peng Chiang

## Class Link

- [CS5610-2026-Spring](https://johnguerra.co/classes/webDevelopment_online_spring_2026/)
- This is Project3 for the class

## Website Link

- [GreenCorner]()
- Deployment: todo

## How to Use the Website

- [Slides]()
- [Video]()

## Project Link

- [GitHub Repo](https://github.com/Jiahui-Zhou98/GreenCorner-project)

## Project Description

GreenCorner is a community platform for plant lovers to both share plant care knowledge and exchange plants locally. Many beginners struggle to find practical advice for watering, lighting, propagation, and plant health, while experienced plant owners often have extra plants, cuttings, or unwanted pots they want to sell, give away, or rehome. GreenCorner brings these two needs together in one space.

## Project Objective

- Help beginners find trustworthy, community-sourced plant care advice
- Allow experienced plant owners to share care knowledge through posts
- Enable users to list plants for free adoption, sale, or rehoming
- Connect budget-conscious plant lovers with affordable or free local plants

## Core Features

**Plant Care Posts**

- Browse and filter care posts by plant type, difficulty, and tags
- Read full care guides including watering, lighting, and propagation tips
- Create, edit, and delete your own care posts
- Mark posts as beginner-friendly or low-maintenance

**Plant Listings**

- Browse plant listings filtered by type, price, location, condition, and status
- View detailed listing pages with full description and seller contact info
- Create listings marked as free, for sale, or rehoming
- Edit and delete your own listings

## Design Document

- [Find user stories and design mockup here](./design_doc/DesignDoc.md)

## Tech Stack

- **Frontend**: React 19 with Hooks, Vite, CSS3, JavaScript ES6 modules, React Router, React Bootstrap
- **Backend**: Node.js, Express
- **Database**: MongoDB (native Node.js driver, no Mongoose)
- **No prohibited libraries**: no Axios, no Mongoose, no cors helper libraries

## Project Structure

```
plant-community/
├── server/                              # Node.js + Express backend
│   ├── backend.js                       # Express server entry point (express-session)
│   ├── db/
│   │   └── connection.js                # MongoDB singleton connection
│   ├── routes/
│   │   ├── carePosts.js                 # API routes for /api/careposts
│   │   ├── plantListings.js             # API routes for /api/plant-listings
│   │   └── users.js                     # API routes for /api/users (auth)
│   └── seed/
│       ├── seedCarePosts.js             # Seed script for care posts
│       └── seedPlantListings.js         # Seed script for plant listings (1000 entries)
│
├── frontend/                            # Vite + React frontend
│   ├── index.html
│   ├── public/                          # Static assets (favicon, manifest icons, banner)
│   ├── .gitignore
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── .prettierrc
│   ├── package.json
│   └── src/
│       ├── main.jsx                     # React entry point with BrowserRouter
│       ├── App.jsx                      # Root component with route definitions
│       ├── styles/
│       │   └── main.css                 # Global CSS variables, layout, typography
│       ├── assets/
│       │   └── about/                   # Images for the About page bubble hero
│       ├── context/
│       │   ├── AuthContextDef.js        # React context object (createContext)
│       │   ├── AuthContext.jsx          # AuthProvider component (session check, login, register, logout)
│       │   └── useAuth.js               # useAuth hook
│       ├── components/
│       │   ├── Navbar.jsx / Navbar.css  # Sticky navigation bar
│       │   └── Footer.jsx / Footer.css  # Site footer
│       └── pages/
│           ├── Home/
│           │   ├── HomePage.jsx
│           │   └── HomePage.css
│           ├── About/
│           │   ├── AboutPage.jsx / AboutPage.css
│           │   └── BubbleHero.jsx / BubbleHero.css
│           ├── Auth/
│           │   ├── RegisterPage.jsx     # User registration page
│           │   ├── LoginPage.jsx        # User login page
│           │   └── AuthPages.css        # Shared styles for auth pages
│           ├── Dashboard/
│           │   ├── DashboardPage.jsx
│           │   └── DashboardPage.css
│           ├── CarePosts/
│           │   ├── CarePostsPage.jsx / CarePostsPage.css
│           │   ├── CarePostDetailPage.jsx / CarePostDetailPage.css
│           │   ├── CreateCarePostPage.jsx
│           │   ├── EditCarePostPage.jsx
│           │   ├── CarePostForm.jsx / CarePostForm.css
│           │   └── PostPageLayout.css       # Shared layout for create/edit pages
│           └── PlantListings/
│               ├── PlantListingsPage.jsx / PlantListingsPage.css
│               ├── ListingCard.jsx          # Single listing card component
│               ├── ListingDetailPage.jsx / ListingDetailPage.css
│               ├── CreateListingPage.jsx
│               ├── EditListingPage.jsx
│               ├── ListingForm.jsx / ListingForm.css
│               └── ListingPageLayout.css    # Shared layout for create/edit pages
│
├── design_doc/
│   ├── DesignDoc.md                     # Design document with data models and mockups
│   └── mockup/                          # UI mockup images
│
├── .env.example                         # Environment variable template
├── .gitignore
├── .prettierrc
├── eslint.config.js
├── LICENSE
├── package.json                         # Backend dependencies and scripts
└── README.md
```

## Work Distribution

- **Yi-Peng Chiang** — Plant Care Posts: `carePosts` collection, `routes/carePosts.js`, seed script, and all Care Posts frontend pages. Also responsible for Home page.
- **Jiahui Zhou** — Plant Listings: `plantListings` collection, `routes/plantListings.js`, seed script, and all Plant Listings frontend pages. Also responsible for About page and shared UI components (Navbar, Footer).

- **Shared Work** — Register page, Login page and Dashboard page.

## Screenshots

## Instructions (How to get started)

### Prerequisites

- Node.js v18+
- MongoDB running locally on port 27017

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Jiahui-Zhou98/GreenCorner-project.git
   cd GreenCorner-project
   ```

2. Create a `.env` file in the root directory:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set your MongoDB connection string:

   ```
   MONGODB_URI=mongodb://localhost:27017/greencorner
   PORT=3000
   ```

3. Install backend dependencies:

   ```bash
   npm install
   ```

4. Install frontend dependencies:

   ```bash
   cd frontend && npm install && cd ..
   ```

5. Seed the database:
   ```bash
   npm run seed:listings
   npm run seed:careposts
   ```

### Running the app

Open two terminals:

**Terminal 1 — Backend:**

```bash
npm run dev
```

Backend runs on `http://localhost:3000`

**Terminal 2 — Frontend:**

```bash
cd frontend && npm run dev
```

Frontend runs on `http://localhost:5173`

## License

MIT
