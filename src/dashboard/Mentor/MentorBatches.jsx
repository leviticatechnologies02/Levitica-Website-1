import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiLayers,
  FiUsers,
  FiCalendar,
  FiBookOpen,
  FiBriefcase,
  FiMail,
  FiPhone,
  FiSearch,
} from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";
import {
  useGetMentorBatchesQuery,
  useGetMentorStudentsQuery,
} from "@/Services/mentor/mentorPortalService";

const MentorBatches = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { data: batchesData, isLoading: batchesLoading } = useGetMentorBatchesQuery();
  const { data: studentsData, isLoading: studentsLoading } = useGetMentorStudentsQuery();

  const batches = batchesData?.batches || [];
  const students = studentsData?.students || [];

  const [activeTab, setActiveTab] = useState("batches"); // 'batches' | 'students'
  const [batchFilter, setBatchFilter] = useState("all"); // 'all' | 'courses' | 'internships'
  const [studentFilter, setStudentFilter] = useState("all"); // 'all' | 'courses' | 'internships'
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBatches = batches.filter((b) => {
    const isInternship = b.batchType === "internship" || Boolean(b.internshipDomainId);
    if (batchFilter === "courses") return !isInternship;
    if (batchFilter === "internships") return isInternship;
    return true;
  });

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.collegeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.enrolledDetails || []).some((ed) =>
        (ed.name || ed.domain || ed.course?.name || "")
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      );

    if (!matchesSearch) return false;

    if (studentFilter === "courses") return s.studentType === "course" || s.studentType === "both";
    if (studentFilter === "internships") return s.studentType === "internship" || s.studentType === "both";
    return true;
  });

  const courseBatchesCount = batches.filter(
    (b) => !(b.batchType === "internship" || Boolean(b.internshipDomainId))
  ).length;
  const internshipBatchesCount = batches.filter(
    (b) => b.batchType === "internship" || Boolean(b.internshipDomainId)
  ).length;

  const courseStudentsCount = students.filter(
    (s) => s.studentType === "course" || s.studentType === "both"
  ).length;
  const internshipCandidatesCount = students.filter(
    (s) => s.studentType === "internship" || s.studentType === "both"
  ).length;

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2">
          <div>
            <h1
              className={`text-2xl sm:text-3xl font-bold flex items-center gap-2.5 ${
                isDark ? "text-white" : "text-midnight_text"
              }`}
            >
              <FiLayers className="text-primary" />
              Batches & Enrolled Students
            </h1>
            <p className="text-sm text-gray mt-1">
              View active cohorts, course batches, and industrial internship candidates assigned to you.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("batches")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                activeTab === "batches"
                  ? "bg-primary text-white shadow-md"
                  : isDark
                  ? "bg-darklight/40 border border-dark_border text-gray"
                  : "bg-white border border-border text-gray"
              }`}
            >
              Batches ({batches.length})
            </button>
            <button
              onClick={() => setActiveTab("students")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                activeTab === "students"
                  ? "bg-primary text-white shadow-md"
                  : isDark
                  ? "bg-darklight/40 border border-dark_border text-gray"
                  : "bg-white border border-border text-gray"
              }`}
            >
              Enrolled Students & Candidates ({students.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Batches Grid */}
        {activeTab === "batches" && (
          <div className="space-y-4">
            {/* Filter pills */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setBatchFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  batchFilter === "all"
                    ? "bg-primary text-white shadow-xs"
                    : isDark
                    ? "bg-darklight border border-dark_border text-gray hover:text-white"
                    : "bg-gray-100 border border-border text-gray hover:text-black"
                }`}
              >
                All Batches ({batches.length})
              </button>
              <button
                onClick={() => setBatchFilter("courses")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  batchFilter === "courses"
                    ? "bg-primary text-white shadow-xs"
                    : isDark
                    ? "bg-darklight border border-dark_border text-gray hover:text-white"
                    : "bg-gray-100 border border-border text-gray hover:text-black"
                }`}
              >
                <FiBookOpen size={12} /> Course Batches ({courseBatchesCount})
              </button>
              <button
                onClick={() => setBatchFilter("internships")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  batchFilter === "internships"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : isDark
                    ? "bg-darklight border border-dark_border text-gray hover:text-white"
                    : "bg-gray-100 border border-border text-gray hover:text-black"
                }`}
              >
                <FiBriefcase size={12} /> Internship Batches ({internshipBatchesCount})
              </button>
            </div>

            {batchesLoading ? (
              <div className="p-16 text-center text-sm text-gray">Loading batches...</div>
            ) : filteredBatches.length === 0 ? (
              <div
                className={`p-16 rounded-2xl border text-center space-y-3 ${
                  isDark ? "bg-semidark border-dark_border" : "bg-white border-border"
                }`}
              >
                <FiLayers size={40} className="mx-auto text-primary opacity-40" />
                <h3 className="text-lg font-bold">No batches found</h3>
                <p className="text-xs text-gray max-w-sm mx-auto">
                  Batches created by Super Admin for your assigned courses and internships will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBatches.map((b) => {
                  const isInternship =
                    b.batchType === "internship" || Boolean(b.internshipDomainId);
                  const programName = isInternship
                    ? b.internshipDomainId?.name || "Industrial Internship"
                    : b.courseId?.name || "Course Batch";

                  return (
                    <motion.div
                      key={b._id}
                      whileHover={{ y: -3 }}
                      className={`p-5 rounded-2xl border space-y-4 shadow-sm transition ${
                        isDark
                          ? "bg-semidark border-dark_border text-white hover:border-primary/40"
                          : "bg-white border-border text-midnight_text hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1.5">
                          {isInternship ? (
                            <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 inline-flex items-center gap-1">
                              <FiBriefcase size={10} /> {programName}
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 inline-flex items-center gap-1">
                              <FiBookOpen size={10} /> {programName}
                            </span>
                          )}
                          <h3 className="text-base font-bold">{b.batchName}</h3>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${
                            b.status === "active" || b.status === "ongoing"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {b.status || "Active"}
                        </span>
                      </div>

                      <div
                        className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                          isDark ? "bg-darklight/40 border-dark_border" : "bg-slate-50 border-border"
                        }`}
                      >
                        <div className="flex items-center justify-between text-gray">
                          <span className="flex items-center gap-1.5">
                            <FiUsers size={13} className="text-primary" />{" "}
                            {isInternship ? "Candidates Enrolled:" : "Enrolled Students:"}
                          </span>
                          <span
                            className={`font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}
                          >
                            {b.studentCount || 0} {isInternship ? "Candidates" : "Students"}
                          </span>
                        </div>
                        {b.startDate && (
                          <div className="flex items-center justify-between text-gray">
                            <span className="flex items-center gap-1.5">
                              <FiCalendar size={13} /> Start Date:
                            </span>
                            <span className="font-semibold">
                              {new Date(b.startDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        {b.endDate && (
                          <div className="flex items-center justify-between text-gray">
                            <span className="flex items-center gap-1.5">
                              <FiCalendar size={13} /> End Date:
                            </span>
                            <span className="font-semibold">
                              {new Date(b.endDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Students & Candidates Table */}
        {activeTab === "students" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Search input */}
              <div className="w-full sm:w-80 relative">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray" size={16} />
                <input
                  type="text"
                  placeholder="Search by name, email, or college..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm border outline-none transition ${
                    isDark
                      ? "bg-semidark border-dark_border text-white focus:border-primary"
                      : "bg-white border-border text-black focus:border-primary"
                  }`}
                />
              </div>

              {/* Sub-filter pills */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStudentFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    studentFilter === "all"
                      ? "bg-primary text-white shadow-xs"
                      : isDark
                      ? "bg-darklight border border-dark_border text-gray hover:text-white"
                      : "bg-gray-100 border border-border text-gray hover:text-black"
                  }`}
                >
                  All ({students.length})
                </button>
                <button
                  onClick={() => setStudentFilter("courses")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    studentFilter === "courses"
                      ? "bg-primary text-white shadow-xs"
                      : isDark
                      ? "bg-darklight border border-dark_border text-gray hover:text-white"
                      : "bg-gray-100 border border-border text-gray hover:text-black"
                  }`}
                >
                  <FiBookOpen size={12} /> Course Students ({courseStudentsCount})
                </button>
                <button
                  onClick={() => setStudentFilter("internships")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    studentFilter === "internships"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : isDark
                      ? "bg-darklight border border-dark_border text-gray hover:text-white"
                      : "bg-gray-100 border border-border text-gray hover:text-black"
                  }`}
                >
                  <FiBriefcase size={12} /> Internship Candidates ({internshipCandidatesCount})
                </button>
              </div>
            </div>

            {studentsLoading ? (
              <div className="p-16 text-center text-sm text-gray">Loading roster...</div>
            ) : filteredStudents.length === 0 ? (
              <div
                className={`p-16 rounded-2xl border text-center space-y-2 text-gray ${
                  isDark ? "bg-semidark border-dark_border" : "bg-white border-border"
                }`}
              >
                <FiUsers size={36} className="mx-auto opacity-30 text-primary" />
                <p className="font-semibold text-sm">No students or candidates found</p>
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
                        <th className="py-3.5 px-4">Student / Candidate</th>
                        <th className="py-3.5 px-4">Contact</th>
                        <th className="py-3.5 px-4">Type</th>
                        <th className="py-3.5 px-4">Enrolled Courses & Internships</th>
                        <th className="py-3.5 px-4">College / Details</th>
                        <th className="py-3.5 px-4">Joined</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? "divide-dark_border" : "divide-border"}`}>
                      {filteredStudents.map((s) => {
                        const isBoth = s.studentType === "both";
                        const isInternship = s.studentType === "internship";

                        return (
                          <tr key={s._id} className="hover:bg-primary/5 transition">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-8 h-8 rounded-full font-bold flex items-center justify-center shrink-0 ${
                                    isInternship
                                      ? "bg-indigo-500/15 text-indigo-400"
                                      : "bg-primary/10 text-primary"
                                  }`}
                                >
                                  {s.name?.charAt(0) || "S"}
                                </div>
                                <div>
                                  <span className="font-semibold block">{s.name}</span>
                                  {s.rollNumber && (
                                    <span className="text-[10px] text-gray block">
                                      Roll: {s.rollNumber}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-gray space-y-0.5">
                              <div className="flex items-center gap-1 text-[11px]">
                                <FiMail size={11} className="opacity-60" /> {s.email}
                              </div>
                              {s.mobile && (
                                <div className="flex items-center gap-1 text-[11px]">
                                  <FiPhone size={11} className="opacity-60" /> {s.mobile}
                                </div>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              {isBoth ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30">
                                  Course + Intern
                                </span>
                              ) : isInternship ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center gap-1 w-fit">
                                  <FiBriefcase size={10} /> Internship
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1 w-fit">
                                  <FiBookOpen size={10} /> Course
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex flex-wrap gap-1.5 max-w-sm">
                                {(s.enrolledDetails || []).map((ed, idx) => (
                                  <span
                                    key={idx}
                                    className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 border ${
                                      ed.type === "internship"
                                        ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/30"
                                        : "bg-primary/10 text-primary border-primary/20"
                                    }`}
                                  >
                                    {ed.type === "internship" ? (
                                      <FiBriefcase size={9} />
                                    ) : (
                                      <FiBookOpen size={9} />
                                    )}
                                    {ed.name || ed.domain || ed.course?.name || "Program"}
                                    {ed.batch
                                      ? ` (${
                                          typeof ed.batch === "object"
                                            ? ed.batch.batchName
                                            : ed.batch
                                        })`
                                      : ""}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-gray text-[11px]">
                              {s.collegeName || "N/A"}
                              {s.department && (
                                <span className="block text-[10px] opacity-75">
                                  {s.department} {s.semester ? `(${s.semester})` : ""}
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-gray text-[11px]">
                              {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "N/A"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorBatches;
