import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchB2BCategories,
  createB2BCategory,
  updateB2BCategory,
  deleteB2BCategory,
} from "../../store/slices/b2bSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import {
  ArrowPathIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const B2BCategories = () => {
  const dispatch = useDispatch();
  const { b2bCategories, isLoading } = useSelector((state) => state.b2b);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    description: "",
    icon: "📋",
    color: "#ef4444",
    requiredPlan: "basic",
    sensitivity: "low",
    isActive: true,
  });

  useEffect(() => {
    dispatch(fetchB2BCategories());
  }, [dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchB2BCategories());
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name || "",
        displayName: category.displayName || "",
        description: category.description || "",
        icon: category.icon || "📋",
        color: category.color || "#ef4444",
        requiredPlan: category.requiredPlan || "basic",
        sensitivity: category.sensitivity || "low",
        isActive: category.isActive !== undefined ? category.isActive : true,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        displayName: "",
        description: "",
        icon: "📋",
        color: "#ef4444",
        requiredPlan: "basic",
        sensitivity: "low",
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.displayName) {
      toast.error("Category name and display name are required");
      return;
    }

    // Convert name to valid slug format
    const slugName = formData.name
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");

    const submitData = {
      ...formData,
      name: slugName,
    };

    try {
      if (editingCategory) {
        await dispatch(
          updateB2BCategory({ id: editingCategory._id, data: submitData }),
        ).unwrap();
        toast.success("Category updated successfully");
      } else {
        await dispatch(createB2BCategory(submitData)).unwrap();
        toast.success("Category created successfully");
      }
      setIsModalOpen(false);
      setFormData({
        name: "",
        displayName: "",
        description: "",
        icon: "📋",
        color: "#ef4444",
        requiredPlan: "basic",
        sensitivity: "low",
        isActive: true,
      });
      dispatch(fetchB2BCategories());
    } catch (error) {
      console.error("Failed to save category:", error);
      toast.error(error.message || "Failed to save category");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await dispatch(deleteB2BCategory(id)).unwrap();
        toast.success("Category deleted successfully");
        dispatch(fetchB2BCategories());
      } catch (error) {
        console.error("Failed to delete category:", error);
        toast.error(error.message || "Failed to delete category");
      }
    }
  };

  const getPlanBadgeColor = (plan) => {
    switch (plan) {
      case "premium":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "standard":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-green-500/20 text-green-400 border-green-500/30";
    }
  };

  const getSensitivityColor = (sensitivity) => {
    switch (sensitivity) {
      case "high":
        return "bg-red-500/20 text-red-400";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400";
      default:
        return "bg-green-500/20 text-green-400";
    }
  };

  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");
  };

  if (isLoading && !b2bCategories.length) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden bg-black border rounded-2xl border-red-500/20">
        <div className="absolute top-0 right-0 rounded-full w-80 h-80 bg-red-600/20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 rounded-full w-80 h-80 bg-red-500/10 blur-3xl"></div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 rounded-full bg-gradient-to-b from-red-500 to-red-700"></div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Data Categories
                </h1>
                <p className="text-white/40 text-sm mt-0.5">
                  Manage B2B data categories for subscription plans
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 text-red-400 transition-all duration-200 bg-black border border-red-500/30 rounded-xl hover:text-red-300 hover:bg-red-500/10"
            >
              <ArrowPathIcon
                className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`}
              />
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all duration-300 bg-gradient-to-r from-red-500 to-red-700 rounded-xl hover:shadow-lg hover:shadow-red-500/25"
            >
              <PlusIcon className="w-5 h-5" />
              Add Category
            </button>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {b2bCategories.length === 0 ? (
          <div className="py-16 text-center border col-span-full bg-black/40 rounded-2xl border-red-500/20">
            <div className="mb-4 text-7xl">📦</div>
            <h3 className="text-xl font-medium text-white">
              No categories found
            </h3>
            <p className="mt-2 text-white/40">
              Create your first data category
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="mt-6 px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-700 rounded-xl text-white text-sm font-medium hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300"
            >
              Add Category
            </button>
          </div>
        ) : (
          b2bCategories.map((category) => (
            <div
              key={category._id}
              className="overflow-hidden transition-all duration-300 border group bg-gradient-to-br from-gray-900 to-black rounded-2xl border-red-500/20 hover:border-red-500/50 hover:shadow-xl hover:shadow-red-500/5"
            >
              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center w-12 h-12 text-2xl shadow-lg rounded-xl"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      {category.icon || "📋"}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        {category.displayName}
                      </h3>
                      <p className="text-xs text-white/40">{category.name}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 transition-opacity opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => handleOpenModal(category)}
                      className="p-1.5 text-white/50 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="p-1.5 text-white/50 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="mb-4 text-sm text-white/60 line-clamp-2">
                  {category.description || "No description provided"}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getPlanBadgeColor(category.requiredPlan)}`}
                  >
                    {category.requiredPlan || "basic"}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getSensitivityColor(category.sensitivity)}`}
                  >
                    {category.sensitivity || "low"} sensitivity
                  </span>
                  {!category.isActive && (
                    <span className="px-2 py-1 text-xs font-semibold text-gray-400 rounded-full bg-gray-500/20">
                      Inactive
                    </span>
                  )}
                </div>

                {/* Color Preview */}
                <div className="flex items-center gap-2 pt-3 border-t border-red-500/10">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-xs text-white/40">
                    {category.color}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gradient-to-b from-gray-900 to-black border border-red-500/30 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 bg-gradient-to-r from-red-600 to-red-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block mb-1 text-sm font-medium text-white/60">
                  Category Name (slug) *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: generateSlug(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2.5 bg-black/50 border border-red-500/30 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  placeholder="e.g., voter_demographics"
                  required
                />
                <p className="mt-1 text-xs text-white/30">
                  Slug:{" "}
                  <span className="text-red-400">
                    {formData.name || "will_be_generated"}
                  </span>
                </p>
              </div>

              {/* Display Name */}
              <div>
                <label className="block mb-1 text-sm font-medium text-white/60">
                  Display Name *
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) =>
                    setFormData({ ...formData, displayName: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-black/50 border border-red-500/30 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  placeholder="e.g., Voter Demographics"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block mb-1 text-sm font-medium text-white/60">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-black/50 border border-red-500/30 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 min-h-[80px]"
                  placeholder="Describe what this data category includes"
                />
              </div>

              {/* Icon & Color */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-white/60">
                    Icon (Emoji)
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-black/50 border border-red-500/30 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    placeholder="📋"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-white/60">
                    Color (Hex)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                      className="border cursor-pointer w-14 h-11 bg-black/50 border-red-500/30 rounded-xl"
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                      className="flex-1 px-4 py-2.5 bg-black/50 border border-red-500/30 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      placeholder="#ef4444"
                    />
                  </div>
                </div>
              </div>

              {/* Required Plan */}
              <div>
                <label className="block mb-1 text-sm font-medium text-white/60">
                  Required Plan
                </label>
                <select
                  value={formData.requiredPlan}
                  onChange={(e) =>
                    setFormData({ ...formData, requiredPlan: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-black/50 border border-red-500/30 rounded-xl text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                >
                  <option value="basic">Basic Plan</option>
                  <option value="standard">Standard Plan</option>
                  <option value="premium">Premium Plan</option>
                </select>
              </div>

              {/* Sensitivity */}
              <div>
                <label className="block mb-1 text-sm font-medium text-white/60">
                  Data Sensitivity
                </label>
                <select
                  value={formData.sensitivity}
                  onChange={(e) =>
                    setFormData({ ...formData, sensitivity: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-black/50 border border-red-500/30 rounded-xl text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                >
                  <option value="low">Low - Public information</option>
                  <option value="medium">Medium - Aggregated data</option>
                  <option value="high">High - Individual user data</option>
                </select>
              </div>

              {/* Active Status */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-4 h-4 accent-red-500"
                  />
                  <span className="text-sm text-white/60">
                    Category is active
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-red-500/20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium transition-colors text-white/60 bg-white/10 rounded-xl hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-sm font-medium text-white transition-all duration-200 bg-gradient-to-r from-red-500 to-red-700 rounded-xl hover:shadow-lg hover:shadow-red-500/25"
                >
                  {editingCategory ? "Update Category" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default B2BCategories;
