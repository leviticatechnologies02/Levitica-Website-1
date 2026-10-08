import { motion } from "framer-motion";
import {
  BookOpen,
  Layers,
  Clock,
  ArrowRight,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { useGetStudentEnrolledCoursesQuery } from '@/Services/student/enrollFormServices';
import { useGetMyInternshipsQuery } from '@/Services/paymentServices/internshipsServices';
import { Link } from "react-router-dom";
import { useTheme } from '@/context/ThemeContext';

/* ================= CARD ================= */
const EnrolledCourseCard = ({ course, index }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -8 }}
      className={`rounded-2xl border shadow-property hover:shadow-deatail_shadow transition overflow-hidden flex flex-col group ${isDark
        ? 'bg-semidark border-dark_border'
        : 'bg-white border-border'
        }`}
    >
      {/* Thumbnail */}
      <div className={`h-48 overflow-hidden relative ${isDark ? 'bg-darklight' : 'bg-light'
        }`}>
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.courseName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray">
            <BookOpen size={40} />
          </div>
        )}

        {/* Completed Badge */}
        {course.completed && (
          <div className="absolute top-3 right-3">
            <span className="flex items-center gap-1 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-property">
              <CheckCircle size={14} className="fill-current" />
              Completed
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">

        <h3 className="font-bold text-base sm:text-lg line-clamp-2 mb-2 text-midnight_text dark:text-white">
          {course.courseName}
        </h3>

        {/* Batch */}
        <div className="mb-3">
          {course.batchName ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border bg-light dark:bg-darklight border-border dark:border-dark_border text-primary">
              Batch: {course.batchName}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border bg-light dark:bg-darklight border-border dark:border-dark_border text-gray">
              Batch Not Assigned
            </span>
          )}
        </div>

        <p className="text-xs sm:text-sm line-clamp-2 mb-3 flex-1 text-gray">
          {course.shortDescription || "No description available."}
        </p>

        {/* Meta */}
        <div className="grid grid-cols-2 gap-2 mb-3">

          <div className="flex items-center gap-1.5 rounded-lg p-2 bg-light dark:bg-darklight">
            <Layers size={14} className="text-primary" />
            <span className="text-xs font-medium truncate text-gray">
              {course.category || "General"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg p-2 bg-light dark:bg-darklight">
            <Clock size={14} className="text-primary" />
            <span className="text-xs font-medium truncate text-gray">
              {course.duration || "Flexible"}
            </span>
          </div>

        </div>

        {/* Date */}
        <p className="text-xs mb-3 pt-3 border-t border-border dark:border-dark_border text-gray">
          Enrolled{" "}
          <span className="font-semibold text-midnight_text dark:text-white">
            {new Date(course.enrolledAt).toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </p>

        {/* Button */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            to={course.isInternship ? `/dashboard/student/myinternships/${course._id}` : `${course._id}`}
            className="w-full flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-lg transition shadow-property hover:shadow-deatail_shadow btn-primary"
          >
            Go to {course.isInternship ? "Internship" : "Course"}
            <ArrowRight size={16} />
          </Link>
        </motion.div>

      </div>
    </motion.div>
  );
};

/* ================= GRID ================= */
const EnrolledCoursesGrid = ({ courses }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course, index) => (
        <EnrolledCourseCard
          key={index}
          course={course}
          index={index}
        />
      ))}
    </div>
  );
};

/* ================= MAIN ================= */
const MyCourseList = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const {
    data: enrolledSummaryData,
    isLoading: isCoursesLoading,
  } = useGetStudentEnrolledCoursesQuery({ type: "summary" });

  const {
    data: internshipsData,
    isLoading: isInternshipsLoading,
  } = useGetMyInternshipsQuery();

  const enrolledCourses = enrolledSummaryData?.data || [];
  const internships = internshipsData?.data || [];

  const allLearnings = [...enrolledCourses, ...internships];
  const isLoading = isCoursesLoading || isInternshipsLoading;

  return (
    <div className={`min-h-screen py-6 px-4 space-y-6 sm:space-y-8 `}>

      {/* HERO (NO GRADIENT) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={` 
        `}
      >
        <div className="px-2">

          <div>
            <h1 className="text-3xl sm:text-3xl font-bold text-midnight_text dark:text-white flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-primary" />
              My <span className="text-primary">Learnings</span>
            </h1>

            <p className="text-sm sm:text-base text-gray">
              Access all your enrolled courses and internships
            </p>
          </div>

        </div>
      </motion.div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center mt-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray">Loading your courses…</p>
          </div>
        </div>
      )}

      {/* Empty */}
      {!isLoading && allLearnings.length === 0 && (
        <div className="flex flex-col items-center mt-16">
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-light dark:bg-darklight">
            <BookOpen size={28} className="text-primary" />
          </div>

          <h3 className="mt-4 font-semibold text-lg text-midnight_text dark:text-white">
            No courses or internships enrolled yet
          </h3>

          <p className="text-sm mt-1 text-gray">
            Start your learning journey today
          </p>
        </div>
      )}

      {/* Grid */}
      {!isLoading && allLearnings.length > 0 && (
        <EnrolledCoursesGrid courses={allLearnings} />
      )}

    </div>
  );
};

export default MyCourseList;