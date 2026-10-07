import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetMyInternshipDetailsQuery } from '@/Services/paymentServices/internshipsServices';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaArrowLeft,
  FaLaptopCode,
  FaCertificate,
  FaTasks,
  FaBook
} from 'react-icons/fa';

const MyInternshipDetails = () => {
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
        className={`relative overflow-hidden rounded-3xl p-8 sm:p-10 ${isDark ? 'bg-semidark' : 'bg-white border'} shadow-lg`}
      >
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider mb-4">
              <FaLaptopCode /> Industrial Internship
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-midnight_text dark:text-white leading-tight mb-4">
              {internship.domain} <span className="text-primary">Internship</span>
            </h1>
            <p className="text-gray text-lg max-w-2xl">
              Welcome to your {durationText} industrial training program. Prepare to gain hands-on experience and industry-standard skills!
            </p>
          </div>
          
          <div className="flex flex-col gap-3 min-w-[200px]">
             <div className={`p-4 rounded-2xl flex items-center gap-4 ${isDark ? 'bg-darkmode border border-dark_border' : 'bg-light border border-border'}`}>
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <FaCheckCircle size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray uppercase font-semibold tracking-wider">Status</p>
                  <p className="font-bold text-midnight_text dark:text-white">Active</p>
                </div>
             </div>
             
             <div className={`p-4 rounded-2xl flex items-center gap-4 ${isDark ? 'bg-darkmode border border-dark_border' : 'bg-light border border-border'}`}>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <FaCalendarAlt size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray uppercase font-semibold tracking-wider">Duration</p>
                  <p className="font-bold text-midnight_text dark:text-white">{durationText}</p>
                </div>
             </div>
          </div>
        </div>
      </motion.div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* ===== Curriculum Section ===== */}
          {internship.domainDetails?.curriculum && internship.domainDetails.curriculum.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.05 }}
              className={`p-6 rounded-3xl ${isDark ? 'bg-semidark' : 'bg-white border'} shadow-lg mb-6`}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                    <FaBook />
                  </div>
                  <span>Internship Curriculum</span>
                </h2>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
                  {internship.domainDetails.curriculum.length} Weeks
                </span>
              </div>

              <div className="space-y-3">
                {internship.domainDetails.curriculum.map((week, weekIndex) => (
                  <div
                    key={week._id || week.id || weekIndex}
                    className={`border rounded-2xl overflow-hidden transition ${
                      isDark ? 'border-dark_border bg-darkmode' : 'border-border bg-slate-50'
                    }`}
                  >
                    <button
                      onClick={() => toggleWeek(weekIndex)}
                      className="w-full px-4 py-3.5 flex items-center justify-between text-left transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                          isDark ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'
                        }`}>
                          Week {week.week || weekIndex + 1}
                        </span>
                        <span className={`font-semibold text-sm sm:text-base ${isDark ? 'text-white' : 'text-midnight_text'}`}>
                          {week.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray">
                        <span>{week.sessions?.length || 0} sessions</span>
                        <span className={`transform transition-transform duration-200 ${expandedWeeks.includes(weekIndex) ? 'rotate-180' : ''}`}>
                          ▼
                        </span>
                      </div>
                    </button>

                    {expandedWeeks.includes(weekIndex) && (
                      <div className="px-4 pb-4 pt-1 space-y-2">
                        {week.sessions?.map((session, sIdx) => (
                          <div
                            key={session._id || session.id || sIdx}
                            className={`flex items-center gap-3 p-2.5 rounded-xl text-xs sm:text-sm ${
                              isDark ? 'bg-semidark text-gray' : 'bg-white text-midnight_text border border-border/50'
                            }`}
                          >
                            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                              {sIdx + 1}
                            </span>
                            <span>{session.title}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={`p-6 rounded-3xl ${isDark ? 'bg-semidark' : 'bg-white border'} shadow-lg`}
          >
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <FaTasks />
              </div>
              Your Internship Roadmap
            </h2>
            
            
            {/* Dynamic Content Mapping */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {internship.domainDetails?.liveClasses?.map((cls, index) => {
                const status = getStatus(cls.date);
                
                return (
                <div key={`live-${index}`} className={`p-5 rounded-2xl border shadow-property hover:shadow-deatail_shadow transition-all duration-300 overflow-hidden flex flex-col group ${
                  isDark
                    ? 'bg-semidark border-dark_border'
                    : 'bg-white border-border'
                }`}>
                  <div className={`h-1.5 -mx-5 -mt-5 mb-4 bg-gradient-to-r ${
                    status === 'live' 
                      ? 'from-red-500 to-rose-500'
                      : status === 'upcoming'
                      ? 'from-amber-500 to-orange-500'
                      : status === 'completed'
                      ? 'from-green-500 to-emerald-500'
                      : 'from-gray-500 to-gray-600'
                  }`} />

                  <div className="flex justify-between items-start gap-2 mb-3">
                    <h3 className="font-bold text-lg text-midnight_text dark:text-white flex-1">{cls.title}</h3>
                    <div>
                      {status === 'live' && (
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-gradient-to-r from-red-500 to-rose-500 text-white animate-pulse shadow-md whitespace-nowrap">
                          LIVE
                        </span>
                      )}
                      {status === 'upcoming' && (
                        <span className="text-xs font-bold px-2 py-1 rounded-full text-amber-500 border border-amber-500 shadow-sm whitespace-nowrap">
                          Upcoming
                        </span>
                      )}
                      {status === 'completed' && (
                        <span className="text-xs font-bold px-2 py-1 rounded-full text-green-500 border border-green-500 shadow-sm whitespace-nowrap">
                          Completed
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 flex-1">
                    <div className={`flex items-center gap-2 text-sm rounded-lg p-2 ${isDark ? 'bg-darklight text-gray' : 'bg-light text-gray'}`}>
                      <FaCalendarAlt className="text-primary shrink-0" />
                      <span className="font-medium text-midnight_text dark:text-white">
                        {new Date(cls.date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </div>
                    {cls.passcode && (
                       <div className={`flex items-center gap-2 text-sm rounded-lg p-2 ${isDark ? 'bg-darklight text-gray' : 'bg-light text-gray'}`}>
                        <span className="font-medium">Passcode:</span> 
                        <span className="text-midnight_text dark:text-white tracking-widest">{cls.passcode}</span>
                      </div>
                    )}
                  </div>

                  <div className={`pt-3 border-t ${isDark ? 'border-dark_border' : 'border-border'}`}>
                    {(status === 'live' || status === 'upcoming') ? (
                       <a href={cls.zoomLink} target="_blank" rel="noreferrer" className={`block text-center w-full py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg transition ${status === 'live' ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:opacity-90' : 'bg-gradient-to-r from-primary to-skyBlue hover:opacity-90'}`}>
                         Join Meeting
                       </a>
                    ) : (
                      cls.recordingLink ? (
                        <a href={cls.recordingLink} target="_blank" rel="noreferrer" className="block text-center w-full py-2.5 rounded-xl text-sm font-semibold border-2 border-primary text-primary hover:bg-primary/5 transition">
                          Watch Recording
                        </a>
                      ) : (
                        <button disabled className="block text-center w-full py-2.5 rounded-xl text-sm font-semibold border-2 border-gray-300 text-gray-500 cursor-not-allowed">
                          Recording Unavailable
                        </button>
                      )
                    )}
                  </div>
                </div>
                );
              })}

              {(!internship.domainDetails?.liveClasses?.length) && (
                <div className="col-span-full text-center text-gray py-8 text-sm bg-gray-50 dark:bg-gray-800/30 rounded-xl">
                  No live sessions have been scheduled yet. Please check back later.
                </div>
              )}
            </div>
</motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`p-6 rounded-3xl ${isDark ? 'bg-semidark' : 'bg-white border'} shadow-lg`}
          >
            <h3 className="font-bold text-xl mb-4">Important Notice</h3>
            <div className={`p-4 rounded-xl border-l-4 border-primary ${isDark ? 'bg-primary/5' : 'bg-primary/5'}`}>
              <p className="text-sm text-gray mb-2">
                Your live sessions and project materials will be uploaded to this dashboard shortly before your scheduled start date. 
              </p>
              <p className="text-sm text-gray">
                Please check your registered email (<strong>{internship.email}</strong>) for communication from your mentors.
              </p>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default MyInternshipDetails;
