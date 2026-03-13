import dotenv from "dotenv";
dotenv.config();
import express from "express";
import session from "express-session";
import { connectDB } from "./db/connection.js";
import carePostsRouter from "./routes/carePosts.js";
import plantListingsRouter from "./routes/plantListings.js";
import usersRouter from "./routes/users.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

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

app.use("/api/users", usersRouter);
app.use("/api/careposts", carePostsRouter);
app.use("/api/plant-listings", plantListingsRouter);

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
