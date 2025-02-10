import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, description, price, category, picture } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const newMenu = await prisma.menu.create({
        data: {
          uuid: uuidv4(),
          name,
          description,
          price: parseFloat(price),
          category,
          picture
        },
      });
      return res.status(201).json(newMenu);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create menu' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}