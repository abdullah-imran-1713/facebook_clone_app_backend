import { v2 as cloudinary } from 'cloudinary';
import { IRequest } from '../interfaces/generals';

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloud(req: IRequest) {
    let result;
    
    if (req.file){
        const b64 = Buffer.from(req?.file?.buffer).toString("base64");
        let dataURI = "data:" + req?.file?.mimetype + ";base64," + b64;
        result = await cloudinary.uploader.upload(dataURI , {
            folder:'uploads'
         });
    }

    return result;
}
// Upload image to Cloudinary