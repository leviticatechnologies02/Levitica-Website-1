import { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiAlertCircle, FiCheckCircle, FiTrendingUp, FiBook } from "react-icons/fi";
import {
  useDeleteInternshipsDomainMutation,
} from '@/Services/admin/internshipsDomainService';
import { useModal, MODAL_TYPES } from '@/dashboard/Admin/Modals/ModalContext';
import { useGetAllInternshipsDomainsQuery } from '@/Services/paymentServices/internshipsServices';
import { useTheme } from '@/context/ThemeContext';
import { motion } from "framer-motion";

const InternshipsDomainManagement = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { openModal } = useModal();

  const [filter, setFilter] = useState("active");

  const {
    data: domainsResponse = { data: [] },
    isLoading,
    isError,
  } = useGetAllInternshipsDomainsQuery(
    filter === "all" ? { all: true } : {}
  );

  const domains = domainsResponse.data;

  const [deleteDomain, { isLoading: isDeleting }] =
    useDeleteInternshipsDomainMutation();

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this domain?")) return;
    try {
      await deleteDomain(id).unwrap();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-darkmode' : 'bg-section'}`}>
        <div className="text-center space-y-3">
          <div className={`mx-auto h-12 w-12 rounded-full border-4 ${
            isDark ? 'border-dark_border border-t-primary' : 'border-border border-t-primary'
          } animate-spin`}></div>
          <p className={`text-sm font-medium text-gray`}>Loading internship domains...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`min-h-screen p-4 ${isDark ? 'bg-darkmode' : 'bg-section'}`}>
        <div className={`max-w-md mx-auto flex items-center gap-4 rounded-xl border p-4 ${
          isDark ? 'bg-rose-500/10 border-rose-500/20' : 'bg-rose-500/10 border-rose-500/20'
        }`}>
          <FiAlertCircle className={`h-8 w-8 flex-shrink-0 text-rose-500`} />
          <div>
            <p className={`font-medium text-rose-500`}>Failed to load</p>
            <p className={`text-sm text-gray`}>Unable to fetch internship domains</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-6 px-4`}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ===== HEADER SECTION ===== */}
        <div className={`px-2`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className={`text-2xl sm:text-3xl font-bold ${
                  isDark ? 'text-white' : 'text-midnight_text'
                }`}>
                  Internship Domains
                </h1>
              </div>
              <p className={`text-sm text-gray`}>
                Create and manage domain-based internship programs
              </p>
            </div>

            <button
              onClick={() => openModal(MODAL_TYPES.ADD_INTERNSHIP_DOMAIN)}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all shadow-md hover:shadow-lg ${
                isDark
                  ? 'btn-primary'
                  : 'btn-primary'
              }`}
            >
              <FiPlus className="h-4 w-4" /> Add New Domain
            </button>
          </div>
        </div>

        {/* ===== FILTER SECTION ===== */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFilter("active")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
              filter === "active"
                ? 'btn-primary shadow-md'
                : isDark
                  ? 'bg-darklight text-gray hover:text-white'
                  : 'bg-light text-gray hover:text-midnight_text'
            }`}
          >
            Active Domains
          </button>

          <button
            onClick={() => setFilter("all")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
              filter === "all"
                ? 'btn-primary shadow-md'
                : isDark
                  ? 'bg-darklight text-gray hover:text-white'
                  : 'bg-light text-gray hover:text-midnight_text'
            }`}
          >
            All Domains
          </button>
        </div>

        {/* ===== STATS CARD ===== */}
        <div className={`rounded-xl p-4 border ${
          isDark
            ? 'bg-darklight border-dark_border'
            : 'bg-light border-border'
        }`}>
          <p className={`text-sm text-gray`}>
            Showing <span className={`font-bold text-primary`}>{domains.length}</span> internship domains
          </p>
        </div>

        {/* ===== TABLE SECTION ===== */}
        <div className={`rounded-xl border shadow-property overflow-hidden ${
          isDark
            ? 'bg-semidark border-dark_border'
            : 'bg-white border-border'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className={`border-b ${
                isDark ? 'border-dark_border bg-darklight' : 'border-border bg-light'
              }`}>
                <tr>
                  <th className={`px-4 py-3 text-left font-semibold text-gray`}>Domain</th>
                  <th className={`px-4 py-3 text-left font-semibold text-gray`}>Level</th>
                  <th className={`px-4 py-3 text-left font-semibold text-gray`}>Durations</th>
                  <th className={`px-4 py-3 text-right font-semibold text-gray`}>Actions</th>
                </tr>
              </thead>

              <tbody className={`divide-y ${isDark ? 'divide-dark_border' : 'divide-border'}`}>
                {domains.map((domain, idx) => (
                  <motion.tr
                    key={domain._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className={`transition-colors ${isDark ? 'hover:bg-darklight' : 'hover:bg-light'}`}
                  >
                    {/* DOMAIN */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${
                          isDark ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'
                        }`}>
                          <span className="text-base font-bold">
                            {domain.name.charAt(0).toUpperCase()}
                          </span>
                        </div>

                        <div className="flex flex-col min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className={`font-semibold text-sm truncate ${isDark ? 'text-white' : 'text-midnight_text'}`}>
                              {domain.name}
                            </p>

                            {domain.isActive ? (
                              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                                isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-500/10 text-emerald-600'
                              }`}>
                                <FiCheckCircle className="h-3 w-3" />
                                Active
                              </span>
                            ) : (
                              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                isDark ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-500/10 text-rose-600'
                              }`}>
                                Inactive
                              </span>
                            )}
                          </div>

                          <p className={`text-xs mt-0.5 truncate text-gray`}>
                            Focus: {domain.focus}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* LEVEL */}
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-medium ${
                        isDark ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'
                      }`}>
                        {domain.level}
                      </span>
                    </td>

                    {/* DURATIONS */}
                    <td className="px-4 py-3">
                      <div className="space-y-1.5">
                        {domain.durations.slice(0, 2).map((d, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center gap-2 rounded-lg px-2 py-1 ${
                              isDark ? 'bg-darklight' : 'bg-light'
                            }`}
                          >
                            <span className={`text-xs font-medium text-gray`}>
                              {d.days}d
                            </span>
                            <span className={`h-1 w-1 rounded-full bg-gray`}></span>
                            <span className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-midnight_text'}`}>
                              ₹{d.fee.toLocaleString()}
                            </span>
                          </div>
                        ))}
                        {domain.durations.length > 2 && (
                          <div className={`text-xs text-gray px-2`}>
                            +{domain.durations.length - 2} more
                          </div>
                        )}
                      </div>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        
                        <button
                          onClick={() =>
                            openModal(
                              MODAL_TYPES.MANAGE_INTERNSHIP_CONTENT,
                              { domain }
                            )
                          }
                          className={`p-1.5 rounded-lg transition-colors ${
                            isDark
                              ? 'text-primary bg-primary/10 hover:bg-primary/20'
                              : 'text-primary bg-primary/5 hover:bg-primary/10'
                          }`}
                          title="Manage Content"
                        >
                          <FiBook className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() =>
                            openModal(
                              MODAL_TYPES.EDIT_INTERNSHIP_DOMAIN,
                              { domain }
                            )
                          }
                          className={`p-1.5 rounded-lg transition-colors ${
                            isDark
                              ? 'btn-edit-dark'
                              : 'btn-edit'
                          }`}
                          title="Edit domain"
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </button>

                        <button
                          disabled={isDeleting}
                          onClick={() => handleDelete(domain._id)}
                          className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                            isDark
                              ? 'btn-delete-dark'
                              : 'btn-delete'
                          }`}
                          title="Delete domain"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}

                {domains.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className={`rounded-full p-3 ${isDark ? 'bg-darklight' : 'bg-light'}`}>
                          <FiAlertCircle className={`h-6 w-6 text-gray`} />
                        </div>
                        <div className="text-center">
                          <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-midnight_text'}`}>No domains found</p>
                          <p className={`text-xs text-gray mt-1`}>
                            Create your first internship domain to get started
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipsDomainManagement;