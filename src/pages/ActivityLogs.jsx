import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActivityLogs } from "../store/slices/dashboardSlice";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { ArrowPathIcon} from "@heroicons/react/24/outline";

const ActivityLogs = () => {
  const dispatch = useDispatch();
  const { activityLogs, isLoading } = useSelector((state) => state.dashboard);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchActivityLogs());
  }, [dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchActivityLogs());
    setTimeout(() => setRefreshing(false), 500);
  };

  const getActionIcon = (action) => {
    const icons = {
      REGISTER: "📝", LOGIN: "🔐", LOGOUT: "🚪", CREATE_POLL: "📊", CAST_VOTE: "🗳️",
      CREATE_COMMENT: "💬", DELETE_USER: "👤", UPDATE_USER_ROLE: "⚙️",
    };
    return icons[action] || "📋";
  };

  const filteredLogs = filter === "all" ? activityLogs : activityLogs.filter(log => log.action === filter);

  if (isLoading && !activityLogs.length) {
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
                <h1 className="text-2xl font-bold text-white">Activity Logs</h1>
                <p className="text-white/40 text-sm mt-0.5">Track all platform activities and user actions</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 text-sm text-white bg-black border border-red-500/30 rounded-xl focus:outline-none focus:border-red-500"
            >
              <option value="all">All Actions</option>
              <option value="REGISTER">Registrations</option>
              <option value="LOGIN">Logins</option>
              <option value="CREATE_POLL">Poll Creation</option>
              <option value="CAST_VOTE">Votes</option>
              <option value="CREATE_COMMENT">Comments</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 text-red-400 transition-all duration-200 bg-black border border-red-500/30 rounded-xl hover:text-red-300 hover:bg-red-500/10"
            >
              <ArrowPathIcon className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="overflow-hidden bg-black border rounded-2xl border-red-500/20">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-red-500/10">
            <thead className="bg-red-500/5">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-left text-red-400 uppercase">Action</th>
                <th className="px-6 py-3 text-xs font-medium text-left text-red-400 uppercase">User</th>
                <th className="px-6 py-3 text-xs font-medium text-left text-red-400 uppercase">Details</th>
                <th className="px-6 py-3 text-xs font-medium text-left text-red-400 uppercase">Time</th>
                <th className="px-6 py-3 text-xs font-medium text-left text-red-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-500/10">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-white/40">
                    No activity logs found
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, idx) => (
                  <tr key={idx} className="transition-colors hover:bg-red-500/5">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getActionIcon(log.action)}</span>
                        <span className="text-sm text-white/80">{log.action?.replace(/_/g, " ")}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/60">{log.user?.email || log.email}</td>
                    <td className="px-6 py-4 text-sm text-white/40">{log.details?.pollTitle || "-"}</td>
                    <td className="px-6 py-4 text-sm text-white/40">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        log.status === "SUCCESS" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;