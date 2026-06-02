export const productsData = {
  "hrms": {
    id: 1,
    title: "HRMS",
    subtitle: "Human Resource Management System",
    description: "Cloud-based HR platform covering the complete employee lifecycle with automation and compliance.",
    fullDescription: "Our comprehensive Human Resource Management System (HRMS) streamlines all HR functions into a single digital platform. From onboarding and daily attendance to performance evaluations and payroll processing, this platform is built to optimize administrative workflows, reduce manual errors, and ensure global regulatory compliance.",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12",
    deployment: "Cloud (SaaS)",
    link: null,
    features: ["Employee Database Management", "Automated Payroll & Tax Compliance", "Time & Attendance Tracking with Geofencing", "Onboarding & Offboarding Workflows", "Performance Management & Goal Tracking", "Leave & Expense Approvals Portal"],
    benefits: ["Improves HR team efficiency by up to 40%", "Eliminates payroll errors through automated calculation engines", "Ensures regulatory and tax compliance out-of-the-box", "Enhances employee experience with a self-service mobile app portal"],
    enquiry: {
      heading: "HRMS Demo & Licensing Enquiry",
      tagline: "Modernize your HR operations with a fully automated, cloud-based platform.",
      about: "Our HRMS is trusted by leading enterprises to manage complete HR workflows — from hiring to exit. Fill in the form to schedule a personalized demo.",
      highlights: ["Automated Payroll & Compliance", "Attendance with Geofencing", "Leave & Expense Management", "Performance Review Workflows", "Scalable Cloud Deployment", "Dedicated Onboarding Support"],
      formTitle: "Request HRMS Demo",
      formSubtitle: "Our HR specialists will reach out within 24 hours.",
      formSchema: [
        { type: "text", name: "companyName", label: "Company / Organization Name", placeholder: "Enter company name", required: true, half: true },
        { type: "text", name: "hrManager", label: "HR Manager / Contact Name", placeholder: "Full name", required: true, half: true },
        { type: "select", name: "designation", label: "Designation", placeholder: "e.g. HR Manager, CHRO", required: true, half: true,
          options: ["HR Manager", "CHRO", "HR Lead", "Other"]
         },
        { type: "email", name: "email", label: "Email Address", placeholder: "you@company.com", required: true, half: true },
        { type: "tel", name: "mobile", label: "Mobile Number", placeholder: "10-digit number", required: true, half: true },
        { type: "number", name: "employeeCount", label: "Number of Employees", placeholder: "e.g. 150", required: true, half: true },
        {
          type: "select", name: "deployment", label: "Preferred Deployment", required: true, half: true,
          options: ["Cloud (SaaS)", "On-Premise", "Hybrid"]
        },
        {
          type: "select", name: "state", label: "State", required: true, half: true,
          options: ["Telangana", "Andhra Pradesh"]
        },
        {
          type: "checkboxes", name: "modules", label: "Modules Interested In", required: false,
          options: ["Payroll & Tax", "Attendance & Leaves", "Performance Management", "Recruitment & Onboarding", "Expense Management", "Employee Self-Service Portal"]
        },
        { type: "food", name: "food", label: "Preferred Food", required: true },
        { type: "textarea", name: "message", label: "Additional Requirements", placeholder: "Describe your current HR challenges or specific needs…", required: false },
      ]
    }
  },

  "hostel-pg-system": {
    id: 2,
    title: "Hostel & PG System",
    subtitle: "Property Management Platform",
    description: "Smart solution for managing bookings, tenants, billing, and maintenance.",
    fullDescription: "Designed for property managers, hostel owners, and PG operators, this system simplifies room bookings, rent collection, tenant onboarding, and operational management.",
    image: "/img/hostel.png",
    deployment: "Cloud Hosted",
    link: null,
    features: ["Real-time Room & Bed Occupancy Maps", "Automated Rent Invoicing & Digital Payments", "Tenant KYC & Digital Agreement Storage", "Maintenance Ticket Management System", "Visitor Logging & Gate Security Access", "Financial Reporting & Expense Audits"],
    benefits: ["Reduces manual rent collection overhead by 60%", "Provides instant insights on vacancy rates", "Streamlines maintenance logs", "Maintains detailed guest registers"],
    enquiry: {
      heading: "Hostel & PG System Enquiry",
      tagline: "Digitize your property operations end-to-end.",
      about: "Whether you run a single hostel or a chain of PG accommodations, our platform centralizes bookings, billing, and tenant management. Let's configure the right setup for you.",
      highlights: ["Real-time Occupancy Dashboard", "Automated Rent & Invoicing", "Tenant KYC & Agreement Storage", "Maintenance Ticketing System", "Visitor Logging & Gate Security", "Financial Expense Reports"],
      formTitle: "Property Management Enquiry",
      formSubtitle: "Tell us about your property and we'll tailor the perfect solution.",
      formSchema: [
        { type: "text", name: "propertyName", label: "Property / Hostel Name", placeholder: "Enter property name", required: true, half: true },
        { type: "text", name: "ownerName", label: "Owner / Manager Name", placeholder: "Full name", required: true, half: true },
        { type: "email", name: "email", label: "Email Address", placeholder: "you@property.com", required: true, half: true },
        { type: "tel", name: "mobile", label: "Mobile Number", placeholder: "10-digit number", required: true, half: true },
        {
          type: "select", name: "propertyType", label: "Property Type", required: true, half: true,
          options: ["PG Accommodation", "Co-living Space"]
        },
        { type: "number", name: "roomCount", label: "Total Rooms / Beds", placeholder: "e.g. 50", required: true, half: true },
        { type: "text", name: "city", label: "City", placeholder: "Enter city", required: true, half: true },
        {
          type: "select", name: "state", label: "State", required: true, half: true,
          options: ["Telangana", "Andhra Pradesh"]
        },
        {
          type: "checkboxes", name: "features", label: "Features You Need", required: false,
          options: ["Room Booking & Occupancy", "Automated Billing", "Tenant KYC", "Maintenance Tickets", "Visitor Log", "Financial Reports"]
        },
        { type: "food", name: "food", label: "Preferred Food", required: true },
        { type: "textarea", name: "message", label: "Tell Us About Your Property", placeholder: "Describe your current challenges or management needs…", required: false },
      ]
    }
  },

  "ai-hr-crm": {
    id: 3,
    title: "AI HR + CRM",
    subtitle: "AI Automation Platform",
    description: "AI-driven HR and CRM solution delivering predictive insights.",
    fullDescription: "A powerful combination of smart recruitment and automated client relations using NLP and predictive intelligence.",
    image: "https://media.istockphoto.com/id/2078574728/photo/employee-profile-dashboard-advisor-using-employee-kpi-dashboard-on-screen-hr-attrition.webp?a=1&b=1&s=612x612&w=0&k=20&c=lnL3-5wLncOFhPpTO1IB8l2c9g6NbjqOY2E8kJ3qJ_k=",
    deployment: "SaaS / Private Cloud",
    link: null,
    features: ["AI Resume Screening & Ranking Engine", "Interactive Candidate Matching Bots", "Predictive Deal Closure Forecasting", "Lead Source Attribution & Performance Audit", "Automated Multi-Channel Outreach Systems", "Unified HR & Client Dashboard View"],
    benefits: ["Cuts candidate screening time from days to minutes", "Increases CRM lead conversion rates", "Delivers data-driven recruitment and sales forecasts", "Consolidates critical business tools"],
    enquiry: {
      heading: "AI HR + CRM Platform Enquiry",
      tagline: "Supercharge hiring and sales pipelines with predictive AI.",
      about: "Our AI platform reduces candidate screening time by 90% and increases CRM conversion rates. Request a tailored demonstration for your team size and industry.",
      highlights: ["AI Resume Screening", "Candidate Ranking & Shortlisting", "CRM Lead Pipeline Management", "Predictive Sales Forecasting", "Automated Outreach Workflows", "Custom AI Model Integrations"],
      formTitle: "Request AI Platform Demo",
      formSubtitle: "Our AI consultants will contact you within 24 hours.",
      formSchema: [
        { type: "text", name: "companyName", label: "Company Name", placeholder: "Enter company name", required: true, half: true },
        { type: "text", name: "contactName", label: "Contact Person Name", placeholder: "Full name", required: true, half: true },
        { type: "select", name: "designation", label: "Designation", placeholder: "e.g. CTO, Sales Head", required: true, half: true, 
          options: ["CTO", "Sales Head", "HR Head", "Other"]
        },
        { type: "email", name: "email", label: "Email Address", placeholder: "you@company.com", required: true, half: true },
        { type: "tel", name: "mobile", label: "Mobile Number", placeholder: "10-digit number", required: true, half: true },
        {
          type: "select", name: "industry", label: "Industry", required: true, half: true,
          options: ["IT & Software", "Healthcare", "Finance & Banking", "E-commerce & Retail", "Manufacturing", "Education", "Staffing & Recruitment", "Other"]
        },
        {
          type: "select", name: "teamSize", label: "Team Size", required: true, half: true,
          options: ["1–25", "26–100", "101–500", "500+"]
        },
        {
          type: "checkboxes", name: "useCases", label: "AI Use Cases You Need", required: false,
          options: ["Resume Screening", "Candidate Matching", "Predictive Hiring", "Lead Scoring", "Sales Forecasting", "Automated Outreach", "Custom AI Model"]
        },
        { type: "food", name: "food", label: "Preferred Food", required: true },
        { type: "textarea", name: "message", label: "Your AI Goals", placeholder: "Describe your recruitment or sales challenges…", required: false },
      ]
    }
  },

  "dvskillhub": {
    id: 4,
    title: "DVSkillHub",
    subtitle: "Learning Management Platform",
    logo: "/img/companylogo/dvskillhub.jpg",
    description: "Modern LMS for institutes and corporates with live classes.",
    fullDescription: "DVSkillHub is a state-of-the-art Learning Management System for schools, universities, training centers, and corporate L&D divisions.",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=60",
    deployment: "Cloud (SaaS)",
    link: "https://dvskillhub.leviticatechnologies.com/",
    features: ["Interactive Multi-format Course Builder", "Integrated Live Streaming & Video Rooms", "Secure Online Assessment & Auto-grading", "Student Progress Tracking Dashboards", "Automated Certificate Generation", "Multi-tenant Portal Support"],
    benefits: ["Deliver classroom-quality training anywhere", "Track corporate training compliance", "Customizable to institution's branding", "Highly interactive discussion boards"],
    enquiry: {
      heading: "DVSkillHub Academic & Corporate Collaboration",
      tagline: "Empower students with industry-ready skills through our LMS.",
      about: "We invite colleges, TPOs, and corporate L&D teams from Telangana and Andhra Pradesh to partner with us for student skill development, internships, and placement programs.",
      highlights: ["Internship Opportunities", "Placement Assistance", "Industry Training Programs", "Campus Collaboration", "Student Skill Development", "Tea, Coffee & Food Facilities Available"],
      formTitle: "Register Your College / Organization",
      formSubtitle: "Fill in your details and our team will connect with you shortly.",
      formSchema: [
        { type: "text", name: "collegeName", label: "College / Institute Name", placeholder: "Enter college name", required: true, half: true },
        { type: "text", name: "tpoName", label: "TPO / Contact Person Name", placeholder: "Full name", required: true, half: true },
        { type: "select", name: "designation", label: "Designation", placeholder: "Training & Placement Officer", required: true, half: true,
          options: ["Training & Placement Officer", "HOD", "Principal",]
         },
        { type: "email", name: "email", label: "Email Address", placeholder: "Enter email address", required: true, half: true },
        { type: "tel", name: "mobile", label: "Mobile Number", placeholder: "10-digit number", required: true, half: true },
        {
          type: "select", name: "state", label: "State", required: true, half: true,
          options: ["Telangana", "Andhra Pradesh", "Karnataka", "Tamil Nadu", "Maharashtra", "Other"]
        },
        {
          type: "select", name: "collaboration", label: "Interested Collaboration", required: true, half: false,
          options: ["Internships", "Training Programs", "Placement Support", "Academic Collaboration", "Complete Partnership"]
        },
        { type: "food", name: "food", label: "Preferred Food", required: true },
        { type: "textarea", name: "message", label: "Message", placeholder: "Write your message or requirements…", required: false },
      ]
    }
  },

  "hospital-system": {
    id: 5,
    title: "Hospital System",
    subtitle: "Healthcare Platform",
    description: "Complete hospital digitization with records and billing.",
    fullDescription: "A secure, HIPAA-compliant platform for managing clinics, laboratories, and large hospital groups.",
    image: "https://media.istockphoto.com/id/1134679866/photo/doctor-working-in-hospital-writing-prescription-clipboard-working-an-laptop-on-desk-in.webp?a=1&b=1&s=612x612&w=0&k=20&c=R-VFqH-naNMbAC4jJabJXNO9RYOq4CKgAcYtevXCtzk=",
    deployment: "Cloud / On-Premise",
    link: null,
    features: ["Electronic Health Records (EHR)", "Patient Appointment Scheduler", "Laboratory Information Management (LIMS)", "Automated Ward & Bed Allotment", "Insurance Claim Submission", "Pharmacy Inventory Management"],
    benefits: ["Reduces patient wait times up to 50%", "Secures sensitive health documents", "Accelerates billing & insurance workflows", "Streamlines medical supply inventory"],
    enquiry: {
      heading: "Hospital Management System Enquiry",
      tagline: "Digitize your hospital's entire patient lifecycle securely.",
      about: "Our HIPAA-compliant system supports clinics, labs, and large hospital chains. From patient registration to pharmacy dispatch, everything managed on one secure platform.",
      highlights: ["Electronic Health Records (EHR)", "Patient Appointment Scheduling", "Laboratory Information Management", "Automated Billing & Insurance Claims", "Pharmacy Inventory Management", "Cloud & On-Premise Deployment"],
      formTitle: "Healthcare System Demo Request",
      formSubtitle: "Our healthcare technology team will arrange a tailored walkthrough.",
      formSchema: [
        { type: "text", name: "facilityName", label: "Hospital / Clinic Name", placeholder: "Enter facility name", required: true, half: true },
        { type: "text", name: "adminName", label: "Administrator / Doctor Name", placeholder: "Full name", required: true, half: true },
        { type: "select", name: "designation", label: "Designation", placeholder: "e.g. Medical Superintendent, Admin Head", required: true, half: true,
          options: ["Medical Superintendent", "Admin Head", "Other"]
         },
        { type: "email", name: "email", label: "Email Address", placeholder: "you@hospital.com", required: true, half: true },
        { type: "tel", name: "mobile", label: "Mobile Number", placeholder: "10-digit number", required: true, half: true },
        {
          type: "select", name: "facilityType", label: "Facility Type", required: true, half: true,
          options: ["Single Clinic", "Multi-specialty Hospital", "Lab & Diagnostics", "Nursing Home", "Pharmacy Chain", "Healthcare Group"]
        },
        { type: "number", name: "bedCount", label: "Number of Beds / Patients/Day", placeholder: "e.g. 200", required: false, half: true },
        {
          type: "select", name: "deployment", label: "Preferred Deployment", required: true, half: true,
          options: ["Cloud (SaaS)", "On-Premise", "Hybrid"]
        },
        {
          type: "checkboxes", name: "modules", label: "Modules Needed", required: false,
          options: ["Patient Registration & EHR", "Appointment Scheduling", "Lab Management (LIMS)", "Ward & Bed Management", "Billing & Insurance Claims", "Pharmacy Inventory"]
        },
        { type: "food", name: "food", label: "Preferred Food", required: true },
        { type: "textarea", name: "message", label: "Specific Requirements", placeholder: "Describe your digitization goals or current challenges…", required: false },
      ]
    }
  },

  "levitica-connects-u": {
    id: 6,
    title: "Levitica Connects U",
    logo: "/img/companylogo/leviticaConnect.png",
    subtitle: "Collaboration & Communication Platform",
    description: "A unified workspace for secure messaging, video meetings, and document sharing.",
    fullDescription: "Eliminate scattered communication channels. Levitica Connects U unifies team messaging, HD video conferencing, secure file sharing, and workflow automation in a fully white-labeled enterprise platform.",
    image: "https://images.unsplash.com/photo-1712904124132-857e6577aab9?w=600&auto=format&fit=crop&q=60",
    deployment: "SaaS / Private / On-Premise",
    link: "https://connectio-three.vercel.app/",
    features: ["Real-time Chat, Channels, and @Mentions", "HD Video Meetings & Screen Sharing", "Centralized Document Sharing & Co-editing", "Automated Meeting Transcripts & Summaries", "Cognitive Workflow Approvals", "Enterprise SSO & Multi-factor Auth"],
    benefits: ["Combines chat, video, and file sharing in a single app", "100% White-Label with your branding", "End-to-end message encryption", "Support for 100,000+ concurrent users"],
    enquiry: {
      heading: "Enterprise Collaboration Platform Enquiry",
      tagline: "Unify your team communication in a secure, branded workspace.",
      about: "Levitica Connects U is built for enterprises that need a secure, scalable, and fully branded collaboration workspace — combining messaging, video, and files in one place.",
      highlights: ["Real-time Chat & Team Channels", "HD Video Conferencing & Screen Sharing", "Secure Document Collaboration", "AI Meeting Summaries", "100% White-Label & Custom Domain", "Enterprise-grade SSO & MFA"],
      formTitle: "Request Collaboration Platform Demo",
      formSubtitle: "Our enterprise team will reach out within 24 hours.",
      formSchema: [
        { type: "text", name: "companyName", label: "Company Name", placeholder: "Enter company name", required: true, half: true },
        { type: "text", name: "contactName", label: "Contact Person", placeholder: "Full name", required: true, half: true },
        { type: "select", name: "designation", label: "Designation", placeholder: "e.g. IT Head, CTO", required: true, half: true,
          options: ["IT Head", "CTO", "HR Head", "Sales Head", "Other"]
         },
        { type: "email", name: "email", label: "Email Address", placeholder: "you@company.com", required: true, half: true },
        { type: "tel", name: "mobile", label: "Mobile Number", placeholder: "10-digit number", required: true, half: true },
        { type: "number", name: "teamSize", label: "Total Team / Users", placeholder: "e.g. 500", required: true, half: true },
        {
          type: "select", name: "deployment", label: "Preferred Deployment", required: true, half: true,
          options: ["Cloud (SaaS)", "Dedicated Private Cloud", "On-Premise", "Hybrid"]
        },
        {
          type: "select", name: "currentTool", label: "Current Communication Tool", required: false, half: true,
          options: ["None", "Email Only", "WhatsApp / Telegram", "Google Workspace", "Zoom", "Microsoft Teams", "Other"]
        },
        {
          type: "checkboxes", name: "features", label: "Features You Need", required: false,
          options: ["Team Messaging & Channels", "HD Video Conferencing", "Document Sharing", "White-Label Branding", "Workflow Automation", "SSO / MFA Security", "AI Meeting Summaries"]
        },
        { type: "food", name: "food", label: "Preferred Food", required: true },
        { type: "textarea", name: "message", label: "Your Collaboration Goals", placeholder: "Describe your communication challenges or security requirements…", required: false },
      ]
    }
  },

  "levitica-data-management": {
    id: 7,
    title: "Levitica Data Management",
    slug: "levitica-data-management",
    subtitle: "Enterprise Database Hub",
    description: "A secure, centralized platform for organizational records across Sales, Finance, HR, and Admin.",
    fullDescription: "Safeguard and organize your enterprise records with departmental silos, strict security rules, and comprehensive audit logging.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60",
    deployment: "Cloud / Hybrid Secure Cloud",
    link: null,
    features: ["Secure Departmental Database Silos", "Sales Contracts & Account Records Hub", "Finance Compliance & Billing Archive", "HR Dossiers & Employee File Repositories", "Granular Role-Based Permissions", "Full Activity Log Audits"],
    benefits: ["Central search for corporate assets", "Maximum protection for sensitive data", "Minimizes compliance risk with automatic logging", "Secure hybrid backups with point-in-time recovery"],
    enquiry: {
      heading: "Data Management Platform Enquiry",
      tagline: "Centralize and protect your enterprise records with role-based security.",
      about: "Levitica Data Management helps enterprises securely store departmental records across Sales, Finance, HR, and Admin with fine-grained access controls and comprehensive audit logs.",
      highlights: ["Departmental Data Silos", "Sales & Finance Record Vaults", "HR Dossier & Document Storage", "Role-Based Access Controls", "Full Activity Audit Logging", "AES-256 Encrypted Backups"],
      formTitle: "Data Management Enquiry",
      formSubtitle: "Our specialists will understand your storage and compliance requirements.",
      formSchema: [
        { type: "text", name: "companyName", label: "Company / Organization Name", placeholder: "Enter company name", required: true, half: true },
        { type: "text", name: "contactName", label: "Contact Person", placeholder: "Full name", required: true, half: true },
        { type: "text", name: "designation", label: "Designation", placeholder: "e.g. IT Head, Data Officer", required: true, half: true },
        { type: "email", name: "email", label: "Email Address", placeholder: "you@company.com", required: true, half: true },
        { type: "tel", name: "mobile", label: "Mobile Number", placeholder: "10-digit number", required: true, half: true },
        {
          type: "select", name: "deployment", label: "Preferred Deployment", required: true, half: true,
          options: ["Cloud", "Hybrid Cloud", "On-Premise", "Multi-cloud"]
        },
        {
          type: "select", name: "dataVolume", label: "Estimated Data Volume", required: false, half: true,
          options: ["< 1 TB", "1–10 TB", "10–50 TB", "50 TB+", "Not sure"]
        },
        {
          type: "select", name: "compliance", label: "Compliance Requirement", required: false, half: true,
          options: ["GDPR", "HIPAA", "ISO 27001", "SOC 2", "None", "Multiple"]
        },
        {
          type: "checkboxes", name: "departments", label: "Departments to Manage", required: false,
          options: ["Sales & CRM Records", "Finance & Accounting", "HR & Employee Files", "Admin & Operations", "Legal & Contracts", "IT Assets"]
        },
        { type: "food", name: "food", label: "Preferred Food", required: true },
        { type: "textarea", name: "message", label: "Data & Security Requirements", placeholder: "Describe your current data management challenges or compliance needs…", required: false },
      ]
    }
  },

  "levitica-academy": {
    id: 8,
    title: "Levitica Academy",
    subtitle: "Internship & Learning Platform",
    description: "Online and offline internship programs for colleges combined with a complete course learning platform featuring live sessions, mentorship, and certifications.",
    fullDescription: "Levitica Academy bridges the gap between education and industry. We offer structured online and offline internship programs for colleges across Telangana and Andhra Pradesh, paired with a full-featured course learning platform that includes live instructor-led sessions, self-paced modules, industry mentorship, project-based learning, and recognized certifications. Whether a student wants to learn a skill or gain real work experience, Levitica Academy delivers both in one place.",
    image: "https://images.unsplash.com/photo-1610484826625-ac2be7f1c8c1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG9ubGluZSUyMGFjYWRlbXl8ZW58MHx8MHx8fDA%3D",
    deployment: "Cloud (SaaS)",
    link: null,
    features: [
      "Online & Offline Internship Programs",
      "Live Instructor-Led Sessions",
      "Self-Paced Course Modules",
      "Industry Mentorship & Guidance",
      "Project-Based Learning Tracks",
      "Recognized Certificates & Badges"
    ],
    benefits: [
      "Bridges the gap between academic learning and industry skills",
      "Students gain real work experience through structured internships",
      "Colleges improve placement rates and industry connect",
      "Flexible learning — attend live or watch recorded sessions anytime"
    ],
    enquiry: {
      heading: "Levitica Academy — Internship & Learning Enquiry",
      tagline: "Empower your students with real skills, live mentorship, and industry internships.",
      about: "We invite colleges, TPOs, and institutions from Telangana and Andhra Pradesh to partner with Levitica Academy for student internships, skill-building programs, and placement-linked course tracks.",
      highlights: [
        "Online & Offline Internship Programs",
        "Live Learning Sessions with Industry Experts",
        "Placement Assistance & Career Support",
        "Project-Based Certifications",
        "Dedicated Campus Coordinator",
        "Tea, Coffee & Food Facilities Available"
      ],
      formTitle: "Register Your College / Institution",
      formSubtitle: "Our team will connect with you within 24 hours to discuss collaboration.",
      formSchema: [
        {
          type: "searchable-select", name: "collegeName", label: "College / Institution Name",
          placeholder: "Search college name…", required: true, half: true,
          options: [
            "Others",
            "Jawaharlal Nehru Technological University",
            "Osmania University",
            "University of Hyderabad",
            "JNTU Hyderabad",
            "JNTU Kakinada",
            "JNTU Anantapur",
            "Andhra University",
            "Sri Venkateswara University",
            "Acharya Nagarjuna University",
            "Krishna University",
            "Rayalaseema University",
            "Vikrama Simhapuri University",
            "Yogi Vemana University",
            "RGUKT Basar (IIIT Basar)",
            "RGUKT Nuzvid (IIIT Nuzvid)",
            "RGUKT Srikakulam (IIIT Srikakulam)",
            "RGUKT RK Valley (IIIT RK Valley)",
            "NIT Warangal",
            "NIT Andhra Pradesh",
            "IIT Hyderabad",
            "BITS Pilani - Hyderabad Campus",
            "CBIT Hyderabad",
            "VNR VJIET Hyderabad",
            "MGIT Hyderabad",
            "Vasavi College of Engineering",
            "BVRIT Hyderabad",
            "KITS Warangal",
            "Kakatiya University",
            "Mahatma Gandhi University Nalgonda",
            "Palamuru University Mahabubnagar",
            "Satavahana University Karimnagar",
            "Telangana University Nizamabad",
            "Jawaharlal Nehru Architecture and Fine Arts University",
            "Hyderabad Central University",
            "Maulana Azad National Urdu University",
            "NALSAR University of Law",
            "ICFAI University Hyderabad",
            "GITAM University Hyderabad",
            "Woxsen University",
            "Mahindra University",
            "Anurag University",
            "Vardhaman College of Engineering",
            "Sreenidhi Institute of Science and Technology",
            "Chaitanya Bharathi Institute of Technology",
            "Institute of Aeronautical Engineering",
            "G. Narayanamma Institute of Technology and Science",
            "Sri Indu College of Engineering",
            "Kommuri Pratap Reddy Institute of Technology",
            "Gokaraju Rangaraju Institute of Engineering and Technology",
            "KL University",
            "VIT-AP University",
            "Amrita Vishwa Vidyapeetham (Amaravati)",
            "SRM University AP",
            "Vignan's Foundation for Science Technology and Research",
            "Koneru Lakshmaiah Education Foundation (KLEF)",
            "Anil Neerukonda Institute of Technology and Sciences",
            "GMR Institute of Technology",
            "Raghu Engineering College",
            "Sri Vasavi Engineering College",
            "SRKR Engineering College",
            "St. Ann's College of Engineering and Technology",
            "Lendi Institute of Engineering and Technology",
            "Bonam Venkata Chalamayya Engineering College",
            "Sri Sivani College of Engineering",
            "Prasad V Potluri Siddhartha Institute of Technology",
            "VR Siddhartha Engineering College",
            "Gudlavalleru Engineering College",
            "RVR and JC College of Engineering",
            "Bapatla Engineering College",
            "Narasaraopeta Engineering College",
            "RISE Krishna Sai Prakasam Group of Institutions",
            "Chirala Engineering College",
            "Dadi Institute of Engineering and Technology",
            "Shri Vishnu Engineering College for Women"
          ]
        },
        { type: "text", name: "tpoName", label: "TPO / Coordinator Name", placeholder: "Full name", required: true, half: true },
        { type: "select", name: "designation", label: "Designation", placeholder: "e.g. Training & Placement Officer", required: true, half: true,
          options: ["Training & Placement Officer", "HOD", "Principal",]
         },
        { type: "email", name: "email", label: "Email Address", placeholder: "you@college.edu.in", required: true, half: true },
        { type: "tel", name: "mobile", label: "Mobile Number", placeholder: "10-digit number", required: true, half: true },
        
        {
          type: "select", name: "state", label: "State", required: true, half: true,
          options: ["Telangana", "Andhra Pradesh"]
        },
        {
          type: "select", name: "internshipMode", label: "Internship Mode Preferred", required: true, half: true,
          options: ["Online", "Offline (On-site)", "Hybrid (Both)"]
        },
        {
          type: "select", name: "studentCount", label: "Approx. Students per Batch", required: false, half: true,
          options: ["< 50", "50 – 100", "100 – 300", "300+"]
        },
        {
          type: "checkboxes", name: "programs", label: "Programs Interested In", required: false,
          options: ["Internship Programs", "Live Course Training", "Self-Paced Modules", "Industry Mentorship", "Project-Based Learning", "Placement Assistance", "Campus Certification Drive"]
        },
        { type: "food", name: "food", label: "Preferred Food", required: true },
        { type: "textarea", name: "message", label: "Message / Requirements", placeholder: "Tell us about your students' skill gaps or placement goals…", required: false },
      ]
    }
  }
};

