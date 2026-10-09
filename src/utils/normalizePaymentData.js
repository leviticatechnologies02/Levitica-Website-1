export const normalizeCoursePayments = (transactions = []) => {
  return transactions.map((t) => {
    const userObj = t.user || t.userId || t.student || t.studentId || {};
    const name = userObj.name || t.name || t.customerName || "Unknown User";
    const email = userObj.email || t.email || t.customerEmail || "-";
    let mode = t.paymentMode || t.paymentMethod || t.gateway;
    if (!mode || mode.toUpperCase() === "UNKNOWN") {
      mode = t.paymentId ? "RAZORPAY" : "UNKNOWN";
    }

    return {
      orderId: t.orderId,
      paymentId: t.paymentId,

      name,
      email,

      title: t.courses?.map((c) => c.name).join(", ") || t.courseName || "-",
      type: "Course",

      amount: t.amount,
      status: t.status,

      paymentMode: mode,
      appUsed: t.appUsed || "-",

      createdAt: t.createdAt,
    };
  });
};

export const normalizeInternshipPayments = (payments = []) => {
  return payments.map((p) => {
    const userObj = p.user || p.userId || p.student || p.studentId || {};
    const name = p.name || userObj.name || p.customerName || "Unknown User";
    const email = p.email || userObj.email || p.customerEmail || "-";
    let mode = p.paymentMode || p.paymentMethod || p.gateway;
    if (!mode || mode.toUpperCase() === "UNKNOWN") {
      mode = p.paymentId ? "RAZORPAY" : "UNKNOWN";
    }

    return {
      orderId: p.orderId,
      paymentId: p.paymentId,

      name,
      email,

      title: p.title || p.domain || "-",
      type: "Internship",

      amount: p.amount,
      status: p.status,

      paymentMode: mode,
      appUsed: p.appUsed || "-",

      createdAt: p.createdAt,
    };
  });
};
