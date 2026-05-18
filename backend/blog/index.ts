import { Elysia } from "elysia";
import { blogRoutes } from "./src/routes/blog.routes";
import { commentRoutes } from "./src/routes/comment.routes";
import { createGrpcServer } from "./src/grpc";
import { initDB } from "./src/db/init";

await initDB(); // prvo se povezi na mongo [bazu], pa tek onda pokreni server

const app = new Elysia()
  .get("/health", () => "ZIV SAM ZDRAV SAM")
  .use(blogRoutes)
  .use(commentRoutes)
  .listen(3000);

console.log("Blog service running on port 3000");

createGrpcServer(50051);
