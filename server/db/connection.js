import { MongoClient } from "mongodb";

let db;

export async function connectDB() {
  if (!db) {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    db = client.db();
    console.log("Connected to MongoDB:", db.databaseName);
  }
  return db;
}
