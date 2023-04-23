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
    const product = await prisma.product.findUnique({
      where: { id: req.body.id }
    });
     await prisma.product.update({
      where: {
        id: req.body.id,
      },
      data: {
        ...product,
        unit: product.unit + req.body.unit,
      },
   });

   const response = await prisma.product.findUnique({
    where: {
      id: req.body.id,
    },
    include: {
      images: true,
    }
  });

   res.status(200).json(response);
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({ error: error.message })
  }
}
