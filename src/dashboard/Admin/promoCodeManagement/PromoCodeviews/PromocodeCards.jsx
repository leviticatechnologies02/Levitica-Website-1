import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiEdit2,
  FiTrash2,
  FiCopy,
  FiCheck,
  FiCalendar,
  FiClock,
  FiUsers,
  FiMail,
  FiPhone,
  FiTag,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";
import toast from "react-hot-toast";

const PromoCardView = ({ promos, onEdit, onDelete, onToggle }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Promo code "${code}" copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {promos.map((p) => {
        const isExpired = p.expiryDate && new Date(p.expiryDate) < new Date();
        const usageLimit = p.usageLimit || 0;
        const usedCount = p.usedCount || 0;
        const usagePercentage = usageLimit > 0 ? Math.min(100, Math.round((usedCount / usageLimit) * 100)) : 0;
        const isLimitReached = usageLimit > 0 && usedCount >= usageLimit;

        return (
          <motion.div
            key={p._id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className={`rounded-2xl border p-5 flex flex-col justify-between shadow-sm transition-all ${
              isDark
                ? "bg-slate-800/90 border-slate-700 text-white hover:border-blue-500/40"
                : "bg-white border-slate-200 text-slate-900 hover:border-blue-500/40"
            }`}
          >
            <div>
              {/* Header: Code & Active Status */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-dashed border-slate-200 dark:border-slate-700/80">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-base tracking-wider text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
                      {p.code}
                    </span>
                    <button
                      onClick={() => handleCopy(p.code)}
                      className={`p-1.5 rounded-lg border transition cursor-pointer ${
                        copiedCode === p.code
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : isDark
                          ? "border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700"
                          : "border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                      title="Copy promo code"
                    >
                      {copiedCode === p.code ? <FiCheck size={14} /> : <FiCopy size={14} />}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-1">
                    Min order: <span className="font-semibold text-slate-300">₹{p.minPurchase || 1000}</span>
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      p.isActive && !isExpired && !isLimitReached
                        ? isDark
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : isDark
                        ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        p.isActive && !isExpired && !isLimitReached
                          ? "bg-emerald-500"
                          : "bg-rose-500"
                      }`}
                    />
                    {!p.isActive
                      ? "Inactive"
                      : isExpired
                      ? "Expired"
                      : isLimitReached
                      ? "Limit Reached"
                      : "Active"}
                  </span>
                </div>
              </div>

              {/* Discount Banner */}
              <div className="my-4 p-3 rounded-xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-transparent border border-blue-500/15 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 dark:text-blue-400">
                    Discount Value
                  </span>
                  <p className="text-xl font-extrabold tracking-tight mt-0.5">
                    {p.discountType === "percentage" ? `${p.discountValue}% OFF` : `₹${Number(p.discountValue || 0).toLocaleString("en-IN")} FLAT OFF`}
                  </p>
                </div>
                {p.discountType === "percentage" && p.maxDiscount && (
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Capped At
                    </span>
                    <p className="text-xs font-bold text-amber-500 dark:text-amber-400 mt-0.5">
                      Max ₹{p.maxDiscount}
                    </p>
                  </div>
                )}
              </div>

              {/* Usage Progress & Expiry */}
              <div className="space-y-3 mb-4">
                {/* Usage meter */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <FiTag size={12} className="text-blue-500" /> Redemptions:
                    </span>
                    <span className="font-semibold text-xs">
                      {usedCount} {usageLimit > 0 ? `/ ${usageLimit}` : "(Unlimited)"}
                    </span>
                  </div>
                  {usageLimit > 0 && (
                    <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          usagePercentage >= 90
                            ? "bg-rose-500"
                            : usagePercentage >= 70
                            ? "bg-amber-500"
                            : "bg-blue-500"
                        }`}
                        style={{ width: `${usagePercentage}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Expiry date */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400 font-medium flex items-center gap-1.5">
                    <FiCalendar size={13} className={isExpired ? "text-rose-500" : "text-slate-400"} />
                    Expiry:
                  </span>
                  <span
                    className={`font-semibold ${
                      isExpired
                        ? "text-rose-500 font-bold flex items-center gap-1"
                        : isDark
                        ? "text-slate-300"
                        : "text-slate-700"
                    }`}
                  >
                    {p.expiryDate
                      ? new Date(p.expiryDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "No Expiry"}
                    {isExpired && "(Expired)"}
                  </span>
                </div>

                {/* Influencer Details */}
                <div
                  className={`p-3 rounded-xl border text-xs space-y-1.5 transition-colors ${
                    isDark
                      ? "bg-slate-900/40 border-slate-700/80"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-slate-300 dark:text-slate-200 truncate">
                    <FiUsers size={13} className="text-emerald-500 shrink-0" />
                    <span className="truncate">{p.influencerName || "General Campaign"}</span>
                  </div>
                  {p.influencerEmail && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 truncate">
                      <FiMail size={12} className="shrink-0" />
                      <span className="truncate">{p.influencerEmail}</span>
                    </div>
                  )}
                  {p.influencerPhone && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 truncate">
                      <FiPhone size={12} className="shrink-0" />
                      <span className="truncate">{p.influencerPhone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-200 dark:border-slate-700/80">
              {/* Toggle switch */}
              <button
                type="button"
                onClick={() => onToggle(p._id, p.code, !p.isActive)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                  p.isActive
                    ? isDark
                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                    : isDark
                    ? "bg-slate-700 text-slate-400 border-slate-600 hover:bg-slate-600"
                    : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                }`}
                title="Toggle Active Status"
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    p.isActive ? "bg-emerald-500" : "bg-slate-400"
                  }`}
                />
                {p.isActive ? "Active" : "Disabled"}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(p)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer text-blue-600 dark:text-blue-400 border-blue-500/30 hover:bg-blue-500/10"
                  title="Edit promo code"
                >
                  <FiEdit2 size={13} /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(p._id, p.code)}
                  className="p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition cursor-pointer"
                  title="Delete promo code"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default PromoCardView;
