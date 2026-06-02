import React, { useEffect, useState } from "react";
import { contactInfo, servicesData } from '@/data/servicesData';
import { useNavigate, useParams } from "react-router-dom";
import {
  FaCode,
  FaMobileAlt,
  FaCloud,
  FaServer,
  FaShieldAlt,
  FaBug,
  FaBrain,
  FaCheckCircle,
  FaChevronRight,
  FaQuestionCircle,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebook,
  FaLinkedinIn,
  FaRobot,
} from "react-icons/fa";

import AOS from "aos";
import "aos/dist/aos.css";
import { FaXTwitter } from "react-icons/fa6";

const iconMap = {
  Code: FaCode,
  Smartphone: FaMobileAlt,
  Cloud: FaCloud,
  ServerCog: FaServer,
  ShieldCheck: FaShieldAlt,
  Bug: FaBug,
  Brain: FaBrain,
  Robot: FaRobot,
};

const ServiceDetails = () => {
  const { serviceName } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-out-cubic",
      once: false,
      offset: 80,
    });
  }, []);

  useEffect(() => {
    const serviceData = servicesData[serviceName];
    setService(serviceData || null);
    setLoading(false);
  }, [serviceName]);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) return <div className="text-center py-24">Loading...</div>;
  if (!service) return <div className="text-center py-24">Service not found.</div>;

  return (
    <div className="bg-white dark:bg-darkmode pt-10">

      {/* HERO */}
      <section className="relative pt-20 md:pt-36 pb-16 bg-gradient-to-b from-white to-herobg dark:from-darkmode dark:to-darklight border-b border-lightgray dark:border-dark_border/20">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-12 items-center">

          <div className="col-span-8" data-aos="fade-right">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-midnight_text dark:text-white">
              {service.title}
            </h1>
          </div>

          <div className="col-span-4 flex justify-start md:justify-center mt-6 md:mt-0" data-aos="fade-left">
            <img
              src={service.image}
              alt={service.title}
              className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-white dark:border-dark_border"
            />
          </div>

        </div>
      </section>

      {/* MAIN */}
      <section className="py-20 bg-section dark:bg-darkmode">
        <div className="max-w-7xl mx-auto px-4">

          {/* COVER IMAGE */}
          <div
            className="mb-16 h-[350px] md:h-[450px] overflow-hidden rounded-2xl border border-lightgray dark:border-dark_border/20"
            data-aos="zoom-in"
          >
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-wrap -mx-4">

            {/* LEFT CONTENT */}
            <div className="w-full lg:w-8/12 px-4">
              <div className="xl:pr-10">

                {/* DESCRIPTION */}
                <p className="text-base md:text-md text-gray-600 dark:text-slate-300 leading-relaxed mb-10" data-aos="fade-up">
                  {service.description}
                </p>

                {/* OFFERINGS */}
                <h3 className="text-xl md:text-3xl font-bold text-midnight_text dark:text-white mb-6" data-aos="fade-up">
                  Our Service Offerings
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  {service.serviceTypes.map((type, index) => {
                    const Icon = iconMap[type.icon];
                    return (
                      <div
                        key={index}
                        data-aos="fade-up"
                        data-aos-delay={index * 120}
                        className="bg-white dark:bg-semidark p-6 rounded-xl border border-slate-100 dark:border-dark_border/20 shadow-property hover:shadow-deatail_shadow transition animate-fade-in"
                      >
                        <div className="flex gap-4">
                          {Icon && <Icon className="text-primary dark:text-cyan text-2xl md:text-3xl flex-shrink-0 mt-1" />}
                          <div>
                            <h5 className="font-semibold text-lg md:text-xl text-midnight_text dark:text-white mb-2">
                              {type.name}
                            </h5>
                            <p className="text-sm md:text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
                              {type.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* BENEFITS + INDUSTRIES */}
                <div className="grid md:grid-cols-2 gap-10 mt-14">

                  <div data-aos="fade-right">
                    <h4 className="font-bold text-xl md:text-2xl text-midnight_text dark:text-white mb-5">
                      Key Benefits
                    </h4>
                    {service.benefits.map((b, i) => (
                      <div key={i} className="flex gap-3 mb-3">
                        <FaCheckCircle className="text-primary dark:text-cyan mt-1 flex-shrink-0" size={16} />
                        <span className="text-sm md:text-base text-gray-700 dark:text-slate-300">{b}</span>
                      </div>
                    ))}
                  </div>

                  <div data-aos="fade-left">
                    <h4 className="font-bold text-xl md:text-2xl text-midnight_text dark:text-white mb-5">
                      Industries We Serve
                    </h4>
                    {service.industries.map((i, idx) => (
                      <div key={idx} className="flex gap-3 mb-3">
                        <FaCheckCircle className="text-primary dark:text-cyan mt-1 flex-shrink-0" size={16} />
                        <span className="text-sm md:text-base text-gray-700 dark:text-slate-300">{i}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* FAQ */}
                <h3 className="mt-16 text-2xl md:text-3xl font-bold text-midnight_text dark:text-white" data-aos="fade-up">
                  Frequently Asked Questions
                </h3>

                <div className="mt-6 space-y-4">
                  {service.faqs.map((faq, index) => (
                    <div
                      key={index}
                      data-aos="fade-up"
                      data-aos-delay={index * 80}
                      className="bg-light dark:bg-semidark rounded-lg overflow-hidden border border-slate-100 dark:border-dark_border/20"
                    >
                      <button
                        onClick={() => toggleFAQ(index)}
                        className="w-full flex items-center gap-3 p-4 md:p-5 text-left font-medium text-base md:text-lg text-midnight_text dark:text-white hover:bg-primary/5 dark:hover:bg-primary/10 transition"
                      >
                        <FaQuestionCircle className="text-primary dark:text-cyan text-lg md:text-xl flex-shrink-0" />
                        <span>{faq.question}</span>
                      </button>

                      {openIndex === index && (
                        <div className="px-4 md:px-5 pb-4 md:pb-5 text-sm md:text-base text-gray-600 dark:text-slate-400 leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-3">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* SIDEBAR */}
            <div className="w-full lg:w-4/12 px-4 mt-12 lg:mt-0">

              {/* SHARE */}
              <div data-aos="fade-left" className="bg-white dark:bg-semidark p-6 md:p-8 rounded-xl border border-slate-100 dark:border-dark_border/20 shadow-property mb-8">
                <h3 className="text-xl md:text-2xl font-bold text-midnight_text dark:text-white mb-5">Share This Service</h3>
                <div className="flex flex-col gap-3 text-white text-sm md:text-base">
                  <button className="bg-[#526fa3] hover:bg-[#3b5998] p-3 rounded-lg flex items-center gap-2 transition cursor-pointer">
                    <FaFacebook size={18} />
                    <span>Facebook</span>
                  </button>
                  <button className="bg-[#46C4FF] hover:bg-[#1DA1F2] p-3 rounded-lg flex items-center gap-2 transition cursor-pointer">
                    <FaXTwitter size={18} />
                    <span>Twitter</span>
                  </button>
                  <button className="bg-[#3C86AD] hover:bg-[#0077B5] p-3 rounded-lg flex items-center gap-2 transition cursor-pointer">
                    <FaLinkedinIn size={18} />
                    <span>LinkedIn</span>
                  </button>
                </div>
              </div>

              {/* CONTACT */}
              <div data-aos="fade-left" data-aos-delay="250" className="bg-light dark:bg-semidark p-6 md:p-8 rounded-xl border border-slate-100 dark:border-dark_border/20 shadow-property">
                <h4 className="font-bold text-xl md:text-2xl text-midnight_text dark:text-white mb-5">
                  Need Help?
                </h4>

                <div className="space-y-4 text-sm md:text-base text-gray-700 dark:text-slate-300">
                  <div className="flex gap-3 items-start">
                    <FaMapMarkerAlt className="mt-1 text-primary dark:text-cyan flex-shrink-0" size={18} />
                    <span>{contactInfo.address}</span>
                  </div>
                  <div className="flex gap-3 items-center">
                    <FaPhoneAlt className="text-primary dark:text-cyan flex-shrink-0" size={16} />
                    <a href={`tel:${contactInfo.phone}`} className="hover:text-primary dark:hover:text-cyan transition">
                      {contactInfo.phone}
                    </a>
                  </div>
                  <div className="flex gap-3 items-center">
                    <FaEnvelope className="text-primary dark:text-cyan flex-shrink-0" size={16} />
                    <a href={`mailto:${contactInfo.email}`} className="hover:text-primary dark:hover:text-cyan transition break-all">
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default ServiceDetails;