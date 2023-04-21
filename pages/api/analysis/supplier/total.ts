// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma';
import { companyId } from 'pages/api/constants'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      const suppliers = await prisma.supplier.findMany({
        where: {
          companyId,
          status: 'A'
        },
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              products: true
            }
          }
        },
        orderBy: {
          products: {
            _count: 'desc',
          },
        },
        take: 5,
      })

      res.status(200).json(suppliers);
      return;
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
