import React, { useMemo } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { FiTarget, FiTrash2, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import {
  useUpdateInternshipCurriculumMutation,
  useUpdateInternshipsDomainMutation,
  useGetInternshipsDomainByIdQuery,
} from "@/Services/admin/internshipsDomainService";
import toast from "react-hot-toast";

// Icons
import {
  FiX,
  FiMenu,
  FiPlus,
  FiSave,
  FiBook,
} from "react-icons/fi";
import { BsArrowsMove, BsInfoCircle } from "react-icons/bs";
import { TbArrowsSort } from "react-icons/tb";
import SortableInternshipWeekItem from "./SortableInternshipWeekItem";

const generateId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "w_" + Math.random().toString(36).substring(2, 11);
};

const ManageInternshipContentModal = ({ handleClose, domain }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Fresh data query if available
  const { data: domainDetailData } = useGetInternshipsDomainByIdQuery(domain?._id, {
    skip: !domain?._id,
  });

  const activeDomain = domainDetailData?.data || domain;

  const [updateCurriculum, { isLoading }] = useUpdateInternshipCurriculumMutation();
  const [updateInternshipsDomain, { isLoading: isUpdatingDomain }] = useUpdateInternshipsDomainMutation();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const initialCurriculum = useMemo(() => {
    const rawCurriculum = activeDomain?.curriculum;
    if (Array.isArray(rawCurriculum) && rawCurriculum.length > 0) {
      return rawCurriculum.map((w, idx) => ({
        id: w.id || w._id || generateId(),
        week: w.week || idx + 1,
        title: w.title || "",
        sessions:
          Array.isArray(w.sessions) && w.sessions.length > 0
            ? w.sessions.map((s, sIdx) => ({
                id: s.id || s._id || generateId(),
                title: s.title || "",
              }))
            : [{ id: generateId(), title: "" }],
      }));
    }

    return [
      {
        id: generateId(),
        week: 1,
        title: "",
        sessions: [{ id: generateId(), title: "" }],
      },
    ];
  }, [activeDomain]);

  const handleDragEnd = (event, values, setFieldValue) => {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      const oldIndex = values.curriculum.findIndex((w) => w.id === active.id);
      const newIndex = values.curriculum.findIndex((w) => w.id === over.id);

      setFieldValue("curriculum", arrayMove(values.curriculum, oldIndex, newIndex));
    }
  };

  const handleSubmit = async (values) => {
    try {
      // Clean and format curriculum
      const cleanCurriculum = values.curriculum
        .filter((w) => w.title.trim() !== "" || w.sessions.some((s) => s.title.trim() !== ""))
        .map((w, idx) => ({
          id: w.id,
          week: idx + 1,
          title: w.title.trim() || `Week ${idx + 1}`,
          sessions: w.sessions
            .filter((s) => s.title.trim() !== "")
            .map((s) => ({
              id: s.id,
              title: s.title.trim(),
            })),
        }));

      // Also update domain details (description, objectives, requirements)
      await updateInternshipsDomain({
        id: domain._id,
        updatedData: {
          description: values.description,
          objectives: values.objectives.filter(o => o.trim() !== ""),
          requirements: values.requirements.filter(r => r.trim() !== "")
        }
      }).unwrap();

      await updateCurriculum({
        id: domain._id,
        curriculum: cleanCurriculum,
      }).unwrap();

      toast.success("Curriculum updated successfully!");
      handleClose();
    } catch (err) {
      console.error("Failed to update curriculum", err);
      toast.error(err?.data?.message || "Failed to update curriculum");
    }
  };

  return (
    <div className={`w-full max-h-[90vh] flex flex-col ${isDark ? "text-white" : "text-midnight_text"}`}>
      {/* HEADER */}
      <div
        className={`px-6 py-4 flex items-center justify-between border-b ${
          isDark ? "border-dark_border" : "border-border"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-xl ${
              isDark ? "bg-primary/20 text-primary" : "bg-primary/10 text-primary"
            }`}
          >
            <FiBook className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span>Manage Curriculum:</span>
              <span className="text-primary">{activeDomain?.name}</span>
            </h2>
            <p className="text-xs text-gray mt-0.5">
              Organize and structure the internship curriculum into weekly topics and sessions
            </p>
          </div>
        </div>

        <button
          onClick={handleClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          title="Close"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      {/* FORM BODY */}
      <Formik
        enableReinitialize
        initialValues={{
          description: activeDomain?.description || "",
          objectives: activeDomain?.objectives?.length ? activeDomain.objectives : [""],
          requirements: activeDomain?.requirements?.length ? activeDomain.requirements : [""],
          curriculum: initialCurriculum 
        }}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className="flex-1 flex flex-col min-h-0">
            {/* SCROLLABLE CONTENT */}
            <div
              className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 ${
                isDark ? "bg-slate-900/50" : "bg-slate-50"
              }`}
            >
              {/* Course Description */}
                    <motion.div 
                      className="space-y-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg transition-colors duration-150 ${
                          isDark
                            ? 'bg-primary/10'
                            : 'bg-primary/5'
                        }`}>
                          <FiBook className={`w-5 h-5 transition-colors duration-150 ${
                            isDark
                              ? 'text-primary'
                              : 'text-primary'
                          }`} />
                        </div>
                        <div>
                          <label className={`text-lg font-semibold transition-colors duration-150 ${
                            isDark
                              ? 'text-light'
                              : 'text-midnight_text'
                          }`}>Internship Description</label>
                          <p className={`text-sm transition-colors duration-150 text-gray`}>What will students learn in this internship?</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Field
                          as="textarea"
                          name="description"
                          rows={4}
                          placeholder="Describe the course content, teaching methods, and what makes this course unique..."
                          className={`min-h-[120px] resize-y rounded-lg border px-3 py-2 transition-all duration-150 focus:outline-none focus:ring-2 ${
                            isDark
                              ? 'bg-semidark border-dark_border text-light placeholder-darkgray focus:border-primary focus:ring-primary/30'
                              : 'bg-white border-border text-midnight_text placeholder-gray focus:border-primary focus:ring-primary/20'
                          }`}
                        />
                        <div className={`flex items-center gap-2 text-sm transition-colors duration-150 text-gray`}>
                          <BsInfoCircle className="w-4 h-4" />
                          <span>Be specific about outcomes and benefits</span>
                        </div>
                        <ErrorMessage
                          name="description"
                          component="div"
                          className={`text-sm mt-1 flex items-center gap-1 transition-colors duration-150 ${
                            isDark
                              ? 'text-rose-500'
                              : 'text-rose-600'
                          }`}
                        >
                          {msg => (
                            <>
                              <FiAlertCircle className="w-4 h-4" />
                              {msg}
                            </>
                          )}
                        </ErrorMessage>
                      </div>
                    </motion.div>

                    {/* Learning Objectives */}
                    <motion.div 
                      className="space-y-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg transition-colors duration-150 ${
                          isDark
                            ? 'bg-emerald-500/10'
                            : 'bg-emerald-50'
                        }`}>
                          <FiTarget className={`w-5 h-5 transition-colors duration-150 ${
                            isDark
                              ? 'text-emerald-400'
                              : 'text-emerald-600'
                          }`} />
                        </div>
                        <div>
                          <label className={`text-lg font-semibold transition-colors duration-150 ${
                            isDark
                              ? 'text-light'
                              : 'text-midnight_text'
                          }`}>
                            Learning Objectives
                          </label>
                          <p className={`text-sm transition-colors duration-150 text-gray`}>What will students be able to do after completing this internship?</p>
                        </div>
                      </div>

                      <FieldArray name="objectives">
                        {({ push, remove }) => (
                          <div className="space-y-3">
                            {values.objectives.map((objective, index) => (
                              <motion.div 
                                key={index} 
                                className="flex items-start gap-3"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <div className={`flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium mt-2 flex-shrink-0 ${
                                  isDark
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'bg-emerald-100 text-emerald-600'
                                }`}>
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <div className="relative">
                                    <Field
                                      name={`objectives.${index}`}
                                      placeholder={`Objective ${index + 1} (e.g., "Build a full-stack web application")`}
                                      className={`w-full rounded-lg border px-3 py-2 pr-10 transition-all duration-150 focus:outline-none focus:ring-2 ${
                                        isDark
                                          ? 'bg-semidark border-dark_border text-light placeholder-darkgray focus:border-emerald-400 focus:ring-emerald-400/30'
                                          : 'bg-white border-border text-midnight_text placeholder-gray focus:border-emerald-500 focus:ring-emerald-500/20'
                                      }`}
                                    />
                                    {values.objectives.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded transition-all duration-150 ${
                                          isDark
                                            ? 'text-gray hover:text-rose-400 hover:bg-darklight'
                                            : 'text-gray hover:text-rose-500 hover:bg-light'
                                        }`}
                                        aria-label="Remove objective"
                                      >
                                        <FiTrash2 className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                  <ErrorMessage
                                    name={`objectives.${index}`}
                                    component="div"
                                    className={`text-sm mt-1 flex items-center gap-1 transition-colors duration-150 ${
                                      isDark ? 'text-rose-500' : 'text-rose-600'
                                    }`}
                                  >
                                    {msg => (
                                      <>
                                        <FiAlertCircle className="w-4 h-4" />
                                        {msg}
                                      </>
                                    )}
                                  </ErrorMessage>
                                </div>
                              </motion.div>
                            ))}
                            <button
                              type="button"
                              onClick={() => push("")}
                              className={`inline-flex items-center gap-2 font-medium text-sm mt-2 p-2 rounded-lg transition-all duration-150 ${
                                isDark
                                  ? 'text-cyan hover:text-cyan hover:bg-primary/10'
                                  : 'text-primary hover:text-secondary hover:bg-primary/5'
                              }`}
                            >
                              <FiPlus className="w-4 h-4" />
                              Add Another Objective
                            </button>
                          </div>
                        )}
                      </FieldArray>
                    </motion.div>

                    {/* Requirements */}
                    <motion.div 
                      className="space-y-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg transition-colors duration-150 ${
                          isDark
                            ? 'bg-purple-500/10'
                            : 'bg-purple-50'
                        }`}>
                          <FiCheckCircle className={`w-5 h-5 transition-colors duration-150 ${
                            isDark
                              ? 'text-purple-400'
                              : 'text-purple-600'
                          }`} />
                        </div>
                        <div>
                          <label className={`text-lg font-semibold transition-colors duration-150 ${
                            isDark
                              ? 'text-light'
                              : 'text-midnight_text'
                          }`}>
                            Requirements
                          </label>
                          <p className={`text-sm transition-colors duration-150 text-gray`}>What should students know or have before taking this internship?</p>
                        </div>
                      </div>

                      <FieldArray name="requirements">
                        {({ push, remove }) => (
                          <div className="space-y-3">
                            {values.requirements.map((requirement, index) => (
                              <motion.div 
                                key={index} 
                                className="flex items-start gap-3"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <div className={`flex items-center justify-center w-5 h-5 rounded mt-2 flex-shrink-0 ${
                                  isDark
                                    ? 'bg-purple-500/20'
                                    : 'bg-purple-100'
                                }`}>
                                  <div className={`w-2 h-2 rounded-full ${
                                    isDark ? 'bg-purple-400' : 'bg-purple-600'
                                  }`} />
                                </div>
                                <div className="flex-1">
                                  <div className="relative">
                                    <Field
                                      name={`requirements.${index}`}
                                      placeholder={`Requirement ${index + 1} (e.g., "Basic knowledge of JavaScript")`}
                                      className={`w-full rounded-lg border px-3 py-2 pr-10 transition-all duration-150 focus:outline-none focus:ring-2 ${
                                        isDark
                                          ? 'bg-semidark border-dark_border text-light placeholder-darkgray focus:border-purple-400 focus:ring-purple-400/30'
                                          : 'bg-white border-border text-midnight_text placeholder-gray focus:border-purple-500 focus:ring-purple-500/20'
                                      }`}
                                    />
                                    {values.requirements.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded transition-all duration-150 ${
                                          isDark
                                            ? 'text-gray hover:text-rose-400 hover:bg-darklight'
                                            : 'text-gray hover:text-rose-500 hover:bg-light'
                                        }`}
                                        aria-label="Remove requirement"
                                      >
                                        <FiTrash2 className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                            <button
                              type="button"
                              onClick={() => push("")}
                              className={`inline-flex items-center gap-2 font-medium text-sm mt-2 p-2 rounded-lg transition-all duration-150 ${
                                isDark
                                  ? 'text-cyan hover:text-cyan hover:bg-primary/10'
                                  : 'text-primary hover:text-secondary hover:bg-primary/5'
                              }`}
                            >
                              <FiPlus className="w-4 h-4" />
                              Add Another Requirement
                            </button>
                          </div>
                        )}
                      </FieldArray>
                    </motion.div>



              {/* ===== CURRICULUM SECTION HEADER ===== */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-xl ${
                        isDark ? "bg-amber-500/10 text-amber-400" : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      <FiMenu className="w-5 h-5" />
                    </div>
                    <div>
                      <h3
                        className={`text-lg font-bold ${
                          isDark ? "text-white" : "text-midnight_text"
                        }`}
                      >
                        Course Curriculum
                      </h3>
                      <p className="text-xs sm:text-sm text-gray">
                        Organize your course content into weeks and sessions
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray self-start sm:self-auto">
                    <TbArrowsSort className="w-4 h-4 text-primary" />
                    <span>
                      {values.curriculum.length} week{values.curriculum.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {/* Drag Hint Banner */}
                <div
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs sm:text-sm font-medium ${
                    isDark
                      ? "bg-darklight/60 border-dark_border text-gray"
                      : "bg-white border-border text-gray shadow-xs"
                  }`}
                >
                  <BsArrowsMove className="w-4 h-4 text-primary shrink-0" />
                  <span>Drag weeks to reorder. Click and hold the grip icon to drag.</span>
                </div>
              </div>

              {/* ===== DND KIT SORTABLE WEEKS LIST ===== */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                modifiers={[restrictToVerticalAxis]}
                onDragEnd={(event) => handleDragEnd(event, values, setFieldValue)}
              >
                <SortableContext
                  items={values.curriculum.map((w) => w.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    <FieldArray name="curriculum">
                      {({ push, remove }) => (
                        <>
                          {values.curriculum.map((week, weekIndex) => (
                            <SortableInternshipWeekItem
                              key={week.id}
                              week={week}
                              weekIndex={weekIndex}
                              removeWeek={values.curriculum.length > 1 ? remove : null}
                            />
                          ))}

                          {/* Add Week Button */}
                          <button
                            type="button"
                            onClick={() =>
                              push({
                                id: generateId(),
                                week: values.curriculum.length + 1,
                                title: "",
                                sessions: [{ id: generateId(), title: "" }],
                              })
                            }
                            className={`w-full py-3.5 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
                              isDark
                                ? "border-dark_border text-gray hover:text-primary hover:border-primary bg-darkmode/50"
                                : "border-slate-300 text-gray hover:text-primary hover:border-primary bg-white"
                            }`}
                          >
                            <FiPlus className="w-4 h-4" />
                            <span>Add Week</span>
                          </button>
                        </>
                      )}
                    </FieldArray>
                  </div>
                </SortableContext>
              </DndContext>
            </div>

            {/* FOOTER */}
            <div
              className={`px-6 py-4 border-t flex justify-end gap-3 ${
                isDark ? "border-dark_border bg-darkmode" : "border-border bg-white"
              }`}
            >
              <button
                type="button"
                onClick={handleClose}
                className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
                  isDark ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || isUpdatingDomain}
                className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-primary text-white shadow-lg hover:bg-primary/90 transition flex items-center gap-2 disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FiSave className="w-4 h-4" />
                )}
                {isLoading ? "Saving..." : "Save Content"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ManageInternshipContentModal;
