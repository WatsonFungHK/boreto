// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma';

const filterFields = ['name']

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { pageNumber, pageSize, model, id } = req.query;

    let whereClause = {}
    if (model === 'Order') {
      const order = await prisma.order.findUnique({
        where: { id: id as string },
        include: {
          Shipping: {
            select: {
              id: true,
            }
          }, // Include the related shipping records
        },
      });

      whereClause = {
        NOT: {
          status: 'D',
        },
        OR: [
          { targetModel: 'Order', targetId: id },
          {
            targetModel: 'Shipping',
            targetId: {
              in: order.Shipping.map((shipping) => shipping.id),
            },
          },
        ],
      }
    } else {

      whereClause = {
        NOT: {
          status: 'D',
        },
        targetModel: model as string,
        targetId: id as string,
      }
    }
   
    const _pageNumber = parseInt(pageNumber as string, 10) || 1;
    const _pageSize = parseInt(pageSize as string, 10) || 10;
    const skip = (_pageNumber - 1) *_pageSize;
    const take = _pageSize;

    const [total, items] = await prisma.$transaction([
      prisma.auditLog.count({
        where: whereClause
      }),
      prisma.auditLog.findMany({
        orderBy: {
          updatedAt: 'desc'
        },
        where: whereClause,
        ...(pageNumber && pageSize && {
          skip,
          take
        }),
        include: {
          user: {
            select: {
              first_name: true,
              last_name: true,
              id: true
            }
          }
        }
      }),
    ])
    res.status(200).json({ total, items });
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
