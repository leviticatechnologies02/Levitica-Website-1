import { useEffect, useState } from "react";
import { FiUsers, FiBookOpen, FiAward, FiAlertTriangle, FiTrendingUp } from "react-icons/fi";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import Loader from '@/dashboard/common/Loader';
import GenericTable from "./GenericTable";
import { useTheme } from '@/context/ThemeContext';

import {
  useAssignStudentsToBatchMutation,
  useLazyGetUnassignedEnrollmentsQuery,
  useLazyGetUnassignedInternshipsQuery,
  useAssignStudentsToInternshipBatchMutation,
} from '@/Services/admin/assignService';

import { useCourses } from '@/hooks/useCourses';
import { useGetBatchesByCourseQuery, useGetBatchesByInternshipQuery } from '@/Services/admin/batchdetailsService';
import { useGetAllInternshipsDomainsQuery } from '@/Services/paymentServices/internshipsServices';

import {
  flattenEnrollments,
  flattenInternshipEnrollments,
  transformAssignmentPayload,
  transformInternshipAssignmentPayload
} from '@/utils/formatchange';

const UnassignedStudents = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [type, setType] = useState('course'); // 'course' | 'internship'

  const { courses = [], isLoading: isCoursesLoading } = useCourses();

  const { data: internshipDomainsResp, isLoading: isInternshipsLoading } = useGetAllInternshipsDomainsQuery({ all: true });
  const internships = internshipDomainsResp?.data || [];

  const [selectedCourseId, setSelectedCourseId] = useState("");

  const {
    data: courseBatches,
  } = useGetBatchesByCourseQuery(selectedCourseId, {
    skip: type !== 'course' || !selectedCourseId,
  });

  const {
    data: internshipBatches,
  } = useGetBatchesByInternshipQuery(selectedCourseId, {
    skip: type !== 'internship' || !selectedCourseId,
  });

  const [assignStudents, { isLoading: isAssigningCourse }] =
    useAssignStudentsToBatchMutation();
  const [assignInternships, { isLoading: isAssigningInternship }] =
    useAssignStudentsToInternshipBatchMutation();

  const isAssigning = type === 'course' ? isAssigningCourse : isAssigningInternship;

  const [
    fetchUnassignedCourses,
    {
      data: unassignedCourseData,
      isLoading: isUnassignedCourseLoading,
      isError: isCourseError,
      error: courseError,
      isSuccess: isCourseSuccess,
    },
  ] = useLazyGetUnassignedEnrollmentsQuery();

  const [
    fetchUnassignedInternships,
    {
      data: unassignedInternshipData,
      isLoading: isUnassignedInternshipLoading,
      isError: isInternshipError,
      error: internshipError,
      isSuccess: isInternshipSuccess,
    },
  ] = useLazyGetUnassignedInternshipsQuery();

  useEffect(() => {
    if (type === 'course') {
      fetchUnassignedCourses();
    } else {
      fetchUnassignedInternships();
    }
  }, [type, fetchUnassignedCourses, fetchUnassignedInternships]);

  const results = type === 'course'
    ? flattenEnrollments(unassignedCourseData?.enrollments || [])
    : flattenInternshipEnrollments(unassignedInternshipData?.internships || unassignedInternshipData?.enrollments || unassignedInternshipData?.data || []);

  const availableItems = type === 'course'
    ? courses.map((c) => ({ title: c.name, _id: c._id }))
    : internships.map((i) => ({ title: i.name, _id: i._id }));

  const currentBatches = type === 'course' ? courseBatches : internshipBatches;
  const availableBatches = selectedCourseId
    ? currentBatches?.data?.map((b) => ({
      title: b.batchName,
      _id: b._id,
    })) || []
    : [];

  const handleAssign = async (payload) => {
    try {
      if (type === 'course') {
        const formatted = transformAssignmentPayload(payload);
        await assignStudents(formatted).unwrap();
        fetchUnassignedCourses();
      } else {
        const formatted = transformInternshipAssignmentPayload(payload);
        await assignInternships(formatted).unwrap();
        fetchUnassignedInternships();
      }
      toast.success("Students assigned successfully");
    } catch (err) {
      toast.error("Failed to assign students");
    }
  };

  const isLoading = type === 'course' ? (isUnassignedCourseLoading || isCoursesLoading) : (isUnassignedInternshipLoading || isInternshipsLoading);
  const isError = type === 'course' ? isCourseError : isInternshipError;
  const error = type === 'course' ? courseError : internshipError;
  const isSuccess = type === 'course' ? isCourseSuccess : isInternshipSuccess;


  const renderContent = () => {
    if (isLoading) return <Loader message="Loading unassigned students..." />;

    if (isError) return (
      <div className={`rounded-xl p-10 text-center border ${isDark
          ? 'bg-rose-500/10 border-rose-500/20'
          : 'bg-rose-500/10 border-rose-500/20'
        }`}>
        <div className={`inline-block p-4 rounded-full mb-4 ${isDark
            ? 'bg-rose-500/20 text-rose-400'
            : 'bg-rose-500/20 text-rose-600'
          }`}>
          <FiAlertTriangle className="text-4xl" />
        </div>
        <h3 className={`mt-3 font-semibold text-lg ${isDark ? 'text-rose-400' : 'text-rose-600'
          }`}>
          Failed to load data
        </h3>
        <p className={`text-sm mt-2 text-gray`}>
          {error?.data?.message || "Something went wrong"}
        </p>
        <button
          onClick={fetchUnassigned}
          className={`mt-6 px-6 py-2.5 rounded-lg font-semibold transition bg-primary hover:bg-skyBlue text-white`}
        >
          Retry
        </button>
      </div>
    );

    if (isSuccess && results.length === 0) return (
      <div className={`rounded-xl p-12 text-center border ${isDark
          ? 'bg-emerald-500/10 border-emerald-500/20'
          : 'bg-emerald-500/10 border-emerald-500/20'
        }`}>
        <div className={`inline-block p-4 rounded-full mb-4 ${isDark
            ? 'bg-emerald-500/20 text-emerald-400'
            : 'bg-emerald-500/20 text-emerald-600'
          }`}>
          <FiUsers className="text-4xl" />
        </div>
        <h3 className={`mt-4 font-semibold text-lg ${isDark ? 'text-emerald-400' : 'text-emerald-600'
          }`}>
          All Students Assigned!
        </h3>
        <p className={`text-sm mt-2 text-gray`}>
          All enrolled students are already assigned to batches.
        </p>
      </div>
    );

    return (
      <>
        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className={`text-xl md:text-2xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-midnight_text'
              }`}>
              <FiUsers className="text-primary" />
              Unassigned Students
            </h2>
            <p className={`text-sm mt-1 ${isDark ? 'text-gray' : 'text-gray'}`}>
              Students pending batch assignment
            </p>
          </div>
        </div>

        {/* ================= ACTIONS ================= */}
        <div className={`rounded-xl p-4 sm:p-5 flex flex-col md:flex-row gap-4 border ${isDark ? 'bg-semidark border-dark_border' : 'bg-white border-border'
          }`}>
          {type === 'course' ? (
            <div className="flex-1">
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-midnight_text'}`}>
                Select Course to View Students
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className={`w-full max-w-md px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-primary/20 outline-none transition ${isDark
                    ? 'bg-darklight border-dark_border text-white'
                    : 'bg-light border-border text-midnight_text'
                  }`}
              >
                <option value="">-- All Unassigned Courses --</option>
                {availableItems.map(c => (
                  <option key={c._id} value={c._id}>{c.name || c.domainName || c.title}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex-1">
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-midnight_text'}`}>
                Select Internship to View Students
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className={`w-full max-w-md px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-primary/20 outline-none transition ${isDark
                    ? 'bg-darklight border-dark_border text-white'
                    : 'bg-light border-border text-midnight_text'
                  }`}
              >
                <option value="">-- All Unassigned Internships --</option>
                {availableItems.map(c => (
                  <option key={c._id} value={c._id}>{c.name || c.domainName || c.title}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex flex-col md:flex-row items-stretch md:items-end gap-3 min-w-[300px]">
            <div className="flex-1">
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-midnight_text'}`}>
                Assign Selected To Batch
              </label>
              <select
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-primary/20 outline-none transition ${isDark
                    ? 'bg-darklight border-dark_border text-white'
                    : 'bg-light border-border text-midnight_text'
                  }`}
                disabled={selectedRows.length === 0 || !selectedCourseId}
              >
                <option value="">Select Target Batch</option>
                {type === 'course'
                  ? batchesData?.batches?.map(b => (
                    <option key={b._id} value={b._id}>{b.batchName}</option>
                  ))
                  : internshipBatchesData?.batches?.map(b => (
                    <option key={b._id} value={b._id}>{b.batchName}</option>
                  ))
                }
              </select>
            </div>
            <button
              onClick={handleAssign}
              disabled={selectedRows.length === 0 || !selectedBatchId || isAssigning || isAssigningInterns}
              className={`px-6 py-2.5 rounded-lg font-semibold transition whitespace-nowrap ${selectedRows.length > 0 && selectedBatchId
                  ? 'bg-primary text-white hover:bg-skyBlue shadow-md hover:shadow-lg'
                  : isDark
                    ? 'bg-darklight text-gray cursor-not-allowed'
                    : 'bg-light text-gray cursor-not-allowed'
                }`}
            >
              {isAssigning || isAssigningInterns ? "Assigning..." : `Assign (${selectedRows.length})`}
            </button>
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-semidark border-dark_border' : 'bg-white border-border'
          }`}>
          <GenericTable
            data={filteredResults}
            columns={columns}
            loading={isLoading}
          />
        </div>
      </>
    );
  };


  return (
    <div className="space-y-6">
      {/* ================= TYPE TOGGLE ================= */}
      <div className="flex gap-2">
        <button
          onClick={() => { setType('course'); setSelectedCourseId(''); }}
          className={`px-4 py-2 rounded-lg font-semibold transition ${type === 'course'
              ? 'bg-primary text-white shadow-md'
              : isDark ? 'bg-darklight text-gray hover:text-white' : 'bg-light text-gray hover:text-midnight_text'
            }`}
        >
          Courses
        </button>
        <button
          onClick={() => { setType('internship'); setSelectedCourseId(''); }}
          className={`px-4 py-2 rounded-lg font-semibold transition ${type === 'internship'
              ? 'bg-primary text-white shadow-md'
              : isDark ? 'bg-darklight text-gray hover:text-white' : 'bg-light text-gray hover:text-midnight_text'
            }`}
        >
          Internships
        </button>
      </div>

      {/* ================= HEADER ================= */}
      <div>
        <h2 className={`text-2xl font-bold ${isDark
            ? 'text-blue-400'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'
          }`}>
          Unassigned Students
        </h2>
        <p className={`mt-2 flex items-center gap-2 text-gray`}>
          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-sm font-semibold ${isDark
              ? 'bg-orange-900/30 text-orange-400'
              : 'bg-orange-100 text-orange-700'
            }`}>
            {results.length}
          </span>
          students awaiting batch assignment
        </p>
      </div>

      {/* ================= TABLE SECTION ================= */}
      <div className={`border rounded-xl shadow-sm overflow-hidden ${isDark
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-slate-200'
        }`}>
        <div className={`p-4 border-b ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
          <h3 className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
            Student Assignment Panel
          </h3>
        </div>

        <div className="p-4">
          <GenericTable
            data={results}
            availableCourses={availableItems}
            availableBatches={availableBatches}
            showAssignControls
            isAssignedView={false}
            onAssignBatch={handleAssign}
            isAssigning={isAssigning}
            onCourseChange={setSelectedCourseId}
            onRemove={() => { }}
          />
        </div>
      </div>
    </div>
  );
};

export default UnassignedStudents;