const expect = require("chai").expect;
const fetch = require("node-fetch");
const url = "http://localhost:5000";

describe("quiz", () => {
  let body = {};
  let quizId = "";
  let questionIds = [];

  describe("quiz creation", () => {
    before(() => {
      body = {
        title: "general knowledges 6",
        questions: [
          {
            questionText: "Which is the capital of USA ?",
            type: "multiple",
            answers: [
              {
                answerText: "Washington D.C.",
                isCorrect: true,
              },
              {
                answerText: "Boston",
                isCorrect: false,
              },
              {
                answerText: "Chicago",
                isCorrect: false,
              },
              {
                answerText: "Los Angeles",
                isCorrect: false,
              },
            ],
          },
          {
            questionText: "China is located in which continent ?",
            type: "single",
            answers: [
              {
                answerText: "Asia",
                isCorrect: true,
              },
              {
                answerText: "Africa",
                isCorrect: false,
              },
            ],
          },
          {
            questionText: "is Elon Musk the creator of SpaceX ?",
            type: "multiple",
            answers: [
              {
                answerText: "Yes",
                isCorrect: true,
              },
              {
                answerText: "No",
                isCorrect: false,
              },
            ],
          },
        ],
      };
    });

    it("should create the quiz", async () => {
      let response = await fetch(`${url}/quiz/`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 8a3162fd-00d8-4805-a91a-201aafadbe14",
        },
      });

      response = await response.json();
      quizId = response.quiz._id.toString();
      response.quiz.questions.forEach((el) => {
        questionIds.push(el._id.toString());
      });
      expect(response).to.have.property("success").eq(true);
    });

    it("should not create the quiz", async () => {
      let response = await fetch(`${url}/quiz/`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 8a3162fd-00d8-4805-a91a-201aafadbe14",
        },
      });

      response = await response.json();
      expect(response).to.have.property("success").eq(false);
    });
  });

  describe("quiz edition", () => {
    it("should send quiz to edit", async () => {
      let response = await fetch(`${url}/quiz/edit/${quizId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 8a3162fd-00d8-4805-a91a-201aafadbe14",
        },
      });

      response = await response.json();
      expect(response).to.have.property("success").eq(true);
      expect(response).to.have.property("quiz").instanceOf(Object);
    });

    it("should not send quiz to edit", async () => {
      let response = await fetch(`${url}/quiz/edit/ddddddddddd`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 8a3162fd-00d8-4805-a91a-201aafadbe14",
        },
      });

      response = await response.json();
      expect(response).to.have.property("success").eq(false);
    });
  });

  describe("quiz publishing", () => {
    before(() => {
      body = {
        quizId: quizId,
      };
    });

    it("should publish the quiz", async () => {
      let response = await fetch(`${url}/quiz/publish`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 8a3162fd-00d8-4805-a91a-201aafadbe14",
        },
      });

      response = await response.json();
      expect(response).to.have.property("success").eq(true);
    });

    it("should not publish the quiz", async () => {
      let response = await fetch(`${url}/quiz/publish`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 8a3162fd-00d8-4805-a91a-201aafadbe14",
        },
      });

      response = await response.json();
      expect(response).to.have.property("success").eq(false);
    });
  });

  describe("quiz getting", () => {
    it("should get the quiz requested if the status is published", async () => {
      let response = await fetch(`${url}/quiz/${quizId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 8a3162fd-00d8-4805-a91a-201aafadbe14",
        },
      });

      response = await response.json();
      expect(response).to.have.property("success").eq(true);
    });

    it("should get all quizzes", async () => {
      let response = await fetch(`${url}/quiz`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 8a3162fd-00d8-4805-a91a-201aafadbe14",
        },
      });

      response = await response.json();
      expect(response).to.have.property("success").eq(true);
    });

    it("should get nothing because there's no quiz", async () => {
      let response = await fetch(`${url}/quiz/${quizId}e`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 8a3162fd-00d8-4805-a91a-201aafadbe14",
        },
      });

      response = await response.json();
      expect(response).to.have.property("success").eq(false);
    });
  });

  describe("quiz solution", () => {
    before(() => {
      body = {
        quizId: quizId,
        answers: [
          {
            questionId: questionIds[0],
            response: ["Washington D.C."],
          },
          {
            questionId: questionIds[1],
            response: ["Asia"],
          },
          {
            questionId: questionIds[2],
            response: ["No"],
          },
        ],
      };
    });

    it("should get nothing because user didn't submit solution", async () => {
      let response = await fetch(`${url}/quiz/score/${quizId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 8a3162fd-00d8-4805-a91a-201aafadbe14",
        },
      });

      response = await response.json();
      expect(response).to.have.property("success").eq(false);
    });

    it("should post solution", async () => {
      let response = await fetch(`${url}/quiz/solution`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer ddcf2d67-b939-4bcf-b3c1-2f51fa969b38",
        },
      });

      response = await response.json();
      expect(response).to.have.property("success").eq(true);
    });

    it("should not post solution", async () => {
      let response = await fetch(`${url}/quiz/solution`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer ddcf2d67-b939-4bcf-b3c1-2f51fa969b38",
        },
      });

      response = await response.json();
      expect(response).to.have.property("success").eq(false);
    });

    it("should get all user submitted solutions", async () => {
      let response = await fetch(`${url}/quiz/solutions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer ddcf2d67-b939-4bcf-b3c1-2f51fa969b38",
        },
      });

      response = await response.json();
      expect(response).to.have.property("success").eq(true);
    });
  });

  describe("quiz stats", () => {
    it("should get stats about user created quizzes", async () => {
      let response = await fetch(`${url}/quiz/stats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 8a3162fd-00d8-4805-a91a-201aafadbe14",
        },
      });

      response = await response.json();
      expect(response).to.have.property("success").eq(true);
    });
  });

  describe("quiz deletion", () => {
    it("should delete the quiz", async () => {
      let response = await fetch(`${url}/quiz/${quizId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 8a3162fd-00d8-4805-a91a-201aafadbe14",
        },
      });

      response = await response.json();
      expect(response).to.have.property("success").eq(true);
    });

    it("should not delete the quiz because it's already deleted", async () => {
      
      let response = await fetch(`${url}/quiz/${quizId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 8a3162fd-00d8-4805-a91a-201aafadbe14",
        },
      });

      response = await response.json();
      expect(response).to.have.property("success").eq(false);
    });
  });
});
