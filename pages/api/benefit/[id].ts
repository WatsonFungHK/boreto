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
      const response = await prisma.benefit.findUnique({
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
          Designation: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      res.status(200).json(response);
    }
    if (req.method === "POST") {
      const session = await getSession();
      const id = req.body.id || cuid();
      const { updated_at, created_at, Staff, Designation, ...data } = req.body;

      let response;
      if (req.body.id) {
        response = await prisma.benefit.update({
          where: {
            id: req.body.id,
          },
          data: {
            ...data,
            id: req.body.id,
            Staff: {
              connect: Staff.map((StaffId) => ({
                Benefit: { connect: { id: StaffId } },
              })),
            },
            Designation: {
              connect: Designation.map((designation) => ({
                id: designation.value,
              })),
            },
          },
        });
      } else {
        response = await prisma.benefit.create({
          data: {
            ...data,
            Staff: {
              connect: Staff.map((StaffId) => ({
                Benefit: { connect: { id: StaffId } },
              })),
            },
            Designation: {
              connect: Designation.map((designationId) => ({
                designation: { connect: { id: designationId } },
              })),
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
