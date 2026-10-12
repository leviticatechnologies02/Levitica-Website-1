// InternshipPaymentForm.jsx
import { useState } from 'react';
import { useFormik } from 'formik';
import { FiTag, FiCheck } from 'react-icons/fi';
import { useApplyPromoMutation } from '@/Services/student/promoCodeServices';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { usePayment } from './services/handlePayment.js';
import { FaCode, FaLaptopCode, FaCalendarAlt } from "react-icons/fa";
import { MdEmail, MdPhone, MdSchool, MdAssignment } from "react-icons/md";
import { HiAcademicCap, HiUser } from "react-icons/hi";

const InternshipPaymentForm = ({ domains, initialDomainId = '' }) => {
  const { handlePayment, isLoading } = usePayment();
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [applyPromo, { isLoading: isApplyingPromo }] = useApplyPromoMutation();

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) {
      toast.error("Please enter a promo code");
      return;
    }
    if (!formik.values.amount || formik.values.amount <= 0) {
      toast.error("Please select a program duration first");
      return;
    }
    try {
      const res = await applyPromo({
        code: promoInput.trim().toUpperCase(),
        amount: formik.values.amount,
      }).unwrap();
      setAppliedPromo(res);
      formik.setFieldValue("promoCode", res.code);
      formik.setFieldValue("promoId", res.promoId);
      toast.success(`🎉 Promo code ${res.code} applied! Saved ₹${res.discount}`);
    } catch (err) {
      toast.error(err?.data?.message || err?.message || "Invalid or expired promo code");
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput("");
    formik.setFieldValue("promoCode", "");
    formik.setFieldValue("promoId", "");
    toast.success("Promo code removed");
  };

  const domainOptions = domains.map((domain) => ({
    id: domain._id,
    name: domain.name,
  }));
  
  const departmentOptions = [
    'Computer Science',
    'Information Technology',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering'
  ];

  const semesterOptions = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

  const collegeOptions = [
    { name: 'K G Reddy College of Engineering', code: 'KGRCE' },
    { name: 'JNTU Hyderabad', code: 'JNTUH' },
    { name: 'Osmania University', code: 'OU' },
    { name: 'Chaitanya Bharathi Institute of Technology', code: 'CBIT' },
    { name: 'Vasavi College of Engineering', code: 'VCE' },
    { name: 'Muffakham Jah College of Engineering', code: 'MJCE' },
    { name: 'Other', code: 'OTHER' }
  ];

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
      .required('Phone number is required'),
    department: Yup.string().required('Department is required'),
    semester: Yup.string().required('Semester is required'),
    rollNumber: Yup.string().required('Roll number is required'),
    program: Yup.string().required('Please select a program'),
    domain: Yup.string().required('Please select a domain'),
    amount: Yup.number().required('Amount is required'),
    collegeName: Yup.string().required('College name is required'),
    collegeCode: Yup.string().required('College code is required')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      department: '',
      semester: '',
      rollNumber: '',
      program: '',
      domain: initialDomainId,
      amount: 0,
      collegeName: '',
      collegeCode: '',
      promoCode: '',
      promoId: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await handlePayment({
          ...values,
          promoCode: appliedPromo?.code,
          promoId: appliedPromo?.promoId,
        });
      } catch (error) {
        console.error("Payment error:", error);
      }
    }
  });


  // Get selected domain
const selectedDomain = domains.find(
  (domain) => domain._id === formik.values.domain
);

