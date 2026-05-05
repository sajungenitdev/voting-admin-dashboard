import { ChartBarIcon, TrophyIcon } from "@heroicons/react/24/outline";

const TopPolls = ({ polls }) => {
  // Use dynamic data if available
  const topPolls = polls?.length ? polls : [];
  const maxVotes =
    topPolls.length > 0
      ? Math.max(...topPolls.map((p) => p.totalVotes || 0))
      : 1;

  if (topPolls.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-white/40 text-sm">No polls data available</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-red-500/10">
      {topPolls.map((poll, index) => {
        const percentage = ((poll.totalVotes || 0) / maxVotes) * 100;
        return (
          <div
            key={poll._id || index}
            className="p-4 hover:bg-red-500/5 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                {index === 0 && (
                  <TrophyIcon className="h-5 w-5 text-yellow-500" />
                )}
                {index === 1 && (
                  <TrophyIcon className="h-5 w-5 text-gray-400" />
                )}
                {index === 2 && (
                  <TrophyIcon className="h-5 w-5 text-amber-600" />
                )}
                {index > 2 && (
                  <span className="w-5 text-center text-white/40 text-sm">
                    {index + 1}
                  </span>
                )}
                <div>
                  <p className="text-sm font-medium text-white line-clamp-1">
                    {poll.title}
                  </p>
                  <p className="text-xs text-white/40">
                    {poll.category || "General"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ChartBarIcon className="h-4 w-4 text-red-400" />
                <span className="text-sm font-semibold text-white">
                  {(poll.totalVotes || 0).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-red-500/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-red-500 to-red-600 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TopPolls;
