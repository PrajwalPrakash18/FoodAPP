import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY , 
  api_secret: process.env.CLOUDINARY_API_SECRET  
});

const uploadonCloudinary = async(localFilePath) => {
      try {
            if(!localFilePath) return null

            // upload thr file on cloudinary
            const response = await cloudinary.uploader.upload(localFilePath,{
                  resource_type:"auto"
            })

            // file has been uploaded 
            console.log("File has been uploaded successfully" , response.url);
            return response

      }catch(error){
            fs.unlinkSync(localFilePath)    // remove the locally saved temporary file as the image upload failed 
            return null 
      }
}


export {uploadonCloudinary}