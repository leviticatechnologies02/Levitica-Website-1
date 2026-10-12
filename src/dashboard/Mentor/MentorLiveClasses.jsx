import React from "react";
import { motion } from "framer-motion";
import { FiVideo, FiCalendar, FiClock, FiLayers, FiExternalLink } from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";
import { useGetMentorLiveClassesQuery } from "@/Services/mentor/mentorPortalService";

const MentorLiveClasses = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { data, isLoading } = useGetMentorLiveClassesQuery();
  const liveClasses = data?.liveClasses || [];

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-bold flex items-center gap-2.5 ${
              isDark ? "text-white" : "text-midnight_text"
            }`}>
              <FiVideo className="text-primary" />
              Live Classes & Interactive Sessions
            </h1>
            <p className="text-sm text-gray mt-1">
              Host and join scheduled Zoom sessions for your batches and courses.
            </p>
          </div>
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 w-fit">
            {liveClasses.length} Scheduled Session{liveClasses.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Sessions Grid */}
        {isLoading ? (
          <div className="p-16 text-center text-sm text-gray">Loading live classes...</div>
        ) : liveClasses.length === 0 ? (
          <div className={`p-16 rounded-2xl border text-center space-y-3 ${
            isDark ? "bg-semidark border-dark_border" : "bg-white border-border"
          }`}>
            <FiVideo size={40} className="mx-auto text-primary opacity-30" />
            <h3 className="text-lg font-bold">No live classes scheduled</h3>
            <p className="text-xs text-gray max-w-sm mx-auto">
              Classes scheduled for your courses and batches will appear here with Host and Join links.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveClasses.map((lc) => (
              <motion.div
                key={lc._id}
                whileHover={{ y: -3 }}
                className={`p-5 rounded-2xl border flex flex-col justify-between shadow-sm transition ${
                  isDark
                    ? "bg-semidark border-dark_border text-white hover:border-primary/40"
                    : "bg-white border-border text-midnight_text hover:border-primary/40"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                      {lc.course?.name || "General Session"}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      lc.status === "scheduled"
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}>
                      {lc.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold line-clamp-1">{lc.title}</h3>
                    {lc.batch?.batchName && (
                      <p className="text-xs text-gray mt-0.5">Batch: {lc.batch.batchName}</p>
                    )}
                  </div>

                  <div className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                    isDark ? "bg-darklight/40 border-dark_border" : "bg-slate-50 border-border"
                  }`}>
                    <div className="flex items-center justify-between text-gray">
                      <span className="flex items-center gap-1.5">
                        <FiCalendar size={13} /> Date:
                      </span>
                      <span className="font-semibold text-slate-200">
                        {new Date(lc.startTime).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-gray">
                      <span className="flex items-center gap-1.5">
                        <FiClock size={13} /> Time:
                      </span>
                      <span className="font-semibold text-slate-200">
                        {new Date(lc.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-gray">
                      <span>Duration:</span>
                      <span className="font-semibold text-slate-200">{lc.duration || 60} mins</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-2 space-y-2">
                  {lc.zoomStartUrl && (
                    <a
                      href={lc.zoomStartUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 transition shadow-md"
                    >
                      <FiVideo size={14} /> Start as Host
                    </a>
                  )}

                  {lc.zoomJoinUrl && (
                    <a
                      href={lc.zoomJoinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-center block border border-border/40 hover:bg-gray/10 text-gray hover:text-white transition"
                    >
                      Join Meeting Link
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorLiveClasses;
