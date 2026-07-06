import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";

const Navbar = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);

  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY >= 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setNavbarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all ${sticky
        ? "shadow-lg bg-white dark:bg-semidark"
        : "bg-transparent"
        }`}
    >
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md h-20 flex items-center justify-between px-4">

        <Link to="/" className="flex items-center">
          <img
            src={isDarkMode ? "/img/leviticalogo.png" : "/img/leviticalogo-removebg.png"}
            alt="logo"
            className="h-12 object-contain rounded-lg"
          />
        </Link>

        <nav className="hidden lg:flex items-center justify-center space-x-8">
          <NavItem to="/" label="Home" />
          <NavItem to="/services" label="Services" />
          <NavItem to="/trainings" label="Trainings" />
          <NavItem to="/products" label="Products" />
          <NavItem to="/about-us" label="About Us" />
          <NavItem to="/contact-us" label="Contact Us" />
        </nav>

        <div className="hidden lg:flex items-center gap-4">

          <Link
            to="/login"
            className="btn btn-white px-4 h-10 flex items-center rounded-lg transition duration-300"
          >
            Log in
          </Link>

          <Link
            to="/sign-up"
            className="btn btn-primary px-4 h-10 flex items-center rounded-lg transition"
          >
            Sign Up
          </Link>

          <Link
            to="/app"
            className="btn btn-white px-4 h-10 flex items-center rounded-lg transition duration-300"
          >
            Download App
          </Link>

        </div>

        <button
          onClick={() => setNavbarOpen(!navbarOpen)}
          className="lg:hidden p-2"
        >
          <span className="block w-6 h-0.5 bg-black dark:bg-white"></span>
          <span className="block w-6 h-0.5 bg-black dark:bg-white mt-1.5"></span>
          <span className="block w-6 h-0.5 bg-black dark:bg-white mt-1.5"></span>
        </button>
      </div>

      {navbarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" />
      )}
      <div
        ref={mobileMenuRef}
        className={`lg:hidden fixed top-0 right-0 h-full w-72 bg-white dark:bg-darkmode shadow-lg z-50 transform transition-transform duration-300 ${navbarOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold text-midnight_text dark:text-white">
            Menu
          </h2>
          <button onClick={() => setNavbarOpen(false)}>✕</button>
        </div>

        <div className="flex flex-col p-4 space-y-4">
          <MobileNavItem to="/" label="Home" close={() => setNavbarOpen(false)} />
          <MobileNavItem to="/services" label="Services" close={() => setNavbarOpen(false)} />
          <MobileNavItem to="/trainings" label="Trainings" close={() => setNavbarOpen(false)} />
          <MobileNavItem to="/products" label="Products" close={() => setNavbarOpen(false)} />
          <MobileNavItem to="/about-us" label="About Us" close={() => setNavbarOpen(false)} />
          <MobileNavItem to="/contact-us" label="Contact Us" close={() => setNavbarOpen(false)} />

          <hr />

          <MobileNavItem to="/login" label="Log in" close={() => setNavbarOpen(false)} />
          <MobileNavItem to="/sign-up" label="Sign Up" close={() => setNavbarOpen(false)} />
          <MobileNavItem to="/app" label="Download App" close={() => setNavbarOpen(false)} />
        </div>
      </div>
    </header>
  );
};

const NavItem = ({ to, label }) => (
  <Link
    to={to}
    className="text-midnight_text dark:text-white hover:text-primary transition font-medium"
  >
    {label}
  </Link>
);

const MobileNavItem = ({ to, label, close }) => (
  <Link
    to={to}
    onClick={close}
    className="text-midnight_text dark:text-white hover:text-primary py-1"
  >
    {label}
  </Link>
);

export default Navbar;