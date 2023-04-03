/**
 * start from now, whenever I sent you prisma query, change it from upsert to create and update by condition of req.body.id. do you understand
dont add comments, and include everything that make code works in production, which means dont skip res.status(200).json(response); and also remember to return response

 * 
 * from:
 * const response = await prisma.department.upsert({
where: {
id,
},
create: {
...data,
id,
companyId,
users: {
connect: users.map((id) => ({ id }))
}
},
update: {
...data,
users: {
set: users.map((id) => ({ id }))
}
}
});
 * 
 * 
 * to:
 *    const { id, users, ...data } = req.body;

      if (!id) {
        const createdDepartment = await prisma.department.create({
          data: {
            ...data,
            companyId,
            users: {
              connect: users.map((id) => ({ id })),
            },
          },
        });
        res.status(200).json(createdDepartment);
      } else {
        const updatedDepartment = await prisma.department.update({
          where: { id },
          data: {
            ...data,
            users: {
              set: users.map((id) => ({ id })),
            },
          },
        });
        res.status(200).json(updatedDepartment);
      }
 * 

      do you understand? please do it for query I will provide you
 */
