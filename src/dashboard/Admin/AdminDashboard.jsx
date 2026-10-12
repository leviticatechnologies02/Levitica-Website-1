import QuickActionsCard from '@/dashboard/Extras/QuickActionsCard';
import StatCard from '@/dashboard/Extras/StatCard';
import { useGetStatsQuery } from '@/Services/admin/statsService';
import UserCreationForm from "./UserCreation/UserCreationForm";
import WelcomeScreen from '@/dashboard/Student/WelcomeScreen';
import StatsCharts from '@/dashboard/Extras/StatsCharts';
import { useTheme } from '@/context/ThemeContext';
import { FiUsers, FiBook, FiGrid, FiTrendingUp, FiAlertTriangle, FiBarChart2, FiSettings, FiZap, FiLock, FiCheck, FiActivity } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import RevenueTrendChart from '../common/RevenueTrendChart';

const AdminDashboard = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { user } = useSelector((state) => state.auth);

  const { data: stats, isLoading, error } = useGetStatsQuery();

  const {
    verifiedUsers = 0,
    batches = 0,
    enrollments = 0,
    courses = 0,
  } = stats?.data || {};

  const statsData = [
    {
      label: "Verified Users",
      count: verifiedUsers,
      icon: FiUsers,
      gradient: isDark
        ? 'from-primary/20 to-primary/5'
        : 'from-primary/10 to-primary/5',
      borderColor: 'border-l-4 border-l-primary',
      iconColor: isDark ? 'text-primary' : 'text-primary',
      textColor: isDark ? 'text-primary' : 'text-primary'
    },
    {
      label: "Courses",
      count: courses,
      icon: FiBook,
      gradient: isDark
        ? 'from-purple-500/20 to-purple-500/5'
        : 'from-purple-500/10 to-purple-500/5',
      borderColor: 'border-l-4 border-l-purple-500',
      iconColor: isDark ? 'text-purple-400' : 'text-purple-600',
      textColor: isDark ? 'text-purple-300' : 'text-purple-700'
    },
    {
      label: "Batches",
      count: batches,
      icon: FiGrid,
      gradient: isDark
        ? 'from-emerald-500/20 to-emerald-500/5'
        : 'from-emerald-500/10 to-emerald-500/5',
      borderColor: 'border-l-4 border-l-emerald-500',
      iconColor: isDark ? 'text-emerald-400' : 'text-emerald-600',
      textColor: isDark ? 'text-emerald-300' : 'text-emerald-700'
    },
    {
      label: "Enrollments",
      count: enrollments,
      icon: FiTrendingUp,
      gradient: isDark
        ? 'from-orange-500/20 to-orange-500/5'
        : 'from-orange-500/10 to-orange-500/5',
      borderColor: 'border-l-4 border-l-orange-500',
      iconColor: isDark ? 'text-orange-400' : 'text-orange-600',
      textColor: isDark ? 'text-orange-300' : 'text-orange-700'
    },
  ];

  if (isLoading) {
    return (
      <div className={`flex h-[80vh] items-center justify-center ${isDark ? 'bg-darkmode' : 'bg-section'
        }`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className={`h-12 w-12 rounded-full border-4 ${isDark
              ? 'border-dark_border border-t-primary'
              : 'border-border border-t-primary'
            }`}
        ></motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 rounded-xl ${isDark
          ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
          : 'bg-rose-500/10 border border-rose-500/20 text-rose-600'
        }`}>
        <div className="flex items-center gap-3">
          <FiAlertTriangle className="w-6 h-6" />
          <div>
            <h3 className="font-bold">System Error</h3>
            <p className="text-sm opacity-80">Failed to sync dashboard metrics. Please refresh.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen`}>
      <div className="py-6 px-4">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* ===== HERO SECTION - NO BOX LAYOUT ===== */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2 px-2">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className={`text-2xl sm:text-3xl lg:text-3xl font-bold ${isDark ? 'text-white' : 'text-midnight_text'
                    }`}>
                    Welcome back, {user?.name?.split(' ')[0] || 'Admin'}!
                  </h1>
                  <p className={`text-sm text-gray mt-1 flex items-center gap-2`}>
                    <FiTrendingUp className="w-4 h-4" />
                    Here's what's happening with your platform today
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-md hover:shadow-lg flex items-center gap-2 btn btn-primary`}
              >
                <FiBarChart2 className="w-4 h-4" />
                <span>Generate Report</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-md hover:shadow-lg flex items-center gap-2 border btn btn-white`}
              >
                <FiSettings className="w-4 h-4" />
                <span>Settings</span>
              </motion.button>
            </div>
          </div>

          {/* ===== STATS GRID ===== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {statsData.map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ translateY: -4 }}
                className={`rounded-xl p-5 ${stat.borderColor} transition-all duration-300 bg-gradient-to-br ${stat.gradient} shadow-property hover:shadow-deatail_shadow cursor-pointer border ${isDark
                    ? 'border-dark_border'
                    : 'border-border'
                  }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${stat.textColor
                      }`}>
                      {stat.label}
                    </p>
                    <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-midnight_text'
                      }`}>
                      {stat.count.toLocaleString()}
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg ${isDark ? 'bg-darklight/50' : 'bg-white/50'}`}>
                    {stat.icon && (
                      <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* ===== MAIN CONTENT GRID ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className={`lg:col-span-1 rounded-xl p-5 shadow-property hover:shadow-deatail_shadow border ${isDark
                  ? 'bg-semidark border-dark_border'
                  : 'bg-white border-border'
                }`}
            >
              <div className="flex items-center gap-2 mb-4 pb-2 border-b ${isDark ? 'border-dark_border' : 'border-border'}">
                <div className={`p-1.5 rounded-lg bg-primary/10`}>
                  <FiZap className={`w-4 h-4 text-primary`} />
                </div>
                <h3 className={`text-sm font-semibold text-primary`}>
                  Quick Actions
                </h3>
              </div>
              <QuickActionsCard />
            </motion.div>

            {/* Analytics & Charts - RevenueTrendChart Integrated */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="lg:col-span-2"
            >
              <RevenueTrendChart />
            </motion.div>
          </div>

          {/* ===== USER CREATION SECTION ===== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className={`rounded-xl p-6 shadow-property hover:shadow-deatail_shadow border ${isDark
                ? 'bg-semidark border-dark_border'
                : 'bg-white border-border'
              }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 pb-3 border-b ${isDark ? 'border-dark_border' : 'border-border'}">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-emerald-500/10`}>
                  <FiLock className={`w-5 h-5 text-emerald-500`} />
                </div>
                <div>
                  <h2 className={`text-base font-bold text-emerald-500`}>
                    Identity Hub
                  </h2>
                  <p className={`text-xs text-gray mt-0.5`}>
                    Provision new administrative or student accounts instantly
                  </p>
                </div>
              </div>
              <div className={`text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-2 ${isDark
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-emerald-500/10 text-emerald-600'
                }`}>
                <FiCheck className="w-3.5 h-3.5" /> Secure Entry • Encrypted Session
              </div>
            </div>
            <UserCreationForm key={isDark} theme={isDark} />
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;