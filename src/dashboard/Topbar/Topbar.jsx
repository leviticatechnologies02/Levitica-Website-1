import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "@/features/authSlice";
import CartIcon from "@/dashboard/Student/Cart/CartIcon";
import {
  FiMenu,
  FiChevronDown,
  FiLogOut,
  FiSun,
  FiMoon,
  FiUser,
  FiShield,
  FiSettings,
  FiMail,
} from "react-icons/fi";
import { useSidebarStore } from "@/dashboard/Sidebar/useSidebarStore";
import { useTheme } from "@/context/ThemeContext";

const Topbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { toggleSidebar } = useSidebarStore();
  const { theme, toggleTheme } = useTheme();

  // Close dropdown on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  // Determine user settings link based on role
  const getSettingsPath = () => {
    switch (user?.role) {
      case "mentor":
        return "/dashboard/mentor/settings";
      case "student":
        return "/dashboard/student/settings";
      case "admin":
      case "superadmin":
      default:
        return "/dashboard/admin/settings";
    }
  };

  // Format display role name
  const getRoleBadge = () => {
    switch (user?.role) {
      case "superadmin":
        return {
          label: "Super Admin",
          className:
            "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20",
        };
      case "admin":
        return {
          label: "Administrator",
          className:
            "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
        };
      case "mentor":
        return {
          label: "Instructor / Mentor",
          className:
            "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20",
        };
      case "student":
      default:
        return {
          label: "Student",
          className:
            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
        };
    }
  };

  const roleBadge = getRoleBadge();

  return (
    <header
      className={`
        fixed top-0 left-0 w-full
        h-[70px]
        backdrop-blur-md
        flex items-center justify-between
        px-4 md:px-6
        z-50
        transition-all duration-300

        bg-white dark:bg-darklight
        text-midnight_text dark:text-white

        border-b border-border dark:border-dark_border
        shadow-property
      `}
    >
      {/* LEFT */}
      <div className="flex items-center gap-3">
        {/* Sidebar Toggle */}
        <button
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
          className="
            p-2 rounded-lg
            transition-colors
            hover:bg-lightgray
            dark:hover:bg-semidark
            cursor-pointer
          "
        >
          <FiMenu size={22} />
        </button>

        {/* Logo */}
        <img
          src="/img/leviticalogo.png"
          alt="Levitica Logo"
          className="h-10 md:h-11 object-contain rounded-md"
        />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        {user?.role === "student" && <CartIcon />}

        {/* THEME SWITCH */}
        <button
          onClick={toggleTheme}
          className="
            p-2 rounded-lg
            flex items-center justify-center
            transition-all duration-200
            cursor-pointer

            bg-light hover:bg-lightgray
            text-midnight_text

            dark:bg-semidark dark:text-yellow-400 dark:hover:bg-darklight
          "
          title="Toggle Theme"
        >
          {theme === "light" ? <FiMoon size={20} /> : <FiSun size={20} />}
        </button>

        {/* USER MENU CONTAINER */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-haspopup="true"
            className="flex items-center gap-2 hover:opacity-85 transition p-1 rounded-xl cursor-pointer select-none"
          >
            <div
              className="
                w-9 h-9 rounded-full overflow-hidden
                flex items-center justify-center
                bg-primary text-white font-bold text-sm
                shadow-sm ring-2 ring-primary/20
              "
            >
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user?.name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{user?.name?.[0]?.toUpperCase() || "U"}</span>
              )}
            </div>

            <FiChevronDown
              size={14}
              className={`transition-transform duration-200 text-gray ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* DROPDOWN */}
          {open && (
            <div
              className="
                absolute top-12 right-0
                w-64 sm:w-72
                rounded-2xl
                border border-border dark:border-dark_border
                bg-white dark:bg-semidark
                shadow-2xl
                overflow-hidden
                z-50
                animate-in fade-in duration-150
              "
            >
              {/* User Details Header */}
              <div className="p-4 border-b border-border/60 dark:border-dark_border/60 bg-slate-50/60 dark:bg-darklight/40">
                <div className="flex items-center gap-3">
                  <div
                    className="
                      w-11 h-11 rounded-full overflow-hidden
                      flex items-center justify-center shrink-0
                      bg-primary text-white font-bold text-base
                      shadow-sm ring-2 ring-primary/20
                    "
                  >
                    {user?.image ? (
                      <img
                        src={user.image}
                        alt={user?.name || "User"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{user?.name?.[0]?.toUpperCase() || "U"}</span>
                    )}
                  </div>

                  <div className="overflow-hidden flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-midnight_text dark:text-white truncate">
                      {user?.name || "User Profile"}
                    </h4>

                    <p
                      className="text-xs text-gray truncate mt-0.5 flex items-center gap-1"
                      title={user?.email}
                    >
                      <FiMail size={12} className="shrink-0 text-gray/70" />
                      <span className="truncate">{user?.email || "No email available"}</span>
                    </p>

                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${roleBadge.className}`}
                      >
                        <FiShield className="inline mr-1" size={10} />
                        {roleBadge.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="p-2 space-y-0.5">
                <button
                  onClick={() => {
                    navigate(getSettingsPath());
                    setOpen(false);
                  }}
                  className="
                    flex items-center gap-2.5
                    px-3 py-2.5 w-full text-left rounded-xl
                    text-xs font-semibold
                    text-midnight_text dark:text-slate-200
                    hover:bg-slate-100 dark:hover:bg-white/5
                    transition-colors cursor-pointer
                  "
                >
                  <FiSettings size={15} className="text-primary" />
                  <span>Account Settings</span>
                </button>
              </div>

              {/* Divider */}
              <div className="border-t border-border/60 dark:border-dark_border/60" />

              {/* Logout Button */}
              <div className="p-2">
                <button
                  onClick={() => {
                    dispatch(logout());
                    navigate("/login");
                    setOpen(false);
                  }}
                  className="
                    flex items-center gap-2.5
                    px-3 py-2.5 w-full text-left rounded-xl
                    text-xs font-semibold
                    text-rose-600 dark:text-rose-400
                    hover:bg-rose-50 dark:hover:bg-rose-500/10
                    transition-colors cursor-pointer
                  "
                >
                  <FiLogOut size={15} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;