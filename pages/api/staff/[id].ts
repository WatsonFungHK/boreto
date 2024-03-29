// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";
import cuid from "cuid";
import { getSession } from "next-auth/react";
import { companyId } from "pages/api/constants";

const update = async (req: NextApiRequest, res: NextApiResponse) => {
  const staffId = req.body.id;
  const { updated_at, created_at, addresses, designation, ...data } = req.body;
  const updatedStaff = await prisma.staff.update({
    where: { id: req.body.id },
    data: {
      ...data,
      designationId: data.designationId,
    },
  });

  await Promise.all(
    addresses.map(async (address) => {
      const { updated_at, created_at, ...payload } = address;
      await prisma.address.upsert({
        where: { id: address.id || "-1" },
        create: {
          ...payload,
          StaffId: staffId,
        },
        update: {
          ...payload,
          StaffId: staffId,
        },
      });
    })
  );

  const existingAddresses = await prisma.address.findMany({
    where: { StaffId: staffId },
  });

  const addressesToUpdate = existingAddresses.filter(
    (existingAddress) =>
      !addresses.some((address) => address.id === existingAddress.id)
  );

  await Promise.all(
    addressesToUpdate.map(async (address) => {
      await prisma.address.update({
        where: { id: address.id },
        data: {
          status: "D",
        },
      });
    })
  );

  return updatedStaff;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      // const startPeriod = (req.query.payPeriod as string).replace("?", "-");
      // const year = startPeriod.split("-")[0];
      // const month = parseInt(startPeriod.split("-")[1]);

      const response = await prisma.staff.findUnique({
        where: {
          id: req.query.id as string,
        },
        include: {
          addresses: {
            where: {
              status: "A",
            },
          },
          designation: true,
          attendance: true,
          leave: true
          // Attendance: {
          //   where: {
          //     date: {
          //       gte: `${startPeriod}-01`,
          //       lt: `${year}-${month}-01`,
          //     },
          //   },
          // },
          // Leave: {
          //   where: {
          //     date: {
          //       gte: `${startPeriod}-01`,
          //       lt: `${year}-${month + 1}-01`,
          //     },
          //   },
          // },
        },
      });

      res.status(200).json(response);
      return;
    }
    if (req.method === "POST") {
      let response;
      if (req.body.id) {
        response = await update(req, res);
      } else {
        const { updated_at, created_at, addresses, designationId, ...data } =
          req.body;
        response = await prisma.staff.create({
          data: {
            ...data,
            designation: {
              connect: { id: designationId },
            },
            company: {
              connect: { id: companyId },
            },
            addresses: {
              create: addresses,
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
