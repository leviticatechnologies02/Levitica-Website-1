import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBookOpen,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiAward,
  FiHelpCircle,
  FiCalendar,
  FiArrowRight,
  FiFilter,
  FiRefreshCw,
  FiBriefcase,
  FiLayers,
} from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";
import { useGetStudentAssignmentsQuery } from "@/Services/student/assignmentStudentService";
import StudentAssignmentSolveModal from "./StudentAssignmentSolveModal";

const TABS = [
  { id: "all", label: "All Assignments" },
  { id: "pending", label: "Pending / To Do" },
  { id: "submitted", label: "Submitted" },
  { id: "graded", label: "Graded & Evaluated" },
];

const PROGRAM_TYPES = [
  { id: "all", label: "All Programs" },
  { id: "course", label: "Courses", icon: FiBookOpen },
  { id: "internship", label: "Industrial Internships", icon: FiBriefcase },
];

const StudentAssignments = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState("all");
  const [selectedProgramType, setSelectedProgramType] = useState("all");
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const {
    data: assignmentsData,
    isLoading,
    refetch,
  } = useGetStudentAssignmentsQuery(
    activeTab !== "all" ? { filter: activeTab } : undefined
  );

  const rawAssignments = assignmentsData?.assignments || [];

  // Filter by program type (Course vs Internship)
  const assignments = rawAssignments.filter((a) => {
    if (selectedProgramType === "all") return true;
    if (selectedProgramType === "internship") {
      return a.targetType === "internship" || Boolean(a.internshipDomain);
    }
    if (selectedProgramType === "course") {
      return a.targetType === "course" || (Boolean(a.course) && a.targetType !== "internship");
    }
    return true;
  });

  const getStatusBadge = (assignment) => {
    const status = assignment.submissionStatus;
    if (status === "graded") {
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
          <FiAward size={12} /> Graded ({assignment.mySubmission?.marksAwarded}/{assignment.totalMarks})
        </span>
      );
    }
    if (status === "submitted" || status === "resubmitted") {
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center gap-1">
          <FiCheckCircle size={12} /> Under Review
        </span>
      );
    }
    if (status === "late_submitted") {
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
          <FiClock size={12} /> Late Submission
        </span>
      );
    }
    if (status === "overdue") {
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-500/15 text-red-400 border border-red-500/30 flex items-center gap-1">
          <FiAlertCircle size={12} /> Overdue
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
        <FiClock size={12} /> To Do
      </span>
    );
  };

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-2">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-bold flex items-center gap-2.5 ${
              isDark ? "text-white" : "text-midnight_text"
            }`}>
              <FiBookOpen className="text-primary" />
              My Assignments & Questions
            </h1>
            <p className="text-sm text-gray mt-1">
              Complete questions and assignments assigned to your enrolled courses and industrial internship domains.
            </p>
          </div>

          <button
            onClick={() => refetch()}
            className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              isDark ? "border-dark_border text-gray hover:bg-darklight hover:text-white" : "border-border text-gray hover:bg-gray-100 hover:text-black"
            }`}
          >
            <FiRefreshCw size={13} /> Refresh
          </button>
        </div>

        {/* Tab & Program Filters Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-md"
                    : isDark
                    ? "bg-darklight/40 border border-dark_border text-gray hover:text-white"
                    : "bg-white border border-border text-gray hover:text-black"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Program Type Pills (Courses vs Internships) */}
          <div className="flex items-center gap-2">
            {PROGRAM_TYPES.map((pt) => {
              const Icon = pt.icon;
              return (
                <button
                  key={pt.id}
                  onClick={() => setSelectedProgramType(pt.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    selectedProgramType === pt.id
                      ? "bg-indigo-600 text-white shadow-sm"
                      : isDark
                      ? "bg-darklight/30 border border-dark_border text-gray hover:text-white"
                      : "bg-gray-100 border border-border text-gray hover:text-black"
                  }`}
                >
                  {Icon && <Icon size={12} />}
                  {pt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Assignments Cards Grid */}
        {isLoading ? (
          <div className="p-16 text-center text-sm text-gray">Loading your assignments...</div>
        ) : assignments.length === 0 ? (
          <div className={`p-16 rounded-2xl border text-center space-y-3 ${
            isDark ? "bg-semidark border-dark_border" : "bg-white border-border"
          }`}>
            <FiCheckCircle size={40} className="mx-auto text-emerald-400 opacity-60" />
            <h3 className="text-lg font-bold">No assignments found</h3>
            <p className="text-xs text-gray max-w-sm mx-auto">
              You are all caught up! Assignments created for your courses and internships will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {assignments.map((assignment) => {
              const qCount = assignment.questions?.length || 0;
              const isGraded = assignment.submissionStatus === "graded";
              const isSubmitted =
                assignment.submissionStatus === "submitted" ||
                assignment.submissionStatus === "late_submitted" ||
                assignment.submissionStatus === "resubmitted";
              const isInternship =
                assignment.targetType === "internship" || Boolean(assignment.internshipDomain);

              return (
                <motion.div
                  key={assignment._id}
                  whileHover={{ y: -3 }}
                  className={`rounded-2xl border p-5 flex flex-col justify-between shadow-sm transition ${
                    isDark
                      ? "bg-semidark border-dark_border text-white hover:border-primary/40"
                      : "bg-white border-border text-midnight_text hover:border-primary/40"
                  }`}
                >
                  <div className="space-y-3">
                    {/* Course/Internship & Status Pill */}
                    <div className="flex items-center justify-between gap-2">
                      {isInternship ? (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 truncate max-w-[170px] flex items-center gap-1">
                          <FiBriefcase size={11} /> {assignment.internshipDomain?.name || "Internship"}
                        </span>
                      ) : assignment.targetType === "all" ? (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 truncate max-w-[170px] flex items-center gap-1">
                          <FiLayers size={11} /> General
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 truncate max-w-[170px] flex items-center gap-1">
                          <FiBookOpen size={11} /> {assignment.course?.name || "Course"}
                        </span>
                      )}
                      {getStatusBadge(assignment)}
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="text-base font-bold line-clamp-2 leading-snug">
                        {assignment.title}
                      </h3>
                      <p className="text-xs text-gray line-clamp-2 mt-1">
                        {assignment.description}
                      </p>
                    </div>

                    {/* Metadata: Questions & Due Date */}
                    <div className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                      isDark ? "bg-darklight/40 border-dark_border" : "bg-herobg/20 border-border"
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-gray flex items-center gap-1">
                          <FiHelpCircle size={13} className="text-primary" /> Questions:
                        </span>
                        <span className="font-semibold">{qCount} Question{qCount !== 1 ? "s" : ""}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray flex items-center gap-1">
                          <FiAward size={13} className="text-amber-400" /> Max Score:
                        </span>
                        <span className="font-semibold">{assignment.totalMarks || 100} pts</span>
                      </div>

                      {assignment.dueDate && (
                        <div className="flex items-center justify-between pt-1 border-t border-gray-500/20">
                          <span className="text-gray flex items-center gap-1">
                            <FiCalendar size={13} /> Due Date:
                          </span>
                          <span className={`font-semibold ${
                            assignment.isOverdue ? "text-red-400" : "text-gray-300"
                          }`}>
                            {new Date(assignment.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4 mt-2">
                    <button
                      onClick={() => setSelectedAssignment(assignment)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm cursor-pointer ${
                        isGraded
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
                          : isSubmitted
                          ? "bg-blue-500/15 text-blue-400 border border-blue-500/30 hover:bg-blue-500/25"
                          : "btn-primary hover:opacity-90"
                      }`}
                    >
                      {isGraded
                        ? "View Evaluation & Score"
                        : isSubmitted
                        ? "View My Submission"
                        : "Start / Solve Assignment"}
                      <FiArrowRight size={13} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Solving & Submission Modal */}
      <StudentAssignmentSolveModal
        isOpen={Boolean(selectedAssignment)}
        onClose={() => setSelectedAssignment(null)}
        assignment={selectedAssignment}
        refetchList={refetch}
      />
    </div>
  );
};

export default StudentAssignments;
