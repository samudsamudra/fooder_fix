import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../prisma/client';
import jwt from 'jsonwebtoken';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Ensure the method is GET
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as jwt.JwtPayload & { role: string };
    if (decoded.role !== 'MANAGER') {
      return res.status(403).json({ message: 'Only managers can perform this action' });
    }

    const { userId } = req.query;

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId as string) },
        select: {
          id: true,
          email: true,
          role: true,
          uuid: true,
          profilePic: true, // Include profilePic in the response
        },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({ user });
    } else {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          role: true,
          uuid: true,
          profilePic: true, // Include profilePic in the response
        },
      });
      return res.status(200).json({ users });
    }
  } catch (error) {
    console.error('[GET USER ERROR]', error);
    return res.status(500).json({ message: 'Internal server error', error });
  }
}