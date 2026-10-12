import { api } from "@/Services/api";

export const assignmentAdminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminAssignments: builder.query({
      query: (params = {}) => ({
        url: "/admin/assignments",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.assignments
          ? [
              ...result.assignments.map(({ _id }) => ({
                type: "Assignment",
                id: _id,
              })),
              { type: "Assignment", id: "LIST" },
            ]
          : [{ type: "Assignment", id: "LIST" }],
    }),

    getAdminAssignmentById: builder.query({
      query: (id) => ({
        url: `/admin/assignments/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Assignment", id }],
    }),

    createAssignment: builder.mutation({
      query: (body) => ({
        url: "/admin/assignments",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Assignment", id: "LIST" }],
    }),

    updateAssignment: builder.mutation({
      query: ({ id, body }) => ({
        url: `/admin/assignments/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Assignment", id },
        { type: "Assignment", id: "LIST" },
      ],
    }),

    deleteAssignment: builder.mutation({
      query: (id) => ({
        url: `/admin/assignments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Assignment", id: "LIST" }],
    }),

    getAssignmentSubmissions: builder.query({
      query: ({ assignmentId, ...params }) => ({
        url: `/admin/assignments/${assignmentId}/submissions`,
        method: "GET",
        params,
      }),
      providesTags: (result, error, { assignmentId }) => [
        { type: "AssignmentSubmission", id: assignmentId },
      ],
    }),

    gradeSubmission: builder.mutation({
      query: ({ submissionId, ...body }) => ({
        url: `/admin/assignments/submissions/${submissionId}/grade`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [
        { type: "Assignment", id: "LIST" },
        { type: "AssignmentSubmission" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdminAssignmentsQuery,
  useGetAdminAssignmentByIdQuery,
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
  useGetAssignmentSubmissionsQuery,
  useGradeSubmissionMutation,
} = assignmentAdminApi;
