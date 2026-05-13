import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import {
  HomeIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  BuildingStorefrontIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  BellIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "Users", href: "/users", icon: UsersIcon },
  { name: "Polls", href: "/polls", icon: ClipboardDocumentListIcon },
  {
    name: "B2B",
    icon: BuildingStorefrontIcon,
    submenu: [
      { name: "Overview", href: "/b2b" },
      { name: "Data Requests", href: "/b2b/requests" },
      { name: "Subscriptions", href: "/b2b/subscriptions" },
      { name: "Payments", href: "/b2b/payments" },
      { name: "B2B Users", href: "/b2b/users" },
      { name: "Data Categories", href: "/b2b/categories" },
    ],
  },
  { name: "Analytics", href: "/analytics", icon: ChartBarIcon },
  { name: "Revenue", href: "/revenue", icon: CurrencyDollarIcon },
  { name: "Subscriptions", href: "/subscriptions", icon: DocumentTextIcon },
  { name: "Activity Logs", href: "/activity-logs", icon: BellIcon },
  { name: "Settings", href: "/settings", icon: Cog6ToothIcon },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [openSubmenu, setOpenSubmenu] = useState(null);

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

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleSubmenu = (menuName) => {
    if (openSubmenu === menuName) {
      setOpenSubmenu(null);
    } else {
      setOpenSubmenu(menuName);
    }
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
          className="absolute rounded-full w-96 h-96 bg-red-500/10 blur-3xl animate-blob"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            transition: "transform 0.3s ease-out",
          }}
        />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-red-600/5 blur-2xl animate-blob animation-delay-2000" />
        <div className="absolute rounded-full top-1/2 left-1/2 w-80 h-80 bg-white/5 blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Logo Section */}
      <div
        className={`relative z-10 p-5 py-0 border-b border-white/10 flex items-center ${collapsed ? "justify-center" : "justify-between"}`}
      >
        <div
          className={`flex w-44 items-center gap-2.5 ${collapsed ? "justify-center" : ""}`}
        >
          <img
            src="/logo-black.png"
            alt=""
          />
        </div>
        {/* {!collapsed && (
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-all duration-200"
          >
            <ChevronLeftIcon className="w-5 h-5 text-white/60" />
          </button>
        )} */}
      </div>

      {/* Expand Button (when collapsed) */}
      {collapsed && (
        <div className="relative z-10 flex justify-center mt-4">
          <button
            onClick={toggleSidebar}
            className="p-2 transition-all duration-200 rounded-lg hover:bg-red-500/20"
          >
            <ChevronRightIcon className="w-5 h-5 text-white/60 hover:text-red-400" />
          </button>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="relative z-10 flex-1 mt-8 px-3 space-y-1.5 overflow-y-auto">
        {navigation.map((item) => {
          const IconComponent = item.icon;
          const hasSubmenu = item.submenu && item.submenu.length > 0;
          const isSubmenuOpen = openSubmenu === item.name;

          if (hasSubmenu && !collapsed) {
            // Expanded mode with submenu
            return (
              <div key={item.name} className="space-y-1">
                <button
                  onClick={() => toggleSubmenu(item.name)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isSubmenuOpen
                      ? "bg-red-500/10 text-red-400"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className="w-5 h-5" />
                    <span>{item.name}</span>
                  </div>
                  <ChevronDownIcon
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isSubmenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isSubmenuOpen && (
                  <div className="pl-2 space-y-1 border-l ml-9 border-red-500/20">
                    {item.submenu.map((subItem) => (
                      <NavLink
                        key={subItem.name}
                        to={subItem.href}
                        className={({ isActive }) =>
                          `block px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                            isActive
                              ? "bg-red-500/10 text-red-400"
                              : "text-white/50 hover:text-white hover:bg-white/5"
                          }`
                        }
                      >
                        {subItem.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          } else if (hasSubmenu && collapsed) {
            // Collapsed mode - show icon only with tooltip
            return (
              <div key={item.name} className="relative">
                <NavLink
                  to="#"
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="relative flex items-center justify-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group text-white/60 hover:bg-white/5 hover:text-white"
                >
                  <IconComponent className="w-5 h-5" />
                </NavLink>
                {hoveredItem === item.name && (
                  <div className="absolute z-50 px-2 py-1 ml-2 text-xs text-white -translate-y-1/2 bg-gray-900 border rounded-md shadow-lg left-full top-1/2 whitespace-nowrap border-white/10">
                    {item.name}
                  </div>
                )}
              </div>
            );
          } else {
            // Regular menu item (no submenu)
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
                    {isActive && (
                      <div className="absolute inset-0 rounded-xl ring-1 ring-red-500/30"></div>
                    )}

                    <IconComponent
                      className={`h-5 w-5 transition-all duration-200 ${
                        collapsed ? "mx-auto" : ""
                      } ${hoveredItem === item.name ? "scale-110" : ""}`}
                    />
                    {!collapsed && <span>{item.name}</span>}

                    {collapsed && hoveredItem === item.name && (
                      <div className="absolute z-50 px-2 py-1 ml-2 text-xs text-white bg-gray-900 border rounded-md shadow-lg left-full whitespace-nowrap border-white/10">
                        {item.name}
                      </div>
                    )}

                    {isActive && collapsed && (
                      <div className="absolute left-0 w-0.5 h-6 bg-red-500 rounded-r-full"></div>
                    )}
                  </>
                )}
              </NavLink>
            );
          }
        })}
      </nav>

      {/* Bottom Section with Logout Button */}
      <div className="relative z-10 p-3 mt-auto border-t border-white/10">
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
          <div className="mt-4 text-center">
            <p className="text-[10px] text-white uppercase tracking-wider">
              Version 2.0.0
            </p>
            <p className="text-[10px] text-white/40 mt-1">
              © 2026 Voting Platform
            </p>
          </div>
        )}
        {collapsed && (
          <div className="mt-3 text-center">
            <p className="text-[8px] text-white/40">v2.0</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
