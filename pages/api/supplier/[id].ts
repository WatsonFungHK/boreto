// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma';
import { companyId } from 'pages/api/constants'

const upsertContacts = async (contacts, supplierId) => {
  await Promise.all(
    contacts.map(async (contact) => {
      const { updated_at, created_at, ...payload} = contact
      await prisma.contact.upsert({
        where: { id: contact.id || '-1' }, 
        create: {
          ...payload,
          supplierId
        },
        update: {
          ...payload,
          supplierId,
          
        },
      });
    })
  );

  const existingContacts = await prisma.contact.findMany({
    where: { supplierId },
  });

  const contactsToUpdate = existingContacts.filter(
    (existingContact) => !contacts.some((contact) => contact.id === existingContact.id)
  );

  await Promise.all(
    contactsToUpdate.map(async (contact) => {
      await prisma.contact.update({
        where: { id: contact.id },
        data: {
          status: 'D',
        },
      });
    })
  );
}

const upsertAddresses = async (addresses, supplierId) => {
  await Promise.all(
    addresses.map(async (address) => {
      const { updated_at, created_at, ...payload} = address
      await prisma.address.upsert({
        where: { id: address.id || '-1' }, 
        create: {
          ...payload,
          supplierId
        },
        update: {
          ...payload,
          supplierId
        },
      });
    })
  );

  const existingAddresses = await prisma.address.findMany({
    where: { supplierId },
  });

  const addressesToUpdate = existingAddresses.filter(
    (existingAddress) => !addresses.some((address) => address.id === existingAddress.id)
  );

  await Promise.all(
    addressesToUpdate.map(async (address) => {
      await prisma.address.update({
        where: { id: address.id },
        data: {
          status: 'D',
        },
      });
    })
  );
}

const update = async (req: NextApiRequest, res: NextApiResponse) => {
  const supplierId = req.body.id;
  const { updated_at, created_at, addresses, contacts, products, ...data } = req.body;
  const supplier = await prisma.supplier.update({
    where: { id: req.body.id },
    data: {
      ...data,
      products: {
        set: products.map((id) => ({ id }))
      }
    },
  });

  upsertAddresses(addresses, supplierId)
  upsertContacts(contacts, supplierId)

  res.status(200).json(supplier);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
       const response = await prisma.supplier.findUnique({
        where: {
          id: req.query.id,
        },
        include: {
          addresses: {
            where: {
              status: 'A'
            }
          },
          contacts: {
            where: {
              status: 'A'
            }
          },
          products:{
            where: {
              status: 'A'
            }
          }
        }
      });
      
      res.status(200).json(response);
      return;
    }
    if (req.method === 'POST') {
      if (req.body.id) {
        await update(req, res)
      } else {
        const { updated_at, created_at, addresses, contacts, products, ...data } = req.body;
        const response = await prisma.supplier.create({
          data: {
            ...data,
            companyId,
            addresses: {
              create: addresses
            },
            contacts: {
              create: contacts
            },
            products: {
              connect: products.map((id) => ({id}))
            }
          }
        })
        res.status(200).json(response);
        return
      }

    }
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({ error: error.message })
  }
}