// Build program options dynamically
const programOptions =
  selectedDomain?.durations?.map((duration) => ({
    id: String(duration.days),
    name: duration.label || `${duration.days} Days`,
    days: duration.days,
    amount: duration.fee,
  })) || [];

  const handleCollegeInput = (e) => {
    const selectedCollegeName = e.target.value;
    formik.setFieldValue('collegeName', selectedCollegeName);
    const selectedCollege = collegeOptions.find(college => college.name === selectedCollegeName);
    if (selectedCollege) {
      formik.setFieldValue('collegeCode', selectedCollege.code);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-xl p-6 w-full lg:max-w-lg">
      {/* Title */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Payment Details</h2>
        <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mt-2 rounded-full"></div>
      </div>

      {/* Form Section */}
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <HiUser className="inline mr-1" /> Name of the student *
          </label>
          <input
            type="text"
            name="name"
            className={`w-full p-3 border rounded-lg transition-all ${formik.errors.name && formik.touched.name
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              } focus:outline-none focus:ring-2`}
            placeholder="Enter your name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.name && formik.touched.name && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MdEmail className="inline mr-1" /> Email *
          </label>
          <input
            type="email"
            name="email"
            className={`w-full p-3 border rounded-lg transition-all ${formik.errors.email && formik.touched.email
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              } focus:outline-none focus:ring-2`}
            placeholder="Enter your email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.email && formik.touched.email && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MdPhone className="inline mr-1" /> Phone *
          </label>
          <input
            type="tel"
            name="phone"
            className={`w-full p-3 border rounded-lg transition-all ${formik.errors.phone && formik.touched.phone
              ? 'border-red-500 focus:ring-red500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              } focus:outline-none focus:ring-2`}
            placeholder="Enter your phone number"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.phone && formik.touched.phone && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.phone}</p>
          )}
        </div>

        {/* College Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MdSchool className="inline mr-1" /> College Name *
          </label>
          <div className="relative">
            <input
              type="text"
              name="collegeName"
              list="collegeOptions"
              className={`w-full p-3 border rounded-lg transition-all ${formik.errors.collegeName && formik.touched.collegeName
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                } focus:outline-none focus:ring-2`}
              placeholder="Select or type college name"
              value={formik.values.collegeName}
              onChange={handleCollegeInput}
              onBlur={formik.handleBlur}
            />
            <datalist id="collegeOptions">
              {collegeOptions.map((college) => (
                <option key={college.code} value={college.name}>
                  {college.name} ({college.code})
                </option>
              ))}
            </datalist>
          </div>
          {formik.errors.collegeName && formik.touched.collegeName && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.collegeName}</p>
          )}
        </div>

        {/* College Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FaCode className="inline mr-1" /> College Code *
          </label>
          <input
            type="text"
            name="collegeCode"
            className={`w-full p-3 border rounded-lg transition-all ${formik.errors.collegeCode && formik.touched.collegeCode
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              } focus:outline-none focus:ring-2`}
            placeholder="Enter college code"
            value={formik.values.collegeCode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.collegeCode && formik.touched.collegeCode && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.collegeCode}</p>
          )}
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <HiAcademicCap className="inline mr-1" /> Department *
          </label>
          <div className="relative">
            <input
              type="text"
              name="department"
              list="departmentOptions"
              className={`w-full p-3 border rounded-lg transition-all ${formik.errors.department && formik.touched.department
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                } focus:outline-none focus:ring-2`}
              placeholder="Select or type department"
              value={formik.values.department}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <datalist id="departmentOptions">
              {departmentOptions.map((dept) => (
                <option key={dept} value={dept} />
              ))}
            </datalist>
          </div>
          {formik.errors.department && formik.touched.department && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.department}</p>
          )}
        </div>

        {/* Semester */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FaCalendarAlt className="inline mr-1" /> Semester *
          </label>
          <select
            name="semester"
            className={`w-full p-3 border rounded-lg transition-all ${formik.errors.semester && formik.touched.semester
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              } focus:outline-none focus:ring-2`}
            value={formik.values.semester}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">Select Semester</option>
            {semesterOptions.map((sem) => (
              <option key={sem} value={sem}>{sem} Semester</option>
            ))}
          </select>
          {formik.errors.semester && formik.touched.semester && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.semester}</p>
          )}
        </div>

        {/* Roll Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MdAssignment className="inline mr-1" /> Roll Number *
          </label>
          <input
            type="text"
            name="rollNumber"
            className={`w-full p-3 border rounded-lg transition-all ${formik.errors.rollNumber && formik.touched.rollNumber
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              } focus:outline-none focus:ring-2`}
            placeholder="Enter roll number"
            value={formik.values.rollNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.rollNumber && formik.touched.rollNumber && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.rollNumber}</p>
          )}
        </div>

        {/* Domain Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FaLaptopCode className="inline mr-1" /> Internship Domain *
          </label>
          <select
            name="domain"
            className={`w-full p-3 border rounded-lg transition-all ${
              formik.errors.domain && formik.touched.domain 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            } focus:outline-none focus:ring-2`}
            value={formik.values.domain}
            onChange={(e) => {
              formik.setFieldValue("domain", e.target.value);
              formik.setFieldValue("program", "");
              formik.setFieldValue("amount", 0);
            }}
          >
            <option value="">Select Internship Domain</option>
            {domainOptions.map((domain) => (
              <option key={domain.id} value={domain.id}>
                {domain.name}
              </option>
            ))}
          </select>

          {formik.errors.domain && formik.touched.domain && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.domain}</p>
          )}
        </div>

        {/* Program Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Choose Program Duration *
          </label>
          <select
            name="program"
            className={`w-full p-3 border rounded-lg transition-all ${
              formik.errors.program && formik.touched.program 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            } focus:outline-none focus:ring-2`}
            value={formik.values.program}
            onChange={(e) => {
              const selectedProgram = programOptions.find(
                (program) => program.id === e.target.value
              );

              formik.setFieldValue("program", e.target.value);
              formik.setFieldValue("amount", selectedProgram?.amount || 0);
              setAppliedPromo(null);
              setPromoInput("");
              formik.setFieldValue("promoCode", "");
              formik.setFieldValue("promoId", "");
            }}
            disabled={!selectedDomain}
          >
            <option value="">Select Program Duration</option>
            {programOptions.map((program) => (
              <option key={program.id} value={program.id}>
                {program.days} days - ₹{Number(program.amount || 0).toLocaleString('en-IN')}
              </option>
            ))}
          </select>

          {formik.errors.program && formik.touched.program && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.program}</p>
          )}
        </div>

        {/* Promo Code Section */}
        {formik.values.amount > 0 && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
              <FiTag className="text-indigo-600" /> Have a Promo Code?
            </div>
            {appliedPromo ? (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                <div className="flex items-center gap-2">
                  <FiCheck className="text-emerald-600 text-base" />
                  <div>
                    <span className="font-mono font-bold tracking-wider uppercase bg-emerald-100 px-1.5 py-0.5 rounded mr-1">
                      {appliedPromo.code}
                    </span>
                    <span>Saved ₹{Number(appliedPromo.discount || 0).toLocaleString("en-IN")}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemovePromo}
                  className="text-red-500 hover:text-red-700 font-medium px-2 py-0.5 rounded transition"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleApplyPromo();
                    }
                  }}
                  placeholder="ENTER PROMO CODE"
                  className="flex-1 p-2 text-xs font-mono uppercase border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  disabled={isApplyingPromo || !promoInput.trim()}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition"
                >
                  {isApplyingPromo ? "Applying..." : "Apply"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Amount Display */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
          {appliedPromo ? (
            <div className="space-y-1 mb-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Program Fee:</span>
                <span>₹{Number(formik.values.amount || 0).toLocaleString("en-IN")}.00</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Promo Discount ({appliedPromo.code}):</span>
                <span>-₹{Number(appliedPromo.discount || 0).toLocaleString("en-IN")}.00</span>
              </div>
              <div className="border-t border-blue-200 pt-2 flex justify-between items-baseline">
                <span className="text-sm font-semibold text-gray-800">Final Payable:</span>
                <span className="text-3xl font-bold text-gray-900">
                  ₹{Number(appliedPromo.finalAmount || 0).toLocaleString("en-IN")}.00
                </span>
              </div>
            </div>
          ) : (
            <>
              <div className="text-sm font-medium text-gray-700 mb-2">
                Amount to Pay
              </div>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-gray-900 mr-1">₹</span>
                <span className="text-3xl font-bold text-gray-900">
                  {Number(formik.values.amount || 0).toLocaleString("en-IN")}.00
                </span>
              </div>
            </>
          )}
        </div>

        {/* Form Footer */}
        <div className="mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <img
              alt="pay-methods"
              src="https://cdn.razorpay.com/static/assets/pay_methods_branding.png"
              width="180"
              className="mb-4 sm:mb-0"
            />
            <button
              type="submit"
              className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-all w-full sm:w-auto ${isLoading || formik.values.amount === 0
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:from-blue-700 hover:to-purple-700 hover:shadow-lg'
                }`}
              disabled={isLoading || formik.values.amount === 0}
            >
              {isLoading ? (
                <>
                  <span className="inline-block animate-spin mr-2">⟳</span>
                  Processing...
                </>
              ) : (
                <>
                  Pay ₹{Number(appliedPromo ? appliedPromo.finalAmount : (formik.values.amount || 0)).toLocaleString("en-IN")}.00
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InternshipPaymentForm;