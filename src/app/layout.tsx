import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'RPI Petitions',
    description: 'RPI Petitions is a website where you can post about your concerns about RPI.' +
    ' In order for a petition to be recongized, a petition must reach a threshold of 250 signatures within one full calendar year of posting,' +
    ' or be recongized by the Student Senate.' +
    ' Every recongized petition must be places onto the agenda at a Senate meeting within fifteen academic days.',
};

export default function RootLayout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
}
