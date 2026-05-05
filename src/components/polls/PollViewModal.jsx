import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import {
  XMarkIcon,
  ChartBarIcon,
  UsersIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";

const PollViewModal = ({ isOpen, onClose, poll, onVote }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [voting, setVoting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!poll) return null;

  const totalVotes =
    poll.totalVotes ||
    poll.candidates?.reduce((sum, c) => sum + (c.voteCount || 0), 0) ||
    0;
  const hasEnded = new Date(poll.endDate) < new Date();
  const notStarted = new Date(poll.startDate) > new Date();
  const isActive = poll.isPublished && !hasEnded && !notStarted;

  const getStatusBadge = () => {
    if (!poll.isPublished)
      return {
        label: "Draft",
        color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
      };
    if (hasEnded)
      return {
        label: "Ended",
        color: "bg-red-500/20 text-red-400 border-red-500/30",
      };
    if (notStarted)
      return {
        label: "Coming Soon",
        color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      };
    return {
      label: "Active",
      color: "bg-green-500/20 text-green-400 border-green-500/30",
    };
  };

  const status = getStatusBadge();

  const handleVoteClick = () => {
    if (!selectedCandidate) {
      alert("Please select a candidate to vote");
      return;
    }
    setShowConfirm(true);
  };

  const confirmVote = async () => {
    setVoting(true);
    try {
      await onVote(poll._id, selectedCandidate);
      setShowConfirm(false);
      setSelectedCandidate(null);
      onClose();
    } catch (error) {
      console.error("Vote failed:", error);
    } finally {
      setVoting(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
          <Dialog.Panel className="bg-linear-to-b from-gray-900 to-black border border-red-500/30 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-10 px-6 py-4 bg-linear-to-r from-red-600 to-red-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-xl">
                    <ChartBarIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <Dialog.Title className="text-xl font-bold text-white">
                      Poll Preview
                    </Dialog.Title>
                    <p className="text-xs text-white/50">
                      View and vote as a user
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="transition-colors text-white/60 hover:text-white"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Poll Header */}
              <div className="mb-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <h2 className="text-2xl font-bold text-white">
                    {poll.title}
                  </h2>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full border ${status.color}`}
                  >
                    {status.label}
                  </span>
                </div>
                <p className="mb-4 text-sm text-white/60">{poll.description}</p>

                {/* Poll Meta Info */}
                <div className="flex flex-wrap gap-4 text-sm text-white/40">
                  <div className="flex items-center gap-1">
                    <UsersIcon className="w-4 h-4" />
                    <span>{totalVotes.toLocaleString()} votes cast</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span>
                      Ends:{" "}
                      {format(new Date(poll.endDate), "dd MMM yyyy, h:mm a")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="capitalize">{poll.category}</span>
                  </div>
                </div>
              </div>

              {/* Candidates Section */}
              <div className="mb-6">
                <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-white">
                  <span className="w-1 h-6 bg-red-500 rounded-full"></span>
                  Candidates
                </h3>

                <div className="space-y-4">
                  {poll.candidates?.map((candidate) => {
                    const votePercentage =
                      totalVotes > 0
                        ? ((candidate.voteCount || 0) / totalVotes) * 100
                        : 0;
                    const isSelected = selectedCandidate === candidate._id;

                    return (
                      <div
                        key={candidate._id}
                        className={`relative rounded-xl border transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "bg-red-500/10 border-red-500 shadow-lg shadow-red-500/10"
                            : "bg-white/5 border-red-500/20 hover:border-red-500/50 hover:bg-white/10"
                        } ${!isActive || hasEnded ? "cursor-default" : "cursor-pointer"}`}
                        onClick={() => {
                          if (isActive && !hasEnded && !notStarted) {
                            setSelectedCandidate(candidate._id);
                          }
                        }}
                      >
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                                    isSelected ? "bg-red-500" : "bg-gray-700"
                                  }`}
                                >
                                  {candidate.name.charAt(0)}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-white">
                                    {candidate.name}
                                  </h4>
                                  {candidate.description && (
                                    <p className="text-sm text-white/40">
                                      {candidate.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                            {isActive && !hasEnded && !notStarted && (
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  isSelected
                                    ? "border-red-500 bg-red-500"
                                    : "border-white/40"
                                }`}
                              >
                                {isSelected && (
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Progress Bar (show results after voting or if poll ended) */}
                          {(hasEnded || poll.userVoted || poll.showResults) && (
                            <div className="mt-3">
                              <div className="flex justify-between mb-1 text-xs text-white/50">
                                <span>{candidate.voteCount || 0} votes</span>
                                <span>{votePercentage.toFixed(1)}%</span>
                              </div>
                              <div className="w-full h-2 overflow-hidden rounded-full bg-white/10">
                                <div
                                  className="h-full transition-all duration-500 rounded-full bg-linear-to-r from-red-500 to-red-600"
                                  style={{ width: `${votePercentage}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Vote Button */}
              {isActive && !hasEnded && !notStarted && !poll.userVoted && (
                <div className="pt-4 border-t border-red-500/20">
                  <button
                    onClick={handleVoteClick}
                    disabled={!selectedCandidate || voting}
                    className="w-full py-3 font-semibold text-white transition-all duration-300 bg-linear-to-r from-red-500 to-red-700 rounded-xl hover:shadow-lg hover:shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {voting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin"></div>
                        Processing...
                      </div>
                    ) : (
                      `Vote for ${poll.candidates?.find((c) => c._id === selectedCandidate)?.name || "Candidate"}`
                    )}
                  </button>
                  <p className="mt-3 text-xs text-center text-white/30">
                    Your vote is secure and anonymous. You can only vote once.
                  </p>
                </div>
              )}

              {/* User Already Voted Message */}
              {poll.userVoted && (
                <div className="pt-4 border-t border-red-500/20">
                  <div className="p-4 text-center border bg-green-500/10 border-green-500/30 rounded-xl">
                    <div className="mb-1 text-lg text-green-400">
                      ✓ You have already voted
                    </div>
                    <p className="text-sm text-white/40">
                      Thank you for participating!
                    </p>
                  </div>
                </div>
              )}

              {/* Poll Ended Message */}
              {hasEnded && (
                <div className="pt-4 border-t border-red-500/20">
                  <div className="p-4 text-center border bg-yellow-500/10 border-yellow-500/30 rounded-xl">
                    <div className="mb-1 text-lg text-yellow-400">
                      📊 Poll Ended
                    </div>
                    <p className="text-sm text-white/40">
                      This poll has ended. Results are final.
                    </p>
                  </div>
                </div>
              )}

              {/* Not Started Message */}
              {notStarted && (
                <div className="pt-4 border-t border-red-500/20">
                  <div className="p-4 text-center border bg-blue-500/10 border-blue-500/30 rounded-xl">
                    <div className="mb-1 text-lg text-blue-400">
                      ⏰ Coming Soon
                    </div>
                    <p className="text-sm text-white/40">
                      This poll starts on{" "}
                      {format(new Date(poll.startDate), "dd MMM yyyy, h:mm a")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        className="relative z-[60]"
      >
        <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md p-6 border shadow-2xl bg-linear-to-b from-gray-900 to-black border-red-500/30 rounded-2xl">
            <Dialog.Title className="mb-4 text-xl font-bold text-white">
              Confirm Your Vote
            </Dialog.Title>
            <p className="mb-2 text-white/60">You are about to vote for:</p>
            <p className="mb-4 text-xl font-semibold text-red-400">
              {poll.candidates?.find((c) => c._id === selectedCandidate)?.name}
            </p>
            <p className="mb-6 text-sm text-white/40">
              ⚠️ This action cannot be undone. You can only vote once per poll.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 transition-colors text-white/60 bg-white/10 rounded-xl hover:bg-white/20"
              >
                Cancel
              </button>
              <button
                onClick={confirmVote}
                disabled={voting}
                className="flex-1 px-4 py-2 font-semibold text-white transition-all duration-200 bg-linear-to-r from-red-500 to-red-700 rounded-xl hover:shadow-lg hover:shadow-red-500/25 disabled:opacity-50"
              >
                {voting ? "Processing..." : "Confirm Vote"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default PollViewModal;
