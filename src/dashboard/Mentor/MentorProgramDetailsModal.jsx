import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiX,
  FiBookOpen,
  FiBriefcase,
  FiClock,
  FiAward,
  FiLayers,
  FiCheckCircle,
  FiCalendar,
  FiUsers,
  FiExternalLink,
  FiChevronDown,
  FiChevronUp,
  FiFileText,
  FiTarget,
  FiPlusCircle,
  FiVideo,
  FiCompass,
  FiTag,
  FiInfo,
} from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";
import { useGetCourseByIdQuery } from "@/Services/sharedServices/courses.Services";
import { useGetMentorBatchesQuery } from "@/Services/mentor/mentorPortalService";

const MentorProgramDetailsModal = ({ program, type = "course", onClose }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'curriculum' | 'batches'
  const [expandedWeeks, setExpandedWeeks] = useState([0]); // first week open by default

  const isCourse = type === "course";
  const courseId = isCourse ? program?._id : null;

  // Fetch complete course details (curriculum, objectives, requirements) if it's a course
  const { data: fullCourseData, isLoading: isDetailsLoading } = useGetCourseByIdQuery(
    courseId,
    { skip: !courseId }
  );

  // Fetch mentor batches to show matching cohorts
  const { data: batchesData, isLoading: isBatchesLoading } = useGetMentorBatchesQuery();

  const detailedCourse = fullCourseData?.data || program || {};
  const details = detailedCourse?.details || {};
  const curriculum = Array.isArray(details?.curriculum) ? details.curriculum : [];
  const objectives = Array.isArray(details?.objectives) ? details.objectives : [];
  const requirements = Array.isArray(details?.requirements) ? details.requirements : [];

  // Filter batches for this program
  const allBatches = batchesData?.batches || [];
  const programBatches = allBatches.filter((b) => {
    if (isCourse) {
      const bCourseId = typeof b.courseId === "object" ? b.courseId?._id : b.courseId;
      return bCourseId === program?._id || b.courseName === program?.name || b.courseId?.name === program?.name;
    } else {
      const bDomainId = typeof b.internshipDomain === "object" ? b.internshipDomain?._id : b.internshipDomain;
      return bDomainId === program?._id || b.domainName === program?.name;
    }
  });

  const toggleWeek = (index) => {
    setExpandedWeeks((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleOpenFullPage = () => {
    if (isCourse && program?._id) {
      onClose();
      navigate(`/dashboard/course/${program._id}`);
    }
  };

  const handleCreateAssignment = () => {
    onClose();
    if (isCourse) {
      navigate(`/dashboard/mentor/assignments?courseId=${program._id}`);
    } else {
      navigate(`/dashboard/mentor/assignments?domainId=${program._id}`);
    }
  };

  const handleGoToBatches = () => {
    onClose();
    navigate("/dashboard/mentor/batches");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className={`relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden border z-10 ${
            isDark
              ? "bg-[#0f172a] border-slate-800 text-white"
              : "bg-white border-slate-200 text-slate-900"
          }`}
        >
          {/* Header Banner */}
          <div
            className={`p-6 sm:p-7 relative border-b ${
              isCourse
                ? isDark
                  ? "bg-gradient-to-r from-indigo-950/70 via-slate-900 to-indigo-950/40 border-indigo-900/30"
                  : "bg-gradient-to-r from-indigo-50 via-white to-slate-50 border-indigo-100"
                : isDark
                ? "bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/40 border-amber-900/30"
                : "bg-gradient-to-r from-amber-50 via-white to-slate-50 border-amber-100"
            }`}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className={`absolute top-5 right-5 p-2 rounded-full transition cursor-pointer ${
                isDark
                  ? "bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900"
              }`}
            >
              <FiX size={18} />
            </button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pr-10">
              {/* Icon / Thumbnail */}
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl shrink-0 overflow-hidden shadow-md border ${
                  isCourse
                    ? "bg-indigo-600 text-white border-indigo-400/30"
                    : "bg-amber-500 text-white border-amber-400/30"
                }`}
              >
                {program?.thumbnail?.url ? (
                  <img
                    src={program.thumbnail.url}
                    alt={program.name}
                    className="w-full h-full object-cover"
                  />
                ) : isCourse ? (
                  <FiBookOpen size={28} />
                ) : (
                  <FiBriefcase size={28} />
                )}
              </div>

              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                      isCourse
                        ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}
                  >
                    {isCourse ? "Assigned Course" : "Industrial Internship"}
                  </span>

                  {(program?.category || program?.focus) && (
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {program?.category || "Tech Track"}
                    </span>
                  )}

                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <FiCheckCircle size={11} /> Active Mentor
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {program?.name}
                </h2>

                <p className="text-xs sm:text-sm text-gray line-clamp-2">
                  {program?.description ||
                    program?.focus ||
                    "Comprehensive hands-on curriculum and industry-standard practical training."}
                </p>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5">
              <div
                className={`p-2.5 rounded-xl border text-xs flex items-center gap-2.5 ${
                  isDark ? "bg-slate-900/60 border-slate-800" : "bg-white/90 border-slate-200"
                }`}
              >
                <FiClock className="text-indigo-400 shrink-0" size={15} />
                <div>
                  <p className="text-[10px] text-gray uppercase font-semibold">Duration</p>
                  <p className="font-bold text-xs truncate">
                    {program?.duration || (program?.durations ? `${program.durations[0]?.days || 45} Days` : "Self-Paced")}
                  </p>
                </div>
              </div>

              <div
                className={`p-2.5 rounded-xl border text-xs flex items-center gap-2.5 ${
                  isDark ? "bg-slate-900/60 border-slate-800" : "bg-white/90 border-slate-200"
                }`}
              >
                <FiAward className="text-amber-400 shrink-0" size={15} />
                <div>
                  <p className="text-[10px] text-gray uppercase font-semibold">Level</p>
                  <p className="font-bold text-xs capitalize truncate">
                    {program?.level || "All Levels"}
                  </p>
                </div>
              </div>

              <div
                className={`p-2.5 rounded-xl border text-xs flex items-center gap-2.5 ${
                  isDark ? "bg-slate-900/60 border-slate-800" : "bg-white/90 border-slate-200"
                }`}
              >
                <FiLayers className="text-emerald-400 shrink-0" size={15} />
                <div>
                  <p className="text-[10px] text-gray uppercase font-semibold">Batches</p>
                  <p className="font-bold text-xs truncate">
                    {programBatches.length} Assigned
                  </p>
                </div>
              </div>

              <div
                className={`p-2.5 rounded-xl border text-xs flex items-center gap-2.5 ${
                  isDark ? "bg-slate-900/60 border-slate-800" : "bg-white/90 border-slate-200"
                }`}
              >
                <FiCompass className="text-sky-400 shrink-0" size={15} />
                <div>
                  <p className="text-[10px] text-gray uppercase font-semibold">Format</p>
                  <p className="font-bold text-xs truncate">
                    {isCourse ? "Mentored Course" : "Live Internship"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div
            className={`flex items-center gap-2 px-6 pt-3 border-b overflow-x-auto ${
              isDark ? "border-slate-800 bg-slate-950/40" : "border-slate-200 bg-slate-50/50"
            }`}
          >
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === "overview"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray hover:text-foreground"
              }`}
            >
              <FiInfo size={14} /> Overview & Scope
            </button>

            {isCourse && (
              <button
                onClick={() => setActiveTab("curriculum")}
                className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === "curriculum"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray hover:text-foreground"
                }`}
              >
                <FiFileText size={14} /> Curriculum & Syllabus ({curriculum.length} Weeks)
              </button>
            )}

            <button
              onClick={() => setActiveTab("batches")}
              className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === "batches"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray hover:text-foreground"
              }`}
            >
              <FiUsers size={14} /> Assigned Batches ({programBatches.length})
            </button>
          </div>

          {/* Scrollable Body Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* TAB 1: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Description */}
                <div className="space-y-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray flex items-center gap-2">
                    <FiFileText className="text-primary" /> Program Overview
                  </h3>
                  <p className="text-sm text-gray leading-relaxed">
                    {details.description ||
                      program?.description ||
                      (isCourse
                        ? "Comprehensive curriculum covering real-world industry tools, practical hands-on exercises, assignments, and guided mentor code reviews."
                        : `Mentorship program focused on ${program?.focus || "hands-on industry domains"}. Guides interns through industry projects, architecture reviews, and sprint deliverables.`)}
                  </p>
                </div>

                {/* For Internship: Focus Technologies */}
                {!isCourse && program?.focus && (
                  <div className="space-y-2.5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray flex items-center gap-2">
                      <FiTag className="text-amber-400" /> Focus Technologies & Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {program.focus.split(",").map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* For Internship: Available Tracks */}
                {!isCourse && Array.isArray(program?.durations) && program.durations.length > 0 && (
                  <div className="space-y-2.5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray flex items-center gap-2">
                      <FiCalendar className="text-amber-400" /> Available Duration Tracks
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {program.durations.map((track, i) => (
                        <div
                          key={i}
                          className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                            isDark ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-200"
                          }`}
                        >
                          <div>
                            <p className="font-bold text-sm">{track.label || `${track.days} Days Intensive`}</p>
                            <p className="text-xs text-gray">{track.days} Days Duration</p>
                          </div>
                          {track.fee && (
                            <span className="font-extrabold text-sm text-primary">
                              ₹{Number(track.fee).toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* What You'll Learn (Objectives) */}
                {objectives.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray flex items-center gap-2">
                      <FiTarget className="text-primary" /> Key Learning Objectives
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {objectives.map((item, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                            isDark ? "bg-slate-900/40 border-slate-800" : "bg-slate-50 border-slate-200"
                          }`}
                        >
                          <FiCheckCircle className="text-primary shrink-0 mt-0.5" size={15} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prerequisites / Requirements */}
                {requirements.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray flex items-center gap-2">
                      <FiCheckCircle className="text-indigo-400" /> Prerequisites & Requirements
                    </h3>
                    <div className="space-y-2">
                      {requirements.map((req, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs ${
                            isDark ? "bg-slate-900/40 border-slate-800" : "bg-slate-50 border-slate-200"
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                          <span>{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mentor Responsibilities Callout */}
                <div
                  className={`p-4 rounded-2xl border text-xs space-y-2 ${
                    isDark
                      ? "bg-indigo-950/20 border-indigo-900/30 text-slate-300"
                      : "bg-indigo-50/60 border-indigo-100 text-slate-700"
                  }`}
                >
                  <p className="font-bold text-indigo-400 flex items-center gap-1.5">
                    <FiAward /> Your Mentor Role & Deliverables:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray pl-1">
                    <li>Deliver scheduled interactive live classes and practical walkthroughs.</li>
                    <li>Create milestone assignments and provide constructive code reviews & grades.</li>
                    <li>Mentor enrolled students through real-world capstone projects and troubleshooting.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 2: CURRICULUM (COURSES ONLY) */}
            {activeTab === "curriculum" && isCourse && (
              <div className="space-y-4">
                {isDetailsLoading ? (
                  <div className="p-12 text-center text-sm text-gray space-y-2">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    <p>Loading full course syllabus...</p>
                  </div>
                ) : curriculum.length === 0 ? (
                  <div
                    className={`p-10 rounded-2xl border text-center space-y-3 ${
                      isDark ? "bg-slate-900/40 border-slate-800" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <FiBookOpen size={36} className="mx-auto text-primary opacity-40" />
                    <h4 className="font-bold text-sm">Detailed syllabus is being updated</h4>
                    <p className="text-xs text-gray max-w-md mx-auto">
                      Super Admin has not populated custom weekly module sessions for this course yet.
                      You can follow the standard curriculum topics or view the full course page.
                    </p>
                    {program?._id && (
                      <button
                        onClick={handleOpenFullPage}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-white hover:opacity-90 transition cursor-pointer"
                      >
                        Open Course Page <FiExternalLink className="inline ml-1" />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-gray pb-1">
                      <span>{curriculum.length} Weeks Structured Syllabus</span>
                      <button
                        onClick={() =>
                          setExpandedWeeks(
                            expandedWeeks.length === curriculum.length
                              ? []
                              : curriculum.map((_, i) => i)
                          )
                        }
                        className="text-primary hover:underline font-semibold cursor-pointer"
                      >
                        {expandedWeeks.length === curriculum.length ? "Collapse All" : "Expand All"}
                      </button>
                    </div>

                    {curriculum.map((week, wIdx) => {
                      const isExpanded = expandedWeeks.includes(wIdx);
                      const sessions = Array.isArray(week.sessions) ? week.sessions : [];

                      return (
                        <div
                          key={wIdx}
                          className={`rounded-2xl border overflow-hidden transition ${
                            isDark
                              ? "bg-slate-900/40 border-slate-800"
                              : "bg-white border-slate-200"
                          }`}
                        >
                          <div
                            onClick={() => toggleWeek(wIdx)}
                            className={`p-4 flex items-center justify-between cursor-pointer select-none transition ${
                              isDark ? "hover:bg-slate-800/40" : "hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                                W{wIdx + 1}
                              </span>
                              <div>
                                <h4 className="font-bold text-sm">
                                  {week.title || `Week ${wIdx + 1}: Module Overview`}
                                </h4>
                                <p className="text-xs text-gray">
                                  {sessions.length} Session{sessions.length !== 1 ? "s" : ""}
                                  {week.duration ? ` • ${week.duration}` : ""}
                                </p>
                              </div>
                            </div>

                            <button className="text-gray hover:text-primary">
                              {isExpanded ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                            </button>
                          </div>

                          {isExpanded && sessions.length > 0 && (
                            <div
                              className={`p-4 pt-1 space-y-2 border-t text-xs ${
                                isDark
                                  ? "bg-slate-950/30 border-slate-800"
                                  : "bg-slate-50/50 border-slate-100"
                              }`}
                            >
                              {sessions.map((sess, sIdx) => (
                                <div
                                  key={sIdx}
                                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 ${
                                    isDark
                                      ? "bg-slate-900/60 border-slate-800"
                                      : "bg-white border-slate-200"
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <FiVideo className="text-indigo-400 shrink-0" size={13} />
                                    <span className="font-medium text-xs">
                                      {sess.title || `Session ${sIdx + 1}`}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-gray uppercase font-semibold">
                                    Lesson {sIdx + 1}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: ASSIGNED BATCHES */}
            {activeTab === "batches" && (
              <div className="space-y-4">
                {isBatchesLoading ? (
                  <div className="p-12 text-center text-sm text-gray">Loading assigned batches...</div>
                ) : programBatches.length === 0 ? (
                  <div
                    className={`p-10 rounded-2xl border text-center space-y-3 ${
                      isDark ? "bg-slate-900/40 border-slate-800" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <FiLayers size={36} className="mx-auto text-primary opacity-40" />
                    <h4 className="font-bold text-sm">No batches created for this program yet</h4>
                    <p className="text-xs text-gray max-w-sm mx-auto">
                      When Super Admin launches a batch for this program and assigns you as mentor, it
                      will appear here.
                    </p>
                    <button
                      onClick={handleGoToBatches}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-white hover:opacity-90 transition cursor-pointer"
                    >
                      View All Batches Directory
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {programBatches.map((b) => (
                      <div
                        key={b._id}
                        className={`p-4 rounded-2xl border space-y-3 transition ${
                          isDark
                            ? "bg-slate-900/50 border-slate-800 hover:border-primary/40"
                            : "bg-white border-slate-200 hover:border-primary/40"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                              Active Cohort
                            </span>
                            <h4 className="font-bold text-sm mt-1">{b.batchName}</h4>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              b.status === "ongoing"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}
                          >
                            {b.status || "Ongoing"}
                          </span>
                        </div>

                        <div
                          className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                            isDark ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-200"
                          }`}
                        >
                          <div className="flex items-center justify-between text-gray">
                            <span className="flex items-center gap-1.5">
                              <FiUsers size={12} className="text-primary" /> Students:
                            </span>
                            <span className="font-bold text-slate-200">
                              {b.studentCount || 0} Enrolled
                            </span>
                          </div>
                          {b.startDate && (
                            <div className="flex items-center justify-between text-gray">
                              <span className="flex items-center gap-1.5">
                                <FiCalendar size={12} /> Starts:
                              </span>
                              <span>{new Date(b.startDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Modal Footer Actions */}
          <div
            className={`p-4 sm:p-5 border-t flex flex-wrap items-center justify-between gap-3 ${
              isDark ? "border-slate-800 bg-slate-950/80" : "border-slate-200 bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2">
              {isCourse && program?._id && (
                <button
                  onClick={handleOpenFullPage}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 cursor-pointer ${
                    isDark
                      ? "border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200"
                      : "border-slate-300 bg-white hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  <FiExternalLink size={13} /> Open Full Course Page
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCreateAssignment}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-primary text-white hover:opacity-90 shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <FiPlusCircle size={14} /> Create Assignment
              </button>

              <button
                onClick={onClose}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  isDark
                    ? "border-slate-800 hover:bg-slate-800 text-gray"
                    : "border-slate-300 hover:bg-slate-200 text-gray"
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MentorProgramDetailsModal;
