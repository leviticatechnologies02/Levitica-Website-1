import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useModal } from "../Admin/Modals/ModalContext";
import { useSidebarStore } from "./useSidebarStore";
import { useTheme } from "@/context/ThemeContext";
import {
  FaHome,
  FaBookOpen,
  FaVideo,
  FaUsers,
  FaLayerGroup,
  FaUserPlus,
  FaCreditCard,
  FaCog,
  FaCertificate,
} from "react-icons/fa";

const Sidebar = () => {
  const { isOpen, closeSidebar } = useSidebarStore();
  const { user } = useSelector((state) => state.auth);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const role = user?.role;
  const { modalType } = useModal();

  // Auto-close sidebar when screen resizes to mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        closeSidebar();
      }
    };
    window.addEventListener("resize", handleResize);
    // Also close on mount if already mobile
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [closeSidebar]);

  if (modalType) return null;

  const menu = [
    {
      label: "Dashboard",
      icon: <FaHome size={20} />,
      path: "/dashboard",
      roles: ["student", "admin", 'superadmin'],
    },
    {
      label: "Browse Courses",
      icon: <FaBookOpen size={20} />,
      path: "/dashboard/student/browsercourses",
      roles: ["student"],
    },
    {
      label: "My Courses",
      icon: <FaBookOpen size={20} />,
      path: "/dashboard/student/mycourses",
      roles: ["student"],
    },
    {
      label: "Live Sessions",
      icon: <FaVideo size={20} />,
      path: "/dashboard/student/live-session",
      roles: ["student"],
    },
    {
      label: "Settings",
      icon: <FaCog size={20} />,
      path: `/dashboard/student/settings`,
      roles: ["student"],
    },
    {
      label: "Students",
      icon: <FaUsers size={20} />,
      path: "/dashboard/admin/students",
      roles: ["admin", 'superadmin'],
    },
    {
      label: "Courses",
      icon: <FaBookOpen size={20} />,
      path: "/dashboard/admin/courses",
      roles: ["admin", 'superadmin'],
    },
    {
      label: "Batches",
      icon: <FaLayerGroup size={20} />,
      path: "/dashboard/admin/batchs",
      roles: ["admin", 'superadmin'],
    },
    {
      label: "Mentor",
      icon: <FaUsers size={20} />,
      path: "/dashboard/admin/mentors",
      roles: ["admin", 'superadmin'],
    },
    {
      label: "Live Classes",
      icon: <FaVideo size={20} />,
      path: "/dashboard/admin/zoom",
      roles: ["admin", 'superadmin'],
    },
    {
      label: "Internships",
      icon: <FaCertificate size={20} />,
      path: "/dashboard/admin/internships",
      roles: ["admin", 'superadmin'],
    },
    {
      label: "Payments",
      icon: <FaCreditCard size={20} />,
      path: "/dashboard/admin/payments",
      roles: ['superadmin'],
    },
    {
      label: "Enquiries",
      icon: <FaBookOpen size={20} />,
      path: "/dashboard/admin/enquiries",
      roles: ['superadmin'],
    },
    {
      label: "Add Admin",
      icon: <FaUserPlus size={20} />,
      path: "/dashboard/admin/addadmin",
      roles: ["superadmin"],
    },
    {
      label: "Settings",
      icon: <FaCog size={20} />,
      path: `/dashboard/admin/settings`,
      roles: ['admin', "superadmin"],
    },
  ].filter((item) => item.roles.includes(role));

  return (
    <>
      {isOpen && (
        <div
          onClick={() => useSidebarStore.getState().closeSidebar()}
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-30 transition-all duration-300"
        />
      )}
      <aside
        className={`
          fixed
          left-0
          top-[70px]
          h-[calc(100vh-70px)]
          z-40
          transition-all duration-300 ease-in-out

          /* Desktop */
          lg:translate-x-0
          ${isOpen ? "lg:w-64" : "lg:w-20"}

          /* Mobile */
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          w-64
'bg-primary border-r border-border text-white'
          ${isDark
            ? 'bg-gradient-to-b from-semidark via-semidark to-darklight border-r border-dark_border text-white'
            : 'bg-primary border-r border-border text-white'
          }

          shadow-property
          flex flex-col
          overflow-hidden
        `}
      >
        {/* Scrollable Navigation Area - Only this scrolls */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1.5 [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-transparent" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              onClick={() => {
                if (window.innerWidth < 1024) {
                  closeSidebar();
                }
              }}
              className={({ isActive }) => {
                const isDashboard = item.path === "/dashboard";

                const isCurrent = isDashboard
                  ? location.pathname === "/dashboard" ||
                  location.pathname === "/dashboard/student" ||
                  location.pathname === "/dashboard/admin"
                  : isActive;

                return `
                  group flex items-center gap-3
                  rounded-xl px-3 py-2
                  text-sm font-medium transition-all duration-200
                  ${isCurrent
                    ? isDark
                      ? "bg-primary/20 text-primary shadow-md"
                      : "bg-white/20 text-white shadow-md"
                    : isDark
                      ? "text-gray hover:bg-darklight hover:text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }
                `;
              }}
            >
              <span className={`
                flex items-center justify-center
                w-8 h-8
                rounded-lg
                shrink-0
                transition-all duration-200
                ${isDark
                  ? 'bg-darklight group-hover:bg-darklight/80'
                  : 'bg-white/10 group-hover:bg-white/20'
                }
              `}>
                {item.icon}
              </span>

              {isOpen && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        
      </aside>
    </>
  );
};

export default Sidebar;