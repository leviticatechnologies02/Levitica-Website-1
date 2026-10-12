import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiBookOpen,
  FiBriefcase,
  FiClock,
  FiAward,
  FiLayers,
  FiCheckCircle,
  FiCalendar,
} from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";
import { useGetMentorCoursesQuery } from "@/Services/mentor/mentorPortalService";

const MentorCourses = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'courses' | 'internships'

  const { data, isLoading } = useGetMentorCoursesQuery();
  const courses = data?.courses || [];
  const internshipDomains = data?.internshipDomains || [];

  const totalPrograms = courses.length + internshipDomains.length;

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2">
          <div>
            <h1
              className={`text-2xl sm:text-3xl font-bold flex items-center gap-2.5 ${
                isDark ? "text-white" : "text-midnight_text"
              }`}
            >
              <FiBookOpen className="text-primary" />
              My Assigned Programs & Internships
            </h1>
            <p className="text-sm text-gray mt-1">
              Courses and Industrial Internship domains assigned to you by Super Admin.
            </p>
          </div>

          {/* Quick Counter Badges */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {courses.length} Course{courses.length !== 1 ? "s" : ""}
            </span>
            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {internshipDomains.length} Internship{internshipDomains.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 border-b border-border/40 pb-3">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === "all"
                ? "bg-primary text-white shadow-sm"
                : isDark
                ? "text-gray hover:text-white hover:bg-white/5"
                : "text-gray hover:text-midnight_text hover:bg-gray-100"
            }`}
          >
            All Programs ({totalPrograms})
          </button>
          <button
            onClick={() => setActiveTab("courses")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "courses"
                ? "bg-primary text-white shadow-sm"
                : isDark
                ? "text-gray hover:text-white hover:bg-white/5"
                : "text-gray hover:text-midnight_text hover:bg-gray-100"
            }`}
          >
            <FiBookOpen size={13} />
            Courses ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab("internships")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "internships"
                ? "bg-primary text-white shadow-sm"
                : isDark
                ? "text-gray hover:text-white hover:bg-white/5"
                : "text-gray hover:text-midnight_text hover:bg-gray-100"
            }`}
          >
            <FiBriefcase size={13} />
            Industrial Internships ({internshipDomains.length})
          </button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="p-16 text-center text-sm text-gray">
            Loading assigned programs...
          </div>
        ) : totalPrograms === 0 ? (
          <div
            className={`p-16 rounded-2xl border text-center space-y-3 ${
              isDark ? "bg-semidark border-dark_border" : "bg-white border-border"
            }`}
          >
            <FiBookOpen size={40} className="mx-auto text-primary opacity-40" />
            <h3 className="text-lg font-bold">No programs or internships assigned</h3>
            <p className="text-xs text-gray max-w-sm mx-auto">
              You currently do not have any courses or internship domains assigned.
              Super Admin can assign them from the Mentors directory.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* 1. Courses Section */}
            {(activeTab === "all" || activeTab === "courses") && courses.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FiBookOpen className="text-indigo-400" />
                  <h2 className="text-lg font-bold">Assigned Courses</h2>
                  <span className="text-xs text-gray">({courses.length})</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <motion.div
                      key={course._id}
                      whileHover={{ y: -4 }}
                      className={`rounded-2xl border overflow-hidden flex flex-col justify-between shadow-sm transition ${
                        isDark
                          ? "bg-semidark border-dark_border text-white hover:border-indigo-500/40"
                          : "bg-white border-border text-midnight_text hover:border-indigo-500/40"
                      }`}
                    >
                      <div>
                        <div className="h-40 w-full bg-slate-900/10 overflow-hidden relative">
                          {course.thumbnail?.url ? (
                            <img
                              src={course.thumbnail.url}
                              alt={course.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl font-extrabold text-indigo-400/30">
                              {course.name.charAt(0)}
                            </div>
                          )}
                          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-950/80 text-white backdrop-blur-md border border-white/20">
                            {course.category || "General"}
                          </span>
                        </div>

                        <div className="p-5 space-y-3">
                          <h3 className="text-base font-bold line-clamp-1">
                            {course.name}
                          </h3>
                          <p className="text-xs text-gray line-clamp-2 leading-relaxed">
                            {course.description ||
                              "Comprehensive curriculum covering practical projects and industry skills."}
                          </p>

                          <div
                            className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                              isDark
                                ? "bg-darklight/40 border-dark_border"
                                : "bg-slate-50 border-border"
                            }`}
                          >
                            <div className="flex items-center justify-between text-gray">
                              <span className="flex items-center gap-1.5">
                                <FiClock size={13} className="text-indigo-400" /> Duration:
                              </span>
                              <span className="font-semibold text-slate-200">
                                {course.duration || "Self-Paced"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-gray">
                              <span className="flex items-center gap-1.5">
                                <FiAward size={13} className="text-amber-400" /> Level:
                              </span>
                              <span className="font-semibold capitalize text-slate-200">
                                {course.level || "All Levels"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 pt-0">
                        <span className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-center block bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          <FiCheckCircle className="inline mr-1" /> Active Mentor
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Internships Section */}
            {(activeTab === "all" || activeTab === "internships") &&
              internshipDomains.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FiBriefcase className="text-amber-500" />
                    <h2 className="text-lg font-bold">Assigned Industrial Internships</h2>
                    <span className="text-xs text-gray">
                      ({internshipDomains.length})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {internshipDomains.map((domain) => (
                      <motion.div
                        key={domain._id}
                        whileHover={{ y: -4 }}
                        className={`rounded-2xl border overflow-hidden flex flex-col justify-between shadow-sm transition ${
                          isDark
                            ? "bg-semidark border-dark_border text-white hover:border-amber-500/40"
                            : "bg-white border-border text-midnight_text hover:border-amber-500/40"
                        }`}
                      >
                        <div>
                          <div className="p-5 pb-3 border-b border-border/30 bg-gradient-to-br from-amber-500/10 to-transparent">
                            <div className="flex items-center justify-between gap-2">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                Industrial Internship
                              </span>
                              {domain.level && (
                                <span className="text-[10px] font-semibold text-gray capitalize">
                                  Level: {domain.level}
                                </span>
                              )}
                            </div>
                            <h3 className="text-base font-bold mt-2.5 line-clamp-1">
                              {domain.name}
                            </h3>
                            <p className="text-xs text-amber-400 font-medium mt-0.5 line-clamp-1">
                              Focus: {domain.focus}
                            </p>
                          </div>

                          <div className="p-5 space-y-3">
                            <p className="text-xs text-gray line-clamp-2 leading-relaxed">
                              Mentoring internship cohorts with real-world case studies,
                              code reviews, and project milestones.
                            </p>

                            {/* Durations if any */}
                            {Array.isArray(domain.durations) &&
                              domain.durations.length > 0 && (
                                <div
                                  className={`p-3 rounded-xl border text-xs space-y-1 ${
                                    isDark
                                      ? "bg-darklight/40 border-dark_border"
                                      : "bg-slate-50 border-border"
                                  }`}
                                >
                                  <span className="text-gray flex items-center gap-1.5 font-medium">
                                    <FiCalendar size={12} className="text-amber-500" />
                                    Available Tracks:
                                  </span>
                                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                                    {domain.durations.map((dur, i) => (
                                      <span
                                        key={i}
                                        className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20"
                                      >
                                        {dur.label || `${dur.days} Days`}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>

                        <div className="p-5 pt-0">
                          <span className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-center block bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <FiCheckCircle className="inline mr-1" /> Active Domain Mentor
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorCourses;
