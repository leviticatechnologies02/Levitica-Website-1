import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useTheme } from '@/context/ThemeContext';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  FiEdit2,
  FiTrash2,
  FiGrid,
  FiList,
  FiUsers,
  FiAward,
  FiPhone,
  FiMail,
  FiBookOpen,
  FiBriefcase,
} from "react-icons/fi";
import {
  useGetMentorsQuery,
  useDeleteMentorMutation,
} from '@/Services/admin/mentorServices';
import { useModal, MODAL_TYPES } from '@/dashboard/Admin/Modals/ModalContext';
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const columnHelper = createColumnHelper();

const MentorTable = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { data, isLoading } = useGetMentorsQuery();
  const [deleteMentor] = useDeleteMentorMutation();
  const { openModal } = useModal();

  const userRole = useSelector((state) => state.auth.user?.role);
  const [viewMode, setViewMode] = useState("table");

  const mentors = data?.data || [];
  const isSuperAdmin = userRole === "superadmin";

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete mentor "${name}"?`)) return;
    try {
      await deleteMentor(id).unwrap();
      toast.success(`Mentor "${name}" deleted successfully`);
    } catch (error) {
      console.error("Delete mentor failed:", error);
      toast.error(error?.data?.message || "Failed to delete mentor");
    }
  };

  const handleEditClick = (mentor) => {
    openModal(MODAL_TYPES.ADD_EDIT_MENTOR, { mode: "edit", mentor });
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Name",
        cell: ({ row }) => {
          const profileImageUrl = row.original.profileImage?.url;
          return (
            <div className="flex items-center gap-3">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt={row.original.name}
                  className="h-9 w-9 rounded-full object-cover shadow-sm flex-shrink-0 border border-slate-200"
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                style={{ display: profileImageUrl ? 'none' : 'flex' }}
                className={`h-9 w-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md flex-shrink-0`}
              >
                <FiUsers className="h-4 w-4 text-white" />
              </div>
              <span className={`font-bold text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                {row.original.name}
              </span>
            </div>
          );
        },
      }),
      columnHelper.accessor("email", {
        header: "Email",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <FiMail className={`h-3.5 w-3.5 flex-shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {row.original.email}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor("mobile", {
        header: "Phone",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <FiPhone className={`h-3.5 w-3.5 flex-shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {row.original.mobile || "—"}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor("expertise", {
        header: "Expertise",
        cell: ({ row }) => {
          const expList = Array.isArray(row.original.expertise) ? row.original.expertise : [];
          return (
            <div className="flex flex-wrap gap-1 max-w-[200px]">
              {expList.length > 0 ? (
                expList.map((exp, idx) => (
                  <span
                    key={idx}
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide capitalize ${isDark
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      }`}
                  >
                    {exp}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500">—</span>
              )}
            </div>
          );
        },
      }),
      columnHelper.accessor("courses", {
        header: "Assigned Courses & Internships",
        cell: ({ row }) => {
          const courseList = Array.isArray(row.original.courses) ? row.original.courses : [];
          const domainList = Array.isArray(row.original.internshipDomains) ? row.original.internshipDomains : [];

          if (courseList.length === 0 && domainList.length === 0) {
            return <span className="text-xs text-slate-500">—</span>;
          }

          return (
            <div className="flex flex-wrap gap-1 max-w-[240px]">
              {courseList.map((course, idx) => {
                const courseName = typeof course === 'object' ? course.name : course;
                return (
                  <span
                    key={`c-${idx}`}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide ${isDark
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                      }`}
                    title="Course"
                  >
                    <FiBookOpen className="h-2.5 w-2.5" />
                    {courseName}
                  </span>
                );
              })}
              {domainList.map((domain, idx) => {
                const domainName = typeof domain === 'object' ? domain.name : domain;
                return (
                  <span
                    key={`d-${idx}`}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide ${isDark
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    title="Internship Domain"
                  >
                    <FiBriefcase className="h-2.5 w-2.5" />
                    {domainName}
                  </span>
                );
              })}
            </div>
          );
        },
      }),
      columnHelper.accessor("isActive", {
        header: "Status",
        cell: ({ row }) => {
          const isActive = row.original.isActive !== false;
          return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${isActive
              ? isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
              : isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'
              }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
              {isActive ? 'Active' : 'Inactive'}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) =>
          isSuperAdmin && (
            <div className="flex gap-2 whitespace-nowrap">
              <button
                onClick={() => handleEditClick(row.original)}
                className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                title="Edit Mentor"
              >
                <FiEdit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(row.original._id, row.original.name)}
                className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                title="Delete Mentor"
              >
                <FiTrash2 className="h-4 w-4" />
              </button>
            </div>
          ),
      }),
    ],
    [isSuperAdmin, isDark]
  );

  const table = useReactTable({
    data: mentors,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className={`mt-6 rounded-xl border shadow-property p-12 text-center ${isDark
        ? 'bg-semidark border-dark_border'
        : 'bg-white border-border'
        }`}>
        <div className="inline-flex h-10 w-10 animate-spin mb-4 rounded-full border-4 border-emerald-500 border-t-transparent"></div>
        <p className={`font-medium text-sm text-gray`}>Loading mentor accounts...</p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-5">
      {/* Directory Header / Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg bg-emerald-500/10`}>
              <FiUsers className="h-4 w-4 text-emerald-600" />
            </div>
            <p className={`text-sm text-gray mt-1 `}>
              Total registered mentors: <span className="font-semibold text-emerald-500">{mentors.length}</span>
            </p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("table")}
            className={`p-2 rounded-lg border transition-colors ${viewMode === "table"
              ? isDark
                ? "bg-slate-700 border-slate-600 text-white"
                : "bg-slate-200 border-slate-300 text-slate-900"
              : isDark
                ? "border-slate-700 text-slate-400 hover:text-white"
                : "border-slate-200 text-slate-600 hover:text-slate-900"
              }`}
            title="Table View"
          >
            <FiList className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("cards")}
            className={`p-2 rounded-lg border transition-colors ${viewMode === "cards"
              ? isDark
                ? "bg-slate-700 border-slate-600 text-white"
                : "bg-slate-200 border-slate-300 text-slate-900"
              : isDark
                ? "border-slate-700 text-slate-400 hover:text-white"
                : "border-slate-200 text-slate-600 hover:text-slate-900"
              }`}
            title="Card View"
          >
            <FiGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Directory Body */}
      <div className={`rounded-xl border shadow-property overflow-hidden ${isDark
        ? 'border-dark_border bg-semidark'
        : 'border-border bg-white'
        }`}>
        {viewMode === "table" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    className={`border-b text-xs font-semibold uppercase tracking-wider ${isDark
                      ? 'border-dark_border bg-darklight text-slate-300'
                      : 'border-border bg-slate-50 text-slate-600'
                      }`}
                  >
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="py-3.5 px-4 font-bold">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className={`divide-y text-xs ${isDark ? 'divide-dark_border' : 'divide-border'
                }`}>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={`transition-colors hover:bg-slate-500/5`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-3 px-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Card View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
            {mentors.map((mentor, idx) => {
              const expList = Array.isArray(mentor.expertise) ? mentor.expertise : [];
              const courseList = Array.isArray(mentor.courses) ? mentor.courses : [];
              const domainList = Array.isArray(mentor.internshipDomains) ? mentor.internshipDomains : [];
              const isActive = mentor.isActive !== false;
              const profileImageUrl = mentor.profileImage?.url;

              return (
                <motion.div
                  key={mentor._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`rounded-xl border p-5 shadow-property hover:shadow-deatail_shadow transition flex flex-col justify-between ${isDark ? 'border-dark_border bg-darklight' : 'border-border bg-light'
                    }`}
                >
                  <div>
                    {/* Header: Picture & Basic info */}
                    <div className="flex items-start justify-between gap-2.5 mb-4 pb-4 border-b border-dashed border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-3 min-w-0">
                        {profileImageUrl ? (
                          <img
                            src={profileImageUrl}
                            alt={mentor.name}
                            className="h-11 w-11 rounded-full object-cover shadow-sm flex-shrink-0 border border-slate-200"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div
                          style={{ display: profileImageUrl ? 'none' : 'flex' }}
                          className="h-11 w-11 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md flex-shrink-0"
                        >
                          <FiUsers className="h-5 w-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className={`font-bold text-sm truncate ${isDark ? 'text-slate-100' : 'text-slate-900'
                            }`}>{mentor.name}</p>
                          <p className={`text-xs truncate flex items-center gap-1.5 text-gray mt-0.5`}>
                            <FiMail className="h-3 w-3 flex-shrink-0" />
                            {mentor.email}
                          </p>
                        </div>
                      </div>

                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive
                        ? isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
                        : isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'
                        }`}>
                        <span className={`h-1 w-1 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    {/* Stats & Fields */}
                    <div className="space-y-3 mb-4">
                      {/* Phone */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                          <FiPhone className="h-3.5 w-3.5 text-slate-400" />
                          Phone Number
                        </span>
                        <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          {mentor.mobile || "—"}
                        </span>
                      </div>

                      {/* Expertise tags */}
                      <div className="space-y-1.5">
                        <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                          <FiAward className="h-3.5 w-3.5 text-slate-400" />
                          Expertise
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {expList.length > 0 ? (
                            expList.map((exp, idx) => (
                              <span
                                key={idx}
                                className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide capitalize ${isDark
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                  }`}
                              >
                                {exp}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-500">—</span>
                          )}
                        </div>
                      </div>

                      {/* Assigned courses tags */}
                      <div className="space-y-1.5 pt-1">
                        <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                          <FiBookOpen className="h-3.5 w-3.5 text-indigo-400" />
                          Assigned Courses
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {courseList.length > 0 ? (
                            courseList.map((course, idx) => {
                              const courseName = typeof course === 'object' ? course.name : course;
                              return (
                                <span
                                  key={idx}
                                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide ${isDark
                                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                    : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                    }`}
                                >
                                  {courseName}
                                </span>
                              );
                            })
                          ) : (
                            <span className="text-xs text-slate-500">—</span>
                          )}
                        </div>
                      </div>

                      {/* Assigned Internships tags */}
                      <div className="space-y-1.5 pt-1">
                        <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                          <FiBriefcase className="h-3.5 w-3.5 text-amber-500" />
                          Assigned Internships
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {domainList.length > 0 ? (
                            domainList.map((domain, idx) => {
                              const domainName = typeof domain === 'object' ? domain.name : domain;
                              return (
                                <span
                                  key={idx}
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide ${isDark
                                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                                    }`}
                                >
                                  <FiBriefcase className="h-2.5 w-2.5" />
                                  {domainName}
                                </span>
                              );
                            })
                          ) : (
                            <span className="text-xs text-slate-500">—</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  {isSuperAdmin && (
                    <div className="flex gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                      <button
                        onClick={() => handleEditClick(mentor)}
                        className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 border rounded-lg text-xs font-bold btn-border transition-colors`}
                      >
                        <FiEdit2 className="h-3.5 w-3.5" /> Edit Profile
                      </button>
                      <button
                        onClick={() => handleDelete(mentor._id, mentor.name)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 border rounded-lg text-xs font-bold btn-border-delete transition-colors"
                      >
                        <FiTrash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {mentors.length === 0 && (
          <div className="p-12 text-center">
            <div className={`inline-flex h-14 w-14 rounded-full items-center justify-center mb-4 ${isDark ? 'bg-darklight' : 'bg-light'
              }`}>
              <FiUsers className={`h-7 w-7 text-gray`} />
            </div>
            <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-midnight_text'}`}>
              No mentors found
            </p>
            <p className={`text-xs text-slate-500 mt-1`}>
              Create your first mentor profile to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorTable;
