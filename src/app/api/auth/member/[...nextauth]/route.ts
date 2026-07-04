import NextAuth from "next-auth";
import { memberAuthOptions } from "@/lib/auth/member-config";

const handler = NextAuth(memberAuthOptions);

export { handler as GET, handler as POST };
