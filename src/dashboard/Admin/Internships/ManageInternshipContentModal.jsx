import React, { useMemo } from "react";
import { Formik, Form, FieldArray } from "formik";
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
import { BsArrowsMove } from "react-icons/bs";
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
        initialValues={{ curriculum: initialCurriculum }}
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
                disabled={isLoading}
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
