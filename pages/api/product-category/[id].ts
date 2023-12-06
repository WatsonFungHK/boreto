// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";
import cuid from "cuid";
import { getSession } from "next-auth/react";
import { companyId } from "pages/api/constants";
import supabase from "../../../lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const response = await prisma.productCategory.findUnique({
        where: {
          id: req.query.id as string,
        },
        include: {
          products: true,
        },
      });

      res.status(200).json(response);
    }
    if (req.method === "POST") {
      const id = req.body.id || cuid();
      const { updated_at, created_at, products, ...data } = req.body;

      const createBody = { ...data, id, companyId };
      if (!req.body.id) {
        // If there's no id in the request body, create a new product category
        const response = await prisma.productCategory.create({
          data: {
            ...createBody,
            products: {
              connect: products.map((id) => ({ id })),
            },
          },
        });

        res.status(200).json(response);
      } else {
        // If there's an id in the request body, update the existing product category
        const response = await prisma.productCategory.update({
          where: { id },
          data: {
            ...data,
            products: {
              set: products.map((id) => ({ id })),
            },
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
