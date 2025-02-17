import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../prisma/client";

// Middleware untuk menangani CORS
function corsMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  next: Function
) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Bisa diganti dengan "http://localhost:3000"
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  corsMiddleware(req, res, async () => {
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    try {
      const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      ) as jwt.JwtPayload;
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          role: true,
          uuid: true,
          profilePic: true, // Ambil profilePic
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Cek apakah profilePic ada dan ubah jadi URL lengkap
      const profilePicUrl = user.profilePic
        ? `http://localhost:5000${user.profilePic}`
        : null;

      return res.status(200).json({ 
        user: { 
          ...user, 
          profilePic: profilePicUrl // Kirim URL lengkap ke frontend
        } 
      });
    } catch (error) {
      console.error("[PROFILE USER ERROR]", error);
      return res.status(500).json({ message: "Internal server error", error });
    }
  });
}
