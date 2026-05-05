import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchB2BSubscriptions } from "../../store/slices/b2bSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

const B2BSubscriptions = () => {
  const dispatch = useDispatch();
  const { subscriptions, isLoading } = useSelector((state) => state.b2b);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchB2BSubscriptions());
  }, [dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchB2BSubscriptions());
    setTimeout(() => setRefreshing(false), 500);
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case "premium":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "standard":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-green-500/20 text-green-400 border-green-500/30";
    }
  };

  if (isLoading && !subscriptions.length) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-black border rounded-2xl border-red-500/20">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 rounded-full bg-gradient-to-b from-red-500 to-red-700"></div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  B2B Subscriptions
                </h1>
                <p className="text-white/40 text-sm mt-0.5">
                  Manage all active and expired subscriptions
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 text-red-400 transition-all duration-200 bg-black border border-red-500/30 rounded-xl hover:text-red-300"
          >
            <ArrowPathIcon
              className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      <div className="overflow-hidden bg-black border rounded-2xl border-red-500/20">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-red-500/10">
            <thead className="bg-red-500/5">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-left text-red-400 uppercase">
                  Company
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-red-400 uppercase">
                  Plan
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-red-400 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-red-400 uppercase">
                  Start Date
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-red-400 uppercase">
                  End Date
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-red-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-red-400 uppercase">
                  Auto Renew
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-500/10">
              {subscriptions.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-white/40"
                  >
                    No subscriptions found
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <tr
                    key={sub._id}
                    className="transition-colors hover:bg-red-500/5"
                  >
                    <td className="px-6 py-4 text-sm text-white/80">
                      {sub.user?.companyName || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(sub.tier)}`}
                      >
                        {sub.tier?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/80">
                      ${sub.price} / ৳{sub.priceBDT}
                    </td>
                    <td className="px-6 py-4 text-sm text-white/40">
                      {new Date(sub.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-white/40">
                      {new Date(sub.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${sub.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                      >
                        {sub.isActive ? "Active" : "Expired"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/80">
                      {sub.autoRenew ? "Yes" : "No"}
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

export default B2BSubscriptions;
