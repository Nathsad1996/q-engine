const mongoose = require("mongoose");

const { Quiz, Solution } = require("../models/quiz");

const addQuiz = async (req, res) => {
  try {
    let quiz = req.body;

    const quizzes = await Quiz.find({ title: quiz.title });

    if (quizzes.length !== 0) {
      return res.json({
        success: false,
        message: "we can't have two quiz with the same title",
      });
    }

    let questions = quiz.questions;

    if (questions.length > 10 || questions.length < 1) {
      return res.json({
        success: false,
        message: "quiz should have a least one question",
      });
    }

    for (let i = 0; i < questions.length; i++) {
      // getting elements
      let el = questions[i];

      // check if all questions are following our rules
      if (
        el.type === "multiple" &&
        (el.answers.length < 2 || el.answers.length > 5)
      ) {
        return res.json({
          success: false,
          message: "multiple choice questions should have 2-5 responses",
        });
      } else if (el.type === "single" && el.answers.length !== 2) {
        return res.json({
          success: false,
          message: "single choice questions should have only 2 responses",
        });
      } else if (!["single", "multiple"].includes(el.type)) {
        return res.json({
          success: false,
          message: "question type should be either mulitple or single",
        });
      }

      // format question
      let questionText = el.questionText + " (";
      el.answers.forEach(
        (answer) => (questionText += answer.answerText + " / ")
      );

      const length = questionText.length;
      questionText = questionText.slice(0, length - 2) + ")";
      el.questionText = questionText;
    }

    quiz.questions = questions;

    quiz.createdBy = req.user._id.toString();

    const id = new mongoose.Types.ObjectId();
    quiz.url = `http://localhost:5000/quiz/${id}`;
    quiz._id = id;

    Quiz.create(quiz, (err, quiz) => {
      if (err) {
        return res.json({
          success: false,
          error: "can't create quiz",
        });
      }

      return res.json({
        success: true,
        message: "quiz created successfully",
        quiz: quiz,
      });
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "unable to add quiz",
    });
  }
};

const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ status: "PUBLISHED" }).exec();

    return res.json({
      success: true,
      quizzes: quizzes,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "unable to get all quizzes",
    });
  }
};

const getQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findOne({
      _id: quizId,
      status: "PUBLISHED",
    }).exec();

    if (quiz == null) {
      return res.json({
        success: false,
        message: "there's no quiz",
      });
    }
    return res.json({
      success: true,
      quiz: quiz,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "unable to get quiz",
    });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    Quiz.deleteOne({ _id: quizId }, (err, result) => {
      if (err) {
        return res.json({
          success: false,
          message: "unable to delete quiz",
        });
      }

      if (result.deletedCount === 0) {
        return res.json({
          success: false,
          message: "unable to find requested quiz in the system",
        });
      }

      return res.json({ success: true, message: "quiz deleted successfully!" });
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "unable to delete",
    });
  }
};

const editQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findOne({ _id: quizId, status: "PENDING" }).exec();

    if (quiz == null) {
      return res.json({
        success: false,
        message: "unable to find quiz for editing",
      });
    }

    return res.json({
      success: true,
      quiz: quiz,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "unable to get quiz to edit",
    });
  }
};

const updateQuiz = async (req, res) => {
  try {
    const { quizId } = req.body;

    delete req.body.quizId;

    Quiz.updateOne({ _id: quizId }, req.body, (err, result) => {
      if (err) {
        return res.json({
          success: false,
          message: "error while updating quiz",
        });
      }

      if (result.modifiedCount == 0) {
        return res.json({
          success: false,
          message: "there's no quiz to update",
        });
      }

      return res.json({
        success: true,
        message: "quiz updated successfully!",
      });
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "unable to update quiz infos",
    });
  }
};

const publishQuiz = async (req, res) => {
  try {
    const { quizId } = req.body;

    Quiz.updateOne({ _id: quizId }, { status: "PUBLISHED" }, (err, result) => {
      if (err) {
        return res.json({
          success: false,
          message: "unable to update quiz status",
        });
      }

      if (result.modifiedCount == 0) {
        return res.json({
          success: false,
          message: "there's no quiz to publish",
        });
      }

      return res.json({
        success: true,
        message: "your quiz has been published successfully",
      });
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "unable to publish quiz",
    });
  }
};

