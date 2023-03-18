import prisma from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username, password } = req.body;
  const exists = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  if (exists) {
    res.status(400).send({ error: "User already exists" });
  } else {
    const user = await prisma.user.create({
      data: {
        username,
        password: await hash(password, 10),
      },
    });
    res.status(200).json(user);
  }
}