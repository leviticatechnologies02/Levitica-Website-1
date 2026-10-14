import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBookOpen,
  FiPlus,
  FiSearch,
  FiFilter,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiHelpCircle,
  FiUsers,
  FiAward,
  FiBriefcase,
  FiLayers,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useTheme } from "@/context/ThemeContext";
import { useCourses } from "@/hooks/useCourses";
import { useGetAllInternshipsDomainsQuery } from "@/Services/paymentServices/internshipsServices";
import {
  useGetAdminAssignmentsQuery,
  useDeleteAssignmentMutation,
} from "@/Services/admin/assignmentAdminService";
import AssignmentModal from "./AssignmentModal";
import SubmissionsModal from "./SubmissionsModal";

const AssignmentManagement = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { courses = [] } = useCourses();
  const { data: internshipDomainsData } = useGetAllInternshipsDomainsQuery();
  const internshipDomains = internshipDomainsData?.data || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTargetType, setSelectedTargetType] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedInternshipDomain, setSelectedInternshipDomain] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const queryParams = {
    search: searchTerm || undefined,
    status: selectedStatus || undefined,
    targetType: selectedTargetType || undefined,
    course: selectedTargetType === "course" || (!selectedTargetType && selectedCourse) ? selectedCourse : undefined,
    internshipDomain:
      selectedTargetType === "internship" || (!selectedTargetType && selectedInternshipDomain)
        ? selectedInternshipDomain
        : undefined,
  };

  const {
    data: assignmentsData,
    isLoading,
    refetch,
  } = useGetAdminAssignmentsQuery(queryParams);

  const [deleteAssignment] = useDeleteAssignmentMutation();

  const assignments = assignmentsData?.assignments || [];

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editAssignment, setEditAssignment] = useState(null);
  const [reviewAssignment, setReviewAssignment] = useState(null);

  // Compute stats
  const totalAssignments = assignments.length;
  const publishedAssignments = assignments.filter((a) => a.status === "published").length;
  const totalSubmissions = assignments.reduce((acc, a) => acc + (a.totalSubmissions || 0), 0);
  const pendingReview = assignments.reduce((acc, a) => acc + (a.pendingReview || 0), 0);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete assignment "${title}"?`)) return;

    try {
      await deleteAssignment(id).unwrap();
      toast.success("Assignment deleted successfully");
      refetch();
    } catch (err) {
      toast.error("Failed to delete assignment");
    }
  };

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-2">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-bold flex items-center gap-2.5 ${
              isDark ? "text-white" : "text-midnight_text"
            }`}>
              <FiBookOpen className="text-primary" />
              Assignments & Questions Management
            </h1>
            <p className="text-sm text-gray mt-1">
              Super Admin panel to create assignments, prepare interactive questions for Courses & Industrial Internships, and evaluate submissions.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setEditAssignment(null);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold btn-primary shadow-md hover:shadow-lg transition cursor-pointer"
          >
            <FiPlus className="w-4 h-4" /> Create Assignment & Questions
          </motion.button>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total Assignments",
              value: totalAssignments,
              icon: <FiBookOpen className="text-primary" size={20} />,
              color: "text-primary",
            },
            {
              label: "Published & Active",
              value: publishedAssignments,
              icon: <FiCheckCircle className="text-emerald-500" size={20} />,
              color: "text-emerald-500",
            },
            {
              label: "Total Submissions",
              value: totalSubmissions,
              icon: <FiUsers className="text-blue-500" size={20} />,
              color: "text-blue-500",
            },
            {
              label: "Pending Review",
              value: pendingReview,
              icon: <FiClock className="text-amber-500" size={20} />,
              color: "text-amber-500",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`p-5 rounded-2xl border transition-all duration-200 ${
                isDark
                  ? "bg-semidark border-dark_border text-white shadow-sm"
                  : "bg-white border-border text-midnight_text shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray uppercase tracking-wider">{stat.label}</span>
                <span className="p-2 rounded-xl bg-gray/10">{stat.icon}</span>
              </div>
              <p className={`text-2xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div className={`p-3.5 sm:p-4 rounded-2xl border flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 ${
          isDark ? "bg-semidark border-dark_border" : "bg-white border-border"
        }`}>
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray" size={16} />
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm border outline-none transition ${
                isDark
                  ? "bg-darklight border-dark_border text-white focus:border-primary"
                  : "bg-white border-border text-black focus:border-primary"
              }`}
            />
          </div>

          {/* Filters Row - Single Line */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-nowrap overflow-x-auto shrink-0 pb-1 xl:pb-0">
            {/* Target Type Filter */}
            <select
              value={selectedTargetType}
              onChange={(e) => {
                setSelectedTargetType(e.target.value);
                if (e.target.value === "course") setSelectedInternshipDomain("");
                if (e.target.value === "internship") setSelectedCourse("");
              }}
              className={`w-auto shrink-0 px-3 py-2 rounded-xl text-xs sm:text-sm border outline-none cursor-pointer ${
                isDark ? "bg-darklight border-dark_border text-white" : "bg-white border-border text-black"
              }`}
            >
              <option value="">All Target Types</option>
              <option value="course">Courses Only</option>
              <option value="internship">Internships Only</option>
              <option value="all">General / All</option>
            </select>

            {/* Course Filter (if course or all types selected) */}
            {selectedTargetType !== "internship" && (
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className={`w-auto shrink-0 max-w-[155px] truncate px-3 py-2 rounded-xl text-xs sm:text-sm border outline-none cursor-pointer ${
                  isDark ? "bg-darklight border-dark_border text-white" : "bg-white border-border text-black"
                }`}
              >
                <option value="">All Courses</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}

            {/* Internship Domain Filter (if internship or all types selected) */}
            {selectedTargetType !== "course" && (
              <select
                value={selectedInternshipDomain}
                onChange={(e) => setSelectedInternshipDomain(e.target.value)}
                className={`w-auto shrink-0 max-w-[170px] truncate px-3 py-2 rounded-xl text-xs sm:text-sm border outline-none cursor-pointer ${
                  isDark ? "bg-darklight border-dark_border text-white" : "bg-white border-border text-black"
                }`}
              >
                <option value="">All Internship Domains</option>
                {internshipDomains.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>
            )}

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={`w-auto shrink-0 px-3 py-2 rounded-xl text-xs sm:text-sm border outline-none cursor-pointer ${
                isDark ? "bg-darklight border-dark_border text-white" : "bg-white border-border text-black"
              }`}
            >
              <option value="">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Assignments Table / List */}
        <div className={`rounded-2xl border overflow-hidden shadow-sm ${
          isDark ? "bg-semidark border-dark_border" : "bg-white border-border"
        }`}>
          {isLoading ? (
            <div className="p-12 text-center text-sm text-gray">Loading assignments...</div>
          ) : assignments.length === 0 ? (
            <div className="p-12 text-center text-gray space-y-2">
              <FiBookOpen size={36} className="mx-auto opacity-30 text-primary" />
              <p className="text-base font-semibold">No assignments found</p>
              <p className="text-xs">Create your first assignment and prepare questions for Course or Internship students.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-[11px] font-semibold uppercase tracking-wider text-gray ${
                    isDark ? "border-dark_border bg-darklight/40" : "border-border bg-gray-50/60"
                  }`}>
                    <th className="py-3.5 px-4">Assignment</th>
                    <th className="py-3.5 px-4">Target Program / Batch</th>
                    <th className="py-3.5 px-4">Questions & Marks</th>
                    <th className="py-3.5 px-4">Due Date</th>
                    <th className="py-3.5 px-4">Submissions</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? "divide-dark_border" : "divide-border"}`}>
                  {assignments.map((assignment) => {
                    const qCount = assignment.questions?.length || 0;
                    const isDuePast =
                      assignment.dueDate && new Date() > new Date(assignment.dueDate);
                    const isInternship =
                      assignment.targetType === "internship" || Boolean(assignment.internshipDomain);

                    return (
                      <tr
                        key={assignment._id}
                        className={`text-xs transition ${
                          isDark ? "hover:bg-darklight/20" : "hover:bg-gray-50/80"
                        }`}
                      >
                        {/* Title & Status */}
                        <td className="py-4 px-4 max-w-xs">
                          <div className="font-semibold text-sm line-clamp-1">{assignment.title}</div>
                          <p className="text-[11px] text-gray line-clamp-1 mt-0.5">
                            {assignment.description}
                          </p>
                          <span
                            className={`inline-block text-[10px] uppercase font-bold px-2 py-0.5 rounded-full mt-1.5 ${
                              assignment.status === "published"
                                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                : "bg-gray/10 text-gray border border-gray/20"
                            }`}
                          >
                            {assignment.status}
                          </span>
                        </td>

                        {/* Target Program / Domain / Batch */}
                        <td className="py-4 px-4">
                          {isInternship ? (
                            <div>
                              <span className="inline-flex items-center gap-1 font-semibold text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                                <FiBriefcase size={11} />
                                {assignment.internshipDomain?.name || "Internship"}
                              </span>
                              <div className="text-[11px] text-gray mt-1">
                                {assignment.batch?.batchName || assignment.batchName || "All Batches"}
                              </div>
                            </div>
                          ) : assignment.targetType === "all" ? (
                            <div>
                              <span className="inline-flex items-center gap-1 font-semibold text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                                <FiLayers size={11} /> All Students
                              </span>
                            </div>
                          ) : (
                            <div>
                              <span className="inline-flex items-center gap-1 font-semibold text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                                <FiBookOpen size={11} />
                                {assignment.course?.name || "All Courses"}
                              </span>
                              <div className="text-[11px] text-gray mt-1">
                                {assignment.batch?.batchName || assignment.batchName || "All Batches"}
                              </div>
                            </div>
                          )}
                        </td>

                        {/* Questions & Marks */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1.5 font-semibold">
                            <FiHelpCircle className="text-primary" /> {qCount} Questions
                          </div>
                          <div className="text-[11px] text-gray mt-0.5">
                            Max {assignment.totalMarks || 100} pts (Pass: {assignment.passingMarks || 40})
                          </div>
                        </td>

                        {/* Due Date */}
                        <td className="py-4 px-4">
                          {assignment.dueDate ? (
                            <div>
                              <span className="font-medium">
                                {new Date(assignment.dueDate).toLocaleDateString()}
                              </span>
                              <p className={`text-[10px] mt-0.5 font-semibold ${
                                isDuePast ? "text-red-400" : "text-emerald-400"
                              }`}>
                                {isDuePast ? "Deadline passed" : "Active"}
                              </p>
                            </div>
                          ) : (
                            <span className="text-gray italic">No due date</span>
                          )}
                        </td>

                        {/* Submissions Stats */}
                        <td className="py-4 px-4">
                          <button
                            onClick={() => setReviewAssignment(assignment)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 font-semibold transition cursor-pointer"
                          >
                            <FiUsers size={12} />
                            {assignment.totalSubmissions || 0} Submitted
                          </button>
                          {assignment.pendingReview > 0 && (
                            <span className="block text-[10px] text-amber-500 font-semibold mt-1">
                              {assignment.pendingReview} pending review
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right space-x-1.5">
                          <button
                            onClick={() => setReviewAssignment(assignment)}
                            className="p-2 rounded-lg text-primary hover:bg-primary/10 transition cursor-pointer"
                            title="View Submissions"
                          >
                            <FiEye size={15} />
                          </button>
                          <button
                            onClick={() => {
                              setEditAssignment(assignment);
                              setIsModalOpen(true);
                            }}
                            className="p-2 rounded-lg text-gray hover:text-white hover:bg-white/10 transition cursor-pointer"
                            title="Edit Assignment"
                          >
                            <FiEdit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(assignment._id, assignment.title)}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition cursor-pointer"
                            title="Delete Assignment"
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

      {/* Assignment Create / Edit Modal */}
      <AssignmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditAssignment(null);
          refetch();
        }}
        assignment={editAssignment}
      />

      {/* Review Submissions Modal */}
      <SubmissionsModal
        isOpen={Boolean(reviewAssignment)}
        onClose={() => {
          setReviewAssignment(null);
          refetch();
        }}
        assignment={reviewAssignment}
      />
    </div>
  );
};

export default AssignmentManagement;
