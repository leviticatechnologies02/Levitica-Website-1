// DetailsContent.jsx
import { FaEnvelope, FaPhone } from "react-icons/fa";
import { HiDesktopComputer, HiPlus } from "react-icons/hi";
import { MdOutlineWork } from "react-icons/md";
import { GiAchievement } from "react-icons/gi";

const DetailsContent = ({ domains, isLoading, isError, showPaymentForm, setShowPaymentForm }) => {
  
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

  if (isLoading) {
    return (
      <div className="text-center p-6 text-gray-600">
        Loading internship domains...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-6 text-red-500">
        Failed to load internship domains.
      </div>
    );
  }


  return (
    <div className="p-4 lg:p-6 max-w-3xl lg:ms-7">
      {/* Header - Minimalist */}
      <div className="text-center mb-2">
        <div className="flex flex-col items-center">
          <div className="mb-3">
            <img
              src="/img/leviticalogo.png"
              alt="Levitica Logo"
              className="w-40 h-30 mx-auto"
            />
          </div>
          
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Program Title */}
        <div className="text-center">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3">
            Industrial Internship Workshops For B.Tech & Degree Students
          </h2>
          <div className="w-24 md:w-32 h-0.5 bg-gradient-to-r from-pink-500 to-blue-700 mx-auto rounded-full"></div>
        </div>

        <p className="text-sm md:text-base text-gray-600 text-center leading-relaxed">
          Learn from industry professionals through On-Campus or Online Internship Programs  conducted by Levitica Technologies Pvt Ltd , Hyderabad.
        </p>

        {/* Internship Domains */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-base md:text-lg text-gray-900 mb-3 flex items-center">
            <HiDesktopComputer className="mr-2 text-blue-600" /> Internship Domains Offered
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            Each college can choose one or more domains based on student interest:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {domains.map((domain) => (
              <div
                key={domain._id}
                className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
              >
                <h4 className="font-semibold text-gray-900 mb-3 text-base">
                  {domain.name}
                </h4>

                <div className="space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Focus:</span>
                    <span className="text-gray-900 text-sm font-medium text-right">
                      {domain.focus}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Duration:</span>
                    <span className="text-gray-900 text-sm font-medium">
                      {formatDurations(domain.durations)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Level:</span>
                    <span className="text-gray-900 text-sm font-medium">
                      {domain.level}
                    </span>
                  </div>

                  <div className="flex justify-between mt-1.5 pt-1.5 border-t">
                    <span className="text-gray-600 text-sm font-semibold">
                      Fee:
                    </span>
                    <span className="text-green-600 text-sm font-bold">
                      {formatFees(domain.durations)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>



          <p className="text-xs md:text-sm text-gray-500 mt-4 text-center font-medium">
            Workshops can be organized On-Campus or conducted Online, depending on college convenience.
          </p>
        </div>

        {/* About the Internship */}
        <div className="p-4">
          <h3 className="font-semibold text-base md:text-lg text-gray-900 mb-3 flex items-center">
            <MdOutlineWork className="mr-2 text-blue-600" /> About the Internship Workshops
          </h3>
          <div className="space-y-2 text-gray-700 text-sm">
            <p className="flex items-start">
              <span className="text-blue-500 mr-2 mt-0.5">•</span>
              Our Internship-Based Workshops are designed to help B.Tech and Degree students gain hands-on exposure to the latest industry technologies through structured short-term training.
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
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-base md:text-lg text-gray-900 mb-3 flex items-center">
            <GiAchievement className="mr-2 text-blue-600" /> What You'll Learn
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {learningOutcomes.map((outcome, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 mr-2"></div>
                <span className="text-gray-700 text-sm">{outcome}</span>
              </div>
            ))}
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