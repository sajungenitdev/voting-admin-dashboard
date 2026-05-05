import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchB2BPayments,
  fetchB2BSubscriptions,
} from "../store/slices/b2bSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  ArrowPathIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

const Revenue = () => {
  const dispatch = useDispatch();
  const { payments, subscriptions, isLoading } = useSelector(
    (state) => state.b2b,
  );
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchB2BPayments());
    dispatch(fetchB2BSubscriptions());
  }, [dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchB2BPayments());
    await dispatch(fetchB2BSubscriptions());
    setTimeout(() => setRefreshing(false), 500);
  };

  // Revenue data by plan
  const revenueData = [
    { month: "Jan", basic: 2500, standard: 5000, premium: 15000 },
    { month: "Feb", basic: 2800, standard: 5500, premium: 18000 },
    { month: "Mar", basic: 3100, standard: 6000, premium: 22000 },
    { month: "Apr", basic: 3500, standard: 6800, premium: 25000 },
    { month: "May", basic: 3900, standard: 7500, premium: 28000 },
    { month: "Jun", basic: 4200, standard: 8200, premium: 32000 },
  ];

  const totalRevenue = revenueData.reduce(
    (sum, month) => sum + month.basic + month.standard + month.premium,
    0,
  );
  const monthlyGrowth = 15.5;

  if (isLoading && !payments.length) {
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
                  Revenue Analytics
                </h1>
                <p className="text-white/40 text-sm mt-0.5">
                  Track subscription revenue and financial performance
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
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

      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-5 bg-black border rounded-2xl border-red-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/50">Total Revenue</p>
              <p className="mt-1 text-2xl font-bold text-white">
                ${totalRevenue.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-green-400">
                ↑ {monthlyGrowth}% from last month
              </p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 bg-green-500/20 rounded-xl">
              <CurrencyDollarIcon className="w-5 h-5 text-green-400" />
            </div>
          </div>
        </div>
        <div className="p-5 bg-black border rounded-2xl border-red-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/50">Premium Revenue</p>
              <p className="mt-1 text-2xl font-bold text-white">$32,000</p>
              <p className="mt-1 text-xs text-green-400">
                ↑ 28% from last month
              </p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 bg-purple-500/20 rounded-xl">
              <ArrowTrendingUpIcon className="w-5 h-5 text-purple-400" />
            </div>
          </div>
        </div>
        <div className="p-5 bg-black border rounded-2xl border-red-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/50">Active Subscriptions</p>
              <p className="mt-1 text-2xl font-bold text-white">847</p>
              <p className="mt-1 text-xs text-green-400">
                ↑ 12 from last month
              </p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 bg-blue-500/20 rounded-xl">
              <span className="text-xl">📋</span>
            </div>
          </div>
        </div>
        <div className="p-5 bg-black border rounded-2xl border-red-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/50">Avg. Revenue per User</p>
              <p className="mt-1 text-2xl font-bold text-white">$42.50</p>
              <p className="mt-1 text-xs text-green-400">
                ↑ $5.20 from last month
              </p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 bg-yellow-500/20 rounded-xl">
              <ArrowTrendingUpIcon className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="p-6 bg-black border rounded-2xl border-red-500/20">
        <h3 className="mb-4 text-lg font-semibold text-white">
          Revenue Trend by Plan
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="month" stroke="#ffffff40" />
            <YAxis stroke="#ffffff40" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#000",
                border: "1px solid #ef444430",
                borderRadius: "8px",
              }}
              formatter={(value) => [`$${value}`, ""]}
            />
            <Legend wrapperStyle={{ color: "#ffffff60" }} />
            <Bar
              dataKey="basic"
              name="Basic Plan"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="standard"
              name="Standard Plan"
              fill="#f59e0b"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="premium"
              name="Premium Plan"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Payments Table */}
      <div className="overflow-hidden bg-black border rounded-2xl border-red-500/20">
        <div className="p-6 border-b border-red-500/10">
          <h3 className="text-lg font-semibold text-white">Recent Payments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-red-500/10">
            <thead className="bg-red-500/5">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-left text-red-400 uppercase">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-red-400 uppercase">
                  Plan
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-red-400 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-red-400 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-red-400 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-500/10">
              {[
                {
                  id: "TXN-001",
                  plan: "Premium",
                  amount: "$299",
                  date: "2026-05-05",
                  status: "completed",
                },
                {
                  id: "TXN-002",
                  plan: "Standard",
                  amount: "$100",
                  date: "2026-05-04",
                  status: "completed",
                },
                {
                  id: "TXN-003",
                  plan: "Basic",
                  amount: "$50",
                  date: "2026-05-03",
                  status: "pending",
                },
                {
                  id: "TXN-004",
                  plan: "Premium",
                  amount: "$299",
                  date: "2026-05-02",
                  status: "completed",
                },
              ].map((payment, idx) => (
                <tr key={idx} className="transition-colors hover:bg-red-500/5">
                  <td className="px-6 py-4 text-sm text-white/80">
                    {payment.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-white/60">
                    {payment.plan}
                  </td>
                  <td className="px-6 py-4 text-sm text-white/80">
                    {payment.amount}
                  </td>
                  <td className="px-6 py-4 text-sm text-white/40">
                    {payment.date}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        payment.status === "completed"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {payment.status}
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

export default Revenue;
