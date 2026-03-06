import { auth } from "./auth";

declare module "better-auth" {
    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            emailVerified: boolean;
            image?: string | null;
            createdAt: Date;
            updatedAt: Date;
            role: string;
            status: string;
            universityId?: string | null;
        };
    }
}
