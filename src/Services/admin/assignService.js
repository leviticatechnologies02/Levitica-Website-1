import { api } from '@/Services/api';

export const assignApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUnassignedEnrollments: builder.query({
      query: () => ({
        url: "/admin/enroll/unassigned",
        method: "GET",
      }),
      providesTags: ["Enrollments"],
    }),

    assignStudentsToBatch: builder.mutation({
      query: (payload) => ({
        url: "/admin/enroll/assign",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Enrollments"],
    }),

    getAssignedEnrollments: builder.query({
      query: () => ({
        url: "/admin/enroll/assigned",
        method: "GET",
      }),
      providesTags: ["Enrollments"],
    }),

    getUnassignedInternships: builder.query({
      query: () => ({
        url: "/admin/enroll/internships/unassigned",
        method: "GET",
      }),
      providesTags: ["InternshipEnrollments"],
    }),

    assignStudentsToInternshipBatch: builder.mutation({
      query: (payload) => ({
        url: "/admin/enroll/internships/assign",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["InternshipEnrollments"],
    }),

    getAssignedInternships: builder.query({
      query: () => ({
        url: "/admin/enroll/internships/assigned",
        method: "GET",
      }),
      providesTags: ["InternshipEnrollments"],
    }),
    getStudentEnrollments: builder.query({
      query: (userId) => ({
        url: `/student/enrollments/${userId}`,
        method: "GET",
      }),
      providesTags: ["Enrollments"],
    }),
  }),

  overrideExisting: false, // safer for code splitting
});

export const {
  useGetStudentEnrollmentsQuery,
  useLazyGetUnassignedEnrollmentsQuery,
  useAssignStudentsToBatchMutation,
  useGetAssignedEnrollmentsQuery,
  useLazyGetUnassignedInternshipsQuery,
  useAssignStudentsToInternshipBatchMutation,
  useGetAssignedInternshipsQuery,
} = assignApi;