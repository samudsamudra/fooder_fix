import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Ensure the method is PUT
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as jwt.JwtPayload & { role: string };
    const { userId, email, password, profilePic } = req.body;

    // Simple validation
    if (!email && !password && !profilePic) {
      return res.status(400).json({ message: 'At least one field is required to update' });
    }

    const updateData: any = {};
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 10);
    if (profilePic) updateData.profilePic = profilePic;

    if (userId) {
      // Only managers can update other users
      if (decoded.role !== 'MANAGER') {
        return res.status(403).json({ message: 'Only managers can update other users' });
      }

      const updatedUser = await prisma.user.update({
        where: { id: parseInt(userId) },
        data: updateData,
      });

      return res.status(200).json({
        message: 'User updated successfully',
        data: updatedUser,
      });
    } else {
      // Self update
      const updatedUser = await prisma.user.update({
        where: { id: decoded.id },
        data: updateData,
      });

      return res.status(200).json({
        message: 'User updated successfully',
        data: updatedUser,
      });
    }
  } catch (error) {
    console.error('[UPDATE USER ERROR]', error);
    return res.status(500).json({ message: 'Internal server error', error });
  }
}