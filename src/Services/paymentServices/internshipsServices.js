import { api } from '@/Services/api';

export const internshipsApi = api.injectEndpoints({
  endpoints: (builder) => ({

    /* ================= GET ALL INTERNSHIP DOMAINS ================= */
    getAllInternshipsDomains: builder.query({
      query: (params = {}) => ({
        url: "/internship",
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: "InternshipDomain",
                id: _id,
              })),
              { type: "InternshipDomain", id: "LIST" },
            ]
          : [{ type: "InternshipDomain", id: "LIST" }],
    }),

    /* ================= CREATE RAZORPAY ORDER ================= */
    createInternshipOrder: builder.mutation({
      query: (orderData) => ({
        url: "/internship/payments/create-order",
        method: "POST",
        body: orderData,
      }),
    }),

    /* ================= VERIFY RAZORPAY PAYMENT ================= */
    verifyInternshipPayment: builder.mutation({
      query: (paymentData) => ({
        url: "/internship/payments/verify-payment",
        method: "POST",
        body: paymentData,
      }),
    }),

    /* ================= SAVE PAYMENT DETAILS ================= */
    saveInternshipPayment: builder.mutation({
      query: (paymentDetails) => ({
        url: "/internship/payments/save-payment",
        method: "POST",
        body: paymentDetails,
      }),
    }),

    /* ================= GET MY INTERNSHIPS ================= */
    getMyInternships: builder.query({
      query: () => ({
        url: "/internship/my-internships",
        method: "GET",
      }),
    }),

    /* ================= GET SINGLE INTERNSHIP DETAILS ================= */
    getMyInternshipDetails: builder.query({
      query: (id) => ({
        url: `/internship/my-internships/${id}`,
        method: "GET",
      }),
    }),

  }),

  overrideExisting: false,
});

export const {
  useGetAllInternshipsDomainsQuery,
  useCreateInternshipOrderMutation,
  useVerifyInternshipPaymentMutation,
  useSaveInternshipPaymentMutation,
  useGetMyInternshipsQuery,
  useGetMyInternshipDetailsQuery,
} = internshipsApi;