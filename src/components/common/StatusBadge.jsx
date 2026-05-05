import React from "react";

const StatusBadge = ({ status, label }) => {
  // Define status colors as objects, not JSX
  const statusConfig = {
    active: {
      label: "Active",
      className: "bg-green-500/20 text-green-400 border border-green-500/30",
    },
    ended: {
      label: "Ended",
      className: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
    },
    draft: {
      label: "Draft",
      className: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    },
    scheduled: {
      label: "Scheduled",
      className: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    },
    pending: {
      label: "Pending",
      className: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
    },
    approved: {
      label: "Approved",
      className: "bg-green-500/20 text-green-400 border border-green-500/30",
    },
    rejected: {
      label: "Rejected",
      className: "bg-red-500/20 text-red-400 border border-red-500/30",
    },
    success: {
      label: "Success",
      className: "bg-green-500/20 text-green-400 border border-green-500/30",
    },
    error: {
      label: "Error",
      className: "bg-red-500/20 text-red-400 border border-red-500/30",
    },
    warning: {
      label: "Warning",
      className: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    },
    info: {
      label: "Info",
      className: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    },
  };

  const config = statusConfig[status?.toLowerCase()] || statusConfig.info;
  const displayLabel = label || config.label;

  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-lg ${config.className}`}
    >
      {displayLabel}
    </span>
  );
};

export default StatusBadge;
