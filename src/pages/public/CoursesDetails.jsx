import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import data from '@/data/data.json';
import { FaArrowRight } from "react-icons/fa";
import CourseDetails from "./DeepCourseDetails";

/* ✅ AOS */
import AOS from "aos";
import "aos/dist/aos.css";

const CourseDetail = () => {
  const { category, courseId } = useParams();

  const normalizedCategory = category?.toLowerCase().replace(/-/g, "");

  const categoryMap = {
    webdevelopment: data.webDevelopment,
    datascience: data.dataScience,
    uiuxdevelopment: data.uiuxDevelopment,
    testing: data.testing,
    cybersecurity: data.cyberSecurity,
    softskills: data.softSkills,
    appdevelopment: data.appDevelopment,
    digitalmarketing: data.digitalMarketing
  };

  const selectedCourses = categoryMap[normalizedCategory];

  const formatCategory = (str) =>
    str
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

  const selectedCourse = courseId
    ? selectedCourses?.find((course) => {
      const slug = course.path.split("/").pop().toLowerCase();
      return slug === courseId;
    })
    : null;

  /* ✅ AOS INIT */
  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-out-cubic",
      once: false,
      offset: 80,
    });
  }, []);

  return (
    <>
      <div className="pt-12 bg-white dark:bg-darkmode">

        {/* CATEGORY / LIST VIEW */}
        {!selectedCourse && (
          <>

            {/* 🔥 HERO (ONLY STYLE CHANGED) */}
            <section className="py-18 bg-gradient-to-b from-white from-10% dark:from-darkmode to-herobg to-90% dark:to-darklight text-center border-b border-lightgray dark:border-dark_border/20">
              <div className="relative max-w-4xl mx-auto px-4 text-center">

                <h1
                  data-aos="fade-up"
                  className="text-4xl md:text-5xl font-bold text-midnight_text dark:text-white"
                >
                  {courseId
                    ? formatCategory(selectedCourse?.title)
                    : formatCategory(category)}
                </h1>


              </div>
            </section>

            {/* COURSES LIST */}
            <section className="services-section bg-slate-50 dark:bg-darkmode py-24 border-b border-lightgray dark:border-dark_border/20">
              <div className="max-w-7xl mx-auto px-4">

                {/* Header */}
                <div className="flex justify-center">
                  <div className="max-w-2xl text-center mb-16">

                    <h2
                      data-aos="fade-up"
                      className="text-3xl md:text-4xl font-bold text-midnight_text dark:text-white"
                    >
                      We Provide Best Trainings
                    </h2>

                    <p
                      data-aos="fade-up"
                      data-aos-delay="100"
                      className="mt-4 text-slate-600 dark:text-slate-300"
                    >
                      Efficiently aggregate end-to-end core competencies without
                      maintainable ideas. Dynamically foster tactical solutions
                      without enabled value.
                    </p>

                  </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {selectedCourses?.map((course, index) => (
                    <div
                      key={index}
                      className="flex"
                      data-aos="fade-up"
                      data-aos-delay={index * 120}
                    >
                      <div className="bg-white dark:bg-semidark text-center p-8 rounded-2xl border border-slate-100 dark:border-dark_border/20 shadow-sm hover:shadow-xl transition w-full">
                        <img
                          src={course.img}
                          alt={course.title}
                          className="w-20 mx-auto mb-6"
                        />
                        <h5 className="font-semibold text-lg text-midnight_text dark:text-white">
                          {course.title}
                        </h5>
                        <p className="mt-3 text-slate-600 dark:text-slate-400">
                          {course.description}
                        </p>
                        <Link
                          to={course.path}
                          className="inline-flex items-center gap-2 mt-6 text-indigo-600 dark:text-cyan font-medium hover:text-indigo-700 dark:hover:underline"
                        >
                          Get More Info
                          <FaArrowRight className="text-sm" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </section>

          </>
        )}

        {/* COURSE DETAIL VIEW */}
        {selectedCourse && <CourseDetails />}
      </div>
    </>
  );
};

export default CourseDetail;