import mongoose from "mongoose"
import bcrypt from "bcrypt"

const authSchema = new mongoose.Schema({
      user:{
            type:String,
            required:true
      },
      phone:{
            type:Number,
            required:true
      },
      email:{
            type:String,
            required:true
      },
      password:{
            type:String
      },
})

authSchema.pre("save", async function(next){
      if(!this.isModified("password")) return next();   // Checking if the field is not modified 

      this.password = await bcrypt.hash(this.password , 10)   // Hashing the user given password for 10 rounds if there is a new password
      next()                                        
})

authSchema.methods.isPasswordCorrect = async function (password){     // A custom function is used here for Checking if the password is corect or not                                                                     
      return await bcrypt.compare(password, this.password)            // Comparing the password and the encrypted password  (returns true or false)
}      

export const Auth = mongoose.model("Auth", authSchema);





