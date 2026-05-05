import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useDispatch } from "react-redux";
import {
  updateUserRole,
  toggleUserStatus,
  createUser,
} from "../../store/slices/userSlice";
import toast from "react-hot-toast";

const UserModal = ({ isOpen, onClose, user, onSuccess }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // Initialize form data based on user prop
  const [formData, setFormData] = useState(() => {
    if (user) {
      return {
        name: user.name || "",
        email: user.email || "",
        password: "",
        role: user.role || "user",
        isActive: user.isActive !== undefined ? user.isActive : true,
      };
    }
    return {
      name: "",
      email: "",
      password: "",
      role: "user",
      isActive: true,
    };
  });

  // Reset form when modal opens or user changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    if (isOpen) {
      if (user) {
        setFormData({
          name: user.name || "",
          email: user.email || "",
          password: "",
          role: user.role || "user",
          isActive: user.isActive !== undefined ? user.isActive : true,
        });
      } else {
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "user",
          isActive: true,
        });
      }
    }
  }, [isOpen, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (user) {
        // Update existing user
        if (formData.role !== user.role) {
          await dispatch(
            updateUserRole({ id: user._id, role: formData.role }),
          ).unwrap();
        }
        if (formData.isActive !== user.isActive) {
          await dispatch(
            toggleUserStatus({ id: user._id, isActive: formData.isActive }),
          ).unwrap();
        }
        toast.success("User updated successfully");
      } else {
        // Create new user
        const userData = {
          name: formData.name,
          email: formData.email,
          password: formData.password || "Default123!",
          role: formData.role,
          isVerified: true,
          isActive: formData.isActive,
        };

        console.log("About to create user with data:", userData);
        await dispatch(createUser(userData)).unwrap();
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save user:", error);
      toast.error(error || "Failed to save user");
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      value: "user",
      label: "User",
      color: "bg-green-500/20 text-green-400 border-green-500/30",
    },
    {
      value: "moderator",
      label: "Moderator",
      color: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    },
    {
      value: "admin",
      label: "Admin",
      color: "bg-red-500/20 text-red-400 border-red-500/30",
    },
  ];

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <Dialog.Panel className="w-full max-w-md bg-black border shadow-2xl border-red-500/30 rounded-2xl">
          <div className="flex items-center justify-between p-6 border-b border-red-500/20">
            <Dialog.Title className="text-xl font-semibold text-white">
              {user ? "Edit User" : "Add New User"}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="transition-colors text-white/40 hover:text-white"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Name */}
            <div>
              <label className="block mb-1 text-sm font-medium text-white/60">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 text-white transition-all bg-black border border-red-500/30 rounded-xl placeholder-white/30 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                placeholder="Enter full name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 text-sm font-medium text-white/60">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 text-white transition-all bg-black border border-red-500/30 rounded-xl placeholder-white/30 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                placeholder="Enter email address"
                required
              />
            </div>

            {/* Password (only for new user) */}
            {!user && (
              <div>
                <label className="block mb-1 text-sm font-medium text-white/60">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-2 text-white transition-all bg-black border border-red-500/30 rounded-xl placeholder-white/30 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  placeholder="Leave blank for default password"
                />
                <p className="mt-1 text-xs text-white/30">
                  Default password: Default123!
                </p>
              </div>
            )}

            {/* Role */}
            <div>
              <label className="block mb-1 text-sm font-medium text-white/60">
                Role *
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full px-4 py-2 text-white bg-black border cursor-pointer border-red-500/30 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              >
                {roles.map((role) => (
                  <option
                    key={role.value}
                    value={role.value}
                    className="bg-black"
                  >
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block mb-1 text-sm font-medium text-white/60">
                Status
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.isActive === true}
                    onChange={() =>
                      setFormData({ ...formData, isActive: true })
                    }
                    className="w-4 h-4 accent-red-500"
                  />
                  <span className="text-sm text-white/60">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.isActive === false}
                    onChange={() =>
                      setFormData({ ...formData, isActive: false })
                    }
                    className="w-4 h-4 accent-red-500"
                  />
                  <span className="text-sm text-white/60">Inactive</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-red-500/20">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium transition-colors text-white/60 bg-white/10 rounded-xl hover:bg-white/20"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white transition-all duration-200 bg-linear-to-r from-red-500 to-red-700 rounded-xl hover:shadow-lg hover:shadow-red-500/25 disabled:opacity-50"
              >
                {loading ? "Saving..." : user ? "Update User" : "Create User"}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default UserModal;
