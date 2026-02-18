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
                    responseMode: "query",
                    getToken: async ({ code, redirectURI, codeVerifier }) => {
                        const body = new URLSearchParams({
                            grant_type: "authorization_code",
                            code,
                            redirect_uri: redirectURI,
                        });
                        if (codeVerifier) {
                            body.set("code_verifier", codeVerifier);
                        }

                        const credentials = Buffer.from(
                            `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
                        ).toString("base64");

                        const response = await fetch(
                            "https://shib.auth.rpi.edu/idp/profile/oidc/token",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/x-www-form-urlencoded",
                                    "Accept": "application/json",
                                    "Authorization": `Basic ${credentials}`,
                                },
                                body: body.toString(),
                            }
                        );
                        const data = await response.json();
                        return {
                            tokenType: data.token_type,
                            accessToken: data.access_token,
                            refreshToken: data.refresh_token,
                            idToken: data.id_token,
                            accessTokenExpiresAt: data.expires_in
                                ? new Date(Date.now() + data.expires_in * 1000)
                                : undefined,
                            refreshTokenExpiresAt: data.refresh_token_expires_in
                                ? new Date(Date.now() + data.refresh_token_expires_in * 1000)
                                : undefined,
                            scopes: data.scope
                                ? data.scope.split(" ")
                                : [],
                            raw: data,
                        };
                    },
                    getUserInfo: async (tokens) => {
                        const res = await fetch(
                            "https://shib.auth.rpi.edu/idp/profile/oidc/userinfo",
                            {
                                headers: {
                                    Authorization: `Bearer ${tokens.accessToken}`,
                                },
                            }
                        );
                        const data = await res.json();
                        return {
                            id: data.sub,
                            email: data.email,
                            name: data.name || `${data.given_name ?? ""} ${data.family_name ?? ""}`.trim() || data.preferred_username,
                            image: data.picture,
                            emailVerified: data.email_verified ?? false,
                        };
                    },
                }
            ]
        })
    ]
});
