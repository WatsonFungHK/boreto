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
      const bestProducts = await prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: {
          quantity: true,
        },
        orderBy: {
          _sum: {
            quantity: 'desc',
          },
        },
        take: 5,
      });

      const productsWithDetails = await Promise.all(
        bestProducts.map(async (result) => {
          const product = await prisma.product.findUnique({
            where: { id: result.productId },
            select: { id: true, name: true },
          });
    
          return {
            ...product,
            totalQuantity: result._sum.quantity,
          };
        })
      );

      res.status(200).json({ items: productsWithDetails });
      return;
    }
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({ error: error.message })
  }
}
