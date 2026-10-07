import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiX, FiPlus, FiTrash2, FiSave, FiFileText, FiType, FiClock, FiVideo, FiPlayCircle, FiLock } from "react-icons/fi";
import { useTheme } from '@/context/ThemeContext';
import { useUpdateInternshipsDomainMutation } from '@/Services/admin/internshipsDomainService';
import toast from 'react-hot-toast';

const ManageInternshipContentModal = ({ handleClose, domain }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [liveClasses, setLiveClasses] = useState([]);

  const [updateDomain, { isLoading }] = useUpdateInternshipsDomainMutation();

  useEffect(() => {
    if (domain) {
      setLiveClasses(domain.liveClasses || []);
    }
  }, [domain]);

  const handleAddLiveClass = () => {
    setLiveClasses([...liveClasses, { title: "", date: "", duration: "60", zoomLink: "", passcode: "", recordingLink: "" }]);
  };

  const handleUpdateLiveClass = (index, field, value) => {
    const updated = [...liveClasses];
    updated[index] = { ...updated[index], [field]: value };
    setLiveClasses(updated);
  };

  const handleDeleteLiveClass = (index) => {
    setLiveClasses(liveClasses.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      const cleanLiveClasses = liveClasses.filter(c => c.title.trim() !== "").map(c => {
        const cls = { ...c };
        if (!cls.date) {
          delete cls.date; 
        }
        return cls;
      });

      await updateDomain({
        id: domain._id,
        updatedData: { modules: [], liveClasses: cleanLiveClasses }
      }).unwrap();
      toast.success("Content saved successfully!");
      handleClose();
    } catch (err) {
      console.error("Failed to save content", err);
      toast.error(err?.data?.message || "Failed to save content. Make sure all required fields are filled properly.");
    }
  };

  const inputClass = `w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 transition ${
    isDark
      ? 'border-dark_border bg-darklight text-white focus:border-primary focus:ring-primary/30'
      : 'border-border bg-light text-midnight_text focus:border-primary focus:ring-primary/20'
  }`;

  const labelClass = `text-sm font-semibold mb-2 flex items-center gap-2 ${
    isDark ? 'text-gray' : 'text-midnight_text'
  }`;

  return (
    <div className={`w-full max-h-[90vh] flex flex-col ${isDark ? 'text-white' : 'text-midnight_text'}`}>

      {/* HEADER */}
      <div className={`px-6 py-4 flex items-center justify-between border-b ${isDark ? 'border-dark_border' : 'border-border'}`}>
        <h2 className="text-xl font-bold">Manage Content: {domain?.name}</h2>
        <button onClick={handleClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <FiX className="w-5 h-5" />
        </button>
      </div>

      {/* BODY */}
      <div className={`flex-1 overflow-y-auto p-6 space-y-6 ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>

        <div className="space-y-4">
          {liveClasses.map((cls, index) => (
            <div key={index} className={`p-5 rounded-2xl border shadow-sm ${isDark ? 'bg-darkmode border-dark_border' : 'bg-white border-border'}`}>
              <div className="flex justify-between items-start mb-5">
                <h3 className="font-bold text-lg flex items-center gap-2 text-primary">
                  <FiFileText className="w-5 h-5" /> Live Session {index + 1}
                </h3>
                <button onClick={() => handleDeleteLiveClass(index)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-2 rounded-lg transition">
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                <div className="md:col-span-2">
                  <label className={labelClass}>
                    <FiType className="w-4 h-4 text-primary" /> Session Title
                  </label>
                  <input
                    type="text"
                    value={cls.title}
                    onChange={(e) => handleUpdateLiveClass(index, 'title', e.target.value)}
                    className={inputClass}
                    placeholder="e.g., Advanced JavaScript Basics"
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    <FiClock className="w-4 h-4 text-primary" /> Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={cls.date ? new Date(cls.date).toISOString().slice(0, 16) : ''}
                    onChange={(e) => handleUpdateLiveClass(index, 'date', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    <FiLock className="w-4 h-4 text-purple-500" /> Passcode
                  </label>
                  <input
                    type="text"
                    value={cls.passcode}
                    onChange={(e) => handleUpdateLiveClass(index, 'passcode', e.target.value)}
                    className={inputClass}
                    placeholder="Zoom Passcode"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>
                    <FiVideo className="w-4 h-4 text-blue-500" /> Zoom Meeting Link
                  </label>
                  <input
                    type="url"
                    value={cls.zoomLink}
                    onChange={(e) => handleUpdateLiveClass(index, 'zoomLink', e.target.value)}
                    className={inputClass}
                    placeholder="https://zoom.us/j/..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>
                    <FiPlayCircle className="w-4 h-4 text-green-500" /> Recording Link (Post-session)
                  </label>
                  <input
                    type="url"
                    value={cls.recordingLink}
                    onChange={(e) => handleUpdateLiveClass(index, 'recordingLink', e.target.value)}
                    className={inputClass}
                    placeholder="Link to watch recording..."
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={handleAddLiveClass}
            className={`w-full py-3 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 text-sm font-semibold transition-colors ${
               isDark ? 'border-gray-700 text-gray-400 hover:text-primary hover:border-primary' : 'border-gray-300 text-gray-500 hover:text-primary hover:border-primary'
            } bg-transparent`}
          >
            <FiPlus className="w-4 h-4" /> Add Live Session
          </button>
        </div>

      </div>

      {/* FOOTER */}
      <div className={`px-6 py-4 border-t flex justify-end gap-3 ${isDark ? 'border-dark_border bg-darkmode' : 'border-border bg-white'}`}>
        <button
          onClick={handleClose}
          className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
            isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-primary text-white shadow-lg hover:bg-primary/90 transition flex items-center gap-2 disabled:opacity-70"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : <FiSave className="w-4 h-4" />}
          {isLoading ? "Saving..." : "Save Content"}
        </button>
      </div>

    </div>
  );
};

export default ManageInternshipContentModal;
