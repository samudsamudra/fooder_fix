import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../prisma/client';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as jwt.JwtPayload & { role: string };
      if (decoded.role !== 'MANAGER') {
        return res.status(403).json({ message: 'Only managers can perform this action' });
      }

      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
        select: {
          id: true,
          email: true,
          role: true,
          uuid: true,
          profilePic: true,
        },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error('[GET USER BY ID ERROR]', error);
      return res.status(500).json({ message: 'Internal server error', error });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}