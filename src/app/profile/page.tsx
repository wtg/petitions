import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { SignOut } from '@/components/sign-out-button';

export default async function ProfilePage() {
    const session = await auth();

    // console.log(session?.user);

    if(!session) {
        redirect('/api/auth/signin?callbackUrl=/profile');
    }

    return (
        <>
            <h1 className="text-9xl">Hello {session.user?.rcsid}</h1>
            <h1>Your initals are {session.user?.initials}</h1>
            <SignOut />
        </>
    );
}