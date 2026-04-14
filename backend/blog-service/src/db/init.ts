import { pool } from "./client";

async function initDb() {
	await pool.query(`
		 CREATE TABLE IF NOT EXISTS blogs (
			 id SERIAL PRIMARY KEY,
			 user_id VARCHAR(100) NOT NULL,
			 title VARCHAR(255) NOT NULL,
			 description TEXT NOT NULL,
			 created_at TIMESTAMP DEFAULT NOW(),
			 images TEXT[]
		 );

		 CREATE TABLE IF NOT EXISTS comments (
			 id SERIAL PRIMARY KEY,
			 blog_id INT REFERENCES blogs(id),
			 user_id VARCHAR(100) NOT NULL,
			 text TEXT NOT NULL,
			 created_at TIMESTAMP DEFAULT NOW(),
			 updated_at TIMESTAMP DEFAULT NOW()
		 );

		 CREATE TABLE IF NOT EXISTS likes (
			 id SERIAL PRIMARY KEY,
			 blog_id INT REFERENCES blogs(id),
			 user_id VARCHAR(100) NOT NULL,
			 liked_at TIMESTAMP DEFAULT NOW()
		 );`
	);
	console.log("Tables created successfully!");
	process.exit(0);
}

initDb();
