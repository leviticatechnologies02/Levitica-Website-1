export const transformAssignmentPayload = (rawData) => {
  if (!Array.isArray(rawData) || rawData.length === 0) return null;

  const { courseId, batchId,courseTitle,batchName } = rawData[0]; // assuming all rows share same course & batch
  const enrollmentIds = rawData.map(item => item.enrollment_id);

  return {
    courseId,
    batchId,
    courseTitle,
    batchName,
    enrollmentIds
  };
};

export const transformInternshipAssignmentPayload = (rawData) => {
  if (!Array.isArray(rawData) || rawData.length === 0) return null;

  const { batchId, courseName: domainTitle, batchName } = rawData[0]; 
  const paymentIds = rawData.map(item => item.enrollment_id);

  return {
    paymentIds,
    batchId,
    domainTitle,
    batchName
  };
};

//used in unassigned for send data to generic table
export const flattenEnrollments = (data) => {
  const arr = Array.isArray(data) ? data : (data?.enrollments || data?.data || []);
  return arr.flatMap(entry => {
    if (!entry) return [];
    const { _id, user, enrolledCourses } = entry;
    if (!Array.isArray(enrolledCourses)) return [];
    return enrolledCourses.map(courseEntry => ({
      enrollment_id: _id,
      name: user?.name || entry.name || 'Unknown',
      email: user?.email || entry.email || 'Unknown',
      courseName: courseEntry.course?.name || courseEntry.courseTitle || 'No Course',
      courseId: courseEntry.course?._id || courseEntry.course || 'N/A', 
      batchName: courseEntry.batch?.batchName || (typeof courseEntry.batch === 'string' ? courseEntry.batch : 'Unassigned'),
    }));
  });
};

export const flattenInternshipEnrollments = (data) => {
  const arr = Array.isArray(data) ? data : (data?.internships || data?.enrollments || data?.data || []);
  return arr.flatMap(entry => {
    if (!entry) return [];
    // If it's just an array of payments directly
    if ((entry.internshipDomainId || entry.domainId || entry.domain) && !entry.enrolledInternships) {
      return {
        enrollment_id: entry._id,
        name: entry.user?.name || entry.name || 'Unknown',
        email: entry.user?.email || entry.email || 'Unknown',
        courseName: entry.internshipDomainId?.name || entry.domainId?.name || entry.domain || 'No Internship',
        courseId: entry.internshipDomainId?._id || entry.domainId?._id || entry.domainId || 'N/A',
        batchName: entry.batch?.batchName || (typeof entry.batch === 'string' ? entry.batch : 'Unassigned'),
      };
    }
    
    const { _id, user, enrolledInternships } = entry;
    if (Array.isArray(enrolledInternships)) {
      return enrolledInternships.map(internEntry => ({
        enrollment_id: _id,
        name: user?.name || entry.name || 'Unknown',
        email: user?.email || entry.email || 'Unknown',
        courseName: internEntry.internshipDomainId?.name || internEntry.domainId?.name || 'No Internship',
        courseId: internEntry.internshipDomainId?._id || internEntry.domainId?._id || 'N/A', 
        batchName: internEntry.batch?.batchName || (typeof internEntry.batch === 'string' ? internEntry.batch : 'Unassigned'),
      }));
    }
    return [];
  });
};

  export const transformStudentEnrollmentData = (enrollments) => {
  return enrollments
    .filter((item) => item.course) // course must exist
    .map((item) => ({
      course_id: item.course._id,
      batch_id: item.batch?._id || null,
      title: item.course.name,
      description: item.course.description,
      batchName: item.batch?.batchName || "Unassigned",
    }));
};