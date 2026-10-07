import { useEffect, useState } from "react";
import DetailsContent from "./DetailsContent";
import InternshipPaymentForm from "./InternshipsPaymentForm";
import { X } from "lucide-react";
import { useGetAllInternshipsDomainsQuery } from '@/Services/paymentServices/internshipsServices';
import { dummyInternshipDomains } from "./dummyDomains";


const Internships = () => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedDomainId, setSelectedDomainId] = useState("");
  const { data, isLoading, isError } =
    useGetAllInternshipsDomainsQuery({ isActive: true });

  const apiDomains = data?.data;
  const domains =
    Array.isArray(apiDomains) && apiDomains.length > 0
      ? apiDomains
      : dummyInternshipDomains;

  const hasData = Boolean(domains && domains.length > 0);



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
        {/* ================= Main Layout ================= */}
        <div className="w-full max-w-7xl mx-auto bg-white flex min-h-screen justify-center">
          <div className="w-full lg:px-8">
            <DetailsContent
              domains={domains}
              isLoading={isLoading && !hasData}
              isError={isError && !hasData}
              showPaymentForm={showPaymentForm}
              setShowPaymentForm={setShowPaymentForm}
              onInternshipClick={(id) => {
                setSelectedDomainId(id);
                setShowPaymentForm(true);
              }}
            />
          </div>
        </div>

        {/* ================= Payment Modal ================= */}
        {showPaymentForm && (
          <div
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
            aria-modal="true"
            role="dialog"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowPaymentForm(false)}
            />

            {/* Modal Content */}
            <div className="relative w-full md:w-auto md:min-w-[500px] bg-white rounded-t-3xl md:rounded-2xl max-h-[90vh] flex flex-col animate-slide-up md:animate-none md:shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-bold text-lg text-gray-800">Complete Payment</h3>
                <button
                  onClick={() => setShowPaymentForm(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                  aria-label="Close payment form"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="max-w-lg mx-auto">
                  <InternshipPaymentForm
                    domains={domains}
                    isLoading={isLoading && !hasData}
                    initialDomainId={selectedDomainId}
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
