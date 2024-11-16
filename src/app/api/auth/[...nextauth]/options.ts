import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {
                    label: "Username:",
                    type: "text",
                    placeholder: "dev"
                },
                password: {
                    label: "Password:",
                    type: "text",
                    placeholder: "dev"
                }
            }, 

            async authorize(credentials) {
                const user = {
                    id: "1",
                    name: "dev",
                    password: "dev"
                }

                if(credentials?.username === user.name && credentials?.password === user.password){
                    return user;
                }

                return null;
            }
        })
    ],
}