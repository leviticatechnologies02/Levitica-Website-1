import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { coursesData } from '@/data/coursesData';

import {
  FaCheckCircle,
  FaChevronRight,
  FaQuestionCircle,
  FaClock,
  FaVideo,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

import AOS from "aos";
import "aos/dist/aos.css";

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
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
    const data = coursesData[courseId || "java-full-stack"];
    setCourse(data || null);
    setLoading(false);
  }, [courseId]);

  const toggleFAQ = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  const handleEnroll = () => {
    // Navigate to checkout page with course details
    navigate(`/login`);
  };

  const handleSubscribe = () => {
    // Add newsletter subscription logic here
    alert('Thank you for subscribing!');
  };

  if (loading) return <div className="text-center py-24">Loading...</div>;
  if (!course) return <div className="text-center py-24">Course not found.</div>;

  return (
    <div className="bg-white dark:bg-darkmode pt-10">

      {/* ===== HERO (EXACT SAME AS SERVICE) ===== */}
      <section className="relative pt-20 pb-16 bg-gradient-to-b from-white to-herobg dark:from-darkmode dark:to-darklight border-b border-lightgray dark:border-dark_border/20">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-12 items-center">

          <div className="col-span-8" data-aos="fade-right">
            <h1 className="text-4xl md:text-5xl font-bold text-midnight_text dark:text-white">
              {course.title}
            </h1>
          </div>

          <div className="col-span-4 flex justify-start md:justify-center mt-6 md:mt-0" data-aos="fade-left">
            <img
              src={course.image}
              className="w-20 h-20 rounded-full object-cover border-2 border-white dark:border-dark_border"
              alt={course.title}
            />
          </div>

        </div>
      </section>

      {/* ===== MAIN ===== */}
      <section className="py-20 bg-section dark:bg-darkmode">
        <div className="max-w-7xl mx-auto px-4">

          {/* COVER IMAGE */}
          {/* <div data-aos="zoom-in" className="mb-16 h-[350px] overflow-hidden rounded-2xl border border-lightgray dark:border-dark_border/20">
            <img src={course.image} className="w-full h-full object-cover" alt={course.title} />
          </div> */}

          <div className="flex flex-wrap -mx-4">

            {/* LEFT CONTENT */}
            <div className="w-full lg:w-8/12 px-4">
              <div className="xl:pr-10">

                {/* DESCRIPTION */}
                <p className="text-lg text-gray dark:text-slate-300 mb-10" data-aos="fade-up">
                  {course.fullDescription?.[0]}
                </p>

                {/* FEATURES → SAME AS SERVICE CARDS */}
                <h3 className="text-2xl text-slate-900 dark:text-white font-semibold mb-6" data-aos="fade-up">
                  Course Features
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  {course.features.map((f, i) => (
                    <div
                      key={i}
                      data-aos="fade-up"
                      data-aos-delay={i * 120}
                      className="bg-white dark:bg-semidark p-6 rounded-xl border border-slate-100 dark:border-dark_border/20 shadow-property hover:shadow-deatail_shadow transition"
                    >
                      <div className="flex gap-3">
                        <FaCheckCircle className="text-primary dark:text-cyan mt-1 flex-shrink-0" />
                        <span className="text-slate-800 dark:text-slate-300">{f}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* BENEFITS STYLE (reuse structure) */}
                <div className="grid md:grid-cols-2 gap-10 mt-14">

                  <div data-aos="fade-right">
                    <h4 className="font-semibold text-lg text-slate-900 dark:text-white mb-4">Duration</h4>
                    <div className="flex gap-2">
                      <FaClock className="text-primary dark:text-cyan mt-1 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">{course.duration}</span>
                    </div>
                  </div>

                  <div data-aos="fade-left">
                    <h4 className="font-semibold text-lg text-slate-900 dark:text-white mb-4">Mode</h4>
                    <div className="flex gap-2">
                      <FaVideo className="text-primary dark:text-cyan mt-1 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">{course.mode}</span>
                    </div>
                  </div>

                </div>

                {/* FAQ SAME STYLE */}
                <h3 className="mt-16 text-slate-900 dark:text-white text-xl font-semibold" data-aos="fade-up">
                  FAQs
                </h3>

                <div className="mt-6 space-y-4">
                  {course.faqs.map((faq, i) => (
                    <div
                      key={i}
                      data-aos="fade-up"
                      className="bg-light dark:bg-semidark rounded-lg border border-slate-100 dark:border-dark_border/20 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFAQ(i)}
                        className="w-full flex items-center gap-3 p-4 text-left text-slate-900 dark:text-white hover:bg-gray-50 dark:hover:bg-primary/10 transition"
                      >
                        <FaQuestionCircle className="text-primary dark:text-cyan flex-shrink-0" />
                        <span className="font-medium">{faq.question}</span>
                      </button>

                      {openIndex === i && (
                        <div className="px-4 pb-4 text-gray dark:text-slate-400 border-t border-slate-100 dark:border-gray-700 pt-3">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* ===== SIDEBAR (COPY OF SERVICE) ===== */}
            <div className="w-full lg:w-4/12 px-4 mt-12 lg:mt-0">

              <div data-aos="fade-left" className="bg-white dark:bg-semidark p-8 rounded-xl border border-slate-100 dark:border-dark_border/20 shadow-property mb-8">
                <h3 className="text-lg text-slate-900 dark:text-white font-semibold mb-4">Enroll</h3>

                <p className="text-3xl font-bold text-primary dark:text-cyan">
                  {course.price}
                </p>

                <button
                  onClick={handleEnroll}
                  className="btn btn-primary w-full mt-4 py-3 rounded-lg transition-colors"
                >
                  Enroll Now
                </button>
              </div>

              <div data-aos="fade-left" data-aos-delay="250" className="bg-light dark:bg-semidark p-6 rounded-xl mt-8 border border-slate-100 dark:border-dark_border/20 shadow-property">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Need Help?</h4>

                <div className="space-y-3 text-sm text-gray dark:text-slate-300">
                  <div className="flex gap-2 items-center">
                    <FaMapMarkerAlt className="text-primary dark:text-cyan" />
                    <span>Hyderabad, India</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <FaPhoneAlt className="text-primary dark:text-cyan" />
                    <a href="tel:+919032503559" className="hover:text-primary dark:hover:text-cyan transition">
                      +91 9032503559
                    </a>
                  </div>
                  <div className="flex gap-2 items-center">
                    <FaEnvelope className="text-primary dark:text-cyan" />
                    <a href="mailto:hr@leviticatechnologies.com" className="hover:text-primary dark:hover:text-cyan transition break-all">
                      hr@leviticatechnologies.com
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

export default CourseDetails;