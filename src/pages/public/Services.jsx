import { useEffect } from "react";
import data from "@/data/services.json";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const Services = () => {

  /* AOS INIT */
  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-out-cubic",
      once: false,
      offset: 80,
    });
  }, []);

  return (
    <div className="bg-white dark:bg-darkmode pt-20">

      {/* ================= HERO (PROPERTY STYLE) ================= */}
      <section className="relative py-14 bg-gradient-to-b from-white from-10% dark:from-darkmode to-herobg to-90% dark:to-darklight border-b border-lightgray dark:border-dark_border/20">

        <div className="lg:max-w-screen-xl md:max-w-screen-md mx-auto px-4 text-center">

          <h1
            data-aos="fade-up"
            className="text-[32px] md:text-[48px] font-bold text-midnight_text dark:text-white leading-[1.2]"
          >
            Our Services
          </h1>

          <p
            data-aos="fade-up"
            data-aos-delay="100"
            className="mt-4 text-gray dark:text-slate-300 max-w-2xl mx-auto text-base md:text-lg"
          >
            We offer a wide range of services to meet the needs of our clients.
          </p>

          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="mt-6 flex justify-center items-center gap-2 text-sm text-gray dark:text-slate-400"
          >
            <Link to="/" className="hover:text-primary dark:hover:text-cyan transition">
              Home
            </Link>

            <span>›</span>

            <span className="text-midnight_text dark:text-white font-medium">
              Services
            </span>
          </div>

        </div>
      </section>

      {/* ================= SERVICES SECTION ================= */}
      <section className="bg-section dark:bg-darkmode py-24 flex justify-center items-center">
        <div className="lg:max-w-screen-xl md:max-w-screen-md mx-auto container px-4">

          {/* HEADER */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2
              data-aos="fade-up"
              className="text-3xl md:text-4xl font-bold text-midnight_text dark:text-white"
            >
              We Provide Best Services
            </h2>

            <p
              data-aos="fade-up"
              data-aos-delay="100"
              className="mt-4 text-gray dark:text-slate-300"
            >
              Efficiently aggregate end-to-end core competencies without maintainable ideas. Dynamically foster tactical solutions without enabled value.
            </p>
          </div>

          {/* GRID */}
          <div className="flex flex-wrap justify-center gap-8">

            {data?.services.map((service, index) => (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 120}
                className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] flex"
              >
                <div className="w-full group bg-white dark:bg-semidark rounded-xl p-6 shadow-property border border-lightgray dark:border-dark_border/20 hover:shadow-deatail_shadow transition flex flex-col">

                  {/* IMAGE */}
                  <img
                    src={service.img}
                    alt={service.title}
                    className="w-20 h-20 object-contain mb-6"
                  />

                  {/* TITLE */}
                  <h5 className="text-lg font-semibold text-midnight_text dark:text-white">
                    {service.title}
                  </h5>

                  {/* DESCRIPTION */}
                  <p className="mt-3 text-gray dark:text-slate-400 flex-grow">
                    {service.description}
                  </p>

                  {/* CTA */}
                  <Link
                    to={service.path}
                    className="mt-6 inline-flex items-center gap-2 text-primary dark:text-cyan font-medium hover:underline cursor-pointer"
                  >
                    Get More Info
                    <FaArrowRight className="text-sm group-hover:translate-x-1 transition" />
                  </Link>

                </div>
              </div>
            ))}

          </div>

        </div>
      </section>

    </div>
  );
};

export default Services;