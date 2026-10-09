import {
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/table-core";
import { useReactTable, flexRender } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import {
  FiUsers,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useTheme } from '@/context/ThemeContext';

const GenericTable = ({
  data = [],
  availableCourses = [],
  availableBatches = [],
  showAssignControls = false,
  showBatchColumn = false,
  isAssignedView = false,
  isAssigning,
  onAssignBatch,
  onCourseChange,
  onRemove,
  getRowId = (row, index) => row?.id || (row?.enrollment_id ? `${row.enrollment_id}-${row.courseId || index}` : String(index)),
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  /* ---------------- Filter ---------------- */
  const filteredData = useMemo(() => {
    if (!selectedCourse) return data;

    return data.filter(
      (s) => s.courseId === selectedCourse
    );
  }, [data, selectedCourse]);


  /* ---------------- Columns ---------------- */
  const columns = useMemo(() => {
    return [
      showAssignControls && {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            className="accent-blue-600"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="accent-blue-600"
          />
        ),
      },
      { accessorKey: "name", header: "Student Name" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "courseName", header: "Course / Domain" },
      showBatchColumn && {
        accessorKey: "batchName",
        header: "Batch",
        cell: ({ row }) => row.original.batchName || "—",
      },
    ].filter(Boolean);
  }, [showAssignControls, showBatchColumn]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: showAssignControls ? { rowSelection } : {},
    onRowSelectionChange: showAssignControls ? setRowSelection : undefined,
    enableRowSelection: showAssignControls,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId,
  });

  const selectedRows = table.getSelectedRowModel().flatRows.map(r => r.original);

  const handleBulkAssign = () => {
    const batchObj = availableBatches.find(b => b._id === selectedBatch);
    const payload = selectedRows.map(s => ({
      enrollment_id: s.enrollment_id,
      student_mail: s.email,
      courseTitle: s.courseName,
      courseId: s.courseId,
      batchId: selectedBatch,
      batchName: batchObj?.title,
    }));
    onAssignBatch?.(payload);
  };

  return (
    <div className={`rounded-xl shadow-md border overflow-hidden transition-colors ${
      isDark
        ? 'bg-slate-800 border-slate-700'
        : 'bg-white border-slate-200'
    }`}>
      {/* ---------------- Controls ---------------- */}
      {(availableCourses.length > 0 || showAssignControls) && (
        <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 border-b transition-colors ${
          isDark
            ? 'bg-slate-700 border-slate-600'
            : 'bg-gradient-to-r from-slate-50 to-blue-50/20 border-slate-200'
        }`}>
          <div className="flex gap-3 flex-wrap">
            {availableCourses.length > 0 && (
              <select
                className={`border rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 transition-all ${
                  isDark
                    ? 'bg-slate-600 border-slate-500 text-slate-100 focus:border-blue-400 focus:ring-blue-500/30'
                    : 'bg-white border-slate-300 text-slate-700 focus:border-blue-500 focus:ring-blue-100'
                }`}
                value={selectedCourse}
                onChange={(e) => {
                  const courseId = e.target.value;
                  setSelectedCourse(courseId);
                  setSelectedBatch(""); 
                  onCourseChange?.(courseId);
                }}
              >
                <option value="">All Courses</option>
                {availableCourses.map(({ _id, title }) => (
                  <option key={_id} value={_id}>
                    {title}
                  </option>
                ))}
              </select>
            )}

            {showAssignControls && (
              <select
                disabled={!availableBatches.length}
                className={`border rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 transition-all disabled:opacity-50 ${
                  isDark
                    ? 'bg-slate-600 border-slate-500 text-slate-100 focus:border-blue-400 focus:ring-blue-500/30 disabled:bg-slate-700'
                    : 'bg-white border-slate-300 text-slate-700 focus:border-blue-500 focus:ring-blue-100 disabled:bg-slate-50'
                }`}
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
              >
                <option value="">Select Batch</option>
                {availableBatches.map(({ _id, title }) => (
                  <option key={_id} value={_id}>{title}</option>
                ))}
              </select>
            )}
          </div>

          {showAssignControls && (
            <div className="flex gap-2">
              <button
                onClick={handleBulkAssign}
                disabled={!selectedBatch || selectedRows.length === 0 || isAssigning}
                className={`text-white px-5 py-2 rounded-lg flex items-center gap-2 font-semibold transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed btn btn-primary`}
              >
                {isAssigning ? (
                  <>
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Assigning...
                  </>
                ) : (
                  <>
                    <FiUsers /> Assign
                  </>
                )}
              </button>

              <button
                onClick={() => onRemove?.(selectedRows)}
                disabled={selectedRows.length === 0}
                className={`px-5 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors btn btn-red-outline`}
              >
                <FiTrash2 /> Remove
              </button>
            </div>
          )}
        </div>
      )}

      {/* ---------------- Table ---------------- */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id} className={`border-b transition-colors ${
                isDark
                  ? 'bg-slate-700 border-slate-600'
                  : 'bg-gradient-to-r from-slate-50 to-blue-50/20 border-slate-200'
              }`}>
                {hg.headers.map(header => (
                  <th key={header.id} className={`text-left px-6 py-4 font-semibold transition-colors ${
                    isDark
                      ? 'text-slate-300'
                      : 'text-slate-700'
                  }`}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className={`divide-y transition-colors ${
            isDark
              ? 'divide-slate-700'
              : 'divide-slate-200'
          }`}>
            {table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className={`transition-colors duration-200 ${
                  isDark
                    ? 'hover:bg-slate-700/50'
                    : 'hover:bg-blue-50/30'
                }`}
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className={`px-6 py-4 text-sm transition-colors ${
                    isDark
                      ? 'text-slate-300'
                      : 'text-slate-700'
                  }`}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------------- Pagination ---------------- */}
      <div className={`flex items-center justify-between p-6 border-t transition-colors ${
        isDark
          ? 'bg-slate-700 border-slate-600'
          : 'bg-gradient-to-r from-slate-50 to-blue-50/20 border-slate-200'
      }`}>
        <span className={`text-sm font-medium transition-colors ${
          isDark
            ? 'text-slate-400'
            : 'text-slate-600'
        }`}>
          Page <span className={isDark ? 'text-slate-200' : 'text-slate-900'}>{table.getState().pagination.pageIndex + 1}</span> of <span className={isDark ? 'text-slate-200' : 'text-slate-900'}>{table.getPageCount()}</span>
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className={`rounded-lg px-3 py-2 transition-colors border disabled:opacity-50 disabled:cursor-not-allowed font-medium ${
              isDark
                ? 'border-slate-600 text-slate-300 hover:bg-slate-600'
                : 'border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <FiChevronLeft size={18} />
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className={`rounded-lg px-3 py-2 transition-colors border disabled:opacity-50 disabled:cursor-not-allowed font-medium ${
              isDark
                ? 'border-slate-600 text-slate-300 hover:bg-slate-600'
                : 'border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <FiChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenericTable;
