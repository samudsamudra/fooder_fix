import { File } from "multer";
import { NextApiRequest } from "next";

export interface NextApiRequestWithFile extends NextApiRequest {
  file?: File;
}
