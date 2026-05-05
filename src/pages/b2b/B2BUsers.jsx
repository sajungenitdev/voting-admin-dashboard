import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchB2BUsers } from "../../store/slices/b2bSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import {
  ArrowPathIcon,
  EyeIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

const B2BUsers = () => {
  const dispatch = useDispatch();
  const { b2bUsers, isLoading } = useSelector((state) => state.b2b);
  const [refreshing, setRefresring] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    dispatch(fetchB2BUsers());
  }, [dispatch]);

  const handleRefresh = async () => {
    setRefresring(true);
    await dispatch(fetchB2BUsers());
    setTimeout(() => setRefreshing(false), 500);
  };

  const getStatusBadge = (isActive) => {
    return isActive
      ? "bg-green-500/20 text-green-400 border border-green-500/30"
      : "bg-red-500/20 text-red-400 border border-red-500/30";
  };

  if (isLoading && !b2bUsers.length) {
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
                <h1 className="text-2xl font-bold text-white">B2B Users</h1>
                <p className="text-white/40 text-sm mt-0.5">
                  Manage all B2B buyer accounts
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

      {/* Users Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {b2bUsers.length === 0 ? (
          <div className="py-12 text-center border col-span-full bg-black/40 rounded-2xl border-red-500/20">
            <div className="mb-4 text-6xl">👥</div>
            <h3 className="text-lg font-medium text-white">
              No B2B users found
            </h3>
            <p className="mt-1 text-white/40">
              B2B users will appear here after they register
            </p>
          </div>
        ) : (
          b2bUsers.map((user) => (
            <div
              key={user._id}
              className="overflow-hidden transition-all duration-300 border bg-gradient-to-br from-gray-900 to-black rounded-2xl border-red-500/20 hover:border-red-500/50"
            >
              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 shadow-lg bg-gradient-to-br from-red-500 to-red-700 rounded-xl shadow-red-500/20">
                      <span className="text-lg font-bold text-white">
                        {user.companyName?.charAt(0) ||
                          user.fullName?.charAt(0) ||
                          "B"}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        {user.companyName || user.fullName}
                      </h3>
                      <p className="text-xs text-white/40">
                        ID: {user._id?.slice(-8)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(user.isActive)}`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="mb-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <EnvelopeIcon className="w-4 h-4 text-white/40" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <PhoneIcon className="w-4 h-4 text-white/40" />
                    <span>{user.phoneNumber || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <CalendarIcon className="w-4 h-4 text-white/40" />
                    <span>
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Verification Status */}
                <div className="flex items-center justify-between pt-3 border-t border-red-500/10">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${user.isVerified ? "bg-green-500" : "bg-yellow-500"}`}
                    />
                    <span className="text-xs text-white/40">
                      {user.isVerified ? "Verified" : "Pending Verification"}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowUserModal(true);
                    }}
                    className="p-1.5 text-white/50 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
                    title="View Details"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gradient-to-b from-gray-900 to-black border border-red-500/30 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 bg-gradient-to-r from-red-600 to-red-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                  B2B User Details
                </h2>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              {/* User Header */}
              <div className="flex items-center gap-4 pb-6 mb-4 border-b border-red-500/20">
                <div className="flex items-center justify-center w-16 h-16 shadow-lg bg-gradient-to-br from-red-500 to-red-700 rounded-2xl shadow-red-500/20">
                  <span className="text-2xl font-bold text-white">
                    {selectedUser.companyName?.charAt(0) ||
                      selectedUser.fullName?.charAt(0) ||
                      "B"}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {selectedUser.companyName || selectedUser.fullName}
                  </h3>
                  <p className="text-white/60">{selectedUser.email}</p>
                  <div className="flex gap-2 mt-2">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(selectedUser.isActive)}`}
                    >
                      {selectedUser.isActive ? "Active" : "Inactive"}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${selectedUser.isVerified ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}
                    >
                      {selectedUser.isVerified ? "Verified" : "Pending"}
                    </span>
                  </div>
                </div>
              </div>

              {/* User Information */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="mb-1 text-xs text-white/40">Full Name</p>
                  <p className="text-white">{selectedUser.fullName || "N/A"}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="mb-1 text-xs text-white/40">Company Name</p>
                  <p className="text-white">
                    {selectedUser.companyName || "N/A"}
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="mb-1 text-xs text-white/40">Email Address</p>
                  <p className="text-white break-all">{selectedUser.email}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="mb-1 text-xs text-white/40">Phone Number</p>
                  <p className="text-white">
                    {selectedUser.phoneNumber || "N/A"}
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="mb-1 text-xs text-white/40">Role</p>
                  <p className="text-white capitalize">
                    {selectedUser.role || "buyer"}
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="mb-1 text-xs text-white/40">Joined Date</p>
                  <p className="text-white">
                    {new Date(selectedUser.createdAt).toLocaleString()}
                  </p>
                </div>
                {selectedUser.lastLogin && (
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="mb-1 text-xs text-white/40">Last Login</p>
                    <p className="text-white">
                      {new Date(selectedUser.lastLogin).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default B2BUsers;
