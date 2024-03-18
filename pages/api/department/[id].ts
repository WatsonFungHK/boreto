// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";
import cuid from "cuid";
import { getSession } from "next-auth/react";
import { companyId } from "pages/api/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const response = await prisma.department.findUnique({
        where: {
          id: req.query.id as string,
        },
        include: {
          users: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              department: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      res.status(200).json(response);
    }
    if (req.method === "POST") {
      const session = await getSession();
      const { id, users, ...data } = req.body;

      if (!id) {
        const createdDepartment = await prisma.department.create({
          data: {
            ...data,
            companyId,
            users: {
              connect: users.map((id) => ({ id })),
            },
          },
        });
        res.status(200).json(createdDepartment);
        // return createdDepartment
      } else {
        const updatedDepartment = await prisma.department.update({
          where: { id },
          data: {
            ...data,
            users: {
              set: users.map((id) => ({ id })),
            },
          },
        });
        res.status(200).json(updatedDepartment);
        // return updatedDepartment
      }
    }
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ error: error.message });
  }
}
