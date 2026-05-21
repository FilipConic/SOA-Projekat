import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI!;

if (!uri) {
	throw new Error("MONGO_URI is missing");
}

export const client = new MongoClient(uri);
export const db = client.db("blogdb");

// bun add mongodb
// npm install mongodb