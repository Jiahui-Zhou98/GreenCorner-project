import { ObjectId } from "mongodb";
import { connectDB } from "../db/connection.js";

export async function findUserByEmail(email) {
  const db = await connectDB();
  const users = db.collection("users");
  return users.findOne({ email: email.toLowerCase().trim() });
}

export async function findUserById(id) {
  const db = await connectDB();
  const users = db.collection("users");
  return users.findOne({ _id: new ObjectId(id) });
}
