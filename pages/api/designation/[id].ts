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
      const response = await prisma.designation.findUnique({
        where: {
          id: req.query.id as string,
        },
        include: {
          Benefit: {
            select: {
              id: true,
              name: true,
            },
          },
          Department: {
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
      const {
        updated_at,
        created_at,
        benefits,
        departmentId,
        department,
        id,
        ...data
      } = req.body;

      if (!id) {
        const createdDesignation = await prisma.designation.create({
          data: {
            ...data,
            Benefit: {
              connect: benefits?.map((benefit) => ({
                Benefit: { connect: { id: benefit.id } },
              })),
            },
            ...(departmentId && {
              Department: {
                connect: {
                  id: departmentId,
                },
              },
            }),
          },
        });
        res.status(200).json(createdDesignation);
      } else {
        const updatedDesignation = await prisma.designation.update({
          where: { id },
          data: {
            ...data,
            companyId,
            Benefit: {
              connect: benefits?.map((benefitId) => ({
                Benefit: { connect: { id: benefitId } },
              })),
            },
            Department: {
              connect: {
                id: departmentId,
              },
            },
          },
        });
        res.status(200).json(updatedDesignation);
      }
    }
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ error: error.message });
  }
}
