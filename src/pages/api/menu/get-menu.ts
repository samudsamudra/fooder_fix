import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

function setCorsHeaders(res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    try {
      const menus = await prisma.menu.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          category: true,
          picture: true,
        },
      });

      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const menusWithFullPictureUrl = menus.map((menu) => ({
        ...menu,
        picture: menu.picture ? `${baseUrl}${menu.picture}` : null,
      }));

      res.status(200).json(menusWithFullPictureUrl);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch menus" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
