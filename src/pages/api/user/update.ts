import fs from "fs";
import jwt from "jsonwebtoken";
import multer from "multer";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import prisma from "../../../../prisma/client";
import { NextApiRequestWithFile } from "../../../types"; // Pastikan kamu buat tipe ini

// Nonaktifkan bodyParser agar Next.js bisa menangani FormData
export const config = {
  api: {
    bodyParser: false,
  },
};

// Middleware untuk menangani CORS
function corsMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  next: Function
) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // Ganti sesuai domain frontend
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS, PATCH");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
}

// Pastikan folder uploads ada
const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Setup penyimpanan file
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Middleware untuk menangani upload file
const uploadMiddleware = (req: NextApiRequest, res: NextApiResponse) => {
  return new Promise<void>((resolve, reject) => {
    upload.single("profilePic")(req as any, res as any, (err: any) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// API Handler
export default async function handler(
  req: NextApiRequestWithFile,
  res: NextApiResponse
) {
  corsMiddleware(req, res, async () => {
    if (req.method !== "PATCH") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    try {
      await uploadMiddleware(req, res);

      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      ) as jwt.JwtPayload;

      const { email } = req.body;
      const profilePic = req.file ? `/uploads/${req.file.filename}` : null;

      // Update user di database
      const updatedUser = await prisma.user.update({
        where: { id: decoded.id },
        data: {
          email,
          ...(profilePic && { profilePic }),
        },
      });

      return res.status(200).json({ user: updatedUser });
    } catch (error) {
      console.error("[UPDATE PROFILE ERROR]", error);
      return res.status(500).json({ message: "Internal server error", error });
    }
  });
}
