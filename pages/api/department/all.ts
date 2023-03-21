// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma';
import { companyId } from '../constants';

const filterFields = ['name']

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { keyword = '', pageNumber, pageSize } = req.query;
    const filterConditions = filterFields.map((field) => {
      return {
        [field]: {
          contains: keyword,
          mode: 'insensitive'
        }
      }
    });
    const whereClause = {
      companyId,
      NOT: {
        status: 'D'
      },
      OR: [...filterConditions]
    }
   
    const _pageNumber = parseInt(pageNumber as string, 10) || 1;
    const _pageSize = parseInt(pageSize as string, 10) || 10;
    const skip = (_pageNumber - 1) *_pageSize;
    const take = _pageSize;

    const [total, items] = await prisma.$transaction([
      prisma.department.count({
        where: whereClause
      }),
      prisma.department.findMany({
        orderBy: {
          updated_at: 'desc'
        },
        where: whereClause,
        ...(pageNumber && pageSize && {
          skip,
          take
        }),
        include: {
          _count: {
            select: {
              users: true
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
