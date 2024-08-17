"use server";
import { actionsResponseInterface } from "@/interfaces";
import { currentUser } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import pLimit from "p-limit";

const limit = pLimit(5);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface UploadImageDirectlyProps {
  base64Images: string[];
}

// Function to convert File to base64 string
// const toBase64 = (file: File): Promise<string> => {
//   return new Promise<string>((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result as string);
//     reader.onerror = (error) => reject(error);
//   });
// };

export async function uploadImageDirectly(
  params: UploadImageDirectlyProps
): Promise<actionsResponseInterface> {
  try {
    const user = await currentUser();
    console.log(user?.privateMetadata);
    if (!user || !user.privateMetadata || !user.privateMetadata.mongoDbId) {
      console.log("User not authenticated or userId not found");
      return {
        success: false,
        message: "User not authenticated or userId not found",
      };
    }
    const { mongoDbId: userId } = user.privateMetadata;

    const { base64Images } = params;

    if (!base64Images || base64Images.length === 0) {
      return {
        success: false,
        message: "No files to upload",
      };
    }
    console.log("Uploading Images");
    const uploadOptions = {
      resource_type: "image" as const,
      context: {
        userid: userId,
      },
    };

    const imagesToUpload = base64Images.map((image) => {
      return limit(async () => {
        const result = await cloudinary.uploader.upload(image, uploadOptions);
        console.log("Uploaded image:", result.secure_url);
        return result.secure_url;
      });
    });

    const uploads: string[] = await Promise.all(imagesToUpload);
    return {
      success: true,
      message: "Images uploaded successfully",
      data: uploads,
    };
  } catch (error: any) {
    console.error(error);
    return error;
  }
}
