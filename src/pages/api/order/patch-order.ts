import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;
  const { customer, table_number, total_price, payment_method, status, orderLists } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'Order ID is required' });
  }

  try {
    // Validate menu items if orderLists is provided
    if (orderLists) {
      for (const item of orderLists) {
        const menu = await prisma.menu.findUnique({
          where: { id: item.menuId },
        });

        if (!menu) {
          return res.status(400).json({ message: `Menu item with id ${item.menuId} not found` });
        }
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) },
      data: {
        customer,
        table_number,
        total_price,
        payment_method,
        status,
        orderLists: orderLists ? {
          update: orderLists.map((item: any) => ({
            where: { id: item.id },
            data: {
              menuId: item.menuId,
              quantity: item.quantity,
              note: item.note,
            },
          })),
        } : undefined,
      },
    });

    res.status(200).json(updatedOrder);
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}