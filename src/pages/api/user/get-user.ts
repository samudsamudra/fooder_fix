import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../prisma/client';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as jwt.JwtPayload & { id: number, role: string };
    console.log("Decoded Token:", decoded);

    const { userId } = req.query;

    if (userId) {
      if (decoded.role !== 'MANAGER') {
        res.status(403).json({ message: 'Only managers can perform this action' });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId as string) },
        select: {
          id: true,
          email: true,
          role: true,
          uuid: true,
          profilePic: true,
        },
      });

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(200).json({ user });
      return;
    }

    // Jika tidak ada userId, ambil data user berdasarkan token (untuk user biasa)
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
        uuid: true,
        profilePic: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('[GET USER ERROR]', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
}
