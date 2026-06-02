import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import {
  FaUsersCog,
  FaBuilding,
  FaBrain,
  FaGraduationCap,
  FaHospital,
  FaCheckCircle,
  FaComments,
  FaDatabase,
  FaUniversity
} from "react-icons/fa";

const ProductsSection = () => {
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    AOS.init({
      duration: 900,
      once: false,
      easing: "ease-out-cubic",
      offset: 80,
      delay: 50
    });
  }, []);

  const products = [
    {
      id: 8,
      title: "Levitica Academy",
      slug: "levitica-academy",
      subtitle: "Internship & Learning Platform",
      description:
        "Online and offline internship programs for colleges combined with a complete course learning platform featuring live sessions, mentorship, and certifications.",
      features: [
        "Online & Offline Internships",
        "Live Learning Sessions",
        "Industry Certifications",
      ],
      icon: FaUniversity,
      category: ["education"],
      deployment: "Cloud",
      image:
        "https://images.unsplash.com/photo-1610484826625-ac2be7f1c8c1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG9ubGluZSUyMGFjYWRlbXl8ZW58MHx8MHx8fDA%3D"
    },
    {
      id: 6,
      title: "Levitica Connects U",
      slug: "levitica-connects-u",
      subtitle: "Collaboration & Communication Platform",
      description:
        "A unified workspace for secure instant messaging, high-quality video meetings, collaborative document sharing, and seamless corporate communication.",
      features: [
        "Real-time chat & channels",
        "HD Video conferencing",
        "Secure document sharing",
      ],
      icon: FaComments,
      category: ["enterprise"],
      deployment: "SaaS",
      image:
        "https://images.unsplash.com/photo-1712904124132-857e6577aab9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29sbGFib3JhdGlvbiUyMG1lZXRpbmdzJTIwb25saW5lfGVufDB8fDB8fHww"
    },
    {
      id: 2,
      title: "Hostel & PG System",
      slug: "hostel-pg-system",
      subtitle: "Property Management Platform",
      description:
        "Smart solution for managing bookings, tenants, billing, and maintenance.",
      features: [
        "Room management",
        "Automated billing",
        "Tenant dashboards",
      ],
      icon: FaBuilding,
      category: ["property"],
      deployment: "Cloud",
      image: "/img/hostel.png"
    },
    {
      id: 1,
      title: "HRMS",
      slug: "hrms",
      subtitle: "Human Resource Management System",
      description:
        "Cloud-based HR platform covering the complete employee lifecycle with automation and compliance.",
      features: [
        "HR lifecycle automation",
        "Payroll & compliance",
        "Performance tracking",
      ],
      icon: FaUsersCog,
      category: ["hr", "enterprise"],
      deployment: "Cloud",
      image:
        "https://images.unsplash.com/photo-1531403009284-440f080d1e12"
    },
    {
      id: 3,
      title: "AI HR + CRM",
      slug: "ai-hr-crm",
      subtitle: "AI Automation",
      description:
        "AI-driven HR and CRM solution delivering predictive insights.",
      features: [
        "AI resume screening",
        "CRM pipelines",
        "Predictive analytics",
      ],
      icon: FaBrain,
      category: ["ai", "enterprise"],
      deployment: "SaaS",
      image:
        "https://media.istockphoto.com/id/2078574728/photo/employee-profile-dashboard-advisor-using-employee-kpi-dashboard-on-screen-hr-attrition.webp?a=1&b=1&s=612x612&w=0&k=20&c=lnL3-5wLncOFhPpTO1IB8l2c9g6NbjqOY2E8kJ3qJ_k="
    },
    {
      id: 4,
      title: "DVSkillHub",
      slug: "dvskillhub",
      subtitle: "Learning Platform",
      description:
        "Modern LMS for institutes and corporates with live classes.",
      features: [
        "Course management",
        "Live classes",
        "Assessments",
      ],
      icon: FaGraduationCap,
      category: ["education"],
      deployment: "Cloud",
      image:
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8b25saW5lJTIwZWR1Y2F0aW9ufGVufDB8fDB8fHww",
      link: "https://dvskillhub.leviticatechnologies.com/"
    },
    {
      id: 5,
      title: "Hospital System",
      slug: "hospital-system",
      subtitle: "Healthcare Platform",
      description:
        "Complete hospital digitization with records and billing.",
      features: [
        "Patient records",
        "Appointments",
        "Billing",
      ],
      icon: FaHospital,
      category: ["healthcare"],
      deployment: "Cloud",
      image:
        "https://media.istockphoto.com/id/1134679866/photo/doctor-working-in-hospital-writing-prescription-clipboard-working-an-laptop-on-desk-in.webp?a=1&b=1&s=612x612&w=0&k=20&c=R-VFqH-naNMbAC4jJabJXNO9RYOq4CKgAcYtevXCtzk="
    },
    {
      id: 7,
      title: "Levitica Data Management",
      slug: "levitica-data-management",
      subtitle: "Enterprise Database Hub",
      description:
        "A secure, centralized platform to store and manage critical organizational records across Sales, Finance, HR, and Admin departments.",
      features: [
        "Centralized secure database",
        "Sales, Finance, HR, Admin silos",
        "Advanced role-based access",
      ],
      icon: FaDatabase,
      category: ["enterprise", "hr"],
      deployment: "Cloud",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGF0YSUyMG1hbmFnZW1lbnR8ZW58MHx8MHx8fDA%3D"
    }
  ];


  const categories = [
    { id: "all", name: "All" },
    { id: "enterprise", name: "Enterprise" },
    { id: "hr", name: "HR Tech" },
    { id: "education", name: "Education" },
    { id: "healthcare", name: "Healthcare" },
    { id: "ai", name: "AI" },
    { id: "property", name: "Property" }
  ];

  const filteredProducts =
    activeTab === "all"
      ? products
      : products.filter((p) => p.category.includes(activeTab));

  // Function to determine grid classes based on number of filtered items
  const getGridClasses = () => {
    const itemCount = filteredProducts.length;

    if (itemCount === 0) {
      return "grid grid-cols-1";
    } else if (itemCount === 1) {
      return "grid grid-cols-1 max-w-md mx-auto gap-8";
    } else if (itemCount === 2) {
      return "grid sm:grid-cols-2 max-w-4xl gap-8 mx-auto";
    } else {
      return "flex flex-wrap justify-center gap-8";
    }
  };

  // Function to get item width classes for flex layout
  const getItemWidthClass = () => {
    return "w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)]";
  };

  const ProductCard = ({ product }) => {
    const Icon = product.icon;

    return (
      <div className="w-full bg-white dark:bg-darklight rounded-lg shadow-property overflow-hidden group transition h-full">

        {/* IMAGE */}
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-[250px] object-cover group-hover:scale-125 duration-500"
          />

          <p className="absolute top-3 left-3 bg-white text-primary text-xs px-3 py-1 rounded-md">
            {product.deployment}
          </p>
        </div>

        {/* CONTENT */}
        <div className="p-6 flex flex-col h-[calc(100%-250px)]">

          <h3 className="text-lg font-semibold text-midnight_text dark:text-white group-hover:text-primary transition">
            {product.title}
          </h3>

          <p className="text-sm text-gray mt-1">
            {product.subtitle}
          </p>

          <p className="text-sm text-gray mt-3">
            {product.description}
          </p>

          <ul className="mt-4 space-y-1">
            {product.features.map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray">
                <FaCheckCircle className="text-primary text-xs" />
                {f}
              </li>
            ))}
          </ul>

          {/* PUSH CTA TO BOTTOM */}
          <div className="flex-grow"></div>

          <div className="mt-5 flex justify-between items-center">
            <Link
              to={`/products/${product.slug}`}
              className="text-primary text-sm font-medium hover:underline"
            >
              View Details →
            </Link>

            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon className="text-primary w-4 h-4" />
            </div>
          </div>

        </div>
      </div>
    );
  };

  return (
    <section className="bg-light dark:bg-semidark flex justify-center items-center py-20">
      <div className="lg:max-w-screen-xl md:max-w-screen-md mx-auto container px-4">

        <h1
          className="text-4xl font-bold mb-12 text-midnight_text dark:text-white text-center"
          data-aos="fade-up"
        >
          Featured Products
        </h1>

        {/* TABS */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveTab(c.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${activeTab === c.id
                ? "btn-primary"
                : "btn-white border border-lightgray text-gray hover:border-primary"
                }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className={getGridClasses()}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <div
                key={product.id}
                data-aos="fade-up"
                data-aos-delay={index * 120}
                className={`${filteredProducts.length !== 1 && filteredProducts.length !== 2 ? getItemWidthClass() : ""} flex`}
              >
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <div className="text-center py-12" data-aos="fade-up">
              <p className="text-gray text-lg">No products found in this category.</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default ProductsSection;