import mongoose from "mongoose"

const addressSchema = new mongoose.Schema({
      location:{
            type:String,
            required:true
      },
      place:{
            type:String,
            required:true
      },
      state:{
            type:String,
            required:true
      },
      pincode:{
            type:Number,
            required:true
      }
})


export const Address = mongoose.model("Address" , addressSchema)

