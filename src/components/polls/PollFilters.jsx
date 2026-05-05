import React from "react";

const PollFilters = ({
  search = "",
  setSearch,
  category = "",
  setCategory,
  status = "",
  setStatus,
  isLoading = false,
}) => {
  const categories = [
    { value: "", label: "All Categories" },
    { value: "technology", label: "Technology" },
    { value: "sports", label: "Sports" },
    { value: "politics", label: "Politics" },
    { value: "entertainment", label: "Entertainment" },
    { value: "business", label: "Business" },
    { value: "education", label: "Education" },
    { value: "health", label: "Health" },
    { value: "other", label: "Other" },
  ];

  const statuses = [
    { value: "", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "ended", label: "Ended" },
    { value: "scheduled", label: "Scheduled" },
  ];

  return (
    <div className="bg-black rounded-2xl border border-red-500/20 p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search polls..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-black border border-red-500/30 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={isLoading}
          className="px-4 py-2 bg-black border border-red-500/30 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-40"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={isLoading}
          className="px-4 py-2 bg-black border border-red-500/30 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-40"
        >
          {statuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default PollFilters;
