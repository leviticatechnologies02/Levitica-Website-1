import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Star,
  ArrowRight,
  BookOpen,
  Zap,
  Award,
  BookOpenCheck,
  TrendingUp,
  Compass,
  Briefcase,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useCourses } from '@/hooks/useCourses';
import { useTheme } from '@/context/ThemeContext';
import { useGetAllInternshipsDomainsQuery } from '@/Services/paymentServices/internshipsServices';
import StarRating, { getCourseRatingData } from "@/dashboard/common/StarRating";

const CourseAdsCarousel = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { courses = [], isLoading } = useCourses();
  const { data: domainsResponse = { data: [] }, isLoading: internshipsLoading } = useGetAllInternshipsDomainsQuery({ isActive: true });
  const activeDomains = useMemo(() => {
    const list = domainsResponse.data || [];
    return list.slice(0, 8);
  }, [domainsResponse.data]);

  // Get dynamic student details from Redux auth
  const user = useSelector((state) => state.auth?.user);
  const firstName = user?.name ? user.name : "Learner";

  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = slide next, -1 = slide prev

  // Interactive Course Rating Modal state
  const [rateModal, setRateModal] = useState(null); // { course, rating, comment }
  const [ratingsVersion, setRatingsVersion] = useState(0);

  const handleOpenRateModal = (course, initialRating = 5) => {
    const rData = getCourseRatingData(course);
    setRateModal({
      course,
      rating: rData.userRating || initialRating || 5,
      comment: "",
    });
  };

  const handleSaveRating = (e) => {
    e.preventDefault();
    if (!rateModal) return;

    try {
      const existing = JSON.parse(localStorage.getItem("levitica_user_ratings") || "{}");
      existing[rateModal.course._id] = {
        rating: rateModal.rating,
        comment: rateModal.comment,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem("levitica_user_ratings", JSON.stringify(existing));
      setRatingsVersion((v) => v + 1);
      toast.success(`Thank you! You rated "${rateModal.course.name}" ${rateModal.rating} stars.`);
      setRateModal(null);
    } catch (err) {
      toast.error("Failed to save rating");
    }
  };

  // Rich Carousel slides configured dynamically
  const carouselSlides = useMemo(() => [
    {
      id: 1,
      title: `Hi, ${firstName}! 👋`,
      subtitle: "Ready to take the next step? Continue building your skills and career with Levitica Academy.",
      type: "welcome",
      badge: "Personal Dashboard"
    },
    {
      id: 2,
      title: "Master Communication Skills",
      subtitle: "Soft Skills Program",
      description: "Improve your confidence, communication, time management, and problem-solving skills to grow both personally and professionally.",
      price: "Free",
      originalPrice: "₹1,999",
      type: "skill",
      badge: "Recommended Skill",
      tags: ["Confidence", "Public Speaking", "Leadership"]
    },
    {
      id: 3,
      title: "Premium Internship Program",
      subtitle: "Gain Real-World Industry Experience",
      description: "Work on live projects with top companies, receive guidance from expert mentors, and secure direct placement opportunities.",
      type: "internship",
      badge: "Career Booster",
      tags: ["Live Projects", "Mentorship", "Certification"]
    },
    {
      id: 4,
      title: "Java Programming Masterclass",
      subtitle: "Complete Backend Path",
      description: "Master Java from absolute basics to advanced enterprise frameworks like Spring Boot. Includes hands-on projects and database integrations.",
      price: "₹14,999",
      originalPrice: "₹19,999",
      rating: 4.8,
      type: "course",
      badge: "Bestseller",
      tags: ["Java SE/EE", "Spring Boot", "REST APIs"]
    },
    {
      id: 5,
      title: "Azure Cloud & DevOps Specialist",
      subtitle: "Cloud Infrastructure Track",
      description: "Learn Azure administration, cloud architecture, and CI/CD pipelines. Get ready for industry certifications (AZ-900 & AZ-104).",
      price: "₹15,000",
      originalPrice: "₹20,000",
      rating: 4.7,
      type: "course",
      badge: "Cloud Track",
      tags: ["Azure Cloud", "CI/CD Pipelines", "Docker & K8s"]
    }
  ], [firstName]);

  // Autoplay countdown timer logic with pause on hover & manual reset support
  useEffect(() => {
    if (paused) return;

    const intervalTime = 50; // Update progress every 50ms
    const totalDuration = 3500; // 3.5 seconds slide duration
    const increment = (intervalTime / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [paused]);

  // Synchronize slide transition on progress completion
  useEffect(() => {
    if (progress >= 100) {
      setDirection(1);
      setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselSlides.length);
      setProgress(0);
    }
  }, [progress, carouselSlides.length]);

  // Reset progress and shift slides
  const handlePrev = () => {
    setDirection(-1);
    setProgress(0);
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  const handleNext = () => {
    setDirection(1);
    setProgress(0);
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const handleDotClick = (index) => {
    setDirection(index > currentSlide ? 1 : -1);
    setProgress(0);
    setCurrentSlide(index);
  };

  // Safe search utility to link promotional slides to actual course details
  const findCourseIdByName = (nameQuery) => {
    if (!courses.length) return null;
    const match = courses.find(c =>
      c.name.toLowerCase().includes(nameQuery.toLowerCase())
    );
    return match ? match._id : null;
  };

  const currentData = carouselSlides[currentSlide];

  // Pick up to 6 courses to display
  const randomCourses = useMemo(() => {
    if (!courses.length) return [];
    const shuffled = [...courses].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 8);
  }, [courses]);

  // Framer Motion spring transition variants
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.98
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 220, damping: 24 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 }
      }
    },
    exit: (dir) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: "spring", stiffness: 220, damping: 24 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 }
      }
    })
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <span className="text-gray font-medium text-sm">Loading premium courses...</span>
      </div>
    );
  }

  return (
    <div className="py-6 md:py-10">
      <div className="max-w-7xl mx-auto px-4">

        {/* ================= CAROUSEL SECTION ================= */}
        <div
          className="relative mb-12 group rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Futuristic Rich Backdrop Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0c1e35] via-[#102d47] to-[#0a1424] pointer-events-none" />

          {/* Subtle Grid Overlay Texture */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

          {/* Floating Glow Ambient Blobs */}
          <div className="absolute top-[-25%] left-[-10%] w-[350px] h-[350px] rounded-full bg-primary/20 blur-[90px] pointer-events-none animate-pulse duration-[8000ms]" />
          <div className="absolute bottom-[-25%] right-[-10%] w-[350px] h-[350px] rounded-full bg-cyan/15 blur-[90px] pointer-events-none animate-pulse duration-[6000ms]" />

          {/* Carousel Slide Wrapper */}
          <div className="relative min-h-[300px] md:min-h-[260px] p-8 md:p-12 flex flex-col justify-center overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentSlide}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full flex items-center justify-between"
              >
                {/* --- Welcome Slide --- */}
                {currentData.type === "welcome" && (
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 w-full text-white">
                    <div className="flex-1 space-y-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan/10 text-cyan border border-cyan/20 backdrop-blur-md">
                        <Sparkles size={12} className="animate-pulse" />
                        {currentData.badge}
                      </span>
                      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-cyan">
                        {currentData.title}
                      </h2>
                      <p className="text-base md:text-lg opacity-90 font-light max-w-xl leading-relaxed">
                        {currentData.subtitle}
                      </p>
                      <div className="pt-2">
                        <button
                          onClick={() => navigate("/dashboard/student/browsercourses")}
                          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary to-cyan text-white rounded-lg font-semibold hover:shadow-[0_0_25px_rgba(0,90,156,0.3)] transition-all duration-300 hover:scale-[1.03] active:scale-95"
                        >
                          Explore Courses <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="hidden md:flex flex-col gap-3 bg-white/5 border border-white/10 rounded-xl p-5 max-w-[280px] backdrop-blur-md">
                      <span className="text-xs text-cyan uppercase tracking-wider font-semibold flex items-center gap-1.5">
                        <TrendingUp size={14} /> Today's Motivation
                      </span>
                      <p className="text-sm italic text-white/95 leading-relaxed">
                        "The expert in anything was once a beginner. Keep learning and growing your skill set!"
                      </p>
                    </div>
                  </div>
                )}

                {/* --- Soft Skill Slide --- */}
                {currentData.type === "skill" && (
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 w-full text-white">
                    <div className="flex-1 space-y-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 backdrop-blur-md">
                        <Zap size={12} className="animate-pulse" />
                        {currentData.badge}
                      </span>
                      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-cyan">
                        {currentData.title}
                      </h2>
                      <p className="text-sm md:text-base opacity-90 max-w-xl leading-relaxed">
                        {currentData.description}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-1">
                        {currentData.tags.map((tag, i) => (
                          <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300 font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 pt-2">
                        <div className="flex flex-col">
                          <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                            {currentData.price}
                          </span>
                          <span className="text-xs line-through text-white/40">{currentData.originalPrice}</span>
                        </div>

                        <button
                          onClick={() => {
                            const cId = findCourseIdByName("Communication") || findCourseIdByName("Soft Skills");
                            if (cId) navigate(`/dashboard/course/${cId}`);
                            else navigate("/dashboard/student/browsercourses");
                          }}
                          className="px-6 py-2.5 bg-white text-midnight_text rounded-lg font-semibold hover:bg-opacity-95 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] transition-all duration-300 hover:scale-[1.03] active:scale-95"
                        >
                          Start Free
                        </button>
                        <button
                          onClick={() => navigate("/dashboard/student/browsercourses")}
                          className="px-5 py-2.5 border border-white/20 hover:border-white/50 text-white rounded-lg font-semibold hover:bg-white/5 transition-all duration-300 active:scale-95"
                        >
                          Browse Catalog
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- Internship Slide --- */}
                {currentData.type === "internship" && (
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 w-full text-white">
                    <div className="flex-1 space-y-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20 backdrop-blur-md">
                        <Award size={12} className="animate-pulse" />
                        {currentData.badge}
                      </span>
                      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-cyan">
                        {currentData.title}
                      </h2>
                      <p className="text-sm md:text-base opacity-90 max-w-xl leading-relaxed">
                        {currentData.description}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-1">
                        {currentData.tags.map((tag, i) => (
                          <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300 font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => navigate("/internships")}
                          className="group inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all duration-300 hover:scale-[1.03] active:scale-95"
                        >
                          Apply Now <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- Promotional Course Slide --- */}
                {currentData.type === "course" && (
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 w-full text-white">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan/10 text-cyan border border-cyan/20 backdrop-blur-md">
                          <BookOpen size={12} className="animate-pulse" />
                          {currentData.badge}
                        </span>
                        <span className="inline-flex items-center gap-1 text-yellow-400 text-sm font-semibold bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">
                          <Star size={13} fill="currentColor" />
                          {currentData.rating} Rating
                        </span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-cyan">
                        {currentData.title}
                      </h2>
                      <p className="text-sm md:text-base opacity-90 max-w-xl leading-relaxed">
                        {currentData.description}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-1">
                        {currentData.tags.map((tag, i) => (
                          <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300 font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 pt-2">
                        <div className="flex flex-col">
                          <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan to-blue-400">
                            {currentData.price}
                          </span>
                          <span className="text-xs line-through text-white/40">{currentData.originalPrice}</span>
                        </div>

                        <button
                          onClick={() => {
                            const cId = findCourseIdByName(currentData.title.split(" ")[0]);
                            if (cId) navigate(`/dashboard/course/${cId}`);
                            else navigate("/dashboard/student/browsercourses");
                          }}
                          className="px-6 py-2.5 bg-gradient-to-r from-primary to-cyan text-white rounded-lg font-semibold hover:shadow-[0_0_20px_rgba(70,196,255,0.4)] transition-all duration-300 hover:scale-[1.03] active:scale-95"
                        >
                          Enroll Now
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Left/Right Arrow Overlays */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-105 active:scale-95 backdrop-blur-md shadow-lg"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-105 active:scale-95 backdrop-blur-md shadow-lg"
          >
            <ChevronRight size={20} />
          </button>

          {/* Slide Countdown Loader Bar */}
          <div
            className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-cyan to-primary transition-all duration-50 ease-linear pointer-events-none"
            style={{ width: `${progress}%` }}
          />

          {/* Custom Navigation Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20">
            {carouselSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleDotClick(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${currentSlide === idx
                  ? "w-8 bg-cyan shadow-[0_0_10px_#46C4FF]"
                  : "w-2 bg-white/40 hover:bg-white/60"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* ================= INTERNSHIPS GRID SECTION ================= */}
        <div className="mt-8 mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-lightgray/40 dark:border-dark_border/30 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-midnight_text dark:text-white flex items-center gap-2">
                <Briefcase className="text-primary animate-pulse" size={24} />
                Explore Premium Internships
              </h2>
              <p className="text-sm text-gray mt-1">Boost your career with certified industrial internships and live project execution</p>
            </div>

            <button
              onClick={() => navigate("/internships")}
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-skyBlue transition-colors group"
            >
              View all internships
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {internshipsLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2">
              <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <span className="text-gray text-xs font-medium">Loading internships...</span>
            </div>
          ) : activeDomains.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
            >
              {activeDomains.map((domain, index) => {
                // Find lowest fee
                const lowestFee = domain.durations && domain.durations.length > 0
                  ? Math.min(...domain.durations.map(d => d.fee))
                  : 0;

                // Pick a gradient based on the domain index for visual diversity
                const gradients = [
                  "from-blue-500 to-cyan-400",
                  "from-violet-500 to-purple-400",
                  "from-emerald-500 to-teal-400",
                  "from-amber-500 to-orange-400",
                  "from-pink-500 to-rose-400",
                  "from-indigo-500 to-blue-400"
                ];
                const cardGradient = gradients[index % gradients.length];

                return (
                  <motion.div
                    key={domain._id}
                    variants={cardVariants}
                    whileHover={{
                      y: -8,
                      scale: 1.02,
                      boxShadow: isDark
                        ? "rgba(10, 25, 47, 0.4) 0px 12px 30px"
                        : "rgba(104, 117, 141, 0.18) 0px 12px 30px"
                    }}
                    className="
                      bg-white dark:bg-semidark
                      rounded-2xl shadow-property
                      border border-lightgray/60 dark:border-dark_border/50
                      overflow-hidden
                      transition-all duration-300
                      flex flex-col
                      group/icard
                      h-[380px]
                    "
                  >
                    {/* Header Banner */}
                    <div className={`relative h-28 bg-gradient-to-r ${cardGradient} p-4 flex flex-col justify-between overflow-hidden shrink-0`}>
                      {/* Decorative Background Circles */}
                      <div className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-white/10" />
                      <div className="absolute right-12 top-[-10px] w-12 h-12 rounded-full bg-white/10" />

                      {/* Level Badge */}
                      <span className="self-start text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-white/20 text-white backdrop-blur-md border border-white/15">
                        {domain.level || "Industrial"}
                      </span>

                      {/* Floating Briefcase Icon */}
                      <div className="absolute right-4 bottom-4 p-2.5 rounded-xl bg-white/25 text-white backdrop-blur-md shadow-sm">
                        <Briefcase size={20} />
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex flex-col justify-between flex-grow">
                      <div>
                        {/* Title */}
                        <h3 className="
                          font-bold text-sm text-midnight_text dark:text-white
                          line-clamp-2 min-h-[40px] leading-snug group-hover/icard:text-primary transition-colors
                        ">
                          {domain.name}
                        </h3>

                        {/* Focus / Technologies */}
                        <p className="
                          mt-2 text-xs text-gray/90 dark:text-slate-400
                          line-clamp-2 min-h-[32px] leading-relaxed
                        ">
                          <span className="font-semibold text-midnight_text dark:text-white">Focus:</span> {domain.focus}
                        </p>

                        {/* Duration Pill Items */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {domain.durations && domain.durations.slice(0, 2).map((d, i) => (
                            <span key={i} className="text-[10px] font-medium text-gray dark:text-slate-400 bg-light dark:bg-darklight/60 px-2.5 py-1 rounded-md">
                              {d.days}d program
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Footer Info & Action */}
                      <div className="mt-4 pt-3 border-t border-lightgray/40 dark:border-dark_border/20 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-gray uppercase tracking-wider font-semibold">Starting at</span>
                          <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                            ₹{lowestFee.toLocaleString()}
                          </span>
                        </div>

                        <button
                          onClick={() => navigate("/internships")}
                          className="
                            inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg
                            bg-primary text-white hover:bg-opacity-95 hover:shadow-md
                            text-xs font-semibold shadow-sm transition-all duration-300
                          "
                        >
                          Apply Now
                          <ArrowRight size={13} className="group-hover/icard:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-semidark border border-lightgray/50 dark:border-dark_border/30 rounded-xl">
              <Award size={36} className="mx-auto text-gray mb-3" />
              <p className="text-sm text-gray font-medium">No active internships available right now.</p>
            </div>
          )}
        </div>

        {/* ================= COURSE GRID SECTION ================= */}
        <div className="mt-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-lightgray/40 dark:border-dark_border/30 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-midnight_text dark:text-white flex items-center gap-2">
                <Compass className="text-primary animate-spin-slow" size={24} />
                Explore Recommended Courses
              </h2>
              <p className="text-sm text-gray mt-1">Pick up where you left off or start something new</p>
            </div>

            <button
              onClick={() => navigate("/dashboard/student/browsercourses")}
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-skyBlue transition-colors group"
            >
              Browse all courses
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {randomCourses.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
            >
              {randomCourses.map((course) => {
                const isFree = course.price === 0;
                const ratingData = getCourseRatingData(course);

                return (
                  <motion.div
                    key={course._id}
                    variants={cardVariants}
                    whileHover={{
                      y: -6,
                      scale: 1.02,
                      boxShadow: isDark
                        ? "rgba(0, 90, 156, 0.2) 0px 10px 25px"
                        : "rgba(104, 117, 141, 0.18) 0px 10px 25px"
                    }}
                    className="
                      bg-white dark:bg-semidark
                      rounded-xl shadow-property
                      border border-lightgray/60 dark:border-dark_border/50
                      overflow-hidden
                      transition-all duration-300
                      flex flex-col
                      group/card
                    "
                  >
                    {/* Course Thumbnail */}
                    <div className="relative h-36 w-full overflow-hidden bg-slate-200">
                      <img
                        src={course.thumbnail}
                        alt={course.name}
                        className="h-full w-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Course Info */}
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="
                        font-bold text-sm text-midnight_text dark:text-white
                        line-clamp-2 min-h-[40px] leading-snug group-hover/card:text-primary transition-colors
                      ">
                        {course.name}
                      </h3>
                      <p className="
                        mt-1.5 text-xs text-gray/95 dark:text-slate-400
                        line-clamp-2 min-h-[32px] leading-relaxed
                      ">
                        {course.shortdescription}
                      </p>

                      {/* Accurate Star Rating with fractional fill and interactive rating */}
                      <div className="flex items-center justify-between gap-1 mt-3">
                        <StarRating
                          rating={ratingData.rating}
                          reviewsCount={ratingData.reviewsCount}
                          userRating={ratingData.userRating}
                          interactive={true}
                          onRate={(stars) => handleOpenRateModal(course, stars)}
                          size={12}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenRateModal(course, ratingData.userRating || 5);
                          }}
                          className="text-[10px] font-semibold text-primary hover:underline cursor-pointer"
                          title="Click to rate this course"
                        >
                          {ratingData.userRating ? "Edit" : "Rate"}
                        </button>
                      </div>

                      <div className="mt-3 pt-3 border-t border-lightgray/40 dark:border-dark_border/20 flex items-center justify-between">
                        <span className="text-sm font-black text-midnight_text dark:text-white">
                          {isFree ? "Free Course" : `₹${Number(course.price).toLocaleString('en-IN')}`}
                        </span>

                        <button
                          onClick={() => navigate(`/dashboard/course/${course._id}`)}
                          className="
                            inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg
                            bg-primary/10 text-primary hover:bg-primary hover:text-white
                            text-xs font-semibold transition-all duration-300
                          "
                          title={isFree ? "Start Learning" : "Enroll Now"}
                        >
                          {isFree ? "Start Learning" : "Enroll Now"}
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-semidark border border-lightgray/50 dark:border-dark_border/30 rounded-xl">
              <BookOpenCheck size={36} className="mx-auto text-gray mb-3" />
              <p className="text-sm text-gray font-medium">No recommended courses available right now.</p>
            </div>
          )}
        </div>

      </div>

      {/* Interactive Course Rating Modal */}
      <AnimatePresence>
        {rateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-md rounded-2xl border shadow-2xl p-6 ${isDark ? "bg-semidark border-dark_border text-white" : "bg-white border-border text-midnight_text"
                }`}
            >
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-border/40">
                <div>
                  <h3 className="font-bold text-base">Rate Course</h3>
                  <p className="text-xs text-gray line-clamp-1 mt-0.5">{rateModal.course?.name}</p>
                </div>
                <button
                  onClick={() => setRateModal(null)}
                  className="p-1 rounded-lg text-gray hover:text-white hover:bg-white/10 transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveRating} className="space-y-4 pt-4">
                <div className="text-center py-2 space-y-2">
                  <p className="text-xs text-gray font-medium">Click on the stars to set your rating:</p>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((starValue) => {
                      const isFilled = starValue <= rateModal.rating;
                      return (
                        <button
                          key={starValue}
                          type="button"
                          onClick={() => setRateModal((prev) => ({ ...prev, rating: starValue }))}
                          className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                        >
                          <Star
                            size={28}
                            className={
                              isFilled
                                ? "text-amber-400 fill-amber-400 transition-colors drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]"
                                : "text-slate-300 dark:text-slate-600 fill-slate-200 dark:fill-slate-700/50"
                            }
                          />
                        </button>
                      );
                    })}
                  </div>
                  <span className="inline-block text-xs font-bold text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                    {rateModal.rating}.0 / 5.0 Stars
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray mb-1.5">
                    Feedback / Review Comment (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={rateModal.comment}
                    onChange={(e) => setRateModal((prev) => ({ ...prev, comment: e.target.value }))}
                    placeholder="Tell us what you liked about this course..."
                    className={`w-full p-3 rounded-xl text-xs border outline-none transition ${isDark
                      ? "bg-darklight border-dark_border text-white focus:border-primary placeholder-gray"
                      : "bg-light border-border text-midnight_text focus:border-primary placeholder-gray"
                      }`}
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setRateModal(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray hover:text-white transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-semibold btn-primary shadow-md hover:shadow-lg transition cursor-pointer"
                  >
                    Submit Rating
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseAdsCarousel;