import type { Metadata } from 'next';
import '@/app/globals.css';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
    title: 'RPI Petitions Admin Page',
    description: "Change some of the core settings of the site"
};

export default async function RootLayout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const session = await auth();

    if(!session?.user?.rcsid) {
        return redirect('/');
    }

    // TODO: Check for admin permissions

    return (
        <html lang="en">
            <body>
                ADMIN!!!!!
                {children}
            </body>
        </html>
    );
}
