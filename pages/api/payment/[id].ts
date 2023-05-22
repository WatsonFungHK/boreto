// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma';
import cuid from 'cuid';
import { getSession } from 'next-auth/react';
import { companyId } from 'pages/api/constants'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      const response = await prisma.payment.findUnique({
        where: {
          id: req.query.id as string
        },
      });
      
      res.status(200).json(response);
    }
    if (req.method === 'POST') {
      const session = await getSession()
      const id = req.query.id as string;
      const { updated_at, created_at, id: _id, ...data } = req.body;

      const response = await prisma.payment.update({
        where: {
          id,
        },
        data: {
          ...data,
        }
      });
        
      res.status(200).json(response);
    }
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({ error: error.message })
  }
}
