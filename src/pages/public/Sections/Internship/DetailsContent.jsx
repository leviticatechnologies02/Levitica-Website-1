// DetailsContent.jsx
import { FaEnvelope, FaPhone } from "react-icons/fa";
import { HiDesktopComputer, HiPlus } from "react-icons/hi";
import { MdOutlineWork } from "react-icons/md";
import { GiAchievement } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import { HiArrowRight, HiArrowLeft } from "react-icons/hi";

const DetailsContent = ({ domains, isLoading, isError, showPaymentForm, setShowPaymentForm, onInternshipClick }) => {
  const navigate = useNavigate();

  const formatDurations = (durations = []) =>
    durations.map(d => `${d.days} Days`).join(" / ");

  const formatFees = (durations = []) =>
    durations.map(d => `₹${d.fee}`).join(" / ");


  const learningOutcomes = [
    "Build and deploy real-time mini projects",
    "Strengthen core technical and problem-solving skills",
    "Gain hands-on exposure to modern tools and frameworks",
    "Understand how AI integrates into real-world solutions",
    "Receive Internship Certificates recognized by industry partners",
    "Participate in career guidance and placement sessions"
  ];

  if (isLoading && (!domains || domains.length === 0)) {
    return (
      <div className="text-center p-6 text-gray-600">
        Loading internship domains...
      </div>
    );
  }

  if (isError && (!domains || domains.length === 0)) {
    return (
      <div className="text-center p-6 text-red-500">
        Failed to load internship domains.
      </div>
    );
  }


  return (
    <div className="w-full max-w-6xl mx-auto pb-4 lg:pb-6">
      {/* Page Header Banner */}
      <div className="w-[100vw] relative left-1/2 -translate-x-1/2 bg-gradient-to-b from-[#eaf4fc] to-white pt-6 pb-12 mb-10 border-b border-blue-50">
        <div className="max-w-7xl mx-auto px-4 relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-0 left-4 md:left-8 flex items-center text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors z-10 bg-white/50 hover:bg-white px-3 py-1.5 rounded-full border border-gray-200 backdrop-blur-sm"
          >
            <HiArrowLeft className="mr-1.5 w-4 h-4" /> Back
          </button>
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center flex flex-col items-center pt-8 md:pt-12 mt-2 md:mt-0">
          {/* Logo
          <Link to="/" className="mb-6 inline-block">
            <img
              src="/img/leviticalogo.png"
              alt="Levitica Logo"
              className="w-32 h-auto hover:opacity-80 transition-opacity"
            />
          </Link>
 */}
          <h1 className="text-3xl md:text-[2.25rem] font-extrabold text-[#112340] mb-4 leading-tight ">
            Industrial Internship Workshops <br className="hidden md:block" /> For B.Tech & Degree Students
          </h1>
          <p className="text-gray-600 text-sm md:text-[15px] leading-relaxed mb-6 max-w-2xl mx-auto">
            Learn from industry professionals through On-Campus or Online Internship Programs conducted by Levitica Technologies Pvt Ltd, Hyderabad.
          </p>

          {/* Breadcrumbs */}
          <div className="flex items-center justify-center space-x-2 text-[13px] md:text-sm text-gray-500 font-medium">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span className="text-gray-300">›</span>
            <Link to="/trainings" className="hover:text-blue-600 transition-colors">Training</Link>
            <span className="text-gray-300">›</span>
            <span className="text-[#112340]">Internships</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6 px-4 lg:px-0">

        {/* Internship Domains */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-base md:text-lg text-gray-900 mb-3 flex items-center align-center justify-center ">
            <HiDesktopComputer className="mr-2 text-blue-600" /> Internship Domains Offered
          </h4>
          <p className="text-sm text-gray-600 mb-8 relative z-10 align-center justify-center text-center">
            Each college can choose one or more domains based on student interest
          </p>

          <div className="relative">
            {/* Ambient Background Blobs */}
            <div className="absolute -top-10 -left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute -bottom-10 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }}></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
              {domains.map((domain) => (
                <div
                  key={domain._id}
                  onClick={() => onInternshipClick && onInternshipClick(domain._id)}
                  className="bg-white/70 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-7 flex flex-col h-full cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-white/90 group"
                >

                  {/* Small Icon & Category */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <HiDesktopComputer size={20} />
                    </div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Internship
                    </span>
                  </div>

                  {/* Card Title & Desc */}
                  <h4 className="font-extrabold text-black-600 text-[1.15rem] leading-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {domain.name}
                  </h4>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
                    {domain.focus}
                  </p>

                  {/* Details Pills */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="inline-flex items-center bg-gray-50 text-gray-700 text-xs px-2.5 py-1.5 rounded-lg font-medium border border-gray-200">
                      <svg className="w-3.5 h-3.5 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      {formatDurations(domain.durations)}
                    </span>
                    <span className="inline-flex items-center bg-gray-50 text-gray-700 text-xs px-2.5 py-1.5 rounded-lg font-medium border border-gray-200">
                      🎓 {domain.level}
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="mt-auto pt-5 border-t border-gray-900/5 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 font-medium tracking-wide uppercase">Fee</span>
                      <span className="text-gray-900 font-black text-xl">
                        {formatFees(domain.durations)}
                      </span>
                    </div>
                    <button className="text-sm font-bold text-gray-700 bg-gray-300 px-5 py-2.5 rounded-xl group-hover:bg-blue-600 group-hover:text-white group-hover:scale-105 transition-all flex items-center shadow-md">
                      Apply <HiArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>



          <p className="text-xs md:text-sm text-gray-500 mt-4 text-center font-medium">
            Workshops can be organized On-Campus or conducted Online, depending on college convenience.
          </p>
        </div>

        {/* About the Internship */}
        <div className="p-4 " >
          <h3 className="font-semibold text-base md:text-lg text-gray-900 mb-3 flex items-center text-align-center align-center justify-center ">
            <MdOutlineWork className="mr-2 text-blue-600" /> About the Internship Workshops
          </h3>
          <div className="space-y-2 text-gray-700 text-sm align-center justify-center text-center">
            <p className="flex items-start">
              <span className="text-blue-500 mr-2 mt-0.5">•</span>
              Our Internship-Based Workshops are designed to help B.Tech and Degree students gain hands-on exposure to the latest industry technologies.
            </p>
            <p className="flex items-start">
              <span className="text-blue-500 mr-2 mt-0.5">•</span>
              These workshops are conducted either directly on your campus or through online live sessions, based on your college's preference.
            </p>
            <p className="flex items-start">
              <span className="text-blue-500 mr-2 mt-0.5">•</span>
              Every participant receives an Internship Certificate jointly issued by Levitica Technologies Pvt Ltd and Levitica Technologies Pvt Ltd upon successful completion.
            </p>
          </div>
        </div>

        {/* Learning Outcomes */}
        <div className="text-center">
          <h3 className="font-semibold text-base md:text-lg text-gray-900 mb-3 flex items-center align-center justify-center">
            <GiAchievement className="mr-2 text-blue-600" /> What You'll Learn
          </h3>

          <div className="p-4 bg-blue-50 rounded-lg">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-center">
              {learningOutcomes.map((outcome, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 mr-2"></div>
                  <span className="text-gray-700 text-sm">{outcome}</span>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* Contact Details */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-base text-gray-900 mb-3">
            Contact Us
          </h3>
          <div className="w-12 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 mb-3 rounded-full"></div>
          <div className="space-y-2">
            <div className="flex items-center">
              <FaEnvelope className="text-gray-500 mr-2 text-sm" />
              <a href="mailto:hr@leviticatechnologies.com" className="text-gray-700 hover:text-blue-600 text-sm">
                hr@leviticatechnologies.com
              </a>
            </div>
            <div className="flex items-center">
              <FaPhone className="text-gray-500 mr-2 text-sm" />
              <a href="tel:+919032503559" className="text-gray-700 hover:text-blue-600 text-sm">
                +91 9032503559
              </a>
            </div>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-base text-gray-900 mb-3">
            Terms & Conditions
          </h3>
          <div className="space-y-1.5 text-gray-600 text-sm">
            <p className="flex items-start">
              <span className="text-red-400 mr-2 mt-0.5">•</span>
              You agree to share information entered on this page with Levitica Technologies and Razorpay
            </p>
            <p className="flex items-start">
              <span className="text-red-400 mr-2 mt-0.5">•</span>
              Fees once paid are non-refundable
            </p>
            <p className="flex items-start">
              <span className="text-red-400 mr-2 mt-0.5">•</span>
              Make sure to enter correct College Name, Code, Roll Number and other details
            </p>
            <p className="flex items-start">
              <span className="text-red-400 mr-2 mt-0.5">•</span>
              Certificate will be provided upon successful completion by{"  "}
              <a href="https://leviticatechnologies.com" target="_blank" rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 ms-1">
                Levitica Technologies Pvt Ltd
              </a>
            </p>
            <p className="flex items-start">
              <span className="text-red-400 mr-2 mt-0.5">•</span>
              80% attendance is mandatory for certification
            </p>
            <p className="flex items-start">
              <span className="text-red-400 mr-2 mt-0.5">•</span>
              All payments are secured with 256-bit SSL encryption
            </p>
          </div>

          {/* Mobile Payment Button - Visible only on mobile */}
          <div className="lg:hidden mt-4">
            <button
              onClick={() => setShowPaymentForm(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-900 text-white font-medium py-2.5 px-4 rounded-lg w-full flex items-center justify-center hover:from-blue-700 hover:to-purple-700 transition-all text-sm"
            >
              <span>Proceed to Payment</span>
              <HiPlus className="ml-2" size={16} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-4 text-center">
          <div className="flex justify-center items-center">
            <div className="w-20">
              <img
                src="/img/leviticalogo.png"
                alt="levitica logo"
                className="w-full h-auto"
              />
            </div>
          </div>

          <p className="text-sm text-black/70 text-center">
            © {new Date().getFullYear()}{" "}
            <a
              href="https://leviticatechnologies.com"
              target="_blank"
              rel="noreferrer"
              className="font-medium hover:underline text-blue-600"
            >
              Levitica Technologies
            </a>
            . All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default DetailsContent;