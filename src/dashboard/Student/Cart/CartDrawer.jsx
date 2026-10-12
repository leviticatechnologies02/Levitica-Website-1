import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  setCartItems,
  selectCartTotal,
} from '@/features/cartSlice';
import { useGetCartQuery } from '@/Services/student/cartServices';
import { useGetFreeCourseQuery } from '@/Services/sharedServices/courses.Services';
import { useCartHandlers } from "./cartHandlers";
import {
  FiX,
  FiTrash2,
  FiShoppingBag,
  FiArrowRight,
} from "react-icons/fi";
import { useEffect } from "react";
import { useCheckoutHandler } from '@/features/paymentFlow';

export default function CartDrawer({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id;

  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  const { data: cartData } = useGetCartQuery(userId, {
    skip: !userId || !isOpen,
  });

  const { data: freeData } = useGetFreeCourseQuery(undefined, {
    skip: !isOpen,
  });

  const freeCourse = freeData?.data?.[0];

  const {
    handleRemoveFromCart,
    handleClearCart,
    removeStatus,
    clearStatus,
  } = useCartHandlers();

  const loading = removeStatus.isLoading || clearStatus.isLoading;
  const { handleCheckout } = useCheckoutHandler();

  useEffect(() => {
    if (cartData?.items) {
      dispatch(setCartItems(cartData.items));
    }
  }, [cartData, dispatch]);

  const hasPaidItems = items.some((item) => item.price > 0);

  const displayItems =
    hasPaidItems && freeCourse
      ? [
          ...items,
          ...(items.some((i) => i._id === freeCourse._id)
            ? []
            : [freeCourse]),
        ]
      : items;

  const handleBuyNow = async () => {
    if (!user || items.length === 0) return;

    const courseIds = items.map((item) => item._id);
    const { success } = await handleCheckout({ courseIds, user });

    if (success) {
      await handleClearCart(user.id);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* OVERLAY */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* DRAWER */}
          <motion.div
            className="
              fixed top-0 right-0
              h-screen
              w-full sm:w-[420px]
              bg-white dark:bg-semidark
              border-l border-border dark:border-dark_border
              z-50
              flex flex-col
            "
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
          >

            {/* HEADER */}
            <div className="flex-shrink-0 bg-white dark:bg-semidark border-b border-border dark:border-dark_border">
              <div className="flex items-center justify-between p-5">

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-light dark:bg-darklight flex items-center justify-center">
                    <FiShoppingBag className="text-primary text-lg" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-midnight_text dark:text-white">
                      Your Cart
                    </h2>
                    <p className="text-xs text-gray">
                      {items.length > 0
                        ? `${items.length} course${items.length > 1 ? "s" : ""} selected`
                        : "No courses added yet"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-light dark:hover:bg-darklight"
                >
                  <FiX size={18} />
                </button>

              </div>
            </div>

            {/* ITEMS (SCROLL AREA) */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 rounded-full bg-light dark:bg-darklight flex items-center justify-center">
                    <FiShoppingBag size={36} className="text-gray" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-midnight_text dark:text-white">
                    Your cart is empty
                  </h3>
                  <p className="text-sm text-gray mt-1">
                    Browse courses and add them to your cart
                  </p>
                </div>
              ) : (
                displayItems.map((item) => {
                  const isFree = item.price === 0;

                  return (
                    <div
                      key={item._id}
                      className={`
                        flex gap-4
                        border border-border dark:border-dark_border
                        rounded-2xl p-4
                        bg-white dark:bg-darklight
                        transition hover:shadow-deatail_shadow
                        ${isFree ? "ring-2 ring-primary/20" : ""}
                      `}
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-light dark:bg-darkmode flex-shrink-0">
                        <img
                          src={item?.thumbnail || "/img/course-placeholder.png"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-sm text-midnight_text dark:text-white line-clamp-2">
                            {item.name}
                          </h4>

                          {!isFree && (
                            <button
                              disabled={loading}
                              onClick={() =>
                                handleRemoveFromCart({
                                  userId,
                                  courseId: item._id,
                                })
                              }
                              className="text-gray hover:text-primary"
                            >
                              <FiTrash2 />
                            </button>
                          )}
                        </div>

                        <p className="mt-2 text-base font-bold text-midnight_text dark:text-white">
                          {isFree ? (
                            <span className="text-primary">FREE 🎁</span>
                          ) : (
                            `₹${Number(item.price || 0).toLocaleString('en-IN')}`
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* FOOTER */}
            {items.length > 0 && (
              <div className="flex-shrink-0 bg-white dark:bg-semidark border-t border-border dark:border-dark_border p-5">

                {hasPaidItems && (
                  <p className="text-primary text-sm mb-2">
                    🎉 Bonus course included for free!
                  </p>
                )}

                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray">Total Amount</span>
                  <span className="text-2xl font-bold text-midnight_text dark:text-white">
                    ₹{Number(total || 0).toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  onClick={handleBuyNow}
                  disabled={loading}
                  className="
                    w-full
                    bg-primary hover:bg-skyBlue
                    text-white
                    font-semibold
                    rounded-xl
                    py-3.5
                    flex items-center justify-center gap-2
                    shadow-property
                    hover:shadow-deatail_shadow
                    transition-all
                  "
                >
                  Proceed to Checkout
                  <FiArrowRight />
                </button>

              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}