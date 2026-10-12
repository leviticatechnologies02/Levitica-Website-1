import { api } from "@/Services/api";

export const assignmentStudentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStudentAssignments: builder.query({
      query: (params = {}) => ({
        url: "/student/assignments",
        method: "GET",
        params,
      }),
      providesTags: ["Assignment", "AssignmentSubmission"],
    }),

    getStudentAssignmentDetails: builder.query({
      query: (id) => ({
        url: `/student/assignments/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: "Assignment", id },
        { type: "AssignmentSubmission", id },
      ],
    }),

    submitAssignment: builder.mutation({
      query: ({ id, body }) => ({
        url: `/student/assignments/${id}/submit`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Assignment", "AssignmentSubmission"],
    }),

    getMySubmission: builder.query({
      query: (id) => ({
        url: `/student/assignments/${id}/my-submission`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: "AssignmentSubmission", id },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetStudentAssignmentsQuery,
  useGetStudentAssignmentDetailsQuery,
  useSubmitAssignmentMutation,
  useGetMySubmissionQuery,
} = assignmentStudentApi;
