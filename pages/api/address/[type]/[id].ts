import { NextApiRequest, NextApiResponse } from "next";
import prisma from 'lib/prisma';

const getWhereClause = (type, id) => {
  switch (type) {
    case 'customer':
      return {
        customerId: id
      }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      const { type, id } = req.query
      const response = await prisma.address.findMany({
        where: getWhereClause(type, id)
      });
      
      res.status(200).json(response);
    }
    
  } catch (err) {
    console.log('error: ', err);
    res.status(500).json({ error: err.message })
  }
}