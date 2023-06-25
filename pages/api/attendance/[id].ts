// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";
import cuid from "cuid";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      let response;
      response = await prisma.attendance.findUnique({
        where: {
          id: req.query.id as string,
        },
        include: {
          Staff: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
            },
          },
        },
      });
      if (!response) {
        response = await prisma.leave.findUnique({
          where: {
            id: req.query.id as string,
          },
          include: {
            Staff: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
              },
            },
          },
        });
      }

      res.status(200).json(response);
    }
    if (req.method === "POST") {
      const session = await getSession();
      const id = req.body.id || cuid();
      const { updated_at, created_at, StaffId, ...data } = req.body;

      let response;
      if (req.body.id) {
        response = await prisma.attendance.update({
          where: {
            id: req.body.id,
          },
          data: {
            ...data,
            id: req.body.id,
            Staff: {
              connect: {
                id: StaffId,
              },
            },
          },
        });
      } else {
        response = await prisma.attendance.create({
          data: {
            ...data,
            Staff: {
              connect: {
                id: StaffId,
              },
            },
          },
        });
      }

      res.status(200).json(response);
    }
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ error: error.message });
  }
}
