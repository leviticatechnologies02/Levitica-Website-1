import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiPlus,
  FiTrash2,
  FiCheckCircle,
  FiHelpCircle,
  FiUploadCloud,
  FiCalendar,
  FiAward,
  FiBookOpen,
  FiLayers,
  FiFileText,
  FiLink,
  FiCheck,
  FiBriefcase,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useTheme } from "@/context/ThemeContext";
import { useCourses } from "@/hooks/useCourses";
import {
  useGetBatchesByCourseQuery,
  useGetBatchesByInternshipQuery,
} from "@/Services/admin/batchdetailsService";
import { useGetAllInternshipsDomainsQuery } from "@/Services/paymentServices/internshipsServices";
import {
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
} from "@/Services/admin/assignmentAdminService";

const QUESTION_TYPES = [
  { value: "descriptive", label: "Descriptive / Text Answer" },
  { value: "mcq", label: "Multiple Choice (MCQ)" },
  { value: "file_upload", label: "File Upload (PDF / Code / Image)" },
  { value: "link", label: "External Link (GitHub / Figma / URL)" },
];

const TARGET_TYPES = [
  { value: "course", label: "Course Assignment", icon: FiBookOpen },
  { value: "internship", label: "Internship Assignment", icon: FiBriefcase },
  { value: "all", label: "General / All Students", icon: FiLayers },
];

