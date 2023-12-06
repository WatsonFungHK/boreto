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
      const response = await prisma.product.findUnique({
        where: {
          id: req.query.id as string,
        },
        include: {
          category: true,
        },
      });

      res.status(200).json(response);
    }
    if (req.method === "POST") {
      const session = await getSession();
      if (req.body.id) {
        const { updated_at, created_at, categoryId, images, ...data } =
          req.body;
        const response = await prisma.product.update({
          where: {
            id: req.body.id,
          },
          data: {
            ...data,
            id: req.body.id,
            companyId,
            categoryId,
          },
        });
        res.status(200).json(response);
      } else {
        const { updated_at, created_at, ...data } = req.body;
        const response = await prisma.product.create({
          data: {
            ...data,
            companyId,
          },
        });

        res.status(200).json(response);
      }
    }
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ error: error.message });
  }
}
