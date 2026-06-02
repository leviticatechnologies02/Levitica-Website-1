// import { Link } from "react-router-dom";
// import {
//   FaFacebookF,
//   FaLinkedinIn,
//   FaYoutube,
// } from "react-icons/fa";
// import { FaXTwitter } from "react-icons/fa6";

// const Footer = () => {
//   return (
//     <footer className="bg-midnight_text dark:bg-midnight_text text-white overflow-hidden">

//       {/* ===== TOP SECTION ===== */}
//       <div className="container mx-auto max-w-screen-xl">

//         <div className="grid grid-cols-1 lg:grid-cols-5">

//           {/* ===== LOGO SECTION ===== */}
//           <div className="bg-white flex items-center justify-center px-6 py-10 min-h-[260px]">

//             {/* LOGO WRAPPER */}
//             <div className="w-full flex items-center justify-center">

//               <img
//                 src="/img/leviticalogo.png"
//                 alt="Levitica Logo"
//                 className="max-w-[180px] w-full h-auto object-contain"
//               />

//             </div>

//           </div>

//           {/* ===== CONTENT SECTION ===== */}
//           <div className="lg:col-span-4 px-6 py-12">

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

//               {/* ADDRESS */}
//               <div>
//                 <h5 className="text-xl font-semibold text-white mb-5">
//                   Address
//                 </h5>

//                 <p className="text-gray leading-8 text-sm mb-5">
//                   5th Floor, S2, C9WP+P68 Techno Park,
//                   Capital Pk Rd, VIP Hills,
//                   Silicon Valley,
//                   Hyderabad, Telangana – 500081
//                 </p>

//                 {/* SOCIAL */}
//                 <div className="flex items-center gap-3">

//                   <Social icon={FaFacebookF} />
//                   <Social icon={FaXTwitter} />
//                   <Social icon={FaLinkedinIn} />
//                   <Social icon={FaYoutube} />

//                 </div>
//               </div>

//               {/* QUICK LINKS */}
//               <div>
//                 <h5 className="text-xl font-semibold text-white mb-5">
//                   Quick Links
//                 </h5>

//                 <ul className="space-y-4 text-gray text-sm">

//                   <li>
//                     <Link
//                       to="/contact-us"
//                       className="hover:text-primary transition duration-300"
//                     >
//                       Contact Support
//                     </Link>
//                   </li>

//                   <li>
//                     <Link
//                       to="/services"
//                       className="hover:text-primary transition duration-300"
//                     >
//                       Services
//                     </Link>
//                   </li>

//                   <li>
//                     <Link
//                       to="/trainings"
//                       className="hover:text-primary transition duration-300"
//                     >
//                       Trainings
//                     </Link>
//                   </li>

//                   <li>
//                     <Link
//                       to="/about-us"
//                       className="hover:text-primary transition duration-300"
//                     >
//                       About Us
//                     </Link>
//                   </li>

//                 </ul>
//               </div>

//               {/* TERMS */}
//               <div>
//                 <h5 className="text-xl font-semibold text-white mb-5">
//                   Terms & Conditions
//                 </h5>

//                 <ul className="space-y-4 text-gray text-sm">

//                   <li>
//                     <Link
//                       to="/privacy"
//                       className="hover:text-primary transition duration-300"
//                     >
//                       Privacy Policy
//                     </Link>
//                   </li>

//                   <li>
//                     <Link
//                       to="/terms"
//                       className="hover:text-primary transition duration-300"
//                     >
//                       Terms of Service
//                     </Link>
//                   </li>

//                   <li>
//                     <Link
//                       to="/refund"
//                       className="hover:text-primary transition duration-300"
//                     >
//                       Refund Policy
//                     </Link>
//                   </li>

//                 </ul>
//               </div>

//               {/* POPULAR SEARCHES */}
//               <div>
//                 <h5 className="text-xl font-semibold text-white mb-5">
//                   Popular Searches
//                 </h5>

//                 <ul className="space-y-4 text-gray text-sm">

//                   <li className="hover:text-primary transition duration-300 cursor-pointer">
//                     <Link
//                       to="/internships"
//                       className="hover:text-primary transition duration-300"
//                     >
//                       Internships
//                     </Link>
//                   </li>

//                   <li className="hover:text-primary transition duration-300 cursor-pointer">
//                     <Link
//                       to="/trainings/web-development/java-full-stack"
//                       className="hover:text-primary transition duration-300"
//                     >
//                       Java Full Stack
//                     </Link>
//                   </li>

//                   <li className="hover:text-primary transition duration-300 cursor-pointer">
//                     <Link
//                       to="/trainings/data-science"
//                       className="hover:text-primary transition duration-300"
//                     >
//                       Data Science
//                     </Link>
//                   </li>

//                   <li className="hover:text-primary transition duration-300 cursor-pointer">
//                     <Link
//                       to="/trainings/web-development"
//                       className="hover:text-primary transition duration-300"
//                     >
//                       Web Development
//                     </Link>
//                   </li>

//                 </ul>
//               </div>

//             </div>

//           </div>

//         </div>

//       </div>

//       {/* ===== CONTACT SECTION ===== */}
//       <div className="border-t border-dark_border">

//         <div className="container mx-auto max-w-screen-xl px-6 py-6">

//           <div className="flex flex-col md:flex-row items-center justify-between gap-4">

//             <div className="flex flex-col sm:flex-row gap-4 text-gray text-sm">

//               <p className="text-cyan">
//                 <span className="text-white font-semibold">
//                   Phone :
//                 </span>{" "}
//                 +91 9032503559
//               </p>

//               <p className="text-cyan">
//                 <span className="text-white font-semibold">
//                   Email :
//                 </span>{" "}
//                 hr@leviticatechnologies.com
//               </p>

