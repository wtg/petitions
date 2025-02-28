import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/app/db/index";
import { eq } from 'drizzle-orm';
import { users } from '@/app/db/schema';

// extends the User object
declare module "next-auth" {
    interface User {
        rcsid?: string;
        initials?: string;
    }
}

// Some interfaces for profile objects
interface OAuthProfile {
    sub: string,
    name: string,
    preferred_username: string,
    given_name: string,
    family_name: string,
    email: string,
}

interface Profile {
    id: string,
    rcsid: string,
    initials?: string,
}

const authConfig: NextAuthConfig = {
    providers: [
        Credentials({
            credentials: {
                rcsid: { label: "RCSID", type: "text" }
            },
            async authorize(credentials) {
                let rcsid = credentials?.rcsid as string;

                if(!rcsid) {
                    rcsid = Math.random().toString(36).substring(2, 8);
                }
                rcsid = rcsid.toLowerCase();

                const existingUser = await db.query.users.findFirst({
                    where: eq(users.id, rcsid)
                });

                if(existingUser) {
                    return {
                        rcsid: existingUser.id,
                        initials: existingUser.initials
                    } as Profile;
                }

                const initials = Math.random().toString(36).substring(2, 4).toUpperCase();
                return {
                    rcsid: rcsid,
                    initials: initials,
                } as Profile;
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
            profile(profile: OAuthProfile): Profile {
                return {
                    id: profile.sub,
                    rcsid: profile.preferred_username,
                    initials: `${profile.given_name?.charAt(0)}${profile.family_name?.charAt(0)}`.toUpperCase()
                };
            },
        }
    ],
    secret: process.env.AUTH_SECRET,
    session: {
        strategy: "jwt",
    },

    callbacks: {
        jwt({ token, user }) {
            if(user) {
                token.id = user.id;
                token.rcsid = user.rcsid;
                token.initials = user.initials;
            }
            return token;
        },
        session({ session, token }) {
            session.user.id = token.id as string;
            session.user.rcsid = token.rcsid as string;
            session.user.initials = token.initials as string;
            return session;
        },
        // user means id, rcsid, initials
        // account means the account itself, the provider, type, id, etc
        // profile means the oauth profile, should have all the data in OAuthProfile.OAuthProfile if it is oauth sign in
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async signIn({ user, account, profile }) {
            const rcsid = user.rcsid as string;
            const initials = user.initials as string;

            await db.insert(users).values({
                id: rcsid,
                initials: initials
            }).onConflictDoNothing();

            return true;
        }
    },
};

export const { auth, handlers, signIn, signOut } = NextAuth(authConfig);