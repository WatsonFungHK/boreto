import prisma from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcrypt";

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
    const user = await prisma.user.create({
      data: {
        first_name,
        last_name,
        email,
        password: await hash(password, 10),
      },
    });
    res.status(200).json(user);
  }
}