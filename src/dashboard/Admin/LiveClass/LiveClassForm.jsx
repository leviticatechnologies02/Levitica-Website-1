import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useCourses } from '@/hooks/useCourses';
import { useTheme } from '@/context/ThemeContext';
import {
  useCreateMeetingMutation,
  useUpdateMeetingMutation,
} from '@/Services/admin/zoomService';
import { toast } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useGetBatchesByCourseQuery, useGetBatchesByInternshipQuery } from '@/Services/admin/batchdetailsService';
import { useGetAllInternshipsDomainsQuery } from '@/Services/paymentServices/internshipsServices';
import { FiX, FiBookOpen, FiUsers, FiClock, FiMail, FiPlay, FiEdit2, FiRotateCw, FiType, FiCheckCircle, FiVideo, FiCalendar } from "react-icons/fi";

/* ---------------- Validation ---------------- */

const validationSchema = Yup.object({
  title: Yup.string().required("Required"),
  startTime: Yup.date()
    .min(new Date(), "Start time must be in the future")
    .required("Required"),
  duration: Yup.number()
    .min(15, "Minimum 15 minutes")
    .max(180, "Maximum 180 minutes")
    .required("Required"),
  classType: Yup.string().oneOf(["course", "internship"]),
  courseId: Yup.string().when('classType', {
    is: 'course',
    then: () => Yup.string().required("Required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  batchId: Yup.string().when('classType', {
    is: 'course',
    then: () => Yup.string().required("Required"),
    otherwise: () => Yup.string().required("Required"),
  }),
  internshipDomainId: Yup.string().when('classType', {
    is: 'internship',
    then: () => Yup.string().required("Required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  hostEmail: Yup.string()
    .email("Invalid email")
    .required("Host email is required"),
  recurrence: Yup.string().oneOf(["once", "daily"]).required(),
  endDate: Yup.date().nullable().test(
    "end-required",
    "End date is required for daily classes",
    function (value) {
      const { recurrence, startTime } = this.parent;
      if (recurrence === "daily") {
        if (!value) return false;
        if (startTime && value <= startTime) {
          return this.createError({
            message: "End date must be after start time",
          });
        }
      }
      return true;
    }
  ),
});

/* ---------------- Component ---------------- */

const LiveClassForm = ({ onSuccess, initialData, mode = "create" }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { courses } = useCourses();
  const { data: internshipDomainsData } = useGetAllInternshipsDomainsQuery();
  const internshipDomains = internshipDomainsData?.data || [];

  const toLocalInput = (utc) => {
    const d = new Date(utc);
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  };

  const isEditMode = mode === "edit";

  const [selectedCourseId, setSelectedCourseId] = useState(
    initialData?.course?._id || ""
  );

  const [selectedInternshipId, setSelectedInternshipId] = useState(
    initialData?.internshipDomain?._id || ""
  );

  const { data: batchesByCourse } = useGetBatchesByCourseQuery(
    selectedCourseId,
    { skip: !selectedCourseId }
  );

  const { data: batchesByInternship } = useGetBatchesByInternshipQuery(
    selectedInternshipId,
    { skip: !selectedInternshipId }
  );

  const [createMeeting, { isLoading: isCreating }] =
    useCreateMeetingMutation();
  const [updateMeeting, { isLoading: isUpdating }] =
    useUpdateMeetingMutation();

  const isLoading = isCreating || isUpdating;

  const initialValues = isEditMode
    ? {
      title: initialData.title || "",
      classType: initialData.classType || (initialData.internshipDomain ? "internship" : "course"),
      startTime: initialData.startTime
        ? toLocalInput(initialData.startTime)
        : "",
      duration: initialData.duration || 60,
      courseId: initialData.course?._id || "",
      batchId: initialData.batch?._id || "",
      internshipDomainId: initialData.internshipDomain?._id || "",
      hostEmail: initialData.hostEmail || "",
      recurrence: initialData.recurrence || "once",
      endDate: initialData.endDate || "",
    }
    : {
      title: "",
      classType: "course",
      startTime: "",
      duration: 60,
      courseId: "",
      batchId: "",
      internshipDomainId: "",
      hostEmail: "",
      recurrence: "once",
      endDate: "",
    };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.96, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.96, y: 20, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={`w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col ${isDark
            ? 'bg-semidark'
            : 'bg-white'
            }`}
        >
          {/* Gradient Header */}
          <div className="p-4 sm:p-6 flex items-start justify-between border-b">
            <div className="flex items-center gap-3">
              <div className="p-2.5 sm:p-3 rounded-xl backdrop-blur-sm">
                <FiVideo className={`w-5 h-5 sm:w-6 sm:h-6 ${isDark ? 'text-primary' : 'text-primary'}`} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl text-primary font-bold flex items-center gap-2">
                  {isEditMode ? (
                    <>
                      <FiEdit2 className="w-5 h-5 sm:w-6 sm:h-6" />
                      Edit Live Class
                    </>
                  ) : (
                    <>
                      <FiVideo className="w-5 h-5 sm:w-6 sm:h-6" />
                      Schedule Live Class
                    </>
                  )}
                </h2>
                <p className="text-xs sm:text-sm text-gray mt-0.5">
                  Configure timing, batch, and host details
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSuccess}
              className="p-1.5 sm:p-2 rounded-xl hover:bg-white/20 transition text-white"
            >
              <FiX className={`w-5 h-5 sm:w-6 sm:h-6 ${isDark ? 'text-white' : 'text-midnight_text'}`} />
            </motion.button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <Formik
              initialValues={initialValues}
              enableReinitialize
              validationSchema={validationSchema}
              onSubmit={async (values, { resetForm }) => {
                try {
                  if (isEditMode) {
                    await updateMeeting({
                      id: initialData._id,
                      ...values,
                    }).unwrap();
                    toast.success("Live class updated");
                  } else {
                    await createMeeting(values).unwrap();
                    toast.success("Live class created");
                    resetForm();
                  }
                  onSuccess?.();
                } catch (err) {
                  toast.error(
                    err?.data?.message ||
                    `Failed to ${isEditMode ? "update" : "create"} class`
                  );
                }
              }}
            >
              {({ errors, touched, values, setFieldValue }) => (
                <Form className={`space-y-4 sm:space-y-5`}>
                  <FieldInput
                    isDark={isDark}
                    name="title"
                    label={<div className="flex items-center gap-2"><FiType className="w-4 h-4 text-primary" /> Class Title</div>}
                    placeholder="e.g., Advanced JavaScript Basics"
                    errors={errors}
                    touched={touched}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <FieldSelect
                      isDark={isDark}
                      name="recurrence"
                      label={<div className="flex items-center gap-2"><FiRotateCw className="w-4 h-4 text-primary" /> Class Type</div>}
                      options={[
                        { value: "once", label: "One-time Class" },
                        { value: "daily", label: "Daily Recurring" },
                      ]}
                      errors={errors}
                      touched={touched}
                    />

                    <FieldInput
                      isDark={isDark}
                      name="duration"
                      type="number"
                      label={<div className="flex items-center gap-2"><FiClock className="w-4 h-4 text-primary" /> Duration (min)</div>}
                      placeholder="60"
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <FieldInput
                    isDark={isDark}
                    name="startTime"
                    type="datetime-local"
                    label={<div className="flex items-center gap-2"><FiClock className="w-4 h-4 text-primary" /> Start Time</div>}
                    errors={errors}
                    touched={touched}
                  />

                  {values.recurrence === "daily" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.2 }}
                    >
                      <FieldInput
                        isDark={isDark}
                        name="endDate"
                        type="date"
                        label={<div className="flex items-center gap-2"><FiCalendar className="w-4 h-4 text-primary" /> Recurrence End Date</div>}
                        errors={errors}
                        touched={touched}
                      />
                    </motion.div>
                  )}

                  <FieldSelect
                    isDark={isDark}
                    name="classType"
                    label={<div className="flex items-center gap-2"><FiBookOpen className="w-4 h-4 text-primary" /> Target Audience</div>}
                    options={[
                      { value: "course", label: "Course Students" },
                      { value: "internship", label: "Internship Students" },
                    ]}
                    errors={errors}
                    touched={touched}
                  />

                  {/* Course / Internship Selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    {values.classType === "course" ? (
                    <>
                    {/* Course */}
                    <div>
                      <label className={`text-sm font-semibold mb-2 flex items-center gap-2 ${
                        isDark ? 'text-gray' : 'text-midnight_text'
                      }`}>
                        <FiBookOpen className="w-4 h-4 text-primary" /> Course
                      </label>
                      <Field
                        as="select"
                        name="courseId"
                        className={`w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 transition ${
                          isDark
                            ? 'border-dark_border bg-darklight text-white focus:border-primary focus:ring-primary/30'
                            : 'border-border bg-light text-midnight_text focus:border-primary focus:ring-primary/20'
                        }`}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFieldValue("courseId", value);
                          if (!isEditMode) {
                            setFieldValue("batchId", "");
                          }
                          setSelectedCourseId(value);
                        }}
                      >
                        <option value="">Select Course</option>
                        {courses?.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
                          </option>
                        ))}
                      </Field>
                      {errors.courseId && touched.courseId && (
                        <p className={`text-xs mt-1 text-rose-500`}>{errors.courseId}</p>
                      )}
                    </div>

                    {/* Batch */}
                    <div>
                      <label className={`text-sm font-semibold mb-2 flex items-center gap-2 ${
                        isDark ? 'text-gray' : 'text-midnight_text'
                      }`}>
                        <FiUsers className="w-4 h-4 text-purple-500" /> Batch
                      </label>
                      <Field
                        as="select"
                        name="batchId"
                        disabled={!values.courseId}
                        className={`w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 transition ${
                          isDark
                            ? 'border-dark_border bg-darklight text-white disabled:bg-darkmode disabled:text-gray focus:border-primary focus:ring-primary/30'
                            : 'border-border bg-light text-midnight_text disabled:bg-section disabled:text-gray focus:border-primary focus:ring-primary/20'
                        }`}
                      >
                        <option value="">
                          {values.courseId ? "Select Batch" : "Select Course First"}
                        </option>
                        {batchesByCourse?.data?.map((b) => (
                          <option key={b._id} value={b._id}>
                            {b.batchName}
                          </option>
                        ))}
                      </Field>
                      {errors.batchId && touched.batchId && (
                        <p className={`text-xs mt-1 text-rose-500`}>{errors.batchId}</p>
                      )}
                    </div>
                    </>
                    ) : (
                    <>
                    <div>
                      <label className={`text-sm font-semibold mb-2 flex items-center gap-2 ${
                        isDark ? 'text-gray' : 'text-midnight_text'
                      }`}>
                        <FiBookOpen className="w-4 h-4 text-primary" /> Internship Domain
                      </label>
                      <Field
                        as="select"
                        name="internshipDomainId"
                        className={`w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 transition ${
                          isDark
                            ? 'border-dark_border bg-darklight text-white focus:border-primary focus:ring-primary/30'
                            : 'border-border bg-light text-midnight_text focus:border-primary focus:ring-primary/20'
                        }`}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFieldValue("internshipDomainId", value);
                          if (!isEditMode) {
                            setFieldValue("batchId", "");
                          }
                          setSelectedInternshipId(value);
                        }}
                      >
                        <option value="">Select Internship</option>
                        {internshipDomains?.map((domain) => (
                          <option key={domain._id} value={domain._id}>
                            {domain.name}
                          </option>
                        ))}
                      </Field>
                      {errors.internshipDomainId && touched.internshipDomainId && (
                        <p className={`text-xs mt-1 text-rose-500`}>{errors.internshipDomainId}</p>
                      )}
                    </div>
                    
                    {/* Batch for Internship */}
                    <div>
                      <label className={`text-sm font-semibold mb-2 flex items-center gap-2 ${
                        isDark ? 'text-gray' : 'text-midnight_text'
                      }`}>
                        <FiUsers className="w-4 h-4 text-purple-500" /> Batch
                      </label>
                      <Field
                        as="select"
                        name="batchId"
                        disabled={!values.internshipDomainId}
                        className={`w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 transition ${
                          isDark
                            ? 'border-dark_border bg-darklight text-white disabled:bg-darkmode disabled:text-gray focus:border-primary focus:ring-primary/30'
                            : 'border-border bg-light text-midnight_text disabled:bg-section disabled:text-gray focus:border-primary focus:ring-primary/20'
                        }`}
                      >
                        <option value="">
                          {values.internshipDomainId ? "Select Batch" : "Select Internship First"}
                        </option>
                        {batchesByInternship?.data?.map((b) => (
                          <option key={b._id} value={b._id}>
                            {b.batchName}
                          </option>
                        ))}
                      </Field>
                      {errors.batchId && touched.batchId && (
                        <p className={`text-xs mt-1 text-rose-500`}>{errors.batchId}</p>
                      )}
                    </div>
                    </>
                    )}
                  </div>

                  <FieldInput
                    isDark={isDark}
                    name="hostEmail"
                    type="email"
                    label={<div className="flex items-center gap-2"><FiMail className="w-4 h-4 text-primary" /> Host Email</div>}
                    placeholder="admin@example.com"
                    errors={errors}
                    touched={touched}
                  />

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn-primary font-semibold py-3 sm:py-4 rounded-xl transition shadow-md hover:shadow-lg disabled:shadow-none mt-2 sm:mt-4"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        {isEditMode ? "Updating..." : "Creating..."}
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <FiPlay className="w-5 h-5" />
                        {isEditMode ? "Update Live Class" : "Create Live Class"}
                      </span>
                    )}
                  </motion.button>
                </Form>
              )}
          </Formik>
        </div>
      </motion.div>
    </motion.div>
    </AnimatePresence >
  );
};


