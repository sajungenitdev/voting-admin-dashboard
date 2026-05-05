import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import {
  HomeIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  BuildingStorefrontIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "Users", href: "/users", icon: UsersIcon },
  { name: "Polls", href: "/polls", icon: ClipboardDocumentListIcon },
  { name: "Comments", href: "/comments", icon: ChatBubbleLeftRightIcon },
  { name: "B2B", href: "/b2b", icon: BuildingStorefrontIcon },
  { name: "Analytics", href: "/analytics", icon: ChartBarIcon },
  { name: "Settings", href: "/settings", icon: Cog6ToothIcon },
];

const Sidebar = ({ collapsed }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  return (
    <div
      className={`relative bg-black text-white flex flex-col shadow-2xl transition-all duration-300 ease-in-out overflow-hidden ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-blob"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            transition: "transform 0.3s ease-out",
          }}
        />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-2xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Logo Section */}
      <div
        className={`relative z-10 p-5 border-b border-white/10 flex items-center ${collapsed ? "justify-center" : "justify-between"}`}
      >
        <div
          className={`flex items-center gap-2.5 ${collapsed ? "justify-center" : ""}`}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
            <span className="text-xl">🗳️</span>
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-lg tracking-tight text-white">
                Voting Panel
              </h1>
              <p className="text-xs text-white/40">Admin Dashboard</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="relative z-10 flex-1 mt-8 px-3 space-y-1.5">
        {navigation.map((item) => {
          const IconComponent = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              onMouseEnter={() => setHoveredItem(item.name)}
              onMouseLeave={() => setHoveredItem(null)}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-red-500/10 text-red-400"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                } ${collapsed ? "justify-center" : ""}`
              }
              title={collapsed ? item.name : ""}
            >
              {({ isActive }) => (
                <>
                  {/* Animated border on active */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl ring-1 ring-red-500/30"></div>
                  )}

                  <IconComponent
                    className={`h-5 w-5 transition-all duration-200 ${
                      collapsed ? "mx-auto" : ""
                    } ${hoveredItem === item.name ? "scale-110" : ""}`}
                  />
                  {!collapsed && <span>{item.name}</span>}

                  {/* Tooltip for collapsed mode */}
                  {collapsed && hoveredItem === item.name && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md shadow-lg whitespace-nowrap z-50 border border-white/10">
                      {item.name}
                    </div>
                  )}

                  {/* Active indicator dot */}
                  {isActive && collapsed && (
                    <div className="absolute left-0 w-0.5 h-6 bg-red-500 rounded-r-full"></div>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section with Logout Button */}
      <div className="relative z-10 p-3 border-t border-white/10 mt-auto">
        <button
          onClick={handleLogout}
          className={`flex items-center cursor-pointer gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 w-full text-red-400 hover:bg-red-500/10 hover:text-red-300 group ${
            collapsed ? "justify-center" : ""
          }`}
          title={collapsed ? "Logout" : ""}
        >
          <ArrowRightOnRectangleIcon
            className={`h-5 w-5 transition-all duration-200 ${collapsed ? "mx-auto" : ""} group-hover:scale-110`}
          />
          {!collapsed && <span>Logout</span>}
        </button>

        {/* Version Info */}
        {!collapsed && (
          <div className="text-center mt-4">
            <p className="text-[10px] text-white uppercase tracking-wider">
              Version 1.0.0
            </p>
            <p className="text-[10px] text-white mt-1">
              © 2026 Voting Platform
            </p>
          </div>
        )}
        {collapsed && (
          <div className="text-center mt-3">
            <p className="text-[8px] text-white">v2.0</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
