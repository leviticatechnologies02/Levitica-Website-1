import React, { createContext, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LiveClassForm from '@/dashboard/Admin/LiveClass/LiveClassForm';
import CourseModal from '@/dashboard/Admin/CourseManagement/CoursesModal';
import BatchModal from '@/dashboard/Admin/Batchs/BatchModal';
import CourseDetailsModal from '@/dashboard/Admin/CourseManagement/CoursesDetailsModal';
import InternshipsDomainModal from '@/dashboard/Admin/Internships/InternshipsDomainModal';
import ManageInternshipContentModal from '@/dashboard/Admin/Internships/ManageInternshipContentModal';
import BatchStudentsModal from '@/dashboard/Admin/Batchs/BatchStudentsModal';
import StudentDetailsModal from '@/dashboard/Student/StudentDetailsModal';
import PromoModal from '@/dashboard/Admin/promoCodeManagement/promocodeForm';
import MentorModal from '@/dashboard/Admin/Mentor/MentorModal';
import AdminModal from '@/dashboard/Admin/AddAdmin/CreateAdminForm'; // Import AdminModal

const ModalContext = createContext();

export const MODAL_TYPES = {
  CREATE_MEETING: "CREATE_MEETING",
  EDIT_MEETING: "EDIT_MEETING",
  ADD_COURSE: "ADD_COURSE",
  EDIT_COURSE: "EDIT_COURSE",
  CREATE_BATCH: "CREATE_BATCH",
  EDIT_BATCH: "EDIT_BATCH",
  ADD_COURSE_DETAILS: "ADD_COURSE_DETAILS",
  EDIT_COURSE_DETAILS: "EDIT_COURSE_DETAILS",
  ADD_INTERNSHIP_DOMAIN: "ADD_INTERNSHIPS_DOMAIN",
  EDIT_INTERNSHIP_DOMAIN: "EDIT_INTERNSHIP_DOMAIN",
  MANAGE_INTERNSHIP_CONTENT: "MANAGE_INTERNSHIP_CONTENT",
  VIEW_BATCH_STUDENTS: "VIEW_BATCH_STUDENTS",
  VIEW_STUDENT_DETAILS: "VIEW_STUDENT_DETAILS",
  ADD_PROMO: "ADD_PROMO",
  ADD_EDIT_MENTOR: "ADD_EDIT_MENTOR",
  ADD_EDIT_ADMIN: "ADD_EDIT_ADMIN" // Added admin modal type
};

export const ModalProvider = ({ children }) => {
  const [modalType, setModalType] = useState(null);
  const [modalProps, setModalProps] = useState({});

  const openModal = (type, props = {}) => {
    setModalType(type);
    setModalProps(props);
  };

  const closeModal = () => {
    setModalType(null);
    setModalProps({});
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      <AnimatePresence>
        {modalType && (
          <motion.div
            className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.96, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: 24, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="
                relative
                w-full
                max-w-3xl
                overflow-hidden
                rounded-2xl
                bg-white
                shadow-2xl
              "
            >
              {/* ================= Modal Content ================= */}

              {/* LIVE CLASSES CREATE AND EDIT */}
              {modalType === MODAL_TYPES.CREATE_MEETING && (
                <LiveClassForm
                  onSuccess={closeModal}
                  mode="create"
                  {...modalProps}
                />
              )}

              {modalType === MODAL_TYPES.EDIT_MEETING && (
                <LiveClassForm
                  onSuccess={closeModal}
                  mode="edit"
                  {...modalProps}
                />
              )}

              {/* COURSE MODAL FOR ADD AND EDIT */}
              {modalType === MODAL_TYPES.ADD_COURSE && (
                <CourseModal
                  onSuccess={closeModal}
                  mode="add"
                  {...modalProps}
                />
              )}

              {modalType === MODAL_TYPES.EDIT_COURSE && (
                <CourseModal
                  onSuccess={closeModal}
                  mode="edit"
                  {...modalProps}
                />
              )}

              {/* BATCH MODAL FOR ADD AND EDIT */}
              {modalType === MODAL_TYPES.CREATE_BATCH && (
                <BatchModal
                  handleClose={closeModal}
                  mode="add"
                  {...modalProps}
                />
              )}

              {modalType === MODAL_TYPES.EDIT_BATCH && (
                <BatchModal
                  handleClose={closeModal}
                  mode="edit"
                  {...modalProps}
                />
              )}

              {/* COURSE DETAILS MODAL */}
              {modalType === MODAL_TYPES.ADD_COURSE_DETAILS && (
                <CourseDetailsModal
                  courseId={modalProps.courseId}
                  onSuccess={closeModal}
                />
              )}

              {modalType === MODAL_TYPES.EDIT_COURSE_DETAILS && (
                <CourseDetailsModal
                  courseId={modalProps.courseId}
                  initialData={modalProps.initialData}
                  onSuccess={closeModal}
                />
              )}

              {/* Internships domain modal */}
              {modalType === MODAL_TYPES.ADD_INTERNSHIP_DOMAIN && (
                <InternshipsDomainModal
                  handleClose={closeModal}
                  mode="add"
                  {...modalProps}
                />
              )}

              {modalType === MODAL_TYPES.EDIT_INTERNSHIP_DOMAIN && (
                <InternshipsDomainModal
                  handleClose={closeModal}
                  mode="edit"
                  domain={modalProps.domain}
                />
              )}

              
              {modalType === MODAL_TYPES.MANAGE_INTERNSHIP_CONTENT && (
                <ManageInternshipContentModal
                  handleClose={closeModal}
                  domain={modalProps.domain}
                />
              )}

              {/* Batch students modal */}
              {modalType === MODAL_TYPES.VIEW_BATCH_STUDENTS && (
                <BatchStudentsModal
                  batchId={modalProps.batchId}
                  handleClose={closeModal}
                />
              )}

              {/* view student Details */}
              {modalType === MODAL_TYPES.VIEW_STUDENT_DETAILS && (
                <StudentDetailsModal
                  userId={modalProps.userId}
                  handleClose={closeModal}
                />
              )}

              {/* Promo code modal */}
              {modalType === MODAL_TYPES.ADD_PROMO && (
                <PromoModal
                  mode="add"
                  onSuccess={closeModal}
                />
              )}

              {/* MENTOR MODAL */}
              {modalType === MODAL_TYPES.ADD_EDIT_MENTOR && (
                <MentorModal
                  onSuccess={closeModal}
                  mode={modalProps.mode || "add"}
                  mentor={modalProps.mentor}
                />
              )}

              {/* ADMIN MODAL */}
              {modalType === MODAL_TYPES.ADD_EDIT_ADMIN && (
                <AdminModal
                  onSuccess={closeModal}
                  mode={modalProps.mode || "add"}
                  admin={modalProps.admin}
                />
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};