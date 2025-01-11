import NextAuth from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth(options);

export { handler as GET, handler as POST };
