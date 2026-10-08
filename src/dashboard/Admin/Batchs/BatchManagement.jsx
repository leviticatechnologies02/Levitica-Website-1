import React, { useState } from "react";
import {
  useGetBatchesQuery,
  useDeleteBatchMutation,
} from '@/Services/admin/batchdetailsService';
import { useModal, MODAL_TYPES } from '@/dashboard/Admin/Modals/ModalContext';
import { useTheme } from '@/context/ThemeContext';
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiUsers,
  FiGrid,
  FiList,
  FiBookOpen,
  FiCalendar,
} from "react-icons/fi";

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "inactive", label: "Inactive" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

/* ================= MAIN ================= */

const BatchManagement = () => {
  const { openModal } = useModal();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [view, setView] = useState("cards");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const limit = 10;

  const { data, isLoading, isError } = useGetBatchesQuery({
    page,
    limit,
    ...(status !== "all" ? { status } : {}),
  });
  const [deleteBatch] = useDeleteBatchMutation();

  const batches = data?.data || [];
  const pagination = data?.pagination;

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}" batch?`)) return;
    try {
      await deleteBatch(id).unwrap();
      // toast.success("Batch deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  if (isLoading) {
    return (
      <div className={`flex justify-center items-center h-64 ${
        isDark ? 'text-gray' : 'text-gray'
      }`}>
        Loading batches...
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`text-center p-6 rounded-xl ${
        isDark ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-500/10 text-rose-600'
      }`}>
        Failed to load batches
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-6 px-4 `}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ===== Page Header ===== */}
        <div className={`px-2`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className={`text-2xl sm:text-3xl md:text-3xl font-bold ${
                  isDark ? 'text-white' : 'text-midnight_text'
                }`}>
                  Batch Management
                </h1>
              </div>
              <p className={`text-sm flex items-center gap-2 text-gray`}>
                <FiGrid className="w-4 h-4" />
                {pagination?.total || batches.length} total batches
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openModal(MODAL_TYPES.CREATE_BATCH)}
              className={`flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all shadow-md hover:shadow-lg ${
                isDark
                  ? 'btn-primary'
                  : 'btn-primary'
              }`}
            >
              <FiPlus className="w-4 h-4" /> Create Batch
            </motion.button>
          </div>
        </div>

        {/* ===== Filters Card ===== */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-2`}>
          <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 text-midnight_text dark:text-white`}>
            <FiGrid className="w-4 h-4 text-primary" /> Filter Batches
          </h3>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {STATUS_TABS.map((tab) => (
              <motion.button
                key={tab.key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setStatus(tab.key);
                  setPage(1);
                }}
                className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  status === tab.key
                    ? 'btn-primary shadow-md'
                    : isDark
                      ? 'bg-darklight text-gray hover:text-white'
                      : 'bg-light text-gray hover:text-midnight_text'
                }`}
              >
                {tab.label}
              </motion.button>
            ))}
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
              <span className={`font-bold text-primary`}>{batches.length}</span>
              <span> batches total</span>
            </p>
          </div>

          <div className={`inline-flex rounded-lg border p-1 ${
            isDark
              ? 'bg-darklight border-dark_border'
              : 'bg-light border-border'
          }`}>
            {[
              { key: "cards", icon: FiGrid, label: "Cards" },
              { key: "table", icon: FiList, label: "Table" },
            ].map(({ key, icon: Icon, label }) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.02 }}
                onClick={() => setView(key)}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  view === key
                    ? 'btn-primary shadow'
                    : isDark
                      ? 'text-gray hover:text-white'
                      : 'text-gray hover:text-midnight_text'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <AnimatePresence mode="wait">
          {view === "cards" ? (
            <motion.div
              key="cards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <BatchCards
                batches={batches}
                isDark={isDark}
                onEdit={(batch) =>
                  openModal(MODAL_TYPES.CREATE_BATCH, {
                    mode: "edit",
                    batch,
                  })
                }
                onDelete={handleDelete}
                onViewStudents={(batchId) =>
                  openModal(MODAL_TYPES.VIEW_BATCH_STUDENTS, { batchId })
                }
              />
            </motion.div>
          ) : (
            <motion.div
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <BatchTable
                batches={batches}
                isDark={isDark}
                pagination={pagination}
                page={page}
                setPage={setPage}
                onEdit={(batch) =>
                  openModal(MODAL_TYPES.CREATE_BATCH, {
                    mode: "edit",
                    batch,
                  })
                }
                onViewStudents={(batchId) =>
                  openModal(MODAL_TYPES.VIEW_BATCH_STUDENTS, { batchId })
                }
                onDelete={handleDelete}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BatchManagement;

/* ================= CARDS ================= */

const BatchCards = ({ batches, isDark, onEdit, onDelete, onViewStudents }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
    {batches.map((batch, idx) => (
      <motion.div
        key={batch._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.05 }}
        whileHover={{ translateY: -4 }}
        className={`rounded-xl border shadow-property hover:shadow-deatail_shadow transition-all p-5 ${
          isDark
            ? 'bg-semidark border-dark_border'
            : 'bg-white border-border'
        }`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-start gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-lg truncate ${
              isDark ? 'text-white' : 'text-midnight_text'
            }`}>
              {batch.batchName}
            </h3>
            <div className={`flex items-center gap-1 text-xs mt-1 text-gray`}>
              <FiBookOpen size={12} className="text-primary" />
              {batch.courseId?.name || batch.internshipDomainId?.name || "Unknown target"}
            </div>
          </div>

          <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
            batch.status === "active"
              ? isDark
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-emerald-500/10 text-emerald-600'
              : isDark
                ? 'bg-rose-500/20 text-rose-400'
                : 'bg-rose-500/10 text-rose-600'
          }`}>
            {batch.status}
          </span>
        </div>

        {/* DATES */}
        <div className={`space-y-2 text-xs mb-4 text-gray`}>
          <div className="flex items-center gap-2">
            <FiCalendar size={12} className="text-primary" />
            <span>Start: {batch.startDate ? new Date(batch.startDate).toLocaleDateString() : "—"}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiCalendar size={12} className="text-primary" />
            <span>End: {batch.endDate ? new Date(batch.endDate).toLocaleDateString() : "—"}</span>
          </div>
        </div>

        {/* FOOTER */}
        <div className={`flex items-center justify-between pt-3`}>
          <div className="flex gap-2">
            <ActionBtn isDark={isDark} icon={FiUsers} color="emerald" onClick={() => onViewStudents(batch._id)} />
            <ActionBtn isDark={isDark} icon={FiEdit} color="primary" onClick={() => onEdit(batch)} />
            <ActionBtn isDark={isDark} icon={FiTrash2} color="danger" onClick={() => onDelete(batch._id, batch.batchName)} />
          </div>
          <span className={`text-xs text-gray`}>
            #{batch._id?.slice(-6)}
          </span>
        </div>
      </motion.div>
    ))}
  </div>
);

/* ================= TABLE (TANSTACK) ================= */

const BatchTable = ({
  batches,
  isDark,
  pagination,
  page,
  setPage,
  onEdit,
  onDelete,
  onViewStudents
}) => {
  const columns = [
    {
      accessorKey: "batchName",
      header: "Batch",
      cell: (info) => (
        <p className={`font-medium ${isDark ? 'text-white' : 'text-midnight_text'}`}>
          {info.getValue()}
        </p>
      ),
    },
    {
      id: "courseName",
      header: "Target",
      accessorFn: (row) => row.courseId?.name ?? row.internshipDomainId?.name ?? "Unknown",
      cell: (info) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
          isDark
            ? 'bg-primary/20 text-primary'
            : 'bg-primary/10 text-primary'
        }`}>
          {info.getValue()}
        </span>
      ),
    },
    {
      id: "dates",
      header: "Duration",
      cell: ({ row }) => {
        const { startDate, endDate } = row.original;
        return (
          <div className={`text-xs space-y-1 text-gray`}>
            <div className="flex items-center gap-1">
              <FiCalendar size={12} className="text-primary" />
              <span>{startDate ? new Date(startDate).toLocaleDateString() : "—"}</span>
            </div>
            <div className="flex items-center gap-1">
              <FiCalendar size={12} className="text-primary" />
              <span>{endDate ? new Date(endDate).toLocaleDateString() : "—"}</span>
            </div>
          </div>
        );
      },
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
            status === "active"
              ? isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-500/10 text-emerald-600'
              : status === "completed"
              ? isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-500/10 text-blue-600'
              : status === "cancelled"
              ? isDark ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-500/10 text-rose-600'
              : isDark ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-500/10 text-gray-600'
          }`}>
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "_id",
      header: "ID",
      cell: (info) => (
        <span className="text-xs text-gray">
          #{info.getValue()?.slice(-6)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const batch = row.original;
        return (
          <div className="flex gap-2">
            <ActionBtn isDark={isDark} icon={FiUsers} color="emerald" onClick={() => onViewStudents(batch._id)} />
            <ActionBtn isDark={isDark} icon={FiEdit} color="primary" onClick={() => onEdit(batch)} />
            <ActionBtn isDark={isDark} icon={FiTrash2} color="danger" onClick={() => onDelete(batch._id, batch.batchName)} />
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: batches,
    columns,
    pageCount: pagination?.totalPages ?? -1,
    manualPagination: true,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: pagination?.limit || 10,
      },
    },
    onPaginationChange: (updater) => {
      const next = typeof updater === "function"
        ? updater({ pageIndex: page - 1, pageSize: 10 })
        : updater;
      setPage(next.pageIndex + 1);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
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
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th key={header.id} className="p-4 text-left font-semibold text-gray">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className={`divide-y ${
            isDark ? 'divide-dark_border' : 'divide-border'
          }`}>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className={`transition-colors ${
                isDark ? 'hover:bg-darklight' : 'hover:bg-light'
              }`}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-4 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className={`flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 border-t ${
        isDark ? 'border-dark_border' : 'border-border'
      }`}>
        <span className={`text-sm text-gray`}>
          Page {page} of {pagination?.totalPages || 1}
        </span>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition border ${
              isDark
                ? 'border-dark_border text-gray hover:bg-darklight disabled:opacity-50'
                : 'border-border text-gray hover:bg-light disabled:opacity-50'
            }`}
          >
            Previous
          </button>
          <button
            disabled={page === pagination?.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition border ${
              isDark
                ? 'border-dark_border text-gray hover:bg-darklight disabled:opacity-50'
                : 'border-border text-gray hover:bg-light disabled:opacity-50'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

/* ================= SHARED ACTION BUTTON ================= */

const ActionBtn = ({ icon: Icon, onClick, color, isDark }) => {
  const getColorClasses = () => {
    if (color === "danger") {
      return isDark
        ? 'btn-delete-dark'
        : 'btn-delete';
    }
    if (color === "emerald") {
      return isDark
        ? 'btn-view-dark'
        : 'btn-view';
    }
    return isDark
      ? 'btn-edit-dark'
      : 'btn-edit';
  };

  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition-colors ${getColorClasses()}`}
    >
      <Icon size={16} />
    </button>
  );
};