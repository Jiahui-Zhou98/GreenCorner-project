# GreenCorner

A community platform for plant lovers to share plant care knowledge and exchange plants locally.

## Members

- Jiahui Zhou
- Yi-Peng Chiang

## Class Link

- [CS5610-2026-Spring](https://johnguerra.co/classes/webDevelopment_online_spring_2026/)
- This is Project3 for this class

## Website Link

- [GreenCorner]()
- Deployment: todo

## How to Use the Website

- [Slides]()

- [Video]()

## Project Link

- [GitHub Repo]()

## Project Description

## Project Objective

## Core Features

## Design Document

- [Find user stories and design mockup here]()

## Tech Stack

- **Frontend**: React 19 with Hooks, Vite, CSS3, JavaScript ES6 modules
- **Backend**: Node.js, Express
- **Database**: MongoDB (native Node.js driver)

## Project Structure

```
plant-community/
├── server/                          # Node.js + Express backend
│   ├── backend.js                   # Express server entry point
│   ├── db/
│   │   ├── connection.js            # MongoDB connection helper
│   │   ├── CarePostsDB.js           # CRUD methods for carePosts collection
│   │   └── PlantListingsDB.js       # CRUD methods for plantListings collection
│   ├── routes/
│   │   ├── carePosts.js             # API routes for /api/careposts
│   │   └── plantListings.js         # API routes for /api/listings
│   └── seed/
│       ├── seedCarePosts.js         # Seed script for care posts (1000 entries)
│       └── seedPlantListings.js     # Seed script for plant listings
│
└── frontend/                        # Vite + React frontend
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx                 # React entry point
        ├── App.jsx                  # Root component with routing
        ├── App.css
        ├── index.css
        ├── styles/
        │   └── main.css             # Global styles: layout, navbar, footer, design system
        ├── components/              # Shared components used across pages
        │   ├── Navbar.jsx           # Navigation bar (Home / About / Care Posts / Plant Listings)
        │   ├── Navbar.css
        │   ├── Footer.jsx
        │   └── Footer.css
        └── pages/
            ├── Home/
            │   ├── HomePage.jsx     # Landing page with platform intro
            │   └── HomePage.css
            ├── About/
            │   ├── AboutPage.jsx    # About the project and team
            │   └── AboutPage.css
            ├── CarePosts/
            │   ├── CarePostsPage.jsx          # Browse and filter care posts
            │   ├── CarePostsPage.css
            │   ├── CarePostDetailPage.jsx      # Full content of a single care post
            │   ├── CarePostDetailPage.css
            │   ├── CreateCarePostPage.jsx      # Form to create a new care post
            │   ├── CreateCarePostPage.css
            │   ├── EditCarePostPage.jsx        # Form to edit an existing care post
            │   ├── EditCarePostPage.css
            │   └── components/
            │       ├── CarePostCard.jsx        # Summary card linking to detail page
            │       ├── CarePostList.jsx        # Collection renderer (PropTypes required)
            │       └── CarePostFilter.jsx      # Filter bar (plant type, difficulty, tags)
            └── PlantListings/
                ├── PlantListingsPage.jsx       # Browse and filter plant listings
                ├── PlantListingsPage.css
                ├── ListingDetailPage.jsx       # Full detail of a single listing
                ├── ListingDetailPage.css
                ├── CreateListingPage.jsx       # Form to create a new listing
                ├── CreateListingPage.css
                ├── EditListingPage.jsx         # Form to edit an existing listing
                ├── EditListingPage.css
                └── components/
                    ├── ListingCard.jsx         # Summary card linking to detail page
                    ├── ListingList.jsx         # Collection renderer (PropTypes required)
                    └── ListingFilter.jsx       # Filter bar (type, price, location, free)
```

## Pages & Routes

| Page             | Route                 | Description                |
| ---------------- | --------------------- | -------------------------- |
| Home             | `/`                   | Platform landing page      |
| About            | `/about`              | Project and team info      |
| Care Posts       | `/careposts`          | Browse all care posts      |
| Care Post Detail | `/careposts/:id`      | Read a single care post    |
| Create Care Post | `/careposts/new`      | Submit a new care post     |
| Edit Care Post   | `/careposts/:id/edit` | Edit an existing care post |
| Plant Listings   | `/listings`           | Browse all plant listings  |
| Listing Detail   | `/listings/:id`       | View a single listing      |
| Create Listing   | `/listings/new`       | Submit a new listing       |
| Edit Listing     | `/listings/:id/edit`  | Edit an existing listing   |

## API Endpoints

| Method | Endpoint             | Description                           |
| ------ | -------------------- | ------------------------------------- |
| GET    | `/api/careposts`     | Get all care posts (supports filters) |
| GET    | `/api/careposts/:id` | Get a single care post                |
| POST   | `/api/careposts`     | Create a new care post                |
| PUT    | `/api/careposts/:id` | Update a care post                    |
| DELETE | `/api/careposts/:id` | Delete a care post                    |
| GET    | `/api/listings`      | Get all listings (supports filters)   |
| GET    | `/api/listings/:id`  | Get a single listing                  |
| POST   | `/api/listings`      | Create a new listing                  |
| PUT    | `/api/listings/:id`  | Update a listing                      |
| DELETE | `/api/listings/:id`  | Delete a listing                      |

## Work Distribution

- **[Your Name]** — Plant Care Posts: `carePosts` collection, `CarePostsDB.js`, `routes/carePosts.js`, seed script, and all Care Posts frontend pages.
- **[Teammate Name]** — Plant Listings: `plantListings` collection, `PlantListingsDB.js`, `routes/plantListings.js`, seed script, and all Plant Listings frontend pages.
- **Shared** — `backend.js`, `connection.js`, `Navbar`, `Footer`, and `main.css`.

## Screenshots

## Instructions (How to get started)

## License

MIT
