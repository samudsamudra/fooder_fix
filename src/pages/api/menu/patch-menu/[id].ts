import { PrismaClient } from "@prisma/client";
import Cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

// Initialize the cors middleware
const cors = Cors({
  methods: ["PATCH", "OPTIONS"],
});

// Helper method to wait for a middleware to execute before continuing
function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Run the middleware
  await runMiddleware(req, res, cors);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "Menu ID is required" });
  }

  try {
    // Ensure the request body is parsed correctly
    const parsedBody =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { name, price, category, picture, description } = parsedBody;

    console.log("Updating menu with ID:", id);
    console.log("Parsed Request Body:", parsedBody);

    // Ensure price is a number
    const updatedMenu = await prisma.menu.update({
      where: { id: Number(id) },
      data: {
        name,
        price: parseFloat(price), // Ensure price is a number
        category,
        picture,
        description,
      },
    });

    res.status(200).json(updatedMenu);
  } catch (error: any) {
    console.error("Error updating menu:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}
