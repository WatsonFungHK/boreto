// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'
import { getServerSession } from 'next-auth/next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log('session: ', session);
    const customer = await prisma.customer.create({
      data: {
        ...req.body,
        companyId: session.user.companyId,
      },
    })

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
