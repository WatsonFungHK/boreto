// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";
import cuid from "cuid";
import { getSession } from "next-auth/react";
import { companyId } from "pages/api/constants";
import supabase from "../../../lib/supabase";
import { getServerSideProps } from "../../index";
import { hash } from "bcrypt";

const isResetTokenValid = async (
  token: string,
  userId: string,
  res: NextApiResponse
) => {
  const dataFromToken = await prisma.resetPasswordEmail.findFirst({
    where: { token },
  });
  if (dataFromToken === null || dataFromToken?.userId !== userId) {
    res.status(400).send({ message: "invalid token" });
    return false;
  }

  console.log(new Date());
  console.log(dataFromToken.expiredAt);
  if (new Date() > dataFromToken.expiredAt) {
    res.status(400).send({ message: "token expired" });
    return false;
  }
  return true;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const {
        props: { session },
      } = await getServerSideProps({ req, res });
      const { token } = req.query;
      console.log(req.query);

      const ok = await isResetTokenValid(String(token), session.user.id, res);
      if (!ok) return;

      res.status(200).json({ message: "ok" });
      return;
    } else if (req.method === "POST") {
      const {
        props: { session },
      } = await getServerSideProps({ req, res });
      const userId = session.user.id;
      const { token } = req.query;

      const ok = await isResetTokenValid(String(token), userId, res);
      if (!ok) return;

      const { password } = req.body;
      await prisma.user.update({
        where: { id: userId },
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
