// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma';
import cuid from 'cuid';
import { getSession } from 'next-auth/react';
import { companyId } from 'pages/api/constants'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      const response = await prisma.role.findUnique({
        where: {
          id: req.query.id
        },
        include: {
          users: {
            include: {
              user: {
                select: {
                  id: true,
                  first_name: true,
                  last_name: true,
                }
              }
            }
          },
          permissions: {
            include: {
               permission: {
                select: {
                  id: true,
                  name: true
                }
               }
            }
          }
        }
      });
      
      res.status(200).json(response);
    }
    if (req.method === 'POST') {
      const session = await getSession()
      const id = req.body.id || cuid();
      const { updated_at, created_at, users, permissions, ...data } = req.body;

      const createBody = {...data, id, companyId };
      const response = await prisma.role.upsert({
        where: {
          id,
        },
        create: {
          ...data,
          id,
          companyId,
          users: {
            create: users.map((id) => ({ user: {
              connect: { id }
            }}))
          },
          permissions: {
            create: permissions.map((id) => ({ permission: {
              connect: { id }
            }}))
          },
        },
        update: {
          ...data,
          users: {
            deleteMany: {}, // Disconnect and delete all existing related user records
            create: users.map((id) => ({ user: {
              connect: { id }
            }})), // Add new user connections
          },
          permissions: {
            deleteMany: {}, // Disconnect and delete all existing related permission records
            create: permissions.map((id) => ({ permission: {
              connect: { id }
            }})), // Add new permission connections
          },
        }
      });
        
      res.status(200).json(response);
    }
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({ error: error.message })
  }
}
