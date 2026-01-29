"use client";

interface PetitionCardProps {
    title: string;
    sponsor: string;
    votes: number;
    milestone?: number;
    onSign?: () => void;
}

export function PetitionCard({
    title,
    sponsor,
    votes,
    milestone = 250,
    onSign,
}: PetitionCardProps) {
    const progress = Math.min((votes / milestone) * 100, 100);
    const remaining = Math.max(milestone - votes, 0);

    return (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-slate-100">
            <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">
                    {title}
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                    Sponsored by <span className="font-medium text-slate-700">{sponsor}</span>
                </p>

                {/* Vote count */}
                <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-3xl font-bold text-slate-900">{votes.toLocaleString()}</span>
                    <span className="text-sm text-slate-500">/ {milestone.toLocaleString()} signatures</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <p className="text-xs text-slate-500 mb-4">
                    {remaining > 0
                        ? `${remaining.toLocaleString()} more needed to reach goal`
                        : "🎉 Goal reached!"}
                </p>

                {/* Sign button */}
                <button
                    onClick={onSign}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Sign Petition
                </button>
            </div>
        </div>
    );
}
