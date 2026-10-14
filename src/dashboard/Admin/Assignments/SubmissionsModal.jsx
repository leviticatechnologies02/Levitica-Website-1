import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiUser,
  FiClock,
  FiAward,
  FiCheckCircle,
  FiAlertCircle,
  FiFileText,
  FiExternalLink,
  FiMessageSquare,
  FiCheck,
  FiRefreshCw,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useTheme } from "@/context/ThemeContext";
import {
  useGetAssignmentSubmissionsQuery,
  useGradeSubmissionMutation,
} from "@/Services/admin/assignmentAdminService";

const normalizeStr = (str) => {
  if (!str || typeof str !== "string") return "";
  return str.trim().toLowerCase().replace(/^[a-d][\.\)]\s*/, "");
};

const isOptionMatching = (optA, optB) => {
  if (!optA || !optB) return false;
  return normalizeStr(optA) === normalizeStr(optB);
};

const SubmissionsModal = ({ isOpen, onClose, assignment }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const assignmentId = assignment?._id;

  const {
    data: submissionsData,
    isLoading,
    refetch,
  } = useGetAssignmentSubmissionsQuery(
    { assignmentId },
    { skip: !assignmentId || !isOpen }
  );

  const [gradeSubmission, { isLoading: isGrading }] = useGradeSubmissionMutation();

  const submissions = submissionsData?.submissions || [];
  const [selectedSub, setSelectedSub] = useState(null);

  // Grade state
  const [marks, setMarks] = useState("");
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState("graded");

  const handleSelectSubmission = (sub) => {
    setSelectedSub(sub);
    setMarks(sub.marksAwarded !== null && sub.marksAwarded !== undefined ? sub.marksAwarded : "");
    setFeedback(sub.feedback || "");
    setStatus(sub.status === "resubmit_requested" ? "resubmit_requested" : "graded");
  };

  const handleSaveGrade = async (customStatus = status) => {
    if (!selectedSub) return;

    if (customStatus === "graded" && (marks === "" || isNaN(marks))) {
      toast.error("Please enter valid marks");
      return;
    }

    try {
      await gradeSubmission({
        submissionId: selectedSub._id,
        marksAwarded: marks !== "" ? Number(marks) : null,
        feedback,
        status: customStatus,
      }).unwrap();

      toast.success(
        customStatus === "resubmit_requested"
          ? "Resubmission requested from student"
          : "Submission graded successfully!"
      );
      refetch();
      setSelectedSub(null);
    } catch (err) {
      console.error("Grading failed:", err);
      toast.error(err?.data?.message || "Failed to submit evaluation");
    }
  };

  if (!isOpen || !assignment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className={`w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden ${
          isDark
            ? "bg-semidark border border-dark_border text-white"
            : "bg-white text-midnight_text border border-border"
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-5 border-b ${
          isDark ? "border-dark_border bg-darklight/40" : "border-border bg-herobg/30"
        }`}>
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FiAward className="text-primary" />
              Submissions: {assignment.title}
            </h2>
            <p className="text-xs text-gray mt-0.5">
              Total Marks: {assignment.totalMarks || 100} • Submissions received: {submissions.length}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray hover:text-white hover:bg-white/10 transition"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* Left Column: Submissions List */}
          <div className={`md:col-span-5 border-r overflow-y-auto p-4 space-y-2.5 ${
            isDark ? "border-dark_border bg-darklight/20" : "border-border bg-gray-50/50"
          }`}>
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-semibold uppercase text-gray">Students ({submissions.length})</span>
              <button onClick={() => refetch()} className="text-xs text-primary hover:underline flex items-center gap-1">
                <FiRefreshCw size={11} /> Refresh
              </button>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-xs text-gray">Loading submissions...</div>
            ) : submissions.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray">No submissions received yet for this assignment.</div>
            ) : (
              submissions.map((sub) => {
                const isSelected = selectedSub?._id === sub._id;
                return (
                  <div
                    key={sub._id}
                    onClick={() => handleSelectSubmission(sub)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition ${
                      isSelected
                        ? isDark
                          ? "bg-primary/20 border-primary text-white"
                          : "bg-primary/10 border-primary text-midnight_text"
                        : isDark
                        ? "bg-darklight/40 border-dark_border hover:border-gray-500"
                        : "bg-white border-border hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center">
                          {sub.student?.name?.[0]?.toUpperCase() || "S"}
                        </div>
                        <div>
                          <p className="text-xs font-bold leading-tight">{sub.student?.name || "Student"}</p>
                          <p className="text-[11px] text-gray truncate">{sub.student?.email}</p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ${
                          sub.status === "graded"
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : sub.status === "resubmit_requested"
                            ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                            : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                        }`}
                      >
                        {sub.status === "graded" ? `${sub.marksAwarded}/${assignment.totalMarks}` : sub.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray mt-2 pt-2 border-t border-dashed border-gray-500/20">
                      <span>{new Date(sub.submittedAt).toLocaleDateString()}</span>
                      {sub.isLate && <span className="text-amber-400 font-medium">Late submission</span>}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Submission Details & Grading */}
          <div className="md:col-span-7 overflow-y-auto p-5 sm:p-6 space-y-6">
            {!selectedSub ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray">
                <FiUser size={36} className="mb-2 opacity-40" />
                <p className="text-sm font-medium">Select a student submission to evaluate</p>
                <p className="text-xs text-gray mt-1">Review their answers, check uploaded code/files, and assign grades.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Student Info Card */}
                <div className={`p-4 rounded-xl border flex items-center justify-between ${
                  isDark ? "bg-darklight/40 border-dark_border" : "bg-herobg/20 border-border"
                }`}>
                  <div>
                    <h4 className="text-sm font-bold">{selectedSub.student?.name}</h4>
                    <p className="text-xs text-gray">{selectedSub.student?.email} • {selectedSub.student?.mobile || "No mobile"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray">
                      Submitted on: {new Date(selectedSub.submittedAt).toLocaleString()}
                    </p>
                    {selectedSub.isLate && <p className="text-xs text-amber-500 font-semibold">Submitted past deadline</p>}
                  </div>
                </div>

                {/* Overall Submission Text & Links */}
                {(selectedSub.submissionText || selectedSub.submissionLink || selectedSub.attachments?.length > 0) && (
                  <div className="space-y-3">
                    <h5 className="text-xs font-semibold uppercase text-gray">Submission Summary</h5>
                    {selectedSub.submissionText && (
                      <p className={`text-xs p-3 rounded-xl border leading-relaxed whitespace-pre-wrap ${
                        isDark ? "bg-darklight/20 border-dark_border" : "bg-gray-50 border-border"
                      }`}>
                        {selectedSub.submissionText}
                      </p>
                    )}

                    {selectedSub.submissionLink && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray">Link:</span>
                        <a
                          href={selectedSub.submissionLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
                        >
                          {selectedSub.submissionLink} <FiExternalLink size={12} />
                        </a>
                      </div>
                    )}

                    {selectedSub.attachments?.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-xs text-gray">Uploaded Files:</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedSub.attachments.map((file, i) => (
                            <a
                              key={i}
                              href={file.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs px-3 py-1.5 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 flex items-center gap-1.5 transition"
                            >
                              <FiFileText size={13} /> {file.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Question-by-Question Answers */}
                <div className="space-y-3">
                  <h5 className="text-xs font-semibold uppercase text-gray">Question-by-Question Responses</h5>
                  {assignment.questions && assignment.questions.length > 0 ? (
                    <div className="space-y-3">
                      {assignment.questions.map((q, idx) => {
                        const studentAnswer = (selectedSub.answers || []).find(
                          (a, aIdx) =>
                            (a.questionId && q._id && a.questionId.toString() === q._id.toString()) ||
                            (a.questionText && q.questionText && a.questionText.trim().toLowerCase() === q.questionText.trim().toLowerCase()) ||
                            aIdx === idx
                        );

                        return (
                          <div
                            key={idx}
                            className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                              isDark ? "bg-darklight/20 border-dark_border" : "bg-gray-50 border-border"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-semibold text-primary">Q{idx + 1}: {q.questionText}</span>
                              <span className="text-gray shrink-0 font-medium">{q.marks} pts</span>
                            </div>

                            {/* Student Answer */}
                            <div className="pt-1">
                              {q.questionType === "mcq" ? (
                                <div className="space-y-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <p className="text-gray">
                                      Selected Option:{" "}
                                      <span className={`font-bold ${isDark ? "text-white" : "text-midnight_text"}`}>
                                        {studentAnswer?.selectedOption || "Not answered"}
                                      </span>
                                    </p>
                                    {q.correctAnswer && studentAnswer?.selectedOption && (
                                      isOptionMatching(studentAnswer.selectedOption, q.correctAnswer) ? (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 flex items-center gap-1">
                                          <FiCheck size={11} /> Correct
                                        </span>
                                      ) : (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 border border-rose-500/30 flex items-center gap-1">
                                          <FiX size={11} /> Incorrect
                                        </span>
                                      )
                                    )}
                                  </div>
                                  {q.correctAnswer && (
                                    <p className={`text-[11px] font-medium ${isDark ? "text-emerald-400" : "text-emerald-700"}`}>Correct Answer: {q.correctAnswer}</p>
                                  )}
                                </div>
                              ) : (
                                <p className="text-gray whitespace-pre-wrap">
                                  Answer: <span className={isDark ? "text-white" : "text-midnight_text"}>{studentAnswer?.answerText || "No answer provided"}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : selectedSub.answers && selectedSub.answers.length > 0 ? (
                    <div className="space-y-3">
                      {selectedSub.answers.map((ans, idx) => (
                        <div
                          key={idx}
                          className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                            isDark ? "bg-darklight/20 border-dark_border" : "bg-gray-50 border-border"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-primary">Q{idx + 1}: {ans.questionText || `Question ${idx + 1}`}</span>
                          </div>
                          <div className="pt-1">
                            {ans.selectedOption ? (
                              <p className="text-gray">
                                Selected Option:{" "}
                                <span className={`font-bold ${isDark ? "text-white" : "text-midnight_text"}`}>
                                  {ans.selectedOption}
                                </span>
                              </p>
                            ) : (
                              <p className="text-gray whitespace-pre-wrap">
                                Answer: <span className={isDark ? "text-white" : "text-midnight_text"}>{ans.answerText || "No answer provided"}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray italic">No structured questions in this assignment.</p>
                  )}
                </div>

                <hr className={isDark ? "border-dark_border" : "border-border"} />

                {/* Evaluation Form */}
                <div className="space-y-4">
                  <h5 className="text-xs font-semibold uppercase text-primary flex items-center gap-1.5">
                    <FiAward /> Evaluation & Feedback
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-gray mb-1">
                        Marks Awarded (Max: {assignment.totalMarks || 100})
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={assignment.totalMarks || 100}
                        value={marks}
                        onChange={(e) => setMarks(e.target.value)}
                        placeholder="e.g. 85"
                        className={`w-full px-3.5 py-2 rounded-xl border text-sm outline-none ${
                          isDark ? "bg-darklight border-dark_border text-white focus:border-primary" : "bg-white border-border focus:border-primary"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-gray mb-1">Status</label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className={`w-full px-3.5 py-2 rounded-xl border text-sm outline-none ${
                          isDark ? "bg-darklight border-dark_border text-white" : "bg-white border-border"
                        }`}
                      >
                        <option value="graded">Graded (Accepted)</option>
                        <option value="resubmit_requested">Request Resubmission</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray mb-1">Instructor Feedback</label>
                    <textarea
                      rows={3}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Add helpful remarks, strengths, and areas of improvement..."
                      className={`w-full px-3.5 py-2 rounded-xl border text-sm outline-none ${
                        isDark ? "bg-darklight border-dark_border text-white focus:border-primary" : "bg-white border-border focus:border-primary"
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      disabled={isGrading}
                      onClick={() => handleSaveGrade("resubmit_requested")}
                      className="px-4 py-2 rounded-xl border border-amber-500/40 text-amber-500 hover:bg-amber-500/10 text-xs font-semibold transition"
                    >
                      Request Resubmission
                    </button>
                    <button
                      type="button"
                      disabled={isGrading}
                      onClick={() => handleSaveGrade("graded")}
                      className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-semibold shadow hover:bg-primary/90 transition flex items-center gap-1.5"
                    >
                      <FiCheck /> {isGrading ? "Saving..." : "Save Grade & Feedback"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SubmissionsModal;
