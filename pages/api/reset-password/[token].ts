// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";
import cuid from "cuid";
import { getSession } from "next-auth/react";
import { companyId } from "pages/api/constants";
import supabase from "../../../lib/supabase";
import { getServerSideProps } from "../../index";
import { hash } from "bcrypt";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup.string().email().required(),
  token: yup.string().required(),
});

const isResetTokenValid = async (
  token: string,
  email: string,
  res: NextApiResponse
) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { ResetPasswordEmail: true },
  });
  const tokenFromUser = user?.ResetPasswordEmail?.token;
  if (tokenFromUser !== token) {
    res.status(400).send({ message: "invalid token" });
    return null;
  }

  if (new Date() > user.ResetPasswordEmail?.expiredAt) {
    res.status(400).send({ message: "token expired" });
    return null;
  }
  return user;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log(req.query);
    try {
      await schema.validate(req.query);
    } catch (error) {
      res.status(400).json({ errors: error.errors });
      return;
    }

    if (req.method === "GET") {
      const { token, email } = req.query;

      const user = await isResetTokenValid(String(token), String(email), res);
      if (!user) return;

      res.status(200).json({ message: "ok" });
      return;
    } else if (req.method === "POST") {
      const { token, email } = req.query;

      const user = await isResetTokenValid(String(token), String(email), res);
      if (!user) return;

      const { password } = req.body;
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: await hash(password, 10),
        },
      });
      res.status(200).json({ message: "ok" });
      return;
    } else {
      res.status(405).json({ message: "method not supported" });
    }
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ error: error.message });
  }
}
