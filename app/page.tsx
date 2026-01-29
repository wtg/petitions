import { PetitionCard } from "@/components/petition-card";
import Link from "next/link";

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

export default function Home() {
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
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
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
          © 2026 Petitions. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
