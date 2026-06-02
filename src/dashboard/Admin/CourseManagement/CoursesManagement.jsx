import { motion, AnimatePresence } from "framer-motion";
import { useCourseHandlers } from "./courseshooks";
import { useCourses } from '@/hooks/useCourses';
import { MODAL_TYPES, useModal } from '@/dashboard/Admin/Modals/ModalContext';
import { useTheme } from '@/context/ThemeContext';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
  FiGrid,
  FiList,
  FiBookOpen,
} from "react-icons/fi";

const CoursesManagement = () => {
  const { courses = [] } = useCourses();
  const { openModal } = useModal();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { handleDeleteCourse } = useCourseHandlers();

  const [view, setView] = useState("cards");

  return (
    <div className={`min-h-screen py-6 px-4`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ===== Page Header ===== */}
        <div className={`px-2`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className={`text-2xl sm:text-3xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-midnight_text'
                  }`}>
                  Course Management
                </h1>
              </div>
              <p className={`text-sm flex items-center gap-2 text-gray`}>
                <FiBookOpen className="w-4 h-4" />
                Manage courses and their batches
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openModal(MODAL_TYPES.ADD_COURSE, { mode: "add" })}
              className={`flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all shadow-md hover:shadow-lg btn btn-primary`}
            >
              <FiPlus className="w-4 h-4" />
              Add Course
            </motion.button>
          </div>

          {/* 💡 Google Play Note */}
          <div className={`mt-6 p-3 sm:p-4 rounded-xl border ${isDark
              ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
              : 'bg-blue-50 border-blue-100 text-blue-700'
            }`}>
            <div className="text-xs sm:text-sm font-medium flex items-start gap-2">
              <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 animate-pulse mt-1 sm:mt-1.5" />
              <span>
                <strong>Note:</strong> Use the <b>Google Product ID</b> generated for each course in your Google Play Console to enable mobile in-app purchases.
              </span>
            </div>
          </div>
        </div>

        {/* ===== View Toggle & Stats ===== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className={`rounded-xl px-4 py-3 border ${isDark
              ? 'bg-darklight border-dark_border'
              : 'bg-light border-border'
            }`}>
            <p className={`text-sm text-gray`}>
              <span className={`font-bold text-primary`}>{courses.length}</span>
              <span> total courses</span>
            </p>
          </div>

          <div className={`inline-flex rounded-lg border p-1 ${isDark
              ? 'bg-darklight border-dark_border'
              : 'bg-light border-border'
            }`}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setView("cards")}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${view === "cards"
                  ? isDark
                    ? 'btn-primary shadow'
                    : 'btn-primary shadow'
                  : isDark
                    ? 'text-gray hover:text-white'
                    : 'text-gray hover:text-midnight_text'
                }`}
            >
              <FiGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Cards</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setView("table")}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${view === "table"
                  ? isDark
                    ? 'btn-primary shadow'
                    : 'btn-primary shadow'
                  : isDark
                    ? 'text-gray hover:text-white'
                    : 'text-gray hover:text-midnight_text'
                }`}
            >
              <FiList className="w-4 h-4" />
              <span className="hidden sm:inline">Table</span>
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {view === "cards" ? (
            <CoursesCardView
              courses={courses}
              isDark={isDark}
              onEdit={(course) =>
                openModal(MODAL_TYPES.ADD_COURSE, { mode: "edit", course })
              }
              onDelete={(id) => {
                const confirmDelete = window.confirm(
                  "Are you sure you want to delete this course? This will permanently remove all course details."
                );
                if (confirmDelete) {
                  handleDeleteCourse(id);
                }
              }}
            />
          ) : (
            <CoursesTableView
              courses={courses}
              isDark={isDark}
              onEdit={(course) =>
                openModal(MODAL_TYPES.ADD_COURSE, { mode: "edit", course })
              }
              onDelete={(id) => {
                const confirmDelete = window.confirm(
                  "Are you sure you want to delete this course? This will permanently remove all course details."
                );
                if (confirmDelete) {
                  handleDeleteCourse(id);
                }
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CoursesManagement;

const CoursesCardView = ({
  courses,
  isDark,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();
  const { openModal } = useModal();

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course, idx) => (
        <motion.div
          key={course._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className={`rounded-xl border shadow-property hover:shadow-deatail_shadow transition-all overflow-hidden ${isDark
              ? 'bg-semidark border-dark_border'
              : 'bg-white border-border'
            }`}
        >
          {/* Thumbnail */}
          <div className="relative h-44 bg-gradient-to-br from-primary/20 to-skyBlue/20">
            {course.thumbnail ? (
              <img
                src={course.thumbnail}
                alt={course.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FiBookOpen className={`w-12 h-12 ${isDark ? 'text-gray' : 'text-gray'}`} />
              </div>
            )}
            {/* Price Badge */}
            <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold shadow-md ${course.price === 0
                ? 'bg-emerald-500 text-white'
                : 'bg-primary text-white'
              }`}>
              {course.price === 0 ? "FREE" : `₹${course.price}`}
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="flex justify-between items-start gap-2 mb-2">
              <div className="flex-1">
                <h3 className={`font-semibold text-lg line-clamp-1 ${isDark ? 'text-white' : 'text-midnight_text'
                  }`}>
                  {course.name}
                </h3>
                <p className={`text-sm text-gray mt-0.5`}>
                  {course.category}
                </p>
              </div>
            </div>

            <p className={`text-sm mt-2 line-clamp-2 text-gray`}>
              {course.shortdescription || "No short description added yet"}
            </p>

            <div className="flex justify-between items-center mt-4 pt-3 border-t border-dashed border-gray/20">
              <div className="flex flex-col gap-1">
                <span className={`text-[10px] uppercase font-bold text-gray/60 tracking-wider`}>
                  Product ID
                </span>
                <span className={`text-[11px] font-mono ${isDark ? 'text-primary' : 'text-primary_dark'}`}>
                  {course.googleProductId || "N/A"}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  title="Edit Course"
                  onClick={() => onEdit(course)}
                  className={`p-1.5 rounded-lg transition ${isDark
                      ? 'btn-edit-dark'
                      : 'btn-edit'
                    }`}
                >
                  <FiEdit className="w-4 h-4" />
                </button>

                {course.details ? (
                  <button
                    title="View Details"
                    onClick={() => navigate(`/dashboard/course/${course._id}`)}
                    className={`p-1.5 rounded-lg transition ${isDark
                        ? 'btn-view-dark'
                        : 'btn-view'
                      }`}
                  >
                    <FiEye className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    title="Add Details"
                    onClick={() =>
                      openModal(MODAL_TYPES.ADD_COURSE_DETAILS, {
                        courseId: course._id,
                      })
                    }
                    className={`p-1.5 rounded-lg transition ${isDark
                        ? 'btn-view-dark'
                        : 'btn-view'
                      }`}
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                )}

                <button
                  title="Delete Course"
                  onClick={() => onDelete(course._id)}
                  className={`p-1.5 rounded-lg transition ${isDark
                      ? 'btn-delete-dark'
                      : 'btn-delete'
                    }`}
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const CoursesTableView = ({
  courses,
  isDark,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();
  const { openModal } = useModal();

  return (
    <div className={`rounded-xl border shadow-property overflow-hidden ${isDark
        ? 'bg-semidark border-dark_border'
        : 'bg-white border-border'
      }`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`border-b ${isDark ? 'border-dark_border' : 'border-border'
            }`}>
            <tr className={`text-left text-sm ${isDark ? 'bg-darklight' : 'bg-light'
              }`}>
              <th className={`px-5 py-4 font-semibold text-gray`}>Course</th>
              <th className={`px-5 py-4 font-semibold text-gray`}>Category</th>
              <th className={`px-5 py-4 font-semibold text-gray`}>Product ID</th>
              <th className={`px-5 py-4 font-semibold text-gray`}>Price</th>
              <th className={`px-5 py-4 text-right font-semibold text-gray`}>Actions</th>
            </tr>
          </thead>

          <tbody className={`divide-y ${isDark ? 'divide-dark_border' : 'divide-border'
            }`}>
            {courses.map((course, idx) => (
              <motion.tr
                key={course._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.03 }}
                className={`transition-colors ${isDark
                    ? 'hover:bg-darklight'
                    : 'hover:bg-light'
                  }`}
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-skyBlue/20 flex-shrink-0">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FiBookOpen className={`w-5 h-5 text-gray`} />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className={`font-medium ${isDark ? 'text-white' : 'text-midnight_text'
                        }`}>
                        {course.name}
                      </div>
                      <div className={`text-xs text-gray line-clamp-1 max-w-xs`}>
                        {course.shortdescription || "No description"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className={`px-5 py-4 text-gray`}>{course.category}</td>
                <td className={`px-5 py-4`}>
                  <code className={`text-xs px-2 py-1 rounded bg-gray/10 font-mono ${isDark ? 'text-primary' : 'text-primary_dark'}`}>
                    {course.googleProductId || "N/A"}
                  </code>
                </td>
                <td className={`px-5 py-4`}>
                  <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${course.price === 0
                      ? `${isDark
                        ? 'btn-view-dark'
                        : 'btn-view'}`
                      : 'btn-border'
                    }`}>
                    ₹{course.price}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      title="Edit Course"
                      onClick={() => onEdit(course)}
                      className={`p-1.5 rounded-lg transition ${isDark
                          ? 'btn-edit-dark'
                          : 'btn-edit'
                        }`}
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>

                    {course.details ? (
                      <button
                        title="View Details"
                        onClick={() => navigate(`/dashboard/course/${course._id}`)}
                        className={`p-1.5 rounded-lg transition ${isDark
                            ? 'btn-view-dark'
                            : 'btn-view'
                          }`}
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        title="Add Details"
                        onClick={() =>
                          openModal(MODAL_TYPES.ADD_COURSE_DETAILS, {
                            courseId: course._id,
                          })
                        }
                        className={`p-1.5 rounded-lg transition ${isDark
                            ? 'btn-view-dark'
                            : 'btn-view'
                          }`}
                      >
                        <FiPlus className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      title="Delete Course"
                      onClick={() => onDelete(course._id)}
                      className={`p-1.5 rounded-lg transition ${isDark
                          ? 'btn-delete-dark'
                          : 'btn-delete'
                        }`}
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};