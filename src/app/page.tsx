export default function Home() {
    return (
        <>
            <div className="flex flex-col justify-center items-center h-screen">
                <h1 className="font-display text-5xl text-cherry">RPI Petitions</h1>
                <a href='/profile' className="text-white">Profile page (protected)</a>
                <a href='/admin' className="text-white">Admin page (unprotected)</a>
            </div>
        </>
    );
}
