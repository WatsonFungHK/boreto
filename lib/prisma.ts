import { PrismaClient } from "@prisma/client";
import { companyId, userId } from "pages/api/constants";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

prisma.$use(async (params, next) => {
  // Your middleware logic goes here
  try {
    const result = await next(params);

    if (
      result &&
      ["create", "update"].includes(params.action) &&
      !["AuditLog", "Address"].includes(params.model)
    ) {
      await prisma.auditLog.create({
        data: {
          companyId,
          userId,
          targetModel: params.model,
          action: params.action,
          targetId: result?.id,
          data: params.args.data,
        },
      });
    } else {
      return result;
    }
  } catch (err) {
    console.log("err: ", err);
    throw err;
  }
});

export default prisma;
