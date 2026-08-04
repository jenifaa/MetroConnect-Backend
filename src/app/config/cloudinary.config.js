import { v2 as cloudinary } from "cloudinary";
import stream from "stream";

import { envVars } from "./env.js";
import AppError from "../errorHelpers/AppError.js";

cloudinary.config({
  cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY_API_SECRET,
});

export const uploadBufferToCloudinary = async (buffer, fileName) => {
  try {
    return new Promise((resolve, reject) => {
      const public_id = `pdf/${fileName}-${Date.now()}`;

      const bufferStream = new stream.PassThrough();
      bufferStream.end(buffer);

      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
            public_id,
            folder: "pdf",
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }

            resolve(result);
          }
        )
        .end(buffer);
    });
  } catch (err) {
    console.log(err);
    throw new AppError(
      401,
      `Error uploading file ${err.message}`
    );
  }
};

export const deleteImageFromCloudinary = async (url) => {
  try {
    const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;

    const match = url.match(regex);

    if (match && match[1]) {
      const public_id = match[1];

      await cloudinary.uploader.destroy(public_id);
    }
  } catch (error) {
    throw new AppError(
      401,
      "Cloudinary image deletion failed"
    );
  }
};

export const cloudinaryUpload = cloudinary;