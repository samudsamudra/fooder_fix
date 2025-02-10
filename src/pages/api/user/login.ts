import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

// Initialize the cors middleware
const cors = Cors({
  methods: ['POST', 'OPTIONS'],
  origin: '*', // Adjust this to your needs
});

// Helper method to wait for a middleware to execute before continuing
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Run the middleware
  await runMiddleware(req, res, cors);

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, uuid: user.uuid },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    console.log('Generated Token:', token); // Log the generated token for debugging

    return res.status(200).json({
      message: 'Login successful',
      token,
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        uuid: user.uuid,
      },
    });
  } catch (error) {
    console.error('[LOGIN USER ERROR]', error);
    return res.status(500).json({ message: 'Internal server error', error });
  }
}