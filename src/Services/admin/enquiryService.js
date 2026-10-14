import { api } from '@/Services/api';

export const enquiryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEnquiries: builder.query({
      query: (params) => ({
        url: "/admin/enquiries",
        method: "GET",
        params,
      }),
      providesTags: ["Enquiries"],
    }),

    deleteEnquiry: builder.mutation({
      query: (id) => ({
        url: `/admin/enquiries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Enquiries"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetEnquiriesQuery,
  useDeleteEnquiryMutation,
} = enquiryApi;
