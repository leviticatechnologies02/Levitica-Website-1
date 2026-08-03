import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loadRazorpay } from '@/utils/loadRazorpay';

import {
  useCreateInternshipOrderMutation,
} from '@/Services/paymentServices/internshipsServices';

export const usePayment = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [createOrder] = useCreateInternshipOrderMutation();


  const handlePayment = async (formData) => {
    setIsLoading(true);

    try {
      const sdkLoaded = await loadRazorpay();
      if (!sdkLoaded) {
        toast.error('Unable to load Razorpay');
        setIsLoading(false);
        return;
      }

      // 1️⃣ Create order (RTK Query)
      const orderResponse = await createOrder(formData).unwrap();

      if (!orderResponse.success) {
        throw new Error(orderResponse.message || 'Order creation failed');
      }

      const { order } = orderResponse;

      // 2️⃣ Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || orderResponse.key,
        amount: order.amount,
        currency: order.currency,
        name: 'Levitica Technologies',
        description: `Payment for Internship - ${formData.domain}`,
        image: '/img/leviticalogo.png',
        order_id: order.id,
        handler: async function (response) {

          navigate(
            `/internships/payment-success?orderId=${response.razorpay_order_id}&paymentId=${response.razorpay_payment_id}&signature=${response.razorpay_signature}`
          );

        },

        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },

        notes: {
          internship: formData.domain,
          customer_id: formData.email,
        },

        theme: {
          color: '#4F46E5',
        },

        modal: {
          ondismiss: () => setIsLoading(false),
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      toast.error(error.message || 'Payment failed');
      setIsLoading(false);
    }
  };


  return {
    handlePayment,
    isLoading,
  };
};
