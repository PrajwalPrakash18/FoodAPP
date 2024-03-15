import mongoose from "mongoose"

const loginSchema = new mongoose.Schema({
      userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Auth',
            required: true,
     
      },
      contact:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Auth"
      },
      mail:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Auth"
      },
      pass:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Auth"
      }
},{timestamps:true})

export const Login = mongoose.model("Login",loginSchema)

