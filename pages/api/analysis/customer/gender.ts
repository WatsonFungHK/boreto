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
      const rawData = await prisma.customer.groupBy({
        by: ['gender'],
        _count: {
          gender: true,
        },
        orderBy: {
          'gender': 'asc',
        }
      });

      const formattedData = rawData.map((entry) => ({
        name: entry.gender ,
        count: entry._count.gender,
      }));
    
      console.log('formattedData: ', formattedData);
      res.status(200).json({ items: formattedData });
      return;
    }
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({ error: error.message })
  }
}
