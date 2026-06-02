import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { FaArrowLeft, FaCheckCircle, FaPaperPlane, FaChevronDown, FaTimes, FaStar, FaUsers, FaClock, FaShieldAlt, FaHeadset } from "react-icons/fa";
import { productsData } from "@/data/productsData";

/* ─── shared input style ─── */
const cls =
  "w-full border border-slate-200 dark:border-dark_border/40 rounded-xl px-4 py-3 bg-white dark:bg-darkmode text-gray-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-cyan text-sm transition";

/* ─── SearchableSelect Component ─── */
const SearchableSelect = ({ field, placeholder, options, setFieldValue, error }) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState("");
  const wrapRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = query.trim() === ""
    ? options
    : options.filter((o) => o.toLowerCase().includes(query.toLowerCase()));

  const select = (opt) => {
    setFieldValue(field.name, opt);
    setDisplayValue(opt);
    setQuery("");
    setOpen(false);
  };

  const clear = (e) => {
    e.stopPropagation();
    setFieldValue(field.name, "");
    setDisplayValue("");
    setQuery("");
  };

  return (
    <div ref={wrapRef} className="relative">
      <div
        className={`flex items-center w-full border rounded-xl px-4 py-3 bg-white dark:bg-darkmode text-sm transition cursor-text ${error
          ? "border-red-400 ring-2 ring-red-200"
          : open
            ? "border-primary dark:border-cyan ring-2 ring-primary/20 dark:ring-cyan/20"
            : "border-slate-200 dark:border-dark_border/40"
          }`}
        onClick={() => setOpen(true)}
      >
        <input
          type="text"
          value={open ? query : displayValue}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={displayValue ? displayValue : placeholder}
          className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 min-w-0"
        />
        {displayValue ? (
          <button type="button" onClick={clear} className="text-slate-400 hover:text-red-400 transition ml-1 flex-shrink-0">
            <FaTimes size={11} />
          </button>
        ) : (
          <FaChevronDown size={11} className={`text-slate-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
        )}
      </div>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full bg-white dark:bg-semidark border border-slate-200 dark:border-dark_border/40 rounded-xl shadow-xl overflow-hidden">
          <div className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-sm text-slate-400 dark:text-slate-500">No options found</div>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => select(opt)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${opt === displayValue
                    ? "bg-primary/10 dark:bg-cyan/10 text-primary dark:text-cyan font-semibold"
                    : "text-gray-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-darkmode"
                    }`}
                >
                  {opt}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── build Yup schema from formSchema ─── */
function buildYup(schema) {
  const shape = {};
  schema.forEach((f) => {
    if (f.type === "checkboxes") return;
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
    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 tracking-wider mb-1.5">
      {f.label}{f.required ? " *" : ""}
    </label>
  );

  if (["text", "email", "tel", "number"].includes(f.type)) {
    return (
      <div>
        <Label />
        <Field name={f.name} type={f.type} placeholder={f.placeholder} className={cls} />
        {err && <p className="text-red-500 text-xs mt-1">{err}</p>}
      </div>
    );
  }

  if (f.type === "searchable-select") {
    return (
      <div>
        <Label />
        <SearchableSelect
          field={f}
          placeholder={f.placeholder}
          options={f.options}
          setFieldValue={setFieldValue}
          error={err}
        />
        {err && <p className="text-red-500 text-xs mt-1">{err}</p>}
      </div>
    );
  }

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
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${on
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

  if (f.type === "food") {
    return (
      <div className="col-span-2">
        <Label />
        <div className="grid grid-cols-2 gap-4 mt-1">
          {[
            { value: "Veg", emoji: "🥗", label: "Vegetarian", accent: "#15803d", bg: "#f0fdf4" },
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

/* Helper function to get valid image URL */
const getProductLogo = (product) => {
  // Check for product-specific logo
  if (product.logo) {
    // If logo is a string
    if (typeof product.logo === "string") {
      return product.logo;
    }
    // If logo is an array (like the levitica-connects-u product)
    if (Array.isArray(product.logo)) {
      for (const logoPath of product.logo) {
        if (logoPath && logoPath !== "null" && logoPath !== "undefined") {
          return logoPath;
        }
      }
    }
  }
  
  // Fallback to main company logo
  return "/img/leviticalogo.png";
};

/* Helper to check if product has custom logo */
const hasCustomLogo = (product) => {
  return product.logo && product.logo !== "/img/leviticalogo.png";
};

/* ═══════════════════════ MAIN COMPONENT ═══════════════════════ */
const ProductEnquiry = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const key = Object.keys(productsData).find(
      (k) => k === slug || productsData[k].title.toLowerCase().replace(/\s+/g, "-") === slug
    );
    setProduct(key ? productsData[key] : null);
    window.scrollTo(0, 0);
    // Reset logo error when product changes
    setLogoError(false);
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
  
  // Get product-specific logo or fallback to company logo
  const productLogo = getProductLogo(product);
  const hasProductLogo = hasCustomLogo(product);
  const displayLogo = (!logoError && productLogo) ? productLogo : "/img/leviticalogo.png";

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

      const nameField = schema.find((f) => ["contactName", "hrManager", "tpoName", "ownerName", "adminName", "companyName"].includes(f.name));
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

        <div className="grid lg:grid-cols-[420px_1fr] rounded-3xl overflow-hidden shadow-2xl">

          {/* ── LEFT SIDE ── Product-specific Logo */}
          <div className="relative flex flex-col p-6 lg:p-8 overflow-hidden"
            style={{ background: "linear-gradient(145deg,#0f172a 0%,#1e3a8a 60%,#2563eb 100%)" }}>
            <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle,#38bdf8,transparent)" }} />
            <div className="absolute -bottom-20 -right-10 w-64 h-64 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle,#6366f1,transparent)" }} />

            {/* Product Logo - Shows product-specific logo, falls back to company logo */}
            <div className="relative mb-6 inline-block">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-[3px] border-white/50 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <img
                  key={productLogo} // Force re-render when logo changes
                  src={displayLogo}
                  alt={`${product.title} logo`}
                  className="w-full h-full object-fit"
                  onError={() => {
                    if (!logoError && hasProductLogo) {
                      console.warn(`Product logo failed to load: ${productLogo}`);
                      setLogoError(true);
                    }
                  }}
                />
              </div>
            </div>

            {/* Badge */}
            <span className="relative inline-block bg-white/10 border border-white/20 text-white/70 text-xs px-3 py-1 rounded-full tracking-widest mb-4 w-fit">
              {product.subtitle}
            </span>

            {/* Title */}
            <h1 className="relative text-2xl lg:text-3xl font-bold text-white leading-snug mb-3">
              {enq.heading}
            </h1>
            <p className="relative text-sm leading-relaxed text-blue-200 mb-2">{enq.tagline}</p>
            <p className="relative text-sm leading-relaxed text-slate-300 mb-6">{enq.about}</p>

            {/* What you get section */}
            <div className="relative mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-3">What you get</p>
              <div className="space-y-2.5">
                {enq.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <FaCheckCircle className="text-[#38bdf8] mt-0.5 flex-shrink-0" size={13} />
                    <span className="text-sm text-slate-200">{h.replace("✔ ", "")}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-4 border-t border-white/20"></div>

            {/* Why Choose Us Section */}
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-3">Why Choose Us</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <FaStar className="text-amber-400 mt-0.5 flex-shrink-0" size={12} />
                  <span className="text-xs text-slate-300">Trusted by 500+ Clients</span>
                </div>
                <div className="flex items-start gap-2">
                  <FaUsers className="text-emerald-400 mt-0.5 flex-shrink-0" size={12} />
                  <span className="text-xs text-slate-300">Expert Team of 100+</span>
                </div>
                <div className="flex items-start gap-2">
                  <FaClock className="text-blue-400 mt-0.5 flex-shrink-0" size={12} />
                  <span className="text-xs text-slate-300">24/7 Support Available</span>
                </div>
                <div className="flex items-start gap-2">
                  <FaShieldAlt className="text-purple-400 mt-0.5 flex-shrink-0" size={12} />
                  <span className="text-xs text-slate-300">Data Security Guaranteed</span>
                </div>
              </div>
            </div>

            {/* Testimonial / Quote */}
            <div className="relative mt-6 p-3 bg-white/5 rounded-xl border border-white/10">
              <p className="text-xs text-slate-300 italic">"Excellent service and support. Highly recommended!"</p>
              <p className="text-xs text-blue-300 mt-2">— Rajesh Sharma, CEO</p>
              <div className="flex gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} size={10} className="text-amber-400" />
                ))}
              </div>
            </div>

            {/* Contact Support */}
            <div className="relative mt-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <FaHeadset className="text-blue-300" size={14} />
              </div>
              <div>
                <p className="text-xs text-slate-300">Need help?</p>
                <p className="text-sm font-semibold text-white">hr@leviticatechnologies.com</p>
              </div>
            </div>
          </div>

          {/* ── RIGHT SIDE ── Form */}
          <div className="bg-white dark:bg-semidark p-6 lg:p-8">
            <div className="mb-6">
              <h2 className="text-xl lg:text-2xl font-bold text-midnight_text dark:text-white mb-1">{enq.formTitle}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{enq.formSubtitle}</p>
            </div>

            {submitted && (
              <div className="mb-6 flex items-start gap-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 rounded-2xl px-4 py-3 text-sm font-semibold">
                <FaCheckCircle className="text-lg mt-0.5 flex-shrink-0" />
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
                  <div className="grid grid-cols-2 gap-x-4 gap-y-4">
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

                  <div className="border-t border-slate-100 dark:border-dark_border/20 mt-6 pt-5">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-sm text-white cursor-pointer transition-all duration-300 shadow-md hover:shadow-xl active:scale-[0.98]"
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