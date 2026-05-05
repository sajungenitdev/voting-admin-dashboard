import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDashboardStats,
  fetchAnalytics,
} from "../store/slices/dashboardSlice";
import StatsCards from "../components/dashboard/StatsCards";
import Charts from "../components/dashboard/Charts";
import RecentActivity from "../components/dashboard/RecentActivity";
import TopPolls from "../components/dashboard/TopPolls";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { ArrowPathIcon, CalendarIcon } from "@heroicons/react/24/outline";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, analytics, activityLogs, isLoading } = useSelector(
    (state) => state.dashboard,
  );
  const [period, setPeriod] = useState("month");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchAnalytics(period));
  }, [dispatch, period]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      dispatch(fetchDashboardStats()),
      dispatch(fetchAnalytics(period)),
    ]);
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (isLoading && !stats) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header with Red Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-black border border-red-500/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 p-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-linear-to-b from-red-500 to-red-700 rounded-full"></div>
              <div>
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-white/40 text-sm mt-0.5">
                  Welcome back! Here's what's happening today.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Period Filter */}
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-400" />
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="pl-10 pr-4 py-2 bg-black border border-red-500/30 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 cursor-pointer"
              >
                <option value="week" className="bg-black">
                  Last 7 Days
                </option>
                <option value="month" className="bg-black">
                  Last 30 Days
                </option>
                <option value="year" className="bg-black">
                  Last Year
                </option>
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 bg-black border border-red-500/30 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:border-red-500 transition-all duration-200 disabled:opacity-50"
            >
              <ArrowPathIcon
                className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && <StatsCards stats={stats} />}

      {/* Charts Section */}
      {analytics && (
        <div className="bg-black rounded-2xl border border-red-500/20 overflow-hidden">
          <div className="p-6 border-b border-red-500/10">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-red-500 rounded-full"></div>
                  <h2 className="text-lg font-semibold text-white">
                    Analytics Overview
                  </h2>
                </div>
                <p className="text-sm text-white/40 mt-1">
                  User engagement and voting patterns
                </p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs text-white/60 hover:text-white border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-colors">
                  Users
                </button>
                <button className="px-3 py-1 text-xs text-white/60 hover:text-white border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-colors">
                  Votes
                </button>
                <button className="px-3 py-1 text-xs bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg">
                  Both
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <Charts analytics={analytics} />
          </div>
        </div>
      )}

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Polls Card */}
        <div className="bg-black rounded-2xl border border-red-500/20 overflow-hidden">
          <div className="p-6 border-b border-red-500/10">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-red-500 rounded-full"></div>
                  <h2 className="text-lg font-semibold text-white">
                    Top Performing Polls
                  </h2>
                </div>
                <p className="text-sm text-white/40 mt-1">
                  Most voted polls this month
                </p>
              </div>
              <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20">
                <span className="text-xl">🏆</span>
              </div>
            </div>
          </div>
          <TopPolls polls={analytics?.topPolls || []} />
        </div>

        {/* Recent Activity Card */}
        <div className="bg-black rounded-2xl border border-red-500/20 overflow-hidden">
          <div className="p-6 border-b border-red-500/10">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-red-500 rounded-full"></div>
                  <h2 className="text-lg font-semibold text-white">
                    Recent Activity
                  </h2>
                </div>
                <p className="text-sm text-white/40 mt-1">
                  Latest platform activities
                </p>
              </div>
              <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20">
                <span className="text-xl">📋</span>
              </div>
            </div>
          </div>
          <RecentActivity logs={activityLogs || []} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
