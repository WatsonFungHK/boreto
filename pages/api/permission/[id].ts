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
      const response = await prisma.permission.findUnique({
        where: {
          id: req.query.id
        },
      });
      
      res.status(200).json(response);
    }
    if (req.method === 'POST') {
      const session = await getSession()
      const id = req.body.id || cuid();
      const { updated_at, created_at, products, ...data } = req.body;

      const createBody = {...data, id, companyId };
      const response = await prisma.permission.upsert({
        where: {
          id,
        },
        create: {
          ...data,
          id,
          companyId,

        },
        update: {
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
