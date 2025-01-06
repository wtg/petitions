import { getUserFromDb } from '@/actions/user.actions';
import { db } from '@/lib/db';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import type { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

interface Profile {
    sub: string,
    name: string,
    email: string,
    picture: string,
}

export const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: {
                    label: 'Username:',
                    type: 'text',
                    placeholder: 'dev'
                },
                password: {
                    label: 'Password:',
                    type: 'text',
                    placeholder: 'dev'
                }
            },

            async authorize(credentials) {
                let user = null;

                user = await getUserFromDb(credentials?.username as string, credentials?.password as string);

                if(!user.success) {
                    return null;
                }

                return {
                    name: user.data?.username
                } as User;
            }
        }),
        {
            id: 'shib',
            name: 'RPI SSO',
            type: 'oauth',
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            wellKnown: 'https://shib.auth.rpi.edu/idp/profile/oidc/configuration',
            authorization: { params: { scope: 'openid email profile' } },
            idToken: true,
            checks: ['pkce', 'state'],
            profile(profile: Profile) {
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
    adapter: DrizzleAdapter(db)
};
