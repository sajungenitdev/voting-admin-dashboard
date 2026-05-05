import React from "react";
import {
  UsersIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";

const StatCard = ({ title, value, icon: Icon, trend, trendValue }) => {
  const isPositive = trend === "up";

  return (
    <div className="bg-black rounded-2xl border border-red-500/20 p-6 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/5 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-white/50">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
          {trendValue && (
            <div
              className={`flex items-center gap-1 mt-2 text-xs ${isPositive ? "text-green-400" : "text-red-400"}`}
            >
              {isPositive ? (
                <ArrowTrendingUpIcon className="h-3 w-3" />
              ) : (
                <ArrowTrendingDownIcon className="h-3 w-3" />
              )}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:scale-110 transition-all duration-300">
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
};

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: "Total Users",
      value: stats.overview?.totalUsers?.toLocaleString() || "0",
      icon: UsersIcon,
      trend: stats.today?.newUsers > 0 ? "up" : "down",
      trendValue: stats.today?.newUsers
        ? `+${stats.today.newUsers} this month`
        : null,
    },
    {
      title: "Total Polls",
      value: stats.overview?.totalPolls?.toLocaleString() || "0",
      icon: ClipboardDocumentListIcon,
      trend: stats.today?.newPolls > 0 ? "up" : "down",
      trendValue: stats.today?.newPolls
        ? `+${stats.today.newPolls} this month`
        : null,
    },
    {
      title: "Total Votes",
      value: stats.overview?.totalVotes?.toLocaleString() || "0",
      icon: ChatBubbleLeftRightIcon,
      trend: "up",
      trendValue: stats.today?.newVotes
        ? `+${stats.today.newVotes} today`
        : null,
    },
    {
      title: "Active Polls",
      value: stats.overview?.activePolls?.toLocaleString() || "0",
      icon: ClipboardDocumentListIcon,
    },
    {
      title: "Voter Turnout",
      value: stats.overview?.voterTurnout || "0%",
      icon: UsersIcon,
    },
    // {
    //   title: "Total Comments",
    //   value: stats.overview?.totalComments?.toLocaleString() || "0",
    //   icon: ChatBubbleLeftRightIcon,
    // },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {cards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
};

export default StatsCards;
