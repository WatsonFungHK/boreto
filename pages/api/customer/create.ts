// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'
import { getServerSession } from 'next-auth/next';
import { companyId } from 'pages/api/constants'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const customer = await prisma.customer.create({
      data: {
        ...req.body,
        companyId
      },
    })

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
