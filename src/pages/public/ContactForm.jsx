import { Formik, Form, Field, ErrorMessage } from "formik";
import toast from "react-hot-toast";
import * as Yup from "yup";

const ContactUsForm = () => {

  const sendEmail = async (values, actions) => {
    const env = import.meta.env.VITE_ENV;
    const baseURL =
      env === "production"
        ? import.meta.env.VITE_PROD_API_URL
        : import.meta.env.VITE_LOCAL_API_URL;

    try {
      const res = await fetch(`${baseURL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Message sent successfully!");
        actions.resetForm();
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      toast.error("Failed to send message");
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ name: "", email: "", mobile: "", message: "" }}
      validationSchema={Yup.object({
        name: Yup.string().required("Name is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        mobile: Yup.string()
          .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
          .required("Mobile number is required"),
        message: Yup.string().required("Message is required"),
      })}
      onSubmit={sendEmail}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">

          <div>
            <Field
              name="name"
              placeholder="Your Name"
              className="w-full border border-gray-300 dark:border-dark_border/30 rounded-lg px-4 py-2 bg-white dark:bg-semidark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-cyan"
            />
            <ErrorMessage name="name" component="p" className="text-red-500 text-sm" />
          </div>

          <div>
            <Field
              name="email"
              type="email"
              placeholder="Email Address"
              className="w-full border border-gray-300 dark:border-dark_border/30 rounded-lg px-4 py-2 bg-white dark:bg-semidark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-cyan"
            />
            <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />
          </div>

          <div>
            <Field
              name="mobile"
              placeholder="Mobile Number"
              className="w-full border border-gray-300 dark:border-dark_border/30 rounded-lg px-4 py-2 bg-white dark:bg-semidark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-cyan"
            />
            <ErrorMessage name="mobile" component="p" className="text-red-500 text-sm" />
          </div>

          <div>
            <Field
              as="textarea"
              name="message"
              rows="5"
              placeholder="Your Messages"
              className="w-full border border-gray-300 dark:border-dark_border/30 rounded-lg px-4 py-2 bg-white dark:bg-semidark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-cyan"
            />
            <ErrorMessage name="message" component="p" className="text-red-500 text-sm" />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>

        </Form>
      )}
    </Formik>
  );
};

export default ContactUsForm;
