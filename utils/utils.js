const crypto = require("crypto");
const { checkSchema, validationResult } = require("express-validator");

const hashBuilder = (value) => {
  const algorithm = "sha512";

  return crypto
    .createHmac(algorithm, process.env.SECRET)
    .update(value)
    .digest("hex");
};

const validateUserLogin = checkSchema({
  email: {
    isEmail: true,
  },
  password: {
    isString: true,
  },
});

const validateUserRegistration = checkSchema({
  email: { isEmail: true },
  name: { isString: true },
  password: { isStrongPassword: true },
});

const validateNewQuiz = checkSchema({
  title: { isString: true },
  questions: {
    custom: {
      options: (value) => {
        if (!Array.isArray(value)) {
          return false;
        }

        for (let i = 0; i < value.length; i++) {
          const element = value[i];
          const { questionText, type, answers } = element;
          if (
            questionText === undefined ||
            type === undefined ||
            answers === undefined ||
            !Array.isArray(answers) ||
            typeof type !== "string" ||
            typeof questionText !== "string"
          ) {
            return false;
          }
        }

        return true;
      },
    },
  },
});

const validateQuizEdit = checkSchema({
  quizId: { isString: true },
  title: { isString: true },
  questions: {
    custom: {
      options: (value) => {
        const { questionText, title, answers } = value;
        if (
          questionText === undefined ||
          title === undefined ||
          answers === undefined ||
          !Array.isArray(answers) ||
          typeof title !== "string" ||
          typeof questionText !== "string"
        ) {
          return false;
        }

        return true;
      },
    },
  },
});

const validatePublishQuiz = checkSchema({
  quizId: { isString: true },
});

const validateQuizSolution = checkSchema({
  quizId: { isString: true },
  answers: {
    custom: {
      options: (value) => {
        if (!Array.isArray(value)) {
          return false;
        }

        for (let i = 0; i < value.length; i++) {
          const el = value[i];

          if (typeof el !== "object") {
            return false;
          }

          const keys = Object.keys(el);
          if (keys.length !== 2) {
            return false;
          }

          if (!keys.includes("questionId") || !keys.includes("response")) {
            return false;
          }

          if (
            !Array.isArray(el.response) ||
            typeof el.questionId !== "string"
          ) {
            return false;
          }
        }

        return true;
      },
    },
  },
});

const checkValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

module.exports = {
  hashBuilder,
  validateUserLogin,
  validateUserRegistration,
  validateNewQuiz,
  validateQuizEdit,
  validatePublishQuiz,
  validateQuizSolution,
  checkValidation,
};
