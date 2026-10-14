import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiX,
  FiXCircle,
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
  FiRefreshCw,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useTheme } from "@/context/ThemeContext";
import {
  useSubmitAssignmentMutation,
  useGetStudentAssignmentDetailsQuery,
} from "@/Services/student/assignmentStudentService";

// Helper functions for comparing student answers with question keys
const normalizeStr = (str) => {
  if (!str || typeof str !== "string") return "";
  return str.trim().toLowerCase().replace(/^[a-d][\.\)]\s*/, "");
};

const isOptionMatching = (optA, optB) => {
  if (!optA || !optB) return false;
  return normalizeStr(optA) === normalizeStr(optB);
};

const getCorrectAnswerForQuestion = (q, currentAns) => {
  if (q.correctAnswer && typeof q.correctAnswer === "string" && q.correctAnswer.trim() !== "") {
    return q.correctAnswer.trim();
  }
  if (q.correctOption && typeof q.correctOption === "string" && q.correctOption.trim() !== "") {
    return q.correctOption.trim();
  }
  if (q.correct_answer && typeof q.correct_answer === "string" && q.correct_answer.trim() !== "") {
    return q.correct_answer.trim();
  }
  if (q.answer && typeof q.answer === "string" && q.answer.trim() !== "") {
    return q.answer.trim();
  }
  // Check if saved as option index
  if (
    q.options &&
    q.options.length > 0 &&
    (typeof q.correctAnswer === "number" || (!isNaN(q.correctAnswer) && q.correctAnswer !== null && q.correctAnswer !== ""))
  ) {
    const idx = Number(q.correctAnswer);
    if (idx >= 0 && idx < q.options.length) {
      return q.options[idx];
    }
  }
  return currentAns?.correctAnswer || "";
};

