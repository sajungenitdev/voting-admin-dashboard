import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  ChevronDoubleRightIcon,
  ChevronDoubleLeftIcon,
  BellIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const Header = ({ sidebarCollapsed, setSidebarCollapsed }) => {
  const { user } = useSelector((state) => state.auth);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const notifications = [
    { id: 1, title: "New user registered", time: "2 min ago", read: false },
    { id: 2, title: 'Poll "Best Language" ended', time: "1 hour ago", read: false },
    { id: 3, title: "New comment on your poll", time: "3 hours ago", read: true },
    { id: 4, title: "B2B subscription renewed", time: "5 hours ago", read: true },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-black border-b border-white/10">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left section - Sidebar Toggle & Welcome */}
        <div className="flex items-center gap-4">
          {/* Sidebar Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 group"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? (
              <ChevronDoubleRightIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
            ) : (
              <ChevronDoubleLeftIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
            )}
          </button>

          {/* Welcome Text */}
          <div className="hidden md:block">
            <h2 className="text-lg font-semibold text-white">
              Welcome back, {user?.name || "Admin"}!
            </h2>
            <p className="text-xs text-white/40">
              Here's what's happening today
            </p>
          </div>
        </div>

        {/* Center section - Search Bar (optional) */}
        <div className="hidden lg:block flex-1 max-w-md mx-8">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
            />
          </div>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <BellIcon className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-black border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="p-3 border-b border-white/10 bg-white/5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">Notifications</h3>
                    <button className="text-xs text-red-400 hover:text-red-300">
                      Mark all as read
                    </button>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 hover:bg-white/5 cursor-pointer transition-colors ${
                        !notif.read ? "bg-red-500/5 border-l-2 border-red-500" : ""
                      }`}
                    >
                      <p className="text-sm text-white/80">{notif.title}</p>
                      <p className="text-xs text-white/40 mt-1">{notif.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Avatar & Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-1 rounded-lg hover:bg-white/10 transition-all duration-200"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-lg shadow-red-500/20">
                <span className="text-white text-sm font-medium">
                  {user?.name?.charAt(0) || "A"}
                </span>
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-white">{user?.name || "Admin"}</p>
                <p className="text-xs text-white/40">Administrator</p>
              </div>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-black border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="p-4 border-b border-white/10 bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.name?.charAt(0) || "A"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{user?.name || "Admin"}</p>
                      <p className="text-xs text-white/40">{user?.email || "admin@voting.com"}</p>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <button className="w-full text-left px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3">
                    <UserCircleIcon className="h-4 w-4" />
                    Profile Settings
                  </button>
                  <button className="w-full text-left px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3">
                    ⚙️
                    <span>Account Settings</span>
                  </button>
                  <button className="w-full text-left px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3">
                    🔒
                    <span>Security</span>
                  </button>
                </div>
                <div className="border-t border-white/10 py-2">
                  <button className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center gap-3">
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;