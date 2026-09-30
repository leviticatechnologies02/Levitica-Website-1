import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaInstagram
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const socialLinks = [
  {
    name: "LinkedIn",
    icon: FaLinkedinIn,
    url: "https://www.linkedin.com/company/levitica-technologies-pvt-ltd/posts/",
  },
  {
    name: "Instagram",
    icon: FaInstagram,
    url: "https://www.instagram.com/life_at_levitica/",
  },
  {
    name: "Facebook",
    icon: FaFacebookF,
    url: "https://www.facebook.com/people/Levitica-Technologies/61556544303087/",
  }
];

const Footer = () => {
  return (
    <footer className="overflow-hidden">

      <div className="">

        {/* <div className="bg-white flex items-center justify-center px-6 py-10">

          <img
            src="/img/leviticalogo.png"
            alt="Levitica Technologies"
            className="w-full max-w-[160px] object-contain"
          />

        </div> */}

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
                  4th Floor, Jain Sadguru Images Capital Park,
                  408, Capital Pk Rd, VIP Hills, Silicon Valley,
                  Madhapur, Hyderabad, Telangana 500081
                </p>

                {/* SOCIAL ICONS */}
                <div className="flex items-center gap-2 flex-wrap">
                  {socialLinks.map(({ name, icon, url }) => (
                    <Social key={name} icon={icon} href={url} label={name} />
                  ))}
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
const Social = ({ icon: Icon, href, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 hover:scale-105 flex items-center justify-center transition-all duration-300 cursor-pointer"
  >
    <Icon size={14} className="text-white hover:text-cyan transition-colors duration-300" />
  </a>
);

export default Footer;