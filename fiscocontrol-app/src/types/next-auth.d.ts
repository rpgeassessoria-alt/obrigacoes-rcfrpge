import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: string;
            tenantId?: string | null;
            allowedGroups?: string[];
        } & DefaultSession["user"];
    }

    interface User {
        role: string;
        tenantId?: string | null;
        allowedGroups?: string[];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: string;
        tenantId?: string | null;
        allowedGroups?: string[];
    }
}
