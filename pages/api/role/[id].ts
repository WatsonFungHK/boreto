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
      const { updated_at, created_at, users, permissions, id, ...data } = req.body;


      if (!id) {
        const createdRole = await prisma.role.create({
          data: {
            ...data,
            companyId,
            users: {
              connect: users.map((userId) => ({ user: { connect: { id: userId } } })),
            },
            permissions: {
              connect: permissions.map((permissionId) => ({ permission: { connect: { id: permissionId } } })),
            },
          },
        });
        res.status(200).json(createdRole);
      } else {
        const updatedRole = await prisma.role.update({
          where: { id },
          data: {
            ...data,
            users: {
              connect: users.map((userId) => ({ user: { connect: { id: userId } } })),
            },
            permissions: {
              connect: permissions.map((permissionId) => ({ permission: { connect: { id: permissionId } } })),
            },
          },
        });
        res.status(200).json(updatedRole);
      }
    }
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({ error: error.message })
  }
}
