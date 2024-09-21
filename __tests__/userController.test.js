const { userRegister, userLogin } = require("../controllers/userController");
const userModel = require("../models/userModel");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Mock external dependencies
jest.mock("express-validator", () => ({
  validationResult: jest.fn(),
}));
jest.mock("bcrypt");
jest.mock("../models/userModel");
jest.mock("jsonwebtoken");
jest.mock("../middlewares/handleError");

describe("user registration", () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };

  //user registration ---- success
  test("user registered successfully", async () => {
    validationResult.mockReturnValueOnce({
      isEmpty: () => true,
    });

    bcrypt.genSalt.mockResolvedValueOnce("random_salt");
    bcrypt.hash.mockResolvedValueOnce("hashed_password");

    userModel.mockImplementation((data) => ({
      save: jest.fn().mockResolvedValue({
        _id: "123",
        ...data,
      }),
    }));

    const req = {
      body: {
        name: "name",
        email: "email@gmail.com",
        username: "username",
        password: "1234",
      },
    };

    const response = await userRegister(req, res);
    expect(response).toEqual({
      message: "User registered successfully",
      data: {
        _id: "123",
        name: "name",
        email: "email@gmail.com",
        username: "username",
        password: "hashed_password",
      },
    });
  });

  test("validation error (email/password/username/name is empty)", async () => {
    validationResult.mockReturnValueOnce({
      isEmpty: () => false,
      errors: [
        {
          msg: { message: "Email is required" },
        },
      ],
    });

    //pass request without email field
    const req = {
      body: {
        name: "name",
        username: "username",
        password: "12345",
      },
    };

    const response = await userRegister(req, res);
    expect(response).toEqual({
      code: 400,
      message: { message: "Email is required" },
    });
  });
});

describe("user login", () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };

  test("validation error (email/password is empty)", async () => {
    validationResult.mockReturnValueOnce({
      isEmpty: () => false,
      errors: [
        {
          msg: { message: "Email is required" },
        },
      ],
    });

    //pass request without email field
    const req = {
      body: {
        password: "12345",
      },
    };

    const response = await userLogin(req, res);
    expect(response).toEqual({
      code: 400,
      message: { message: "Email is required" },
    });
  });

  test("User is not registered", async () => {
    validationResult.mockReturnValueOnce({
      isEmpty: () => true,
    });

    const req = {
      body: {
        email: "email@gmail.com",
        password: "12345",
      },
    };

    userModel.findOne.mockResolvedValueOnce(null);
    const response = await userLogin(req, res);
    expect(response).toEqual({
      code: 400,
      message: "Invalid username or password",
    });
  });

  test("User login success", async () => {
    validationResult.mockReturnValueOnce({
      isEmpty: () => true,
    });

    const req = {
      body: {
        email: "email@gmail.com",
        password: "12345",
      },
    };

    const userDetails = {
      _id: "userId",
      email: "test@example.com",
      password: "hashedPassword",
      name: "testname",
    };

    userModel.findOne.mockResolvedValueOnce(userDetails);
    bcrypt.compare.mockResolvedValueOnce(true);
    jwt.sign.mockReturnValueOnce("tokengenerated");
    const response = await userLogin(req, res);
    expect(response).toEqual({
      message: "User logged in successfully",
      data: "tokengenerated",
    });
  });

  test("User login failed - incorrect password", async () => {
    validationResult.mockReturnValueOnce({
      isEmpty: () => true,
    });

    const req = {
      body: {
        email: "email@gmail.com",
        password: "12345",
      },
    };

    const userDetails = {
      _id: "userId",
      email: "test@example.com",
      password: "hashedPassword",
      name: "testname",
    };

    userModel.findOne.mockResolvedValueOnce(userDetails);
    bcrypt.compare.mockResolvedValueOnce(false);
    const response = await userLogin(req, res);
    expect(response).toEqual({
      code: 400,
      message: "Invalid username or password",
    });
  });
});
