import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { id } = req.query;
      const menu = await prisma.menu.findUnique({
        where: { id: Number(id) },
      });
      if (menu) {
        res.status(200).json(menu);
      } else {
        res.status(404).json({ error: 'Menu not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch menu' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
