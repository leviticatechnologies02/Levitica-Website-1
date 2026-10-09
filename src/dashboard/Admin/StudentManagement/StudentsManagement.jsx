import { Outlet, NavLink, useMatch } from "react-router-dom";
import {
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiShield,
  FiTrendingUp,
  FiGrid,
  FiList,
  FiCheckCircle,
  FiClock,
  FiBookOpen,
} from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useGetStudentsQuery } from '@/Services/admin/studentReportsServices';
import {
  useLazyGetUnassignedEnrollmentsQuery,
  useGetAssignedEnrollmentsQuery,
  useGetAssignedInternshipsQuery,
} from '@/Services/admin/assignService';
import { useCourses } from '@/hooks/useCourses';

const AssignStudents = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const matchAll = useMatch("/dashboard/admin/students");
  const matchUnassigned = useMatch("/dashboard/admin/students/unassigned");
  const matchAssigned = useMatch("/dashboard/admin/students/assigned");

  // Fetch students data for stats
  const { data: studentsData } = useGetStudentsQuery({
    page: 1,
    limit: 100,
    search: "",
  });

  // Fetch unassigned students data for stats
  const [fetchUnassigned, { data: unassignedData }] = useLazyGetUnassignedEnrollmentsQuery();
  const { data: assignedCoursesData } = useGetAssignedEnrollmentsQuery();
  const { data: assignedInternshipsData } = useGetAssignedInternshipsQuery();
  const { courses = [] } = useCourses();

  useEffect(() => {
    fetchUnassigned();
  }, [fetchUnassigned]);

  const totalStudents = studentsData?.total || 0;
  const verifiedStudents = studentsData?.students?.filter(s => s.emailVerified).length || 0;
  const pendingStudents = studentsData?.students?.filter(s => !s.emailVerified).length || 0;
  
  const unassignedCount = unassignedData?.enrollments?.length || 0;
  const assignedCoursesCount = assignedCoursesData?.enrollments?.reduce((acc, curr) => acc + (curr.enrolledCourses?.length || 0), 0) || 0;
  const assignedInternshipsCount = assignedInternshipsData?.internships?.length || 0;
  const realAssignedCount = assignedCoursesCount + assignedInternshipsCount;
  const assignedCount = realAssignedCount > 0 ? realAssignedCount : Math.max(0, totalStudents - unassignedCount);
  const totalCourses = courses.length;

  const tabs = [
    {
      path: "",
      label: "All Students",
      icon: FiUsers,
      active: !!matchAll,
      description: "View all registered students",
    },
    {
      path: "unassigned",
      label: "Unassigned",
      icon: FiUserX,
      active: !!matchUnassigned,
      description: "Students waiting for batch assignment",
    },
    {
      path: "assigned",
      label: "Assigned",
      icon: FiUserCheck,
      active: !!matchAssigned,
      description: "Students with active batch allocation",
    },
  ];

  // const activeTab = tabs.find(tab => tab.active);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-darkmode' : 'bg-section'}`}>
      <div className="py-6 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* ===== HEADER SECTION ===== */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3 px-2">
              <div className="flex items-center gap-3 px-2">
                <div>
                  <h1 className={`text-3xl sm:text-3xl font-bold tracking-tight ${
                    isDark ? 'text-white' : 'text-midnight_text'
                  }`}>
                    Student Management
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <FiUsers size={16} />
                    <p className={`text-sm text-gray`}>
                      Control center for student batch assignments
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${
                isDark
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
              }`}>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                System Active
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${
                isDark
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'bg-primary/10 text-primary border border-primary/20'
              }`}>
                <FiShield size={16} />
                Admin Access
              </div>
            </div>
          </div>

          {/* ===== STATS CARDS ROW 1 - Student Stats (from StudentsTable) ===== */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total Students Card */}
            <div className={`rounded-xl shadow-md p-6 border transition-all hover:shadow-md ${
              isDark ? 'bg-primary/20 border-dark_border' : 'bg-primary/10 border-border'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs font-medium uppercase tracking-wide ${isDark ? 'text-gray' : 'text-primary'}`}>Total Students</p>
                  <p className={`text-3xl font-bold mt-1 ${isDark ? 'text-blue-300' : 'text-primary'}`}>
                    {totalStudents}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${isDark ? 'bg-primary/20' : 'bg-primary/10'}`}>
                  <FiUsers className="text-2xl text-primary" />
                </div>
              </div>
            </div>
            
            {/* Verified Card */}
            <div className={`rounded-xl shadow-md p-6 border transition-all hover:shadow-md ${
              isDark ? 'bg-emerald-500/20 border-dark_border' : 'bg-emerald-500/10 border-border'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs font-medium uppercase tracking-wide ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`}>Verified</p>
                  <p className={`text-3xl font-bold mt-1 ${isDark ? 'text-emerald-400' : 'text-emerald-700' }`}>
                    {verifiedStudents}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-500/10'}`}>
                  <FiCheckCircle className="text-2xl text-emerald-500" />
                </div>
              </div>
            </div>
            
            {/* Pending Card */}
            <div className={`rounded-xl shadow-md p-6 border transition-all hover:shadow-md ${
              isDark ? 'bg-amber-500/20 border-dark_border' : 'bg-amber-500/10 border-border'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs font-medium uppercase tracking-wide ${isDark ? 'text-amber-400' : 'text-amber-500' }`}>Pending</p>
                  <p className={`text-3xl font-bold mt-1 ${isDark ? 'text-amber-400' : 'text-amber-700' }`}>
                    {pendingStudents}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${isDark ? 'bg-amber-500/20' : 'bg-amber-500/10'}`}>
                  <FiClock className="text-2xl text-amber-500" />
                </div>
              </div>
            </div>
          </div>

          {/* ===== STATS CARDS ROW 2 - Batch Assignment Stats (from UnassignedStudents) ===== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Unassigned Students Card - Blue */}
            <div className={`border shadow-md rounded-xl p-6 transition-colors ${
              isDark
                ? 'bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-800/30'
                : 'bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Unassigned</p>
                  <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-blue-300' : 'text-blue-900'}`}>{unassignedCount}</p>
                </div>
                <div className={`p-3 rounded-lg ${isDark ? 'bg-blue-800/30' : 'bg-blue-200/50'}`}>
                  <FiUserX className={`text-2xl ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
              </div>
            </div>
            
            {/* Assigned Students Card - Purple */}
            <div className={`border shadow-md rounded-xl p-6 transition-colors ${
              isDark
                ? 'bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-800/30'
                : 'bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>Assigned</p>
                  <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-purple-300' : 'text-purple-900'}`}>{assignedCount}</p>
                </div>
                <div className={`p-3 rounded-lg ${isDark ? 'bg-purple-800/30' : 'bg-purple-200/50'}`}>
                  <FiUserCheck className={`text-2xl ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
              </div>
            </div>
            
            {/* Active Courses Card - Emerald */}
            <div className={`border shadow-md rounded-xl p-6 transition-colors ${
              isDark
                ? 'bg-gradient-to-br from-emerald-900/20 to-emerald-800/20 border-emerald-800/30'
                : 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>Total Courses</p>
                  <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-emerald-300' : 'text-emerald-900'}`}>{totalCourses}</p>
                </div>
                <div className={`p-3 rounded-lg ${isDark ? 'bg-emerald-800/30' : 'bg-emerald-200/50'}`}>
                  <FiBookOpen className={`text-2xl ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                </div>
              </div>
            </div>
          </div>

          {/* ===== MAIN CONTENT CARD ===== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={``}
          >
            {/* Tab Navigation */}
            <div className={`border-b ${isDark ? 'border-dark_border' : 'border-border'}`}>
              <div className="flex items-center justify-between px-2 py-3">
                <div className="flex items-center gap-1">
                  {tabs.map((tab) => (
                    <NavLink
                      key={tab.path}
                      to={tab.path}
                      end={tab.path === ""}
                      className={({ isActive }) =>
                        `
                          relative px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                          ${isActive
                            ? isDark
                              ? 'text-white'
                              : 'text-primary'
                            : isDark
                            ? 'text-gray hover:text-white'
                            : 'text-gray hover:text-midnight_text'
                          }
                        `
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-2">
                            <tab.icon size={16} />
                            <span>{tab.label}</span>
                          </div>
                          {isActive && (
                            <motion.div
                              layoutId="activeTabIndicator"
                              className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${
                                isDark ? 'bg-primary' : 'bg-primary'
                              }`}
                              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                            />
                          )}
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-2">
              <Outlet />
            </div>

            {/* Footer Note */}
            <div className={`px-5 py-3 border-t text-xs ${isDark ? 'border-dark_border bg-darklight/20 text-gray' : 'border-border bg-light/30 text-gray'}`}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span>Showing student records from the database</span>
                <span className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  Last updated: Just now
                </span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default AssignStudents;