import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Field, FieldArray, ErrorMessage } from "formik";
import { useTheme } from "@/context/ThemeContext";
import { FiPlus, FiTrash2, FiAlertCircle, FiClock } from "react-icons/fi";
import { BsGripVertical } from "react-icons/bs";

const generateId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "id_" + Math.random().toString(36).substring(2, 11);
};

const SortableInternshipWeekItem = ({ week, weekIndex, removeWeek }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: week.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative rounded-xl border transition-all duration-150 ${
        isDragging
          ? `border-primary shadow-lg z-10 opacity-90 ${isDark ? "bg-semidark" : "bg-white"}`
          : `${isDark ? "border-dark_border bg-darkmode" : "border-border bg-white"} shadow-sm`
      }`}
    >
      <div className="p-4 sm:p-6 space-y-5">
        {/* ───── Week Header ───── */}
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Drag Handle */}
          <button
            type="button"
            {...attributes}
            {...listeners}
            className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg transition-all duration-150 cursor-grab active:cursor-grabbing shrink-0 ${
              isDark
                ? "bg-darklight text-gray hover:bg-darklight/80 hover:text-white"
                : "bg-light text-gray hover:bg-light/80 hover:text-midnight_text"
            }`}
            title="Drag to reorder"
          >
            <BsGripVertical className="w-5 h-5" />
          </button>

          {/* Title */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div
                className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg font-semibold shrink-0 text-sm sm:text-base ${
                  isDark ? "bg-primary/20 text-primary" : "bg-primary/10 text-primary"
                }`}
              >
                {weekIndex + 1}
              </div>

              <Field
                name={`curriculum.${weekIndex}.title`}
                placeholder={`Week ${weekIndex + 1} title (e.g. Week 1: JavaScript Basics)`}
                className={`flex-1 text-base sm:text-lg font-semibold rounded-lg px-3 py-2 border transition-all focus:outline-none focus:ring-2 ${
                  isDark
                    ? "bg-semidark border-dark_border text-white placeholder-gray focus:border-primary focus:ring-primary/30"
                    : "bg-white border-border text-midnight_text placeholder-gray focus:border-primary focus:ring-primary/20"
                }`}
              />
            </div>

            <ErrorMessage
              name={`curriculum.${weekIndex}.title`}
              component="div"
              className="mt-1 flex items-center gap-1 text-xs text-rose-500"
            >
              {(msg) => (
                <>
                  <FiAlertCircle className="w-3.5 h-3.5" />
                  {msg}
                </>
              )}
            </ErrorMessage>
          </div>

          {/* Delete Week */}
          {removeWeek && (
            <button
              type="button"
              onClick={() => removeWeek(weekIndex)}
              className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 transition-all shrink-0"
              title="Delete Week"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* ───── Sessions Section ───── */}
        <div className="ml-0 sm:ml-12 md:ml-14 space-y-3.5">
          {/* Sessions Header */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray">
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-lg ${
                isDark ? "bg-darklight" : "bg-light"
              }`}
            >
              <FiClock className="w-3.5 h-3.5 text-primary" />
            </div>
            <span>Sessions</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                isDark ? "bg-darklight text-gray" : "bg-light text-midnight_text"
              }`}
            >
              {week.sessions?.length || 0}
            </span>
          </div>

          <FieldArray name={`curriculum.${weekIndex}.sessions`}>
            {({ push, remove }) => (
              <div className="space-y-2.5">
                {week.sessions?.map((session, sessionIndex) => (
                  <div
                    key={session.id || sessionIndex}
                    className={`flex items-center gap-2.5 sm:gap-3 rounded-xl p-2 sm:p-2.5 border transition-all ${
                      isDark ? "bg-darklight/60 border-dark_border/50" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full text-xs font-semibold shrink-0 ${
                        isDark ? "bg-semidark text-gray" : "bg-white text-gray shadow-xs"
                      }`}
                    >
                      {sessionIndex + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <Field
                        name={`curriculum.${weekIndex}.sessions.${sessionIndex}.title`}
                        placeholder={`Session ${sessionIndex + 1} topic / description...`}
                        className={`w-full px-2.5 py-1.5 text-xs sm:text-sm rounded-lg border transition-all focus:outline-none focus:ring-1 ${
                          isDark
                            ? "bg-darkmode border-dark_border text-white placeholder-gray focus:border-primary focus:ring-primary/30"
                            : "bg-white border-slate-200 text-midnight_text placeholder-gray focus:border-primary focus:ring-primary/20"
                        }`}
                      />
                    </div>

                    {week.sessions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(sessionIndex)}
                        className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0"
                        title="Delete Session"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}

                {/* Add Session */}
                <button
                  type="button"
                  onClick={() => push({ id: generateId(), title: "" })}
                  className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-lg transition-all ${
                    isDark
                      ? "text-primary hover:bg-primary/10"
                      : "text-primary hover:bg-primary/5"
                  }`}
                >
                  <FiPlus className="w-3.5 h-3.5" />
                  <span>Add Session</span>
                </button>
              </div>
            )}
          </FieldArray>
        </div>
      </div>

      {/* Drag Overlay Indicator */}
      {isDragging && (
        <div className="absolute inset-0 border-2 border-dashed border-primary rounded-xl pointer-events-none" />
      )}
    </div>
  );
};

export default SortableInternshipWeekItem;
