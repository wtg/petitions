import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { genericOAuth } from "better-auth/plugins";

export const auth = betterAuth({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user: schema.user,
            session: schema.session,
            account: schema.account,
            verification: schema.verification,
        },
    }),
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        genericOAuth({
            config: [
                {
                    providerId: "shib",
                    clientId: process.env.CLIENT_ID ?? "",
                    clientSecret: process.env.CLIENT_SECRET,
                    discoveryUrl: "https://shib.auth.rpi.edu/idp/profile/oidc/configuration",
                    // authorizationUrl: "https://shib.auth.rpi.edu/idp/profile/oidc/authorize",
                    // tokenUrl: "https://shib.auth.rpi.edu/idp/profile/oidc/token",
                    // userInfoUrl: "https://shib.auth.rpi.edu/idp/profile/oidc/userinfo",
                    // scopes: ["openid", "email", "profile"],
                }
            ]
        })
    ]
});
