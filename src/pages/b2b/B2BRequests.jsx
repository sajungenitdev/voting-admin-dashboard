import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchB2BRequests,
  approveB2BRequest,
  rejectB2BRequest,
} from "../../store/slices/b2bSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import {
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const B2BRequests = () => {
  const dispatch = useDispatch();
  const { requests, isLoading } = useSelector((state) => state.b2b);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    dispatch(fetchB2BRequests());
  }, [dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchB2BRequests());
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleApprove = async (id) => {
    await dispatch(approveB2BRequest(id));
  };

  const handleReject = async () => {
    if (selectedRequest && rejectReason) {
      await dispatch(
        rejectB2BRequest({ id: selectedRequest._id, reason: rejectReason }),
      );
      setShowRejectModal(false);
      setRejectReason("");
      setSelectedRequest(null);
    }
  };

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
                  Data Access Requests
                </h1>
                <p className="text-white/40 text-sm mt-0.5">
                  Review and manage B2B data access requests
                </p>
              </div>
            </div>
          </div>
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

      {/* Requests Table */}
      <div className="overflow-hidden bg-black border rounded-2xl border-red-500/20">
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
                  Purpose
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-red-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-red-400 uppercase">
                  Submitted
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-red-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-500/10">
              {requests.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-white/40"
                  >
                    No requests found
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr
                    key={req._id}
                    className="transition-colors hover:bg-red-500/5"
                  >
                    <td className="px-6 py-4 text-sm text-white/80">
                      {req.fullName}
                    </td>
                    <td className="px-6 py-4 text-sm text-white/60">
                      {req.email}
                      <br />
                      <span className="text-xs text-white/40">
                        {req.phoneNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/40">
                      {req.selectedCategories?.slice(0, 2).join(", ")}
                      {req.selectedCategories?.length > 2 &&
                        ` +${req.selectedCategories.length - 2}`}
                    </td>
                    <td className="max-w-xs px-6 py-4 text-sm truncate text-white/40">
                      {req.purpose}
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
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedRequest(req);
                            setShowViewModal(true);
                          }}
                          className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </button>
                        {req.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(req._id)}
                              className="p-1.5 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <CheckCircleIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedRequest(req);
                                setShowRejectModal(true);
                              }}
                              className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <XCircleIcon className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Request Modal */}
      {showViewModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gradient-to-b from-gray-900 to-black border border-red-500/30 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 bg-gradient-to-r from-red-600 to-red-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                  Request Details
                </h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/40">Company Name</label>
                  <p className="text-white">{selectedRequest.fullName}</p>
                </div>
                <div>
                  <label className="text-sm text-white/40">Email</label>
                  <p className="text-white">{selectedRequest.email}</p>
                </div>
                <div>
                  <label className="text-sm text-white/40">Phone</label>
                  <p className="text-white">{selectedRequest.phoneNumber}</p>
                </div>
                <div>
                  <label className="text-sm text-white/40">Status</label>
                  <p className="text-white capitalize">
                    {selectedRequest.status}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-white/40">Purpose</label>
                  <p className="text-white">{selectedRequest.purpose}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-white/40">
                    Requested Categories
                  </label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedRequest.selectedCategories?.map((cat) => (
                      <span
                        key={cat}
                        className="px-2 py-1 text-xs text-red-400 rounded-lg bg-red-500/20"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-white/40">Submitted</label>
                  <p className="text-white">
                    {new Date(selectedRequest.createdAt).toLocaleString()}
                  </p>
                </div>
                {selectedRequest.approvedAt && (
                  <div>
                    <label className="text-sm text-white/40">Approved On</label>
                    <p className="text-white">
                      {new Date(selectedRequest.approvedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-red-500/20">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 text-white bg-white/10 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md border shadow-2xl bg-gradient-to-b from-gray-900 to-black border-red-500/30 rounded-2xl">
            <div className="px-6 py-4 bg-gradient-to-r from-red-600 to-red-800">
              <h2 className="text-xl font-bold text-white">Reject Request</h2>
            </div>
            <div className="p-6">
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Reason for rejection..."
                className="w-full px-4 py-2 bg-black/50 border border-red-500/30 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-red-500 min-h-[100px]"
              />
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-red-500/20">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                className="px-4 py-2 text-white bg-white/10 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 text-white bg-red-600 rounded-xl"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default B2BRequests;
