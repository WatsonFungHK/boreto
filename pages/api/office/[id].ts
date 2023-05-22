// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma';
import cuid from 'cuid';
import { getSession } from 'next-auth/react';
import { companyId } from 'pages/api/constants'

const update = async (req: NextApiRequest, res: NextApiResponse) => {
  const officeId = req.body.id;
  const { updated_at, created_at, addresses, users, ...data } = req.body;
  const updatedoffice = await prisma.office.update({
    where: { id: req.body.id },
    data: {
      ...data,
      users: {
        set: users.map((id) => ({ id }))
      }
    },
    
  });

  await Promise.all(
    addresses.map(async (address) => {
      const { updated_at, created_at, ...payload} = address
      await prisma.address.upsert({
        where: { id: address.id || '-1' }, 
        create: {
          ...payload,
          officeId
        },
        update: {
          ...payload,
          officeId
        },
      });
    })
  );

  const existingAddresses = await prisma.address.findMany({
    where: { officeId },
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

  res.status(200).json(updatedoffice);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
       const response = await prisma.office.findUnique({
        where: {
          id: req.query.id as string,
        },
        include: {
          addresses: {
            where: {
              status: 'A'
            }
          },
          users: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              office: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      });
      
      res.status(200).json(response);
      return;
    }
    if (req.method === 'POST') {
      if (req.body.id) {
        await update(req, res)
      } else {
        const { updated_at, created_at, addresses, users, ...data } = req.body;
        const response = await prisma.office.create({
          data: {
            ...data,
            companyId,
            addresses: {
              create: addresses
            },
            users: {
              connect: users.map((id) => ({ id }))
            }
          }
        })
        res.status(200).json(response);
        return
      }

    }
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({ error: error.message })
  }
}
