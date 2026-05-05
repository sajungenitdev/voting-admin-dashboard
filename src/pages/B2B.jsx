import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import {
  fetchB2BRequests,
  fetchB2BSubscriptions,
  fetchB2BPayments,
} from "../store/slices/b2bSlice";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  ArrowPathIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const B2B = () => {
  const dispatch = useDispatch();
  const { requests, subscriptions, payments, isLoading } = useSelector(
    (state) => state.b2b,
  );
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchB2BRequests());
    dispatch(fetchB2BSubscriptions());
    dispatch(fetchB2BPayments());
  }, [dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      dispatch(fetchB2BRequests()),
      dispatch(fetchB2BSubscriptions()),
      dispatch(fetchB2BPayments()),
    ]);
    setTimeout(() => setRefreshing(false), 500);
  };

  const pendingRequests = requests.filter((r) => r.status === "pending").length;
  const approvedRequests = requests.filter(
    (r) => r.status === "approved",
  ).length;
  const activeSubscriptions = subscriptions.filter((s) => s.isActive).length;
  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  const stats = [
    {
      name: "Total Requests",
      value: requests.length,
      icon: DocumentTextIcon,
      color: "bg-blue-500/20 text-blue-400",
    },
    {
      name: "Pending Approval",
      value: pendingRequests,
      icon: ClockIcon,
      color: "bg-yellow-500/20 text-yellow-400",
    },
    {
      name: "Approved",
      value: approvedRequests,
      icon: CheckCircleIcon,
      color: "bg-green-500/20 text-green-400",
    },
    {
      name: "Active Subscriptions",
      value: activeSubscriptions,
      icon: UserGroupIcon,
      color: "bg-purple-500/20 text-purple-400",
    },
    {
      name: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: "bg-red-500/20 text-red-400",
    },
  ];

  const recentRequests = requests.slice(0, 5);

  if (isLoading && !requests.length) {
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
                  B2B Data Marketplace
                </h1>
                <p className="text-white/40 text-sm mt-0.5">
                  Manage data requests, subscriptions, and payments
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/b2b/requests"
              className="px-4 py-2 text-sm font-medium text-white transition-all duration-300 bg-gradient-to-r from-red-500 to-red-700 rounded-xl hover:shadow-lg hover:shadow-red-500/25"
            >
              View All Requests
            </Link>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 text-red-400 transition-all duration-200 bg-black border border-red-500/30 rounded-xl hover:text-red-300 hover:bg-red-500/10"
            >
              <ArrowPathIcon
                className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-red-500/20">
        <Link
          to="/b2b"
          className="px-4 py-2 text-sm font-medium text-red-400 border-b-2 border-red-400"
        >
          Overview
        </Link>
        <Link
          to="/b2b/requests"
          className="px-4 py-2 text-sm font-medium transition-colors text-white/60 hover:text-white"
        >
          Data Requests
        </Link>
        <Link
          to="/b2b/subscriptions"
          className="px-4 py-2 text-sm font-medium transition-colors text-white/60 hover:text-white"
        >
          Subscriptions
        </Link>
        <Link
          to="/b2b/payments"
          className="px-4 py-2 text-sm font-medium transition-colors text-white/60 hover:text-white"
        >
          Payments
        </Link>
        <Link
          to="/b2b/users"
          className="px-4 py-2 text-sm font-medium transition-colors text-white/60 hover:text-white"
        >
          B2B Users
        </Link>
        <Link
          to="/b2b/categories"
          className="px-4 py-2 text-sm font-medium transition-colors text-white/60 hover:text-white"
        >
          Data Categories
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="p-5 bg-black border rounded-2xl border-red-500/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/50">{stat.name}</p>
                <p className="mt-1 text-2xl font-bold text-white">
                  {stat.value}
                </p>
              </div>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}
              >
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Requests Table */}
      <div className="overflow-hidden bg-black border rounded-2xl border-red-500/20">
        <div className="flex items-center justify-between p-6 border-b border-red-500/10">
          <h3 className="text-lg font-semibold text-white">
            Recent Data Access Requests
          </h3>
          <Link
            to="/b2b/requests"
            className="text-sm text-red-400 hover:text-red-300"
          >
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-red-500/10">
            <thead className="bg-red-500/5">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-left text-red-400 uppercase">
                  Company
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-red-400 uppercase">
                  Contact
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-red-400 uppercase">
                  Categories
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-red-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-red-400 uppercase">
                  Submitted
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-500/10">
              {recentRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-white/40"
                  >
                    No requests found
                  </td>
                </tr>
              ) : (
                recentRequests.map((req, idx) => (
                  <tr
                    key={idx}
                    className="transition-colors hover:bg-red-500/5"
                  >
                    <td className="px-6 py-4 text-sm text-white/80">
                      {req.fullName}
                    </td>
                    <td className="px-6 py-4 text-sm text-white/60">
                      {req.email} <br />{" "}
                      <span className="text-xs">{req.phoneNumber}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/40">
                      {req.selectedCategories?.slice(0, 2).join(", ")}
                      {req.selectedCategories?.length > 2 &&
                        ` +${req.selectedCategories.length - 2}`}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          req.status === "approved"
                            ? "bg-green-500/20 text-green-400"
                            : req.status === "rejected"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/40">
                      {new Date(req.createdAt).toLocaleDateString()}
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

export default B2B;
