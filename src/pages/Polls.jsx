import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPolls,
  deletePoll,
  publishPoll,
  unpublishPoll,
} from "../store/slices/pollSlice";
import { useDebounce } from "../hooks/useDebounce";
import PollFilters from "../components/polls/PollFilters";
import PollCard from "../components/polls/PollCard";
import PollModal from "../components/polls/PollModal";
import PollViewModal from "../components/polls/PollViewModal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Pagination from "../components/common/Pagination";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { PlusIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { castVote } from "../store/slices/voteSlice";
import toast from "react-hot-toast";

const Polls = () => {
  const dispatch = useDispatch();
  const { polls, pagination, isLoading } = useSelector((state) => state.polls);
  const { user } = useSelector((state) => state.auth);

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 500);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [viewingPoll, setViewingPoll] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    pollId: null,
  });

  useEffect(() => {
    const filters = {
      page,
      limit: 12,
      search: debouncedSearch,
      category: categoryFilter,
      status: statusFilter,
    };
    dispatch(fetchPolls(filters));
  }, [dispatch, page, debouncedSearch, categoryFilter, statusFilter]);

  const handleRefresh = async () => {
    setRefreshing(true);
    const filters = {
      page,
      limit: 12,
      search: debouncedSearch,
      category: categoryFilter,
      status: statusFilter,
    };
    await dispatch(fetchPolls(filters));
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleVote = async (pollId, candidateId) => {
    try {
      await dispatch(castVote({ pollId, candidateId })).unwrap();
      toast.success("Vote cast successfully!");
      // Refresh polls to update vote counts
      const filters = {
        page,
        limit: 12,
        search: debouncedSearch,
        category: categoryFilter,
        status: statusFilter,
      };
      await dispatch(fetchPolls(filters));
      return true;
    } catch (error) {
      console.error("Vote failed:", error);
      const errorMsg = error.response?.data?.message || "Failed to cast vote";
      toast.error(errorMsg);
      throw error;
    }
  };

  const handleDelete = useCallback(async () => {
    if (confirmDialog.pollId && !actionLoading) {
      setActionLoading(true);
      try {
        await dispatch(deletePoll(confirmDialog.pollId));
        setConfirmDialog({ isOpen: false, pollId: null });
      } finally {
        setActionLoading(false);
      }
    }
  }, [dispatch, confirmDialog.pollId, actionLoading]);

  const handlePublish = useCallback(
    async (pollId) => {
      if (actionLoading) return;
      setActionLoading(true);
      try {
        await dispatch(publishPoll(pollId));
        toast.success("Poll published successfully");
      } catch (error) {
        toast.error("Failed to publish poll");
      } finally {
        setActionLoading(false);
      }
    },
    [dispatch, actionLoading],
  );

  const handleUnpublish = useCallback(
    async (pollId) => {
      if (actionLoading) return;
      setActionLoading(true);
      try {
        await dispatch(unpublishPoll(pollId));
        toast.success("Poll unpublished successfully");
      } catch (error) {
        toast.error("Failed to unpublish poll");
      } finally {
        setActionLoading(false);
      }
    },
    [dispatch, actionLoading],
  );

  // Calculate stats
  const activePolls = polls.filter(
    (p) => p.isPublished && new Date(p.endDate) > new Date(),
  ).length;
  const draftPolls = polls.filter((p) => !p.isPublished).length;
  const totalVotes = polls.reduce((sum, p) => sum + (p.totalVotes || 0), 0);

  if (isLoading && polls.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Modern Header with Stats */}
      <div className="relative overflow-hidden border rounded-2xl bg-linear-to-r from-black via-gray-900 to-black border-red-500/20">
        <div className="absolute top-0 right-0 rounded-full w-80 h-80 bg-red-600/20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 rounded-full w-80 h-80 bg-red-500/10 blur-3xl animate-pulse animation-delay-2000"></div>

        {/* Animated glow effect */}
        <div className="absolute inset-0 bg-linear-to-r from-red-500/5 to-transparent"></div>

        <div className="relative z-10 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 shadow-lg bg-linear-to-br from-red-500 to-red-700 rounded-xl shadow-red-500/20">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  Polls Management
                </h1>
                <p className="text-white/40 text-sm mt-0.5">
                  Create, manage, and monitor all voting polls
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Stats Badge */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-red-500/20">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-white/60">
                  {activePolls} Active
                </span>
              </div>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 transition-all duration-200 border bg-white/5 border-red-500/30 rounded-xl text-white/60 hover:text-white hover:bg-red-500/10 hover:border-red-500 disabled:opacity-50"
                title="Refresh"
              >
                <ArrowPathIcon
                  className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`}
                />
              </button>

              {/* Create Button */}
              <button
                onClick={() => {
                  setSelectedPoll(null);
                  setIsModalOpen(true);
                }}
                disabled={actionLoading}
                className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-red-500 to-red-700 rounded-xl text-white text-sm font-medium hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 group disabled:opacity-50"
              >
                <PlusIcon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
                Create Poll
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-4 pt-4 mt-6 border-t md:grid-cols-4 border-red-500/10">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {polls.length}
              </div>
              <div className="text-xs text-white/40">Total Polls</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {activePolls}
              </div>
              <div className="text-xs text-white/40">Active Polls</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {draftPolls}
              </div>
              <div className="text-xs text-white/40">Drafts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {totalVotes.toLocaleString()}
              </div>
              <div className="text-xs text-white/40">Total Votes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <PollFilters
        search={searchTerm}
        setSearch={setSearchTerm}
        category={categoryFilter}
        setCategory={setCategoryFilter}
        status={statusFilter}
        setStatus={setStatusFilter}
        isLoading={isLoading}
      />

      {/* Polls Grid */}
      {polls.length === 0 ? (
        <div className="py-16 text-center border bg-black/40 rounded-2xl border-red-500/20 backdrop-blur-sm">
          <div className="mb-4 text-7xl">📊</div>
          <h3 className="text-xl font-medium text-white">No polls found</h3>
          <p className="mt-2 text-white/40">
            Create your first poll to get started
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-6 px-6 py-2.5 bg-linear-to-r from-red-500 to-red-700 rounded-xl text-white text-sm font-medium hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300"
          >
            Create Poll
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {polls.map((poll) => (
              <PollCard
                key={poll._id}
                poll={poll}
                onView={() => {
                  setViewingPoll(poll);
                  setIsViewModalOpen(true);
                }}
                onEdit={() => {
                  setSelectedPoll(poll);
                  setIsModalOpen(true);
                }}
                onDelete={() =>
                  setConfirmDialog({ isOpen: true, pollId: poll._id })
                }
                onPublish={() => handlePublish(poll._id)}
                onUnpublish={() => handleUnpublish(poll._id)}
                disabled={actionLoading}
              />
            ))}
          </div>

          {/* Results Summary */}
          <div className="text-xs text-center text-white/30">
            Showing {polls.length} of {pagination?.total || polls.length} polls
          </div>
        </>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="p-4 border bg-black/40 rounded-2xl border-red-500/20 backdrop-blur-sm">
          <Pagination
            currentPage={page}
            totalPages={pagination.pages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Modals */}
      <PollModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        poll={selectedPoll}
        onSuccess={() => {
          const filters = {
            page,
            limit: 12,
            search: debouncedSearch,
            category: categoryFilter,
            status: statusFilter,
          };
          dispatch(fetchPolls(filters));
        }}
      />
      <PollViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        poll={viewingPoll}
        onVote={handleVote}
        user={user}
      />
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, pollId: null })}
        onConfirm={handleDelete}
        title="Delete Poll"
        message="Are you sure you want to delete this poll? All votes and comments will also be deleted."
      />
    </div>
  );
};

export default Polls;
