import { createApi } from "@reduxjs/toolkit/query/react";
import { createApiService } from '@/config/apiConfig';

export const api = createApi(
  createApiService({
    reducerPath: "api",
    baseUrl: "",
    tagTypes: [
      "Auth",
      "Course",
      "Batch",
      "BatchStudents",
      "Enrollments",
      "Payment",
      "Transaction",
      "Cart",
      "Zoom",
      "LiveClass",
      "Stats",
      "Internship",
      "InternshipDomain",
      "StudentReports",
      "Promos",
      "Mentor",
      "Assignment",
      "AssignmentSubmission"
    ],
    
  })
);