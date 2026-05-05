import React from "react";
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon,
  CalendarIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const PollCard = ({
  poll,
  onView,
  onEdit,
  onDelete,
  onPublish,
  onUnpublish,
  disabled,
}) => {
  const navigate = useNavigate();
  const totalVotes =
    poll.totalVotes ||
    poll.candidates?.reduce((sum, c) => sum + (c.voteCount || 0), 0) ||
    0;
  const candidateCount = poll.candidates?.length || 0;
  const now = new Date();
  const endDate = new Date(poll.endDate);
  const startDate = new Date(poll.startDate);

  const getStatus = () => {
    if (!poll.isPublished)
      return {
        label: "Draft",
        color: "bg-yellow-500/80 text-yellow-400 border border-yellow-500/30",
        icon: "📝",
      };
    if (endDate < now)
      return {
        label: "Ended",
        color: "bg-gray-500/80 text-gray-400 border border-gray-500/30",
        icon: "🏁",
      };
    if (startDate > now)
      return {
        label: "Scheduled",
        color: "bg-blue-500/80 text-blue-400 border border-blue-500/30",
        icon: "⏰",
      };
    return {
      label: "Active",
      color: "bg-green-500/80 text-green-400 border border-green-500/30",
      icon: "🔥",
    };
  };

  const status = getStatus();
  const remainingDays = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
  const hasEnded = endDate < now;
  const votePercentage =
    totalVotes > 0 ? (poll.candidates?.[0]?.voteCount / totalVotes) * 100 : 0;

  const getCategoryIcon = (category) => {
    const icons = {
      technology: "💻",
      sports: "⚽",
      politics: "🏛️",
      entertainment: "🎬",
      business: "💼",
      education: "📚",
      health: "🏥",
      gaming: "🎮",
      other: "📋",
    };
    return icons[category] || "📋";
  };

  return (
    <div className="relative overflow-hidden transition-all duration-300 border group bg-linear-to-br from-gray-900 to-black rounded-2xl border-red-500/80 hover:border-red-500/50 hover:shadow-xl hover:shadow-red-500/5">
      {/* Status Ribbon */}
      <div
        className={`absolute top-0 right-0 ${status.color.split(" ")[0]} px-3 py-1 rounded-bl-xl text-xs font-medium flex items-center gap-1`}
      >
        <span>{status.icon}</span>
        <span>{status.label}</span>
      </div>

      <div className="p-5">
        {/* Category Badge */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getCategoryIcon(poll.category)}</span>
            <span className="text-xs capitalize text-white/40">
              {poll.category}
            </span>
          </div>
          {!hasEnded && poll.isPublished && (
            <div className="flex items-center gap-1 text-xs text-white/40">
              <CalendarIcon className="w-3 h-3" />
              <span>
                {remainingDays > 0 ? `${remainingDays}d left` : "Ending soon"}
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="mb-2 text-lg font-semibold text-white transition-colors line-clamp-1 group-hover:text-red-400">
          {poll.title}
        </h3>

        {/* Description */}
        <p className="mb-4 text-sm text-white/50 line-clamp-2">
          {poll.description || "No description provided"}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-white/40">
              <UsersIcon className="w-4 h-4" />
              <span className="text-sm">{candidateCount}</span>
            </div>
            <div className="flex items-center gap-1 text-white/40">
              <ChartBarIcon className="w-4 h-4" />
              <span className="text-sm">
                {totalVotes.toLocaleString()} votes
              </span>
            </div>
          </div>
          {!hasEnded && poll.isPublished && (
            <div className="text-xs text-red-400/60">
              {format(endDate, "MMM dd")}
            </div>
          )}
        </div>

        {/* Progress Bar (for active polls) */}
        {poll.isPublished && !hasEnded && totalVotes > 0 && (
          <div className="mb-4">
            <div className="flex justify-between mb-1 text-xs text-white/40">
              <span>Participation</span>
              <span>{Math.min(100, Math.round(votePercentage))}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-500 rounded-full bg-linear-to-r from-red-500 to-red-600"
                style={{ width: `${Math.min(100, votePercentage)}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-red-500/10">
          <div className="flex items-center gap-1">
            <button
              onClick={onView}
              disabled={disabled}
              className="p-2 transition-all duration-200 rounded-lg text-white/50 hover:text-blue-400 hover:bg-blue-500/10 disabled:opacity-50"
              title="Preview Poll"
            >
              <EyeIcon className="w-4 h-4" />
            </button>
            <button
              onClick={onEdit}
              disabled={disabled}
              className="p-2 transition-all duration-200 rounded-lg text-white/50 hover:text-yellow-400 hover:bg-yellow-500/10 disabled:opacity-50"
              title="Edit Poll"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              disabled={disabled}
              className="p-2 transition-all duration-200 rounded-lg text-white/50 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-50"
              title="Delete Poll"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>

          {!poll.isPublished ? (
            <button
              onClick={onPublish}
              disabled={disabled}
              className="text-xs px-3 py-1.5 bg-linear-to-r from-green-500 to-green-700 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/25 transition-all duration-200 disabled:opacity-50"
            >
              Publish
            </button>
          ) : (
            <button
              onClick={onUnpublish}
              disabled={disabled}
              className="text-xs px-3 py-1.5 bg-white/10 text-white/80 rounded-lg hover:bg-white/80 transition-all duration-200 disabled:opacity-50"
            >
              Unpublish
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PollCard;
