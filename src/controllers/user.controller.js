import { asyncHandler }  from  "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
//import { name } from "ejs"
import { Auth } from "../models/Models/Auth.Models.js"
import { ApiResponse } from "../utils/ApiResponse.js"

// Extracting all the data points 
const registerUser = asyncHandler(async (req,res) =>{
      const {user, phone, email, password} = req.body
     // console.log("email" , email)

// Checking if any fields are empty or not 

    if (
      [user, phone, email, password].some((field) => typeof field === 'string' && field.trim() === "")       
    ){
      throw new ApiError(400, "All fields are required")
    }
   
// Checking if the user Already exists or not  using the email or the username 

    const existingUser = await Auth.findOne({                                         
      $or:[{user} , {email}]
    })
    if(existingUser){
      throw new ApiError(409 , "User with the name or email already exists")     // If the user exists notify that the user already exists
    }

    const person = await Auth.create({
      user:user.toLowerCase(),
      phone,
      email,
      password
    })

    const createdUser = await Auth.findById(person._id).select("-password")

    if (!createdUser){
      throw new ApiError(500, "Something went wrong while registering")     // If the user is not created give the error 
    }

    return res.status(201).json(
      new ApiResponse(200, createdUser, "User Registered Sucessfully")     //  If created then give the success message 
    ) 
})


export { registerUser , } 