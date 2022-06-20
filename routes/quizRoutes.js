const express = require("express");
const apicache = require("apicache");

const quizRoutes = express.Router();
const { authenticateUser } = require("../middlewares/auth");
const {
  addQuiz,
  getQuizzes,
  deleteQuiz,
  editQuiz,
  updateQuiz,
  publishQuiz,
  getQuizScore,
  getSolutions,
  getStats,
  postSolution,
  getQuiz,
} = require("../controllers/quizControllers");
const {
  validateNewQuiz,
  validatePublishQuiz,
  validateQuizSolution,
  validateQuizEdit,
  checkValidation,
} = require("../utils/utils");

//init cache
let cache = apicache.middleware;

// add quiz
quizRoutes.post(
  "/",
  authenticateUser,
  validateNewQuiz,
  checkValidation,
  addQuiz
);

// get all quizzes
quizRoutes.get("/", authenticateUser, cache("1 minute"), getQuizzes);

// get solutions to all quizzes that a user has taken
quizRoutes.get("/solutions", authenticateUser, getSolutions);

// get quiz to edit
quizRoutes.get("/edit/:quizId", authenticateUser, editQuiz);

// submit quiz in order to save new infos
quizRoutes.put(
  "/edit",
  authenticateUser,
  validateQuizEdit,
  checkValidation,
  updateQuiz
);

// publish quiz
quizRoutes.post(
  "/publish",
  authenticateUser,
  validatePublishQuiz,
  checkValidation,
  publishQuiz
);

// get quiz score
quizRoutes.get("/score/:quizId", authenticateUser, getQuizScore);

// get stats for published quiz
quizRoutes.get("/stats", authenticateUser, getStats);

// post a solution to a quiz
quizRoutes.post(
  "/solution",
  authenticateUser,
  validateQuizSolution,
  checkValidation,
  postSolution
);

// get quiz
quizRoutes.get("/:quizId", authenticateUser, cache("5 minutes"), getQuiz);

// delete quiz
quizRoutes.delete("/:quizId", authenticateUser, deleteQuiz);

module.exports = quizRoutes;
