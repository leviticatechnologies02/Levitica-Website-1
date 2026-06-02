import { useState, useMemo } from "react";
import { FiCreditCard, FiTrendingUp, FiLoader, FiBook, FiBriefcase, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useTheme } from '@/context/ThemeContext';
import {
  useGetTransactionQuery,
  useGetInternshipTransactionQuery,
} from '@/Services/paymentServices/transactionServices';

import PaymentStatsCards from "./PaymentStats";
import PaymentChart from "./PaymentStatsCharts";
import PaymentsTable from "./TransactionTable";

import {
  normalizeCoursePayments,
  normalizeInternshipPayments,
} from '@/utils/normalizePaymentData.js';
import { motion } from "framer-motion";

const PaymentOverview = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState("course");
  const [page, setPage] = useState(1);

  const {
    data: courseData,
    isLoading: courseLoading,
  } = useGetTransactionQuery(
    { page, limit: 20 },
    { skip: activeTab !== "course" }
  );

  const {
    data: internshipData,
    isLoading: internshipLoading,
  } = useGetInternshipTransactionQuery(
    { page, limit: 20 },
    { skip: activeTab !== "internship" }
  );

  const isLoading =
    activeTab === "course" ? courseLoading : internshipLoading;

  const normalizedData = useMemo(() => {
    if (activeTab === "course") {
      return normalizeCoursePayments(
        courseData?.transactions || []
      );
    }
    return normalizeInternshipPayments(
      internshipData?.data || []
    );
  }, [activeTab, courseData, internshipData]);

  const stats = useMemo(() => {
    const total =
      activeTab === "course"
        ? courseData?.totalTransactions || 0
        : internshipData?.pagination?.total || 0;

    const paidRevenue = normalizedData
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const paidCount = normalizedData.filter(
      (p) => p.status === "paid"
    ).length;

    return {
      total,
      totalRevenue: paidRevenue,
      paidCount,
    };
  }, [activeTab, normalizedData, courseData, internshipData]);

  const totalPages =
    activeTab === "course"
      ? courseData?.totalPages
      : internshipData?.pagination?.totalPages;

  return (
    <div className={`min-h-screen py-6 px-4`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ================= Header Section ================= */}
        <div className={`px-2`}>
          <div className="flex items-center gap-3">
            <div>
              <h1 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-midnight_text'
                }`}>
                Payment Overview
              </h1>

              <p className={`text-sm flex item-center gap-2 text-gray mt-0.5`}>
                <FiCreditCard className="h-4 w-4" />
                Manage course & internship payments, analyze revenue data
              </p>
            </div>
          </div>
        </div>

        {/* ================= Global Analytics ================= */}
        <PaymentChart />

        {/* ================= Tab Buttons ================= */}
        <div className="flex flex-wrap gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setActiveTab("course");
              setPage(1);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg ${activeTab === "course"
              ? "btn-primary"
              : isDark
                ? "bg-darklight text-gray hover:text-white"
                : "bg-light text-gray hover:text-midnight_text"
              }`}
          >
            <FiBook className="h-4 w-4" />
            Course Payments
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setActiveTab("internship");
              setPage(1);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg ${activeTab === "internship"
              ? "btn-primary"
              : isDark
                ? "bg-darklight text-gray hover:text-white"
                : "bg-light text-gray hover:text-midnight_text"
              }`}
          >
            <FiBriefcase className="h-4 w-4" />
            Internship Payments
          </motion.button>

          {/* Tab Indicator */}
          <div className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${isDark
            ? 'bg-darklight text-gray'
            : 'bg-light text-gray'
            }`}>
            <FiTrendingUp className="h-4 w-4 text-primary" />
            <span>{normalizedData.length} transactions</span>
          </div>
        </div>

        {/* ================= Stats Cards (Per Tab) ================= */}
        <PaymentStatsCards stats={stats} />

        {/* ================= Table ================= */}
        <div>
          {isLoading ? (
            <div className={`rounded-xl border shadow-property p-12 text-center ${isDark
              ? 'bg-semidark border-dark_border'
              : 'bg-white border-border'
              }`}>
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <div className="text-center">
                  <p className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-midnight_text'}`}>Loading Payments</p>
                  <p className={`text-sm mt-1 text-gray`}>Please wait while we fetch your data...</p>
                </div>
              </div>
            </div>
          ) : (
            <PaymentsTable data={normalizedData} />
          )}
        </div>

        {/* ================= Pagination ================= */}
        {totalPages && totalPages > 1 && (
          <div className={`flex items-center justify-between gap-6 py-2 px-3 rounded-xl border w-fit mx-auto shadow-sm ${isDark
            ? 'bg-semidark border-dark_border'
            : 'bg-white border-border'
            }`}>
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className={`flex items-center gap-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed btn-border`}
            >
              <FiChevronLeft className="h-3.5 w-3.5" />
              <span>Prev</span>
            </button>

            <span className={`text-xs font-medium text-slate-500 dark:text-slate-400 select-none min-w-[75px] text-center`}>
              Page <strong className="text-midnight_text dark:text-white">{page}</strong> of <strong className="text-midnight_text dark:text-white">{totalPages}</strong>
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className={`flex items-center gap-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed btn-border`}
            >
              <span>Next</span>
              <FiChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentOverview;