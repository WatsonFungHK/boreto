// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";
import cuid from "cuid";
import { getSession } from "next-auth/react";
import { companyId } from "pages/api/constants";
import supabase from "../../../lib/supabase";
import { getServerSideProps } from "../../index";
import { randomUUID } from "crypto";

const getExpiredTime = () => {
  const expiredMinutes =
    parseInt(process.env.RESET_PASSWORD_EMAIL_EXPIRE_MINUTE) || 10;
  return new Date(new Date().getTime() + expiredMinutes * 60000);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      const {
        props: { session },
      } = await getServerSideProps({ req, res });
      const userId = session.user.id;
      const data = {
        token: randomUUID(),
        expiredAt: getExpiredTime(),
      };
      const response = await prisma.resetPasswordEmail.upsert({
        where: { userId },
        create: {
          ...data,
          user: {
            connect: {
              id: userId,
            },
          },
        },
        update: data,
      });
      // TOOD send email
      res.status(200).json(response);
      return;
    } else {
      res.status(405).json({ message: "method not supported" });
    }
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ error: error.message });
  }
}
