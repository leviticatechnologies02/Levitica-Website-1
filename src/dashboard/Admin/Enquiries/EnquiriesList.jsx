import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import toast from "react-hot-toast";
import {
  FiTrash2,
  FiEye,
  FiMail,
  FiPhone,
  FiX,
  FiInbox,
  FiCalendar,
  FiPackage,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetEnquiriesQuery,
  useDeleteEnquiryMutation,
} from "@/Services/admin/enquiryService";

const EnquiriesList = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { data, isLoading: loading } = useGetEnquiriesQuery();
  const [deleteEnquiryMutation] = useDeleteEnquiryMutation();

  const enquiries = data?.enquiries || [];
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const handleDeleteEnquiry = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete enquiry from "${name || "this user"}"?`)) return;
    try {
      await deleteEnquiryMutation(id).unwrap();
      toast.success("Enquiry deleted successfully");
    } catch (err) {
      console.error("Delete enquiry error:", err);
      toast.error(err?.data?.message || "Failed to delete enquiry");
    }
  };

  return (
    <div
      className={`p-6 min-h-screen transition-colors ${
        isDark ? "bg-darkmode text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2.5">
              <FiInbox className="text-primary" />
              Product Enquiries
            </h2>
            <p className="text-xs sm:text-sm text-gray mt-1">
              Prospective customer inquiries, enterprise quote requests, and product questions.
            </p>
          </div>

          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 w-fit">
            {enquiries.length} Total Enquir{enquiries.length === 1 ? "y" : "ies"}
          </span>
        </div>

        {/* Content Table */}
        {loading ? (
          <div className="p-16 text-center text-sm text-gray">
            <div className="w-8 h-8 border-2 border-t-primary border-gray/30 rounded-full animate-spin mx-auto mb-3"></div>
            Loading product enquiries...
          </div>
        ) : enquiries.length === 0 ? (
          <div
            className={`p-16 rounded-2xl border text-center space-y-3 ${
              isDark ? "bg-semidark border-dark_border" : "bg-white border-border"
            }`}
          >
            <FiInbox size={40} className="mx-auto text-primary opacity-40" />
            <h3 className="text-lg font-bold">No product enquiries yet</h3>
            <p className="text-xs text-gray max-w-sm mx-auto">
              Customer inquiries submitted via product forms and contact pages will appear here.
            </p>
          </div>
        ) : (
          <div
            className={`rounded-2xl border overflow-hidden shadow-sm transition-colors ${
              isDark ? "bg-semidark border-dark_border" : "bg-white border-border"
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr
                    className={`border-b text-[11px] font-bold uppercase tracking-wider ${
                      isDark
                        ? "border-dark_border bg-darklight/40 text-slate-300"
                        : "border-border bg-slate-50 text-slate-600"
                    }`}
                  >
                    <th className="py-3.5 px-6">Name</th>
                    <th className="py-3.5 px-6">Email & Mobile</th>
                    <th className="py-3.5 px-6">Product / Topic</th>
                    <th className="py-3.5 px-6">Received Date</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${
                    isDark ? "divide-dark_border text-slate-200" : "divide-border text-slate-700"
                  }`}
                >
                  {enquiries.map((enq) => (
                    <tr
                      key={enq._id}
                      className="transition-colors hover:bg-primary/5"
                    >
                      {/* Name */}
                      <td className="py-4 px-6 font-semibold">
                        {enq.name}
                      </td>

                      {/* Contact */}
                      <td className="py-4 px-6">
                        <a
                          href={`mailto:${enq.email}`}
                          className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                        >
                          <FiMail size={12} /> {enq.email}
                        </a>
                        {enq.mobile && (
                          <div className="text-[11px] text-gray mt-0.5 flex items-center gap-1">
                            <FiPhone size={11} /> {enq.mobile}
                          </div>
                        )}
                      </td>

                      {/* Product */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                          <FiPackage size={12} />
                          {enq.details?.productTitle || enq.details?.title || "Product Enquiry"}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6 text-gray whitespace-nowrap">
                        <span className="inline-flex items-center gap-1">
                          <FiCalendar size={12} />
                          {new Date(enq.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right whitespace-nowrap space-x-2">
                        <button
                          onClick={() => setSelectedEnquiry(enq)}
                          className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition cursor-pointer font-semibold inline-flex items-center gap-1"
                          title="View Details"
                        >
                          <FiEye size={13} /> View
                        </button>
                        <button
                          onClick={() => handleDeleteEnquiry(enq._id, enq.name)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition cursor-pointer inline-flex items-center"
                          title="Delete"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: Enquiry Details */}
        <AnimatePresence>
          {selectedEnquiry && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-white border-slate-200 text-slate-900"
                }`}
              >
                <div
                  className={`p-5 flex justify-between items-center border-b ${
                    isDark
                      ? "border-slate-700 bg-slate-900/40"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div>
                    <h3 className="text-lg font-bold">Enquiry Details</h3>
                    <p className="text-xs text-gray mt-0.5">Submitted via Levitica Web Form</p>
                  </div>
                  <button
                    onClick={() => setSelectedEnquiry(null)}
                    className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer"
                  >
                    <FiX size={18} />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray uppercase font-semibold">Sender Name</p>
                      <p className="font-bold text-sm mt-0.5">{selectedEnquiry.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray uppercase font-semibold">Date & Time</p>
                      <p className="font-medium text-xs mt-0.5">
                        {new Date(selectedEnquiry.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray uppercase font-semibold">Email Address</p>
                      <p className="font-medium text-xs text-primary mt-0.5">
                        <a href={`mailto:${selectedEnquiry.email}`} className="hover:underline">
                          {selectedEnquiry.email}
                        </a>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray uppercase font-semibold">Mobile Number</p>
                      <p className="font-medium text-xs mt-0.5">{selectedEnquiry.mobile || "—"}</p>
                    </div>
                  </div>

                  <div
                    className={`p-5 rounded-xl border ${
                      isDark ? "bg-slate-900/60 border-slate-700" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <h4 className="font-bold mb-3 text-xs uppercase tracking-wider text-gray">
                      Submission Details
                    </h4>

                    {selectedEnquiry.details && Object.keys(selectedEnquiry.details).length > 0 ? (
                      <div className="space-y-3">
                        {Object.entries(selectedEnquiry.details).map(([key, val]) => (
                          <div key={key} className="text-xs">
                            <p className="text-[11px] text-gray capitalize font-semibold">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </p>
                            <p className="font-medium mt-0.5">
                              {Array.isArray(val) ? val.join(", ") : val || "—"}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs">
                        <p className="text-[11px] text-gray font-semibold mb-1">Message:</p>
                        <p className="whitespace-pre-wrap leading-relaxed text-slate-300">
                          {selectedEnquiry.message || "No custom message provided."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div
                  className={`p-4 flex justify-end border-t ${
                    isDark
                      ? "border-slate-700 bg-slate-900/40"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <button
                    onClick={() => setSelectedEnquiry(null)}
                    className="px-5 py-2 btn-primary rounded-xl text-xs font-semibold cursor-pointer"
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
