import { api } from '@/Services/api';

export const batchApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // ✅ GET ALL BATCHES
    getBatches: builder.query({
      query: ({ page = 1, limit = 10, status } = {}) => ({
        url: "/admin/batchs",
        params: {
          page,
          limit,
          ...(status ? { status } : {}),
        },
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: "Batch",
                id: _id,
              })),
              { type: "Batch", id: "LIST" },
            ]
          : [{ type: "Batch", id: "LIST" }],
    }),

    // ✅ GET STUDENTS OF A BATCH
    getBatchstudents: builder.query({
      query: ({ batchId, page = 1, limit = 10 }) => ({
        url: `/admin/batchs/${batchId}`,
        method: "GET",
        params: { page, limit },
      }),
      providesTags: (result, error, { batchId }) => [
        { type: "BatchStudents", id: batchId },
        { type: "Batch", id: batchId },
      ],
    }),

    // ✅ ADD BATCH
    addBatch: builder.mutation({
      query: (newBatchData) => ({
        url: "/admin/batchs/",
        method: "POST",
        body: newBatchData,
      }),
      invalidatesTags: [{ type: "Batch", id: "LIST" }],
    }),

    // ✅ UPDATE BATCH
    updateBatch: builder.mutation({
      query: ({ batchId, updatedData }) => ({
        url: `/admin/batchs/${batchId}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: (result, error, { batchId }) => [
        { type: "Batch", id: batchId },
        { type: "Batch", id: "LIST" },
        { type: "BatchStudents", id: batchId },
      ],
    }),

    // ✅ DELETE BATCH
    deleteBatch: builder.mutation({
      query: (batchId) => ({
        url: `/admin/batchs/deleteBatch/${batchId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, batchId) => [
        { type: "Batch", id: batchId },
        { type: "Batch", id: "LIST" },
        { type: "BatchStudents", id: batchId },
      ],
    }),

    // ✅ GET BATCHES BY COURSE
    getBatchesByCourse: builder.query({
      query: (courseId) => ({
        url: `/admin/batchs/by-course/${courseId}`,
      }),
    }),

    // ✅ GET BATCHES BY INTERNSHIP
    getBatchesByInternship: builder.query({
      query: (internshipDomainId) => ({
        url: `/admin/batchs/by-internship/${internshipDomainId}`,
      }),
    }),

  }),

  overrideExisting: false,
});

export const {
  useGetBatchesQuery,
  useGetBatchesByCourseQuery,
  useGetBatchesByInternshipQuery,
  useGetBatchstudentsQuery,
  useAddBatchMutation,
  useUpdateBatchMutation,
  useDeleteBatchMutation,
} = batchApi;