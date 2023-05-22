// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma';
import { companyId } from '../constants'

const filterFields = []

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { keyword = '', pageNumber, pageSize, customerId } = req.query;
    const filterConditions = keyword ? filterFields.map((field) => {
      return {
        [field]: {
          contains: keyword,
          mode: 'insensitive'
        }
      }
    }) : [];
    const whereClause = {
      companyId,
      ...(customerId && { customerId: customerId as string }),
      NOT: {
        status: 'D'
      },
      // OR: [...filterConditions]
    }
    
    const _pageNumber = parseInt(pageNumber as string, 10) || 1;
    const _pageSize = parseInt(pageSize as string, 10) || 10;
    const skip = (_pageNumber - 1) *_pageSize;
    const take = _pageSize;

    const [total, items] = await prisma.$transaction([
      prisma.order.count({
        where: whereClause
      }),
      prisma.order.findMany({
        orderBy: {
          updatedAt: 'desc'
        },
        where: whereClause,
        skip,
        take,
        include: {
          orderItems: {
            select: {
              name: true
            }
          },
          customer: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
            }
          },
          Shipping: {
            select: {
              status: true
            }
          },
          Payment: {
            select: {
              status: true
            }
          }
        },
      }),
    ])

    res.status(200).json({ total, items });
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({ error: error.message })
  }
}
