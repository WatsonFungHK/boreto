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
      const aggregatedData = await prisma.orderItem.groupBy({
        by: [
          'productId',
          {
            categoryId: true,
            category: {
              id: true,
              name: true,
            },
          },
        ],
        _sum: {
          quantity: true,
        },
      });
      
      const bestProductCategories = aggregatedData
        .sort((a, b) => b._sum.quantity - a._sum.quantity)
        .slice(0, 5)
        .map((result) => ({
          id: result.product.category.id,
          name: result.product.category.name,
          totalQuantity: result._sum.quantity,
        }));
      res.status(200).json({ items: bestProductCategories });
      return;
    }
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({ error: error.message })
  }
}
