import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoplayRef = useRef(null);

  const slides = [
    {
      id: 1,
      badge: "People First • Enterprise Solutions",
      title: "Scalable IT infrastructure & digital systems",
      description: "We architect, develop, and scale secure enterprise solutions from modern web apps and mobile apps to cloud-native systems and AI-powered platforms.",
      buttonText: "Get Start Now",
      buttonLink: "/contact-us",
      lottie: "/lottie/Seo_isometric.lottie"
    },
    {
      id: 2,
      badge: "Artificial Intelligence • Development & Support",
      title: "Advanced AI Solutions & Integration Support",
      description: "Transform your operations with custom machine learning, intelligent automation, and LLM integrations, backed by our expert technical support.",
      buttonText: "Explore AI Solutions",
      buttonLink: "/services",
      lottie: "/lottie/ai human.lottie"
    },
    {
      id: 3,
      badge: "Certified Program • Project Execution",
      title: "Industrial Internships & Hands-on Workshops",
      description: "Gain real-time project experience, build portfolio-ready applications, and receive industry-recognized internship certification.",
      buttonText: "Apply for Internship",
      buttonLink: "/internships",
      lottie: "/lottie/Appointment booking.lottie"
    },
    {
      id: 4,
      badge: "Career Development • Real Projects",
      title: "Advanced Training & Career Acceleration",
      description: "Empowering next-generation developers and tech leaders with professional mentors, industry-approved curriculum, and live-project internships.",
      buttonText: "Explore Programs",
      buttonLink: "/trainings",
      lottie: "/lottie/Slider.lottie"
    }

  ];

  useEffect(() => {
    AOS.init({
      duration: 900,
      once: false,
      easing: "ease-out-cubic",
      offset: 80,
      delay: 50
    });
  }, []);

  // Force AOS update when slide changes
  useEffect(() => {
    AOS.refresh();
  }, [currentSlide]);

  // Autoplay functionality
  useEffect(() => {
    if (isPaused) {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
      return;
    }

    autoplayRef.current = setInterval(() => {
      handleNext();
    }, 3000); //3 seconds per slide

    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [isPaused, currentSlide]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const activeSlide = slides[currentSlide];

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative pt-20 md:pt-24 pb-20 bg-gradient-to-b from-white to-herobg dark:from-darkmode dark:to-darklight overflow-hidden group/hero"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-5 gap-10 items-center min-h-[480px]">

        {/* LEFT CONTENT */}
        <div className="lg:col-span-3 flex flex-col justify-center h-full">

          <span
            key={`badge-${currentSlide}`}
            data-aos="fade-up"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-sm font-medium mb-6 dark:text-white self-start"
          >
            <span className="w-2 h-2 bg-cyan text-gray-700 rounded-full animate-pulse"></span>
            {activeSlide.badge}
          </span>

          <h1
            key={`title-${currentSlide}`}
            data-aos="fade-up"
            data-aos-delay="100"
            className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-midnight_text dark:text-white min-h-[80px] sm:min-h-[120px]"
          >
            {activeSlide.title}
          </h1>

          <p
            key={`desc-${currentSlide}`}
            data-aos="fade-up"
            data-aos-delay="200"
            className="mt-6 text-lg text-gray max-w-2xl min-h-[80px]"
          >
            {activeSlide.description}
          </p>

          <div
            key={`btn-${currentSlide}`}
            data-aos="fade-up"
            data-aos-delay="300"
            className="mt-8"
          >
            <Link
              to={activeSlide.buttonLink}
              className="inline-flex items-center btn btn-primary px-8 py-3 rounded-lg font-semibold transition shadow-property hover:scale-105 transform duration-300"
            >
              {activeSlide.buttonText}
            </Link>
          </div>

          {/* STATS */}
          <div
            data-aos="fade-up"
            data-aos-delay="400"
            className="flex justify-between items-center mt-10 text-center sm:gap-8 border-t border-lightgray/30 dark:border-dark_border/20 pt-6"
          >
            <Stat value="10K+" label="Students Trained" />
            <Stat value="500+" label="Enterprise Clients" />
            <Stat value="8+" label="Years Experience" />
          </div>

        </div>

        {/* RIGHT IMAGE */}
        <div
          key={`lottie-${currentSlide}`}
          data-aos="fade-left"
          data-aos-delay="200"
          className="lg:col-span-2 relative flex justify-start w-full h-[400px] items-center"
        >
          <div className="w-full h-full flex justify-center items-center">
            {activeSlide.lottie.endsWith(".lottie") ? (
              <DotLottieReact
                src={activeSlide.lottie}
                className="w-full h-full max-w-[400px]"
                autoplay
                loop
              />
            ) : (
              <img
                src={activeSlide.lottie}
                alt={activeSlide.title}
                className="w-full h-full max-w-[400px] object-contain animate-float"
              />
            )}
          </div>

          {/* Glow Effect */}
          <div className="absolute w-72 h-72 bg-primary/20 rounded-full blur-3xl top-10 left-1/2 -translate-x-1/2 -z-10"></div>
        </div>

      </div>

      {/* Manual Navigation Chevrons */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/70 dark:bg-semidark/70 text-midnight_text dark:text-white shadow-md hover:bg-primary hover:text-white transition-all opacity-0 group-hover/hero:opacity-100 z-30"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/70 dark:bg-semidark/70 text-midnight_text dark:text-white shadow-md hover:bg-primary hover:text-white transition-all opacity-0 group-hover/hero:opacity-100 z-30"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${currentSlide === idx
              ? "w-8 bg-primary"
              : "w-2 bg-gray/40 hover:bg-gray/60"
              }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;

/* ---------------- Stats Component ---------------- */

const Stat = ({ value, label }) => {
  return (
    <div className="flex-1">
      <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">
        {value}
      </div>
      <div className="text-sm text-gray">
        {label}
      </div>
    </div>
  );
};