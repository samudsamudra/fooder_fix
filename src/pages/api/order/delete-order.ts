import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'Order ID is required' });
  }

  try {
    const deletedOrder = await prisma.order.delete({
      where: { id: Number(id) },
    });
    console.log(`Order with ID ${id} deleted successfully.`);
    res.status(200).json(deletedOrder);
  } catch (error) {
    console.error(`Failed to delete order with ID ${id}:`, (error as any).message);
    res.status(500).json({ message: 'Internal server error', error: (error as any).message });
  }
}