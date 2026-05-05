import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { createPoll, updatePoll } from "../../store/slices/pollSlice";

const PollModal = ({ isOpen, onClose, poll, onSuccess }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "technology",
    candidates: [{ name: "", description: "" }],
    endDate: "",
    startDate: "",
  });

  useEffect(() => {
    if (poll) {
      setFormData({
        title: poll.title || "",
        description: poll.description || "",
        category: poll.category || "technology",
        candidates: poll.candidates || [{ name: "", description: "" }],
        endDate: poll.endDate
          ? new Date(poll.endDate).toISOString().slice(0, 16)
          : "",
        startDate: poll.startDate
          ? new Date(poll.startDate).toISOString().slice(0, 16)
          : "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        category: "technology",
        candidates: [{ name: "", description: "" }],
        endDate: "",
        startDate: "",
      });
    }
  }, [poll]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const filteredCandidates = formData.candidates.filter((c) => c.name.trim());
    if (filteredCandidates.length < 2) {
      toast.error("Please add at least 2 candidates");
      setLoading(false);
      return;
    }

    if (!formData.endDate) {
      toast.error("Please select an end date");
      setLoading(false);
      return;
    }

    try {
      if (poll) {
        await dispatch(updatePoll({ id: poll._id, data: formData })).unwrap();
        toast.success("Poll updated successfully");
      } else {
        await dispatch(createPoll(formData)).unwrap();
        toast.success("Poll created successfully");
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save poll:", error);
      toast.error(error.response?.data?.message || "Failed to save poll");
    } finally {
      setLoading(false);
    }
  };

  const addCandidate = () => {
    if (formData.candidates.length >= 10) {
      toast.error("Maximum 10 candidates allowed");
      return;
    }
    setFormData({
      ...formData,
      candidates: [...formData.candidates, { name: "", description: "" }],
    });
  };

  const removeCandidate = (index) => {
    if (formData.candidates.length > 2) {
      const newCandidates = formData.candidates.filter((_, i) => i !== index);
      setFormData({ ...formData, candidates: newCandidates });
    } else {
      toast.error("Minimum 2 candidates required");
    }
  };

  const updateCandidate = (index, field, value) => {
    const newCandidates = [...formData.candidates];
    newCandidates[index][field] = value;
    setFormData({ ...formData, candidates: newCandidates });
  };

  const categories = [
    { value: "technology", label: "💻 Technology", icon: "💻" },
    { value: "sports", label: "⚽ Sports", icon: "⚽" },
    { value: "politics", label: "🏛️ Politics", icon: "🏛️" },
    { value: "entertainment", label: "🎬 Entertainment", icon: "🎬" },
    { value: "business", label: "💼 Business", icon: "💼" },
    { value: "education", label: "📚 Education", icon: "📚" },
    { value: "health", label: "🏥 Health", icon: "🏥" },
    { value: "gaming", label: "🎮 Gaming", icon: "🎮" },
    { value: "other", label: "📋 Other", icon: "📋" },
  ];

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <Dialog.Panel className="w-full max-w-3xl overflow-hidden border shadow-2xl bg-linear-to-b from-gray-900 to-black border-red-500/30 rounded-2xl">
          {/* Header */}
          <div className="px-6 py-4 bg-linear-to-r from-red-600 to-red-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  {poll ? (
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  )}
                </div>
                <Dialog.Title className="text-xl font-bold text-white">
                  {poll ? "Edit Poll" : "Create New Poll"}
                </Dialog.Title>
              </div>
              <button
                onClick={onClose}
                className="transition-colors text-white/60 hover:text-white"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex px-6 border-b border-red-500/20">
            <button
              type="button"
              onClick={() => setActiveTab("details")}
              className={`px-4 py-3 text-sm font-medium transition-all duration-200 relative ${
                activeTab === "details"
                  ? "text-red-400 border-b-2 border-red-400"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              Poll Details
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("candidates")}
              className={`px-4 py-3 text-sm font-medium transition-all duration-200 relative ${
                activeTab === "candidates"
                  ? "text-red-400 border-b-2 border-red-400"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              Candidates ({formData.candidates.length})
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {/* Poll Details Tab */}
              {activeTab === "details" && (
                <div className="space-y-5">
                  {/* Title */}
                  <div>
                    <label className="block mb-1 text-sm font-medium text-white/60">
                      Poll Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-black/50 border border-red-500/30 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                      placeholder="Enter poll title"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block mb-1 text-sm font-medium text-white/60">
                      Description <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 bg-black/50 border border-red-500/30 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all min-h-[120px]"
                      placeholder="Describe your poll"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block mb-1 text-sm font-medium text-white/60">
                      Category <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-black/50 border border-red-500/30 rounded-xl text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 cursor-pointer"
                    >
                      {categories.map((cat) => (
                        <option
                          key={cat.value}
                          value={cat.value}
                          className="bg-black"
                        >
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium text-white/60">
                        Start Date (Optional)
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            startDate: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 bg-black/50 border border-red-500/30 rounded-xl text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-white/60">
                        End Date <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.endDate}
                        onChange={(e) =>
                          setFormData({ ...formData, endDate: e.target.value })
                        }
                        className="w-full px-4 py-2.5 bg-black/50 border border-red-500/30 rounded-xl text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Candidates Tab */}
              {activeTab === "candidates" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-white/60">
                      Candidates{" "}
                      <span className="text-red-400">
                        * (Minimum 2, Maximum 10)
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={addCandidate}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-400 hover:text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-all"
                    >
                      <PlusIcon className="w-4 h-4" />
                      Add Candidate
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.candidates.map((candidate, index) => (
                      <div key={index} className="relative group">
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <input
                              type="text"
                              placeholder={`Candidate ${index + 1} name`}
                              value={candidate.name}
                              onChange={(e) =>
                                updateCandidate(index, "name", e.target.value)
                              }
                              className="w-full px-4 py-2.5 bg-black/50 border border-red-500/30 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                              required
                            />
                          </div>
                          <div className="flex-1">
                            <input
                              type="text"
                              placeholder="Description (optional)"
                              value={candidate.description}
                              onChange={(e) =>
                                updateCandidate(
                                  index,
                                  "description",
                                  e.target.value,
                                )
                              }
                              className="w-full px-4 py-2.5 bg-black/50 border border-red-500/30 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                            />
                          </div>
                          {formData.candidates.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeCandidate(index)}
                              className="p-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                        {index === 0 && (
                          <div className="absolute -top-2 -left-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                            {index + 1}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {formData.candidates.length < 2 && (
                    <p className="mt-2 text-sm text-red-400">
                      ⚠️ Please add at least 2 candidates
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-red-500/20 bg-black/30">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-white/60 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  loading ||
                  formData.candidates.filter((c) => c.name.trim()).length < 2
                }
                className="px-6 py-2.5 text-sm font-medium text-white bg-linear-to-r from-red-500 to-red-700 rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin"></div>
                    Saving...
                  </div>
                ) : poll ? (
                  "Update Poll"
                ) : (
                  "Create Poll"
                )}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default PollModal;
