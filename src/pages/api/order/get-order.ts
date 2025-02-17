import { PrismaClient } from "@prisma/client";
import Cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";

// Initialize the Prisma client
const prisma = new PrismaClient();

// Initialize the CORS middleware
const cors = Cors({
  origin: "http://localhost:3000", // Adjust the origin as needed
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
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

async function getOrders() {
  return await prisma.order.findMany();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Run the CORS middleware
  await runMiddleware(req, res, cors);

  if (req.method === "GET") {
    try {
      const orders = await getOrders();
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