const getQuizScore = async (req, res) => {
  try {
    const { quizId } = req.params;

    // check if the quiz exists
    const quiz = await Quiz.find({ _id: quizId }).exec();

    if (quiz == null) {
      return res.json({
        success: false,
        message: "this quiz doesn't exists or has been deleted",
      });
    }

    const solution = await Solution.findOne({
      quizId: quizId,
      userId: req.user._id.toString(),
    }).exec();

    if (solution == null) {
      return res.json({
        success: false,
        message: "you not yet submit solution to this quiz",
      });
    }

    return res.json({
      success: true,
      score: solution.score,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "unable to get quiz score",
    });
  }
};

const getSolutions = async (req, res) => {
  try {
    const solutions = await Solution.find({
      userId: req.user._id.toString(),
    }).exec();

    if (solutions.length === 0) {
      return res.json({
        success: false,
        message: "you don't have any solution",
      });
    }

    return res.json({
      success: true,
      solutions: solutions,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "unable to get solutions",
    });
  }
};

const getStats = async (req, res) => {
  try {
    // get all quizzes published by the user
    const quizzes = await Quiz.find({
      createdBy: req.user._id.toString(),
    }).exec();

    if (quizzes.length === 0) {
      return res.json({
        success: false,
        message: "you don't have any published quiz",
      });
    }

    let quizzesSolutions = {};

    for (let i = 0; i < quizzes.length; i++) {
      const element = quizzes[i];
      const solutions = await Solution.find({ quizId: element._id.toString() });
      quizzesSolutions[`${element.title}`] = solutions;
    }

    return res.json({
      success: true,
      stats: quizzesSolutions,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "unable to get quizzes status",
    });
  }
};

const postSolution = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    let score = 0;
    // check if user have already submit solution for this quiz
    const checkSolutions = await Solution.find({
      quizId: quizId,
      userId: req.user._id.toString(),
    }).exec();

    if (checkSolutions.length !== 0) {
      return res.json({
        success: false,
        message: "you have already solve this quiz",
      });
    }

    const solution = {};
    const tempQuiz = await Quiz.findOne({ _id: quizId }).exec();

    if (tempQuiz === null) {
      return res.json({
        success: false,
        message: "unable to get quiz",
      });
    }

    const { questions, createdBy } = tempQuiz;

    // check if the id of user that submit solution is different of user that create it
    if (req.user._id.toString() === createdBy) {
      return res.json({
        success: false,
        message: "you can't solve your own quiz",
      });
    }

    solution.quizId = quizId;
    solution.userId = req.user._id.toString();
    solution.score = 0;
    solution.responses = [];

    const questionLength = questions.length;
    for (let i = 0; i < questionLength; i++) {
      const question = questions[i];
      const answer = answers.find(
        (el) => el.questionId === question._id.toString()
      );

      if (answer) {
        const userResponse = answer.response;
        const questionAnswer = question.answers;

        const questionAnswerLength = questionAnswer.length;
        const correctQuestionAnswerLength = questionAnswer.filter(
          (el) => el.isCorrect === true
        ).length;
        const incorrectQuestionAnswerLength = questionAnswer.filter(
          (el) => el.isCorrect === false
        ).length;

        const userResponseLength = userResponse.length;

        let correctAnswer = 0;

        if (
          userResponseLength > questionAnswerLength ||
          userResponseLength === 0
        ) {
          return res.json({
            success: false,
            message:
              "you submit a illegal number of response, responses' number should be between 1 and 5 include",
          });
        }

        if (userResponseLength != 0) {
          userResponse.forEach((response) => {
            const searchedAnswer = questionAnswer.find(
              (el) => el.answerText === response
            );

            if (searchedAnswer) {
              correctAnswer +=
                searchedAnswer.isCorrect === true
                  ? 1 / correctQuestionAnswerLength
                  : -(1 / incorrectQuestionAnswerLength);
            } else {
              correctAnswer += -(1 / incorrectQuestionAnswerLength);
            }
          });
        }
        score += correctAnswer * 100;

        solution.responses.push({
          questionId: question._id.toString(),
          answer: answer.response,
          responseScore: correctAnswer * 100,
        });
        solution.score = score / questionLength;
      }
    }

    Solution.create(solution, (err, returnSolution) => {
      if (err) {
        return res.json({
          success: false,
          message: "unable to save solution",
        });
      }

      return res.json({
        success: true,
        message: "solution saved",
        solution: returnSolution,
      });
    });
  } catch (error) {
    return res.json({ success: false, message: "unable to submit solution" });
  }
};

module.exports = {
  addQuiz,
  getQuizzes,
  getQuiz,
  deleteQuiz,
  editQuiz,
  updateQuiz,
  publishQuiz,
  getQuizScore,
  getSolutions,
  getStats,
  postSolution,
};
