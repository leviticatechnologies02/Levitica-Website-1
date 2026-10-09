import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "@/context/ThemeContext";
import toast from "react-hot-toast";
import { FiTrash2, FiEye, FiMail, FiPhone, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const EnquiriesList = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { token } = useSelector((state) => state.auth);

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const env = import.meta.env.VITE_ENV;
  const baseURL = env === "production" ? import.meta.env.VITE_PROD_API_URL : import.meta.env.VITE_LOCAL_API_URL;

  const fetchEnquiries = async () => {
    try {
      const res = await fetch(`${baseURL}/admin/enquiries`, {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) setEnquiries(data.enquiries);
    } catch (err) {
      toast.error("Failed to load enquiries");
    } finally {
      setLoading(false);
    }
  };

  const deleteEnquiry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      const res = await fetch(`${baseURL}/admin/enquiries/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Enquiry deleted");
        fetchEnquiries();
      } else {
        toast.error(data.message || "Failed to delete");
      }
    } catch (err) {
      toast.error("Error deleting enquiry");
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  return (
    <div className={`p-6 min-h-screen ${isDark ? "bg-darkmode text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Product Enquiries</h2>

        {loading ? (
          <p>Loading...</p>
        ) : enquiries.length === 0 ? (
          <p>No enquiries found.</p>
        ) : (
          <div className={`rounded-xl shadow overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className={isDark ? "bg-slate-700" : "bg-slate-100"}>
                  <tr className={`${isDark ? "border-slate-700 bg-slate-800/50" : "border-gray-100 bg-gray-50"}`}>
                    <th className="py-4 px-6 font-semibold">Name</th>
                    <th className="py-4 px-6 font-semibold">Email & Mobile</th>
                    <th className="py-4 px-6 font-semibold">Product</th>
                    <th className="py-4 px-6 font-semibold">Date</th>
                    <th className="py-4 px-6 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map((enq) => (
                    <tr key={enq._id} className={`hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${isDark ? "border-slate-700" : "border-gray-100"}`}>
                      <td className="py-4 px-6 font-medium">{enq.name}</td>
                      <td className="py-4 px-6 text-sm">
                        <a href={`mailto:${enq.email}`} className="text-primary hover:underline">{enq.email}</a>
                        {enq.mobile && <div className="text-xs text-gray-500 mt-1">{enq.mobile}</div>}
                      </td>
                      <td className="py-4 px-6 text-sm">{enq.details?.productTitle || "—"}</td>
                      <td className="py-4 px-6 text-sm text-gray-500">{new Date(enq.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-6 text-right space-x-3">
                        <button
                          onClick={() => setSelectedEnquiry(enq)}
                          className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors inline-block"
                          title="View Details"
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          onClick={() => deleteEnquiry(enq._id)}
                          className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors inline-block"
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <AnimatePresence>
          {selectedEnquiry && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`relative w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] ${isDark ? "bg-slate-800 text-white" : "bg-white text-gray-900"
                  }`}
              >
                <div className={`p-6 flex justify-between items-center ${isDark ? "border-slate-700 bg-slate-800" : "border-gray-100 bg-slate-100"}`}>
                  <h3 className="text-xl font-bold">Enquiry Details</h3>
                  <button
                    onClick={() => setSelectedEnquiry(null)}
                    className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                      <p className="font-semibold">{selectedEnquiry.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                      <p className="font-semibold">{new Date(selectedEnquiry.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p className="font-semibold text-primary"><a href={`mailto:${selectedEnquiry.email}`}>{selectedEnquiry.email}</a></p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Mobile</p>
                      <p className="font-semibold">{selectedEnquiry.mobile || "—"}</p>
                    </div>
                  </div>

                  <div className={`p-5 rounded-xl ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
                    <h4 className="font-semibold mb-4 text-lg pb-2 border-gray-100 dark:border-slate-700">Form Submission</h4>

                    {selectedEnquiry.details && Object.keys(selectedEnquiry.details).length > 0 ? (
                      <div className="space-y-4">
                        {Object.entries(selectedEnquiry.details).map(([key, val]) => (
                          <div key={key}>
                            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                            <p className="font-medium">{Array.isArray(val) ? val.join(", ") : val || "—"}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Message</p>
                        <p className="whitespace-pre-wrap mt-1">{selectedEnquiry.message}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className={`p-4 flex justify-end ${isDark ? "border-slate-700 bg-slate-800" : "border-gray-100 bg-slate-100"}`}>
                  <button
                    onClick={() => setSelectedEnquiry(null)}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EnquiriesList;
