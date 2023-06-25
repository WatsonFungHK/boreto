// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma';
import cuid from 'cuid';
import { getSession } from 'next-auth/react';
import { companyId, userId } from 'pages/api/constants'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
       const response = await prisma.quotation.findUnique({
        where: {
          id: req.query.id as string,
        }
      });
      
      res.status(200).json(response);
      return;
    }
    if (req.method === 'POST') {
      if (req.body.id) {
        const response = await prisma.quotation.update({
          where: { id: req.body.id },
          data: {
            payload: req.body
          },
        });
        res.status(200).json(response);
      } else {
        const response = await prisma.quotation.create({
          data: {
            externalId: req.body.externalId,
            payload: req.body,
            companyId,
            creatorId: userId,
          },
        });

        res.status(200).json(response);
        return
      }

    }
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({ error: error.message })
  }
}
