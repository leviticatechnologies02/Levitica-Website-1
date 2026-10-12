import React, { useState } from "react";
import { useTheme } from '@/context/ThemeContext';
import { useGetAllInternshipPaymentsQuery } from '@/dashboard/services/adminPaymentApi';

const StatusBadge = ({ status, isDark }) => {
  const map = {
    paid: isDark ? "bg-emerald-950 text-emerald-300" : "bg-green-100 text-green-700",
    failed: isDark ? "bg-rose-950 text-rose-300" : "bg-red-100 text-red-700",
    created: isDark ? "bg-amber-950 text-amber-300" : "bg-yellow-100 text-yellow-700",
    attempted: isDark ? "bg-blue-950 text-blue-300" : "bg-blue-100 text-blue-700",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${map[status]}`}>
      {status.toUpperCase()}
    </span>
  );
};

const InternshipPayments = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } =
    useGetAllInternshipPaymentsQuery({
      page,
      limit: 10,
      search,
    });

  if (isLoading) {
    return <p className={`p-6 ${isDark ? 'text-slate-300' : ''}`}>Loading payments...</p>;
  }

  if (isError) {
    return <p className={`p-6 ${isDark ? 'text-rose-400' : 'text-red-600'}`}>Failed to load data</p>;
  }

  return (
    <div className={`p-6 ${isDark ? 'bg-slate-900 min-h-screen' : ''}`}>
      <div className={`flex justify-between items-center mb-4 ${isDark ? 'bg-slate-800 rounded-xl p-4' : ''}`}>
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : ''}`}>Internship Payments</h2>

        <input
          type="text"
          placeholder="Search student / email / roll"
          className={`border rounded-lg px-4 py-2 text-sm ${isDark ? 'border-slate-600 bg-slate-700 text-white placeholder-slate-500' : 'border-gray-300'}`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={`overflow-x-auto rounded-lg sm:rounded-xl border ${isDark ? 'border-slate-700 bg-slate-800' : 'border-gray-200'}`}>
        <table className={`w-full ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <thead className={`border-b text-sm ${isDark ? 'bg-slate-700 text-slate-300 border-slate-600' : 'bg-gray-100 text-gray-900'}`}>
            <tr>
              <th className="p-3 text-left">Student</th>
              <th className="p-3">Internship</th>
              <th className="p-3">College</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Paid On</th>
            </tr>
          </thead>

          <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-gray-200'}`}>
            {data.data.map((p) => (
              <tr key={p._id} className={`${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-50'} transition`}>
                <td className="p-3">
                  <p className={`font-medium ${isDark ? 'text-white' : ''}`}>{p.name}</p>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{p.email}</p>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : ''}`}>Roll: {p.rollNumber}</p>
                </td>

                <td className={`p-3 ${isDark ? 'text-slate-300' : ''}`}>
                  <p className={`font-medium ${isDark ? 'text-white' : ''}`}>{p.domain}</p>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : ''}`}>{p.department}</p>
                </td>

                <td className={`p-3 ${isDark ? 'text-slate-300' : ''}`}>
                  <p className="text-sm">{p.collegeName}</p>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{p.collegeCode}</p>
                </td>

                <td className={`p-3 font-semibold ${isDark ? 'text-white' : ''}`}>
                  ₹{Number(p.amount || 0).toLocaleString('en-IN')}
                </td>

                <td className="p-3">
                  <StatusBadge status={p.status} isDark={isDark} />
                </td>

                <td className={`p-3 text-sm ${isDark ? 'text-slate-300' : ''}`}>
                  {p.status === "paid"
                    ? new Date(p.updatedAt).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className={`px-4 py-2 border rounded transition ${isDark ? 'border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-50' : 'border-gray-300 hover:bg-gray-50 disabled:opacity-50'}`}
        >
          Prev
        </button>
        <button
          disabled={page >= data.pagination.totalPages}
          onClick={() => setPage((p) => p + 1)}
          className={`px-4 py-2 border rounded transition ${isDark ? 'border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-50' : 'border-gray-300 hover:bg-gray-50 disabled:opacity-50'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default InternshipPayments;