const StudentAssignmentSolveModal = ({ isOpen, onClose, assignment, refetchList }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [submitAssignment, { isLoading: isSubmitting }] = useSubmitAssignmentMutation();

  // Fetch complete, live details when modal opens
  const { data: detailsData } = useGetStudentAssignmentDetailsQuery(assignment?._id, {
    skip: !assignment?._id || !isOpen,
    refetchOnMountOrArgChange: true,
  });

  // Ensure fetched details actually match this assignment and not cached data from another assignment
  const fetchedAssignment =
    detailsData?.assignment?._id?.toString() === assignment?._id?.toString()
      ? detailsData.assignment
      : null;

  const currentAssignment = fetchedAssignment || assignment;
  const mySubmission = currentAssignment?.mySubmission;

  const status = currentAssignment?.submissionStatus || mySubmission?.status;
  const isGraded = status === "graded" || mySubmission?.status === "graded";
  const isResubmitRequested = status === "resubmit_requested";
  const isSubmitted =
    status === "submitted" ||
    status === "resubmitted" ||
    status === "late_submitted" ||
    isGraded;

  // Evaluated: Either graded or marks were assigned
  const isEvaluated =
    isGraded ||
    (mySubmission?.marksAwarded !== null && mySubmission?.marksAwarded !== undefined);

  // Editable only if:
  // 1) Not yet submitted, OR
  // 2) Mentor/Admin has explicitly requested a resubmission
  const canEditAndSubmit = !isSubmitted || isResubmitRequested;
  const isReadOnly = !canEditAndSubmit;

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
      (mySubmission.answers || []).forEach((a, idx) => {
        const ansObj = {
          ...a,
          answerText: a.answerText || "",
          selectedOption: a.selectedOption || null,
        };
        if (a.questionId) {
          const strId = a.questionId.toString();
          answerMap[strId] = ansObj;
          answerMap[a.questionId] = ansObj;
        }
        if (a.questionText) {
          answerMap[a.questionText.trim()] = ansObj;
        }
        answerMap[idx] = ansObj;
      });
      setAnswers(answerMap);
    } else {
      setSubmissionText("");
      setSubmissionLink("");
      setFiles([]);
      setAnswers({});
    }
  }, [assignment?._id, currentAssignment?._id, mySubmission, isOpen]);

  // Robust answer lookup for a question
  const getQuestionAnswer = (q, idx) => {
    const qIdStr = q._id ? q._id.toString() : null;
    return (
      (q._id && answers[q._id]) ||
      (qIdStr && answers[qIdStr]) ||
      (q.questionText && answers[q.questionText.trim()]) ||
      answers[idx] ||
      {}
    );
  };

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
    if (e) e.preventDefault();
    if (!currentAssignment?._id) return;

    // Format answers array
    const formattedAnswers = (currentAssignment.questions || []).map((q, idx) => {
      const qKey = q._id ? q._id.toString() : q.questionText;
      const ansObj = getQuestionAnswer(q, idx);
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
        id: currentAssignment._id,
        body: formData,
      }).unwrap();

      toast.success(
        isResubmitRequested
          ? "Revised assessment resubmitted successfully!"
          : currentAssignment.isOverdue
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

  if (!isOpen || !currentAssignment) return null;

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
        <div
          className={`flex items-center justify-between p-5 border-b ${
            isDark ? "border-dark_border bg-darklight/40" : "border-border bg-herobg/30"
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/20 text-primary font-bold">
                {currentAssignment.course?.name || currentAssignment.internshipDomain?.name || "General"}
              </span>
              {currentAssignment.dueDate && (
                <span className="text-xs text-gray flex items-center gap-1">
                  <FiClock size={12} /> Due: {new Date(currentAssignment.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold mt-1">{currentAssignment.title}</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl text-gray transition cursor-pointer ${
              isDark ? "hover:text-white hover:bg-white/10" : "hover:text-midnight_text hover:bg-black/5"
            }`}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Modal Scroll Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* 1. Status Banners */}
          {/* A) Resubmission Requested Banner */}
          {isResubmitRequested && (
            <div className={`p-4 rounded-xl border space-y-2 ${
              isDark
                ? "border-amber-500/40 bg-amber-500/10"
                : "border-amber-200 bg-amber-50/90 text-amber-900"
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-bold flex items-center gap-1.5 ${
                  isDark ? "text-amber-400" : "text-amber-800"
                }`}>
                  <FiRefreshCw size={16} /> Resubmission Requested
                </span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  isDark
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                    : "bg-amber-100 text-amber-800 border-amber-300"
                }`}>
                  Action Required
                </span>
              </div>
              <p className={`text-xs leading-relaxed ${
                isDark ? "text-amber-200/90" : "text-amber-900"
              }`}>
                Your mentor or administrator has requested that you revise and resubmit your answers for this assessment. Your previous selections are loaded below. Please make the required updates and submit.
              </p>
              {mySubmission?.feedback && (
                <div className={`pt-2 mt-1 border-t text-xs ${
                  isDark ? "border-amber-500/20" : "border-amber-200"
                }`}>
                  <span className={`font-bold ${isDark ? "text-white" : "text-amber-950"}`}>
                    Mentor Feedback / Instructions:
                  </span>{" "}
                  <span className={isDark ? "text-amber-100" : "text-amber-900 font-medium"}>
                    {mySubmission.feedback}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* B) Under Review Banner (Submitted, View Only) */}
          {isSubmitted && !isGraded && !isResubmitRequested && (
            <div className={`p-4 rounded-xl border flex items-start justify-between gap-3 ${
              isDark
                ? "border-blue-500/30 bg-blue-500/10"
                : "border-blue-200 bg-blue-50/80"
            }`}>
              <div className="flex items-start gap-2.5">
                <FiCheckCircle
                  size={18}
                  className={`shrink-0 mt-0.5 ${isDark ? "text-blue-400" : "text-blue-600"}`}
                />
                <div>
                  <h4 className={`text-xs font-bold ${isDark ? "text-blue-300" : "text-blue-900"}`}>
                    Submission Under Review (View Only)
                  </h4>
                  <p className={`text-xs mt-0.5 leading-relaxed ${
                    isDark ? "text-blue-200/80" : "text-blue-800"
                  }`}>
                    You have submitted this assessment on {mySubmission?.submittedAt ? new Date(mySubmission.submittedAt).toLocaleDateString() : "recently"}. Your submitted answers are displayed below. Resubmission is currently locked and will become active only if your mentor or administrator requests revisions.
                  </p>
                </div>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg shrink-0 border ${
                isDark
                  ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                  : "bg-blue-100 text-blue-700 border-blue-200"
              }`}>
                View Only
              </span>
            </div>
          )}

          {/* C) Graded Result Banner */}
          {isGraded && mySubmission && (
            <div className={`p-4 rounded-xl border space-y-2 ${
              isDark
                ? "border-emerald-500/30 bg-emerald-500/10"
                : "border-emerald-200 bg-emerald-50/80"
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-bold flex items-center gap-1.5 ${
                  isDark ? "text-emerald-400" : "text-emerald-800"
                }`}>
                  <FiAward size={18} /> Evaluation Result
                </span>
                <span className={`text-sm font-bold px-3 py-1 rounded-xl border ${
                  isDark
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    : "bg-emerald-100 text-emerald-800 border-emerald-200"
                }`}>
                  Score: {mySubmission.marksAwarded} / {currentAssignment.totalMarks || 100}
                </span>
              </div>
              {mySubmission.feedback && (
                <p className={`text-xs pt-1 border-t ${
                  isDark
                    ? "text-emerald-200/90 border-emerald-500/20"
                    : "text-emerald-800 border-emerald-200"
                }`}>
                  <strong className={isDark ? "text-white" : "text-emerald-950 font-bold"}>
                    Instructor Feedback:
                  </strong>{" "}
                  <span className={isDark ? "text-emerald-100" : "text-emerald-800 font-medium"}>
                    {mySubmission.feedback}
                  </span>
                </p>
              )}
            </div>
          )}

          {/* Description & Instructions */}
          <div
            className={`p-4 rounded-xl border ${
              isDark ? "bg-darklight/30 border-dark_border" : "bg-herobg/20 border-border"
            }`}
          >
            <h4 className="text-xs font-semibold uppercase text-primary mb-1">Instructions</h4>
            <p className={`text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
              isDark ? "text-gray-200" : "text-midnight_text"
            }`}>
              {currentAssignment.description}
            </p>

            {/* Attachments / Reference links provided by Admin */}
            {(currentAssignment.attachments?.length > 0 || currentAssignment.referenceLinks?.length > 0) && (
              <div className="mt-3 pt-3 border-t border-gray-500/20 flex flex-wrap gap-2 items-center">
                <span className="text-xs font-semibold text-gray">Resources:</span>
                {(currentAssignment.attachments || []).map((att, i) => (
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
                {(currentAssignment.referenceLinks || []).map((link, i) => (
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

          {/* Questions Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary flex items-center gap-2">
              <FiHelpCircle /> Questions ({currentAssignment.questions?.length || 0})
            </h3>

            {!currentAssignment.questions || currentAssignment.questions.length === 0 ? (
              <p className="text-xs text-gray italic">
                Please submit your solution using the form below.
              </p>
            ) : (
              <div className="space-y-4">
                {currentAssignment.questions.map((q, idx) => {
                  const qKey = q._id ? q._id.toString() : q.questionText;
                  const currentAns = getQuestionAnswer(q, idx);
                  const correctAnswer = getCorrectAnswerForQuestion(q, currentAns);
                  const hasCorrectAnswer = Boolean(correctAnswer && correctAnswer.trim() !== "");
                  const isSelectedAnswerCorrect =
                    hasCorrectAnswer &&
                    currentAns?.selectedOption &&
                    isOptionMatching(currentAns.selectedOption, correctAnswer);
                  const isSelectedAnswerWrong =
                    hasCorrectAnswer &&
                    currentAns?.selectedOption &&
                    !isOptionMatching(currentAns.selectedOption, correctAnswer);
                  const isNotAnswered = !currentAns?.selectedOption && !currentAns?.answerText;

                  let cardBorderClass = isDark
                    ? "bg-darklight/40 border-dark_border"
                    : "bg-gray-50/80 border-border";

                  if (isEvaluated && hasCorrectAnswer && q.questionType === "mcq") {
                    if (isSelectedAnswerCorrect) {
                      cardBorderClass += " border-l-4 border-l-emerald-500";
                    } else if (isSelectedAnswerWrong) {
                      cardBorderClass += " border-l-4 border-l-rose-500";
                    }
                  }

                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border space-y-3 transition ${cardBorderClass}`}
                    >
                      {/* Question Header & Points */}
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-xs sm:text-sm">
                          <span className="text-primary font-bold">Q{idx + 1}.</span> {q.questionText}
                        </span>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {isEvaluated && q.questionType === "mcq" && (
                            hasCorrectAnswer ? (
                              isSelectedAnswerCorrect ? (
                                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
                                  <FiCheck size={12} className="text-emerald-600 dark:text-emerald-400" /> Correct
                                </span>
                              ) : isSelectedAnswerWrong ? (
                                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30 font-bold flex items-center gap-1">
                                  <FiX size={12} className="text-rose-600 dark:text-rose-400" /> Incorrect
                                </span>
                              ) : isNotAnswered ? (
                                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-bold flex items-center gap-1">
                                  <FiAlertCircle size={12} /> Not Answered
                                </span>
                              ) : null
                            ) : (
                              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                                Evaluated
                              </span>
                            )
                          )}

                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-md font-bold shrink-0 ${
                              isEvaluated && hasCorrectAnswer && q.questionType === "mcq"
                                ? isSelectedAnswerCorrect
                                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                                : "bg-primary/10 text-primary"
                            }`}
                          >
                            {isEvaluated && hasCorrectAnswer && q.questionType === "mcq"
                              ? isSelectedAnswerCorrect
                                ? `${q.marks || 10} / ${q.marks || 10} pts`
                                : `0 / ${q.marks || 10} pts`
                              : `${q.marks || 10} pts`}
                          </span>
                        </div>
                      </div>

                      {/* Question Answer Inputs */}
                      {q.questionType === "mcq" ? (
                        <div className="space-y-2 pl-1 sm:pl-2">
                          {(q.options || []).map((opt, optIdx) => {
                            const isSelected = isOptionMatching(currentAns.selectedOption, opt);
                            const isCorrectOption =
                              hasCorrectAnswer && isOptionMatching(opt, correctAnswer);

                            let containerClass = "";
                            let badgeContent = null;
                            let radioElement = null;

                            if (isEvaluated) {
                              if (hasCorrectAnswer) {
                                if (isSelected && isCorrectOption) {
                                  // Student selected this and it's correct
                                  containerClass = isDark
                                    ? "bg-emerald-950/35 border-emerald-500 text-emerald-200 font-semibold shadow-sm"
                                    : "bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold shadow-sm";
                                  badgeContent = (
                                    <span className="text-[10px] px-2.5 py-0.5 rounded-md font-bold bg-emerald-600 text-white flex items-center gap-1 shrink-0 shadow-xs">
                                      <FiCheck size={12} /> Correct • Your Answer
                                    </span>
                                  );
                                  radioElement = (
                                    <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                                      <FiCheck size={11} />
                                    </div>
                                  );
                                } else if (isSelected && !isCorrectOption) {
                                  // Student selected this and it is wrong
                                  containerClass = isDark
                                    ? "bg-rose-950/35 border-rose-500 text-rose-200 font-semibold shadow-sm"
                                    : "bg-rose-50 border-rose-500 text-rose-950 font-semibold shadow-sm";
                                  badgeContent = (
                                    <span className="text-[10px] px-2.5 py-0.5 rounded-md font-bold bg-rose-600 text-white flex items-center gap-1 shrink-0 shadow-xs">
                                      <FiX size={12} /> Incorrect • Your Answer
                                    </span>
                                  );
                                  radioElement = (
                                    <div className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                                      <FiX size={11} />
                                    </div>
                                  );
                                } else if (!isSelected && isCorrectOption) {
                                  // The actual correct answer that student didn't choose
                                  containerClass = isDark
                                    ? "bg-emerald-950/20 border-emerald-500 text-emerald-200 font-semibold border-2"
                                    : "bg-emerald-50/80 border-emerald-500 text-emerald-950 font-semibold border-2";
                                  badgeContent = (
                                    <span className="text-[10px] px-2.5 py-0.5 rounded-md font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1 shrink-0">
                                      <FiCheck size={12} /> Correct Answer
                                    </span>
                                  );
                                  radioElement = (
                                    <div className="w-4 h-4 rounded-full border-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                      <FiCheck size={10} />
                                    </div>
                                  );
                                } else {
                                  // Neutral unselected option
                                  containerClass = isDark
                                    ? "bg-darklight/30 border-dark_border/60 text-gray-400 opacity-60"
                                    : "bg-white/60 border-border/60 text-gray-500 opacity-60";
                                  radioElement = (
                                    <input
                                      type="radio"
                                      disabled
                                      checked={false}
                                      className="w-4 h-4 opacity-40 shrink-0"
                                    />
                                  );
                                }
                              } else {
                                // Evaluated, but no correct answer key was configured by instructor
                                if (isSelected) {
                                  containerClass = isDark
                                    ? "bg-primary/20 border-primary text-white font-semibold"
                                    : "bg-primary/10 border-primary text-midnight_text font-semibold";
                                  badgeContent = (
                                    <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-primary text-white shrink-0">
                                      Your Submitted Answer
                                    </span>
                                  );
                                } else {
                                  containerClass = isDark
                                    ? "bg-darklight/30 border-dark_border/60 text-gray-400 opacity-60"
                                    : "bg-white/60 border-border/60 text-gray-500 opacity-60";
                                }
                                radioElement = (
                                  <input
                                    type="radio"
                                    disabled
                                    checked={Boolean(isSelected)}
                                    className="accent-primary w-4 h-4 opacity-75 shrink-0"
                                  />
                                );
                              }
                            } else {
                              // Pre-evaluation state (active test or under review)
                              if (isSelected) {
                                containerClass =
                                  "bg-primary text-white border-primary font-semibold shadow-sm";
                                badgeContent = (
                                  <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-white/20 text-white shrink-0">
                                    Your Answer
                                  </span>
                                );
                              } else {
                                containerClass = isDark
                                  ? "bg-darklight border-dark_border hover:border-gray-500 text-gray-200"
                                  : "bg-white border-border hover:border-gray-300 text-midnight_text";
                              }
                              radioElement = (
                                <input
                                  type="radio"
                                  name={`q_${idx}`}
                                  disabled={isReadOnly}
                                  checked={Boolean(isSelected)}
                                  onChange={() =>
                                    !isReadOnly &&
                                    handleAnswerChange(qKey, "selectedOption", opt)
                                  }
                                  className="accent-primary w-4 h-4 cursor-pointer disabled:cursor-default shrink-0"
                                />
                              );
                            }

                            return (
                              <label
                                key={optIdx}
                                className={`flex items-center gap-3 p-3 rounded-xl border text-xs transition ${containerClass} ${
                                  isReadOnly ? "cursor-default" : "cursor-pointer"
                                }`}
                              >
                                {radioElement}
                                <span className="flex-1 leading-snug">{opt}</span>
                                {badgeContent}
                              </label>
                            );
                          })}

                          {/* Post-evaluation Correct/Incorrect Explanation Banner */}
                          {isEvaluated && (
                            hasCorrectAnswer ? (
                              isSelectedAnswerCorrect ? (
                                <div
                                  className={`mt-2 p-2.5 rounded-xl border flex items-center gap-2 text-xs ${
                                    isDark
                                      ? "bg-emerald-950/25 border-emerald-500/30 text-emerald-300"
                                      : "bg-emerald-50 border-emerald-200 text-emerald-900"
                                  }`}
                                >
                                  <FiCheckCircle
                                    size={15}
                                    className="text-emerald-600 dark:text-emerald-400 shrink-0"
                                  />
                                  <span>
                                    <strong>Correct!</strong> You selected the right answer (+
                                    {q.marks || 10} pts).
                                  </span>
                                </div>
                              ) : (
                                <div
                                  className={`mt-2 p-3 rounded-xl border space-y-1.5 text-xs ${
                                    isDark
                                      ? "bg-rose-950/20 border-rose-500/30 text-rose-200"
                                      : "bg-rose-50/70 border-rose-200 text-rose-900"
                                  }`}
                                >
                                  <div className="flex items-start gap-2">
                                    <FiXCircle
                                      size={16}
                                      className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5"
                                    />
                                    <div>
                                      <p>
                                        <strong>
                                          {isNotAnswered
                                            ? "You did not answer this question."
                                            : "Your answer was incorrect."}
                                        </strong>{" "}
                                        The correct answer is:{" "}
                                        <span className="font-bold underline text-emerald-700 dark:text-emerald-300 decoration-emerald-500">
                                          {correctAnswer}
                                        </span>
                                      </p>
                                      {q.instructions && (
                                        <p className="mt-1 text-[11px] opacity-85">
                                          {q.instructions}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )
                            ) : (
                              <div
                                className={`mt-2 p-2.5 rounded-xl border flex items-center gap-2 text-xs ${
                                  isDark
                                    ? "bg-darklight/40 border-dark_border text-gray-300"
                                    : "bg-gray-50 border-border text-gray-700"
                                }`}
                              >
                                <FiHelpCircle size={15} className="text-primary shrink-0" />
                                <span>
                                  Your submitted answer has been recorded. (No automated answer key was configured by the instructor for this question).
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <textarea
                            rows={3}
                            disabled={isReadOnly}
                            value={currentAns.answerText || ""}
                            onChange={(e) =>
                              !isReadOnly && handleAnswerChange(qKey, "answerText", e.target.value)
                            }
                            placeholder={
                              isReadOnly
                                ? "No answer submitted for this question."
                                : "Write your answer here..."
                            }
                            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition disabled:opacity-85 ${
                              isDark
                                ? "bg-darklight border-dark_border text-white focus:border-primary"
                                : "bg-white border-border text-black focus:border-primary"
                            }`}
                          />

                          {/* Expected / Model Solution if provided */}
                          {isEvaluated && correctAnswer && (
                            <div
                              className={`p-3 rounded-xl border text-xs space-y-1 ${
                                isDark
                                  ? "bg-darklight/40 border-dark_border text-gray-200"
                                  : "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                              }`}
                            >
                              <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                                <FiCheckCircle size={13} /> Model / Expected Solution:
                              </span>
                              <p className="whitespace-pre-wrap leading-relaxed opacity-95 pl-5">
                                {correctAnswer}
                              </p>
                            </div>
                          )}
                        </div>
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

            {/* If student previously submitted attachments, display them here */}
            {mySubmission?.attachments?.length > 0 && (
              <div className={`p-3.5 rounded-xl border space-y-2 ${
                isDark ? "bg-darklight/20 border-dark_border" : "bg-gray-50 border-border"
              }`}>
                <span className="text-xs font-semibold text-gray flex items-center gap-1.5">
                  <FiFileText className="text-primary" /> Your Submitted Attachments ({mySubmission.attachments.length}):
                </span>
                <div className="flex flex-wrap gap-2">
                  {mySubmission.attachments.map((file, i) => (
                    <a
                      key={i}
                      href={file.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs px-3 py-1.5 rounded-lg border border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 flex items-center gap-1.5 transition font-medium"
                    >
                      <FiFileText size={13} /> {file.name} <FiExternalLink size={11} />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray mb-1">
                  Submission Link (GitHub / Figma / Google Drive)
                </label>
                <div className="relative">
                  <input
                    type="url"
                    disabled={isReadOnly}
                    value={submissionLink}
                    onChange={(e) => setSubmissionLink(e.target.value)}
                    placeholder="https://github.com/username/project"
                    className={`w-full px-3.5 py-2 rounded-xl border text-xs sm:text-sm outline-none disabled:opacity-75 ${
                      isDark
                        ? "bg-darklight border-dark_border text-white focus:border-primary"
                        : "bg-white border-border focus:border-primary"
                    }`}
                  />
                  {isReadOnly && submissionLink && (
                    <a
                      href={submissionLink}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute right-2 top-2 p-1 text-primary hover:text-primary/80"
                      title="Open Link"
                    >
                      <FiExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>

              {!isReadOnly && (
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray mb-1">
                    Attach Solution Files (PDF, Code ZIP, Screenshots)
                  </label>
                  <input
                    type="file"
                    multiple
                    disabled={isReadOnly}
                    onChange={(e) => setFiles(e.target.files)}
                    className="w-full text-xs text-gray file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:opacity-90 cursor-pointer disabled:opacity-50"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray mb-1">
                Additional Notes / Summary
              </label>
              <textarea
                rows={2}
                disabled={isReadOnly}
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                placeholder={isReadOnly ? "No additional notes provided." : "Optional notes or summary of your work..."}
                className={`w-full px-3.5 py-2 rounded-xl border text-xs sm:text-sm outline-none disabled:opacity-75 ${
                  isDark
                    ? "bg-darklight border-dark_border text-white focus:border-primary"
                    : "bg-white border-border focus:border-primary"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className={`p-4 border-t flex items-center justify-between ${
            isDark ? "border-dark_border bg-darklight/30" : "border-border bg-gray-50"
          }`}
        >
          <div>
            {mySubmission?.submittedAt ? (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <FiCheckCircle size={15} /> Submitted on {new Date(mySubmission.submittedAt).toLocaleDateString()}
                {mySubmission.isLate && " (Late)"}
              </span>
            ) : (
              <span className="text-xs text-gray font-medium">
                Not submitted yet
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-5 py-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                isDark
                  ? "border-dark_border text-gray hover:bg-darklight hover:text-white"
                  : "border-border text-gray hover:bg-gray-100 hover:text-black"
              }`}
            >
              Close
            </button>

            {/* Resubmit / Submit button: ONLY shown if not yet submitted, OR if mentor/admin explicitly requested resubmission */}
            {canEditAndSubmit && (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className={`px-6 py-2.5 rounded-xl text-white text-xs font-semibold shadow transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer ${
                  isResubmitRequested
                    ? "bg-amber-500 hover:bg-amber-600 shadow-md"
                    : "bg-primary hover:bg-primary/90"
                }`}
              >
                <FiSend size={13} />
                {isSubmitting
                  ? "Submitting..."
                  : isResubmitRequested
                  ? "Resubmit Assessment"
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
