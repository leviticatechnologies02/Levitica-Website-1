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

//used in unassigned for send data to genaric table
export  const flattenEnrollments=(arr)=> {

    return arr?.flatMap(entry => {
     
      const {_id, user, enrolledCourses } = entry;
      return enrolledCourses.map(courseEntry => ({
        enrollment_id:_id,
        name: user.name,
        email: user.email,
        courseName: courseEntry.course?.name || 'No Course',
        courseId: courseEntry.course?._id || 'N/A', 
        batchName: courseEntry.batch?.batchName || 'Unassigned',
       
      }));
    });
  }

export const flattenInternshipEnrollments = (arr) => {
    console.log("flattenInternshipEnrollments input:", arr);
    return arr?.flatMap(entry => {
      // If it's just an array of payments directly
      if ((entry.internshipDomainId || entry.domainId) && !entry.enrolledInternships) {
        console.log("Flattening entry:", entry);
        return {
          enrollment_id: entry._id,
          name: entry.user?.name || entry.name || 'Unknown',
          email: entry.user?.email || entry.email || 'Unknown',
          courseName: entry.internshipDomainId?.name || entry.domainId?.name || 'No Internship',
          courseId: entry.internshipDomainId?._id || entry.domainId?._id || 'N/A',
          batchName: entry.batch?.batchName || 'Unassigned',
        };
      }
      
      const {_id, user, enrolledInternships } = entry;
      if (enrolledInternships) {
          return enrolledInternships.map(internEntry => ({
            enrollment_id:_id,
            name: user?.name || 'Unknown',
            email: user?.email || 'Unknown',
            courseName: internEntry.internshipDomainId?.name || 'No Internship',
            courseId: internEntry.internshipDomainId?._id || 'N/A', 
            batchName: internEntry.batch?.batchName || 'Unassigned',
          }));
      }
      return [];
    });
}

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