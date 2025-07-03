import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { SignOut } from '@/app/navbar/components/sign-out-button';

export default async function ProfilePage() {
    const session = await auth();
    console.log(session?.user);
    if(!session) {
        redirect('/api/auth/signin?callbackUrl=/profile');
    }

    return (
        <>
            <h1 className="text-9xl">Hello {session.user?.rcsid}</h1>
            <SignOut />
        </>
    );
}