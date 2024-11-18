import { getServerSession } from 'next-auth';
import { options } from '../api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
    const session = await getServerSession(options);

    if(!session) {
        redirect('/api/auth/signin?callbackUrl=/profile');
    }

    return (
        <h1 className="text-9xl">Hello {session.user?.name}</h1>
    );
}