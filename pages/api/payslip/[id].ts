// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const response = await prisma.payslip.findUnique({
        where: {
          id: req.query.id as string,
        },
        include: {
          staff: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
            },
          },
        },
      });

      res.status(200).json(response);
      return;
    }
    if (req.method === "POST") {
      const { deduction, allowance, ...data } = req.body;
      if (req.body.id) {
        const response = await prisma.payslip.update({
          where: { id: req.body.id },
          data: {
            payrollStatus: req.body.payrollStatus,
          },
        });
        res.status(200).json(response);
      } else {
        const response = await prisma.payslip.create({
          data: {
            deduction: parseInt(deduction),
            allowance: parseInt(allowance),
            ...data,
          },
        });

        res.status(200).json(response);
        return;
      }
    }
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ error: error.message });
  }
}
