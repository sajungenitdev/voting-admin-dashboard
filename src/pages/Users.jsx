import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import {
  fetchUsers,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  clearError,
} from "../store/slices/userSlice";
import { useDebounce } from "../hooks/useDebounce";
import UserModal from "../components/users/UserModal";
import ViewUserModal from "../components/users/ViewUserModal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Pagination from "../components/common/Pagination";
import SearchBar from "../components/common/SearchBar";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  DocumentArrowDownIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { RiRefreshLine } from "react-icons/ri";

const Users = () => {
  const dispatch = useDispatch();
  const { users, pagination, isLoading, error } = useSelector(
    (state) => state.users,
  );
  // Local state for filters
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Debounced search
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    userId: null,
  });

  // Fetch users when filters change
  useEffect(() => {
    const filters = {
      page,
      limit: 20,
      search: debouncedSearch,
      role: roleFilter,
    };
    dispatch(fetchUsers(filters));
  }, [dispatch, page, debouncedSearch, roleFilter]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleRefresh = () => {
    const filters = {
      page,
      limit: 20,
      search: debouncedSearch,
      role: roleFilter,
    };
    dispatch(fetchUsers(filters));
  };

  // CSV Download for Non-Admin Users Only
  const downloadUsersCSV = () => {
    const regularUsers = users.filter((user) => user.role !== "admin");

    if (regularUsers.length === 0) {
      alert("No regular users found to export");
      return;
    }

    const headers = [
      "ID",
      "Name",
      "Email",
      "Role",
      "Verified",
      "Joined Date",
      "Last Login",
    ];

    const csvRows = regularUsers.map((user) => [
      user._id,
      user.name,
      user.email,
      user.role,
      user.isVerified ? "Verified" : "Pending",
      user.isActive ? "Active" : "Inactive",
      format(new Date(user.createdAt), "dd MMM yyyy"),
      user.lastLogin
        ? format(new Date(user.lastLogin), "dd MMM yyyy, h:mm a")
        : "Never",
    ]);

    const csvContent = [
      headers.join(","),
      ...csvRows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `regular_users_${format(new Date(), "yyyy-MM-dd")}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRoleChange = useCallback(
    async (userId, role) => {
      if (actionLoading) return;
      setActionLoading(true);
      try {
        await dispatch(updateUserRole({ id: userId, role })).unwrap();
      } finally {
        setActionLoading(false);
      }
    },
    [dispatch, actionLoading],
  );

  const handleStatusToggle = useCallback(
    async (userId, currentStatus) => {
      if (actionLoading) return;
      setActionLoading(true);
      try {
        await dispatch(
          toggleUserStatus({ id: userId, isActive: !currentStatus }),
        ).unwrap();
      } finally {
        setActionLoading(false);
      }
    },
    [dispatch, actionLoading],
  );

  const handleDelete = useCallback(async () => {
    if (confirmDialog.userId && !actionLoading) {
      setActionLoading(true);
      try {
        await dispatch(deleteUser(confirmDialog.userId)).unwrap();
        setConfirmDialog({ isOpen: false, userId: null });
      } finally {
        setActionLoading(false);
      }
    }
  }, [dispatch, confirmDialog.userId, actionLoading]);

  const getRoleBadgeClass = (role) => {
    const styles = {
      admin: "bg-red-500/20 text-red-400 border border-red-500/30",
      moderator: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
      user: "bg-green-500/20 text-green-400 border border-green-500/30",
    };
    return styles[role] || "bg-white/10 text-white/60";
  };

  const regularUsersCount = users.filter(
    (user) => user.role !== "admin",
  ).length;

  // Loading state
  if (isLoading && users.length === 0) {
    return <LoadingSpinner />;
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="max-w-md p-8 text-center border bg-red-500/10 border-red-500/30 rounded-2xl">
          <div className="mb-4 text-5xl text-red-400">⚠️</div>
          <h3 className="mb-2 text-lg font-semibold text-white">
            Error Loading Users
          </h3>
          <p className="mb-4 text-white/60">{error}</p>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 mx-auto text-red-400 transition-colors rounded-lg bg-red-500/20 hover:bg-red-500/30"
          >
            <RiRefreshLine className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
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
              <div className="w-2 h-8 rounded-full bg-linear-to-b from-red-500 to-red-700"></div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Users Management
                </h1>
                <p className="text-white/40 text-sm mt-0.5">
                  Manage all platform users
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={downloadUsersCSV}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all duration-300 bg-linear-to-r from-green-500 to-green-700 rounded-xl hover:shadow-lg hover:shadow-green-500/25 group"
              title="Download Regular Users CSV"
            >
              <DocumentArrowDownIcon className="w-5 h-5" />
              Download Users ({regularUsersCount})
            </button>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 transition-all duration-200 border bg-white/5 border-red-500/30 rounded-xl text-white/60 hover:text-white hover:bg-red-500/10 disabled:opacity-50"
              title="Refresh"
            >
              <RiRefreshLine
                className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`}
              />
            </button>
            <button
              onClick={() => {
                setSelectedUser(null);
                setIsModalOpen(true);
              }}
              disabled={actionLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all duration-300 bg-linear-to-r from-red-500 to-red-700 rounded-xl hover:shadow-lg hover:shadow-red-500/25 group disabled:opacity-50"
            >
              <PlusIcon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
              Add New User
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 bg-black border rounded-2xl border-red-500/20">
        <div className="flex flex-col gap-4 sm:flex-row">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search users..."
            className="flex-1"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 text-sm text-white bg-black border cursor-pointer border-red-500/30 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="moderator">Moderator</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden bg-black border rounded-2xl border-red-500/20">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-red-500/10">
            <thead>
              <tr className="bg-red-500/5">
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-red-400 uppercase">
                  User
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-red-400 uppercase">
                  Email
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-red-400 uppercase">
                  Role
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-red-400 uppercase">
                  Verified
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-red-400 uppercase">
                  Joined
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-red-400 uppercase">
                  Last Login
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-right text-red-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-500/10">
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-white/40"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="transition-colors duration-200 hover:bg-red-500/5"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 shadow-lg bg-linear-to-br from-red-500 to-red-700 rounded-xl shadow-red-500/20">
                          <span className="text-sm font-medium text-white">
                            {user.name?.charAt(0) || "U"}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">
                            {user.name}
                          </div>
                          <div className="text-xs text-white/40">
                            ID: {user._id?.slice(-8)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-white/60">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        disabled={actionLoading}
                        className={`text-xs font-semibold rounded-lg px-3 py-1.5 border-0 focus:ring-2 focus:ring-red-500 cursor-pointer ${getRoleBadgeClass(user.role)}`}
                      >
                        <option value="user" className="bg-black">
                          User
                        </option>
                        <option value="moderator" className="bg-black">
                          Moderator
                        </option>
                        <option value="admin" className="bg-black">
                          Admin
                        </option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isVerified
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                        }`}
                      >
                        {user.isVerified ? "Verified" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-white/40">
                      {format(new Date(user.createdAt), "dd MMM yyyy")}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-white/40">
                      {user.lastLogin
                        ? format(
                            new Date(user.lastLogin),
                            "dd MMM yyyy, h:mm a",
                          )
                        : "Never"}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          setViewingUser(user);
                          setIsViewModalOpen(true);
                        }}
                        disabled={actionLoading}
                        className="p-2 mr-1 transition-all duration-200 rounded-lg text-white/60 hover:text-blue-400 hover:bg-blue-500/10 disabled:opacity-50"
                        title="View User Details"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setIsModalOpen(true);
                        }}
                        disabled={actionLoading}
                        className="p-2 mr-1 transition-all duration-200 rounded-lg text-white/60 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                        title="Edit User"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() =>
                          setConfirmDialog({ isOpen: true, userId: user._id })
                        }
                        disabled={actionLoading}
                        className="p-2 transition-all duration-200 rounded-lg text-white/60 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                        title="Delete User"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="p-4 bg-black border rounded-2xl border-red-500/20">
          <Pagination
            currentPage={page}
            totalPages={pagination.pages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Modals */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onSuccess={() => {
          const filters = {
            page,
            limit: 20,
            search: debouncedSearch,
            role: roleFilter,
          };
          dispatch(fetchUsers(filters));
        }}
      />
      <ViewUserModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        user={viewingUser}
      />
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, userId: null })}
        onConfirm={handleDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
      />
    </div>
  );
};

export default Users;
