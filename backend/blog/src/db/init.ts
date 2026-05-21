import { client } from "./client";

export async function initDB() {
    await client.connect();
    console.log("Mongo connected");
}