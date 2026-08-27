import { Router } from "express";
import { Role } from "../user/user.model.js";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { multerUpload } from "../../config/multer.config.js";
import { postController } from "./post.controller.js";
import {
  commentPostSchema,
  createPostSchema,
  reactPostSchema,
  updatePostSchema,
} from "./post.validation.js";

const postRouter = Router();

const allRoles = Object.values(Role);

postRouter.post(
  "/",
  checkAuth(...allRoles),
  multerUpload.single("file"),
  validateRequest(createPostSchema),
  postController.createPost,
);

postRouter.get("/", checkAuth(...allRoles), postController.getPosts);

postRouter.get(
  "/my-posts",
  checkAuth(...Object.values(Role)),
  postController.getMyPosts,
);

postRouter.get(
  "/author/:authorId",
  checkAuth(...Object.values(Role)),
  postController.getPostsByAuthorId,
);

postRouter.get("/:id", checkAuth(...allRoles), postController.getPostById);

postRouter.patch(
  "/:id",
  checkAuth(...allRoles),
  validateRequest(updatePostSchema),
  postController.updatePost,
);

postRouter.delete("/:id", checkAuth(...allRoles), postController.deletePost);

postRouter.post(
  "/:id/reactions",
  checkAuth(...allRoles),
  validateRequest(reactPostSchema),
  postController.reactToPost,
);

postRouter.post(
  "/:id/comments",
  checkAuth(...allRoles),
  validateRequest(commentPostSchema),
  postController.addComment,
);

postRouter.delete(
  "/:id/comments/:commentId",
  checkAuth(...allRoles),
  postController.deleteComment,
);

export default postRouter;
