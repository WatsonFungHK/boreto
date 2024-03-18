import prisma from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcrypt";
import supabase from "../../../lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password, first_name, last_name } = req.body;
  const exists = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (exists) {
    res.status(400).send({ error: "User already exists" });
  } else {
    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        first_name,
        last_name,
        email,
        password: hashedPassword,
        Account: {
          create: {
            type: "credentials",
            provider: "credentials",
            providerAccountId: email,
          },
        },
      },
    });

    res.status(200).json(user);
  }
}
