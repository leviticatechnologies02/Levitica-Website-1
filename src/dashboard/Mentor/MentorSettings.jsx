import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiPhone, FiAward, FiLock, FiSave, FiCheckCircle } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useTheme } from "@/context/ThemeContext";
import {
  useGetMentorOverviewQuery,
  useUpdateMentorProfileMutation,
} from "@/Services/mentor/mentorPortalService";

const MentorSettings = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { data, isLoading } = useGetMentorOverviewQuery();
  const mentor = data?.data?.mentor;

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [expertise, setExpertise] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [updateProfile, { isLoading: isUpdating }] = useUpdateMentorProfileMutation();

  useEffect(() => {
    if (mentor) {
      setName(mentor.name || "");
      setMobile(mentor.mobile || "");
      setExpertise(
        Array.isArray(mentor.expertise) ? mentor.expertise.join(", ") : mentor.expertise || ""
      );
    }
  }, [mentor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const payload = {
        name,
        mobile,
        expertise: expertise
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      if (password) {
        payload.password = password;
      }

      await updateProfile(payload).unwrap();
      toast.success("Mentor profile updated successfully!");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-bold flex items-center gap-2.5 ${isDark ? "text-white" : "text-midnight_text"
            }`}>
            <FiUser className="text-primary" />
            Mentor Profile & Security
          </h1>
          <p className="text-sm text-gray mt-1">
            Manage your personal profile, areas of expertise, and login password.
          </p>
        </div>

        <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm ${isDark ? "bg-semidark border-dark_border text-white" : "bg-white border-border text-midnight_text"
          }`}>
          {isLoading ? (
            <div className="p-12 text-center text-sm text-gray">Loading profile...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase text-primary tracking-wider">
                  Profile Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none ${isDark ? "bg-darklight border-dark_border text-white" : "bg-white border-border"
                        }`}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold block mb-1">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={mentor?.email || ""}
                      className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none opacity-60 cursor-not-allowed ${isDark ? "bg-darklight border-dark_border text-white" : "bg-gray-100 border-border"
                        }`}
                    />
                    <span className="text-[10px] text-gray mt-0.5 block">Managed by Super Admin</span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold block mb-1">Mobile Number</label>
                    <input
                      type="text"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none ${isDark ? "bg-darklight border-dark_border text-white" : "bg-white border-border"
                        }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1">
                    Areas of Expertise (Comma separated)
                  </label>
                  <textarea
                    rows="2"
                    value={expertise}
                    onChange={(e) => setExpertise(e.target.value)}
                    placeholder="e.g. React, Python, Data Science"
                    className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none ${isDark ? "bg-darklight border-dark_border text-white" : "bg-white border-border"
                      }`}
                  />
                </div>
              </div>

              {/* Password Section */}
              <div className="space-y-4 pt-4 border-t border-border/40">
                <h3 className="text-sm font-bold uppercase text-primary tracking-wider">
                  Update Password
                </h3>
                <p className="text-xs text-gray">
                  Leave these fields blank if you do not wish to change your password.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold block mb-1">New Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none ${isDark ? "bg-darklight border-dark_border text-white" : "bg-white border-border"
                        }`}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold block mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none ${isDark ? "bg-darklight border-dark_border text-white" : "bg-white border-border"
                        }`}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold btn-primary flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <FiSave size={15} />
                  {isUpdating ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorSettings;
