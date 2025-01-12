import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { getUserFromDb } from "./actions/user.actions";

interface Profile {
    sub: string,
    name: string,
    email: string,
    picture: string,
}

const authConfig: NextAuthConfig = {
    providers: [
        Credentials({
            credentials: {
                username: { label: "Username" },
                password: { label: "password" }
            },
            authorize: async (credentials) => {
                let user = null;

                user = await getUserFromDb(credentials.username as string, credentials.password as string);

                if(!user.success) {
                    throw new Error(user.message as string);
                }

                console.log({
                    id: user.data?.id,
                    username: user.data?.username
                });
                return {
                    id: user.data?.id,
                    username: user.data?.username
                };
            }
        }),
        {
            id: 'shib',
            name: 'RPI SSO',
            type: 'oauth',
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            authorization: {
                url: 'https://shib.auth.rpi.edu/idp/profile/oidc/authorize',
                params: { scope: 'openid email profile' }
            },
            checks: ['pkce', 'state'],
            token: {
                url: 'https://shib.auth.rpi.edu/idp/profile/oidc/token',
                params: { grant_type: 'authorization_code' }
            },
            issuer: 'https://shib.auth.rpi.edu',
            jwks_endpoint: 'https://shib.auth.rpi.edu/idp/profile/oidc/keyset',
            userinfo: {
                url: 'https://shib.auth.rpi.edu/idp/profile/oidc/userinfo',
                params: { grant_type: 'authorization_code' }
            },
            profile(profile: Profile) {
                console.log(profile);
                console.log(profile.sub);
                console.log(profile.name);
                console.log(profile.email);
                console.log(profile.picture);
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                };
            },
        }
    ],
    adapter: DrizzleAdapter(db),
    secret: process.env.AUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },

    callbacks: {
        jwt({ token, user }) {
            if(user) {
                token.id = user.id;
            }
            return token;
        },
        session({ session, token }) {
            session.user.id = token.id as string;
            return session;
        }
    }
};

export const { auth, handlers, signIn, signOut } = NextAuth(authConfig);