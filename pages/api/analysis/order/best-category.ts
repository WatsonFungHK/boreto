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
      const categories = await prisma.productCategory.findMany({
        where: {
          companyId,
        },
        include: {
          products: {
            select: {
              OrderItem: true,
            },
          },
        },
      });

      const categoriesWithSoldAmount = categories.map((category) => {
        let totalQuantity = 0;
    
        category.products.forEach((product) => {
          product.OrderItem.forEach((orderItem) => {
            totalQuantity += orderItem.quantity;
          });
        });
    
        return {
          id: category.id,
          name: category.name,
          totalQuantity,
        };
      });

      categoriesWithSoldAmount.sort(
        (a, b) => b.totalQuantity - a.totalQuantity
      );
    
      res.status(200).json({ items: categoriesWithSoldAmount })
    }
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({ error: error.message })
  }
}
