import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAnalytics,
  fetchDashboardStats,
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
  const { analytics, isLoading } = useSelector((state) => state.dashboard);
  const [period, setPeriod] = useState("month");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchAnalytics(period));
    dispatch(fetchDashboardStats());
  }, [dispatch, period]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchAnalytics(period));
    await dispatch(fetchDashboardStats());
    setTimeout(() => setRefreshing(false), 500);
  };

  if (isLoading && !analytics) {
    return <LoadingSpinner />;
  }

  // Sample data structure - replace with actual API data
  const userGrowthData = [
    { month: "Jan", users: 450, votes: 320 },
    { month: "Feb", users: 520, votes: 410 },
    { month: "Mar", users: 610, votes: 530 },
    { month: "Apr", users: 720, votes: 680 },
    { month: "May", users: 850, votes: 790 },
    { month: "Jun", users: 980, votes: 920 },
  ];

  const categoryData = [
    { name: "Technology", value: 35, color: "#ef4444" },
    { name: "Sports", value: 28, color: "#f97316" },
    { name: "Politics", value: 22, color: "#10b981" },
    { name: "Entertainment", value: 15, color: "#3b82f6" },
  ];

  const engagementData = [
    { day: "Mon", engagement: 65 },
    { day: "Tue", engagement: 72 },
    { day: "Wed", engagement: 68 },
    { day: "Thu", engagement: 80 },
    { day: "Fri", engagement: 85 },
    { day: "Sat", engagement: 78 },
    { day: "Sun", engagement: 70 },
  ];

  const COLORS = ["#ef4444", "#f97316", "#10b981", "#3b82f6", "#8b5cf6"];

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
        <div className="p-5 bg-black border rounded-2xl border-red-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/50">Total Users</p>
              <p className="mt-1 text-2xl font-bold text-white">2,847</p>
              <p className="mt-1 text-xs text-green-400">
                ↑ 12.5% from last month
              </p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 bg-blue-500/20 rounded-xl">
              <span className="text-xl">👥</span>
            </div>
          </div>
        </div>
        <div className="p-5 bg-black border rounded-2xl border-red-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/50">Total Votes</p>
              <p className="mt-1 text-2xl font-bold text-white">12,456</p>
              <p className="mt-1 text-xs text-green-400">
                ↑ 8.3% from last month
              </p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 bg-green-500/20 rounded-xl">
              <span className="text-xl">🗳️</span>
            </div>
          </div>
        </div>
        <div className="p-5 bg-black border rounded-2xl border-red-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/50">Active Polls</p>
              <p className="mt-1 text-2xl font-bold text-white">45</p>
              <p className="mt-1 text-xs text-yellow-400">↗ 5 new this week</p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 bg-yellow-500/20 rounded-xl">
              <span className="text-xl">📊</span>
            </div>
          </div>
        </div>
        <div className="p-5 bg-black border rounded-2xl border-red-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/50">Conversion Rate</p>
              <p className="mt-1 text-2xl font-bold text-white">68.5%</p>
              <p className="mt-1 text-xs text-green-400">
                ↑ 4.2% from last month
              </p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 bg-purple-500/20 rounded-xl">
              <span className="text-xl">📈</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* User Growth Chart */}
        <div className="p-6 bg-black border rounded-2xl border-red-500/20">
          <h3 className="mb-4 text-lg font-semibold text-white">
            User & Vote Growth
          </h3>
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
        </div>

        {/* Category Distribution */}
        <div className="p-6 bg-black border rounded-2xl border-red-500/20">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Polls by Category
          </h3>
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
                  <Cell key={`cell-${index}`} fill={entry.color} />
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
        </div>

        {/* Engagement Trend */}
        <div className="p-6 bg-black border rounded-2xl border-red-500/20">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Weekly Engagement Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="day" stroke="#ffffff40" />
              <YAxis stroke="#ffffff40" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#000",
                  border: "1px solid #ef444430",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="engagement"
                stroke="#ef4444"
                fill="#ef444420"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Categories Table */}
        <div className="p-6 bg-black border rounded-2xl border-red-500/20">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Top Performing Categories
          </h3>
          <div className="space-y-3">
            {categoryData.map((cat, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-lg"
                    style={{ backgroundColor: cat.color + "20" }}
                  >
                    <span className="text-sm">{cat.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{cat.name}</p>
                    <p className="text-xs text-white/40">{cat.value} polls</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">
                    {Math.round(cat.value * 12.5)} votes
                  </p>
                  <p className="text-xs text-green-400">
                    ↑ {Math.round(Math.random() * 20)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="overflow-hidden bg-black border rounded-2xl border-red-500/20">
        <div className="p-6 border-b border-red-500/10">
          <h3 className="text-lg font-semibold text-white">
            Recent Platform Activity
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-red-500/10">
            <thead className="bg-red-500/5">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-left text-red-400 uppercase">
                  Event
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-red-400 uppercase">
                  User
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-red-400 uppercase">
                  Time
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-red-400 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-500/10">
              {[
                {
                  event: "New user registered",
                  user: "john@example.com",
                  time: "2 min ago",
                  status: "success",
                },
                {
                  event: "Poll created",
                  user: "admin",
                  time: "15 min ago",
                  status: "success",
                },
                {
                  event: "Vote cast",
                  user: "jane@example.com",
                  time: "1 hour ago",
                  status: "success",
                },
                {
                  event: "Comment moderated",
                  user: "moderator",
                  time: "2 hours ago",
                  status: "warning",
                },
              ].map((activity, idx) => (
                <tr key={idx} className="transition-colors hover:bg-red-500/5">
                  <td className="px-6 py-4 text-sm text-white/80">
                    {activity.event}
                  </td>
                  <td className="px-6 py-4 text-sm text-white/60">
                    {activity.user}
                  </td>
                  <td className="px-6 py-4 text-sm text-white/40">
                    {activity.time}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        activity.status === "success"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {activity.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
