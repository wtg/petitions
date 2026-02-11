import { PetitionCard } from "@/components/petition-card";
import Link from "next/link";

const ERROR_MESSAGES: Record<string, string> = {
  oauth_code_verification_failed:
    "OAuth verification failed. The authorization code could not be verified. Please try signing in again.",
};

function ErrorBanner({ error }: { error: string }) {
  const message = ERROR_MESSAGES[error] ?? `An unexpected error occurred: ${error}`;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-3xl mx-auto mt-6">
      <div className="flex items-start gap-3">
        <svg
          className="w-5 h-5 text-red-500 mt-0.5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
        <div>
          <h3 className="text-sm font-semibold text-red-800">Authentication Error</h3>
          <p className="text-sm text-red-700 mt-1">{message}</p>
        </div>
      </div>
    </div>
  );
}

// Sample petition data
const petitions = [
  {
    id: 1,
    title: "Save the Local Community Garden from Development",
    sponsor: "Green Spaces Coalition",
    votes: 187,
  },
  {
    id: 2,
    title: "Increase Public Transit Funding for Underserved Areas",
    sponsor: "Transit Equity Now",
    votes: 245,
  },
  {
    id: 3,
    title: "Ban Single-Use Plastics in City Parks",
    sponsor: "Ocean Conservation Society",
    votes: 312,
    milestone: 500,
  },
  {
    id: 4,
    title: "Improve Street Lighting in Downtown District",
    sponsor: "Community Safety Initiative",
    votes: 89,
  },
  {
    id: 5,
    title: "Create More Bike Lanes on Main Street",
    sponsor: "Cyclists United",
    votes: 156,
  },
  {
    id: 6,
    title: "Establish a Youth Mental Health Support Program",
    sponsor: "Wellness for All",
    votes: 278,
    milestone: 300,
  },
];

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Petitions
            </h1>
            <Link
              href="/sign-in"
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {error && <ErrorBanner error={error} />}

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
          Make Your Voice Heard
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Join thousands of people advocating for change. Sign petitions that matter to you and help create a better community.
        </p>
      </section>

      {/* Petition Grid */}
      {/* <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {petitions.map((petition) => (
            <PetitionCard
              key={petition.id}
              title={petition.title}
              sponsor={petition.sponsor}
              votes={petition.votes}
              milestone={petition.milestone}
            />
          ))}
        </div>
      </main> */}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
          © 2026 Petitions. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
