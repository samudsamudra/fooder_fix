import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;
  const { name, price, category, picture, description } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'Menu ID is required' });
  }

  try {
    const updatedMenu = await prisma.menu.update({
      where: { id: Number(id) },
      data: {
        name,
        price,
        category,
        picture,
        description,
      },
    });

    res.status(200).json(updatedMenu);
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}