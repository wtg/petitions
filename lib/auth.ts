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
                    authorizationUrl: "https://shib.auth.rpi.edu/idp/profile/oidc/authorize",
                    tokenUrl: "https://shib.auth.rpi.edu/idp/profile/oidc/token",
                    userInfoUrl: "https://shib.auth.rpi.edu/idp/profile/oidc/userinfo",
                    scopes: ["openid", "email", "profile"],
                    pkce: true,
                    responseMode: "query",
                    getToken: async ({ code, redirectURI }) => {
                        const params = new URLSearchParams({
                            code,
                            redirect_uri: redirectURI,
                            grant_type: "authorization_code",
                        });

                        const credentials = Buffer.from(
                            `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
                        ).toString("base64");

                        const response = await fetch(
                            "https://shib.auth.rpi.edu/idp/profile/oidc/token",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/x-www-form-urlencoded",
                                    "Authorization": `Basic ${credentials}`,
                                },
                                body: params.toString(),
                            }
                        );
                        const data = await response.json();
                        return {
                            accessToken: data.access_token,
                            refreshToken: data.refresh_token,
                            idToken: data.id_token,
                            accessTokenExpiresAt: new Date(Date.now() + data.expires_in * 1000),
                            scopes: data.scope?.split(" ") ?? [],
                            raw: data,
                        };
                    },
                    getUserInfo: async (tokens) => {
                        const response = await fetch(
                            "https://shib.auth.rpi.edu/idp/profile/oidc/userinfo",
                            {
                                headers: {
                                    "Authorization": `Bearer ${tokens.accessToken}`,
                                },
                            }
                        );
                        const data = await response.json();
                        return {
                            id: data.sub,
                            email: data.email,
                            name: data.name || data.preferred_username || data.given_name,
                            image: data.picture,
                            emailVerified: data.email_verified ?? false,
                        };
                    }
                }
            ]
        })
    ]
});
