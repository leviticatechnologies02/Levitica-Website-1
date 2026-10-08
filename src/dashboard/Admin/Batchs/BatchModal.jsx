import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { useBatchHandlers } from "./batchshooks";
import { useTheme } from '@/context/ThemeContext';
import {
  FiX,
  FiCheckCircle,
} from "react-icons/fi";
import { useGetCoursesQuery } from '@/Services/sharedServices/courses.Services';
import { useGetAllInternshipsDomainsQuery } from '@/Services/paymentServices/internshipsServices';
import toast from "react-hot-toast";

const BatchModal = ({ handleClose, mode = "add", batch = {} }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isEdit = mode === "edit";

  const {
    handleAddBatchSubmit,
    handleUpdateBatchSubmit,
    addStatus,
    updateStatus,
  } = useBatchHandlers();

  const { data: courses } = useGetCoursesQuery();
  const { data: internshipsResp } = useGetAllInternshipsDomainsQuery({all: true});
  const internships = internshipsResp?.data || [];

  /* ================= INITIAL VALUES ================= */
  const initialValues = isEdit
    ? {
      type: batch.internshipDomainId ? "internship" : "course",
      batchId: batch._id,
      batchName: batch.batchName || "",
      courseId: batch.courseId?._id || "",
      internshipDomainId: batch.internshipDomainId?._id || "",
      startDate: batch.startDate?.slice(0, 10) || "",
      endDate: batch.endDate?.slice(0, 10) || "",
      status: batch.status || "active",
      completedAt: batch.completedAt?.slice(0, 10) || "",
    }
    : {
      type: "course",
      batchName: "",
      courseId: "",
      internshipDomainId: "",
      startDate: "",
      endDate: "",
      status: "active",
      completedAt: "",
    };

  /* ================= VALIDATION ================= */
  const validationSchema = Yup.object({
    type: Yup.string().required(),
    batchName: Yup.string().required("Batch name is required"),
    courseId: Yup.string().when('type', {
      is: 'course',
      then: (schema) => schema.required("Course is required"),
      otherwise: (schema) => schema.nullable(),
    }),
    internshipDomainId: Yup.string().when('type', {
      is: 'internship',
      then: (schema) => schema.required("Internship is required"),
      otherwise: (schema) => schema.nullable(),
    }),
    startDate: Yup.date().required("Start date is required"),
    endDate: Yup.date()
      .min(Yup.ref("startDate"), "End date must be after start date")
      .required("End date is required"),
    status: Yup.string()
      .oneOf(["active", "completed", "cancelled", "inactive"])
      .required("Status is required"),
    completedAt: Yup.date().when("status", {
      is: "completed",
      then: (schema) =>
        schema.required("Completion date is required"),
      otherwise: (schema) => schema.nullable(),
    }),
  });

  /* ================= SUBMIT ================= */
  const onSubmit = async (values, { resetForm }) => {
    try {
      const payload = { ...values };
      if (payload.type === 'course') {
        payload.internshipDomainId = null;
      } else {
        payload.courseId = null;
      }
      delete payload.type;

      if (isEdit) {
        payload.batchId = batch._id;
        await handleUpdateBatchSubmit(payload);
      } else {
        await handleAddBatchSubmit(payload);
        resetForm();
      }
      handleClose();
    } catch (error) {
      toast.error(error?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} batch`);
    }
  };

  const isLoading = isEdit
    ? updateStatus.isLoading
    : addStatus.isLoading;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="modal-backdrop"
        className="fixed inset-0 z-999 flex items-center justify-center bg-midnight_text/60 backdrop-blur-sm p-3 sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          key="modal-content"
          initial={{ scale: 0.96, y: 24, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.96, y: 24, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`w-full max-w-sm sm:max-w-md lg:max-w-lg rounded-lg shadow-property transition-all duration-150 ${
            isDark
              ? 'bg-semidark border border-dark_border'
              : 'bg-white border border-border'
          }`}
        >
          {/* ================= HEADER ================= */}
          <div className={`flex items-start justify-between border-b p-4 sm:p-6 transition-colors duration-150 ${
            isDark
              ? 'border-dark_border'
              : 'border-border'
          }`}>
            <div className="flex-1 min-w-0">
              <h2 className={`text-base sm:text-lg font-semibold transition-colors duration-150 ${
                isDark
                  ? 'text-light'
                  : 'text-midnight_text'
              }`}>
                {isEdit ? "Edit Batch" : "Create New Batch"}
              </h2>
              <p className={`mt-1 text-xs sm:text-sm transition-colors duration-150 ${
                isDark
                  ? 'text-gray'
                  : 'text-gray'
              }`}>
                Manage batch details and lifecycle
              </p>
            </div>
            <button 
              onClick={handleClose} 
              className={`flex-shrink-0 p-2 rounded-lg transition-all duration-150 ml-2 ${
                isDark
                  ? 'hover:bg-darklight text-gray hover:text-light'
                  : 'hover:bg-light text-gray hover:text-midnight_text'
              }`}
            >
              <FiX className="text-lg" />
            </button>
          </div>

          {/* ================= FORM ================= */}
          <div className={`p-3 sm:p-4 transition-colors duration-150 ${isDark ? 'bg-semidark' : 'bg-white'}`}>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ values, setFieldValue }) => (
                <Form className="space-y-3 sm:space-y-3.5">
                  {/* Type Toggle */}
                  <div className="flex gap-4">
                    <label className={`flex items-center gap-2 text-sm ${isDark ? 'text-light' : 'text-midnight_text'}`}>
                      <Field type="radio" name="type" value="course" />
                      Course
                    </label>
                    <label className={`flex items-center gap-2 text-sm ${isDark ? 'text-light' : 'text-midnight_text'}`}>
                      <Field type="radio" name="type" value="internship" />
                      Internship
                    </label>
                  </div>

                  {/* Batch Name */}
                  <div>
                    <label className={`block text-xs font-medium mb-1 transition-colors duration-150 ${
                      isDark
                        ? 'text-light'
                        : 'text-midnight_text'
                    }`}>
                      Batch Name
                    </label>
                    <Field 
                      name="batchName" 
                      className={`w-full px-3 py-1.5 rounded-lg border text-sm transition-all duration-150 focus:outline-none focus:ring-2 ${
                        isDark
                          ? 'bg-semidark border-dark_border text-light placeholder-darkgray focus:border-primary focus:ring-primary/30'
                          : 'bg-white border-border text-midnight_text placeholder-gray focus:border-primary focus:ring-primary/20'
                      }`}
                    />
                    <ErrorMessage name="batchName" component="p" className={`mt-1 text-xs transition-colors duration-150 ${isDark ? 'text-rose-500' : 'text-rose-600'}`} />
                  </div>

                  {/* Target (Course or Internship) */}
                  {values.type === 'course' ? (
                    <div>
                      <label className={`block text-xs font-medium mb-1 transition-colors duration-150 ${
                        isDark
                          ? 'text-light'
                          : 'text-midnight_text'
                      }`}>
                        Course
                      </label>
                      <div className="relative">
                        <Field 
                          as="select" 
                          name="courseId" 
                          className={`w-full px-3 py-1.5 rounded-lg border text-sm transition-all duration-150 focus:outline-none focus:ring-2 ${
                            isDark
                              ? 'bg-semidark border-dark_border text-light focus:border-primary focus:ring-primary/30'
                              : 'bg-white border-border text-midnight_text focus:border-primary focus:ring-primary/20'
                          }`}
                        >
                          <option value="">Select course</option>
                          {courses?.map((c) => (
                            <option key={c._id} value={c._id}>
                              {c.name}
                            </option>
                          ))}
                        </Field>
                      </div>
                      <ErrorMessage name="courseId" component="p" className={`mt-1 text-xs transition-colors duration-150 ${isDark ? 'text-rose-500' : 'text-rose-600'}`} />
                    </div>
                  ) : (
                    <div>
                      <label className={`block text-xs font-medium mb-1 transition-colors duration-150 ${
                        isDark
                          ? 'text-light'
                          : 'text-midnight_text'
                      }`}>
                        Internship
                      </label>
                      <div className="relative">
                        <Field 
                          as="select" 
                          name="internshipDomainId" 
                          className={`w-full px-3 py-1.5 rounded-lg border text-sm transition-all duration-150 focus:outline-none focus:ring-2 ${
                            isDark
                              ? 'bg-semidark border-dark_border text-light focus:border-primary focus:ring-primary/30'
                              : 'bg-white border-border text-midnight_text focus:border-primary focus:ring-primary/20'
                          }`}
                        >
                          <option value="">Select internship</option>
                          {internships.map((i) => (
                            <option key={i._id} value={i._id}>
                              {i.name}
                            </option>
                          ))}
                        </Field>
                      </div>
                      <ErrorMessage name="internshipDomainId" component="p" className={`mt-1 text-xs transition-colors duration-150 ${isDark ? 'text-rose-500' : 'text-rose-600'}`} />
                    </div>
                  )}

                  {/* Dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className={`block text-xs font-medium mb-1 transition-colors duration-150 ${
                        isDark
                          ? 'text-light'
                          : 'text-midnight_text'
                      }`}>
                        Start Date
                      </label>
                      <Field 
                        type="date" 
                        name="startDate" 
                        className={`w-full px-3 py-1.5 rounded-lg border text-sm transition-all duration-150 focus:outline-none focus:ring-2 ${
                          isDark
                            ? 'bg-semidark border-dark_border text-light focus:border-primary focus:ring-primary/30'
                            : 'bg-white border-border text-midnight_text focus:border-primary focus:ring-primary/20'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-medium mb-1 transition-colors duration-150 ${
                        isDark
                          ? 'text-light'
                          : 'text-midnight_text'
                      }`}>
                        End Date
                      </label>
                      <Field 
                        type="date" 
                        name="endDate" 
                        className={`w-full px-3 py-1.5 rounded-lg border text-sm transition-all duration-150 focus:outline-none focus:ring-2 ${
                          isDark
                            ? 'bg-semidark border-dark_border text-light focus:border-primary focus:ring-primary/30'
                            : 'bg-white border-border text-midnight_text focus:border-primary focus:ring-primary/20'
                        }`}
                      />
                    </div>
                  </div>

                  {/* STATUS DROPDOWN */}
                  <div>
                    <label className={`block text-xs font-medium mb-1 transition-colors duration-150 ${
                      isDark
                        ? 'text-light'
                        : 'text-midnight_text'
                    }`}>
                      Batch Status
                    </label>
                    <Field
                      as="select"
                      name="status"
                      className={`w-full px-3 py-1.5 rounded-lg border text-sm transition-all duration-150 focus:outline-none focus:ring-2 ${
                        isDark
                          ? 'bg-semidark border-dark_border text-light focus:border-primary focus:ring-primary/30'
                          : 'bg-white border-border text-midnight_text focus:border-primary focus:ring-primary/20'
                      }`}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFieldValue("status", value);

                        if (value === "completed") {
                          setFieldValue(
                            "completedAt",
                            new Date().toISOString().slice(0, 10)
                          );
                        } else {
                          setFieldValue("completedAt", "");
                        }
                      }}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </Field>
                    <ErrorMessage name="status" component="p" className={`mt-1 text-xs transition-colors duration-150 ${isDark ? 'text-rose-500' : 'text-rose-600'}`} />
                  </div>

                  {/* COMPLETED AT (Conditional) */}
                  {values.status === "completed" && (
                    <div>
                      <label className={`block text-xs font-medium mb-1 transition-colors duration-150 ${
                        isDark
                          ? 'text-light'
                          : 'text-midnight_text'
                      }`}>
                        Completed At
                      </label>
                      <Field
                        type="date"
                        name="completedAt"
                        className={`w-full px-3 py-1.5 rounded-lg border text-sm transition-all duration-150 focus:outline-none focus:ring-2 ${
                          isDark
                            ? 'bg-semidark border-dark_border text-light focus:border-primary focus:ring-primary/30'
                            : 'bg-white border-border text-midnight_text focus:border-primary focus:ring-primary/20'
                        }`}
                      />
                      <ErrorMessage
                        name="completedAt"
                        component="p"
                        className={`mt-1 text-xs transition-colors duration-150 ${isDark ? 'text-rose-500' : 'text-rose-600'}`}
                      />
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-2 rounded-lg font-medium text-sm transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm hover:shadow-md ${
                      isDark
                        ? 'btn-primary'
                        : 'btn-primary'
                    }`}
                  >
                    {isLoading ? "Saving..." : isEdit ? "Update Batch" : "Create Batch"}
                  </button>

                  {/* Tip */}
                  <div className={`flex gap-2 border p-2 rounded-lg transition-all duration-150 ${
                    isDark
                      ? 'bg-primary/10 border-primary/30 text-cyan'
                      : 'bg-primary/5 border-primary/20 text-primary'
                  }`}>
                    <FiCheckCircle className={`flex-shrink-0 mt-0.5 text-lg ${isDark ? 'text-cyan' : 'text-primary'}`} />
                    <p className="text-xs">
                      Completed batches won't allow new student assignments.
                    </p>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BatchModal;