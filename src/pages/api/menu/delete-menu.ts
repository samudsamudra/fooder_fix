import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    console.log("req.method", req.method);
    return res.status(200).end();
  }
  
  // if (req.method !== "DELETE") {
  //   return res.status(405).json({ message: "Method not allowed" });
  // }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "Menu ID is required" });
  }

  try {
    const deletedMenu = await prisma.menu.delete({
      where: { id: Number(id) },
    });

    console.log(`Menu with ID ${id} deleted successfully.`);
    return res.status(200).json(deletedMenu);
  } catch (error) {
    console.error(`Failed to delete menu with ID ${id}:`, (error as any).message);
    return res.status(500).json({ message: "Internal server error", error: (error as any).message });
  }
}
