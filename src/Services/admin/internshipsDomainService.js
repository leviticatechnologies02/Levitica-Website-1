import { api } from '@/Services/api';

export const internshipsDomainApi = api.injectEndpoints({
  endpoints: (builder) => ({

    /* ================= GET DOMAIN BY ID ================= */
    getInternshipsDomainById: builder.query({
      query: (id) => ({
        url: `/admin/internshipsdomain/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: "InternshipDomain", id },
      ],
    }),

    /* ================= CREATE DOMAIN ================= */
    createInternshipsDomain: builder.mutation({
      query: (domainData) => ({
        url: "/admin/internshipsdomain",
        method: "POST",
        body: domainData,
      }),
      invalidatesTags: [{ type: "InternshipDomain", id: "LIST" }],
    }),

    /* ================= UPDATE DOMAIN ================= */
    updateInternshipsDomain: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/admin/internshipsdomain/${id}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "InternshipDomain", id },
        { type: "InternshipDomain", id: "LIST" },
      ],
    }),

    /* ================= DELETE DOMAIN ================= */
    deleteInternshipsDomain: builder.mutation({
      query: (id) => ({
        url: `/admin/internshipsdomain/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "InternshipDomain", id },
        { type: "InternshipDomain", id: "LIST" },
      ],
    }),

    /* ================= GET CURRICULUM ================= */
    getInternshipCurriculum: builder.query({
      query: (id) => ({
        url: `/admin/internshipsdomain/${id}/curriculum`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: "InternshipDomain", id },
      ],
    }),

    /* ================= UPDATE CURRICULUM ================= */
    updateInternshipCurriculum: builder.mutation({
      query: ({ id, curriculum }) => ({
        url: `/admin/internshipsdomain/${id}/curriculum`,
        method: "PUT",
        body: { curriculum },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "InternshipDomain", id },
        { type: "InternshipDomain", id: "LIST" },
      ],
    }),

    /* ================= ADD CURRICULUM WEEK ================= */
    addCurriculumWeek: builder.mutation({
      query: ({ id, ...weekData }) => ({
        url: `/admin/internshipsdomain/${id}/curriculum/week`,
        method: "POST",
        body: weekData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "InternshipDomain", id },
      ],
    }),

    /* ================= UPDATE CURRICULUM WEEK ================= */
    updateCurriculumWeek: builder.mutation({
      query: ({ id, weekId, ...weekData }) => ({
        url: `/admin/internshipsdomain/${id}/curriculum/week/${weekId}`,
        method: "PUT",
        body: weekData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "InternshipDomain", id },
      ],
    }),

    /* ================= DELETE CURRICULUM WEEK ================= */
    deleteCurriculumWeek: builder.mutation({
      query: ({ id, weekId }) => ({
        url: `/admin/internshipsdomain/${id}/curriculum/week/${weekId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "InternshipDomain", id },
      ],
    }),

    /* ================= ADD SESSION TO WEEK ================= */
    addSessionToWeek: builder.mutation({
      query: ({ id, weekId, title }) => ({
        url: `/admin/internshipsdomain/${id}/curriculum/week/${weekId}/session`,
        method: "POST",
        body: { title },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "InternshipDomain", id },
      ],
    }),

    /* ================= DELETE SESSION FROM WEEK ================= */
    deleteSessionFromWeek: builder.mutation({
      query: ({ id, weekId, sessionId }) => ({
        url: `/admin/internshipsdomain/${id}/curriculum/week/${weekId}/session/${sessionId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "InternshipDomain", id },
      ],
    }),

  }),

  overrideExisting: false,
});

export const {
  useGetInternshipsDomainByIdQuery,
  useLazyGetInternshipsDomainByIdQuery,
  useCreateInternshipsDomainMutation,
  useUpdateInternshipsDomainMutation,
  useDeleteInternshipsDomainMutation,
  useGetInternshipCurriculumQuery,
  useUpdateInternshipCurriculumMutation,
  useAddCurriculumWeekMutation,
  useUpdateCurriculumWeekMutation,
  useDeleteCurriculumWeekMutation,
  useAddSessionToWeekMutation,
  useDeleteSessionFromWeekMutation,
} = internshipsDomainApi;