const expect = require("chai").expect;
const fetch = require("node-fetch");
const url = "http://localhost:5000";

describe("login user", () => {
  let body = {};
  before(() => {
    body = {
      name: "nathan",
      email: "nsadala1@gmail.com",
      password: "NathanSadala2022@",
    };
  });

  it("should register the user", async () => {
    let response = await fetch(`${url}/user/register`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    response = await response.json();
    expect(response).to.have.property("success").eq(true);
  });

  it("shoud not register the user", async () => {
    let response = await fetch(`${url}/user/register`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    response = await response.json();

    expect(response).to.have.property("success").eq(false);
  });

  it("shoud authenticate the user", async () => {
    body = {
      email: "test@gmail.com",
      password: "NathanSadala2022@",
    };

    let response = await fetch(`${url}/user/login`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    response = await response.json();

    expect(response).to.have.property("success").eq(true);
  });

  it("shoud not authenticate the user", async () => {
    body = {
      email: "teamo1@gmail.com",
      password: "kilimandjaro",
    };

    let response = await fetch(`${url}/user/login`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    response = await response.json();

    expect(response).to.have.property("success").eq(false);
  });
});
