const cloudinary = require("cloudinary").v2;
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { cloudinaryConfig } from "../config";
import DatauriParser from "datauri/parser";
import path from "path";

const parser = new DatauriParser();

export const cloudinaryHandler = async (
  file: any,
  folder?: string
): Promise<UploadApiResponse | UploadApiErrorResponse> => {
  const extName = path.extname(file.filename).toString();
  const file64 = parser.format(extName, file.value);

  await cloudinaryConfig();
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file64.content,
      {
        resource_type: "auto",
        folder: folder,
      },
      (err: UploadApiErrorResponse, result: UploadApiResponse) => {
        if (err) return null;
        resolve(result);
      }
    );
  });
};