const AssignmentModal = ({
  isOpen,
  onClose,
  assignment = null,
  customCourses = null,
  customInternshipDomains = null,
  customCreateMutation = null,
  customUpdateMutation = null,
  isMentor = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { courses = [] } = useCourses();
  const availableCourses = customCourses && customCourses.length > 0 ? customCourses : courses;
  const { data: internshipDomainsData } = useGetAllInternshipsDomainsQuery();
  const allInternshipDomains = internshipDomainsData?.data || [];
  const internshipDomains = customInternshipDomains && customInternshipDomains.length > 0 ? customInternshipDomains : allInternshipDomains;

  const [createAssignment, { isLoading: isCreating }] = useCreateAssignmentMutation();
  const [updateAssignment, { isLoading: isUpdating }] = useUpdateAssignmentMutation();

  const isEdit = Boolean(assignment?._id);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetType, setTargetType] = useState("course");
  const [course, setCourse] = useState("");
  const [internshipDomain, setInternshipDomain] = useState("");
  const [batch, setBatch] = useState("");
  const [totalMarks, setTotalMarks] = useState(100);
  const [passingMarks, setPassingMarks] = useState(40);
  const [dueDate, setDueDate] = useState("");
  const [allowLateSubmission, setAllowLateSubmission] = useState(true);
  const [status, setStatus] = useState("published");
  const [files, setFiles] = useState([]);
  const [questions, setQuestions] = useState([]);

  // Fetch batches for selected course
  const { data: batchesByCourseData } = useGetBatchesByCourseQuery(course, {
    skip: targetType !== "course" || !course,
  });
  const courseBatches = batchesByCourseData?.data || batchesByCourseData?.batches || [];

  // Fetch batches for selected internship domain
  const { data: batchesByInternshipData } = useGetBatchesByInternshipQuery(internshipDomain, {
    skip: targetType !== "internship" || !internshipDomain,
  });
  const internshipBatches = batchesByInternshipData?.data || batchesByInternshipData?.batches || [];

  const activeBatches = targetType === "internship" ? internshipBatches : courseBatches;

  useEffect(() => {
    if (assignment) {
      setTitle(assignment.title || "");
      setDescription(assignment.description || "");
      setTargetType(assignment.targetType || (assignment.internshipDomain ? "internship" : "course"));
      setCourse(assignment.course?._id || assignment.course || "");
      setInternshipDomain(assignment.internshipDomain?._id || assignment.internshipDomain || "");
      setBatch(assignment.batch?._id || assignment.batch || "");
      setTotalMarks(assignment.totalMarks ?? 100);
      setPassingMarks(assignment.passingMarks ?? 40);
      setDueDate(
        assignment.dueDate
          ? new Date(assignment.dueDate).toISOString().slice(0, 16)
          : ""
      );
      setAllowLateSubmission(assignment.allowLateSubmission ?? true);
      setStatus(assignment.status || "published");
      setQuestions(assignment.questions || []);
      setFiles([]);
    } else {
      setTitle("");
      setDescription("");
      setTargetType("course");
      setCourse("");
      setInternshipDomain("");
      setBatch("");
      setTotalMarks(100);
      setPassingMarks(40);
      setDueDate("");
      setAllowLateSubmission(true);
      setStatus("published");
      setQuestions([
        {
          questionText: "",
          questionType: "descriptive",
          marks: 10,
          options: ["Option 1", "Option 2"],
          correctAnswer: "",
          instructions: "",
        },
      ]);
      setFiles([]);
    }
  }, [assignment, isOpen]);

  // Question Management
  const addQuestion = (type = "descriptive") => {
    setQuestions((prev) => [
      ...prev,
      {
        questionText: "",
        questionType: type,
        marks: 10,
        options: type === "mcq" ? ["Option 1", "Option 2"] : [],
        correctAnswer: "",
        instructions: "",
      },
    ]);
  };

  const removeQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuestion = (index, field, value) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addMcqOption = (qIndex) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const currentOpts = updated[qIndex].options || [];
      updated[qIndex].options = [...currentOpts, `Option ${currentOpts.length + 1}`];
      return updated;
    });
  };

  const updateMcqOption = (qIndex, optIndex, value) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const prevOptVal = updated[qIndex].options?.[optIndex];
      const opts = [...(updated[qIndex].options || [])];
      opts[optIndex] = value;
      updated[qIndex].options = opts;
      // If this option was selected as the correct answer, keep it synchronized
      if (updated[qIndex].correctAnswer && updated[qIndex].correctAnswer === prevOptVal) {
        updated[qIndex].correctAnswer = value;
      }
      return updated;
    });
  };

  const removeMcqOption = (qIndex, optIndex) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const removedOptVal = updated[qIndex].options?.[optIndex];
      updated[qIndex].options = updated[qIndex].options.filter((_, i) => i !== optIndex);
      if (updated[qIndex].correctAnswer === removedOptVal) {
        updated[qIndex].correctAnswer = "";
      }
      return updated;
    });
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter assignment title");
      return;
    }
    if (!description.trim()) {
      toast.error("Please enter assignment description");
      return;
    }

    const validQuestions = questions.filter((q) => q.questionText.trim() !== "");

    // Validate MCQ questions have a correct answer marked
    for (let i = 0; i < validQuestions.length; i++) {
      const q = validQuestions[i];
      if (q.questionType === "mcq") {
        if (!q.options || q.options.length < 2) {
          toast.error(`Question ${i + 1} must have at least 2 options`);
          return;
        }
        if (!q.correctAnswer || !q.correctAnswer.trim()) {
          toast.error(`Please select the correct answer radio button for Question ${i + 1}`);
          return;
        }
      }
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("targetType", targetType);

      if (targetType === "course" && course) {
        formData.append("course", course);
      } else if (targetType === "internship" && internshipDomain) {
        formData.append("internshipDomain", internshipDomain);
      }

      if (batch) formData.append("batch", batch);
      formData.append("totalMarks", totalMarks);
      formData.append("passingMarks", passingMarks);
      if (dueDate) formData.append("dueDate", new Date(dueDate).toISOString());
      formData.append("allowLateSubmission", allowLateSubmission);
      formData.append("status", status);
      formData.append("questions", JSON.stringify(validQuestions));

      if (files && files.length > 0) {
        Array.from(files).forEach((file) => {
          formData.append("attachments", file);
        });
      }

      if (isEdit) {
        if (customUpdateMutation) {
          await customUpdateMutation({ id: assignment._id, body: formData }).unwrap();
        } else {
          await updateAssignment({ id: assignment._id, body: formData }).unwrap();
        }
        toast.success("Assignment updated successfully!");
      } else {
        if (customCreateMutation) {
          await customCreateMutation(formData).unwrap();
        } else {
          await createAssignment(formData).unwrap();
        }
        toast.success("Assignment & Questions published successfully!");
      }

      onClose();
    } catch (err) {
      console.error("Failed to save assignment:", err);
      toast.error(err?.data?.message || "Failed to save assignment");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className={`w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden ${
          isDark ? "bg-semidark border border-dark_border text-white" : "bg-white text-midnight_text border border-border"
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-5 border-b ${
          isDark ? "border-dark_border bg-darklight/40" : "border-border bg-herobg/30"
        }`}>
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FiBookOpen className="text-primary" />
              {isEdit ? "Edit Assignment & Questions" : "Super Admin: Create Assignment"}
            </h2>
            <p className="text-xs text-gray mt-0.5">
              Prepare assignment and questions for Courses or Industrial Internships
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray hover:text-white hover:bg-white/10 transition"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Target Type Selector (Course vs Internship vs General) */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase text-gray">
              Target Program Type *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {TARGET_TYPES.map((tt) => {
                const Icon = tt.icon;
                const isSelected = targetType === tt.value;
                return (
                  <button
                    key={tt.value}
                    type="button"
                    onClick={() => {
                      setTargetType(tt.value);
                      setBatch("");
                    }}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-semibold transition ${
                      isSelected
                        ? "bg-primary border-primary text-white shadow-sm"
                        : isDark
                        ? "bg-darklight/40 border-dark_border text-gray hover:text-white"
                        : "bg-gray-50 border-border text-gray hover:text-black"
                    }`}
                  >
                    <Icon size={16} className={isSelected ? "text-primary" : "text-gray"} />
                    <span>{tt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary flex items-center gap-2">
              <FiFileText /> 1. Assignment Details
            </h3>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray mb-1">
                Assignment Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Industrial Capstone: Full Stack MERN Application"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition ${
                  isDark
                    ? "bg-darklight border-dark_border text-white focus:border-primary"
                    : "bg-white border-border text-black focus:border-primary"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray mb-1">
                Description & Instructions *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide clear guidelines, problem statement, and expected deliverables..."
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition ${
                  isDark
                    ? "bg-darklight border-dark_border text-white focus:border-primary"
                    : "bg-white border-border text-black focus:border-primary"
                }`}
              />
            </div>

            {/* Target Selectors based on targetType */}
            {targetType === "course" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray mb-1">
                    Select Course *
                  </label>
                  <select
                    value={course}
                    onChange={(e) => {
                      setCourse(e.target.value);
                      setBatch("");
                    }}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition ${
                      isDark
                        ? "bg-darklight border-dark_border text-white focus:border-primary"
                        : "bg-white border-border text-black focus:border-primary"
                    }`}
                  >
                    <option value="">All Courses</option>
                    {availableCourses.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray mb-1">
                    Course Batch
                  </label>
                  <select
                    value={batch}
                    disabled={!course}
                    onChange={(e) => setBatch(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition disabled:opacity-50 ${
                      isDark
                        ? "bg-darklight border-dark_border text-white focus:border-primary"
                        : "bg-white border-border text-black focus:border-primary"
                    }`}
                  >
                    <option value="">All Batches in Course</option>
                    {activeBatches.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.batchName} ({b.status})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {targetType === "internship" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray mb-1">
                    Select Internship Domain *
                  </label>
                  <select
                    value={internshipDomain}
                    onChange={(e) => {
                      setInternshipDomain(e.target.value);
                      setBatch("");
                    }}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition ${
                      isDark
                        ? "bg-darklight border-dark_border text-white focus:border-primary"
                        : "bg-white border-border text-black focus:border-primary"
                    }`}
                  >
                    <option value="">All Internship Domains</option>
                    {internshipDomains.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name} ({d.focus || d.level})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray mb-1">
                    Internship Batch
                  </label>
                  <select
                    value={batch}
                    disabled={!internshipDomain}
                    onChange={(e) => setBatch(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition disabled:opacity-50 ${
                      isDark
                        ? "bg-darklight border-dark_border text-white focus:border-primary"
                        : "bg-white border-border text-black focus:border-primary"
                    }`}
                  >
                    <option value="">All Batches in Domain</option>
                    {activeBatches.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.batchName} ({b.status})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Marks & Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray mb-1">
                  Total Marks
                </label>
                <input
                  type="number"
                  min="0"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition ${
                    isDark
                      ? "bg-darklight border-dark_border text-white focus:border-primary"
                      : "bg-white border-border text-black focus:border-primary"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray mb-1">
                  Passing Marks
                </label>
                <input
                  type="number"
                  min="0"
                  value={passingMarks}
                  onChange={(e) => setPassingMarks(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition ${
                    isDark
                      ? "bg-darklight border-dark_border text-white focus:border-primary"
                      : "bg-white border-border text-black focus:border-primary"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray mb-1">
                  Due Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition ${
                    isDark
                      ? "bg-darklight border-dark_border text-white focus:border-primary"
                      : "bg-white border-border text-black focus:border-primary"
                  }`}
                />
              </div>
            </div>

            {/* Attachments & Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray mb-1">
                  Attachments (PDF / Docs / Problem Brief)
                </label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                  className="w-full text-xs text-gray file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:opacity-90 cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-6 pt-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                  <input
                    type="checkbox"
                    checked={allowLateSubmission}
                    onChange={(e) => setAllowLateSubmission(e.target.checked)}
                    className="accent-primary w-4 h-4 rounded"
                  />
                  Allow Late Submission
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                  <input
                    type="checkbox"
                    checked={status === "published"}
                    onChange={(e) => setStatus(e.target.checked ? "published" : "draft")}
                    className="accent-primary w-4 h-4 rounded"
                  />
                  Publish Immediately
                </label>
              </div>
            </div>
          </div>

          <hr className={isDark ? "border-dark_border" : "border-border"} />

          {/* Section 2: Questions Preparation (Super Admin Question Builder) */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-primary flex items-center gap-2">
                  <FiHelpCircle /> 2. Prepare Questions for Students ({questions.length})
                </h3>
                <p className="text-xs text-gray mt-0.5">
                  Questions will reflect directly on the student dashboard for completion.
                </p>
              </div>

              {/* Add Question Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {QUESTION_TYPES.map((qt) => (
                  <button
                    key={qt.value}
                    type="button"
                    onClick={() => addQuestion(qt.value)}
                    className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition ${
                      isDark
                        ? "bg-darklight/60 border-dark_border hover:bg-primary/20 hover:border-primary text-gray hover:text-white"
                        : "bg-gray-100 border-gray-200 hover:bg-primary/10 hover:border-primary text-gray hover:text-primary"
                    }`}
                  >
                    <FiPlus size={12} /> + {qt.label.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions List */}
            {questions.length === 0 ? (
              <div className={`p-8 text-center rounded-2xl border-2 border-dashed ${
                isDark ? "border-dark_border bg-darklight/20 text-gray" : "border-border bg-gray-50 text-gray"
              }`}>
                <p className="text-sm">No structured questions added yet.</p>
                <p className="text-xs mt-1">Students will submit a single overall file/link unless you add questions above.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((q, qIndex) => (
                  <div
                    key={qIndex}
                    className={`p-4 rounded-xl border relative transition-all ${
                      isDark ? "bg-darklight/40 border-dark_border" : "bg-herobg/20 border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                          {qIndex + 1}
                        </span>
                        <select
                          value={q.questionType}
                          onChange={(e) => updateQuestion(qIndex, "questionType", e.target.value)}
                          className={`px-2.5 py-1 rounded-lg border text-xs font-semibold outline-none ${
                            isDark
                              ? "bg-darklight border-dark_border text-white"
                              : "bg-white border-border text-black"
                          }`}
                        >
                          {QUESTION_TYPES.map((qt) => (
                            <option key={qt.value} value={qt.value}>
                              {qt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 text-xs text-gray">
                          <span>Marks:</span>
                          <input
                            type="number"
                            min="1"
                            value={q.marks || 10}
                            onChange={(e) => updateQuestion(qIndex, "marks", Number(e.target.value))}
                            className={`w-14 px-2 py-0.5 rounded border text-center text-xs ${
                              isDark ? "bg-darklight border-dark_border text-white" : "bg-white border-border"
                            }`}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeQuestion(qIndex)}
                          className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition"
                          title="Delete Question"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Question Text */}
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder={`Question ${qIndex + 1} prompt...`}
                        value={q.questionText}
                        onChange={(e) => updateQuestion(qIndex, "questionText", e.target.value)}
                        className={`w-full px-3.5 py-2 rounded-xl border text-sm outline-none ${
                          isDark
                            ? "bg-darklight border-dark_border text-white focus:border-primary"
                            : "bg-white border-border text-black focus:border-primary"
                        }`}
                      />

                      {/* If MCQ, show options */}
                      {q.questionType === "mcq" && (
                        <div className="mt-3 pl-4 border-l-2 border-primary/40 space-y-2">
                          <p className="text-xs font-medium text-gray">MCQ Options (Check the correct option):</p>
                          {(q.options || []).map((opt, optIndex) => (
                            <div key={optIndex} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`correct_${qIndex}`}
                                checked={q.correctAnswer === opt}
                                onChange={() => updateQuestion(qIndex, "correctAnswer", opt)}
                                className="accent-primary cursor-pointer"
                                title="Mark as correct answer"
                              />
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => updateMcqOption(qIndex, optIndex, e.target.value)}
                                placeholder={`Option ${optIndex + 1}`}
                                className={`flex-1 px-3 py-1.5 rounded-lg border text-xs outline-none ${
                                  isDark ? "bg-darklight border-dark_border text-white" : "bg-white border-border"
                                }`}
                              />
                              <button
                                type="button"
                                onClick={() => removeMcqOption(qIndex, optIndex)}
                                className="text-red-400 hover:text-red-600 p-1"
                              >
                                <FiX size={12} />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addMcqOption(qIndex)}
                            className="text-xs text-primary hover:underline flex items-center gap-1 pt-1"
                          >
                            <FiPlus size={12} /> Add Option
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Footer */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-5 py-2.5 rounded-xl border text-sm font-semibold transition ${
                isDark ? "border-dark_border text-gray hover:bg-darklight" : "border-border text-gray hover:bg-gray-100"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-md hover:bg-primary/90 transition flex items-center gap-2 disabled:opacity-50"
            >
              <FiCheck />
              {isCreating || isUpdating
                ? "Saving..."
                : isEdit
                ? "Update Assignment"
                : "Publish Assignment & Questions"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AssignmentModal;
