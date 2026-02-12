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
                    authentication: 'basic',
                    pkce: true,
                    // getToken: async ({ code, redirectURI }) => {
                    //     console.log('code', code);
                    //     console.log('redirectURI', redirectURI);

                    //     const params = new URLSearchParams({
                    //         client_id: process.env.CLIENT_ID ?? "",
                    //         client_secret: process.env.CLIENT_SECRET ?? "",
                    //         code,
                    //         redirect_uri: redirectURI,
                    //         grant_type: "authorization_code",
                    //     });

                    //     const response = await fetch(
                    //         "https://shib.auth.rpi.edu/idp/profile/oidc/token",
                    //         {
                    //             method: "POST",
                    //             headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    //             body: params.toString(),
                    //         }
                    //     );
                    //     const data = await response.json();
                    //     console.log('status', response.status);
                    //     console.log('data', data);
                    //     return {
                    //         accessToken: data.access_token,
                    //         refreshToken: data.refresh_token,
                    //         accessTokenExpiresAt: new Date(Date.now() + data.expires_in * 1000),
                    //         scopes: data.scope?.split(" ") ?? [],
                    //         // Preserve provider-specific fields in raw
                    //         raw: data,
                    //     };
                    // }
                }
            ]
        })
    ]
});
