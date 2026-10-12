import React, { useState } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiCopy,
  FiCheck,
  FiCalendar,
  FiTag,
  FiUsers,
} from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";
import toast from "react-hot-toast";

const PromoTableView = ({ promos, onEdit, onDelete, onToggle }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Promo code "${code}" copied!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div
      className={`rounded-2xl border overflow-hidden shadow-sm transition-colors ${
        isDark ? "bg-slate-800/90 border-slate-700" : "bg-white border-slate-200"
      }`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr
              className={`border-b text-[11px] font-bold uppercase tracking-wider ${
                isDark
                  ? "border-slate-700 bg-slate-900/60 text-slate-300"
                  : "border-slate-200 bg-slate-50 text-slate-600"
              }`}
            >
              <th className="py-3.5 px-4">Code</th>
              <th className="py-3.5 px-4">Discount</th>
              <th className="py-3.5 px-4">Min Order</th>
              <th className="py-3.5 px-4">Redemptions</th>
              <th className="py-3.5 px-4">Expiry Date</th>
              <th className="py-3.5 px-4">Influencer</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody
            className={`divide-y ${
              isDark ? "divide-slate-700/80 text-slate-200" : "divide-slate-200 text-slate-700"
            }`}
          >
            {promos.map((p) => {
              const isExpired = p.expiryDate && new Date(p.expiryDate) < new Date();
              const usageLimit = p.usageLimit || 0;
              const usedCount = p.usedCount || 0;
              const isLimitReached = usageLimit > 0 && usedCount >= usageLimit;

              return (
                <tr
                  key={p._id}
                  className={`transition-colors hover:bg-slate-500/5 ${
                    !p.isActive ? "opacity-60" : ""
                  }`}
                >
                  {/* Code */}
                  <td className="py-3.5 px-4 font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                        {p.code}
                      </span>
                      <button
                        onClick={() => handleCopy(p.code)}
                        className="text-slate-400 hover:text-blue-500 p-1 rounded transition"
                        title="Copy code"
                      >
                        {copiedCode === p.code ? (
                          <FiCheck size={13} className="text-emerald-500" />
                        ) : (
                          <FiCopy size={13} />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Discount */}
                  <td className="py-3.5 px-4 font-bold">
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {p.discountType === "percentage"
                        ? `${p.discountValue}%`
                        : `₹${Number(p.discountValue || 0).toLocaleString("en-IN")}`}
                    </span>
                    {p.discountType === "percentage" && p.maxDiscount && (
                      <span className="text-[10px] text-slate-400 block font-normal">
                        Max ₹{p.maxDiscount}
                      </span>
                    )}
                  </td>

                  {/* Min Purchase */}
                  <td className="py-3.5 px-4 font-medium">
                    ₹{p.minPurchase || 1000}
                  </td>

                  {/* Usage */}
                  <td className="py-3.5 px-4">
                    <span className="font-semibold">
                      {usedCount}
                    </span>{" "}
                    <span className="text-slate-400 text-[11px]">
                      / {usageLimit > 0 ? usageLimit : "∞"}
                    </span>
                  </td>

                  {/* Expiry */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={isExpired ? "text-rose-500 font-semibold" : ""}>
                      {p.expiryDate
                        ? new Date(p.expiryDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </span>
                  </td>

                  {/* Influencer */}
                  <td className="py-3.5 px-4 max-w-[160px] truncate">
                    <p className="font-semibold truncate">{p.influencerName || "—"}</p>
                    {p.influencerEmail && (
                      <p className="text-[10px] text-slate-400 truncate">{p.influencerEmail}</p>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
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
                        ? "Disabled"
                        : isExpired
                        ? "Expired"
                        : isLimitReached
                        ? "Limit Reached"
                        : "Active"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onToggle(p._id, p.code, !p.isActive)}
                        className={`px-2 py-1 rounded text-[11px] font-semibold transition border ${
                          p.isActive
                            ? isDark
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : isDark
                            ? "bg-slate-700 text-slate-400 border-slate-600 hover:bg-slate-600"
                            : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                        }`}
                        title="Toggle status"
                      >
                        {p.isActive ? "Deactivate" : "Activate"}
                      </button>

                      <button
                        onClick={() => onEdit(p)}
                        className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-500/10 transition cursor-pointer"
                        title="Edit Promo"
                      >
                        <FiEdit2 size={13} />
                      </button>

                      <button
                        onClick={() => onDelete(p._id, p.code)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                        title="Delete Promo"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PromoTableView;
