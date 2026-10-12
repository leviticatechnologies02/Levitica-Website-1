import { api } from '@/Services/api';

export const promoServices = api.injectEndpoints({
  endpoints: (builder) => ({

    applyPromo: builder.mutation({
      query: (data) => ({
        url: "/api/promo/apply",
        method: "POST",
        body: data,
      }),
    }),

  }),
});

export const {
  useApplyPromoMutation,
} = promoServices;