import { useEffect, useState } from "react";
import DetailsContent from "./DetailsContent";
import InternshipPaymentForm from "./InternshipsPaymentForm";
import { X } from "lucide-react";
import { useGetAllInternshipsDomainsQuery } from '@/Services/paymentServices/internshipsServices';


const Internships = () => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const { data, isLoading, isError } =
    useGetAllInternshipsDomainsQuery({ isActive: true });

  const domains = data?.data || [];



  /* 🔒 Prevent body scroll when mobile modal is open */
  useEffect(() => {
    if (showPaymentForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showPaymentForm]);

  /* ⌨️ Close on ESC */
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setShowPaymentForm(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div
        className="min-h-screen relative "

      >
        {/* ================= Desktop Layout ================= */}
        <div className="flex min-h-screen">
          {/* Left: Details */}
          <div className="w-full lg:max-w-5xl bg-white md:mx-auto lg:mx-1">
            <DetailsContent
              domains={domains}
              isLoading={isLoading}
              isError={isError}
              showPaymentForm={showPaymentForm}
              setShowPaymentForm={setShowPaymentForm}
            />

          </div>

          {/* Right: Payment Form (Desktop only) */}
          <aside className="hidden lg:flex lg:w-2/5  lg:bg-gradient-to-r from-[#162e66] to-[#162e66] lg:p-8 lg:relative">
            <div className="absolute top-32 right-28  w-full">
              <div className="max-w-lg mx-auto">
                <InternshipPaymentForm
                  domains={domains}
                  isLoading={isLoading}
                />

              </div>
            </div>
          </aside>
        </div>

        {/* ================= Mobile Payment Drawer ================= */}
        {showPaymentForm && (
          <div
            className="fixed inset-0 z-50 lg:hidden"
            aria-modal="true"
            role="dialog"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowPaymentForm(false)}
            />

            {/* Bottom Sheet */}
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] flex flex-col animate-slide-up">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b">

                <button
                  onClick={() => setShowPaymentForm(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                  aria-label="Close payment form"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="max-w-lg mx-auto">
                  <InternshipPaymentForm
                    domains={domains}
                    isLoading={isLoading}
                  />

                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Internships;
