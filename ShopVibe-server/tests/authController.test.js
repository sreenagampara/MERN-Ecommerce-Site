import { jest } from "@jest/globals";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { mockRes } from "./helpers/mockErs.js";

dotenv.config({ quiet: true });

// ---------------- 1. ESM SAFE MOCKS ----------------

jest.unstable_mockModule("../models/userModel.js", () => {
  // This represents a single user document (an instance)
  const mockInstance = {
    _id: "mock_id_123",
    name: "Test User",
    email: "test@test.com",
    password: "hashed_password",
    isAccountVerified: false,
    verifyOtp: "",
    verifyOtpExpiredAt: 0,
    resetOtp: "",
    resetOtpExpiredAt: 0,
    save: jest.fn().mockResolvedValue(true), // Mock the .save() method
  };

  // The Mock Class
  function MockUserModel(data) {
    Object.assign(this, mockInstance, data);
    return this;
  }

  // Static methods on the Class
  MockUserModel.findOne = jest.fn();
  MockUserModel.findById = jest.fn();
  
  return { default: MockUserModel };
});

jest.unstable_mockModule("bcrypt", () => ({
  default: {
    hash: jest.fn().mockResolvedValue("hashed_password"),
    compare: jest.fn().mockResolvedValue(true),
  },
}));

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    sign: jest.fn().mockReturnValue("mock_token"),
    verify: jest.fn().mockReturnValue({ id: "mock_id_123" }),
  },
}));

jest.unstable_mockModule("../config/nodemailer.js", () => ({
  default: { 
    sendMail: jest.fn().mockResolvedValue({ messageId: "test-id" }) 
  },
}));

// ---------------- 2. DYNAMIC IMPORTS ----------------
// We must import these AFTER the mocks are defined
const bcrypt = (await import("bcrypt")).default;
const jwt = (await import("jsonwebtoken")).default;
const userModel = (await import("../models/userModel.js")).default;
const transporter = (await import("../config/nodemailer.js")).default;

const {
  register,
  login,
  logout,
  sendVerifyOtp,
  verifyEmail,
  isAuthenticated,
  sendResetOtp,
  resetPassword,
} = await import("../controllers/authControllers.js");

// ---------------- 3. SETUP & TEARDOWN ----------------

describe("Auth Controller Full Suite", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    res = mockRes();
    process.env.JWT_SECRET = "test_secret";
    process.env.NODE_ENV = "test";
  });

  afterAll(async () => {
    // Closes any connection opened during import
    await mongoose.disconnect();
  });

  // --- REGISTER ---
  describe("register()", () => {
    it("should register a new user successfully", async () => {
      req = { body: { name: "John", email: "john@test.com", password: "password123" } };
      userModel.findOne.mockResolvedValue(null); // No existing user

      await register(req, res);

      expect(res.cookie).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    it("should return error if user already exists", async () => {
      req = { body: { name: "John", email: "john@test.com", password: "password123" } };
      userModel.findOne.mockResolvedValue({ email: "john@test.com" });

      await register(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "user alredy exist" }));
    });
  });

  // --- LOGIN ---
  describe("login()", () => {
    it("should login successfully", async () => {
      req = { body: { email: "john@test.com", password: "password123" } };
      userModel.findOne.mockResolvedValue({ _id: "123", password: "hashed_password" });
      bcrypt.compare.mockResolvedValue(true);

      await login(req, res);
      expect(res.cookie).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });
  });

  // --- LOGOUT ---
  describe("logout()", () => {
    it("should clear cookie and logout", async () => {
      await logout({}, res);
      expect(res.clearCookie).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
  });

  // --- EMAIL VERIFICATION ---
  describe("Email Verification", () => {
    it("sendVerifyOtp should update user and send mail", async () => {
      const mockUser = new userModel({ email: "test@test.com", isAccountVerified: false });
      userModel.findById.mockResolvedValue(mockUser);
      
      req = { body: { userId: "123" } };
      await sendVerifyOtp(req, res);
      
      expect(transporter.sendMail).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it("verifyEmail should verify account with correct OTP", async () => {
      const mockUser = new userModel({ 
        verifyOtp: "123456", 
        verifyOtpExpiredAt: Date.now() + 50000 
      });
      userModel.findById.mockResolvedValue(mockUser);
      
      req = { body: { userId: "123", otp: "123456" } };
      await verifyEmail(req, res);
      
      expect(mockUser.isAccountVerified).toBe(true);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
  });

  // --- PASSWORD RESET ---
  describe("Password Reset", () => {
    it("sendResetOtp should send email", async () => {
      const mockUser = new userModel({ email: "test@test.com" });
      userModel.findOne.mockResolvedValue(mockUser);
      
      req = { body: { email: "test@test.com" } };
      await sendResetOtp(req, res);
      
      expect(mockUser.resetOtp).toBeDefined();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it("resetPassword should update user password", async () => {
      const mockUser = new userModel({ 
        resetOtp: "111222", 
        resetOtpExpiredAt: Date.now() + 50000 
      });
      userModel.findOne.mockResolvedValue(mockUser);
      
      req = { body: { email: "test@test.com", otp: "111222", newPassword: "new" } };
      await resetPassword(req, res);
      
      expect(mockUser.password).toBe("hashed_password");
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
  });

  describe("isAuthenticated()", () => {
    it("should return success true", async () => {
      await isAuthenticated({}, res);
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });
  });
});