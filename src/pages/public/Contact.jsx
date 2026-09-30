import { Link } from "react-router-dom";
import ContactUsForm from "./ContactForm";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const ContactUs = () => {
  return (
    <div className="pt-6 bg-white dark:bg-darkmode">

      {/* ================= HERO (PROPERTY STYLE) ================= */}
      <section className="bg-herobg bg-gradient-to-b from-white from-10% dark:from-darkmode to-herobg to-90% dark:to-darklight py-24 text-center border-b border-lightgray dark:border-dark_border/20">
        <div className="max-w-3xl mx-auto px-4">

          <h1 className="text-4xl md:text-5xl font-bold text-midnight_text dark:text-white">
            Contact Us
          </h1>


          <div className="mt-6 text-midnight_text dark:text-white">
            Home <span className="mx-2">›</span> Contact
          </div>

        </div>
      </section>

      {/* ================= CONTACT INFO ================= */}
      <section className="py-12 bg-white dark:bg-darkmode">
        <div className="max-w-4xl mx-auto px-4">

          <div className="flex flex-col md:flex-row justify-between items-center gap-10 text-center">

            {/* EMAIL */}
            <div className="flex flex-col items-center">
              <div className="bg-primary/20 dark:bg-cyan/10 w-14 h-14 flex items-center justify-center rounded-full mb-3">
                <FaEnvelope className="text-primary dark:text-cyan text-xl" />
              </div>

              <h4 className="font-semibold text-midnight_text dark:text-white">
                Email Us
              </h4>

              <p className="text-gray dark:text-slate-300 mt-2 text-sm max-w-xs">
                hr@leviticatechnologies.com
              </p>
            </div>

            {/* ADDRESS */}
            <div className="flex flex-col items-center">
              <div className="bg-primary/20 dark:bg-cyan/10 w-14 h-14 flex items-center justify-center rounded-full mb-3">
                <FaMapMarkerAlt className="text-primary dark:text-cyan text-xl" />
              </div>

              <h4 className="font-semibold text-midnight_text dark:text-white">
                Address
              </h4>

              <p className="text-gray dark:text-slate-300 mt-2 text-sm max-w-xs">
                4th Floor, Jain Sadguru Images Capital Park, 408, Capital Pk Rd, VIP Hills, Silicon Valley, Madhapur, Hyderabad, Telangana 500081
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ================= MAP ================= */}
      <div className="py-8 bg-white dark:bg-darkmode">
        <div className="max-w-5xl mx-auto px-4">
          <iframe
            title="Levitica Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.330780255581!2d78.3854985!3d17.4438751!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x873dde7736fdeff1%3A0x88d3af212bf885bc!2sLevitica%20Technologies%20PVT%20LTD!5e0!3m2!1sen!2sin!4v1774844621869!5m2!1sen!2sin"
            className="w-full h-[400px] rounded-lg border border-lightgray dark:border-dark_border/20"
            loading="lazy"
          ></iframe>
        </div>
      </div>

      {/* ================= FORM SECTION ================= */}
      <section className="py-20 bg-white dark:bg-darkmode">
        <div className="max-w-6xl mx-auto px-4">

          <div className="grid md:grid-cols-2 gap-10 items-center">

            {/* FORM */}
            <div>
              <h2 className="text-2xl font-bold text-midnight_text dark:text-white mb-6">
                Get Online Consultation
              </h2>

              <ContactUsForm />
            </div>

            {/* IMAGE */}
            <div className="">
              <DotLottieReact
                className="w-100 h-[360px]"
                src="/lottie/Slider.lottie"
                loop
                autoplay
              />
            </div>

          </div>

        </div>
      </section>

      {/* ================= OFFICE SECTION ================= */}
      <section className="bg-darkmode lg:py-12 py-10 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto">

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">

            <div className="md:col-span-4">
              <h2 className="text-white text-2xl md:text-3xl font-bold tracking-tight">
                Hyderabad Office
              </h2>
            </div>

            <div className="md:col-span-5">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-cyan text-base mt-1 flex-shrink-0" />
                <p className="text-white/80 text-sm md:text-base leading-relaxed">
                  4th Floor, Jain Sadguru Images Capital Park, 408, <br className="hidden sm:inline" />
                  Capital Pk Rd, VIP Hills, Silicon Valley, <br className="hidden sm:inline" />
                  Madhapur, Hyderabad, Telangana 500081
                </p>
              </div>
            </div>

            <div className="md:col-span-3 space-y-2.5 text-sm md:text-base">
              <a
                href="mailto:hr@leviticatechnologies.com"
                className="text-white hover:text-cyan transition duration-300 flex items-center gap-2.5 group"
              >
                <FaEnvelope className="text-cyan text-sm flex-shrink-0" />
                <span className="underline underline-offset-4 group-hover:text-cyan">
                  hr@leviticatechnologies.com
                </span>
              </a>

              <div className="flex items-center gap-2.5 text-white/80">
                <FaPhoneAlt className="text-cyan text-sm flex-shrink-0" />
                <span>
                  Call:{" "}
                  <a
                    href="tel:+919032503559"
                    className="text-white hover:text-cyan transition duration-300 font-medium"
                  >
                    +91 9032503559
                  </a>
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default ContactUs;