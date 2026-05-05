import React from 'react';
import { PencilIcon, TrashIcon, EyeIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const PollCard = ({ poll, onEdit, onDelete, onPublish, onUnpublish, disabled }) => {
  const navigate = useNavigate();
  const totalVotes = poll.totalVotes || 0;
  const candidateCount = poll.candidates?.length || 0;

  const getStatus = () => {
    const now = new Date();
    const endDate = new Date(poll.endDate);
    const startDate = new Date(poll.startDate);
    
    if (!poll.isPublished) return { label: 'Draft', color: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' };
    if (endDate < now) return { label: 'Ended', color: 'bg-gray-500/20 text-gray-400 border border-gray-500/30' };
    if (startDate > now) return { label: 'Scheduled', color: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' };
    return { label: 'Active', color: 'bg-green-500/20 text-green-400 border border-green-500/30' };
  };

  const status = getStatus();

  return (
    <div className="bg-black rounded-2xl border border-red-500/20 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/5 transition-all duration-300 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-white line-clamp-1">{poll.title}</h3>
            <p className="text-xs text-white/40 mt-1 capitalize">
              {poll.category} • {candidateCount} candidate{candidateCount !== 1 ? 's' : ''}
            </p>
          </div>
          <span className={`px-2 py-1 text-xs font-semibold rounded-lg ${status.color}`}>
            {status.label}
          </span>
        </div>

        <p className="text-sm text-white/60 line-clamp-2 mb-4">
          {poll.description || 'No description provided'}
        </p>

        <div className="flex items-center justify-between text-sm text-white/40 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <ChartBarIcon className="h-4 w-4" />
              <span>{totalVotes.toLocaleString()} votes</span>
            </div>
            <div>📅 {new Date(poll.endDate).toLocaleDateString()}</div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-red-500/10">
          <div className="flex gap-1">
            <button
              onClick={() => navigate(`/polls/${poll._id}`)}
              disabled={disabled}
              className="p-2 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 disabled:opacity-50"
              title="View Details"
            >
              <EyeIcon className="h-4 w-4" />
            </button>
            <button
              onClick={onEdit}
              disabled={disabled}
              className="p-2 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 disabled:opacity-50"
              title="Edit Poll"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button
              onClick={onDelete}
              disabled={disabled}
              className="p-2 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 disabled:opacity-50"
              title="Delete Poll"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
          {!poll.isPublished ? (
            <button
              onClick={onPublish}
              disabled={disabled}
              className="text-xs px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200 disabled:opacity-50"
            >
              Publish
            </button>
          ) : (
            <button
              onClick={onUnpublish}
              disabled={disabled}
              className="text-xs px-3 py-1.5 bg-white/10 text-white/80 rounded-lg hover:bg-white/20 transition-all duration-200 disabled:opacity-50"
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