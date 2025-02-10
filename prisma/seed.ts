import { PrismaClient, Role, Category, Payment, Status } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    // Hash passwords
    const hashedPassword1 = await bcrypt.hash('password123', 10);
    const hashedPassword2 = await bcrypt.hash('password456', 10);

    // Create users
    const manager = await prisma.user.create({
      data: {
        uuid: '1234567',
        role: Role.MANAGER,
        password: hashedPassword1,
        email: 'manager@example.com',
        profilePic: 'manager-pic-url',
      },
    });

    const kasir = await prisma.user.create({
      data: {
        uuid: '2345678',
        role: Role.KASIR,
        password: hashedPassword2,
        email: 'kasir@example.com',
        profilePic: 'kasir-pic-url',
      },
    });

    // Create menu items
    const menu1 = await prisma.menu.create({
      data: {
        uuid: '3456789',
        name: 'Nasi Goreng',
        price: 15000,
        category: Category.FOOD,
        picture: 'nasi-goreng-pic-url',
        description: 'Nasi goreng spesial dengan telur dan ayam',
      },
    });

    const menu2 = await prisma.menu.create({
      data: {
        uuid: '4567890',
        name: 'Es Teh Manis',
        price: 5000,
        category: Category.DRINK,
        picture: 'es-teh-manis-pic-url',
        description: 'Es teh manis segar',
      },
    });

    // Create orders
    const order1 = await prisma.order.create({
      data: {
        uuid: '5678901',
        customer: 'John Doe',
        table_number: 'A1',
        total_price: 20000,
        payment_method: Payment.CASH,
        status: Status.NEW,
        userId: manager.id,
        orderLists: {
          create: [
            {
              uuid: '6789012',
              quantity: 1,
              note: 'Tanpa sambal',
              menuId: menu1.id,
            },
            {
              uuid: '7890123',
              quantity: 2,
              note: '',
              menuId: menu2.id,
            },
          ],
        },
      },
    });

    console.log('Seeding successful!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();