import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changePassword, clearError } from "../store/slices/authSlice";
import toast from "react-hot-toast";
import {
  UserCircleIcon,
  BellIcon,
  ShieldCheckIcon,
  PaintBrushIcon,
  ServerIcon,
} from "@heroicons/react/24/outline";

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("profile");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    loginAlerts: true,
    pollAlerts: false,
    weeklyDigest: true,
  });
  const [preferences, setPreferences] = useState({
    language: "en",
    theme: "dark",
    timezone: "Asia/Dhaka",
    dateFormat: "MM/DD/YYYY",
  });

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem("adminSettings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setNotificationSettings(parsed.notifications || notificationSettings);
      setPreferences(parsed.preferences || preferences);
    }
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const result = await dispatch(
      changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }),
    );

    if (!result.error) {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Password changed successfully");
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    // API call would go here
    toast.success("Profile updated successfully");
  };

  const saveSettings = () => {
    const settings = {
      notifications: notificationSettings,
      preferences: preferences,
    };
    localStorage.setItem("adminSettings", JSON.stringify(settings));
    toast.success("Settings saved successfully");
  };

  const tabs = [
    { id: "profile", name: "Profile", icon: UserCircleIcon },
    { id: "security", name: "Security", icon: ShieldCheckIcon },
    { id: "notifications", name: "Notifications", icon: BellIcon },
    { id: "preferences", name: "Preferences", icon: PaintBrushIcon },
    { id: "system", name: "System", icon: ServerIcon },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden bg-black border rounded-2xl border-red-500/20">
        <div className="absolute top-0 right-0 rounded-full w-80 h-80 bg-red-600/20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 rounded-full w-80 h-80 bg-red-500/10 blur-3xl"></div>

        <div className="relative z-10 p-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 rounded-full bg-gradient-to-b from-red-500 to-red-700"></div>
            <div>
              <h1 className="text-2xl font-bold text-white">Settings</h1>
              <p className="text-white/40 text-sm mt-0.5">
                Manage your account and system preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Container */}
      <div className="overflow-hidden bg-black border rounded-2xl border-red-500/20">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar Tabs */}
          <div className="w-full border-b md:w-64 bg-red-500/5 md:border-b-0 md:border-r border-red-500/10">
            <nav className="p-4 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-red-500/10 text-red-400"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <form onSubmit={handleProfileUpdate} className="space-y-5">
                <div>
                  <label className="block mb-1 text-sm font-medium text-white/60">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-black/50 border border-red-500/30 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-white/60">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-black/50 border border-red-500/30 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-white/60">
                    Role
                  </label>
                  <input
                    type="text"
                    value={user?.role || "Admin"}
                    disabled
                    className="w-full px-4 py-2.5 bg-black/30 border border-red-500/20 rounded-xl text-white/40 cursor-not-allowed"
                  />
                </div>
                <div className="pt-4">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-700 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300"
                  >
                    Update Profile
                  </button>
                </div>
              </form>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <form onSubmit={handlePasswordChange} className="space-y-5">
                <div className="p-4 mb-4 border bg-yellow-500/10 border-yellow-500/30 rounded-xl">
                  <p className="text-sm text-yellow-400">⚠️ Security Tips:</p>
                  <ul className="mt-2 space-y-1 text-xs text-white/40">
                    <li>• Use a strong password with at least 8 characters</li>
                    <li>• Include numbers, symbols, and uppercase letters</li>
                    <li>• Never share your password with anyone</li>
                  </ul>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-white/60">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-black/50 border border-red-500/30 rounded-xl text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-white/60">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-black/50 border border-red-500/30 rounded-xl text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-white/60">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-black/50 border border-red-500/30 rounded-xl text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-700 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 disabled:opacity-50"
                  >
                    {isLoading ? "Changing..." : "Change Password"}
                  </button>
                </div>
              </form>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-4">
                {[
                  {
                    key: "emailNotifications",
                    label: "Email Notifications",
                    description: "Receive email updates about your account",
                  },
                  {
                    key: "pushNotifications",
                    label: "Push Notifications",
                    description: "Get real-time alerts in your browser",
                  },
                  {
                    key: "loginAlerts",
                    label: "Login Alerts",
                    description:
                      "Get notified when someone logs into your account",
                  },
                  {
                    key: "pollAlerts",
                    label: "Poll Alerts",
                    description:
                      "Receive notifications about new polls and votes",
                  },
                  {
                    key: "weeklyDigest",
                    label: "Weekly Digest",
                    description: "Get a weekly summary of platform activity",
                  },
                ].map((setting) => (
                  <div
                    key={setting.key}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl"
                  >
                    <div>
                      <h4 className="font-medium text-white">
                        {setting.label}
                      </h4>
                      <p className="text-xs text-white/40">
                        {setting.description}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setNotificationSettings({
                          ...notificationSettings,
                          [setting.key]: !notificationSettings[setting.key],
                        })
                      }
                      className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${notificationSettings[setting.key] ? "bg-red-500" : "bg-white/20"}`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${notificationSettings[setting.key] ? "translate-x-7" : "translate-x-1"}`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <div className="space-y-5">
                <div>
                  <label className="block mb-1 text-sm font-medium text-white/60">
                    Language
                  </label>
                  <select
                    value={preferences.language}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        language: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-black/50 border border-red-500/30 rounded-xl text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="en">English</option>
                    <option value="bn">Bengali</option>
                    <option value="hi">Hindi</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-white/60">
                    Theme
                  </label>
                  <select
                    value={preferences.theme}
                    onChange={(e) =>
                      setPreferences({ ...preferences, theme: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-black/50 border border-red-500/30 rounded-xl text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="system">System Default</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-white/60">
                    Timezone
                  </label>
                  <select
                    value={preferences.timezone}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        timezone: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-black/50 border border-red-500/30 rounded-xl text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="Asia/Dhaka">Asia/Dhaka (GMT+6)</option>
                    <option value="Asia/Kolkata">
                      Asia/Kolkata (GMT+5:30)
                    </option>
                    <option value="America/New_York">
                      America/New York (GMT-5)
                    </option>
                    <option value="Europe/London">Europe/London (GMT+0)</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-white/60">
                    Date Format
                  </label>
                  <select
                    value={preferences.dateFormat}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        dateFormat: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-black/50 border border-red-500/30 rounded-xl text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            )}

            {/* System Tab */}
            {activeTab === "system" && (
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white">System Version</h4>
                      <p className="text-xs text-white/40">
                        Current platform version
                      </p>
                    </div>
                    <span className="px-3 py-1 text-sm text-red-400 rounded-lg bg-red-500/20">
                      v2.0.0
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white">Last Backup</h4>
                      <p className="text-xs text-white/40">
                        Database backup information
                      </p>
                    </div>
                    <span className="text-sm text-white/40">
                      May 5, 2026, 10:30 AM
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white">Cache Status</h4>
                      <p className="text-xs text-white/40">
                        Application cache information
                      </p>
                    </div>
                    <button className="px-3 py-1 text-sm transition-colors rounded-lg bg-white/10 text-white/60 hover:bg-white/20">
                      Clear Cache
                    </button>
                  </div>
                </div>
                <div className="p-4 border bg-yellow-500/10 border-yellow-500/30 rounded-xl">
                  <p className="text-sm text-yellow-400">
                    ⚠️ System Information
                  </p>
                  <div className="mt-2 space-y-1 text-xs text-white/40">
                    <p>• Node.js Version: v22.13.0</p>
                    <p>• MongoDB: Atlas Connected</p>
                    <p>• Uptime: 99.98%</p>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button for Notifications & Preferences */}
            {(activeTab === "notifications" || activeTab === "preferences") && (
              <div className="pt-4 mt-6 border-t border-red-500/20">
                <button
                  onClick={saveSettings}
                  className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-700 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300"
                >
                  Save Settings
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="overflow-hidden bg-black border rounded-2xl border-red-500/20">
        <div className="p-6 border-b border-red-500/20">
          <h3 className="text-lg font-semibold text-red-400">Danger Zone</h3>
          <p className="mt-1 text-sm text-white/40">Irreversible actions</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-white">Clear All Data</h4>
              <p className="text-xs text-white/40">
                Remove all platform data (cannot be undone)
              </p>
            </div>
            <button className="px-4 py-2 text-red-400 transition-colors bg-red-600/20 rounded-xl hover:bg-red-600/30">
              Clear Data
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-white">Delete Account</h4>
              <p className="text-xs text-white/40">
                Permanently delete your admin account
              </p>
            </div>
            <button className="px-4 py-2 text-red-400 transition-colors bg-red-600/20 rounded-xl hover:bg-red-600/30">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
