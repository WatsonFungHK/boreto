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
       const response = await prisma.order.findUnique({
        where: {
          id: req.query.id as string,
        },
        include: {
          orderItems: true,
          customer: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
            }
          },
          Shipping: {
            select: {
              id: true,
              cost: true,
              trackingNumber: true,
              trackingUrl : true,
              trackingProvider : true,
              address: true,
              status: true,
              method: {
                select: {
                  name: true,
                  provider: true,
                }
              }
            }
          },
          Payment: {
            select: {
              id: true,
              status: true,
              cost: true,
              costType: true,
              method: {
                select: {
                  name: true,
                }
              }
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
        const {
          updated_at,
          created_at,
          orderItems,
          methodId,
          addressId,
          customerId,
          payment,
          ...data
        } = req.body;
        const orderItemData =  orderItems.map((item) => ({
          productId: item.product.value,
          name: item.product.label,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal
        }));

        const method = await prisma.shippingMethod.findUnique({
          where: {
            id: methodId
          }
        });
        const paymentMethod = await prisma.paymentMethod.findUnique({
          where: {
            id: payment.methodId
          }
        });

        const address = await prisma.address.findUnique({
          where: {
            id: addressId
          },
          select:{
            line_1: true,
            line_2: true,
            line_3: true,
            city: true,
            state: true,
            country: true,
            postal_code: true,
            status: true,
            type: true,
          }
        });
        const totalAmount = orderItemData.reduce((acc, item) => acc + item.subtotal, 0);
        const [createdOrder] = await prisma.$transaction([
          prisma.order.create({
            data: {
              ...data,
              company: {
                connect: {
                  id: companyId
                }
              },
              customer: {
                connect: {
                  id: customerId
                }
              },
              // sum subtotal of orderItems
              totalAmount: orderItemData.reduce((acc, item) => acc + item.subtotal, 0),
              orderItems: {
                create: orderItemData
              },
              Shipping: {
                create: {
                  method: {
                    connect: {
                      id: methodId
                    }
                  },
                  cost: method.cost,
                  address: {
                    create: address
                  }
                }
              },
              Payment: {
                create: {
                  method: {
                    connect: {
                      id: payment.methodId
                    }
                  },
                  costType: paymentMethod.costType,
                  cost: paymentMethod.cost,
                  amount: totalAmount,
                  status: payment.status
                }
              }
            },
            select: {
              id: true,
              totalAmount: true
            }
          }),
          ...orderItemData.map((item) => prisma.product.update({
            where: {
              id: item.productId
            },
            data: {
              unit: {
                decrement: item.quantity
              }
            }
          }))
        ]);


        res.status(200).json(createdOrder);
        return
      }

    }
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({ error: error.message })
  }
}
