import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiClipboard,
  FiBookOpen,
  FiBriefcase,
  FiClock,
  FiCheckCircle,
  FiAward,
  FiHelpCircle,
  FiUsers,
  FiEye,
  FiX,
  FiSave,
  FiExternalLink,
  FiDownload,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiSearch,
  FiLayers,
  FiFilter,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useTheme } from "@/context/ThemeContext";

const normalizeStr = (str) => {
  if (!str || typeof str !== "string") return "";
  return str.trim().toLowerCase().replace(/^[a-d][\.\)]\s*/, "");
};

const isOptionMatching = (optA, optB) => {
  if (!optA || !optB) return false;
  return normalizeStr(optA) === normalizeStr(optB);
};
import {
  useGetMentorAssignmentsQuery,
  useGetMentorCoursesQuery,
  useCreateMentorAssignmentMutation,
  useUpdateMentorAssignmentMutation,
  useDeleteMentorAssignmentMutation,
  useGetMentorAssignmentSubmissionsQuery,
  useGradeMentorSubmissionMutation,
} from "@/Services/mentor/mentorPortalService";
import AssignmentModal from "../Admin/Assignments/AssignmentModal";

const MentorAssignments = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [searchParams] = useSearchParams();
  const initialDomainId = searchParams.get("domainId");
  const initialCourseId = searchParams.get("courseId");

  const { data, isLoading, refetch } = useGetMentorAssignmentsQuery();
  const { data: coursesData } = useGetMentorCoursesQuery();
  const mentorCourses = coursesData?.courses || [];
  const mentorInternships = coursesData?.internshipDomains || [];

  const [createMentorAssignment] = useCreateMentorAssignmentMutation();
  const [updateMentorAssignment] = useUpdateMentorAssignmentMutation();
  const [deleteMentorAssignment] = useDeleteMentorAssignmentMutation();

  const assignments = data?.assignments || [];

  // Filter & Search states
  const [activeTab, setActiveTab] = useState(
    initialDomainId ? "internships" : initialCourseId ? "courses" : "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgramId, setSelectedProgramId] = useState(
    initialDomainId || initialCourseId || ""
  );

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editAssignment, setEditAssignment] = useState(null);

  // Review states
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [marksAwarded, setMarksAwarded] = useState("");
  const [feedback, setFeedback] = useState("");

  const {
    data: submissionsData,
    isLoading: submissionsLoading,
    refetch: refetchSubmissions,
  } = useGetMentorAssignmentSubmissionsQuery(selectedAssignment?._id, {
    skip: !selectedAssignment?._id,
  });

  const submissions = submissionsData?.submissions || [];
  const currentAssignment =
    submissionsData?.assignment ||
    assignments.find((item) => item._id === selectedAssignment?._id) ||
    selectedAssignment;
  const assignmentQuestions = currentAssignment?.questions || [];
  const [gradeSubmission, { isLoading: isGrading }] = useGradeMentorSubmissionMutation();

  // Helper to determine type
  const getAssignmentType = (a) => {
    if (!a) return "course";
    if (a.targetType === "internship" || Boolean(a.internshipDomain)) return "internship";
    if (a.targetType === "course" || Boolean(a.course)) return "course";
    if (a.targetType === "all") return "all";
    return "course";
  };

  const courseCount = assignments.filter((a) => getAssignmentType(a) === "course").length;
  const internshipCount = assignments.filter((a) => getAssignmentType(a) === "internship").length;

  const filteredAssignments = assignments.filter((a) => {
    const type = getAssignmentType(a);

    // Tab filter
    if (activeTab === "courses" && type !== "course") return false;
    if (activeTab === "internships" && type !== "internship") return false;

    // Specific program filter
    if (selectedProgramId) {
      const cId = a.course?._id || a.course;
      const dId = a.internshipDomain?._id || a.internshipDomain;
      if (cId !== selectedProgramId && dId !== selectedProgramId) {
        return false;
      }
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const titleMatch = a.title?.toLowerCase().includes(q);
      const descMatch = a.description?.toLowerCase().includes(q);
      const courseMatch = a.course?.name?.toLowerCase().includes(q);
      const domainMatch = a.internshipDomain?.name?.toLowerCase().includes(q);
      const batchMatch = a.batch?.batchName?.toLowerCase().includes(q);
      if (!titleMatch && !descMatch && !courseMatch && !domainMatch && !batchMatch) {
        return false;
      }
    }

    return true;
  });

  const handleOpenGrade = (sub) => {
    setSelectedSubmission(sub);
    setMarksAwarded(sub.marksAwarded !== undefined ? sub.marksAwarded : "");
    setFeedback(sub.feedback || "");
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    if (marksAwarded === "") {
      toast.error("Please enter marks awarded");
      return;
    }

    try {
      await gradeSubmission({
        submissionId: selectedSubmission._id,
        marksAwarded: Number(marksAwarded),
        feedback,
        status: "graded",
      }).unwrap();

      toast.success("Submission graded and feedback sent to student!");
      setSelectedSubmission(null);
      refetchSubmissions();
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to grade submission");
    }
  };

  const handleDeleteAssignment = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete assignment "${title}"?`)) return;

    try {
      await deleteMentorAssignment(id).unwrap();
      toast.success("Assignment deleted successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete assignment");
    }
  };

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-bold flex items-center gap-2.5 ${
              isDark ? "text-white" : "text-midnight_text"
            }`}>
              <FiClipboard className="text-primary" />
              Assignments & Assessments
            </h1>
            <p className="text-sm text-gray mt-1">
              Create assignments, prepare interactive questions for Courses & Industrial Internships, and grade student submissions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Course Count Pill */}
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FiBookOpen size={13} />
              {courseCount} Course{courseCount !== 1 ? "s" : ""}
            </span>

            {/* Internship Count Pill */}
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <FiBriefcase size={13} />
              {internshipCount} Internship{internshipCount !== 1 ? "s" : ""}
            </span>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setEditAssignment(null);
                setIsModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold btn-primary shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <FiPlus className="w-4 h-4" /> Create Assessment
            </motion.button>
          </div>
        </div>

        {/* Filter & Tabs Bar */}
        <div className={`p-3 sm:p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm ${
          isDark ? "bg-semidark border-dark_border" : "bg-white border-border"
        }`}>
          {/* Segmented Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100 dark:bg-darklight/60 border border-transparent dark:border-dark_border self-start sm:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => {
                setActiveTab("all");
                setSelectedProgramId("");
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === "all"
                  ? "bg-primary text-white shadow-sm"
                  : isDark
                    ? "text-gray hover:text-white"
                    : "text-midnight_text/70 hover:text-midnight_text"
              }`}
            >
              <FiLayers size={13} />
              All Assessments
              <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === "all" ? "bg-white/20 text-white" : "bg-gray/20 text-gray"
              }`}>
                {assignments.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("courses");
                setSelectedProgramId("");
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === "courses"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : isDark
                    ? "text-gray hover:text-white"
                    : "text-midnight_text/70 hover:text-midnight_text"
              }`}
            >
              <FiBookOpen size={13} />
              Course Assignments
              <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === "courses" ? "bg-white/20 text-white" : "bg-gray/20 text-gray"
              }`}>
                {courseCount}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("internships");
                setSelectedProgramId("");
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === "internships"
                  ? "bg-amber-600 text-white shadow-sm"
                  : isDark
                    ? "text-gray hover:text-white"
                    : "text-midnight_text/70 hover:text-midnight_text"
              }`}
            >
              <FiBriefcase size={13} />
              Internship Assessments
              <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === "internships" ? "bg-white/20 text-white" : "bg-gray/20 text-gray"
              }`}>
                {internshipCount}
              </span>
            </button>
          </div>

          {/* Search Box & Program Dropdown */}
          <div className="flex items-center gap-2.5 flex-1 md:max-w-md justify-end">
            <div className="relative w-full">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray" size={15} />
              <input
                type="text"
                placeholder={
                  activeTab === "courses"
                    ? "Search course assignments..."
                    : activeTab === "internships"
                    ? "Search internship assessments..."
                    : "Search by title, domain, batch..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-8 py-1.5 text-xs rounded-xl border outline-none transition ${
                  isDark
                    ? "bg-darklight border-dark_border text-white placeholder-gray focus:border-primary"
                    : "bg-white border-border text-midnight_text placeholder-gray focus:border-primary"
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray hover:text-white text-xs cursor-pointer"
                >
                  <FiX size={13} />
                </button>
              )}
            </div>

            {/* Filter by specific Course */}
            {activeTab === "courses" && mentorCourses.length > 0 && (
              <select
                value={selectedProgramId}
                onChange={(e) => setSelectedProgramId(e.target.value)}
                className={`shrink-0 max-w-[150px] truncate px-2.5 py-1.5 text-xs rounded-xl border outline-none cursor-pointer ${
                  isDark ? "bg-darklight border-dark_border text-white" : "bg-white border-border text-midnight_text"
                }`}
              >
                <option value="">All Courses</option>
                {mentorCourses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}

            {/* Filter by specific Internship Domain */}
            {activeTab === "internships" && mentorInternships.length > 0 && (
              <select
                value={selectedProgramId}
                onChange={(e) => setSelectedProgramId(e.target.value)}
                className={`shrink-0 max-w-[170px] truncate px-2.5 py-1.5 text-xs rounded-xl border outline-none cursor-pointer ${
                  isDark ? "bg-darklight border-dark_border text-white" : "bg-white border-border text-midnight_text"
                }`}
              >
                <option value="">All Domains</option>
                {mentorInternships.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Assignments Table */}
        <div className={`rounded-2xl border overflow-hidden shadow-sm ${
          isDark ? "bg-semidark border-dark_border" : "bg-white border-border"
        }`}>
          {isLoading ? (
            <div className="p-16 text-center text-sm text-gray">Loading assessments...</div>
          ) : filteredAssignments.length === 0 ? (
            <div className="p-16 text-center text-gray space-y-3">
              <FiClipboard size={40} className="mx-auto text-primary opacity-30" />
              <p className="font-semibold text-base">
                {assignments.length === 0
                  ? "No assessments created yet"
                  : activeTab === "internships"
                  ? "No internship assessments found"
                  : activeTab === "courses"
                  ? "No course assignments found"
                  : "No assessments match your search"}
              </p>
              <p className="text-xs max-w-sm mx-auto">
                {assignments.length === 0
                  ? "Click 'Create Assessment' above to publish your first assignment or exam for your students."
                  : "Try switching tabs or clearing your search term to see other assessments."}
              </p>
              {assignments.length > 0 ? (
                <button
                  onClick={() => {
                    setActiveTab("all");
                    setSearchQuery("");
                    setSelectedProgramId("");
                  }}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 text-xs font-semibold cursor-pointer hover:bg-primary/20 transition"
                >
                  Clear Filters
                </button>
              ) : (
                <button
                  onClick={() => {
                    setEditAssignment(null);
                    setIsModalOpen(true);
                  }}
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl btn-primary text-xs font-semibold cursor-pointer"
                >
                  <FiPlus /> Create Assessment Now
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className={`border-b text-[11px] uppercase text-gray font-semibold ${
                    isDark ? "border-dark_border bg-darklight/40" : "border-border bg-gray-50"
                  }`}>
                    <th className="py-3.5 px-4">Assessment</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">Program / Domain & Batch</th>
                    <th className="py-3.5 px-4">Questions & Marks</th>
                    <th className="py-3.5 px-4">Due Date</th>
                    <th className="py-3.5 px-4">Submissions</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? "divide-dark_border" : "divide-border"}`}>
                  {filteredAssignments.map((a) => {
                    const type = getAssignmentType(a);
                    const isInternship = type === "internship";
                    const isCourse = type === "course";

                    return (
                      <tr key={a._id} className="hover:bg-primary/5 transition">
                        {/* Title & Description */}
                        <td className="py-4 px-4 max-w-xs">
                          <div className="font-bold text-sm line-clamp-1">{a.title}</div>
                          <p className="text-[11px] text-gray line-clamp-1 mt-0.5">{a.description}</p>
                        </td>

                        {/* Distinct Type Badge */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          {isInternship ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/25">
                              <FiBriefcase size={12} className="shrink-0" />
                              Internship
                            </span>
                          ) : isCourse ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/25">
                              <FiBookOpen size={12} className="shrink-0" />
                              Course
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/25">
                              <FiLayers size={12} className="shrink-0" />
                              General
                            </span>
                          )}
                        </td>

                        {/* Program / Domain Name & Batch */}
                        <td className="py-4 px-4 min-w-[200px] max-w-xs">
                          {isInternship ? (
                            <div>
                              <div
                                className="font-bold text-amber-500 dark:text-amber-400 text-xs line-clamp-1"
                                title={a.internshipDomain?.name || "Industrial Internship"}
                              >
                                {a.internshipDomain?.name || "Industrial Internship"}
                              </div>
                              <div className="text-[11px] text-gray mt-1 flex items-center gap-1">
                                <FiUsers size={11} className="shrink-0 text-gray" />
                                <span>Batch: <strong className={isDark ? "text-slate-300" : "text-slate-700"}>{a.batch?.batchName || "All Batches"}</strong></span>
                              </div>
                            </div>
                          ) : isCourse ? (
                            <div>
                              <div
                                className="font-bold text-primary text-xs line-clamp-1"
                                title={a.course?.name || "Course"}
                              >
                                {a.course?.name || "Course"}
                              </div>
                              <div className="text-[11px] text-gray mt-1 flex items-center gap-1">
                                <FiUsers size={11} className="shrink-0 text-gray" />
                                <span>Batch: <strong className={isDark ? "text-slate-300" : "text-slate-700"}>{a.batch?.batchName || "All Batches"}</strong></span>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="font-semibold text-blue-400 text-xs">General Assessment</div>
                              <div className="text-[11px] text-gray mt-1">All Enrolled Students</div>
                            </div>
                          )}
                        </td>

                        {/* Questions & Total Marks */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="font-semibold flex items-center gap-1">
                            <FiHelpCircle className="text-primary" /> {a.questions?.length || 0} Questions
                          </div>
                          <span className="text-[11px] text-gray">Max {a.totalMarks || 100} pts</span>
                        </td>

                        {/* Due Date */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          {a.dueDate ? (
                            <span className={`font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                              {new Date(a.dueDate).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="text-gray italic">No deadline</span>
                          )}
                        </td>

                        {/* Submissions count */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedAssignment(a)}
                            className="px-2.5 py-1 rounded-xl text-xs font-bold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition cursor-pointer"
                          >
                            {a.totalSubmissions || 0} Submitted
                          </button>
                          {a.pendingReview > 0 && (
                            <span className="block text-[10px] text-amber-400 font-semibold mt-1">
                              {a.pendingReview} pending review
                            </span>
                          )}
                        </td>

                        {/* Action buttons */}
                        <td className="py-4 px-4 text-right whitespace-nowrap space-x-1.5">
                          <button
                            onClick={() => setSelectedAssignment(a)}
                            className="p-2 rounded-lg text-primary hover:bg-primary/10 transition cursor-pointer"
                            title="View & Grade Submissions"
                          >
                            <FiEye size={15} />
                          </button>
                          <button
                            onClick={() => {
                              setEditAssignment(a);
                              setIsModalOpen(true);
                            }}
                            className="p-2 rounded-lg text-gray hover:text-white hover:bg-white/10 transition cursor-pointer"
                            title="Edit Assessment"
                          >
                            <FiEdit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteAssignment(a._id, a.title)}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition cursor-pointer"
                            title="Delete Assessment"
                          >
                            <FiTrash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Assignment Create / Edit Modal (Mentor Mode) */}
      <AssignmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditAssignment(null);
          refetch();
        }}
        assignment={editAssignment}
        customCourses={mentorCourses}
        customInternshipDomains={mentorInternships}
        customCreateMutation={createMentorAssignment}
        customUpdateMutation={updateMentorAssignment}
        isMentor={true}
      />

      {/* Drawer: Submissions Review & Grading */}
      <AnimatePresence>
        {selectedAssignment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-4xl max-h-[85vh] rounded-3xl border overflow-hidden flex flex-col shadow-2xl ${
                isDark ? "bg-semidark border-dark_border text-white" : "bg-white border-border text-midnight_text"
              }`}
            >
              {/* Modal Top */}
              <div className="p-5 border-b flex items-center justify-between border-border/40">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold">{selectedAssignment.title} — Submissions</h3>
                    {getAssignmentType(selectedAssignment) === "internship" ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/25 flex items-center gap-1">
                        <FiBriefcase size={10} /> Internship
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 flex items-center gap-1">
                        <FiBookOpen size={10} /> Course
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray mt-1">
                    {selectedAssignment.internshipDomain
                      ? `Internship Domain: ${selectedAssignment.internshipDomain.name}`
                      : selectedAssignment.course
                      ? `Course: ${selectedAssignment.course.name}`
                      : "General"}{" "}
                    • Batch: {selectedAssignment.batch?.batchName || "All Batches"} • Max Marks:{" "}
                    {selectedAssignment.totalMarks || 100}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedAssignment(null)}
                  className="p-2 rounded-xl text-gray hover:text-white hover:bg-white/10 transition cursor-pointer"
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* Submissions List */}
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                {submissionsLoading ? (
                  <div className="p-12 text-center text-sm text-gray">Loading student submissions...</div>
                ) : submissions.length === 0 ? (
                  <div className="p-12 text-center text-gray space-y-2">
                    <FiUsers size={36} className="mx-auto opacity-30 text-primary" />
                    <p className="font-semibold text-sm">No submissions yet</p>
                    <p className="text-xs">
                      Students enrolled in this {getAssignmentType(selectedAssignment) === "internship" ? "internship domain" : "course"} have not submitted work yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {submissions.map((sub) => {
                      const isGraded = sub.status === "graded";
                      return (
                        <div
                          key={sub._id}
                          className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                            isDark ? "bg-darklight/40 border-dark_border" : "bg-slate-50 border-border"
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm">{sub.student?.name || "Student"}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                isGraded
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              }`}>
                                {sub.status}
                              </span>
                            </div>
                            <p className="text-xs text-gray">
                              {sub.student?.email} • Submitted on {new Date(sub.submittedAt).toLocaleString()}
                            </p>
                            {isGraded && (
                              <p className="text-xs font-semibold text-emerald-400">
                                Score: {sub.marksAwarded} / {selectedAssignment.totalMarks || 100} pts
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() => handleOpenGrade(sub)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shadow-sm ${
                              isGraded
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
                                : "btn-primary"
                            }`}
                          >
                            {isGraded ? "Update Grade & Feedback" : "Review & Grade"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Grade Specific Submission */}
      <AnimatePresence>
        {selectedSubmission && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-2xl max-h-[85vh] rounded-3xl border overflow-hidden flex flex-col shadow-2xl ${
                isDark ? "bg-semidark border-dark_border text-white" : "bg-white border-border text-midnight_text"
              }`}
            >
              <div className="p-5 border-b flex items-center justify-between border-border/40">
                <div>
                  <h3 className="text-lg font-bold">Grade Student Submission</h3>
                  <p className="text-xs text-gray mt-0.5">{selectedSubmission.student?.name} ({selectedSubmission.student?.email})</p>
                </div>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="p-2 rounded-xl text-gray hover:text-white hover:bg-white/10 transition cursor-pointer"
                >
                  <FiX size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveGrade} className="p-6 overflow-y-auto space-y-5 flex-1">
                {/* Answers List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-gray tracking-wider">Submitted Answers:</h4>
                  {assignmentQuestions.length > 0 ? (
                    assignmentQuestions.map((q, idx) => {
                      const studentAnswer = (selectedSubmission.answers || []).find((a, aIdx) => {
                        if (a.questionId && q._id && a.questionId.toString() === q._id.toString()) return true;
                        if (a.questionText && q.questionText && a.questionText.trim().toLowerCase() === q.questionText.trim().toLowerCase()) return true;
                        return aIdx === idx;
                      });

                      const correctAnswer = q.correctAnswer || q.correctOption || q.correct_answer || "";
                      const isMcq = q.questionType === "mcq" || Boolean(q.options && q.options.length > 0) || Boolean(studentAnswer?.selectedOption);
                      const isCorrect = correctAnswer && studentAnswer?.selectedOption && isOptionMatching(studentAnswer.selectedOption, correctAnswer);
                      const isWrong = correctAnswer && studentAnswer?.selectedOption && !isCorrect;

                      return (
                        <div
                          key={q._id || idx}
                          className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                            isDark ? "bg-darklight/40 border-dark_border" : "bg-slate-50 border-border"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-primary">
                              Q{idx + 1}. {q.questionText}
                            </span>
                            <span className="text-gray shrink-0 font-medium">
                              {q.marks || 10} pts
                            </span>
                          </div>

                          {isMcq ? (
                            <div className="space-y-1.5 pt-0.5">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className={`font-semibold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                                  Selected Option:{" "}
                                  <span className={studentAnswer?.selectedOption ? "font-bold" : "italic text-gray-400"}>
                                    {studentAnswer?.selectedOption || "Not answered"}
                                  </span>
                                </p>
                                {isCorrect && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 flex items-center gap-1">
                                    <FiCheck size={11} /> Correct
                                  </span>
                                )}
                                {isWrong && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 border border-rose-500/30 flex items-center gap-1">
                                    <FiX size={11} /> Incorrect
                                  </span>
                                )}
                              </div>
                              {correctAnswer && (
                                <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                                  Correct Answer: {correctAnswer}
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="pt-1">
                              <p className="text-gray mb-1 font-medium">Student Answer:</p>
                              <p
                                className={`whitespace-pre-wrap font-mono text-[11px] p-2.5 rounded-lg ${
                                  isDark ? "text-slate-300 bg-black/25" : "text-slate-800 bg-slate-200/50"
                                }`}
                              >
                                {studentAnswer?.answerText || "No answer provided"}
                              </p>
                            </div>
                          )}

                          {studentAnswer?.fileUrl && (
                            <div className="pt-1">
                              <a
                                href={studentAnswer.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 text-primary hover:underline font-semibold"
                              >
                                <FiDownload size={12} /> Download Student Uploaded Solution
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : selectedSubmission.answers && selectedSubmission.answers.length > 0 ? (
                    selectedSubmission.answers.map((ans, idx) => {
                      const matchingQ = (currentAssignment?.questions || []).find(
                        (q, qIdx) =>
                          (ans.questionId && q._id && q._id.toString() === ans.questionId.toString()) ||
                          (ans.questionText && q.questionText && ans.questionText.trim().toLowerCase() === q.questionText.trim().toLowerCase()) ||
                          qIdx === idx
                      );
                      const correctAnswer = matchingQ?.correctAnswer || matchingQ?.correctOption || "";
                      const isMcq = matchingQ?.questionType === "mcq" || Boolean(ans.selectedOption);
                      const isCorrect = correctAnswer && ans.selectedOption && isOptionMatching(ans.selectedOption, correctAnswer);
                      const isWrong = correctAnswer && ans.selectedOption && !isCorrect;

                      return (
                        <div
                          key={idx}
                          className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                            isDark ? "bg-darklight/40 border-dark_border" : "bg-slate-50 border-border"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-primary">
                              Q{idx + 1}. {matchingQ?.questionText || ans.questionText || `Question ${idx + 1}`}
                            </span>
                            {matchingQ?.marks && <span className="text-gray shrink-0 font-medium">{matchingQ.marks} pts</span>}
                          </div>

                          {isMcq ? (
                            <div className="space-y-1.5 pt-0.5">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className={`font-semibold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                                  Selected Option:{" "}
                                  <span className={ans.selectedOption ? "font-bold" : "italic text-gray-400"}>
                                    {ans.selectedOption || "Not answered"}
                                  </span>
                                </p>
                                {isCorrect && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 flex items-center gap-1">
                                    <FiCheck size={11} /> Correct
                                  </span>
                                )}
                                {isWrong && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 border border-rose-500/30 flex items-center gap-1">
                                    <FiX size={11} /> Incorrect
                                  </span>
                                )}
                              </div>
                              {correctAnswer && (
                                <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                                  Correct Answer: {correctAnswer}
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="pt-1">
                              <p className="text-gray mb-1 font-medium">Student Answer:</p>
                              <p
                                className={`whitespace-pre-wrap font-mono text-[11px] p-2.5 rounded-lg ${
                                  isDark ? "text-slate-300 bg-black/25" : "text-slate-800 bg-slate-200/50"
                                }`}
                              >
                                {ans.answerText || "No answer provided"}
                              </p>
                            </div>
                          )}

                          {ans.fileUrl && (
                            <div className="pt-1">
                              <a
                                href={ans.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 text-primary hover:underline font-semibold"
                              >
                                <FiDownload size={12} /> Download Student Uploaded Solution
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-gray italic">No structured answers found.</p>
                  )}

                  {/* Submission Link if provided */}
                  {selectedSubmission.submissionLink && (
                    <div className="pt-2">
                      <span className="text-xs text-gray block mb-1">External Project Link:</span>
                      <a
                        href={selectedSubmission.submissionLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-semibold"
                      >
                        <FiExternalLink size={13} /> {selectedSubmission.submissionLink}
                      </a>
                    </div>
                  )}
                </div>

                {/* Marks Awarded Input */}
                <div className="space-y-1.5 pt-3 border-t border-border/40">
                  <label className="text-xs font-bold block">
                    Marks Awarded (Max: {currentAssignment?.totalMarks || selectedAssignment?.totalMarks || 100} pts): <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={currentAssignment?.totalMarks || selectedAssignment?.totalMarks || 100}
                    value={marksAwarded}
                    onChange={(e) => setMarksAwarded(e.target.value)}
                    placeholder="Enter score (e.g. 85)"
                    className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition ${
                      isDark
                        ? "bg-darklight border-dark_border text-white focus:border-primary"
                        : "bg-white border-border text-black focus:border-primary"
                    }`}
                  />
                </div>

                {/* Feedback Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold block">Instructor Feedback & Notes:</label>
                  <textarea
                    rows="3"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Great effort! Consider improving the modularity of the functions..."
                    className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition ${
                      isDark
                        ? "bg-darklight border-dark_border text-white focus:border-primary"
                        : "bg-white border-border text-black focus:border-primary"
                    }`}
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setSelectedSubmission(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold btn-gray cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isGrading}
                    className="px-5 py-2 rounded-xl text-xs font-semibold btn-primary cursor-pointer flex items-center gap-2 shadow-md"
                  >
                    <FiSave size={14} />
                    {isGrading ? "Saving Grade..." : "Submit Grade & Feedback"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MentorAssignments;
