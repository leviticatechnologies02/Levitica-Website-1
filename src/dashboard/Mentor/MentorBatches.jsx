import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiLayers,
  FiUsers,
  FiCalendar,
  FiBookOpen,
  FiUser,
  FiMail,
  FiPhone,
  FiSearch,
} from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";
import { useGetMentorBatchesQuery, useGetMentorStudentsQuery } from "@/Services/mentor/mentorPortalService";

const MentorBatches = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { data: batchesData, isLoading: batchesLoading } = useGetMentorBatchesQuery();
  const { data: studentsData, isLoading: studentsLoading } = useGetMentorStudentsQuery();

  const batches = batchesData?.batches || [];
  const students = studentsData?.students || [];

  const [activeTab, setActiveTab] = useState("batches");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-bold flex items-center gap-2.5 ${
              isDark ? "text-white" : "text-midnight_text"
            }`}>
              <FiLayers className="text-primary" />
              Batches & Enrolled Students
            </h1>
            <p className="text-sm text-gray mt-1">
              View active batches and students enrolled across your assigned mentoring courses.
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
              Enrolled Students ({students.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Batches Grid */}
        {activeTab === "batches" && (
          <div>
            {batchesLoading ? (
              <div className="p-16 text-center text-sm text-gray">Loading batches...</div>
            ) : batches.length === 0 ? (
              <div className={`p-16 rounded-2xl border text-center space-y-3 ${
                isDark ? "bg-semidark border-dark_border" : "bg-white border-border"
              }`}>
                <FiLayers size={40} className="mx-auto text-primary opacity-40" />
                <h3 className="text-lg font-bold">No batches created yet</h3>
                <p className="text-xs text-gray max-w-sm mx-auto">
                  Batches created by Super Admin for your assigned courses will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {batches.map((b) => (
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
                      <div>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                          {b.courseId?.name || "Course Batch"}
                        </span>
                        <h3 className="text-base font-bold mt-2">{b.batchName}</h3>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        b.status === "ongoing"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {b.status || "Active"}
                      </span>
                    </div>

                    <div className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                      isDark ? "bg-darklight/40 border-dark_border" : "bg-slate-50 border-border"
                    }`}>
                      <div className="flex items-center justify-between text-gray">
                        <span className="flex items-center gap-1.5">
                          <FiUsers size={13} className="text-primary" /> Enrolled Students:
                        </span>
                        <span className="font-bold text-slate-200">{b.studentCount || 0} Students</span>
                      </div>
                      {b.startDate && (
                        <div className="flex items-center justify-between text-gray">
                          <span className="flex items-center gap-1.5">
                            <FiCalendar size={13} /> Start Date:
                          </span>
                          <span className="font-semibold">{new Date(b.startDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {b.endDate && (
                        <div className="flex items-center justify-between text-gray">
                          <span className="flex items-center gap-1.5">
                            <FiCalendar size={13} /> End Date:
                          </span>
                          <span className="font-semibold">{new Date(b.endDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Students Table */}
        {activeTab === "students" && (
          <div className="space-y-4">
            <div className="w-full sm:w-80 relative">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray" size={16} />
              <input
                type="text"
                placeholder="Search students by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm border outline-none transition ${
                  isDark
                    ? "bg-semidark border-dark_border text-white focus:border-primary"
                    : "bg-white border-border text-black focus:border-primary"
                }`}
              />
            </div>

            {studentsLoading ? (
              <div className="p-16 text-center text-sm text-gray">Loading students...</div>
            ) : filteredStudents.length === 0 ? (
              <div className={`p-16 rounded-2xl border text-center space-y-2 text-gray ${
                isDark ? "bg-semidark border-dark_border" : "bg-white border-border"
              }`}>
                <FiUsers size={36} className="mx-auto opacity-30 text-primary" />
                <p className="font-semibold text-sm">No students found</p>
              </div>
            ) : (
              <div className={`rounded-2xl border overflow-hidden shadow-sm ${
                isDark ? "bg-semidark border-dark_border" : "bg-white border-border"
              }`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className={`border-b text-[11px] uppercase text-gray font-semibold ${
                        isDark ? "border-dark_border bg-darklight/40" : "border-border bg-gray-50"
                      }`}>
                        <th className="py-3.5 px-4">Student</th>
                        <th className="py-3.5 px-4">Email</th>
                        <th className="py-3.5 px-4">Phone</th>
                        <th className="py-3.5 px-4">Enrolled Courses</th>
                        <th className="py-3.5 px-4">Joined</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? "divide-dark_border" : "divide-border"}`}>
                      {filteredStudents.map((s) => (
                        <tr key={s._id} className="hover:bg-primary/5 transition">
                          <td className="py-3.5 px-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                              {s.name?.charAt(0) || "S"}
                            </div>
                            <span className="font-semibold">{s.name}</span>
                          </td>
                          <td className="py-3.5 px-4 text-gray">{s.email}</td>
                          <td className="py-3.5 px-4 text-gray">{s.mobile || "N/A"}</td>
                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap gap-1">
                              {(s.enrolledDetails || []).map((ed, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20"
                                >
                                  {ed.course?.name} {ed.batch?.batchName && `(${ed.batch.batchName})`}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-gray">
                            {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "N/A"}
                          </td>
                        </tr>
                      ))}
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
