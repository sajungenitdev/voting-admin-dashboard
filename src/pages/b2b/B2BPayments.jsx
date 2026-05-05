import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchB2BPayments } from "../../store/slices/b2bSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

const B2BPayments = () => {
  const dispatch = useDispatch();
  const { payments, isLoading } = useSelector((state) => state.b2b);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchB2BPayments());
  }, [dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchB2BPayments());
    setTimeout(() => setRefreshing(false), 500);
  };

  if (isLoading && !payments.length) {
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
                <h1 className="text-2xl font-bold text-white">B2B Payments</h1>
                <p className="text-white/40 text-sm mt-0.5">
                  Track all subscription payments
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
                  Transaction ID
                </th>
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
                  Date
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-red-400 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-500/10">
              {payments.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-white/40"
                  >
                    No payments found
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr
                    key={payment._id}
                    className="transition-colors hover:bg-red-500/5"
                  >
                    <td className="px-6 py-4 font-mono text-sm text-white/60">
                      {payment.transactionId?.slice(0, 12)}...
                    </td>
                    <td className="px-6 py-4 text-sm text-white/80">
                      {payment.user?.companyName || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-semibold text-purple-400 rounded-full bg-purple-500/20">
                        {payment.tier?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/80">
                      ${payment.amount} / ৳{payment.amountBDT}
                    </td>
                    <td className="px-6 py-4 text-sm text-white/40">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-semibold text-green-400 rounded-full bg-green-500/20">
                        Completed
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

export default B2BPayments;
