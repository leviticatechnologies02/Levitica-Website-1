import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { FaArrowLeft, FaCheckCircle, FaPaperPlane } from "react-icons/fa";
import { productsData } from "@/data/productsData";

/* ─── shared input style ─── */
const cls =
  "w-full border border-slate-200 dark:border-dark_border/40 rounded-xl px-4 py-3 bg-white dark:bg-darkmode text-gray-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-cyan text-sm transition";

/* ─── build Yup schema from formSchema ─── */
function buildYup(schema) {
  const shape = {};
  schema.forEach((f) => {
    if (f.type === "checkboxes") return; // optional arrays, skip required
    let rule = f.type === "email"
      ? Yup.string().email("Invalid email address")
      : Yup.string();
    if (f.type === "tel")
      rule = rule.matches(/^[0-9]{10}$/, "Must be a valid 10-digit number");
    if (f.required) rule = rule.required(`${f.label.replace(" *", "")} is required`);
    shape[f.name] = rule;
  });
  return Yup.object(shape);
}

/* ─── build initial values ─── */
function buildInitial(schema) {
  const vals = {};
  schema.forEach((f) => {
    vals[f.name] = f.type === "checkboxes" ? [] : "";
  });
  return vals;
}

/* ─── render a single field ─── */
const RenderField = ({ f, values, setFieldValue, errors, touched }) => {
  const err = touched[f.name] && errors[f.name];

  const Label = () => (
    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
      {f.label}{f.required ? " *" : ""}
    </label>
  );

  /* TEXT / EMAIL / TEL / NUMBER */
  if (["text", "email", "tel", "number"].includes(f.type)) {
    return (
      <div>
        <Label />
        <Field name={f.name} type={f.type} placeholder={f.placeholder} className={cls} />
        {err && <p className="text-red-500 text-xs mt-1">{err}</p>}
      </div>
    );
  }

  /* SELECT */
  if (f.type === "select") {
    return (
      <div>
        <Label />
        <Field as="select" name={f.name} className={cls}>
          <option value="">Select…</option>
          {f.options.map((o) => <option key={o}>{o}</option>)}
        </Field>
        {err && <p className="text-red-500 text-xs mt-1">{err}</p>}
      </div>
    );
  }

  /* CHECKBOXES */
  if (f.type === "checkboxes") {
    const current = values[f.name] || [];
    const toggle = (opt) => {
      const next = current.includes(opt)
        ? current.filter((v) => v !== opt)
        : [...current, opt];
      setFieldValue(f.name, next);
    };
    return (
      <div className="col-span-2">
        <Label />
        <div className="flex flex-wrap gap-2 mt-1">
          {f.options.map((opt) => {
            const on = current.includes(opt);
            return (
              <button
                key={opt} type="button"
                onClick={() => toggle(opt)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                  on
                    ? "bg-primary dark:bg-cyan text-white dark:text-midnight_text border-primary dark:border-cyan"
                    : "bg-white dark:bg-semidark text-slate-600 dark:text-slate-300 border-slate-300 dark:border-dark_border/30 hover:border-primary"
                }`}
              >
                {on ? "✓ " : ""}{opt}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* FOOD CARDS */
  if (f.type === "food") {
    return (
      <div className="col-span-2">
        <Label />
        <div className="grid grid-cols-2 gap-4 mt-1">
          {[
            { value: "Veg",     emoji: "🥗", label: "Vegetarian",     accent: "#15803d", bg: "#f0fdf4" },
            { value: "Non Veg", emoji: "🍗", label: "Non-Vegetarian", accent: "#b91c1c", bg: "#fef2f2" },
          ].map(({ value, emoji, label, accent, bg }) => {
            const active = values[f.name] === value;
            return (
              <button
                key={value} type="button"
                onClick={() => setFieldValue(f.name, value)}
                className="flex flex-col items-center justify-center gap-1.5 py-4 rounded-2xl border-2 font-semibold cursor-pointer transition-all duration-200"
                style={{
                  borderColor: active ? accent : "#e2e8f0",
                  background: active ? bg : "#fff",
                  transform: active ? "translateY(-2px)" : "none",
                  boxShadow: active ? `0 4px 14px ${accent}33` : "none",
                }}
              >
                <span className="text-2xl">{emoji}</span>
                <span className="text-sm" style={{ color: accent }}>{label}</span>
              </button>
            );
          })}
        </div>
        {err && <p className="text-red-500 text-xs mt-1">{err}</p>}
      </div>
    );
  }

  /* TEXTAREA */
  if (f.type === "textarea") {
    return (
      <div className="col-span-2">
        <Label />
        <Field as="textarea" name={f.name} rows="3"
          placeholder={f.placeholder}
          className={`${cls} resize-vertical`} />
      </div>
    );
  }

  return null;
};

/* ═══════════════════════ MAIN COMPONENT ═══════════════════════ */
const ProductEnquiry = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const key = Object.keys(productsData).find(
      (k) => k === slug || productsData[k].title.toLowerCase().replace(/\s+/g, "-") === slug
    );
    setProduct(key ? productsData[key] : null);
    window.scrollTo(0, 0);
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-darkmode px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-midnight_text dark:text-white mb-4">Product not found</h2>
          <Link to="/" className="text-primary hover:underline text-sm">← Back to Home</Link>
        </div>
      </div>
    );
  }

  const enq = product.enquiry;
  const schema = enq.formSchema;
  const validationSchema = buildYup(schema);
  const initialValues = buildInitial(schema);

  const sendEnquiry = async (values, actions) => {
    const env = import.meta.env.VITE_ENV;
    const baseURL = env === "production"
      ? import.meta.env.VITE_PROD_API_URL
      : import.meta.env.VITE_LOCAL_API_URL;

    try {
      const lines = schema
        .filter((f) => f.type !== "textarea")
        .map((f) => {
          const val = Array.isArray(values[f.name])
            ? values[f.name].join(", ") || "—"
            : values[f.name] || "—";
          return `${f.label.replace(" *", "").padEnd(30)}: ${val}`;
        });

      const msgField = schema.find((f) => f.type === "textarea");
      if (msgField && values[msgField.name])
        lines.push(`\nMessage: ${values[msgField.name]}`);

      const nameField = schema.find((f) => ["contactName","hrManager","tpoName","ownerName","adminName","companyName"].includes(f.name));
      const emailField = schema.find((f) => f.type === "email");
      const mobileField = schema.find((f) => f.type === "tel");

      const payload = {
        name: nameField ? values[nameField.name] : "Enquiry",
        email: emailField ? values[emailField.name] : "",
        mobile: mobileField ? values[mobileField.name] : "",
        message: `[Product Enquiry — ${product.title}]\n\n${lines.join("\n")}`,
      };

      const res = await fetch(`${baseURL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        actions.resetForm();
        setTimeout(() => setSubmitted(false), 7000);
        toast.success("Enquiry submitted! We'll reach out shortly.");
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch {
      toast.error("Failed to connect. Please try again.");
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 dark:from-darkmode dark:via-semidark dark:to-darkmode py-24 px-4 flex items-center justify-center">
      <div className="w-full max-w-[1180px]">

        <Link to={`/products/${slug}`}
          className="inline-flex items-center gap-2 text-primary dark:text-cyan text-sm font-medium hover:underline mb-8">
          <FaArrowLeft size={11} /> Back to {product.title}
        </Link>

        <div className="grid lg:grid-cols-[380px_1fr] rounded-3xl overflow-hidden shadow-2xl">

          {/* ── LEFT ── */}
          <div className="relative flex flex-col p-10 overflow-hidden"
            style={{ background: "linear-gradient(145deg,#0f172a 0%,#1e3a8a 60%,#2563eb 100%)" }}>
            <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle,#38bdf8,transparent)" }} />
            <div className="absolute -bottom-20 -right-10 w-64 h-64 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle,#6366f1,transparent)" }} />

            <div className="relative mb-8 inline-block">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-[3px] border-white/50 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <img
                  src="/img/leviticalogo.png"
                  alt="Levitica Technologies"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <span className="relative inline-block bg-white/10 border border-white/20 text-white/70 text-xs px-3 py-1 rounded-full uppercase tracking-widest mb-4">
              {product.subtitle}
            </span>

            <h1 className="relative text-2xl lg:text-3xl font-bold text-white leading-snug mb-4">
              {enq.heading}
            </h1>
            <p className="relative text-sm leading-relaxed text-blue-200 mb-3">{enq.tagline}</p>
            <p className="relative text-sm leading-relaxed text-slate-300 mb-8">{enq.about}</p>

            <div className="relative mt-auto space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-4">What you get</p>
              {enq.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-3">
                  <FaCheckCircle className="text-[#38bdf8] mt-0.5 flex-shrink-0" size={13} />
                  <span className="text-sm text-slate-200">{h.replace("✔ ", "")}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="bg-white dark:bg-semidark p-8 lg:p-10">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-midnight_text dark:text-white mb-1">{enq.formTitle}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{enq.formSubtitle}</p>
            </div>

            {submitted && (
              <div className="mb-6 flex items-start gap-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 rounded-2xl px-5 py-4 text-sm font-semibold">
                <FaCheckCircle className="text-xl mt-0.5 flex-shrink-0" />
                <span>Thank you! Your enquiry has been received. Our team will contact you within 24 hours.</span>
              </div>
            )}

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={sendEnquiry}
            >
              {({ isSubmitting, setFieldValue, values, errors, touched }) => (
                <Form>
                  <div className="grid grid-cols-2 gap-x-5 gap-y-5">
                    {schema.map((f) => {
                      const isFullWidth = ["checkboxes", "food", "textarea"].includes(f.type) || f.half === false;
                      return (
                        <div key={f.name} className={isFullWidth ? "col-span-2" : "col-span-2 sm:col-span-1"}>
                          <RenderField
                            f={f}
                            values={values}
                            setFieldValue={setFieldValue}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-slate-100 dark:border-dark_border/20 mt-6 pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-base text-white cursor-pointer transition-all duration-300 shadow-md hover:shadow-xl active:scale-[0.98]"
                      style={{ background: isSubmitting ? "#93c5fd" : "linear-gradient(135deg,#2563eb,#1d4ed8)" }}
                    >
                      {isSubmitting
                        ? <span className="animate-pulse">Submitting…</span>
                        : <><FaPaperPlane size={14} /> Submit Registration</>
                      }
                    </button>
                    <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-3">
                      By submitting, you agree to be contacted by our team regarding{" "}
                      <strong className="text-slate-500 dark:text-slate-400">{product.title}</strong>.
                    </p>
                  </div>
                </Form>
              )}
            </Formik>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductEnquiry;
