import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiBookOpen,
  FiBriefcase,
  FiUsers,
  FiLayers,
  FiClipboard,
  FiClock,
  FiCheckCircle,
  FiVideo,
  FiArrowRight,
  FiAward,
  FiCalendar,
  FiEye,
} from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";
import { useGetMentorOverviewQuery } from "@/Services/mentor/mentorPortalService";

const MentorDashboard = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { data, isLoading } = useGetMentorOverviewQuery();
  const overview = data?.data;
  const mentor = overview?.mentor;
  const stats = overview?.stats || {};
  const courses = overview?.courses || [];
  const internshipDomains = overview?.internshipDomains || [];
  const assignments = overview?.assignments || [];
  const liveClasses = overview?.liveClasses || [];

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-t-primary border-gray/30 rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-gray font-medium">Loading Mentor Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border shadow-xl ${
            isDark
              ? "bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-dark_border text-white"
              : "bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border-border text-white"
          }`}
        >
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border border-white/20 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                {mentor?.profileImage?.url ? (
                  <img
                    src={mentor.profileImage.url}
                    alt={mentor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl sm:text-3xl font-bold text-white">
                    {mentor?.name?.charAt(0) || "M"}
                  </span>
                )}
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Verified Mentor Portal
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Welcome back, {mentor?.name || "Mentor"}!
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                  {mentor?.email} • {mentor?.expertise?.join(", ") || "Instructor"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/dashboard/mentor/assignments"
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white text-slate-900 hover:bg-slate-100 transition shadow-md flex items-center gap-2 cursor-pointer"
              >
                <FiClipboard size={15} /> Evaluate Submissions
              </Link>
              <Link
                to="/dashboard/mentor/live-classes"
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition shadow-md flex items-center gap-2 cursor-pointer"
              >
                <FiVideo size={15} /> Live Sessions
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              label: "Assigned Courses",
              value: stats.totalCourses || courses.length,
              icon: <FiBookOpen className="text-blue-500" size={20} />,
              color: "text-blue-500",
              link: "/dashboard/mentor/courses",
            },
            {
              label: "Assigned Internships",
              value: stats.totalInternships || internshipDomains.length,
              icon: <FiBriefcase className="text-amber-500" size={20} />,
              color: "text-amber-500",
              link: "/dashboard/mentor/courses",
            },
            {
              label: "Active Batches",
              value: stats.totalBatches || 0,
              icon: <FiLayers className="text-indigo-500" size={20} />,
              color: "text-indigo-500",
              link: "/dashboard/mentor/batches",
            },
            {
              label: "Enrolled Students",
              value: stats.totalStudents || 0,
              icon: <FiUsers className="text-emerald-500" size={20} />,
              color: "text-emerald-500",
              link: "/dashboard/mentor/batches",
            },
            {
              label: "Pending to Grade",
              value: stats.pendingReview || 0,
              icon: <FiClock className="text-rose-500" size={20} />,
              color: "text-rose-500",
              link: "/dashboard/mentor/assignments",
            },
          ].map((stat, i) => (
            <Link
              key={i}
              to={stat.link}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-1 block shadow-sm ${
                isDark
                  ? "bg-semidark border-dark_border hover:border-primary/40 text-white"
                  : "bg-white border-border hover:border-primary/40 text-midnight_text"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="p-2.5 rounded-xl bg-slate-500/10">{stat.icon}</span>
                <span className="text-[11px] text-gray flex items-center gap-0.5">
                  View <FiArrowRight size={10} />
                </span>
              </div>
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-xs text-gray mt-1 truncate">{stat.label}</p>
            </Link>
          ))}
        </div>

        {/* Assigned Programs Section: Courses & Internships */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2
              className={`text-lg font-bold flex items-center gap-2 ${
                isDark ? "text-white" : "text-midnight_text"
              }`}
            >
              <FiBookOpen className="text-primary" /> My Assigned Programs & Internships
            </h2>
            <Link
              to="/dashboard/mentor/courses"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              View All ({courses.length + internshipDomains.length}) <FiArrowRight size={12} />
            </Link>
          </div>

          {courses.length === 0 && internshipDomains.length === 0 ? (
            <div
              className={`p-10 rounded-2xl border text-center text-gray text-xs space-y-2 ${
                isDark ? "bg-semidark border-dark_border" : "bg-white border-border"
              }`}
            >
              <FiBookOpen size={36} className="mx-auto opacity-30 text-primary" />
              <p className="font-semibold text-sm">No programs assigned yet</p>
              <p>Programs and internship domains assigned to you will show up here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Courses */}
              {courses.slice(0, 3).map((c) => (
                <div
                  key={c._id}
                  className={`p-4 rounded-2xl border flex items-center gap-4 transition shadow-sm ${
                    isDark
                      ? "bg-semidark border-dark_border text-white hover:border-indigo-500/40"
                      : "bg-white border-border text-midnight_text hover:border-indigo-500/40"
                  }`}
                >
                  <div className="w-14 h-14 rounded-xl bg-slate-800 overflow-hidden shrink-0 flex items-center justify-center text-lg font-bold text-indigo-400">
                    {c.thumbnail?.url ? (
                      <img
                        src={c.thumbnail.url}
                        alt={c.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      c.name.charAt(0)
                    )}
                  </div>
                  <div className="overflow-hidden flex-1">
                    <span className="text-[10px] font-bold uppercase text-indigo-400 tracking-wider">
                      Course • {c.category || "Tech"}
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm truncate mt-0.5">
                      {c.name}
                    </h4>
                    <p className="text-[11px] text-gray mt-1">
                      Duration: {c.duration || "Self-Paced"}
                    </p>
                  </div>
                </div>
              ))}

              {/* Internship Domains */}
              {internshipDomains.slice(0, 3).map((d) => (
                <div
                  key={d._id}
                  className={`p-4 rounded-2xl border flex items-center gap-4 transition shadow-sm ${
                    isDark
                      ? "bg-semidark border-dark_border text-white hover:border-amber-500/40"
                      : "bg-white border-border text-midnight_text hover:border-amber-500/40"
                  }`}
                >
                  <div className="w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/20 shrink-0 flex items-center justify-center text-amber-400">
                    <FiBriefcase size={22} />
                  </div>
                  <div className="overflow-hidden flex-1">
                    <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider">
                      Internship • {d.level || "Industrial"}
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm truncate mt-0.5">
                      {d.name}
                    </h4>
                    <p className="text-[11px] text-gray mt-1 truncate">
                      Focus: {d.focus}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2 Columns: Recent Assignments + Upcoming Live Classes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Assignments Table (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2
                className={`text-lg font-bold flex items-center gap-2 ${
                  isDark ? "text-white" : "text-midnight_text"
                }`}
              >
                <FiClipboard className="text-primary" /> Assignments & Submissions
              </h2>
              <Link
                to="/dashboard/mentor/assignments"
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                Manage All <FiArrowRight size={12} />
              </Link>
            </div>

            {assignments.length === 0 ? (
              <div
                className={`p-8 rounded-2xl border text-center text-gray text-xs space-y-2 ${
                  isDark ? "bg-semidark border-dark_border" : "bg-white border-border"
                }`}
              >
                <FiCheckCircle size={32} className="mx-auto opacity-30 text-emerald-500" />
                <p className="font-semibold text-sm">No assignments active</p>
                <p>Assignments created for your courses and internships will appear here.</p>
              </div>
            ) : (
              <div
                className={`rounded-2xl border overflow-hidden shadow-sm ${
                  isDark ? "bg-semidark border-dark_border" : "bg-white border-border"
                }`}
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr
                        className={`border-b text-[11px] uppercase text-gray font-semibold ${
                          isDark ? "border-dark_border bg-darklight/40" : "border-border bg-gray-50"
                        }`}
                      >
                        <th className="py-3 px-4">Title</th>
                        <th className="py-3 px-4">Program</th>
                        <th className="py-3 px-4">Questions</th>
                        <th className="py-3 px-4">Due Date</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${
                        isDark ? "divide-dark_border" : "divide-border"
                      }`}
                    >
                      {assignments.map((a) => (
                        <tr key={a._id} className="hover:bg-primary/5 transition">
                          <td className="py-3 px-4 font-semibold max-w-[180px] truncate">
                            {a.title}
                          </td>
                          <td className="py-3 px-4 text-gray truncate">
                            {a.course?.name || a.internshipDomain?.name || "All"}
                          </td>
                          <td className="py-3 px-4">
                            {a.questions?.length || 0} Questions
                          </td>
                          <td className="py-3 px-4 text-gray">
                            {a.dueDate
                              ? new Date(a.dueDate).toLocaleDateString()
                              : "No deadline"}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Link
                              to="/dashboard/mentor/assignments"
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 font-semibold"
                            >
                              <FiEye size={12} /> Review
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Upcoming Live Classes (1 Col) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2
                className={`text-lg font-bold flex items-center gap-2 ${
                  isDark ? "text-white" : "text-midnight_text"
                }`}
              >
                <FiVideo className="text-primary" /> Live Sessions
              </h2>
              <Link
                to="/dashboard/mentor/live-classes"
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                View all <FiArrowRight size={12} />
              </Link>
            </div>

            <div
              className={`p-4 rounded-2xl border space-y-3.5 shadow-sm ${
                isDark ? "bg-semidark border-dark_border" : "bg-white border-border"
              }`}
            >
              {liveClasses.length === 0 ? (
                <div className="text-center py-8 text-gray text-xs space-y-2">
                  <FiVideo size={28} className="mx-auto opacity-30 text-primary" />
                  <p className="font-semibold text-sm">No live sessions scheduled</p>
                  <p>Classes for your batches will be listed here.</p>
                </div>
              ) : (
                liveClasses.slice(0, 5).map((lc) => (
                  <div
                    key={lc._id}
                    className={`p-3.5 rounded-xl border space-y-2 ${
                      isDark ? "bg-darklight/40 border-dark_border" : "bg-slate-50 border-border"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-xs sm:text-sm line-clamp-1">
                        {lc.title}
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                        {lc.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-gray flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <FiCalendar size={12} />
                        {new Date(lc.startTime).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiClock size={12} />
                        {new Date(lc.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {lc.zoomStartUrl && (
                      <a
                        href={lc.zoomStartUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full mt-2 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold text-center block transition shadow-sm"
                      >
                        Start Meeting (Host)
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
