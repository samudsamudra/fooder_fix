import { Category, PrismaClient } from "@prisma/client";
import { File, IncomingForm } from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

function setCorsHeaders(req: NextApiRequest, res: NextApiResponse) {
  const origin = req.headers.origin;
  const allowedOrigins = ["http://localhost:3000"];

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  setCorsHeaders(req, res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    const form = new IncomingForm({
      uploadDir: path.join(process.cwd(), "/public/uploads"),
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: "Failed to parse form data" });
      }

      const { name, description, price, category } = fields;
      const picture =
        Array.isArray(files.picture) && files.picture.length > 0
          ? `/public/uploads/${(files.picture[0] as File).newFilename}`
          : null;

      if (!name || !description || !price || !category) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      try {
        const newMenu = await prisma.menu.create({
          data: {
            uuid: uuidv4(),
            name: Array.isArray(name) ? name[0] : name,
            description: Array.isArray(description)
              ? description[0]
              : description,
            price: parseFloat(Array.isArray(price) ? price[0] : price),
            category: Array.isArray(category)
              ? (category[0] as Category)
              : (category as Category),
            picture,
          },
        });
        return res.status(201).json(newMenu);
      } catch (error) {
        return res.status(500).json({ error: "Failed to create menu" });
      }
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
