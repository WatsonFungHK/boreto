// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma';
import { companyId } from 'pages/api/constants'
import dayjs from 'dayjs';

const range = {
  'today': {
    gte: dayjs().startOf('day').toDate(),
  },
  'yesterday': {
    gte: dayjs().subtract(1, 'day').startOf('day').toDate(),
  },
  'thisWeek': {
    gte: dayjs().startOf('week').toDate(),
  },
  'lastWeek': {
    gte: dayjs().subtract(1, 'week').startOf('week').toDate(),
  },
  'thisMonth': {
    gte: dayjs().startOf('month').toDate(),
  },
  'lastMonth': {
    gte: dayjs().subtract(1, 'month').startOf('month').toDate(),
  }
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
    const { quickFilter } = req.query as {
      quickFilter: string;
    };

    const whereClause = {
      companyId: companyId,
      ...(range[quickFilter] && {createdAt: range[quickFilter]}),
    }
      
    const totalSales = await prisma.order.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: whereClause
    });
     


      res.status(200).json({ totalAmount: totalSales._sum.totalAmount, period: quickFilter });
      return;
    }
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({ error: error.message })
  }
}
