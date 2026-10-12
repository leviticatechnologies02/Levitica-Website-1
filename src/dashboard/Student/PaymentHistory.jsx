import { motion } from "framer-motion";
import { CheckCircle, XCircle, CreditCard, Calendar, Hash, Wallet, IndianRupee } from "lucide-react";
import { useGetMyPaymentsQuery } from '@/Services/paymentServices/paymentServices';
import { useTheme } from '@/context/ThemeContext';

const PaymentTab = () => {
  const { data, isLoading, isError } = useGetMyPaymentsQuery();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const payments = data?.payments || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="relative">
          <div className={`w-10 h-10 border-4 rounded-full animate-spin ${
            isDark ? 'border-dark_border border-t-primary' : 'border-border border-t-primary'
          }`}></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`text-center py-12 px-4 rounded-xl ${
        isDark ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-500/10 text-rose-600'
      }`}>
        <XCircle className="h-10 w-10 mx-auto mb-2" />
        <p className="text-sm font-medium">Failed to load payment history</p>
        <p className="text-xs mt-1 opacity-75">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
          isDark ? 'bg-primary/20' : 'bg-primary/10'
        }`}>
          <CreditCard className={`h-5 w-5 text-primary`} />
        </div>
        <div>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-midnight_text'}`}>
            Payment History
          </h2>
          <p className={`text-sm text-gray mt-0.5`}>
            View all your course payments and transaction details
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      {payments.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className={`rounded-xl p-3 border ${
            isDark ? 'bg-darklight border-dark_border' : 'bg-light border-border'
          }`}>
            <p className={`text-xs text-gray mb-1`}>Total Payments</p>
            <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-midnight_text'}`}>
              {payments.length}
            </p>
          </div>
          <div className={`rounded-xl p-3 border ${
            isDark ? 'bg-darklight border-dark_border' : 'bg-light border-border'
          }`}>
            <p className={`text-xs text-gray mb-1`}>Total Spent</p>
            <p className={`text-xl font-bold text-primary`}>
              ₹{payments.reduce((sum, p) => sum + p.amountInRupees, 0).toLocaleString('en-IN')}
            </p>
          </div>
          <div className={`rounded-xl p-3 border ${
            isDark ? 'bg-darklight border-dark_border' : 'bg-light border-border'
          }`}>
            <p className={`text-xs text-gray mb-1`}>Successful</p>
            <p className={`text-xl font-bold text-emerald-500`}>
              {payments.filter(p => p.status === 'paid').length}
            </p>
          </div>
          <div className={`rounded-xl p-3 border ${
            isDark ? 'bg-darklight border-dark_border' : 'bg-light border-border'
          }`}>
            <p className={`text-xs text-gray mb-1`}>Payment Methods</p>
            <p className={`text-sm font-semibold text-primary mt-1`}>
              {[...new Set(payments.map(p => p.paymentMode).filter(Boolean))].join(', ') || 'N/A'}
            </p>
          </div>
        </div>
      )}

      {/* Payments List */}
      <div className={`rounded-2xl border shadow-property overflow-hidden ${
        isDark ? 'bg-semidark border-dark_border' : 'bg-white border-border'
      }`}>
        <div className={`h-0.5 bg-gradient-to-r from-primary to-skyBlue`} />

        {payments.length === 0 ? (
          <div className={`p-12 text-center`}>
            <Wallet className={`h-12 w-12 mx-auto mb-3 ${isDark ? 'text-gray' : 'text-gray'}`} />
            <p className={`text-sm font-medium ${isDark ? 'text-gray' : 'text-midnight_text'}`}>
              No payments found
            </p>
            <p className={`text-xs text-gray mt-1`}>
              Your payment history will appear here once you make a purchase
            </p>
          </div>
        ) : (
          <div className="divide-y ${isDark ? 'divide-dark_border' : 'divide-border'}">
            {payments.map((payment, index) => (
              <motion.div
                key={payment._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 sm:p-5 transition-all duration-200 ${
                  isDark ? 'hover:bg-darklight' : 'hover:bg-light'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">

                  {/* LEFT SECTION */}
                  <div className="flex-1 space-y-3">
                    {/* Courses */}
                    <div className="space-y-2">
                      {payment.courseIds?.map((course, idx) => (
                        <div key={course._id || idx} className="flex items-center gap-3">
                          {/* Thumbnail */}
                          <div className="w-14 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary/20 to-skyBlue/20">
                            {course.thumbnail ? (
                              <img
                                src={course.thumbnail}
                                alt={course.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <CreditCard className="h-5 w-5 text-primary" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold truncate ${
                              isDark ? 'text-white' : 'text-midnight_text'
                            }`}>
                              {course.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className={`text-xs ${isDark ? 'text-gray' : 'text-gray'}`}>
                                {course.category}
                              </span>
                              <span className={`text-xs ${isDark ? 'text-gray' : 'text-gray'}`}>•</span>
                              <span className={`text-xs font-medium text-primary`}>
                                ₹{Number(course.price || 0).toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar className={`h-3.5 w-3.5 ${isDark ? 'text-gray' : 'text-gray'}`} />
                        <span className={`text-xs ${isDark ? 'text-gray' : 'text-gray'}`}>
                          {new Date(payment.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Hash className={`h-3.5 w-3.5 ${isDark ? 'text-gray' : 'text-gray'}`} />
                        <span className={`text-xs ${isDark ? 'text-gray' : 'text-gray'}`}>
                          ID: {payment.orderId?.slice(-8) || payment._id?.slice(-8)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT SECTION */}
                  <div className="sm:text-right space-y-2 flex-shrink-0">
                    {/* Amount */}
                    <div className="flex items-center sm:justify-end gap-1">
                      <IndianRupee className={`h-4 w-4 ${isDark ? 'text-primary' : 'text-primary'}`} />
                      <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-midnight_text'}`}>
                        {payment.amountInRupees.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Payment Mode */}
                    <div className="flex items-center sm:justify-end gap-1.5">
                      <Wallet className={`h-3.5 w-3.5 ${isDark ? 'text-gray' : 'text-gray'}`} />
                      <span className={`text-xs capitalize ${isDark ? 'text-gray' : 'text-gray'}`}>
                        {payment.paymentMode || 'N/A'}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center sm:justify-end gap-1.5">
                      {payment.status === "paid" ? (
                        <>
                          <CheckCircle size={14} className="text-emerald-500" />
                          <span className={`text-xs font-semibold text-emerald-500`}>
                            Paid
                          </span>
                        </>
                      ) : payment.status === "pending" ? (
                        <>
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></div>
                          <span className={`text-xs font-semibold text-amber-500`}>
                            Pending
                          </span>
                        </>
                      ) : payment.status === "failed" ? (
                        <>
                          <XCircle size={14} className="text-rose-500" />
                          <span className={`text-xs font-semibold text-rose-500`}>
                            Failed
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle size={14} className={`${isDark ? 'text-gray' : 'text-gray'}`} />
                          <span className={`text-xs capitalize ${isDark ? 'text-gray' : 'text-gray'}`}>
                            {payment.status}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Note */}
      {payments.length > 0 && (
        <div className={`text-center text-xs text-gray pt-2`}>
          <p>For any payment-related issues, please contact our support team.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentTab;