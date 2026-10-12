import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiSave, FiTag, FiCalendar, FiUsers, FiDollarSign } from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";
import {
  useCreatePromoMutation,
  useUpdatePromoMutation,
} from "@/Services/admin/promocodeServices";
import toast from "react-hot-toast";

const PromoModal = ({ onSuccess, mode = "add", promo = {} }) => {
  const isEdit = mode === "edit";
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [createPromo, { isLoading: creating }] = useCreatePromoMutation();
  const [updatePromo, { isLoading: updating }] = useUpdatePromoMutation();

  const isLoading = creating || updating;

  const initialValues = isEdit
    ? {
        code: promo.code ?? "",
        discountType: promo.discountType ?? "percentage",
        discountValue: promo.discountValue ?? "",
        maxDiscount: promo.maxDiscount ?? "",
        minPurchase: promo.minPurchase ?? 1000,
        expiryDate: promo.expiryDate ? new Date(promo.expiryDate).toISOString().slice(0, 10) : "",
        usageLimit: promo.usageLimit ?? "",
        influencerName: promo.influencerName ?? "",
        influencerEmail: promo.influencerEmail ?? "",
        influencerPhone: promo.influencerPhone ?? "",
      }
    : {
        code: "",
        discountType: "percentage",
        discountValue: "",
        maxDiscount: "",
        minPurchase: 1000,
        expiryDate: "",
        usageLimit: "",
        influencerName: "",
        influencerEmail: "",
        influencerPhone: "",
      };

  const validationSchema = Yup.object({
    code: Yup.string()
      .trim()
      .required("Promo code is required")
      .matches(/^[A-Za-z0-9_-]+$/, "Letters, numbers, and dashes only"),
    discountType: Yup.string().required("Discount type is required"),
    discountValue: Yup.number()
      .positive("Discount value must be greater than 0")
      .required("Discount value is required"),
    minPurchase: Yup.number()
      .min(0, "Cannot be negative")
      .required("Minimum purchase is required"),
    expiryDate: Yup.date().required("Expiry date is required"),
    influencerName: Yup.string().trim().required("Influencer name is required"),
    influencerEmail: Yup.string().email("Invalid email").required("Influencer email is required"),
    influencerPhone: Yup.string()
      .matches(/^[0-9+\s-]{10,15}$/, "Enter valid phone number")
      .required("Phone number is required"),
  });

  const onSubmitFn = async (values, { setSubmitting }) => {
    try {
      const payload = {
        code: values.code.toUpperCase().trim(),
        discountType: values.discountType,
        discountValue: Number(values.discountValue),
        maxDiscount: values.maxDiscount ? Number(values.maxDiscount) : null,
        minPurchase: Number(values.minPurchase || 1000),
        expiryDate: new Date(values.expiryDate).toISOString(),
        usageLimit: values.usageLimit ? Number(values.usageLimit) : null,
        influencerName: values.influencerName.trim(),
        influencerEmail: values.influencerEmail.toLowerCase().trim(),
        influencerPhone: values.influencerPhone.trim(),
      };

      if (isEdit) {
        await updatePromo({ id: promo._id, ...payload }).unwrap();
        toast.success(`Promo code "${payload.code}" updated successfully!`);
      } else {
        await createPromo(payload).unwrap();
        toast.success(`Promo code "${payload.code}" created successfully!`);
      }
      onSuccess?.();
    } catch (err) {
      console.error("Promo mutation error:", err);
      toast.error(err?.data?.message || err?.message || "Failed to save promo code");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = isDark
    ? "w-full rounded-lg border border-slate-600 bg-slate-700/80 px-3 py-2 text-sm text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
    : "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={`w-full max-w-2xl overflow-hidden rounded-2xl shadow-2xl transition-colors ${
            isDark ? "bg-slate-800 border border-slate-700" : "bg-white"
          }`}
        >
          {/* HEADER */}
          <div
            className={`flex items-center justify-between border-b px-6 py-4 transition-colors ${
              isDark ? "border-slate-700" : "border-slate-200"
            }`}
          >
            <div>
              <h2
                className={`text-lg font-bold transition-colors ${
                  isDark ? "text-slate-100" : "text-slate-900"
                }`}
              >
                {isEdit ? "Edit Promo Code" : "Create Promo Code"}
              </h2>
              <p
                className={`mt-0.5 text-xs transition-colors ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Configure discount rules, usage limits, and influencer tracking
              </p>
            </div>

            <button
              onClick={onSuccess}
              className={`rounded-lg p-2 transition cursor-pointer ${
                isDark
                  ? "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              }`}
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          {/* FORM CONTAINER */}
          <div className="max-h-[75vh] overflow-y-auto p-6">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmitFn}
              enableReinitialize
            >
              {({ values, isSubmitting }) => (
                <Form className="space-y-5">
                  {/* CODE & BASIC */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label
                        className={`mb-1 block text-xs font-semibold ${
                          isDark ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        Promo Code <span className="text-rose-500">*</span>
                      </label>
                      <Field
                        name="code"
                        placeholder="e.g. SUMMER50"
                        className={`${inputClass} uppercase font-mono tracking-wider`}
                      />
                      <ErrorMessage
                        name="code"
                        component="p"
                        className="mt-1 text-xs text-rose-500"
                      />
                    </div>

                    <div>
                      <label
                        className={`mb-1 block text-xs font-semibold ${
                          isDark ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        Expiry Date <span className="text-rose-500">*</span>
                      </label>
                      <Field type="date" name="expiryDate" className={inputClass} />
                      <ErrorMessage
                        name="expiryDate"
                        component="p"
                        className="mt-1 text-xs text-rose-500"
                      />
                    </div>
                  </div>

                  {/* DISCOUNT SETTINGS */}
                  <div
                    className={`rounded-xl border p-4 space-y-4 ${
                      isDark
                        ? "border-slate-700/80 bg-slate-900/40"
                        : "border-slate-200 bg-slate-50/60"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FiDollarSign className="text-blue-500" />
                      <h3
                        className={`text-xs font-bold uppercase tracking-wider ${
                          isDark ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        Discount Rules
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label
                          className={`mb-1 block text-xs font-medium ${
                            isDark ? "text-slate-300" : "text-slate-700"
                          }`}
                        >
                          Discount Type
                        </label>
                        <Field as="select" name="discountType" className={inputClass}>
                          <option value="percentage">Percentage (%)</option>
                          <option value="flat">Flat Amount (₹)</option>
                        </Field>
                      </div>

                      <div>
                        <label
                          className={`mb-1 block text-xs font-medium ${
                            isDark ? "text-slate-300" : "text-slate-700"
                          }`}
                        >
                          Value ({values.discountType === "percentage" ? "%" : "₹"}){" "}
                          <span className="text-rose-500">*</span>
                        </label>
                        <Field
                          type="number"
                          name="discountValue"
                          placeholder={values.discountType === "percentage" ? "20" : "500"}
                          className={inputClass}
                        />
                        <ErrorMessage
                          name="discountValue"
                          component="p"
                          className="mt-1 text-xs text-rose-500"
                        />
                      </div>

                      <div>
                        <label
                          className={`mb-1 block text-xs font-medium ${
                            isDark ? "text-slate-300" : "text-slate-700"
                          }`}
                        >
                          Max Discount (₹)
                        </label>
                        <Field
                          type="number"
                          name="maxDiscount"
                          placeholder="Optional cap"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      <div>
                        <label
                          className={`mb-1 block text-xs font-medium ${
                            isDark ? "text-slate-300" : "text-slate-700"
                          }`}
                        >
                          Minimum Purchase Amount (₹)
                        </label>
                        <Field
                          type="number"
                          name="minPurchase"
                          placeholder="1000"
                          className={inputClass}
                        />
                        <p className="mt-1 text-[11px] text-slate-400">
                          Order total must be at least this value to apply code.
                        </p>
                      </div>

                      <div>
                        <label
                          className={`mb-1 block text-xs font-medium ${
                            isDark ? "text-slate-300" : "text-slate-700"
                          }`}
                        >
                          Total Usage Limit
                        </label>
                        <Field
                          type="number"
                          name="usageLimit"
                          placeholder="Leave empty for unlimited"
                          className={inputClass}
                        />
                        <p className="mt-1 text-[11px] text-slate-400">
                          Maximum times this code can be redeemed across all users.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* INFLUENCER / CAMPAIGN */}
                  <div
                    className={`rounded-xl border p-4 space-y-4 ${
                      isDark
                        ? "border-slate-700/80 bg-slate-900/40"
                        : "border-slate-200 bg-slate-50/60"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FiUsers className="text-emerald-500" />
                      <h3
                        className={`text-xs font-bold uppercase tracking-wider ${
                          isDark ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        Influencer / Campaign Details
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label
                          className={`mb-1 block text-xs font-medium ${
                            isDark ? "text-slate-300" : "text-slate-700"
                          }`}
                        >
                          Influencer Name <span className="text-rose-500">*</span>
                        </label>
                        <Field
                          name="influencerName"
                          placeholder="John Doe"
                          className={inputClass}
                        />
                        <ErrorMessage
                          name="influencerName"
                          component="p"
                          className="mt-1 text-xs text-rose-500"
                        />
                      </div>

                      <div>
                        <label
                          className={`mb-1 block text-xs font-medium ${
                            isDark ? "text-slate-300" : "text-slate-700"
                          }`}
                        >
                          Email <span className="text-rose-500">*</span>
                        </label>
                        <Field
                          name="influencerEmail"
                          type="email"
                          placeholder="john@example.com"
                          className={inputClass}
                        />
                        <ErrorMessage
                          name="influencerEmail"
                          component="p"
                          className="mt-1 text-xs text-rose-500"
                        />
                      </div>

                      <div>
                        <label
                          className={`mb-1 block text-xs font-medium ${
                            isDark ? "text-slate-300" : "text-slate-700"
                          }`}
                        >
                          Phone <span className="text-rose-500">*</span>
                        </label>
                        <Field
                          name="influencerPhone"
                          placeholder="9876543210"
                          className={inputClass}
                        />
                        <ErrorMessage
                          name="influencerPhone"
                          component="p"
                          className="mt-1 text-xs text-rose-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* FOOTER ACTIONS */}
                  <div
                    className={`flex items-center justify-end gap-3 pt-4 border-t ${
                      isDark ? "border-slate-700" : "border-slate-200"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={onSuccess}
                      className="px-4 py-2.5 rounded-lg border text-xs font-semibold transition cursor-pointer btn-gray"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading || isSubmitting}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold transition shadow-md hover:shadow-lg bg-blue-600 hover:bg-blue-700 text-white cursor-pointer disabled:opacity-50"
                    >
                      <FiSave className="w-3.5 h-3.5" />
                      {isLoading || isSubmitting
                        ? "Saving..."
                        : isEdit
                        ? "Update Promo Code"
                        : "Create Promo Code"}
                    </button>
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

export default PromoModal;
