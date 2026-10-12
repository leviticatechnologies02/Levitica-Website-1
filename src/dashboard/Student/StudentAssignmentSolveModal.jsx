import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiCheckCircle,
  FiClock,
  FiAward,
  FiFileText,
  FiExternalLink,
  FiUploadCloud,
  FiCheck,
  FiAlertCircle,
  FiSend,
  FiHelpCircle,
  FiMessageSquare,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useTheme } from "@/context/ThemeContext";
import { useSubmitAssignmentMutation } from "@/Services/student/assignmentStudentService";

const StudentAssignmentSolveModal = ({ isOpen, onClose, assignment, refetchList }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [submitAssignment, { isLoading: isSubmitting }] = useSubmitAssignmentMutation();

  const isSubmitted =
    assignment?.submissionStatus === "submitted" ||
    assignment?.submissionStatus === "resubmitted" ||
    assignment?.submissionStatus === "late_submitted" ||
    assignment?.submissionStatus === "graded";

  const isGraded = assignment?.submissionStatus === "graded";
  const mySubmission = assignment?.mySubmission;

  // Student answer state
  const [submissionText, setSubmissionText] = useState("");
  const [submissionLink, setSubmissionLink] = useState("");
  const [files, setFiles] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (mySubmission) {
      setSubmissionText(mySubmission.submissionText || "");
      setSubmissionLink(mySubmission.submissionLink || "");
      const answerMap = {};
      (mySubmission.answers || []).forEach((a) => {
        const qId = a.questionId || a.questionText;
        answerMap[qId] = {
          answerText: a.answerText || "",
          selectedOption: a.selectedOption || null,
        };
      });
      setAnswers(answerMap);
    } else {
      setSubmissionText("");
      setSubmissionLink("");
      setFiles([]);
      setAnswers({});
    }
  }, [assignment, isOpen]);

  const handleAnswerChange = (qIdentifier, field, value) => {
    setAnswers((prev) => ({
      ...prev,
      [qIdentifier]: {
        ...(prev[qIdentifier] || {}),
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!assignment?._id) return;

    // Format answers array
    const formattedAnswers = (assignment.questions || []).map((q) => {
      const qKey = q._id || q.questionText;
      const ansObj = answers[qKey] || {};
      return {
        questionId: q._id,
        questionText: q.questionText,
        answerText: ansObj.answerText || "",
        selectedOption: ansObj.selectedOption || null,
      };
    });

    try {
      const formData = new FormData();
      if (submissionText) formData.append("submissionText", submissionText);
      if (submissionLink) formData.append("submissionLink", submissionLink);
      formData.append("answers", JSON.stringify(formattedAnswers));

      if (files && files.length > 0) {
        Array.from(files).forEach((file) => {
          formData.append("attachments", file);
        });
      }

      await submitAssignment({
        id: assignment._id,
        body: formData,
      }).unwrap();

      toast.success(
        assignment.isOverdue
          ? "Assignment submitted late successfully!"
          : "Assignment submitted successfully!"
      );
      if (refetchList) refetchList();
      onClose();
    } catch (err) {
      console.error("Submission failed:", err);
      toast.error(err?.data?.message || "Failed to submit assignment");
    }
  };

  if (!isOpen || !assignment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className={`w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden ${
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
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/20 text-primary font-bold">
                {assignment.course?.name || "General"}
              </span>
              {assignment.dueDate && (
                <span className="text-xs text-gray flex items-center gap-1">
                  <FiClock size={12} /> Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold mt-1">{assignment.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray hover:text-white hover:bg-white/10 transition"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Modal Scroll Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Graded Result Banner if available */}
          {isGraded && mySubmission && (
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                  <FiAward size={18} /> Evaluation Result
                </span>
                <span className="text-sm font-bold bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-xl">
                  Score: {mySubmission.marksAwarded} / {assignment.totalMarks || 100}
                </span>
              </div>
              {mySubmission.feedback && (
                <p className="text-xs text-emerald-200/90 pt-1 border-t border-emerald-500/20">
                  <strong className="text-white">Instructor Feedback:</strong> {mySubmission.feedback}
                </p>
              )}
            </div>
          )}

          {/* Description & Instructions */}
          <div className={`p-4 rounded-xl border ${
            isDark ? "bg-darklight/30 border-dark_border" : "bg-herobg/20 border-border"
          }`}>
            <h4 className="text-xs font-semibold uppercase text-primary mb-1">Instructions</h4>
            <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-gray-200">
              {assignment.description}
            </p>

            {/* Attachments / Reference links provided by Admin */}
            {(assignment.attachments?.length > 0 || assignment.referenceLinks?.length > 0) && (
              <div className="mt-3 pt-3 border-t border-gray-500/20 flex flex-wrap gap-2 items-center">
                <span className="text-xs font-semibold text-gray">Resources:</span>
                {(assignment.attachments || []).map((att, i) => (
                  <a
                    key={i}
                    href={att.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs px-2.5 py-1 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 flex items-center gap-1 transition"
                  >
                    <FiFileText size={12} /> {att.name}
                  </a>
                ))}
                {(assignment.referenceLinks || []).map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs px-2.5 py-1 rounded-lg border border-border text-primary hover:underline flex items-center gap-1 transition"
                  >
                    <FiExternalLink size={12} /> {link.title || link.url}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Questions Section Prepared by Super Admin */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary flex items-center gap-2">
              <FiHelpCircle /> Questions ({assignment.questions?.length || 0})
            </h3>

            {(!assignment.questions || assignment.questions.length === 0) ? (
              <p className="text-xs text-gray italic">
                Please submit your solution using the form below.
              </p>
            ) : (
              <div className="space-y-4">
                {assignment.questions.map((q, idx) => {
                  const qKey = q._id || q.questionText;
                  const currentAns = answers[qKey] || {};

                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border space-y-3 transition ${
                        isDark ? "bg-darklight/40 border-dark_border" : "bg-gray-50/80 border-border"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-xs sm:text-sm">
                          <span className="text-primary font-bold">Q{idx + 1}.</span> {q.questionText}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary font-bold shrink-0">
                          {q.marks || 10} pts
                        </span>
                      </div>

                      {/* Question Answer Inputs */}
                      {q.questionType === "mcq" ? (
                        <div className="space-y-2 pl-2">
                          {(q.options || []).map((opt, optIdx) => {
                            const isSelected = currentAns.selectedOption === opt;
                            return (
                              <label
                                key={optIdx}
                                className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer text-xs transition ${
                                  isSelected
                                    ? "bg-primary/15 border-primary text-white font-medium"
                                    : isDark
                                    ? "bg-darklight border-dark_border hover:border-gray-500"
                                    : "bg-white border-border hover:border-gray-300"
                                } ${isGraded ? "cursor-default" : ""}`}
                              >
                                <input
                                  type="radio"
                                  name={`q_${idx}`}
                                  disabled={isGraded}
                                  checked={isSelected}
                                  onChange={() => handleAnswerChange(qKey, "selectedOption", opt)}
                                  className="accent-primary w-4 h-4"
                                />
                                <span>{opt}</span>
                              </label>
                            );
                          })}
                        </div>
                      ) : (
                        <textarea
                          rows={3}
                          disabled={isGraded}
                          value={currentAns.answerText || ""}
                          onChange={(e) => handleAnswerChange(qKey, "answerText", e.target.value)}
                          placeholder="Write your answer here..."
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition disabled:opacity-75 ${
                            isDark
                              ? "bg-darklight border-dark_border text-white focus:border-primary"
                              : "bg-white border-border text-black focus:border-primary"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <hr className={isDark ? "border-dark_border" : "border-border"} />

          {/* Submission Form: Links, Files, Remarks */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary flex items-center gap-2">
              <FiSend /> Solution Links & Attachments
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray mb-1">
                  Submission Link (GitHub / Figma / Google Drive)
                </label>
                <input
                  type="url"
                  disabled={isGraded}
                  value={submissionLink}
                  onChange={(e) => setSubmissionLink(e.target.value)}
                  placeholder="https://github.com/username/project"
                  className={`w-full px-3.5 py-2 rounded-xl border text-xs sm:text-sm outline-none ${
                    isDark ? "bg-darklight border-dark_border text-white focus:border-primary" : "bg-white border-border focus:border-primary"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray mb-1">
                  Attach Solution Files (PDF, Code ZIP, Screenshots)
                </label>
                <input
                  type="file"
                  multiple
                  disabled={isGraded}
                  onChange={(e) => setFiles(e.target.files)}
                  className="w-full text-xs text-gray file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:opacity-90 cursor-pointer disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray mb-1">
                Additional Notes / Summary
              </label>
              <textarea
                rows={2}
                disabled={isGraded}
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                placeholder="Optional notes or summary of your work..."
                className={`w-full px-3.5 py-2 rounded-xl border text-xs sm:text-sm outline-none ${
                  isDark ? "bg-darklight border-dark_border text-white focus:border-primary" : "bg-white border-border focus:border-primary"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className={`p-4 border-t flex items-center justify-between ${
          isDark ? "border-dark_border bg-darklight/30" : "border-border bg-gray-50"
        }`}>
          <div>
            {isSubmitted && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <FiCheckCircle size={14} /> Submitted on {new Date(mySubmission.submittedAt).toLocaleDateString()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl border text-xs font-semibold transition ${
                isDark ? "border-dark_border text-gray hover:bg-darklight" : "border-border text-gray hover:bg-gray-100"
              }`}
            >
              Close
            </button>
            {!isGraded && (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="px-6 py-2 rounded-xl bg-primary text-white text-xs font-semibold shadow hover:bg-primary/90 transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <FiSend size={13} />
                {isSubmitting
                  ? "Submitting..."
                  : isSubmitted
                  ? "Update / Resubmit"
                  : "Submit Assignment"}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentAssignmentSolveModal;
