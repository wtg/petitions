import { getUserFromDb } from '@/actions/user.actions';
import { db } from '@/lib/db';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import type { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

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
        })
    ],
    adapter: DrizzleAdapter(db)
};
