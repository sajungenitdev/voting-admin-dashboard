import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAnalytics,
  fetchDashboardStats,
  fetchActivityLogs,
} from "../store/slices/dashboardSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { ArrowPathIcon, CalendarIcon } from "@heroicons/react/24/outline";

const Analytics = () => {
  const dispatch = useDispatch();
  const { analytics, stats, activityLogs, isLoading } = useSelector(
    (state) => state.dashboard,
  );
  const [period, setPeriod] = useState("month");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchAnalytics(period));
    dispatch(fetchDashboardStats());
    dispatch(fetchActivityLogs({ limit: 10 }));
  }, [dispatch, period]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      dispatch(fetchAnalytics(period)),
      dispatch(fetchDashboardStats()),
      dispatch(fetchActivityLogs({ limit: 10 })),
    ]);
    setTimeout(() => setRefreshing(false), 500);
  };

  // Transform user growth data from real API
  const getUserGrowthData = () => {
    if (analytics?.userGrowth && analytics.userGrowth.length > 0) {
      return analytics.userGrowth.map((item, index) => ({
        month: `Month ${index + 1}`,
        users: item.count || 0,
        votes: analytics.voteDistribution?.[index]?.totalVotes || 0,
      }));
    }
    return [];
  };

  // Transform category data from real API
  const getCategoryData = () => {
    if (analytics?.pollsByCategory && analytics.pollsByCategory.length > 0) {
      const colors = [
        "#ef4444",
        "#f97316",
        "#10b981",
        "#3b82f6",
        "#8b5cf6",
        "#ec4899",
        "#06b6d4",
        "#84cc16",
      ];
      return analytics.pollsByCategory.map((item, index) => ({
        name: item._id?.charAt(0).toUpperCase() + item._id?.slice(1) || "Other",
        value: item.count || 0,
        votes: item.votes || 0,
        color: colors[index % colors.length],
      }));
    }
    return [];
  };

  // Get top performing polls
  const getTopPolls = () => {
    if (analytics?.topPolls && analytics.topPolls.length > 0) {
      return analytics.topPolls;
    }
    return [];
  };

  // Format recent activities from real API
  const getRecentActivities = () => {
    if (activityLogs && activityLogs.length > 0) {
      return activityLogs.slice(0, 5).map((log) => ({
        event: log.action?.replace(/_/g, " ") || "Activity",
        user: log.user?.email || log.email || "System",
        time: formatTimeAgo(log.createdAt),
        status: log.status === "SUCCESS" ? "success" : "warning",
      }));
    }
    return [];
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "Unknown";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000 / 60);

    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff} min ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return `${Math.floor(diff / 1440)} days ago`;
  };

  const userGrowthData = getUserGrowthData();
  const categoryData = getCategoryData();
  const topPolls = getTopPolls();
  const recentActivities = getRecentActivities();

  // Calculate KPIs from real stats
  const totalUsers = stats?.overview?.totalUsers || 0;
  const totalVotes = stats?.overview?.totalVotes || 0;
  const activePolls = stats?.overview?.activePolls || 0;
  const voterTurnout = stats?.overview?.voterTurnout || "0%";

  const kpiCards = [
    {
      title: "Total Users",
      value: totalUsers.toLocaleString(),
      change: stats?.today?.newUsers
        ? `+${stats.today.newUsers} this month`
        : null,
      icon: "👥",
      color: "bg-blue-500/20",
    },
    {
      title: "Total Votes",
      value: totalVotes.toLocaleString(),
      change: stats?.today?.newVotes ? `+${stats.today.newVotes} today` : null,
      icon: "🗳️",
      color: "bg-green-500/20",
    },
    {
      title: "Active Polls",
      value: activePolls.toLocaleString(),
      change: stats?.today?.newPolls ? `+${stats.today.newPolls} new` : null,
      icon: "📊",
      color: "bg-yellow-500/20",
    },
    {
      title: "Voter Turnout",
      value: voterTurnout,
      change: null,
      icon: "📈",
      color: "bg-purple-500/20",
    },
  ];

  const COLORS = [
    "#ef4444",
    "#f97316",
    "#10b981",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
  ];

  if (isLoading && !analytics && !stats) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden bg-black border rounded-2xl border-red-500/20">
        <div className="absolute top-0 right-0 rounded-full w-80 h-80 bg-red-600/20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 rounded-full w-80 h-80 bg-red-500/10 blur-3xl"></div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 rounded-full bg-gradient-to-b from-red-500 to-red-700"></div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Analytics Dashboard
                </h1>
                <p className="text-white/40 text-sm mt-0.5">
                  Track platform performance and user engagement
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <CalendarIcon className="absolute w-4 h-4 text-red-400 -translate-y-1/2 left-3 top-1/2" />
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="py-2 pl-10 pr-4 text-sm text-white bg-black border cursor-pointer border-red-500/30 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              >
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="year">Last Year</option>
              </select>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 text-red-400 transition-all duration-200 bg-black border border-red-500/30 rounded-xl hover:text-red-300 hover:bg-red-500/10 hover:border-red-500 disabled:opacity-50"
            >
              <ArrowPathIcon
                className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card, idx) => (
          <div
            key={idx}
            className="p-5 bg-black border rounded-2xl border-red-500/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/50">{card.title}</p>
                <p className="mt-1 text-2xl font-bold text-white">
                  {card.value}
                </p>
                {card.change && (
                  <p className="mt-1 text-xs text-green-400">{card.change}</p>
                )}
              </div>
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-xl ${card.color}`}
              >
                <span className="text-xl">{card.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* User Growth Chart */}
        <div className="p-6 bg-black border rounded-2xl border-red-500/20">
          <h3 className="mb-4 text-lg font-semibold text-white">
            User & Vote Growth
          </h3>
          {userGrowthData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#ffffff40" />
                <YAxis stroke="#ffffff40" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#000",
                    border: "1px solid #ef444430",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Legend wrapperStyle={{ color: "#ffffff60" }} />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ fill: "#ef4444" }}
                />
                <Line
                  type="monotone"
                  dataKey="votes"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-white/40">
              No data available
            </div>
          )}
        </div>

        {/* Category Distribution */}
        <div className="p-6 bg-black border rounded-2xl border-red-500/20">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Polls by Category
          </h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#000",
                    border: "1px solid #ef444430",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-white/40">
              No data available
            </div>
          )}
        </div>

        {/* Top Polls Table */}
        <div className="p-6 bg-black border rounded-2xl border-red-500/20">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Top Performing Polls
          </h3>
          {topPolls.length > 0 ? (
            <div className="space-y-3">
              {topPolls.map((poll, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                >
                  <div>
                    <p className="text-sm font-medium text-white line-clamp-1">
                      {poll.title}
                    </p>
                    <p className="text-xs capitalize text-white/40">
                      {poll.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">
                      {poll.totalVotes?.toLocaleString() || 0} votes
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-white/40">
              No poll data available
            </div>
          )}
        </div>

        {/* Recent Activity Table */}
        <div className="p-6 bg-black border rounded-2xl border-red-500/20">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Recent Platform Activity
          </h3>
          {recentActivities.length > 0 ? (
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {recentActivities.map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                >
                  <div>
                    <p className="text-sm font-medium text-white capitalize">
                      {activity.event}
                    </p>
                    <p className="text-xs text-white/40">{activity.user}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/40">{activity.time}</p>
                    <span
                      className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        activity.status === "success"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-white/40">
              No recent activity
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
