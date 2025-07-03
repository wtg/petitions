import { signOut } from '@/auth';

export function SignOut() {
    return (
        <form
            action={async () => {
                'use server';
                await signOut( { redirectTo: "/" } );
            }}
        >
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition" type="submit">Sign out</button>
        </form>
    );
}