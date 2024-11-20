'use server';

import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function getUserFromDb(username: string, password: string) {
    try {
        const existedUser = await db.query.users.findFirst({
            where: eq(users.username, username)
        });

        if(!existedUser) {
            return {
                success: false,
                message: 'User not found'
            };
        }

        if(existedUser.password != password) {
            return {
                success: false,
                message: 'Incorrect password'
            };
        }

        return {
            success: true,
            data: existedUser
        };
    } catch (error) {
        return {
            success: false,
            message: error
        };
    }
}