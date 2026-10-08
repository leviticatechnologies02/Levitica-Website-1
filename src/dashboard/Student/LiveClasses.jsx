import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Video,
  Clock,
  Calendar,
  User,
  PlayCircle,
  AlertCircle,
  BookOpen
} from 'lucide-react';
import { FiFilter } from 'react-icons/fi';
import { useGetLiveClassesQuery } from '@/Services/student/liveClassServices';
import { useJoinLiveClass } from '@/hooks/useJoinLiveClass';
import { useTheme } from '@/context/ThemeContext';

const LiveClasses = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [filteredClasses, setFilteredClasses] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedBatch, setSelectedBatch] = useState('all');

  const {
    data: liveClassesData,
    isLoading,
    error,
    refetch,
  } = useGetLiveClassesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const { joinClass } = useJoinLiveClass();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!liveClassesData?.liveClasses) return;

    let filtered = liveClassesData.liveClasses;

    if (selectedCourse !== 'all') {
      filtered = filtered.filter(
        cls => (cls.course?._id === selectedCourse) || (cls.internshipDomainId?._id === selectedCourse)
      );
    }

    if (selectedBatch !== 'all') {
      filtered = filtered.filter(
        cls => cls.batch?._id === selectedBatch
      );
    }

    setFilteredClasses(filtered);
  }, [liveClassesData, selectedCourse, selectedBatch]);

  const formatTime = date =>
    new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

  const shouldShowJoinButton = (startTime, duration) => {
    const classTime = new Date(startTime);
    const nowMinutes =
      currentTime.getHours() * 60 + currentTime.getMinutes();
    const startMinutes =
      classTime.getHours() * 60 + classTime.getMinutes();
    const endMinutes = startMinutes + duration;

    return nowMinutes >= startMinutes && nowMinutes <= endMinutes;
  };

  const isUpcomingToday = startTime => {
    const classTime = new Date(startTime);
    const nowMinutes =
      currentTime.getHours() * 60 + currentTime.getMinutes();
    const startMinutes =
      classTime.getHours() * 60 + classTime.getMinutes();
    return nowMinutes < startMinutes;
  };

  const getDailyStatus = (startTime, duration) => {
    if (shouldShowJoinButton(startTime, duration)) return 'live';
    if (isUpcomingToday(startTime)) return 'upcoming';
    return 'completed';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className={`w-12 h-12 border-4 rounded-full animate-spin ${isDark ? 'border-dark_border border-t-primary' : 'border-border border-t-primary'
            }`}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <AlertCircle size={40} className={`mx-auto text-red-500`} />
        <h3 className={`mt-4 font-semibold text-midnight_text dark:text-white`}>
          Failed to load classes
        </h3>
        <button
          onClick={refetch}
          className={`mt-4 px-4 py-2 rounded-lg text-white bg-primary hover:bg-skyBlue transition`}
        >
          Try Again
        </button>
      </div>
    );
  }

  const uniqueCourses = Array.from(
    new Map(
      (liveClassesData?.liveClasses || [])
        .filter(cls => cls.course || cls.internshipDomainId)
        .map(cls => {
          if (cls.internshipDomainId) {
            return [cls.internshipDomainId._id, { id: cls.internshipDomainId._id, name: cls.internshipDomainId.name + " (Internship)" }];
          }
          return [cls.course._id, { id: cls.course._id, name: cls.course.name }];
        })
    ).values()
  );
  const uniqueBatches = Array.from(
    new Map(
      (liveClassesData?.liveClasses || [])
        .filter(cls => cls.batch)
        .map(cls => [cls.batch._id, { id: cls.batch._id, name: cls.batch.batchName }])
    ).values()
  );

  return (
    <div className={`min-h-screen py-6 px-4 space-y-6 sm:space-y-8 `}>

      {/* ===== Page Header ===== */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={``}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-2">
          <div>
            <h1 className="text-3xl sm:text-3xl font-bold text-midnight_text dark:text-white mb-1">
              Live Classes
            </h1>
            <p className={`text-sm sm:text-base flex items-center gap-2 text-gray`}>
              <Video className="w-4 h-4 text-primary" />
              Join your scheduled live sessions
            </p>
          </div>
        </div>
      </motion.div>

      {/* ===== Filters Card ===== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl border p-4 sm:p-6 shadow-property hover:shadow-deatail_shadow transition ${isDark
            ? 'bg-semidark border-dark_border'
            : 'bg-white border-border'
          }`}
      >
        {/* <div className="h-0.5 rounded-full mb-4 bg-gradient-to-r from-primary to-skyBlue" /> */}
        <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 text-midnight_text dark:text-white`}>
          <FiFilter className="w-4 h-4 text-primary" />
          Filter Classes
        </h3>
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">

          <div>
            <label className={`block text-xs sm:text-sm font-medium mb-2 text-gray`}> Filter by Program </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className={`w-full rounded-lg border py-2.5 px-3 text-sm focus:ring-2 focus:outline-none transition cursor-pointer ${isDark
                  ? 'bg-darklight border-dark_border text-white focus:border-primary focus:ring-primary/20'
                  : 'bg-light border-border text-midnight_text focus:border-primary focus:ring-primary/20'
                }`}
            >
              <option value="all">All Programs</option>
              {uniqueCourses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-xs sm:text-sm font-medium mb-2 text-gray`}>
              Filter by Batch
            </label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className={`w-full rounded-lg border py-2.5 px-3 text-sm focus:ring-2 focus:outline-none transition cursor-pointer ${isDark
                  ? 'bg-darklight border-dark_border text-white focus:border-primary focus:ring-primary/20'
                  : 'bg-light border-border text-midnight_text focus:border-primary focus:ring-primary/20'
                }`}
            >
              <option value="all">All Batches</option>
              {uniqueBatches.map(batch => (
                <option key={batch.id} value={batch.id}>
                  {batch.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* ===== Stats ===== */}
      <div className={`rounded-xl border px-4 py-3 sm:py-4 ${isDark
          ? 'bg-darklight border-dark_border'
          : 'bg-light border-border'
        }`}>
        <p className={`text-sm text-gray`}>
          <span className={`font-bold text-primary`}>{filteredClasses.length}</span>
          <span> of </span>
          <span className={`font-bold text-primary`}>{liveClassesData?.liveClasses?.length || 0}</span>
          <span> live sessions</span>
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.length > 0 ? (
          filteredClasses.map(liveClass => {
            const status = getDailyStatus(
              liveClass.startTime,
              liveClass.duration
            );
            const canJoin = shouldShowJoinButton(
              liveClass.startTime,
              liveClass.duration
            );

            return (
              <motion.div
                key={liveClass._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                whileHover={{ y: -8 }}
                className={`rounded-2xl border shadow-property hover:shadow-deatail_shadow transition-all duration-300 overflow-hidden flex flex-col group ${isDark
                    ? 'bg-semidark border-dark_border'
                    : 'bg-white border-border'
                  }`}
              >
                <div className={`h-1.5 bg-gradient-to-r transition-all duration-300 group-hover:shadow-md ${status === 'live'
                    ? 'from-red-500 to-rose-500'
                    : status === 'upcoming'
                      ? 'from-amber-500 to-orange-500'
                      : status === 'completed'
                        ? 'from-green-500 to-emerald-500'
                        : 'from-gray-500 to-gray-600'
                  }`} />

                <div className="p-4 sm:p-5 lg:p-6 flex flex-col h-full">
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <h3 className={`font-bold text-base sm:text-lg lg:text-xl line-clamp-2 flex-1 text-midnight_text dark:text-white`}>
                      {liveClass.title}
                    </h3>
                    <div>
                      {status === 'live' && (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-red-500 to-rose-500 text-white animate-pulse inline-flex items-center gap-1 shadow-md whitespace-nowrap">
                          LIVE
                        </span>
                      )}
                      {status === 'upcoming' && (
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1 shadow-md whitespace-nowrap ${isDark
                            ? 'btn-border-amber'
                            : 'btn-border-amber'
                          }`}>
                          Upcoming
                        </span>
                      )}
                      {status === 'completed' && (
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1 shadow-md whitespace-nowrap ${isDark
                            ? 'btn-border-save'
                            : 'btn-border-save'
                          }`}>
                          Completed
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-2.5 flex-1 mb-4">
                    <div className={`flex items-center gap-2 text-xs sm:text-sm rounded-lg p-2 sm:p-2.5 ${isDark
                        ? 'bg-darklight text-gray'
                        : 'bg-light text-gray'
                      }`}>
                      <BookOpen className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-primary`} />
                      <span className="font-medium truncate text-midnight_text dark:text-white">{liveClass.course?.name || liveClass.internshipDomain?.name || "—"}</span>
                    </div>

                    <div className={`flex items-center gap-2 text-xs sm:text-sm rounded-lg p-2 sm:p-2.5 ${isDark
                        ? 'bg-darklight text-gray'
                        : 'bg-light text-gray'
                      }`}>
                      <User className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-purple-500`} />
                      <span className="font-medium truncate text-midnight_text dark:text-white">{liveClass.batch?.batchName || "—"}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                      <div className={`flex items-center gap-1.5 text-xs rounded-lg p-2 sm:p-2.5 ${isDark
                          ? 'bg-darklight text-gray'
                          : 'bg-light text-gray'
                        }`}>
                        <Calendar className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-emerald-500`} />
                        <span className="font-medium truncate text-midnight_text dark:text-white">
                          {new Date(liveClass.startTime).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div className={`flex items-center gap-1.5 text-xs rounded-lg p-2 sm:p-2.5 ${isDark
                          ? 'bg-darklight text-gray'
                          : 'bg-light text-gray'
                        }`}>
                        <Clock className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-orange-500`} />
                        <span className="font-medium truncate text-midnight_text dark:text-white">{formatTime(liveClass.startTime)}</span>
                      </div>
                    </div>

                    <div className={`text-xs rounded-lg p-2 sm:p-2.5 font-medium ${isDark
                        ? 'bg-darklight text-gray'
                        : 'bg-light text-gray'
                      }`}>
                      <Video className={`inline w-3 h-3 mr-1 text-primary`} /> {liveClass.duration} min
                    </div>

                    {liveClass.instructor?.name && (
                      <div className={`text-xs rounded-lg p-2 sm:p-2.5 font-medium ${isDark
                          ? 'bg-darklight text-indigo-400'
                          : 'bg-light text-indigo-600'
                        }`}>
                        👨‍🏫 {liveClass.instructor.name}
                      </div>
                    )}
                  </div>

                  <div className={`space-y-2 border-t pt-3 sm:pt-4 ${isDark ? 'border-dark_border' : 'border-border'
                    }`}>
                    {canJoin ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => joinClass(liveClass._id)}
                        className={`w-full flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl py-2 sm:py-2.5 text-xs sm:text-sm font-semibold shadow-lg hover:shadow-xl transition ${status === 'live'
                            ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700'
                            : 'bg-gradient-to-r from-primary to-skyBlue hover:from-skyBlue hover:to-primary'
                          } text-white`}
                      >
                        <PlayCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Join Class</span>
                      </motion.button>
                    ) : status === 'upcoming' ? (
                      <button
                        disabled
                        className={`w-full py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-lg border-2 ${isDark
                            ? 'btn-border-amber'
                            : 'btn-border-amber'
                          }`}
                      >
                        Starts at {formatTime(liveClass.startTime)}
                      </button>
                    ) : (
                      <button
                        disabled
                        className={`w-full py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-lg border-2 ${isDark
                            ? 'btn-border-save'
                            : 'btn-border-save'
                          }`}
                      >
                        Completed
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-16">
            <Calendar size={48} className={`mx-auto text-gray`} />
            <h3 className={`mt-4 font-semibold text-midnight_text dark:text-white`}>
              No Live Classes Found
            </h3>
            <p className={`mt-2 text-gray`}>
              {selectedCourse !== 'all' || selectedBatch !== 'all'
                ? 'No classes match your filters. Try different options.'
                : 'Check back later for upcoming sessions'
              }
            </p>
            {(selectedCourse !== 'all' || selectedBatch !== 'all') && (
              <button
                onClick={() => {
                  setSelectedCourse('all');
                  setSelectedBatch('all');
                }}
                className={`mt-4 px-4 py-2 rounded-lg text-sm font-medium transition text-white bg-primary hover:bg-skyBlue`}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveClasses;