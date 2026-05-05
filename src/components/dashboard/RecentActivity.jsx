import {
  UserPlusIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const RecentActivity = ({ logs }) => {
  // Use dynamic data from API
  const activityLogs = logs?.length ? logs : [];

  const getIcon = (action) => {
    const actionLower = action?.toLowerCase() || "";
    if (actionLower.includes("register") || actionLower.includes("user"))
      return <UserPlusIcon className="h-4 w-4" />;
    if (actionLower.includes("poll"))
      return <ClipboardDocumentListIcon className="h-4 w-4" />;
    if (actionLower.includes("vote"))
      return <CheckCircleIcon className="h-4 w-4" />;
    return <ChatBubbleLeftRightIcon className="h-4 w-4" />;
  };

  const getIconBg = (action) => {
    const actionLower = action?.toLowerCase() || "";
    if (actionLower.includes("register") || actionLower.includes("user"))
      return "bg-blue-500/20 text-blue-400";
    if (actionLower.includes("poll")) return "bg-green-500/20 text-green-400";
    if (actionLower.includes("vote")) return "bg-purple-500/20 text-purple-400";
    return "bg-red-500/20 text-red-400";
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "Unknown";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000 / 60); // minutes

    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff} minutes ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return `${Math.floor(diff / 1440)} days ago`;
  };

  if (activityLogs.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-white/40 text-sm">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-red-500/10">
      {activityLogs.slice(0, 5).map((log, index) => (
        <div
          key={log._id || index}
          className="flex items-start gap-3 p-4 hover:bg-red-500/5 transition-colors"
        >
          <div className={`p-2 rounded-xl ${getIconBg(log.action)}`}>
            {getIcon(log.action)}
          </div>
          <div className="flex-1">
            <p className="text-sm text-white capitalize">
              {log.action?.replace(/_/g, " ") || "Activity"}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-white/40">
                {log.user?.email || log.email || "System"}
              </span>
              <span className="text-xs text-white/20">•</span>
              <span className="text-xs text-red-400/60">
                {formatTime(log.createdAt)}
              </span>
            </div>
            {log.details && (
              <p className="text-xs text-white/30 mt-1">
                {log.details.pollTitle || log.details.message || ""}
              </p>
            )}
          </div>
          {log.status === "SUCCESS" && (
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
          )}
          {log.status === "FAILED" && (
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;
