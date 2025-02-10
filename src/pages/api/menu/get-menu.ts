import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const menus = await prisma.menu.findMany();
      res.status(200).json(menus);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch menus' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}