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
import ConfirmDialog from "../components/common/ConfirmDialog";
import Pagination from "../components/common/Pagination";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { PlusIcon } from "@heroicons/react/24/outline";

const Polls = () => {
  const dispatch = useDispatch();
  const { polls, pagination, isLoading } = useSelector((state) => state.polls);

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 500);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState(null);
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
      } finally {
        setActionLoading(false);
      }
    },
    [dispatch, actionLoading],
  );

  if (isLoading && polls.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-black border border-red-500/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 p-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-red-500 to-red-700 rounded-full"></div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Polls Management
                </h1>
                <p className="text-white/40 text-sm mt-0.5">
                  Create and manage all polls
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedPoll(null);
              setIsModalOpen(true);
            }}
            disabled={actionLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 rounded-xl text-white text-sm font-medium hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 group disabled:opacity-50"
          >
            <PlusIcon className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
            Create Poll
          </button>
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
      />

      {/* Polls Grid */}
      {polls.length === 0 ? (
        <div className="text-center py-12 bg-black rounded-2xl border border-red-500/20">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-white">No polls found</h3>
          <p className="text-white/40 mt-1">
            Create your first poll to get started
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 rounded-xl text-white text-sm font-medium hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300"
          >
            Create Poll
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {polls.map((poll) => (
            <PollCard
              key={poll._id}
              poll={poll}
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
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="bg-black rounded-2xl border border-red-500/20 p-4">
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
