import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetMyInternshipDetailsQuery } from '@/Services/paymentServices/internshipsServices';
import { useGetLiveClassesQuery } from '@/Services/student/liveClassServices';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaArrowLeft, FaVideo, FaPlayCircle, FaClock, FaGift, FaArrowRight,
  FaLaptopCode,
  FaCertificate,
  FaTasks,
  FaBook,
  FaRocket,
  FaCheck,
  FaListUl
} from 'react-icons/fa';

const MyInternshipDetails = () => {
  const getLiveClassStatus = (date, duration = 60) => {
    const classTime = new Date(date);
    const now = new Date();

    if (classTime.getFullYear() !== now.getFullYear() ||
      classTime.getMonth() !== now.getMonth() ||
      classTime.getDate() !== now.getDate()) {
      const isPastDate = classTime.getFullYear() < now.getFullYear() ||
        (classTime.getFullYear() === now.getFullYear() && classTime.getMonth() < now.getMonth()) ||
        (classTime.getFullYear() === now.getFullYear() && classTime.getMonth() === now.getMonth() && classTime.getDate() < now.getDate());

      return isPastDate ? 'completed' : 'upcoming';
    }

    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = classTime.getHours() * 60 + classTime.getMinutes();
    const endMinutes = startMinutes + duration;

    if (nowMinutes >= startMinutes && nowMinutes <= endMinutes) return 'ongoing';
    if (nowMinutes < startMinutes) return 'upcoming';
    return 'completed';
  };

  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { internshipId } = useParams();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [expandedWeeks, setExpandedWeeks] = useState([0]);

  const toggleWeek = (index) => {
    setExpandedWeeks((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatus = (date) => {
    const classTime = new Date(date);
    const now = currentTime;

    // Check if we are within the same day
    const isSameDay = classTime.getDate() === now.getDate() &&
      classTime.getMonth() === now.getMonth() &&
      classTime.getFullYear() === now.getFullYear();

    const classMinutes = classTime.getHours() * 60 + classTime.getMinutes();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    if (isSameDay) {
      if (nowMinutes >= classMinutes && nowMinutes <= classMinutes + 90) return 'live'; // assume 90 min duration
      if (nowMinutes < classMinutes) return 'upcoming';
    }

    if (now > classTime) return 'completed';
    return 'upcoming';
  };

  const { data, isLoading } = useGetMyInternshipDetailsQuery(internshipId);
  const { data: liveClassesData } = useGetLiveClassesQuery(undefined, { refetchOnMountOrArgChange: true });
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-primary border-gray rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray">Loading internship details...</p>
        </div>
      </div>
    );
  }

  const internship = data?.data;

  const filteredLiveClasses = liveClassesData?.liveClasses?.filter(
    cls => {
      const matchDomain = cls.internshipDomainId?._id === internship?.domainDetails?._id || cls.internshipDomainId === internship?.domainDetails?._id || cls.internshipDomain?._id === internship?.domainDetails?._id;
      const matchBatch = cls.batch?._id === internship?.batch?._id || cls.batch === internship?.batch?._id || cls.batch?._id === internship?.batch || cls.batch === internship?.batch;
      return matchDomain && matchBatch;
    }
  ) || [];

  if (!internship) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Internship Not Found</h2>
          <Link to="/dashboard/student/mycourses" className="text-primary hover:underline">
            Go back to My Learnings
          </Link>
        </div>
      </div>
    );
  }

  const durationText = internship.program === "5" ? "5 Days Intensive" : `${internship.program} Days Comprehensive`;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">

      {/* Back Button */}
      <Link
        to="/dashboard/student/mycourses"
        className="inline-flex items-center gap-2 text-sm text-gray hover:text-primary transition"
      >
        <FaArrowLeft /> Back to My Learnings
      </Link>

      {/* Header Banner */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`relative overflow-hidden rounded-3xl p-8 sm:p-10 ${isDark ? 'bg-darkmode border border-dark_border' : 'bg-gradient-to-br from-midnight_text via-blue-950 to-indigo-950'} shadow-2xl`}
      >
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[400px] h-[400px] rounded-full bg-primary/20 blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[300px] h-[300px] rounded-full bg-blue-500/20 blur-[60px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-start gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-white font-bold text-xs uppercase tracking-widest mb-6 backdrop-blur-md border border-white/10">
              <FaLaptopCode className="text-sm" /> Industrial Internship
            </div>
            <h1 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-white leading-[1.2] mb-5 drop-shadow-md">
              {internship.domain} <span className="text-primary-light text-blue-400">Internship</span>
            </h1>
            <p className="text-blue-100 text-md leading-relaxed">
              Welcome to your <span className="font-bold text-white">{durationText}</span> industrial training program. Prepare to gain hands-on experience and industry-standard skills!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
            <div className="p-3 sm:p-4 rounded-xl flex items-center gap-3 min-w-[140px] bg-white/10 backdrop-blur-md border border-white/10 shadow-lg">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <FaCheckCircle size={18} />
              </div>
              <div>
                <p className="text-[10px] text-blue-200 uppercase font-bold tracking-wider mb-0.5">Status</p>
                <p className="font-bold text-base text-white leading-none">Active</p>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-xl flex items-center gap-3 min-w-[140px] bg-white/10 backdrop-blur-md border border-white/10 shadow-lg">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <FaCalendarAlt size={18} />
              </div>
              <div>
                <p className="text-[10px] text-blue-200 uppercase font-bold tracking-wider mb-0.5">Duration</p>
                <p className="font-bold text-base text-white leading-none">{durationText}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="space-y-8">


        {/* ===== Internship Objectives ===== */}
        {internship.domainDetails?.objectives && internship.domainDetails.objectives.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-3xl border p-6 md:p-8 mb-6 shadow-sm hover:shadow-md transition ${isDark
              ? 'bg-semidark border-dark_border'
              : 'bg-white border-slate-200'
              }`}
          >
            <div className="h-0.5 rounded-full mb-6 bg-gradient-to-r from-purple-500 to-pink-500" />
            <h2 className={`text-xl sm:text-xl font-bold mb-6 flex items-center gap-3 text-midnight_text dark:text-white`}>
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 shrink-0">
                <FaRocket className="text-md" />
              </div>
              What You'll Learn
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {internship.domainDetails.objectives.map((objective, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className={`flex items-start gap-4 p-4 rounded-xl transition ${isDark
                    ? 'bg-darklight hover:bg-darklight/80'
                    : 'bg-slate-50 hover:bg-slate-100'
                    }`}
                >
                  <FaCheck className="text-purple-500 mt-1 flex-shrink-0 text-base" />
                  <span className={`text-sm sm:text-base text-gray leading-relaxed`}>{objective}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ===== Internship Requirements ===== */}
        {internship.domainDetails?.requirements && internship.domainDetails.requirements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`rounded-3xl border p-6 md:p-8 mb-6 shadow-sm hover:shadow-md transition ${isDark
              ? 'bg-semidark border-dark_border'
              : 'bg-white border-slate-200'
              }`}
          >
            <div className="h-0.5 rounded-full mb-6 bg-gradient-to-r from-orange-500 to-amber-500" />
            <h2 className={`text-xl sm:text-xl font-bold mb-6 flex items-center gap-3 text-midnight_text dark:text-white`}>
              <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500 shrink-0">
                <FaListUl className="text-md" />
              </div>
              Prerequisites
            </h2>
            <ul className="space-y-3">
              {internship.domainDetails.requirements.map((requirement, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className={`flex items-start gap-4 p-4 rounded-xl transition ${isDark
                    ? 'bg-darklight hover:bg-darklight/80'
                    : 'bg-slate-50 hover:bg-slate-100'
                    }`}
                >
                  <span className={`font-bold text-xl flex-shrink-0 text-orange-500 leading-none`}>•</span>
                  <span className={`text-sm sm:text-base text-gray leading-relaxed`}>{requirement}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* ===== Internship Description ===== */}
        {internship.domainDetails?.description && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`rounded-3xl border p-6 md:p-8 mb-6 shadow-sm hover:shadow-md transition ${isDark
              ? 'bg-semidark border-dark_border'
              : 'bg-white border-slate-200'
              }`}
          >
            <div className="h-0.5 rounded-full mb-6 bg-gradient-to-r from-primary to-skyBlue" />
            <h2 className={`text-xl sm:text-xl font-bold mb-6 flex items-center gap-3 text-midnight_text dark:text-white`}>
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                <FaBook className="text-md" />
              </div>
              Internship Overview
            </h2>
            <p className={`text-sm sm:text-base leading-relaxed whitespace-pre-line text-gray`}>
              {internship.domainDetails.description}
            </p>
          </motion.div>
        )}

        {/* ===== Curriculum Section ===== */}
        {internship.domainDetails?.curriculum && internship.domainDetails.curriculum.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05 }}
            className={`p-6 md:p-8 rounded-3xl ${isDark ? 'bg-semidark border border-dark_border' : 'bg-white border shadow-sm'} mb-6`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <h2 className="text-xl sm:text-xl font-bold flex items-center gap-3 text-midnight_text dark:text-white">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
                  <FaBook className="text-md" />
                </div>
                <span>Internship Curriculum</span>
              </h2>
              <span className="text-xs font-bold px-4 py-1.5 rounded-full bg-primary/10 text-primary uppercase tracking-widest shrink-0 self-start sm:self-auto">
                {internship.domainDetails.curriculum.length} Weeks
              </span>
            </div>

            <div className="space-y-4">
              {internship.domainDetails.curriculum.map((week, weekIndex) => (
                <div
                  key={week._id || week.id || weekIndex}
                  className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isDark ? 'border-dark_border bg-darkmode' : 'border-slate-200 bg-white hover:border-primary/30 hover:shadow-md'
                    }`}
                >
                  <button
                    onClick={() => toggleWeek(weekIndex)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left transition-colors focus:outline-none"
                  >
                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-black px-3 py-1.5 rounded-lg shrink-0 uppercase tracking-widest ${isDark ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'
                        }`}>
                        Week {week.week || weekIndex + 1}
                      </span>
                      <span className={`font-bold text-base md:text-lg leading-tight ${isDark ? 'text-white' : 'text-midnight_text'}`}>
                        {week.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-gray uppercase tracking-widest shrink-0">
                      <span className="hidden sm:inline-block">{week.sessions?.length || 0} sessions</span>
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-darklight transform transition-transform duration-300 ${expandedWeeks.includes(weekIndex) ? 'rotate-180 bg-primary/10 text-primary dark:bg-primary/20' : ''}`}>
                        ▼
                      </span>
                    </div>
                  </button>

                  <div className={`overflow-hidden transition-all duration-300 ${expandedWeeks.includes(weekIndex) ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className={`px-5 pb-5 pt-2 space-y-2.5 ${isDark ? 'bg-darkmode' : 'bg-slate-50/50'}`}>
                      {week.sessions?.map((session, sIdx) => (
                        <div
                          key={session._id || session.id || sIdx}
                          className={`flex items-center gap-4 p-3.5 rounded-xl text-sm font-medium transition-colors ${isDark ? 'bg-semidark text-gray-200 border border-dark_border hover:border-primary/50' : 'bg-white text-midnight_text border border-slate-200 shadow-sm hover:border-primary/40 hover:shadow'
                            }`}
                        >
                          <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-black shrink-0">
                            {sIdx + 1}
                          </span>
                          <span className="leading-snug">{session.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}




        {/* ===== Live Classes ===== */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className={`rounded-3xl border p-6 md:p-8 mb-6 shadow-sm hover:shadow-md transition ${isDark
            ? 'bg-semidark border-dark_border'
            : 'bg-white border-slate-200'
            }`}
        >
          <div className="h-0.5 rounded-full mb-6 bg-gradient-to-r from-emerald-500 to-teal-500" />
          <h2 className={`text-xl sm:text-xl font-bold mb-6 flex items-center gap-3 text-midnight_text dark:text-white`}>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
              <FaCalendarAlt className="text-md" />
            </div>
            Live Classes
          </h2>

          {filteredLiveClasses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {filteredLiveClasses.map((cls, index) => {

                const status = getLiveClassStatus(cls.startTime, cls.duration);
                const clsDate = cls.startTime; // mapped for compatibility below

                return (
                  <motion.div
                    key={cls._id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    className={`rounded-xl border shadow-sm hover:shadow-md transition overflow-hidden ${isDark
                      ? 'bg-darklight border-dark_border'
                      : 'bg-white border-slate-200'
                      }`}
                  >
                    <div className={`h-1 ${status === 'completed'
                      ? 'bg-gradient-to-r from-gray-500 to-gray-600'
                      : status === 'ongoing'
                        ? 'bg-gradient-to-r from-red-500 to-rose-500 animate-pulse'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                      }`} />

                    <div className="p-4 sm:p-5">
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <h3 className={`font-semibold text-sm sm:text-base line-clamp-2 flex-1 text-midnight_text dark:text-white`}>
                          {cls.title}
                        </h3>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${status === 'completed'
                          ? isDark ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-500/10 text-gray-600'
                          : status === 'ongoing'
                            ? 'bg-red-500/20 text-red-500 animate-pulse'
                            : isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-500/10 text-emerald-600'
                          }`}>
                          {status === 'completed' ? 'Completed' : status === 'ongoing' ? 'Live Now' : 'Upcoming'}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className={`flex items-center gap-2 text-xs sm:text-sm rounded-lg p-2 ${isDark
                          ? 'bg-darkmode text-gray'
                          : 'bg-slate-50 text-gray'
                          }`}>
                          <FaCalendarAlt className="flex-shrink-0 text-emerald-500" />
                          <span>
                            {new Date(clsDate).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className={`flex items-center gap-2 text-xs sm:text-sm rounded-lg p-2 ${isDark
                          ? 'bg-darkmode text-gray'
                          : 'bg-slate-50 text-gray'
                          }`}>
                          <FaClock className="flex-shrink-0 text-emerald-500" />
                          <span>
                            {new Date(clsDate).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </span>
                        </div>
                      </div>

                      <Link
                        to="/dashboard/student/live-session"
                        className={`w-full block text-center rounded-lg text-white text-xs sm:text-sm font-semibold py-2.5 transition shadow-md hover:shadow-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700`}
                      >
                        <span className="flex items-center justify-center gap-2">
                          <FaPlayCircle className="w-3.5 h-3.5" />
                          Go to Live Sessions
                        </span>
                      </Link>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div className={`text-center py-8 text-gray`}>
              <FaCalendarAlt className={`text-4xl mx-auto mb-3 text-gray/50`} />
              <p className="text-sm sm:text-base">
                No live classes scheduled yet.
              </p>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
};

export default MyInternshipDetails;
