import { LogOut, ShieldAlert, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout } from '@/features/authSlice';
import { useDispatch } from "react-redux";
import { FaRupeeSign } from "react-icons/fa6";
import { useTheme } from '@/context/ThemeContext';

const ProfileSidebar = ({ user, activeTab, onTabChange, isDark: isDarkProp, menuItems: customMenuItems }) => {
  const { theme } = useTheme();
  const isDark = isDarkProp !== undefined ? isDarkProp : theme === 'dark';
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const defaultMenuItems = [
    { id: "profile", label: "Profile", icon: <User size={18} /> },
    { id: "payments", label: "Payments History", icon: <FaRupeeSign size={18} /> },
    { id: "security", label: "Security", icon: <ShieldAlert size={18} /> },
  ];

  const menuItems = customMenuItems || defaultMenuItems;

  return (
    <aside className={`w-full flex flex-col rounded-2xl shadow-sm border ${
      isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
    }`}>

      {/* Profile Header */}
      <div className={`relative w-full h-40 rounded-t-2xl overflow-hidden bg-gradient-to-br ${
        isDark ? 'from-slate-700 to-slate-600' : 'from-blue-50 to-white'
      }`}>

        {user?.image ? (
          <img
            src={user.image}
            alt={user?.name || "User"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-5xl font-semibold">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )}

        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* User Info */}
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-lg font-semibold">
            {user?.name || "User"}
          </h2>

          <span className="inline-block mt-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/20">
            {user?.role || "Student"}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                w-full
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-xl
                text-sm
                font-medium
                transition-all
                duration-200
                ${isActive
                  ? isDark
                    ? "btn-primary shadow-sm"
                    : "btn-primary shadow-sm"
                  : isDark
                    ? "text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                    : "text-gray-600 hover:bg-gray-100 hover:text-black"
                }
              `}
            >
              <span
                className={`transition ${isActive
                  ? "text-white"
                  : isDark
                    ? "text-slate-400"
                    : "text-gray-500"
                  }`}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={`p-4 border-t ${
        isDark ? 'border-slate-700' : 'border-slate-200'
      }`}>
        <button
          onClick={() => {
            dispatch(logout());
            navigate("/login");
          }}
          className={`
            w-full
            flex
            items-center
            justify-center
            gap-2
            text-sm
            font-medium
            py-3
            rounded-xl
            transition
            ${isDark
              ? 'btn-delete-dark'
              : 'btn-delete'
            }
          `}
        >
          <LogOut size={18} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
