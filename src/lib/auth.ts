import { betterAuth } from "better-auth";
import prisma from "./prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  user: {
    additionalFields: {
      role: { type: "string" },
      status: { type: "string" },
      universityId: { type: "string", nullable: true },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
