import {
  FaBook,
  FaClock,
  FaLayerGroup,
  FaPlayCircle,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUsers,
  FaGift,
  FaMedal,
  FaChartLine,
  FaCertificate,
  FaRocket,
  FaListUl,
  FaCheck,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { motion } from 'framer-motion';
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetStudentEnrolledCoursedetailsQuery } from '@/Services/student/enrollFormServices';
import { useTheme } from '@/context/ThemeContext';

const StudentEnrolledCourseDetails = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { courseId } = useParams();
  const { data, isLoading } =
    useGetStudentEnrolledCoursedetailsQuery(courseId);
    
  
  const [expandedModules, setExpandedModules] = useState([]);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-section dark:bg-darkmode">
        <div className="text-center">
          <div className={`w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4 ${
            isDark
              ? 'border-dark_border border-t-primary'
              : 'border-border border-t-primary'
          }`}></div>
          <p className={isDark ? 'text-gray' : 'text-gray'}>Loading your course...</p>
        </div>
      </div>
    );

  const enrollment = data?.data;
  if (!enrollment) return null;

  const {
    course,
    batch,
    payment,
    enrolledAt,
    liveClasses,
  } = enrollment;

  const isFreeBonus = !payment || payment?.status === "free";

  const toggleModule = (index) => {
    setExpandedModules(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const softSkillsContent = [
    {
      title: "Communication Skills",
      description: "Master effective communication in technical environments",
      icon: <FaUsers className="text-purple-500" />,
      color: "purple",
    },
    {
      title: "Team Collaboration",
      description: "Learn agile practices and team coordination",
      icon: <FaUsers className="text-blue-500" />,
      color: "blue",
    },
    {
      title: "Problem Solving",
      description: "Develop analytical thinking and solution-oriented approach",
      icon: <FaChartLine className="text-emerald-500" />,
      color: "emerald",
    },
    {
      title: "Interview Preparation",
      description: "Mock interviews and resume building workshops",
      icon: <FaMedal className="text-amber-500" />,
      color: "amber",
    },
  ];

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-4 space-y-6 sm:space-y-8 `}>

      {/* ===== Page Header ===== */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={``}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-3 py-2">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-midnight_text dark:text-white mb-1 line-clamp-2">
              {course?.name}
            </h1>
            <p className={`text-sm sm:text-base flex items-center gap-2 text-gray`}>
              <FaBook className="w-4 h-4 text-primary" />
              Continue your learning journey
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className={`text-xs font-bold px-3 py-2 rounded-full ${
              isDark
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-emerald-500/10 text-emerald-600'
            }`}>
              In Progress
            </span>
            {isFreeBonus && (
              <span className={`text-xs font-bold px-3 py-2 rounded-full ${
                isDark
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-amber-500/10 text-amber-600'
              }`}>
                Free Bonus
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* ===== Course Info ===== */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`rounded-2xl border overflow-hidden shadow-property hover:shadow-deatail_shadow transition ${
          isDark
            ? 'bg-semidark border-dark_border'
            : 'bg-white border-border'
        }`}
      >
        {/* <div className={`h-1 bg-gradient-to-r from-primary to-skyBlue`} /> */}
        
        <div className="md:grid md:grid-cols-3 gap-0">
          <div className="md:col-span-1 overflow-hidden">
            <img
              src={course?.thumbnail}
              alt={course?.name}
              className="w-full h-48 sm:h-56 md:h-full object-cover"
            />
          </div>

          <div className="md:col-span-2 p-4 sm:p-6 lg:p-8">
            <div className="space-y-3 sm:space-y-4">
              <p className={`text-xs sm:text-sm line-clamp-3 text-gray`}>
                {course?.shortdescription}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                <div className={`rounded-lg p-2 sm:p-3 ${
                  isDark ? 'bg-darklight' : 'bg-light'
                }`}>
                  <p className={`text-xs mb-1 text-gray`}>Category</p>
                  <p className={`text-sm sm:text-base font-medium text-midnight_text dark:text-white`}>{course?.category}</p>
                </div>

                <div className={`rounded-lg p-2 sm:p-3 ${
                  isDark ? 'bg-darklight' : 'bg-light'
                }`}>
                  <p className={`text-xs mb-1 text-gray`}>Duration</p>
                  <p className={`text-sm sm:text-base font-medium text-midnight_text dark:text-white`}>{course?.duration}</p>
                </div>

                <div className={`rounded-lg p-2 sm:p-3 ${
                  isDark ? 'bg-darklight' : 'bg-light'
                }`}>
                  <p className={`text-xs mb-1 text-gray`}>Price</p>
                  <p className={`text-sm sm:text-base font-medium text-midnight_text dark:text-white`}>
                    {isFreeBonus ? "Free" : `₹${Number(payment?.amountInRupees || 0).toLocaleString('en-IN')}`}
                  </p>
                </div>
              </div>

              <div className={`flex flex-col gap-2 pt-2 ${
                isDark ? 'border-t border-dark_border' : 'border-t border-border'
              }`}>
                <span className={`text-xs text-gray`}>
                  Enrolled on <span className={`font-semibold text-midnight_text dark:text-white`}>
                    {new Date(enrolledAt).toLocaleDateString('en-IN', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ===== Course Objectives ===== */}
      {course?.details?.objectives && course.details.objectives.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-2xl border p-4 sm:p-6 shadow-property hover:shadow-deatail_shadow transition ${
            isDark
              ? 'bg-semidark border-dark_border'
              : 'bg-white border-border'
          }`}
        >
          <div className="h-0.5 rounded-full mb-4 bg-gradient-to-r from-purple-500 to-pink-500" />
          <h2 className={`text-base sm:text-xl font-semibold mb-4 flex items-center gap-2 text-midnight_text dark:text-white`}>
            <FaRocket className="text-purple-500" />
            What You'll Learn
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {course.details.objectives.map((objective, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className={`flex items-start gap-3 p-2 sm:p-3 rounded-lg transition ${
                  isDark
                    ? 'bg-darklight hover:bg-darklight/80'
                    : 'bg-light hover:bg-light/80'
                }`}
              >
                <FaCheck className="text-purple-500 mt-0.5 flex-shrink-0 text-sm" />
                <span className={`text-xs sm:text-sm text-gray`}>{objective}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ===== Course Requirements ===== */}
      {course?.details?.requirements && course.details.requirements.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`rounded-2xl border p-4 sm:p-6 shadow-property hover:shadow-deatail_shadow transition ${
            isDark
              ? 'bg-semidark border-dark_border'
              : 'bg-white border-border'
          }`}
        >
          <div className="h-0.5 rounded-full mb-4 bg-gradient-to-r from-orange-500 to-amber-500" />
          <h2 className={`text-base sm:text-xl font-semibold mb-4 flex items-center gap-2 text-midnight_text dark:text-white`}>
            <FaListUl className="text-orange-500" />
            Prerequisites
          </h2>
          <ul className="space-y-2">
            {course.details.requirements.map((requirement, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className={`flex items-start gap-3 p-2 sm:p-3 rounded-lg transition ${
                  isDark
                    ? 'bg-darklight hover:bg-darklight/80'
                    : 'bg-light hover:bg-light/80'
                }`}
              >
                <span className={`font-bold text-lg flex-shrink-0 text-orange-500`}>•</span>
                <span className={`text-xs sm:text-sm text-gray`}>{requirement}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* ===== Course Description ===== */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`rounded-2xl border p-4 sm:p-6 shadow-property hover:shadow-deatail_shadow transition ${
          isDark
            ? 'bg-semidark border-dark_border'
            : 'bg-white border-border'
        }`}
      >
        <div className="h-0.5 rounded-full mb-4 bg-gradient-to-r from-primary to-skyBlue" />
        <h2 className={`text-base sm:text-xl font-semibold mb-4 flex items-center gap-2 text-midnight_text dark:text-white`}>
          <FaBook className="text-primary" />
          Course Overview
        </h2>
        <p className={`text-xs sm:text-sm leading-relaxed whitespace-pre-line text-gray`}>
          {course?.details?.description}
        </p>
      </motion.div>

      {/* ===== Curriculum ===== */}
      {course?.details?.curriculum && course.details.curriculum.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`rounded-2xl border p-4 sm:p-6 shadow-property hover:shadow-deatail_shadow transition ${
            isDark
              ? 'bg-semidark border-dark_border'
              : 'bg-white border-border'
          }`}
        >
          <div className="h-0.5 rounded-full mb-4 bg-gradient-to-r from-indigo-500 to-purple-500" />
          <h2 className={`text-base sm:text-xl font-semibold mb-4 flex items-center gap-2 text-midnight_text dark:text-white`}>
            <FaBook className="text-indigo-500" />
            Course Curriculum
          </h2>
          <div className="space-y-2">
            {course.details.curriculum.map((module, moduleIndex) => (
              <motion.div 
                key={module._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + moduleIndex * 0.05 }}
                className={`border rounded-lg overflow-hidden transition ${
                  isDark
                    ? 'border-dark_border hover:border-indigo-500'
                    : 'border-border hover:border-indigo-400'
                }`}
              >
                <button
                  onClick={() => toggleModule(moduleIndex)}
                  className={`w-full px-3 py-3 sm:px-4 sm:py-3.5 flex items-center justify-between transition-colors ${
                    isDark
                      ? 'bg-darklight hover:bg-darklight/80'
                      : 'bg-light hover:bg-light/80'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className={`text-xs sm:text-sm font-semibold px-2 py-1 rounded ${
                      isDark
                        ? 'bg-indigo-500/20 text-indigo-400'
                        : 'bg-indigo-500/10 text-indigo-600'
                    }`}>
                      Module {moduleIndex + 1}
                    </span>
                    <span className={`text-xs sm:text-sm font-semibold truncate text-midnight_text dark:text-white`}>
                      {module.title}
                    </span>
                  </div>
                  <motion.span 
                    animate={{ rotate: expandedModules.includes(moduleIndex) ? 180 : 0 }}
                    className="text-gray flex-shrink-0"
                  >
                    {expandedModules.includes(moduleIndex) ? (
                      <FaChevronUp className="text-xs" />
                    ) : (
                      <FaChevronDown className="text-xs" />
                    )}
                  </motion.span>
                </button>

                <motion.div
                  initial={false}
                  animate={{
                    height: expandedModules.includes(moduleIndex) ? "auto" : 0,
                    opacity: expandedModules.includes(moduleIndex) ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className={`px-3 py-3 sm:px-4 sm:py-3.5 space-y-2 border-t ${
                    isDark
                      ? 'bg-darkmode border-dark_border'
                      : 'bg-section border-border'
                  }`}>
                    {module.sessions.map((session, sessionIndex) => (
                      <motion.div
                        key={session._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + sessionIndex * 0.05 }}
                        className={`flex items-center gap-3 p-2 rounded transition ${
                          isDark
                            ? 'bg-semidark hover:bg-darklight'
                            : 'bg-white hover:bg-light'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 bg-indigo-500`}></div>
                        <span className={`text-xs sm:text-sm truncate text-gray`}>{session.title}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ===== Batch Info ===== */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className={`rounded-2xl border p-4 sm:p-6 shadow-property hover:shadow-deatail_shadow transition ${
          isDark
            ? 'bg-semidark border-dark_border'
            : 'bg-white border-border'
        }`}
      >
        <div className="h-0.5 rounded-full mb-4 bg-gradient-to-r from-cyan-500 to-blue-500" />
        <h2 className={`text-base sm:text-xl font-semibold flex items-center gap-2 mb-4 text-midnight_text dark:text-white`}>
          <FaUsers className="text-cyan-500" />
          Batch Information
        </h2>

        {batch ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className={`p-3 rounded-lg border ${
              isDark
                ? 'bg-darklight border-dark_border'
                : 'bg-light border-border'
            }`}>
              <p className={`text-xs mb-1 font-medium text-gray`}>Batch Name</p>
              <p className={`text-sm sm:text-base font-semibold truncate text-midnight_text dark:text-white`}>{batch.batchName}</p>
            </div>

            <div className={`p-3 rounded-lg border ${
              isDark
                ? 'bg-darklight border-dark_border'
                : 'bg-light border-border'
            }`}>
              <p className={`text-xs mb-1 font-medium text-gray`}>Status</p>
              <p className={`text-sm sm:text-base font-semibold capitalize text-emerald-500`}>{batch.status}</p>
            </div>

            <div className={`p-3 rounded-lg border ${
              isDark
                ? 'bg-darklight border-dark_border'
                : 'bg-light border-border'
            }`}>
              <p className={`text-xs mb-1 font-medium text-gray`}>Start Date</p>
              <p className={`text-sm sm:text-base font-semibold text-midnight_text dark:text-white`}>{batch.startDate ? new Date(batch.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : "TBA"}</p>
            </div>

            <div className={`p-3 rounded-lg border ${
              isDark
                ? 'bg-darklight border-dark_border'
                : 'bg-light border-border'
            }`}>
              <p className={`text-xs mb-1 font-medium text-gray`}>End Date</p>
              <p className={`text-sm sm:text-base font-semibold text-midnight_text dark:text-white`}>{batch.endDate ? new Date(batch.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : "TBA"}</p>
            </div>
          </div>
        ) : (
          <div className={`text-xs sm:text-sm p-3 rounded-lg border ${
            isDark
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
          }`}>
            Batch not assigned yet. You will receive notification once assigned.
          </div>
        )}
      </motion.div>

      {/* ===== Live Classes ===== */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className={`rounded-2xl border p-4 sm:p-6 shadow-property hover:shadow-deatail_shadow transition ${
          isDark
            ? 'bg-semidark border-dark_border'
            : 'bg-white border-border'
        }`}
      >
        <div className="h-0.5 rounded-full mb-4 bg-gradient-to-r from-emerald-500 to-teal-500" />
        <h2 className={`text-base sm:text-xl font-semibold flex items-center gap-2 mb-4 text-midnight_text dark:text-white`}>
          <FaCalendarAlt className="text-emerald-500" />
          Live Classes
        </h2>

        {liveClasses?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveClasses.map((cls, index) => (
              <motion.div
                key={cls._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                className={`rounded-xl border shadow-sm hover:shadow-md transition overflow-hidden ${
                  isDark
                    ? 'bg-darklight border-dark_border'
                    : 'bg-white border-border'
                }`}
              >
                <div className={`h-1 ${
                  cls.status === 'completed' 
                    ? 'bg-gradient-to-r from-gray-500 to-gray-600'
                    : cls.status === 'ongoing'
                    ? 'bg-gradient-to-r from-red-500 to-rose-500 animate-pulse'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500'
                }`} />

                <div className="p-4 sm:p-5">
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <h3 className={`font-semibold text-sm sm:text-base line-clamp-2 flex-1 text-midnight_text dark:text-white`}>
                      {cls.title}
                    </h3>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${
                      cls.status === 'completed'
                        ? isDark ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-500/10 text-gray-600'
                        : cls.status === 'ongoing'
                        ? 'bg-red-500/20 text-red-500 animate-pulse'
                        : isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-500/10 text-amber-600'
                    }`}>
                      {cls.status === 'completed' ? 'Completed' : cls.status === 'ongoing' ? 'Live Now' : 'Upcoming'}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className={`flex items-center gap-2 text-xs sm:text-sm rounded-lg p-2 ${
                      isDark
                        ? 'bg-darkmode text-gray'
                        : 'bg-section text-gray'
                    }`}>
                      <FaCalendarAlt className="flex-shrink-0 text-emerald-500" />
                      <span>
                        {new Date(cls.startTime).toLocaleDateString('en-IN', { 
                          month: 'short', 
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className={`flex items-center gap-2 text-xs sm:text-sm rounded-lg p-2 ${
                      isDark
                        ? 'bg-darkmode text-gray'
                        : 'bg-section text-gray'
                    }`}>
                      <FaClock className="flex-shrink-0 text-emerald-500" />
                      <span>
                        {new Date(cls.startTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </span>
                    </div>
                  </div>

                  {cls.status !== "completed" && cls.zoomJoinUrl ? (
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      href={cls.zoomJoinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full block text-center rounded-lg text-white text-xs sm:text-sm font-semibold py-2.5 transition shadow-md hover:shadow-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <FaPlayCircle className="w-3.5 h-3.5" />
                        Join Now
                      </span>
                    </motion.a>
                  ) : cls.status === "completed" ? (
                    <button
                      disabled
                      className={`w-full py-2.5 text-xs sm:text-sm font-semibold rounded-lg ${
                        isDark
                          ? 'text-gray bg-darkmode'
                          : 'text-gray bg-section'
                      }`}
                    >
                      Class Ended
                    </button>
                  ) : (
                    <button
                      disabled
                      className={`w-full py-2.5 text-xs sm:text-sm font-semibold rounded-lg border ${
                        isDark
                          ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                          : 'text-amber-600 bg-amber-500/10 border-amber-500/20'
                      }`}
                    >
                      Coming Soon
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className={`text-center py-8 text-gray`}>
            <FaCalendarAlt className={`text-4xl mx-auto mb-3 text-gray`} />
            <p className="text-sm sm:text-base">
              No live classes scheduled yet.
            </p>
          </div>
        )}
      </motion.div>

      {/* ===== Soft Skills Bonus ===== */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className={`rounded-2xl border p-4 sm:p-6 shadow-property hover:shadow-deatail_shadow transition ${
          isDark
            ? 'bg-semidark border-dark_border'
            : 'bg-white border-border'
        }`}
      >
        <div className="h-0.5 rounded-full mb-4 bg-gradient-to-r from-purple-500 to-pink-500" />
        
        <div className="flex items-start justify-between mb-4 gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg shadow-md bg-gradient-to-r from-purple-500 to-pink-500`}>
              <FaGift className="text-white text-lg" />
            </div>
            <div>
              <h3 className={`text-base sm:text-lg font-semibold text-midnight_text dark:text-white`}>
                Exclusive Soft Skills Training
              </h3>
              <p className={`text-xs mt-0.5 text-gray`}>
                Free bonus with your technical course
              </p>
            </div>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 shadow-md ${
            isDark
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-emerald-500 text-white'
          }`}>
            Complimentary
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {softSkillsContent.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.05 }}
              className={`p-3 rounded-lg border transition ${
                isDark
                  ? 'bg-darklight border-dark_border hover:border-purple-500'
                  : 'bg-light border-border hover:border-purple-400'
              }`}
            >
              <div className="flex flex-col items-center text-center gap-2">
                <div className={`p-2.5 rounded-full ${
                  isDark ? 'bg-darkmode' : 'bg-white'
                }`}>
                  {skill.icon}
                </div>
                <div>
                  <h4 className={`text-xs sm:text-sm font-semibold line-clamp-2 text-midnight_text dark:text-white`}>
                    {skill.title}
                  </h4>
                  <p className={`text-xs mt-1 line-clamp-2 text-gray`}>
                    {skill.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className={`flex flex-wrap items-center gap-3 pt-4 border-t ${
          isDark ? 'border-dark_border' : 'border-border'
        }`}>
          <div className={`flex items-center gap-2 text-xs sm:text-sm text-gray`}>
            <FaCertificate className={`text-lg text-purple-500`} />
            <span className="font-medium">Certificate included</span>
          </div>
          <div className={`flex items-center gap-2 text-xs sm:text-sm text-gray`}>
            <FaRocket className={`text-lg text-pink-500`} />
            <span className="font-medium">Career booster</span>
          </div>
          <div className={`flex items-center gap-2 text-xs sm:text-sm text-gray`}>
            <FaUsers className={`text-lg text-blue-500`} />
            <span className="font-medium">Group workshops</span>
          </div>
        </div>
      </motion.div>

      {/* ===== Payment Info ===== */}
      {payment && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className={`rounded-2xl border p-4 sm:p-6 shadow-property hover:shadow-deatail_shadow transition ${
            isDark
              ? 'bg-semidark border-dark_border'
              : 'bg-white border-border'
          }`}
        >
          <div className="h-0.5 rounded-full mb-4 bg-gradient-to-r from-primary to-skyBlue" />
          <h2 className={`text-base sm:text-xl font-semibold mb-4 flex items-center gap-2 text-midnight_text dark:text-white`}>
            <FaMoneyBillWave className="text-primary" />
            Payment Details
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className={`p-3 rounded-lg border ${
              isDark
                ? 'bg-darklight border-dark_border'
                : 'bg-light border-border'
            }`}>
              <p className={`text-xs mb-1 font-medium text-gray`}>Status</p>
              <p className={`text-sm sm:text-base font-semibold capitalize text-emerald-500`}>{payment.status}</p>
            </div>

            <div className={`p-3 rounded-lg border ${
              isDark
                ? 'bg-darklight border-dark_border'
                : 'bg-light border-border'
            }`}>
              <p className={`text-xs mb-1 font-medium text-gray`}>Amount</p>
              <p className={`text-sm sm:text-base font-semibold text-midnight_text dark:text-white`}>₹{Number(payment.amountInRupees || 0).toLocaleString('en-IN')}</p>
            </div>

            <div className={`p-3 rounded-lg border ${
              isDark
                ? 'bg-darklight border-dark_border'
                : 'bg-light border-border'
            }`}>
              <p className={`text-xs mb-1 font-medium text-gray`}>Mode</p>
              <p className={`text-sm sm:text-base font-semibold capitalize text-midnight_text dark:text-white`}>{payment.paymentMode || 'N/A'}</p>
            </div>

            <div className={`p-3 rounded-lg border ${
              isDark
                ? 'bg-darklight border-dark_border'
                : 'bg-light border-border'
            }`}>
              <p className={`text-xs mb-1 font-medium text-gray`}>Paid On</p>
              <p className={`text-sm sm:text-base font-semibold text-midnight_text dark:text-white`}>
                {new Date(payment.createdAt).toLocaleDateString('en-IN', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ===== Bonus Banner ===== */}
      {isFreeBonus && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className={`rounded-2xl p-4 sm:p-6 shadow-property hover:shadow-deatail_shadow transition ${
            isDark
              ? 'bg-gradient-to-r from-emerald-900/20 to-teal-900/20 border border-emerald-500/20'
              : 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
              <FaGift className="text-2xl text-white" />
            </div>
            <div>
              <p className="font-bold text-base sm:text-lg text-midnight_text dark:text-white">
                🎁 This course was provided as a complimentary bonus.
              </p>
              <p className="text-sm text-gray mt-1">
                Enjoy learning at no cost!
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StudentEnrolledCourseDetails;