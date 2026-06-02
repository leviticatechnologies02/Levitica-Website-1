
import { Routes, Route } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import './App.css'

// Layouts
import Navbar from '@/pages/public/Navbar';
import Footer from '@/pages/public/Footer';


// Public pages
import HomePage from '@/pages/public/HomePage';
import AboutUs from '@/pages/public/AboutUs';
import ContactUs from '@/pages/public/Contact';
import Trainings from '@/pages/public/Trainings';

import CourseDetail from '@/pages/public/CoursesDetails';
import Services from '@/pages/public/Services';
import ServiceDetails from '@/pages/public/ServicesDetails';
import ProductDetails from '@/pages/public/Sections/ProductDetails';
import ProductEnquiry from '@/pages/public/Sections/ProductEnquiry';
import GetApp from '@/pages/public/Get_App';


// Auth
import Login from '@/pages/public/Login';
import Signup from '@/pages/public/Signup';
import ForgotPassword from '@/pages/public/Forgotpassword';
import ChangePassword from '@/pages/public/ChangePassword';
import EmailVerification from '@/utils/EmailVerification';

// Student
import CourseCatalog from '@/dashboard/Student/CourseCatelog';
import LiveClasses from '@/dashboard/Student/LiveClasses';

import SettingsPage from '@/dashboard/Student/Settings';

// Admin
import AssignStudents from '@/dashboard/Admin/StudentManagement/StudentsManagement';
import StudentsTable from '@/dashboard/Admin/StudentManagement/AllStudentTable';
import UnassignedStudents from '@/dashboard/Admin/StudentManagement/UnassignedStudents';
import AssignedStudents from '@/dashboard/Admin/StudentManagement/AssignedStudents';
import AdminLiveClasses from '@/dashboard/Admin/LiveClass/LiveClassManagement';
import AdminDashboard from '@/dashboard/Admin/AdminDashboard';
import CoursesManagement from '@/dashboard/Admin/CourseManagement/CoursesManagement';
import BatchManagement from '@/dashboard/Admin/Batchs/BatchManagement';
import SuperAdminPage from '@/dashboard/Admin/AddAdmin/SuperAdminPage.jsx';


import Internship from '@/pages/public/Sections/Internship/Internship';
import PaymentSuccess from '@/pages/public/Sections/Internship/PaymentSuccessPage';
import { Privacy, Refund, Terms, KnowledgeBase, Forums } from '@/pages/public/Sections/AllTermsPolicy';
import DashboardLayout from '@/dashboard/Dashboard';
import DashboardIndex from '@/protectedRoutes/DashboardIndex';
import ProtectedRoute from '@/protectedRoutes/ProtechedRoutes';
import StudentDashboard from '@/dashboard/Student/StudentDashboard';
import MyCourseList from '@/dashboard/Student/MyCoursesList';
import CommonCourseDetails from '@/dashboard/common/CommonCourseDetails';
import AuthRestore from '@/protectedRoutes/AuthRestore';
import InternshipsDomainManagement from '@/dashboard/Admin/Internships/InternshipsManagement.jsx';
import PaymentOverview from '@/dashboard/Admin/Payments/PaymentOverview.jsx';
import StudentEnrolledCourseDetails from '@/dashboard/Student/MyCourseDetails.jsx';
import PromoCodeManagement from '@/dashboard/Admin/promoCodeManagement/PromoCodeManagement.jsx';
import MentorManagement from './dashboard/Admin/Mentor/MentorManagement';

/* ---------------- Layout wrappers ---------------- */

const AppLayout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

const AuthLayout = () => (
  <>
    <Outlet />
  </>
);

const NoFooterLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

/* ---------------- Router ---------------- */

const AppRouter = () => {
  return (
    <>
      <AuthRestore />
      <Routes>
        {/* Main public layout */}
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="trainings" element={<Trainings />} />
          <Route path="trainings/:category/:courseId?" element={<CourseDetail />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:serviceName" element={<ServiceDetails />} />
          <Route path="products/:slug" element={<ProductDetails />} />
          <Route path="products/:slug/enquiry" element={<ProductEnquiry />} />
          <Route path="contact-us" element={<ContactUs />} />
          <Route path="about-us" element={<AboutUs />} />

          <Route path="app" element={<GetApp />} />

          <Route path="privacy" element={<Privacy />} />
          <Route path="refund" element={<Refund />} />
          <Route path="terms" element={<Terms />} />
          <Route path="knowledge-base" element={<KnowledgeBase />} />
          <Route path="forums" element={<Forums />} />
        </Route>

        {/* Login / Signup (navbar only) */}
        <Route element={<NoFooterLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="sign-up" element={<Signup />} />
        </Route>

        {/* Auth-only pages */}
        <Route element={<AuthLayout />}>
          <Route path="password-reset" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ChangePassword />} />
          <Route path="verify-email" element={<EmailVerification />} />
          <Route path="internships" element={<Internship />} />
          <Route path="internships/payment-success" element={<PaymentSuccess />} />
        </Route>

        {/* Dashboard Routes */}
        <Route path="dashboard" element={<ProtectedRoute />}>
          <Route index element={<DashboardIndex />} />
          
          <Route element={<ProtectedRoute allowedRoles={["student", "admin", "superadmin"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="course/:id" element={<CommonCourseDetails />} />
            </Route>
          </Route>

          {/* ================= STUDENT ================= */}
          <Route path="student" element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route element={<DashboardLayout />}>
              <Route index element={<StudentDashboard />} />
              <Route path="browsercourses" element={<CourseCatalog />} />
              <Route path="mycourses" element={<MyCourseList />} />
              <Route path="mycourses/:courseId" element={<StudentEnrolledCourseDetails />} />
              <Route path="live-session" element={<LiveClasses />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* ================= ADMIN ================= */}
          <Route path="admin" element={<ProtectedRoute allowedRoles={["admin", "superadmin"]} />}>
            <Route element={<DashboardLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="addadmin" element={<SuperAdminPage />} />
              <Route path="payments" element={<PaymentOverview />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path='promocode' element={
                <PromoCodeManagement />
              } />

              <Route path="mentors" element={<MentorManagement />} />
              <Route path="courses" element={<CoursesManagement />} />
              <Route path="internships" element={<InternshipsDomainManagement />} />
              <Route path="zoom" element={<AdminLiveClasses />} />
              <Route path="batchs" element={<BatchManagement />} />

              <Route path="students" element={<AssignStudents />}>
                <Route index element={<StudentsTable />} />
                <Route path="unassigned" element={<UnassignedStudents />} />
                <Route path="assigned" element={<AssignedStudents />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default AppRouter;
