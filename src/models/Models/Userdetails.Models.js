import mongoose from "mongoose"

const userdetailSchema = new mongoose.Schema({
      person:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Auth"
      },
      address:[
            {
                  type:mongoose.Schema.Types.ObjectId,
                  ref:"Address"
            }
      ],
})

export const Details = mongoose.model("Details",userdetailSchema) 