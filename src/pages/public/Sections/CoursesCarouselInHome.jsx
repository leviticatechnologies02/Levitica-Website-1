import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const getPosition = (index, current, total) => {
  if (index === current) return "center";
  if (index === (current - 1 + total) % total) return "left";
  if (index === (current + 1) % total) return "right";
  return "hidden";
};

const CoursesCarouselInHome = () => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const courses = [
    {
      id: 1,
      title: "MERN Stack Development",
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479",
      excerpt: "Master MongoDB, Express, React, and Node.js.",
      link: "/trainings/web-development/mern-stack-development",
    },
    {
      id: 2,
      title: "Machine Learning Fundamentals",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c",
      excerpt: "Supervised, unsupervised learning & neural networks.",
      link: "/trainings/data-science/machine-learning",
    },
    {
      id: 3,
      title: "Advanced AI & Deep Learning",
      image: "/img/ai-cloud-with-robot-head.jpg",
      excerpt: "NLP, Computer Vision, Deep Learning.",
      link: "/trainings/data-science/artificial-intelligence",
    },
    {
      id: 4,
      title: "Java Full Stack Mastery",
      image: "https://images.unsplash.com/photo-1581276879432-15e50529f34b",
      excerpt: "Spring Boot, Hibernate, REST APIs.",
      link: "/trainings/web-development/java-full-stack",
    },
    {
      id: 5,
      title: "SEO Fundamentals",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      excerpt: "SEO, keyword research, ranking strategies.",
      link: "/trainings/digital-marketing/seo-fundamentals",
    },
  ];

  /* ✅ AOS INIT */
  useEffect(() => {
    AOS.init({
      duration: 900,
      once: false,
      easing: "ease-out-cubic",
      offset: 80,
    });
  }, []);

  /* AUTO SLIDE */
  useEffect(() => {
    if (paused) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % courses.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [paused, courses.length]);

  return (
    <section className="py-14 bg-section dark:bg-darkmode overflow-hidden flex justify-center items-center">
      <div className="lg:max-w-screen-xl md:max-w-screen-md mx-auto container px-4">

        {/* HEADER */}
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-midnight_text dark:text-white">
            Explore Our Popular Courses
          </h2>
          <p className="mt-3 text-gray">
            Enhance your skills with expert-led programs
          </p>
        </div>

        {/* CAROUSEL */}
        <div
          data-aos="fade-up"
          data-aos-delay="200"
          className="relative h-[420px] flex items-center justify-center overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {courses.map((course, index) => {
            const position = getPosition(index, current, courses.length);

            return (
              <div
                key={course.id}
                className={`
                  absolute transition-all duration-700 ease-in-out
                  ${position === "center" && "z-20 scale-100 sm:scale-110 opacity-100"}
                  ${position === "left" && "z-10 -translate-x-[70%] sm:-translate-x-[100%] scale-95 opacity-60 blur-sm"}
                  ${position === "right" && "z-10 translate-x-[70%] sm:translate-x-[100%] scale-95 opacity-60 blur-sm"}
                  ${position === "hidden" && "opacity-0 pointer-events-none scale-75"}
                `}
              >
                <div className="bg-white dark:bg-semidark rounded-xl shadow-property border border-lightgray w-[280px] sm:w-[320px] overflow-hidden">

                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-44 w-full object-cover"
                  />

                  <div className="p-6">
                    <h3 className="font-semibold text-lg text-midnight_text dark:text-white">
                      {course.title}
                    </h3>

                    <p className="mt-2 text-sm text-gray">
                      {course.excerpt}
                    </p>

                    <Link
                      to={course.link}
                      className="inline-block mt-4 text-primary font-medium hover:underline"
                    >
                      Learn more →
                    </Link>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-10" data-aos="fade-up" data-aos-delay="300">
          <Link
            to="/trainings"
            className="inline-block px-6 py-3 btn btn-primary transition"
          >
            View All Courses
          </Link>
        </div>

      </div>
    </section>
  );
};

export default CoursesCarouselInHome;