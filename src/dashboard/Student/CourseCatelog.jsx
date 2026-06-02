import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useGetStudentEnrolledCoursesQuery } from '@/Services/student/enrollFormServices';
import { useAddItemMutation } from '@/Services/student/cartServices';
import { Clock, BookOpen, ShoppingCart, Search, Star, TrendingUp, Terminal, CheckSquare, Cloud, Smartphone, ArrowLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { addItemToCart } from '@/features/cartSlice';
import { useCourses } from '@/hooks/useCourses';
import { motion } from 'framer-motion';

/* ============================
   HELPERS & CONSTANTS
   ============================ */

const getCourseGroup = (course) => {
  const cat = (course.category || "").toLowerCase().trim();
  if (
    cat.includes("web dev") ||
    cat.includes("web development") ||
    cat.includes("programing and full stack")
  ) {
    return "web_dev";
  }
  if (
    cat.includes("testing & da") ||
    cat.includes("software testing")
  ) {
    return "qa_testing";
  }
  if (
    cat.includes("cloud") ||
    cat.includes("aws") ||
    cat.includes("azure") ||
    cat.includes("gcp") ||
    cat.includes("devops")
  ) {
    return "cloud_tech";
  }
  if (
    cat.includes("mobile application")
  ) {
    return "mobile_app";
  }
  return "general";
};

const CATEGORY_DEFINITIONS = [
  {
    id: "web_dev",
    label: "Web Development",
    image: "/img/web-development-svgrepo-com.svg",
    gradient: "from-blue-50 to-indigo-100 dark:from-blue-950/40 dark:to-indigo-950/40 border-blue-500/10 dark:border-blue-500/20",
    description: "Build modern, responsive websites and full-stack web applications."
  },
  {
    id: "qa_testing",
    label: "Q/A Testing",
    image: "/img/automated-testing.svg",
    gradient: "from-emerald-50 to-teal-100 dark:from-emerald-950/40 dark:to-teal-950/40 border-emerald-500/10 dark:border-emerald-500/20",
    description: "Master quality assurance, automated, manual, and API testing methodologies."
  },
  {
    id: "cloud_tech",
    label: "Cloud Technology",
    image: "/img/cloud-computing-cloud-security-network-password-network-security-privacy-code-svgrepo-com.svg",
    gradient: "from-sky-50 to-cyan-100 dark:from-sky-950/40 dark:to-cyan-950/40 border-sky-500/10 dark:border-sky-500/20",
    description: "Explore cloud computing services, DevOps practices, and server infrastructure."
  },
  {
    id: "mobile_app",
    label: "Mobile Application",
    image: "/img/mobile-app.svg",
    gradient: "from-violet-50 to-purple-100 dark:from-violet-950/40 dark:to-purple-950/40 border-violet-500/10 dark:border-violet-500/20",
    description: "Design and build cross-platform mobile apps for Android and iOS devices."
  }
];

/* ============================
   COURSE CARD
============================ */

const CourseCard = ({ course, handleAdd, isAdded, isEnrolled }) => {
  const navigate = useNavigate();
  const canAddToCart = !isEnrolled && course.price > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="
        rounded-2xl overflow-hidden flex flex-col group
        bg-white border border-border shadow-property
        hover:shadow-deatail_shadow transition-all
        dark:bg-semidark dark:border-dark_border
      "
    >
      <div className="relative h-48 overflow-hidden bg-light dark:bg-darklight">
        <img
          src={course.thumbnail}
          alt={course.name}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
        />

        <span className="absolute top-3 left-3 text-xs px-3 py-1 rounded-full bg-white dark:bg-darklight text-midnight_text dark:text-white">
          {course.category}
        </span>

        {isEnrolled && (
          <span className="absolute top-3 right-3 text-xs px-3 py-1 rounded-full bg-primary text-white flex items-center gap-1">
            <Star size={12} /> Enrolled
          </span>
        )}

        {!isEnrolled && course.price === 0 && (
          <span className="absolute top-3 right-3 text-xs px-3 py-1 rounded-full bg-skyBlue text-white">
            FREE
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-lg text-midnight_text dark:text-white mb-2 line-clamp-2">
          {course.name}
        </h3>

        <p className="text-sm text-gray mb-3 line-clamp-2 flex-1">
          {course.shortdescription}
        </p>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-light dark:bg-darklight">
            <Clock size={14} className="text-primary" />
            <span className="text-xs text-gray">{course.duration}</span>
          </div>
        </div>

        <div className="border-t border-border dark:border-dark_border pt-3 mb-3">
          {course.price === 0 ? (
            <span className="text-primary font-semibold text-sm">
              Completely FREE
            </span>
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-midnight_text dark:text-white">
                ₹{course.price}
              </span>
              <span className="text-xs text-gray">one-time</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() =>
              navigate(
                isEnrolled
                  ? `/dashboard/student/mycourses/${course._id}`
                  : `/dashboard/course/${course._id}`
              )
            }
            className="
              flex-1 py-2 rounded-lg text-sm font-medium
              border border-border text-midnight_text hover:bg-light
              dark:border-dark_border dark:text-white dark:hover:bg-darklight
            "
          >
            View
          </button>

          {canAddToCart && (
            <button
              onClick={() => handleAdd(course)}
              className={`
                  flex-1 flex items-center justify-center gap-1
                  py-2 rounded-lg text-sm font-medium transition
                  ${isAdded
                  ? "btn-save"
                  : "btn-primary"
                }
                  `}
            >
              <ShoppingCart size={14} />
              {isAdded ? "Added" : "Cart"}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ============================
   CATEGORY CARD
============================ */

const CategoryCard = ({ category, count, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="
        rounded-2xl border overflow-hidden cursor-pointer flex flex-col group
        bg-white border-border shadow-property hover:shadow-deatail_shadow transition-all
        dark:bg-semidark dark:border-dark_border h-[320px]
      "
    >
      <div className={`relative h-40 flex items-center justify-center p-6 bg-gradient-to-br ${category.gradient} overflow-hidden transition-all duration-300`}>
        <img
          src={category.image}
          alt={category.label}
          className="h-32 w-auto object-contain group-hover:scale-110 transition duration-300 z-10 filter drop-shadow-md"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition duration-300" />
      </div>

      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-bold text-base text-midnight_text dark:text-white group-hover:text-primary transition-colors line-clamp-1">
            {category.label}
          </h3>
          <p className="text-xs text-gray mt-1 line-clamp-3 leading-relaxed">
            {category.description}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-border dark:border-dark_border pt-3 mt-2">
          <span className="text-xs font-semibold text-primary bg-primary/10 dark:bg-primary/20 px-2.5 py-1 rounded-full">
            {count} {count === 1 ? "Course" : "Courses"}
          </span>
          <div className="flex items-center gap-1 text-xs text-gray font-semibold group-hover:text-primary transition-colors">
            <span>Explore</span>
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ============================
   MAIN PAGE
============================ */

const CourseCatalog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [mounted, setMounted] = useState(false);

  const userId = useSelector(state => state.auth.user?.id);
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  const { data: enrolledIdsData } = useGetStudentEnrolledCoursesQuery({ type: "ids" });
  const enrolledIds = enrolledIdsData?.data || [];

  const { courses = [], isLoading } = useCourses();
  const [addItem] = useAddItemMutation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAdd = async (course) => {
    try {
      await addItem({ userId, courseId: course._id }).unwrap();
      dispatch(addItemToCart(course));
      toast.success("Added to cart!");
    } catch {
      toast.error("Failed");
    }
  };

  // Dynamic course counting for categories
  const categoryCounts = useMemo(() => {
    const counts = {
      web_dev: 0,
      qa_testing: 0,
      cloud_tech: 0,
      mobile_app: 0,
      general: 0
    };
    courses.forEach(course => {
      const group = getCourseGroup(course);
      if (counts[group] !== undefined) {
        counts[group]++;
      }
    });
    return counts;
  }, [courses]);

  // Global search filters across all courses
  const searchFilteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return courses.filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courses, searchQuery]);

  // Filter courses based on active category
  const activeCategoryCourses = useMemo(() => {
    if (!selectedCategory) return [];
    return courses.filter(c => getCourseGroup(c) === selectedCategory);
  }, [courses, selectedCategory]);

  // General courses directly visible
  const generalCourses = useMemo(() => {
    return courses.filter(c => getCourseGroup(c) === "general");
  }, [courses]);

  const activeCategoryLabel = useMemo(() => {
    return CATEGORY_DEFINITIONS.find(cat => cat.id === selectedCategory)?.label || "";
  }, [selectedCategory]);

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen space-y-8 py-6 px-4">
      {/* HEADER */}
      <motion.div
        initial={mounted ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="px-2"
      >
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <TrendingUp size={24} className="text-primary" /> Explore <span className="text-primary">Courses</span>
        </h1>
        <p className="text-sm mt-1 text-gray opacity-90">
          Learn and grow your skills
        </p>
      </motion.div>

      {/* SEARCH */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-3 text-gray" />
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search courses..."
          className="
            w-full pl-10 py-3 rounded-xl
            border border-border bg-white
            text-midnight_text
            focus:ring-2 focus:ring-primary
            dark:bg-semidark dark:border-dark_border dark:text-white
          "
        />
      </div>

      {/* MAIN VIEW AREA */}
      <div className="min-h-[500px] space-y-8">
        {isLoading ? (
          <div className="text-center text-gray py-20">
            Loading courses...
          </div>
        ) : isSearching ? (
          /* SEARCH RESULTS VIEW */
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-semibold text-midnight_text dark:text-white">
                Search Results for "{searchQuery}"
              </h2>
              <button
                onClick={() => setSearchQuery("")}
                className="text-sm text-primary hover:underline font-medium"
              >
                Clear Search
              </button>
            </div>
            {searchFilteredCourses.length === 0 ? (
              <div className="text-center text-gray py-12">
                No courses found matching "{searchQuery}".
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchFilteredCourses.map((course) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    handleAdd={handleAdd}
                    isEnrolled={enrolledIds.includes(course._id)}
                    isAdded={cartItems.some(i => i._id === course._id)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : selectedCategory ? (
          /* SELECTED CATEGORY VIEW */
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-gray px-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className="hover:text-primary transition-colors flex items-center gap-1 font-medium"
              >
                <ArrowLeft size={16} /> Catalog
              </button>
              <ChevronRight size={14} />
              <span className="text-midnight_text dark:text-white font-semibold">
                {activeCategoryLabel}
              </span>
            </div>

            <div className="px-2">
              <h2 className="text-2xl font-bold text-midnight_text dark:text-white">
                {activeCategoryLabel} Courses
              </h2>
              <p className="text-sm text-gray mt-1">
                {CATEGORY_DEFINITIONS.find(cat => cat.id === selectedCategory)?.description}
              </p>
            </div>

            {activeCategoryCourses.length === 0 ? (
              <div className="text-center text-gray py-12 bg-white dark:bg-semidark border border-border dark:border-dark_border rounded-2xl">
                No courses currently available in this category.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeCategoryCourses.map((course) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    handleAdd={handleAdd}
                    isEnrolled={enrolledIds.includes(course._id)}
                    isAdded={cartItems.some(i => i._id === course._id)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* DEFAULT VIEW (CATEGORY CARDS + GENERAL COURSES) */
          <>
            {/* CATEGORIES SECTION */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-midnight_text dark:text-white px-2">
                Browse by Category
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {CATEGORY_DEFINITIONS.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    count={categoryCounts[category.id] || 0}
                    onClick={() => setSelectedCategory(category.id)}
                  />
                ))}
              </div>
            </div>

            {/* GENERAL COURSES SECTION */}
            <div className="space-y-4 pt-4">
              <h2 className="text-xl font-bold text-midnight_text dark:text-white px-2">
                General Courses
              </h2>
              {generalCourses.length === 0 ? (
                <div className="text-center text-gray py-12 bg-white dark:bg-semidark border border-border dark:border-dark_border rounded-2xl">
                  No general courses available.
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {generalCourses.map((course) => (
                    <CourseCard
                      key={course._id}
                      course={course}
                      handleAdd={handleAdd}
                      isEnrolled={enrolledIds.includes(course._id)}
                      isAdded={cartItems.some(i => i._id === course._id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CourseCatalog;
