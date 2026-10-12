import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {
  FiEdit,
  FiShoppingCart,
  FiClock,
  FiTag,
  FiCheckCircle,
  FiVideo,
  FiAward,
  FiImage,
  FiBookOpen,
  FiChevronDown,
  FiChevronUp,
  FiTarget,
  FiShare2,
  FiPlayCircle,
  FiFileText,
  FiArrowLeft,
  FiLayers,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useAddItemMutation } from '@/Services/student/cartServices';
import { useGetCourseByIdQuery } from '@/Services/sharedServices/courses.Services';
import { MODAL_TYPES, useModal } from '@/dashboard/Admin/Modals/ModalContext';
import { addItemToCart } from '@/features/cartSlice';
import RelatedCourses from "./RelatedCourses";

const CommonCourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openModal } = useModal();
  const dispatch = useDispatch();
  const [expandedWeeks, setExpandedWeeks] = useState([]);

  const { data, isLoading } = useGetCourseByIdQuery(id);
  const course = data?.data;

  const role = useSelector((state) => state.auth.user?.role);
  const userId = useSelector((state) => state.auth.user?.id);

  const [addItem] = useAddItemMutation();

  const handleAdd = async () => {
    if (!userId) {
      toast.error("Please login to add items to cart");
      return;
    }
    try {
      await addItem({ userId, courseId: course._id }).unwrap();
      dispatch(addItemToCart(course));
      toast.success("Added to cart!");
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const handleEdit = () => {
    openModal(MODAL_TYPES.EDIT_COURSE_DETAILS, {
      courseId: course._id,
      initialData: details,
    });
  };

  const toggleWeek = (weekIndex) => {
    setExpandedWeeks(prev =>
      prev.includes(weekIndex)
        ? prev.filter(i => i !== weekIndex)
        : [...prev, weekIndex]
    );
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-section dark:bg-darkmode">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-border dark:border-dark_border border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-primary rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-section dark:bg-darkmode">
        <div className="text-center space-y-4">
          <div className="text-6xl">😕</div>
          <h2 className="text-2xl font-bold text-midnight_text dark:text-white">
            Course Not Found
          </h2>
          <p className="text-gray dark:text-gray-400">
            The course you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const details = course.details || {};
  const totalSessions =
    details.curriculum?.reduce(
      (acc, week) => acc + (week.sessions?.length || 0),
      0
    ) || 0;

  const totalHours =
    details.curriculum?.reduce(
      (acc, week) => acc + (parseInt(week.duration) || 2),
      0
    ) || 0;

  return (
    <div className="px-2">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {role === "mentor" && (
          <button
            onClick={() => navigate("/dashboard/mentor/courses")}
            className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline mb-6 cursor-pointer"
          >
            <FiArrowLeft size={14} /> Back to My Assigned Programs
          </button>
        )}
        
        {/* Hero Section - Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-6 ">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-midnight_text dark:text-white">
              {course.name}
            </h1>

            <p className="text-lg leading-relaxed text-gray dark:text-gray-300">
              {course?.shortdescription || "An comprehensive course designed to take you from beginner to expert."}
            </p>

            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-light dark:bg-darklight rounded-full text-sm font-medium border border-border dark:border-dark_border text-midnight_text dark:text-white">
                <FiTag size={16} /> {course.category}
              </span>
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-light dark:bg-darklight rounded-full text-sm font-medium border border-border dark:border-dark_border text-midnight_text dark:text-white">
                <FiClock size={16} /> {course.duration}
              </span>
            </div>

            <div className="border-t border-border dark:border-dark_border pt-6">
              {Number(course.price) === 0 ? (
                <div className="space-y-2 bg-light dark:bg-darklight p-5 border border-border dark:border-dark_border rounded-xl">
                  <span className="text-xl font-bold text-primary">
                    🎉 Free Course
                  </span>
                  <p className="text-md text-gray dark:text-gray-300">
                    This course is completely free when you enroll in or purchase any
                    other paid course.
                  </p>
                  <p className="text-base text-gray dark:text-gray-400">
                    • No additional charges
                  </p>
                </div>
              ) : (
                <div className="bg-light dark:bg-darklight p-5 border border-border dark:border-dark_border rounded-xl">
                  <h3 className="text-lg font-semibold mb-4 text-midnight_text dark:text-white">
                    What's Included
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 bg-white dark:bg-darkmode text-primary p-2 sm:p-3 rounded-lg">
                        <FiVideo className="text-base sm:text-lg" />
                      </div>
                      <div>
                        <p className="text-sm sm:text-base font-semibold text-midnight_text dark:text-white">
                          Live Interactive Classes
                        </p>
                        <p className="text-xs sm:text-sm text-gray dark:text-gray-400">
                          Attend real-time sessions with expert mentors.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 bg-white dark:bg-darkmode text-primary p-2 sm:p-3 rounded-lg">
                        <FiAward className="text-base sm:text-lg" />
                      </div>
                      <div>
                        <p className="text-sm sm:text-base font-semibold text-midnight_text dark:text-white">
                          Free Soft Skills Course
                        </p>
                        <p className="text-xs sm:text-sm text-gray dark:text-gray-400">
                          Communication, interview prep & personality development included.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Price Card */}
          <div className="lg:mt-0">
            <div className="bg-white dark:bg-semidark rounded-2xl border border-border dark:border-dark_border overflow-hidden sticky top-24">
              <div className="relative h-48 bg-gradient-to-br from-gray-900 to-gray-800">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FiImage size={48} className="text-gray-500" />
                  </div>
                )}
                <button className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <FiPlayCircle className="w-8 h-8 text-primary" />
                  </div>
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray dark:text-gray-400">Course Price</span>
                  {Number(course.price) > 0 && (
                    <span className="text-xs bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                      Includes GST
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-2 mb-5">
                  {Number(course.price) === 0 ? (
                    <>
                      <span className="text-4xl font-bold text-primary">Free</span>
                      <span className="text-sm text-gray dark:text-gray-400">• No payment required</span>
                    </>
                  ) : (
                    <>
                      <span className="text-4xl font-bold text-midnight_text dark:text-white">
                        ₹{Number(course.price).toLocaleString('en-IN')}
                      </span>
                      <span className="text-sm text-gray dark:text-gray-400">+ taxes</span>
                    </>
                  )}
                </div>

                <div className="space-y-3">
                  {role === "admin" || role === "superadmin" ? (
                    <button
                      onClick={handleEdit}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 btn-primary rounded-xl transition-colors duration-200 font-medium"
                    >
                      <FiEdit size={18} /> Edit Course Details
                    </button>
                  ) : role === "mentor" ? (
                    <div className="space-y-3">
                      <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center space-y-1">
                        <span className="text-xs font-bold text-indigo-400 flex items-center justify-center gap-1.5">
                          <FiCheckCircle size={15} /> You are an Assigned Mentor
                        </span>
                        <p className="text-[11px] text-gray dark:text-gray-400">
                          Assigned by Super Admin to teach and evaluate cohorts in this program.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => navigate("/dashboard/mentor/batches")}
                          className="inline-flex items-center justify-center gap-2 px-3 py-2.5 btn-primary rounded-xl text-xs font-semibold cursor-pointer"
                        >
                          <FiLayers size={14} /> My Batches
                        </button>
                        <button
                          onClick={() => navigate(`/dashboard/mentor/assignments?courseId=${course._id}`)}
                          className="inline-flex items-center justify-center gap-2 px-3 py-2.5 border border-border dark:border-dark_border rounded-xl text-xs font-semibold hover:bg-light dark:hover:bg-darklight text-midnight_text dark:text-white cursor-pointer"
                        >
                          <FiBookOpen size={14} /> Assignments
                        </button>
                      </div>
                      <button
                        onClick={handleShare}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-border dark:border-dark_border rounded-xl text-xs font-semibold hover:bg-light dark:hover:bg-darklight text-gray-600 dark:text-gray-400 hover:text-primary transition-colors cursor-pointer"
                      >
                        <FiShare2 size={14} /> Share Course Link
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleAdd}
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 btn-primary rounded-xl transition-colors duration-200 font-medium"
                      >
                        <FiShoppingCart size={18} /> Add to Cart
                      </button>
                      <button
                        onClick={handleShare}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 border border-border dark:border-dark_border rounded-xl hover:bg-light dark:hover:bg-darklight text-gray-600 dark:text-gray-400 hover:text-primary transition-colors duration-200"
                      >
                        <FiShare2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section - Clean, no card styling */}
        {details?.description && (
          <div className="mt-10 pt-6 border-t border-border dark:border-dark_border">
            <h2 className="text-xl md:text-2xl font-bold text-midnight_text dark:text-white mb-4">
              Course Description
            </h2>
            <p className="text-gray dark:text-gray-300 leading-relaxed">
              {details.description}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2  ">
          {/* Objectives Section */}
          {details?.objectives?.length > 0 && (
            <div className="mt-10 pt-6 border-t border-border dark:border-dark_border">
              <div className="flex items-center gap-3 mb-5">
                <FiTarget className="text-primary" size={22} />
                <h2 className="text-xl md:text-2xl font-bold text-midnight_text dark:text-white">
                  What you'll learn
                </h2>
              </div>
              <ul className="space-y-3">
                {details.objectives.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <FiCheckCircle className="text-primary mt-0.5 flex-shrink-0" size={18} />
                    <span className="text-gray dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements Section */}
          {details?.requirements?.length > 0 && (
            <div className="mt-10 pt-6 border-t border-border dark:border-dark_border">
              <div className="flex items-center gap-3 mb-5">
                <FiFileText className="text-primary" size={22} />
                <h2 className="text-xl md:text-2xl font-bold text-midnight_text dark:text-white">
                  Requirements
                </h2>
              </div>
              <ul className="space-y-3">
                {details.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></span>
                    <span className="text-gray dark:text-gray-300">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Curriculum Section */}
        {details?.curriculum?.length > 0 && (
          <div className="mt-10 pt-6 border-t border-border dark:border-dark_border">
            <div className="flex items-center gap-3 mb-5">
              <FiBookOpen className="text-primary" size={22} />
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-midnight_text dark:text-white">
                  Course Curriculum
                </h2>
                <p className="text-sm text-gray dark:text-gray-400">
                  {details.curriculum.length} weeks • {totalSessions} sessions • {totalHours}+ hours
                </p>
              </div>
            </div>

            <div className="space-y-3 mt-6">
              {details.curriculum.map((week, w) => (
                <div
                  key={w}
                  className="border border-border dark:border-dark_border rounded-xl overflow-hidden"
                >
                  <div
                    onClick={() => toggleWeek(w)}
                    className="p-4 bg-light dark:bg-darklight/30 cursor-pointer hover:bg-light dark:hover:bg-darklight/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 btn-primary rounded-lg flex items-center justify-center text-white text-sm font-bold">
                          {w + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-midnight_text dark:text-white">
                            {week.title}
                          </h4>
                          <p className="text-xs text-gray dark:text-gray-400">
                            {week.sessions?.length || 0} sessions • {week.duration || "2-3 hours"}
                          </p>
                        </div>
                      </div>
                      <div className="text-gray-400">
                        {expandedWeeks.includes(w) ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                      </div>
                    </div>
                  </div>

                  {expandedWeeks.includes(w) && (
                    <div className="p-4 border-t border-border dark:border-dark_border">
                      <div className="space-y-2">
                        {week.sessions.map((s, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 p-2 rounded-lg hover:bg-light dark:hover:bg-darklight/30 transition-colors"
                          >
                            <div className="w-6 h-6 bg-gray-100 dark:bg-darklight rounded-md flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400">
                              {i + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-midnight_text dark:text-white font-medium">
                                {s.title}
                              </p>
                              {(s.duration || s.type) && (
                                <p className="text-xs text-gray dark:text-gray-400">
                                  {s.duration && `${s.duration} min`}
                                  {s.duration && s.type && " • "}
                                  {s.type}
                                </p>
                              )}
                            </div>
                            {s.isCompleted && (
                              <FiCheckCircle className="text-green-500" size={16} />
                            )}
                          </div>
                        ))}
                      </div>

                      {week.outcomes && week.outcomes.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-dashed border-border dark:border-dark_border">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                            Week {w + 1} Outcomes
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {week.outcomes.map((outcome, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                              >
                                <FiTarget size={10} />
                                {outcome}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Courses */}
        <div className="mt-10">
          <RelatedCourses currentCourseId={course._id} />
        </div>
      </div>
    </div>
  );
};

export default CommonCourseDetails;