//             </div>

//           </div>

//         </div>

//       </div>

//       {/* ===== COPYRIGHT ===== */}
//       <div className="border-t border-dark_border">

//         <div className="container mx-auto max-w-screen-xl px-6 py-5 text-center text-gray text-xs">

//           © {new Date().getFullYear()} Levitica Technologies.
//           All rights reserved.

//         </div>

//       </div>

//     </footer>
//   );
// };

// /* ===== SOCIAL ICON ===== */
// const Social = ({ icon: Icon }) => (
//   <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-primary transition-all duration-300 cursor-pointer">

//     <Icon size={14} className="text-white" />

//   </div>
// );

// export default Footer;






























import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="overflow-hidden">

      {/* ===== FOOTER WRAPPER ===== */}
      <div className="">

        {/* ================================================= */}
        {/* ================= LOGO SECTION ================== */}
        {/* ================================================= */}
        {/* <div className="bg-white flex items-center justify-center px-6 py-10">

          <img
            src="/img/leviticalogo.png"
            alt="Levitica Technologies"
            className="w-full max-w-[160px] object-contain"
          />

        </div> */}

        {/* ================================================= */}
        {/* ================= TEXT SECTION ================== */}
        {/* ================================================= */}
        <div className="bg-primary text-white">

          {/* ===== TOP CONTENT ===== */}
          <div className="px-6 lg:px-10 py-6">

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

              {/* ADDRESS */}
              <div>
                <h4 className="text-lg text-white font-semibold mb-2">
                  Address
                </h4>
                <h3 className="text-base text-cyan font-semibold mb-1">Levitica Technologies Pvt Ltd</h3>
                <p className="text-white text-sm leading-6 mb-3">
                  5th Floor, S2, C9WP+P68 Techno Park,
                  Capital Pk Rd, VIP Hills,
                  Hyderabad, Telangana – 500081
                </p>

                {/* SOCIAL ICONS */}
                <div className="flex items-center gap-2">

                  <Social icon={FaFacebookF} />
                  <Social icon={FaXTwitter} />
                  <Social icon={FaLinkedinIn} />
                  <Social icon={FaYoutube} />

                </div>
              </div>

              {/* QUICK LINKS */}
              <div>
                <h4 className="text-lg text-white font-semibold mb-2">
                  Quick Links
                </h4>

                <ul className="space-y-2 text-sm text-white">

                  <li>
                    <Link
                      to="/contact-us"
                      className="hover:text-cyan transition duration-300"
                    >
                      Contact Support
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/services"
                      className="hover:text-cyan transition duration-300"
                    >
                      Services
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/trainings"
                      className="hover:text-cyan transition duration-300"
                    >
                      Trainings
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/about-us"
                      className="hover:text-cyan transition duration-300"
                    >
                      About Us
                    </Link>
                  </li>

                </ul>
              </div>

              {/* TERMS */}
              <div>
                <h4 className="text-lg text-white font-semibold mb-2">
                  Terms & Conditions
                </h4>

                <ul className="space-y-2 text-sm text-white">

                  <li>
                    <Link
                      to="/privacy"
                      className="hover:text-cyan transition duration-300"
                    >
                      Privacy Policy
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/terms"
                      className="hover:text-cyan transition duration-300"
                    >
                      Terms of Service
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/refund"
                      className="hover:text-cyan transition duration-300"
                    >
                      Refund Policy
                    </Link>
                  </li>

                </ul>
              </div>

              {/* POPULAR SEARCHES */}
              <div>
                <h4 className="text-lg text-white font-semibold mb-2">
                  Popular Searches
                </h4>

                <ul className="space-y-2 text-sm text-white">

                  <li>
                    <Link
                      to="/internships"
                      className="hover:text-cyan transition duration-300"
                    >
                      Internships
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/trainings/web-development/java-full-stack"
                      className="hover:text-cyan transition duration-300"
                    >
                      Java Full Stack
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/trainings/data-science"
                      className="hover:text-cyan transition duration-300"
                    >
                      Data Science
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/trainings/web-development"
                      className="hover:text-cyan transition duration-300"
                    >
                      Web Development
                    </Link>
                  </li>

                </ul>
              </div>

            </div>

          </div>

          {/* ===== CONTACT BAR ===== */}
          <div className="border-t border-dark_border px-6 lg:px-10 py-3">

            <div className="flex flex-col sm:flex-row justify-center gap-5 text-sm text-gray">

              {/* PHONE */}
              <a
                href="tel:+919032503559"
                className="group flex items-center gap-2 hover:text-cyan transition duration-300"
              >
                <span className="text-white ">
                  Phone :
                </span>

                <span className="font-semibold group-hover:text-white text-white">
                  +91 9032503559
                </span>
              </a>

              {/* EMAIL */}
              <a
                href="mailto:hr@leviticatechnologies.com"
                className="group flex items-center gap-2 hover:text-cyan transition duration-300"
              >
                <span className="text-white ">
                  Email :
                </span>

                <span className="font-semibold group-hover:text-white text-white">
                  hr@leviticatechnologies.com
                </span>
              </a>

            </div>

          </div>

          {/* ===== COPYRIGHT ===== */}
          <div className="border-t border-dark_border px-6 lg:px-10 py-3 text-center text-xs text-gray">

            © {new Date().getFullYear()} Levitica Technologies Pvt Ltd.
            All rights reserved.

          </div>

        </div>

      </div>

    </footer>
  );
};

/* ===== SOCIAL ICON ===== */
const Social = ({ icon: Icon }) => (
  <div className="w-9 h-9 rounded-lg bg-white/10 hover:bg-primary flex items-center justify-center transition-all duration-300 cursor-pointer">

    <Icon size={13} className="text-white" />

  </div>
);

export default Footer;