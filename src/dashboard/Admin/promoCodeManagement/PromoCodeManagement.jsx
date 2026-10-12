import React, { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MODAL_TYPES, useModal } from "@/dashboard/Admin/Modals/ModalContext";
import {
  FiPlus,
  FiGrid,
  FiList,
  FiSearch,
  FiTag,
  FiCheckCircle,
  FiAlertCircle,
  FiXCircle,
} from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";
import {
  useGetPromosQuery,
  useDeletePromoMutation,
  useTogglePromoMutation,
} from "@/Services/admin/promocodeServices";
import PromoCardView from "./PromoCodeviews/PromocodeCards";
import PromoTableView from "./PromoCodeviews/PromocodeTable";
import toast from "react-hot-toast";

const PromoCodeManagement = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { data: promos = [], isLoading } = useGetPromosQuery();
  const [deletePromo] = useDeletePromoMutation();
  const [togglePromo] = useTogglePromoMutation();

  const { openModal } = useModal();
  const [view, setView] = useState("cards");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'active' | 'inactive' | 'expired'

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Are you sure you want to delete promo code "${code}"?`)) return;
    try {
      await deletePromo(id).unwrap();
      toast.success(`Promo code "${code}" deleted successfully`);
    } catch (err) {
      console.error("Delete promo failed:", err);
      toast.error(err?.data?.message || "Failed to delete promo code");
    }
  };

  const handleToggle = async (id, code, willBeActive) => {
    try {
      await togglePromo(id).unwrap();
      toast.success(
        `Promo code "${code}" ${willBeActive ? "activated" : "deactivated"} successfully`
      );
    } catch (err) {
      console.error("Toggle promo failed:", err);
      toast.error(err?.data?.message || "Failed to toggle promo code status");
    }
  };

  const filteredPromos = useMemo(() => {
    return promos.filter((p) => {
      const isExpired = p.expiryDate && new Date(p.expiryDate) < new Date();
      const usageLimit = p.usageLimit || 0;
      const usedCount = p.usedCount || 0;
      const isLimitReached = usageLimit > 0 && usedCount >= usageLimit;

      // Status Filter
      if (statusFilter === "active") {
        if (!p.isActive || isExpired || isLimitReached) return false;
      } else if (statusFilter === "inactive") {
        if (p.isActive) return false;
      } else if (statusFilter === "expired") {
        if (!isExpired) return false;
      }

      // Search Filter
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const codeMatch = p.code?.toLowerCase().includes(term);
        const nameMatch = p.influencerName?.toLowerCase().includes(term);
        const emailMatch = p.influencerEmail?.toLowerCase().includes(term);
        return codeMatch || nameMatch || emailMatch;
      }

      return true;
    });
  }, [promos, statusFilter, searchTerm]);

  // Quick Stats
  const activeCount = promos.filter((p) => p.isActive && (!p.expiryDate || new Date(p.expiryDate) >= new Date())).length;
  const expiredCount = promos.filter((p) => p.expiryDate && new Date(p.expiryDate) < new Date()).length;

  return (
    <div className={`space-y-6 p-4 md:p-6 transition-colors ${isDark ? "min-h-screen text-white" : "text-slate-900"}`}>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-2.5">
            <FiTag className="text-blue-500" />
            Promo Code Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Create, manage discounts, usage limits, and track influencer marketing campaigns.
          </p>
        </div>

        <button
          onClick={() => openModal(MODAL_TYPES.ADD_PROMO, { mode: "add" })}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer text-xs sm:text-sm"
        >
          <FiPlus size={16} />
          Create Promo Code
        </button>
      </div>

      {/* METRIC STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div
          className={`p-4 rounded-xl border transition ${
            isDark ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-200"
          }`}
        >
          <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
            Total Codes
          </span>
          <p className="text-xl sm:text-2xl font-bold mt-1">{promos.length}</p>
        </div>

        <div
          className={`p-4 rounded-xl border transition ${
            isDark ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-200"
          }`}
        >
          <span className="text-[11px] font-semibold text-emerald-500 block uppercase tracking-wider">
            Active
          </span>
          <p className="text-xl sm:text-2xl font-bold text-emerald-500 mt-1">{activeCount}</p>
        </div>

        <div
          className={`p-4 rounded-xl border transition ${
            isDark ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-200"
          }`}
        >
          <span className="text-[11px] font-semibold text-rose-500 block uppercase tracking-wider">
            Expired
          </span>
          <p className="text-xl sm:text-2xl font-bold text-rose-500 mt-1">{expiredCount}</p>
        </div>

        <div
          className={`p-4 rounded-xl border transition ${
            isDark ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-200"
          }`}
        >
          <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
            Total Redemptions
          </span>
          <p className="text-xl sm:text-2xl font-bold text-blue-500 mt-1">
            {promos.reduce((acc, curr) => acc + (curr.usedCount || 0), 0)}
          </p>
        </div>
      </div>

      {/* CONTROLS: SEARCH + FILTER + VIEW TOGGLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input
            type="text"
            placeholder="Search code or influencer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm border outline-none transition ${
              isDark
                ? "bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500"
                : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500"
            }`}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Status Tabs */}
          <div
            className={`flex rounded-xl p-1 border ${
              isDark ? "bg-slate-800/80 border-slate-700" : "bg-slate-100 border-slate-200"
            }`}
          >
            {[
              { id: "all", label: "All" },
              { id: "active", label: "Active" },
              { id: "inactive", label: "Disabled" },
              { id: "expired", label: "Expired" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  statusFilter === tab.id
                    ? isDark
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white text-slate-900 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div
            className={`flex rounded-xl p-1 border ${
              isDark ? "bg-slate-800/80 border-slate-700" : "bg-slate-100 border-slate-200"
            }`}
          >
            <button
              onClick={() => setView("cards")}
              className={`p-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                view === "cards"
                  ? isDark
                    ? "bg-slate-700 text-white shadow"
                    : "bg-white text-slate-900 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Card View"
            >
              <FiGrid size={15} />
            </button>
            <button
              onClick={() => setView("table")}
              className={`p-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                view === "table"
                  ? isDark
                    ? "bg-slate-700 text-white shadow"
                    : "bg-white text-slate-900 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Table View"
            >
              <FiList size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      {isLoading ? (
        <div className="py-20 text-center text-sm text-slate-400">
          <div className="w-8 h-8 border-2 border-t-blue-500 border-slate-500 rounded-full animate-spin mx-auto mb-3"></div>
          Loading promo codes...
        </div>
      ) : filteredPromos.length === 0 ? (
        <div
          className={`py-16 text-center rounded-2xl border ${
            isDark ? "bg-slate-800/40 border-slate-700 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"
          }`}
        >
          <FiTag size={36} className="mx-auto mb-3 opacity-30 text-blue-500" />
          <h3 className="font-bold text-base">No promo codes found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search query or status filter."
              : "Click 'Create Promo Code' above to set up your first promotional campaign."}
          </p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {view === "cards" ? (
            <PromoCardView
              promos={filteredPromos}
              onEdit={(promo) =>
                openModal(MODAL_TYPES.ADD_PROMO, { mode: "edit", promo })
              }
              onDelete={handleDelete}
              onToggle={handleToggle}
            />
          ) : (
            <PromoTableView
              promos={filteredPromos}
              onEdit={(promo) =>
                openModal(MODAL_TYPES.ADD_PROMO, { mode: "edit", promo })
              }
              onDelete={handleDelete}
              onToggle={handleToggle}
            />
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default PromoCodeManagement;
