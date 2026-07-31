import { Link } from "react-router-dom";
import ContactUsForm from "./ContactForm";
import { FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
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
                5th Floor, S2, C9WP+P68 Techno Park, Capital Pk Rd, VIP Hills, Hyderabad, Telangana – 500081
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
      <section className="bg-darkmode lg:py-10 py-10 px-4">
        <div className="max-w-6xl mx-auto">

          <div className="grid md:grid-cols-6 lg:grid-cols-9 gap-7 pb-2">

            <div className="col-span-3">
              <h2 className="text-white text-4xl font-bold">
                Hyderabad Office
              </h2>
            </div>

            <div className="col-span-3">
              <p className="text-white/70 text-xl">
                Techno Park, Capital Pk Rd, <br/> Hyderabad, Telangana
              </p>
            </div>

            <div className="col-span-3">
              <a href="mailto:hr@leviticatechnologies.com" className="text-white underline">
                hr@leviticatechnologies.com
              </a>

              <p className="text-white/80 mt-2">
                Call: +91 9032503559
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default ContactUs;