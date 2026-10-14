import { useNavigate } from "react-router-dom";
import { useCourses } from '@/hooks/useCourses';
import { FiBookOpen, FiClock, FiStar, FiArrowRight, FiTrendingUp } from "react-icons/fi";
import { motion } from "framer-motion";
import StarRating, { getCourseRatingData } from "./StarRating";

const RelatedCourses = ({ currentCourseId }) => {
  const navigate = useNavigate();
  const { courses, isLoading } = useCourses();

  if (isLoading) return null;

  const filteredCourses =
    courses?.filter((c) => c._id !== currentCourseId) || [];

  const randomCourses = [...filteredCourses]
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  if (randomCourses.length === 0) return null;

  return (
    <div className="
      bg-white dark:bg-semidark
      rounded-2xl
      border border-border dark:border-dark_border
      p-6 md:p-8
      shadow-property
      hover:shadow-deatail_shadow
      transition-all duration-300
      mt-8
    ">
      {/* Header with icon */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-skyBlue shadow-md">
            <FiTrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="
              font-bold text-xl md:text-2xl
              text-midnight_text dark:text-white
            ">
              You might also like
            </h2>
            <p className="text-sm text-gray mt-0.5">
              Discover more courses tailored for you
            </p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {randomCourses.map((item, index) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => navigate(`/dashboard/course/${item._id}`)}
            className="
              group cursor-pointer
              transition-all duration-300
              hover:scale-[1.02]
            "
          >
            {/* Thumbnail with overlay */}
            <div className="
              relative h-44 rounded-xl mb-3 overflow-hidden
              bg-light dark:bg-darklight
            ">
              {item.thumbnail ? (
                <>
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="
                    absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-300
                  " />
                </>
              ) : (
                <div className="
                  flex items-center justify-center h-full
                  text-gray
                ">
                  No Image
                </div>
              )}
              
              {/* Price Badge on Thumbnail */}
              <div className="
                absolute top-3 right-3
                px-2.5 py-1 rounded-lg
                text-xs font-bold
                shadow-md
                bg-gradient-to-r from-primary to-skyBlue
                text-white
              ">
                {Number(item.price) === 0 ? "FREE" : `₹${Number(item.price).toLocaleString('en-IN')}`}
              </div>
            </div>

            {/* Title */}
            <h3 className="
              font-semibold text-base md:text-lg
              text-midnight_text dark:text-white
              group-hover:text-primary
              transition-colors duration-200
              line-clamp-1
            ">
              {item.name}
            </h3>

            {/* Category Badge */}
            <div className="flex items-center gap-2 mt-1.5">
              <span className="
                inline-flex items-center gap-1
                px-2 py-0.5 rounded-md
                text-xs font-medium
                bg-light dark:bg-darklight
                text-gray
              ">
                <FiBookOpen className="h-3 w-3" />
                {item.category || "Course"}
              </span>
              <span className="
                inline-flex items-center gap-1
                px-2 py-0.5 rounded-md
                text-xs font-medium
                bg-light dark:bg-darklight
                text-gray
              ">
                <FiClock className="h-3 w-3" />
                {item.duration || "Flexible"}
              </span>
            </div>

            {/* Description */}
            <p className="
              text-sm text-gray
              line-clamp-2
              mt-2
            ">
              {item.shortdescription || "Explore this comprehensive course designed to enhance your skills and career growth."}
            </p>

            {/* Accurate Star Rating */}
            <div className="mt-2.5">
              <StarRating
                rating={getCourseRatingData(item).rating}
                reviewsCount={getCourseRatingData(item).reviewsCount}
                size={12}
              />
            </div>

            {/* Price and View Details Button */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border dark:border-dark_border">
              <div>
                {Number(item.price) === 0 ? (
                  <span className="text-lg font-bold text-primary">
                    Free
                  </span>
                ) : (
                  <span className="text-lg font-bold text-primary">
                    ₹{Number(item.price).toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/dashboard/course/${item._id}`);
                }}
                className="
                  inline-flex items-center gap-1.5
                  px-3 py-1.5 rounded-lg
                  text-xs font-medium
                  transition-all duration-200
                  btn-border
                  group-hover:shadow-md
                "
              >
                View Details
                <FiArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RelatedCourses;