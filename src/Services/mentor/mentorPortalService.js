import { api } from "@/Services/api";

export const mentorPortalApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMentorOverview: builder.query({
      query: () => ({
        url: "/mentor/overview",
        method: "GET",
      }),
      providesTags: ["Mentor", "Assignment", "AssignmentSubmission", "Batch", "LiveClass"],
    }),

    getMentorCourses: builder.query({
      query: () => ({
        url: "/mentor/courses",
        method: "GET",
      }),
      providesTags: ["Mentor", "Course"],
    }),

    getMentorBatches: builder.query({
      query: () => ({
        url: "/mentor/batches",
        method: "GET",
      }),
      providesTags: ["Batch"],
    }),

    getMentorStudents: builder.query({
      query: () => ({
        url: "/mentor/students",
        method: "GET",
      }),
      providesTags: ["BatchStudents", "Enrollments"],
    }),

    getMentorAssignments: builder.query({
      query: () => ({
        url: "/mentor/assignments",
        method: "GET",
      }),
      providesTags: ["Assignment", "AssignmentSubmission"],
    }),

    createMentorAssignment: builder.mutation({
      query: (body) => ({
        url: "/mentor/assignments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Assignment", "Mentor"],
    }),

    updateMentorAssignment: builder.mutation({
      query: ({ id, body }) => ({
        url: `/mentor/assignments/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Assignment", "Mentor"],
    }),

    deleteMentorAssignment: builder.mutation({
      query: (id) => ({
        url: `/mentor/assignments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Assignment", "Mentor"],
    }),

    getMentorAssignmentSubmissions: builder.query({
      query: (assignmentId) => ({
        url: `/mentor/assignments/${assignmentId}/submissions`,
        method: "GET",
      }),
      providesTags: (result, error, assignmentId) => [
        { type: "AssignmentSubmission", id: assignmentId },
      ],
    }),

    gradeMentorSubmission: builder.mutation({
      query: ({ submissionId, ...body }) => ({
        url: `/mentor/assignments/submissions/${submissionId}/grade`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Assignment", "AssignmentSubmission", "Mentor"],
    }),

    getMentorLiveClasses: builder.query({
      query: () => ({
        url: "/mentor/live-classes",
        method: "GET",
      }),
      providesTags: ["LiveClass"],
    }),

    updateMentorProfile: builder.mutation({
      query: (body) => ({
        url: "/mentor/profile",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Mentor", "Auth"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMentorOverviewQuery,
  useGetMentorCoursesQuery,
  useGetMentorBatchesQuery,
  useGetMentorStudentsQuery,
  useGetMentorAssignmentsQuery,
  useCreateMentorAssignmentMutation,
  useUpdateMentorAssignmentMutation,
  useDeleteMentorAssignmentMutation,
  useGetMentorAssignmentSubmissionsQuery,
  useGradeMentorSubmissionMutation,
  useGetMentorLiveClassesQuery,
  useUpdateMentorProfileMutation,
} = mentorPortalApi;
