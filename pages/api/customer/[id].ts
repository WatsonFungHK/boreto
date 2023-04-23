// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma';
import cuid from 'cuid';
import { getSession } from 'next-auth/react';
import { companyId } from 'pages/api/constants'

const update = async (req: NextApiRequest, res: NextApiResponse) => {
  const customerId = req.body.id;
  const { updated_at, created_at, addresses, ...data } = req.body;
  const updatedCustomer = await prisma.customer.update({
    where: { id: req.body.id },
    data: data,
  });

  await Promise.all(
    addresses.map(async (address) => {
      const { updated_at, created_at, ...payload} = address
      await prisma.address.upsert({
        where: { id: address.id || '-1' }, 
        create: {
          ...payload,
          customerId
        },
        update: {
          ...payload,
          customerId
        },
      });
    })
  );

  const existingAddresses = await prisma.address.findMany({
    where: { customerId },
  });

  const addressesToUpdate = existingAddresses.filter(
    (existingAddress) => !addresses.some((address) => address.id === existingAddress.id)
  );

  await Promise.all(
    addressesToUpdate.map(async (address) => {
      await prisma.address.update({
        where: { id: address.id },
        data: {
          status: 'D',
        },
      });
    })
  );

  return updatedCustomer;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
       const response = await prisma.customer.findUnique({
        where: {
          id: req.query.id,
        },
        include: {
          addresses: {
            where: {
              status: 'A'
            }
          },
          _count: {
            select: {
              Order: true
            }
          }
        }
      });
      
      res.status(200).json(response);
      return;
    }
    if (req.method === 'POST') {
      let response;
      if (req.body.id) {
        response = await update(req, res)
      } else {
        const { updated_at, created_at, addresses, ...data } = req.body;
        response = await prisma.customer.create({
          data: {
            ...data,
            companyId,
            addresses: {
              create: addresses
            }
          }
        })
      }
      res.status(200).json(response);
    }
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({ error: error.message })
  }
}
