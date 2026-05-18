import { MongoClient } from "mongodb";

const uri = "mongodb://nikolina_aleksic:jasamadmin@ac-593vemv-shard-00-00.dndv2cr.mongodb.net:27017,ac-593vemv-shard-00-01.dndv2cr.mongodb.net:27017,ac-593vemv-shard-00-02.dndv2cr.mongodb.net:27017/?ssl=true&replicaSet=atlas-by8qg9-shard-0&authSource=admin&appName=Cluster0";
// process.env.MONGO_URI!;

if (!uri) {
	throw new Error("MONGO_URI is missing");
}

export const client = new MongoClient(uri);
export const db = client.db("blogdb");

// bun add mongodb
// npm install mongodb
