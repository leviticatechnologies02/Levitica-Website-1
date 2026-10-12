import {
  useGetRazorpayConfigQuery,
  useCreateOrderMutation,
  useVerifyPaymentMutation
} from '@/Services/paymentServices/paymentServices';
import { loadRazorpay } from '@/utils/loadRazorpay';
import { toast } from "react-hot-toast";

export const useCheckoutHandler = () => {
  const { data: razorpayConfig } = useGetRazorpayConfigQuery();
  const [createOrder] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  const handleCheckout = async ({ courseIds, user, promoCode, promoId }) => {
    try {
      const sdkLoaded = await loadRazorpay();
      if (!sdkLoaded || !razorpayConfig) {
        toast.error("Unable to load Razorpay or config missing");
        return { success: false };
      }

      const orderResponse = await createOrder({
        courseIds,
        userId: user.id,
        promoCode,
        promoId
      }).unwrap();

      // Check if 100% free enrollment
      if (orderResponse.freeEnrollment) {
        toast.success(orderResponse.message || "Enrolled successfully!");
        return { success: true, freeEnrollment: true };
      }

      const order = orderResponse.order;
      if (!order?.id) {
        toast.error("No order ID received from backend");
        return { success: false };
      }

      return new Promise((resolve) => {
        const options = {
          key: razorpayConfig.keyId,
          amount: order.amount,
          currency: "INR",
          name: "Course Purchase",
          description: "Checkout for selected courses",
          order_id: order.id,
          handler: async function (response) {
            try {
              await verifyPayment({
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                userId: user.id
              });
              toast.success("Payment verified successfully!");
              resolve({ success: true });
            } catch (err) {
              toast.error(" Payment verification failed.");
              resolve({ success: false });
            }
          },
          prefill: {
            name: user.name,
            email: user.email
          },
          theme: { color: "#260b58ff" }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      });
    } catch (error) {
      console.error("Payment initiation failed:", error);
      toast.error("❌ Payment failed. Please try again.");
      return { success: false };
    }
  };

  return { handleCheckout };
};