import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ message: 'Order ID is required' });
      }

      const order = await prisma.order.findUnique({
        where: { id: Number(id) },
        include: {
          orderLists: true, // Include order lists in the response
        },
      });

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      return res.status(200).json(order);
    } catch (error) {
      console.error('[GET ORDER BY ID ERROR]', error);
      return res.status(500).json({ message: 'Internal server error', error });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}