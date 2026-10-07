import React, { useState } from "react";
import { useGetMeetingsQuery, useDeleteMeetingMutation } from '@/Services/admin/zoomService';
import toast from "react-hot-toast";
import { useModal, MODAL_TYPES } from '@/dashboard/Admin/Modals/ModalContext';
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from '@/context/ThemeContext';
import {
  FiGrid,
  FiList,
  FiSearch,
  FiFilter,
  FiCalendar,
  FiClock,
  FiUsers,
  FiBookOpen,
  FiPlay,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiRefreshCw,
  FiCopy,
  FiVideo,
  FiRadio,
  FiCheckCircle,
} from "react-icons/fi";

const AdminLiveClasses = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { data, isLoading, error, refetch } = useGetMeetingsQuery();
  const [deleteMeeting] = useDeleteMeetingMutation();
  const { openModal } = useModal();

  const [starting, setStarting] = useState(false);
  const [activeTab, setActiveTab] = useState("cards");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const meetings = data?.liveClasses || [];

  const handleStartClass = async (id) => {
    try {
      setStarting(true);
      window.location.href = `${import.meta.env.VITE_PROD_API_URL}/admin/zoom/start/${id}`;
    } finally {
      setStarting(false);
    }
  };

  const handleEdit = (liveClass) => {
    openModal(MODAL_TYPES.EDIT_MEETING, {
      initialData: liveClass,
    });
  };

  const handleCopy = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Joining link copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleDelete = (meetingId) => {
    toast((t) => (
      <div className={`flex flex-col gap-3 p-4 rounded-xl ${isDark ? 'bg-semidark text-white' : 'bg-white'}`}>
        <p className={`font-medium ${isDark ? 'text-white' : 'text-midnight_text'}`}>
          Are you sure you want to delete this live class?
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className={`px-4 py-2 rounded-lg font-medium transition ${isDark ? 'bg-darklight text-gray hover:bg-darklight/80' : 'bg-light text-gray hover:bg-light/80'}`}
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              try {
                toast.dismiss(t.id);
                await deleteMeeting(meetingId);
                toast.success("Class deleted successfully");
              } catch (error) {
                toast.error("Failed to delete class");
              }
            }}
            className="px-4 py-2 rounded-lg bg-rose-600 text-white font-medium hover:bg-rose-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: 6000 });
  };

  const filteredMeetings = meetings.filter((m) => {
    const matchSearch =
      !searchTerm ||
      m.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.course?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.batch?.batchName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.internshipDomain?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus =
      statusFilter === "all" || m.status === statusFilter;

    const matchDate =
      !dateFilter ||
      new Date(m.startTime).toDateString() === new Date(dateFilter).toDateString();

    return matchSearch && matchStatus && matchDate;
  });

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatTime = (d) =>
    new Date(d).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const StatusBadge = ({ status }) => {
    const styles = {
      ongoing: {
        bg: "bg-gradient-to-r from-rose-500 to-rose-600",
        text: "text-white",
        pulse: "animate-pulse",
        icon: <FiRadio className="w-3 h-3" />,
        label: "Live"
      },
      completed: {
        bg: "bg-gradient-to-r from-emerald-500 to-emerald-600",
        text: "text-white",
        pulse: "",
        icon: <FiCheckCircle className="w-3 h-3" />,
        label: "Completed"
      },
      scheduled: {
        bg: "bg-gradient-to-r from-amber-500 to-orange-500",
        text: "text-white",
        pulse: "",
        icon: <FiClock className="w-3 h-3" />,
        label: "Upcoming"
      },
    };
    const style = styles[status] || styles.scheduled;
    return (
      <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${style.bg} ${style.text} ${style.pulse} inline-flex items-center gap-1.5 shadow-md`}>
        {style.icon}
        {style.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className={`w-12 h-12 rounded-full border-4 mb-4 ${
            isDark
              ? 'border-dark_border border-t-primary'
              : 'border-border border-t-primary'
          }`}
        />
        <p className={`font-medium text-gray`}>Loading live classes…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-12 rounded-2xl border ${
        isDark
          ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          : 'bg-rose-500/10 border-rose-500/20 text-rose-600'
      }`}>
        <div className="text-5xl mb-3">⚠️</div>
        <p className="font-semibold mb-4">Failed to load live classes</p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={refetch}
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-skyBlue transition"
        >
          <FiRefreshCw /> Retry
        </motion.button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-6 px-4 `}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ===== Page Header ===== */}
        <div className={`px-2`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className={`text-2xl sm:text-3xl md:text-3xl font-bold ${
                  isDark ? 'text-white' : 'text-midnight_text'
                }`}>
                  Live Classes
                </h1>
              </div>
              <p className={`text-sm flex items-center gap-2 text-gray`}>
                <FiVideo className="w-4 h-4" />
                Manage, schedule and monitor all Zoom sessions
              </p>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all shadow-md hover:shadow-lg ${
                isDark
                  ? 'btn-primary'
                  : 'btn-primary'
              }`}
              onClick={() => openModal(MODAL_TYPES.CREATE_MEETING)}>
              <FiPlus className="w-4 h-4" />
              Create Class
            </motion.button>
          </div>
        </div>

        {/* ===== Filters Card ===== */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl border shadow-property p-4 sm:p-6 ${
            isDark
              ? 'bg-semidark border-dark_border'
              : 'bg-white border-border'
          }`}>
          <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 text-midnight_text dark:text-white`}>
            <FiFilter className="w-4 h-4 text-primary" /> Filter Classes
          </h3>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">

            {/* Search */}
            <div className="relative group">
              <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 transition w-4 h-4 text-gray`} />
              <input
                className={`w-full rounded-xl border py-2.5 pl-10 pr-3 text-sm focus:ring-2 focus:outline-none transition ${
                  isDark
                    ? 'border-dark_border bg-darklight text-white placeholder-gray focus:border-primary focus:ring-primary/30'
                    : 'border-border bg-light text-midnight_text placeholder-gray focus:border-primary focus:ring-primary/20'
                }`}
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status */}
            <select
              className={`rounded-xl border py-2.5 px-3 text-sm focus:ring-2 focus:outline-none transition cursor-pointer ${
                isDark
                  ? 'border-dark_border bg-darklight text-white focus:border-primary focus:ring-primary/30'
                  : 'border-border bg-light text-midnight_text focus:border-primary focus:ring-primary/20'
              }`}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="scheduled">Upcoming</option>
              <option value="ongoing">Live Now</option>
              <option value="completed">Completed</option>
            </select>

            {/* Date */}
            <input
              type="date"
              className={`rounded-xl border py-2.5 px-3 text-sm focus:ring-2 focus:outline-none transition cursor-pointer ${
                isDark
                  ? 'border-dark_border bg-darklight text-white focus:border-primary focus:ring-primary/30'
                  : 'border-border bg-light text-midnight_text focus:border-primary focus:ring-primary/20'
              }`}
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />

            {/* Clear */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setDateFilter("");
              }}
              className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition ${
                isDark
                  ? 'border-dark_border bg-darklight text-gray hover:bg-darklight/80'
                  : 'border-border bg-light text-gray hover:bg-light/80'
              }`}
            >
              <FiFilter className="w-4 h-4" />
              Clear
            </motion.button>
          </div>
        </motion.div>

        {/* ===== View Toggle & Stats ===== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className={`rounded-xl px-4 py-3 border ${
            isDark
              ? 'bg-darklight border-dark_border'
              : 'bg-light border-border'
          }`}>
            <p className={`text-sm text-gray`}>
              <span className={`font-bold text-primary`}>{filteredMeetings.length}</span>
              <span> of </span>
              <span className={`font-bold text-primary`}>{meetings.length}</span>
              <span> live sessions</span>
            </p>
          </div>

          <div className={`inline-flex rounded-lg border p-1 ${
            isDark
              ? 'bg-darklight border-dark_border'
              : 'bg-light border-border'
          }`}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveTab("cards")}
              className={`flex items-center gap-2 rounded-md px-3 sm:px-4 py-1.5 text-sm font-medium transition ${
                activeTab === "cards"
                  ? 'btn-primary shadow'
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
              onClick={() => setActiveTab("table")}
              className={`flex items-center gap-2 rounded-md px-3 sm:px-4 py-1.5 text-sm font-medium transition ${
                activeTab === "table"
                  ? 'btn-primary shadow'
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

        {/* ===== Content ===== */}
        <AnimatePresence mode="wait">
          {filteredMeetings.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`text-center py-16 rounded-2xl border-2 border-dashed ${
                isDark
                  ? 'border-dark_border text-gray'
                  : 'border-border text-gray'
              }`}
            >
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-4"
              >
                <FiVideo className={`w-16 h-16 mx-auto text-gray`} />
              </motion.div>
              <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-midnight_text'}`}>No live classes found</h3>
              <p className={`mb-6 text-gray`}>
                {searchTerm || statusFilter !== "all" || dateFilter
                  ? "Try adjusting your filters"
                  : "Create your first live class to get started"}
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openModal(MODAL_TYPES.CREATE_MEETING)}
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-skyBlue transition shadow-md"
              >
                <FiPlus className="w-5 h-5" /> Create Class
              </motion.button>
            </motion.div>
          ) : activeTab === "cards" ? (
            <CardsView
              key="cards"
              isDark={isDark}
              filteredMeetings={filteredMeetings}
              handleStartClass={handleStartClass}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              deletingId={deletingId}
              formatDate={formatDate}
              formatTime={formatTime}
              StatusBadge={StatusBadge}
              handleCopy={handleCopy}
            />
          ) : (
            <TableView
              key="table"
              isDark={isDark}
              filteredMeetings={filteredMeetings}
              handleStartClass={handleStartClass}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              deletingId={deletingId}
              formatDate={formatDate}
              formatTime={formatTime}
              StatusBadge={StatusBadge}
              handleCopy={handleCopy}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ---------------- CARDS VIEW ---------------- */
const CardsView = ({
  isDark,
  filteredMeetings,
  handleStartClass,
  handleEdit,
  handleDelete,
  deletingId,
  formatDate,
  formatTime,
  StatusBadge,
  handleCopy
}) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
  >
    {filteredMeetings.map((m, idx) => (
      <motion.div
        key={m._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.05 }}
        whileHover={{ y: -4 }}
        className={`rounded-xl border shadow-property hover:shadow-deatail_shadow transition-all overflow-hidden flex flex-col ${
          isDark
            ? 'bg-semidark border-dark_border'
            : 'bg-white border-border'
        }`}
      >
        <div className={`h-1 bg-gradient-to-r from-primary to-skyBlue`} />

        <div className="p-5 flex flex-col h-full">
          <div className="flex justify-between items-start gap-2 mb-3">
            <h3 className={`font-bold text-lg line-clamp-2 flex-1 ${
              isDark ? 'text-white' : 'text-midnight_text'
            }`}>
              {m.title}
            </h3>
            <StatusBadge status={m.status} />
          </div>

          <div className="space-y-2 flex-1 mb-4">
            <div className={`flex items-center gap-2 text-sm rounded-lg p-2 ${
              isDark ? 'bg-darklight text-gray' : 'bg-light text-gray'
            }`}>
              <FiBookOpen className={`w-4 h-4 flex-shrink-0 text-primary`} />
              <span className="font-medium truncate">{m.course?.name || "—"}</span>
            </div>

            <div className={`flex items-center gap-2 text-sm rounded-lg p-2 ${
              isDark ? 'bg-darklight text-gray' : 'bg-light text-gray'
            }`}>
              <FiUsers className={`w-4 h-4 flex-shrink-0 text-purple-500`} />
              <span className="font-medium truncate">{m.batch?.batchName || "No batch"}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className={`flex items-center gap-1.5 text-xs rounded-lg p-2 ${
                isDark ? 'bg-darklight text-gray' : 'bg-light text-gray'
              }`}>
                <FiCalendar className={`w-3.5 h-3.5 flex-shrink-0 text-emerald-500`} />
                <span className="font-medium truncate">{formatDate(m.startTime)}</span>
              </div>
              <div className={`flex items-center gap-1.5 text-xs rounded-lg p-2 ${
                isDark ? 'bg-darklight text-gray' : 'bg-light text-gray'
              }`}>
                <FiClock className={`w-3.5 h-3.5 flex-shrink-0 text-orange-500`} />
                <span className="font-medium truncate">{formatTime(m.startTime)}</span>
              </div>
            </div>

            <div className={`text-xs rounded-lg p-2 font-medium ${
              isDark ? 'bg-darklight text-gray' : 'bg-light text-gray'
            }`}>
              <FiClock className="inline w-3 h-3 mr-1 text-primary" /> {m.duration} min
            </div>
          </div>

          <div className={`space-y-2 pt-3 border-t ${isDark ? 'border-dark_border' : 'border-border'}`}>
            {(m.status === "scheduled" || m.status === "ongoing") && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStartClass(m._id)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-skyBlue py-2.5 text-sm font-semibold text-white hover:from-skyBlue hover:to-primary transition shadow-md"
              >
                <FiPlay className="w-4 h-4" />
                <span>{m.status === "ongoing" ? "Join" : "Start"}</span>
              </motion.button>
            )}

            <div className="flex gap-2">
              {m.zoomJoinUrl && (
                <button
                  onClick={() => handleCopy(m.zoomJoinUrl)}
                  className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition flex items-center justify-center gap-1 ${
                    isDark
                      ? 'btn-white'
                      : 'btn-white'
                  }`}
                  title="Copy link"
                >
                  <FiCopy className="w-4 h-4" />
                  <span className="hidden sm:inline">Copy</span>
                </button>
              )}

              <button
                onClick={() => handleEdit(m)}
                className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition flex items-center justify-center gap-1 ${
                  isDark
                    ? 'btn-emerald'
                    : 'btn-emerald'
                }`}
                title="Edit"
              >
                <FiEdit className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
              </button>

              <button
                disabled={deletingId === m._id}
                onClick={() => handleDelete(m._id)}
                className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition flex items-center justify-center gap-1 disabled:opacity-50 ${
                  isDark
                    ? 'btn-remove'
                    : 'btn-remove'
                }`}
                title="Delete"
              >
                <FiTrash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    ))}
  </motion.div>
);

/* ---------------- TABLE VIEW ---------------- */
const TableView = ({
  isDark,
  filteredMeetings,
  handleStartClass,
  handleEdit,
  handleDelete,
  deletingId,
  formatDate,
  formatTime,
  StatusBadge,
  handleCopy
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className={`rounded-xl border shadow-property overflow-hidden ${
      isDark
        ? 'bg-semidark border-dark_border'
        : 'bg-white border-border'
    }`}
  >
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[600px] text-sm">
        <thead className={`border-b ${
          isDark ? 'border-dark_border bg-darklight' : 'border-border bg-light'
        }`}>
          <tr>
            <th className={`px-4 py-3 text-left font-semibold text-gray`}>Title</th>
            <th className={`px-4 py-3 text-left font-semibold hidden sm:table-cell text-gray`}>Course</th>
            <th className={`px-4 py-3 text-left font-semibold hidden md:table-cell text-gray`}>Batch</th>
            <th className={`px-4 py-3 text-left font-semibold text-gray`}>Schedule</th>
            <th className={`px-4 py-3 text-center font-semibold hidden sm:table-cell text-gray`}>Duration</th>
            <th className={`px-4 py-3 text-center font-semibold text-gray`}>Status</th>
            <th className={`px-4 py-3 text-center font-semibold text-gray`}>Actions</th>
          </tr>
        </thead>

        <tbody className={`divide-y ${isDark ? 'divide-dark_border' : 'divide-border'}`}>
          {filteredMeetings.map((m, idx) => (
            <motion.tr
              key={m._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02 }}
              className={`transition ${isDark ? 'hover:bg-darklight' : 'hover:bg-light'}`}
            >
              <td className={`px-4 py-3`}>
                <div className={`font-semibold truncate ${isDark ? 'text-white' : 'text-midnight_text'}`}>
                  {m.title}
                </div>
                <div className={`text-xs sm:hidden text-gray`}>
                  {m.course?.name || "—"}
                </div>
              </td>

              <td className={`px-4 py-3 hidden sm:table-cell text-gray`}>
                {m.course?.name || "—"}
              </td>

              <td className={`px-4 py-3 hidden md:table-cell text-gray`}>
                {m.batch?.batchName || "—"}
              </td>

              <td className={`px-4 py-3`}>
                <div className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-midnight_text'}`}>
                  {formatDate(m.startTime)}
                </div>
                <div className={`text-xs text-gray`}>
                  {formatTime(m.startTime)}
                </div>
              </td>

              <td className={`px-4 py-3 text-center hidden sm:table-cell text-gray`}>
                {m.duration}m
              </td>

              <td className="px-4 py-3 text-center">
                <StatusBadge status={m.status} />
              </td>

              <td className="px-4 py-3">
                <div className="flex flex-wrap items-center justify-center gap-1">
                  {(m.status === "scheduled" || m.status === "ongoing") && (
                    <button
                      onClick={() => handleStartClass(m._id)}
                      className="p-2 rounded-lg bg-primary text-white hover:bg-skyBlue transition"
                    >
                      <FiPlay className="w-4 h-4" />
                    </button>
                  )}

                  {m.zoomJoinUrl && (
                    <button
                      onClick={() => handleCopy(m.zoomJoinUrl)}
                      className={`p-2 rounded-lg border transition ${
                        isDark
                          ? 'border-primary/30 text-primary hover:bg-primary/20'
                          : 'border-primary/30 text-primary hover:bg-primary/10'
                      }`}
                    >
                      <FiCopy className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => handleEdit(m)}
                    className={`p-2 rounded-lg border transition ${
                      isDark
                        ? 'border-primary/30 text-primary hover:bg-primary/20'
                        : 'border-primary/30 text-primary hover:bg-primary/10'
                    }`}
                  >
                    <FiEdit className="w-4 h-4" />
                  </button>

                  <button
                    disabled={deletingId === m._id}
                    onClick={() => handleDelete(m._id)}
                    className={`p-2 rounded-lg border transition disabled:opacity-50 ${
                      isDark
                        ? 'border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                        : 'border-rose-500/30 text-rose-600 hover:bg-rose-500/10'
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
  </motion.div>
);

export default AdminLiveClasses;