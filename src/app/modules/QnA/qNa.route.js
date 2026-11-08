import { Router } from "express";
import { Role } from "../user/user.model.js";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { qnaController } from "./qNa.controller.js";
import {
  createQuestionSchema,
  updateQuestionSchema,
  solvedSchema,
  addCommentSchema,
} from "./qNa.validation.js";

const qnaRouter = Router();

const allRoles = Object.values(Role);

qnaRouter.post(
  "/",
  checkAuth(...allRoles),
  validateRequest(createQuestionSchema),
  qnaController.createQuestion,
);

// ---------- public ----------
qnaRouter.get("/", qnaController.getAllQuestions);

// ---------- authenticated (must stay above "/:id") ----------
qnaRouter.get("/me", checkAuth(...allRoles), qnaController.getMyQuestions);

// ---------- public ----------
qnaRouter.get("/:id", qnaController.getQuestionById);

// ---------- authenticated ----------
qnaRouter.patch(
  "/:id",
  checkAuth(...allRoles),
  validateRequest(updateQuestionSchema),
  qnaController.updateQuestion,
);

qnaRouter.patch(
  "/:id/solved",
  checkAuth(...allRoles),
  validateRequest(solvedSchema),
  qnaController.setSolvedStatus,
);

qnaRouter.delete("/:id", checkAuth(...allRoles), qnaController.deleteQuestion);

qnaRouter.post(
  "/:id/comments",
  checkAuth(...allRoles),
  validateRequest(addCommentSchema),
  qnaController.addComment,
);

qnaRouter.delete(
  "/:id/comments/:commentId",
  checkAuth(...allRoles),
  qnaController.deleteComment,
);

export default qnaRouter;
