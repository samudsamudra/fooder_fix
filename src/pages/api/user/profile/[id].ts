// import type { NextApiRequest, NextApiResponse } from "next";
// import prisma from "../../../../../prisma/client";
// import jwt from "jsonwebtoken";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   // ✅ CORS Headers
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
//   res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");

//   if (req.method === "OPTIONS") {
//     return res.status(200).end();
//   }

//   if (req.method !== "GET") {
//     return res.status(405).json({ message: "Method not allowed" });
//   }

//   try {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as jwt.JwtPayload;
//     console.log("Decoded Token:", decoded);

//     const userId = parseInt(req.query.id as string);
//     if (decoded.id !== userId) {
//       return res.status(403).json({ message: "Forbidden" });
//     }

//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//       select: { id: true, email: true, role: true, uuid: true, profilePic: true },
//     });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     console.log("User data fetched:", user);
//     return res.status(200).json({ user });
//   } catch (error) {
//     console.error("[PROFILE ERROR]", error);
//     return res.status(500).json({ message: "Internal server error", error });
//   }
// }
