import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUserFromDb } from "./actions/user.actions";
import { Profile, OAuthProfile } from "./lib/OAuthProfile";

declare module "next-auth" {
    interface User {
        rcsid?: string;
        initials?: string;
    }
}

const authConfig: NextAuthConfig = {
    providers: [
        Credentials({
            credentials: {
                name: { label: "Username" },
                password: { label: "password" }
            },
            async authorize(credentials) {

                const { name, password } = credentials;

                const res = await getUserFromDb(name as string, password as string);

                if(res.success) {
                    return {
                        id: res.data?.id,
                        rcsid: res.data?.name,
                        initials: 'dd'
                    } as Profile;
                }

                return null;
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
                console.log('profile', profile);
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
        jwt({ token, user}) {
            console.log('jwt', user);
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
        signIn({ user, account, profile }) {
            console.log('signing in', user, account, profile);
            return true;
        }
    },
};

export const { auth, handlers, signIn, signOut } = NextAuth(authConfig);