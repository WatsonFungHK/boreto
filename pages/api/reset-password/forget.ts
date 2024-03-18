// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";
import cuid from "cuid";
import { getSession } from "next-auth/react";
import { companyId } from "pages/api/constants";
import supabase from "../../../lib/supabase";
import { getServerSideProps } from "../../index";
import { randomUUID } from "crypto";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup.string().email().required(),
});

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
      try {
        await schema.validate(req.body);
      } catch (error) {
        res.status(400).json({ errors: error.errors });
        return;
      }

      const { email } = req.body;
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        res.status(404).json({ message: "user not found" });
        return;
      }
      const userId = user.id;
      const data = {
        token: randomUUID(),
        expiredAt: getExpiredTime(),
      };
      await prisma.resetPasswordEmail.upsert({
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
      res.status(200).json({ message: "success" });
      return;
    } else {
      res.status(405).json({ message: "method not supported" });
    }
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ error: error.message });
  }
}
