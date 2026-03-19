import dotenv from "dotenv";
dotenv.config();
import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./db/connection.js";
import carePostsRouter from "./routes/carePosts.js";
import plantListingsRouter from "./routes/plantListings.js";
import usersRouter from "./routes/users.js";
import passport from "./config/passport.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// In production, serve the frontend build folder as static files
app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "greencorner-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/users", usersRouter);
app.use("/api/careposts", carePostsRouter);
app.use("/api/plant-listings", plantListingsRouter);

// For any non-API route, send back the React app (SPA fallback)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "dist", "index.html"));
});

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });
