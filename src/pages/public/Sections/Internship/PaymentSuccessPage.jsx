import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useVerifyInternshipPaymentMutation } from '@/Services/paymentServices/internshipsServices';
import jsPDF from "jspdf";

import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaDownload,
  FaHome,
  FaClock,
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaRupeeSign,
  FaReceipt
} from "react-icons/fa";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [verifyPayment] = useVerifyInternshipPaymentMutation();

  const [paymentData, setPaymentData] = useState(null);
  const [countdown, setCountdown] = useState(10);
  const [isValidAccess, setIsValidAccess] = useState(true);

  /* ---------------- VERIFY PAYMENT ---------------- */

  useEffect(() => {

    const verify = async () => {

      const params = new URLSearchParams(location.search);

      const orderId = params.get("orderId");
      const paymentId = params.get("paymentId");
      const signature = params.get("signature");
      if (!orderId || !paymentId) {
        setIsValidAccess(false);
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      try {

        const res = await verifyPayment({
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: signature
        }).unwrap();

        if (!res.success) throw new Error("Verification failed");
        
        // Safeguard: Ensure student data exists so React doesn't crash
        if (!res.student) throw new Error("Verification successful but missing student data payload");

        setPaymentData({
          paymentId: res.paymentId,
          receipt: res.receipt,
          student: {
            name: res.student.name,
            email: res.student.email,
            rollNumber: res.student.rollNumber
          },
          program: res.student.program,
          domain: res.student.domain,
          amount: res.student.amount
        });

      } catch (error) {

        console.error("Payment verification failed", error);
        setIsValidAccess(false);
        setTimeout(() => navigate("/login"), 8000);

      }

    };

    verify();

  }, [location.search, navigate, verifyPayment]);

  /* ---------------- COUNTDOWN ---------------- */

  useEffect(() => {
    if (!isValidAccess) return;

    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          navigate("/login");
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, isValidAccess]);
  

  /* ---------------- PDF DOWNLOAD ---------------- */
  const handleDownloadReceipt = () => {

    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const centerX = pageWidth / 2;

    /* -------- HEADER -------- */

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Levitica Technologies", centerX, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Internship Payment Receipt", centerX, 28, { align: "center" });

    doc.setDrawColor(200);
    doc.line(20, 32, pageWidth - 20, 32);

    /* -------- RECEIPT INFO -------- */

    doc.setFontSize(11);

    doc.text(`Payment ID:`, 20, 45);
    doc.text(`${paymentData.paymentId}`, 60, 45);

    doc.text(`Receipt ID:`, 20, 52);
    doc.text(`${paymentData.receipt}`, 60, 52);

    doc.text(`Date:`, 20, 59);
    doc.text(`${new Date().toLocaleDateString()}`, 60, 59);

    /* -------- STUDENT DETAILS -------- */

    doc.setFont("helvetica", "bold");
    doc.text("Student Details", 20, 75);

    doc.setFont("helvetica", "normal");

    doc.text("Name:", 20, 85);
    doc.text(paymentData.student.name, 60, 85);

    doc.text("Email:", 20, 92);
    doc.text(paymentData.student.email, 60, 92);

    doc.text("Roll Number:", 20, 99);
    doc.text(paymentData.student.rollNumber, 60, 99);

    /* -------- PROGRAM DETAILS -------- */

    doc.setFont("helvetica", "bold");
    doc.text("Program Details", 20, 115);

    doc.setFont("helvetica", "normal");

    doc.text("Domain:", 20, 125);
    doc.text(paymentData.domain || "N/A", 60, 125);

    doc.text("Program Duration:", 20, 132);
    doc.text(`${paymentData.program} Days`, 60, 132);

    /* -------- PAYMENT DETAILS -------- */

    doc.setFont("helvetica", "bold");
    doc.text("Payment Details", 20, 148);

    doc.setFont("helvetica", "normal");

    doc.text("Amount Paid:", 20, 158);
    doc.text(`${paymentData.amount} rs`, 60, 158);

    doc.text("Status:", 20, 165);
    doc.text("PAID", 60, 165);

    doc.text("Gateway:", 20, 172);
    doc.text("Razorpay", 60, 172);

    /* -------- HIGHLIGHT AMOUNT -------- */

    doc.setDrawColor(0);
    doc.setFillColor(240, 248, 255);

    doc.rect(20, 185, pageWidth - 40, 15, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);

    doc.text(
      `Total Paid:  ${paymentData.amount} rs`,
      centerX,
      195,
      { align: "center" }
    );

    /* -------- FOOTER -------- */

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    doc.text(
      "Thank you for registering with Levitica Technologies",
      centerX,
      220,
      { align: "center" }
    );

    doc.text(
      "For support contact: hr@leviticatechnologies.com",
      centerX,
      227,
      { align: "center" }
    );

    doc.save(`Levitica Technologies-Receipt-${paymentData.paymentId}.pdf`);
  };
  /* ---------------- INVALID ACCESS ---------------- */

  if (!isValidAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
          <h2 className="text-xl font-bold">Access Denied</h2>
          <p className="text-gray-600 mt-2">
            This page is only accessible after successful payment.
          </p>
        </div>
      </div>
    );
  }

  /* ---------------- LOADING ---------------- */

  if (!paymentData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="w-14 h-14 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4">Verifying payment...</p>
      </div>
    );
  }

  /* ---------------- SUCCESS UI ---------------- */

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">

      <div className="bg-white shadow-xl rounded-xl max-w-lg w-full p-8 text-center">

        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />

        <h1 className="text-2xl font-bold mb-2">
          Payment Successful 🎉
        </h1>

        <p className="text-gray-600 mb-2">
          Your internship registration is confirmed.
        </p>
        <div className="bg-blue-50 border border-blue-100 text-blue-800 p-3 rounded-lg text-sm mb-6">
          <strong>Next Step:</strong> We've sent your login credentials to your email. Please check your inbox (and spam) to access your Student Dashboard.
        </div>

        {/* Payment Details */}

        <div className="text-left space-y-3 mb-6">

          <Detail icon={<FaUser />} label="Name" value={paymentData.student.name} />
          <Detail icon={<FaEnvelope />} label="Email" value={paymentData.student.email} />
          <Detail icon={<FaIdCard />} label="Roll Number" value={paymentData.student.rollNumber} />
          <Detail icon={<FaReceipt />} label="Payment ID" value={paymentData.paymentId} />
          <Detail icon={<FaRupeeSign />} label="Amount Paid" value={`₹${paymentData.amount}`} />
          <Detail icon={<FaClock />} label="Program Duration" value={`${paymentData.program} Days`} />

        </div>

        {/* Buttons */}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">

          <button
            onClick={handleDownloadReceipt}
            className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700"
          >
            <FaDownload />
            Download Receipt
          </button>

          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700"
          >
            <FaUser />
            Go to Login
          </button>

        </div>

        {/* Countdown */}

        <p className="text-sm text-gray-500 mt-6">
          Redirecting to login page in {countdown}s
        </p>

      </div>

    </div>
  );
};

/* ---------------- DETAIL ROW ---------------- */

const Detail = ({ icon, label, value }) => (
  <div className="flex items-center justify-between border-b py-2">
    <div className="flex items-center gap-2 text-gray-600">
      {icon}
      {label}
    </div>
    <div className="font-semibold">{value}</div>
  </div>
);

export default PaymentSuccess;