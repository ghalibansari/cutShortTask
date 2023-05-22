import { Application } from "express";
import { PostController } from "./modules/posts/post.controller";
import { TodoController } from "./modules/todo/todo.controller";
import { UserController } from "./modules/user/user.controller";

export function registerRoutes(app: Application): void {
  new TodoController().register(app);
  new UserController().register(app);
  new PostController().register(app);
}
