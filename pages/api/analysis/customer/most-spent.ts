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
      const topCustomerOrders = await prisma.order.groupBy({
        by: ['customerId'],
        _sum: {
          totalAmount: true,
        },
        orderBy: {
          _sum: {
            totalAmount: 'desc',
          },
        },
        where: {
          companyId,
          status: {
            not: 'D'
          }
        },
        take: 10, // Adjust this value to get more or fewer top customers
      });


      const topCustomers = await Promise.all(
        topCustomerOrders.map(async (result) => {
          const customer = await prisma.customer.findUnique({
            where: { id: result.customerId },
          });
    
          return {
            ...customer,
            totalAmount: result._sum.totalAmount,
          };
        })
      )
    
      res.status(200).json({ items: topCustomers });
      return;
    }
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({ error: error.message })
  }
}
