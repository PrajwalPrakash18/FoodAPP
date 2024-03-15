import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Auth } from "../models/Models/Auth.Models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { user, phone, email, password } = req.body;

    // Checking if any fields are empty
    if ([user, phone, email, password].some((field) => typeof field === 'string' && field.trim() === "")) {
      throw new ApiError(400, "All fields are required");
    }

    // Checking if the user already exists
    const existingUser = await Auth.findOne({ $or: [{ user }, { email }] });
    if (existingUser) {
      throw new ApiError(409, "User with the same username or email already exists");
    }

    // Creating the user
    const newUser = await Auth.create({
      user: user.toLowerCase(),
      phone,
      email,
      password
    });

    if (!newUser) {
      throw new ApiError(500, "Failed to register user");
    }

    // Omitting password field from the response
    const registeredUser = newUser.toObject();
    delete registeredUser.password;

    // Sending success response
    res.status(201).json(new ApiResponse(201, registeredUser, "User registered successfully"));
  } catch (error) {
    // Handling errors
    console.error('Error during user registration:', error);
    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || "Internal Server Error";
    res.status(statusCode).json(new ApiResponse(statusCode, null, errorMessage));
  }
});

export { registerUser };
