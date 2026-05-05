import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";

const InfoRow = ({ label, value }) => (
  <div className="py-3 border-b border-red-500/10">
    <dt className="text-sm font-medium text-white/40">{label}</dt>
    <dd className="mt-1 text-sm text-white">{value || "—"}</dd>
  </div>
);

const ViewUserModal = ({ isOpen, onClose, user }) => {
  const [imageError, setImageError] = useState(false);

  if (!user) return null;

  // Fallback image URL
  const fallbackImageUrl =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqvpEmXV-QQDvHKQo3m-vD2lK3b5mPjCaBYMdn8JxmLA&s&ec=121643259";

  // Get user initials for text fallback
  const getUserInitials = () => {
    if (user.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    }
    return "U";
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <Dialog.Panel className="w-full max-w-2xl overflow-hidden bg-black border shadow-2xl border-red-500/30 rounded-2xl">
          {/* Header with Gradient Background */}
          <div className="px-6 py-4 bg-linear-to-r from-red-600 to-red-800">
            <div className="flex items-center justify-between">
              <Dialog.Title className="text-xl font-semibold text-white">
                User Details
              </Dialog.Title>
              <button
                onClick={onClose}
                className="transition-colors cursor-pointer text-white/60 hover:text-white"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* User Header */}
            <div className="flex items-center gap-4 pb-6 mb-4">
              {/* Avatar with fallback image */}
              <div className="relative w-20 h-20">
                <img
                  src={user.avatar || fallbackImageUrl}
                  alt={user.name}
                  className="object-cover w-full h-full rounded-2xl"
                  onError={(e) => {
                    e.target.style.display = "none";
                    setImageError(true);
                  }}
                />
                {(!user.avatar || imageError) && (
                  <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white shadow-lg bg-linear-to-br from-red-500 to-red-700 rounded-2xl shadow-red-500/20">
                    {getUserInitials()}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                <p className="text-white/60">{user.email}</p>
                <div className="flex gap-2 mt-2">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isVerified
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    }`}
                  >
                    {user.isVerified ? "Verified" : "Pending"}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === "admin"
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : user.role === "moderator"
                          ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                          : "bg-green-500/20 text-green-400 border border-green-500/30"
                    }`}
                  >
                    {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* User Information */}
            <dl className="grid grid-cols-1 gap-0 border-t md:grid-cols-2 border-red-500/20">
              <InfoRow label="User ID" value={user._id} />
              <InfoRow
                label="Registered On"
                value={format(new Date(user.createdAt), "dd MMM yyyy, h:mm a")}
              />
              <InfoRow
                label="Last Login"
                value={
                  user.lastLogin
                    ? format(new Date(user.lastLogin), "dd MMM yyyy, h:mm a")
                    : "Never"
                }
              />
              <InfoRow label="Role" value={user.role} />
              <InfoRow
                label="Email Verified"
                value={user.isVerified ? "Yes" : "No"}
              />
              <InfoRow
                label="Account Status"
                value={user.isActive ? "Active" : "Inactive"}
              />
              <InfoRow label="Account ID" value={user._id?.slice(-12)} />
            </dl>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ViewUserModal;
