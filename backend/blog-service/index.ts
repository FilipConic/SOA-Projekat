import { Elysia } from "elysia";
import { blogRoutes } from "./src/routes/blog.routes";
import { commentRoutes } from "./src/routes/comment.routes";

const app = new Elysia()
  .use(blogRoutes)
  .use(commentRoutes)
  .listen(3000);

console.log("Blog service running on port 3000");