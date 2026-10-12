import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiClipboard,
  FiBookOpen,
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
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useTheme } from "@/context/ThemeContext";
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

  const { data, isLoading, refetch } = useGetMentorAssignmentsQuery();
  const { data: coursesData } = useGetMentorCoursesQuery();
  const mentorCourses = coursesData?.courses || [];
  const mentorInternships = coursesData?.internshipDomains || [];

  const [createMentorAssignment] = useCreateMentorAssignmentMutation();
  const [updateMentorAssignment] = useUpdateMentorAssignmentMutation();
  const [deleteMentorAssignment] = useDeleteMentorAssignmentMutation();

  const assignments = data?.assignments || [];

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
  const [gradeSubmission, { isLoading: isGrading }] = useGradeMentorSubmissionMutation();

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
              Course Assignments & Student Evaluation
            </h1>
            <p className="text-sm text-gray mt-1">
              Create assignments, prepare interactive questions for your courses, and grade student submissions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block px-3.5 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
              {assignments.length} Course Assignment{assignments.length !== 1 ? "s" : ""}
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
              <FiPlus className="w-4 h-4" /> Create Assignment & Questions
            </motion.button>
          </div>
        </div>

        {/* Assignments Table */}
        <div className={`rounded-2xl border overflow-hidden shadow-sm ${
          isDark ? "bg-semidark border-dark_border" : "bg-white border-border"
        }`}>
          {isLoading ? (
            <div className="p-16 text-center text-sm text-gray">Loading assignments...</div>
          ) : assignments.length === 0 ? (
            <div className="p-16 text-center text-gray space-y-3">
              <FiClipboard size={40} className="mx-auto text-primary opacity-30" />
              <p className="font-semibold text-base">No assignments for your courses</p>
              <p className="text-xs max-w-sm mx-auto">
                Click "Create Assignment & Questions" above to publish your first assignment for your students.
              </p>
              <button
                onClick={() => {
                  setEditAssignment(null);
                  setIsModalOpen(true);
                }}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl btn-primary text-xs font-semibold cursor-pointer"
              >
                <FiPlus /> Create Assignment Now
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className={`border-b text-[11px] uppercase text-gray font-semibold ${
                    isDark ? "border-dark_border bg-darklight/40" : "border-border bg-gray-50"
                  }`}>
                    <th className="py-3.5 px-4">Assignment</th>
                    <th className="py-3.5 px-4">Course / Batch</th>
                    <th className="py-3.5 px-4">Questions & Marks</th>
                    <th className="py-3.5 px-4">Due Date</th>
                    <th className="py-3.5 px-4">Submissions</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? "divide-dark_border" : "divide-border"}`}>
                  {assignments.map((a) => (
                    <tr key={a._id} className="hover:bg-primary/5 transition">
                      <td className="py-4 px-4 max-w-xs">
                        <div className="font-bold text-sm line-clamp-1">{a.title}</div>
                        <p className="text-[11px] text-gray line-clamp-1 mt-0.5">{a.description}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-primary">{a.course?.name || "General"}</span>
                        <div className="text-[11px] text-gray mt-0.5">{a.batch?.batchName || "All Batches"}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold flex items-center gap-1">
                          <FiHelpCircle className="text-primary" /> {a.questions?.length || 0} Questions
                        </div>
                        <span className="text-[11px] text-gray">Max {a.totalMarks || 100} pts</span>
                      </td>
                      <td className="py-4 px-4">
                        {a.dueDate ? (
                          <span className="font-semibold text-slate-300">
                            {new Date(a.dueDate).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-gray italic">No deadline</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
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
                      <td className="py-4 px-4 text-right space-x-1.5">
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
                          title="Edit Assignment"
                        >
                          <FiEdit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteAssignment(a._id, a.title)}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition cursor-pointer"
                          title="Delete Assignment"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
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
                  <h3 className="text-lg font-bold">{selectedAssignment.title} — Submissions</h3>
                  <p className="text-xs text-gray mt-0.5">
                    Course: {selectedAssignment.course?.name} • Max Marks: {selectedAssignment.totalMarks || 100}
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
                    <p className="text-xs">Students enrolled in this course have not submitted work yet.</p>
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
                  {selectedSubmission.answers && selectedSubmission.answers.length > 0 ? (
                    selectedSubmission.answers.map((ans, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                          isDark ? "bg-darklight/40 border-dark_border" : "bg-slate-50 border-border"
                        }`}
                      >
                        <span className="font-bold text-primary">Question {idx + 1} ({ans.questionType}):</span>
                        {ans.selectedOption && (
                          <p className="font-semibold text-slate-200">Selected Option: {ans.selectedOption}</p>
                        )}
                        {ans.answerText && (
                          <p className="whitespace-pre-wrap text-slate-300 font-mono text-[11px] bg-black/20 p-2 rounded-lg">
                            {ans.answerText}
                          </p>
                        )}
                        {ans.fileUrl && (
                          <a
                            href={ans.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-primary hover:underline font-semibold"
                          >
                            <FiDownload size={12} /> Download Student Uploaded Solution
                          </a>
                        )}
                      </div>
                    ))
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
                    Marks Awarded (Max: {selectedAssignment?.totalMarks || 100} pts): <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={selectedAssignment?.totalMarks || 100}
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
