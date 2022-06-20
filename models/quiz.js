const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
  answerText: String,
  isCorrect: Boolean,
});

const QuestionSchema = new mongoose.Schema({
  questionText: String,
  type: String,
  answers: [AnswerSchema],
  updatedAt: { type: Date, default: Date.now },
});

const ResponseSchema = new mongoose.Schema({
  questionId: String,
  answer: Array,
  responseScore : Number
});

const SolutionSchema = new mongoose.Schema({
  quizId: String,
  userId: String,
  responses: [ResponseSchema],
  score: Number,
});

const QuizSchema = new mongoose.Schema({
  title: String,
  createdBy: String,
  url: String,
  status: { type: String, default: "PENDING" },
  questions: [QuestionSchema],
  updatedAt: { type: Date, default: Date.now },
});

let Answer = mongoose.model("Answer", AnswerSchema);
let Question = mongoose.model("Question", QuestionSchema);
let Quiz = mongoose.model("Quiz", QuizSchema);
let Solution = mongoose.model("Solution", SolutionSchema);
let Response = mongoose.model("Response", ResponseSchema);

module.exports = { Quiz, Solution };
