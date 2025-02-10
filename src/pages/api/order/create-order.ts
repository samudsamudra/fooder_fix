import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {
      customer,
      table_number,
      total_price,
      payment_method,
      status,
      orderLists,
      email,
    } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Validate menu items
      for (const item of orderLists) {
        const menu = await prisma.menu.findUnique({
          where: { id: item.menuId },
        });

        if (!menu) {
          return res
            .status(400)
            .json({ message: `Menu item with id ${item.menuId} not found` });
        }
      }

      const orderUuid = uuidv4(); // Generate unique UUID for the order

      const order = await prisma.order.create({
        data: {
          uuid: orderUuid, // Ensure unique UUID
          customer,
          table_number,
          total_price,
          payment_method,
          status,
          userId: user.id,
          orderLists: {
            create: orderLists.map((item: any) => ({
              uuid: uuidv4(), // Ensure unique UUID for each order list item
              menuId: item.menuId,
              quantity: item.quantity,
              note: item.note,
            })),
          },
        },
      });

      return res
        .status(200)
        .json({ message: "Order created successfully", order });
    } catch (error) {
      console.error("Error creating order:", error); // Add logging
      return res.status(500).json({
        message: "Internal Server Error",
        error: (error as any).message,
      });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