/* ---------------- Reusable Fields ---------------- */

const FieldInput = ({ isDark, label, name, errors, touched, placeholder, ...props }) => (
  <div>
    <label className={`text-sm font-semibold mb-2 block ${isDark ? 'text-gray' : 'text-midnight_text'
      }`}>{label}</label>
    <Field
      name={name}
      {...props}
      placeholder={placeholder}
      className={`w-full rounded-xl border px-3 sm:px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition placeholder-gray-400 ${isDark
        ? 'border-dark_border bg-darklight text-white placeholder-gray focus:border-primary focus:ring-primary/30'
        : 'border-border bg-light text-midnight_text placeholder-gray focus:border-primary focus:ring-primary/20'
        }`}
    />
    {errors[name] && touched[name] && (
      <p className={`text-xs mt-1.5 text-rose-500`}>{errors[name]}</p>
    )}
  </div>
);

const FieldSelect = ({ isDark, label, name, options, errors, touched }) => (
  <div>
    <label className={`text-sm font-semibold mb-2 flex items-center gap-2 ${isDark ? 'text-gray' : 'text-midnight_text'
      }`}>
      {label}
    </label>
    <Field
      as="select"
      name={name}
      className={`w-full rounded-xl border px-3 sm:px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition cursor-pointer ${isDark
        ? 'border-dark_border bg-darklight text-white focus:border-primary focus:ring-primary/30'
        : 'border-border bg-light text-midnight_text focus:border-primary focus:ring-primary/20'
        }`}
    >
      <option value="">Select Option</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </Field>
    {errors[name] && touched[name] && (
      <p className={`text-xs mt-1.5 text-rose-500`}>{errors[name]}</p>
    )}
  </div>
);

export default LiveClassForm;