import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AvatarEditor from "react-avatar-editor";
import {
  FiSettings,
  FiUser,
  FiMail,
  FiPhone,
  FiAward,
  FiLock,
  FiSave,
  FiCheckCircle,
  FiAlertCircle,
  FiX,
  FiCamera,
  FiTrash2,
  FiBookOpen,
  FiBriefcase,
  FiArrowRight,
} from "react-icons/fi";
import { Eye, EyeOff, User, ShieldAlert, BookOpen } from "lucide-react";
import { toast } from "react-hot-toast";
import { useTheme } from "@/context/ThemeContext";
import ProfileSidebar from "@/dashboard/Student/ProfileSideBar";
import {
  useGetMentorOverviewQuery,
  useUpdateMentorProfileMutation,
} from "@/Services/mentor/mentorPortalService";
import { useChangePasswordMutation } from "@/Services/authService";
import {
  useUpdateProfileImageMutation,
  useDeleteProfileImageMutation,
} from "@/Services/sharedServices/profileServices";
import { login, updateUserImage } from "@/features/authSlice";

const MentorSettings = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("profile");

  const { data, isLoading, refetch: refetchOverview } = useGetMentorOverviewQuery();
  const mentor = data?.data?.mentor;
  const assignedCourses = mentor?.courses || [];
  const assignedInternships = mentor?.internshipDomains || [];

  // Profile Form States
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [expertise, setExpertise] = useState("");

  // Avatar crop & upload states
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(user?.image || mentor?.profileImage?.url || null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [cropImage, setCropImage] = useState(null);

  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  // Password / Security Form States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Mutations
  const [updateMentorProfile, { isLoading: isUpdatingProfile }] =
    useUpdateMentorProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();
  const [updateProfileImage, { isLoading: isSavingImage }] =
    useUpdateProfileImageMutation();
  const [deleteProfileImage, { isLoading: isDeletingImage }] =
    useDeleteProfileImageMutation();

  useEffect(() => {
    if (mentor) {
      setName(mentor.name || user?.name || "");
      setMobile(mentor.mobile || user?.mobile || "");
      setExpertise(
        Array.isArray(mentor.expertise)
          ? mentor.expertise.join(", ")
          : mentor.expertise || ""
      );
      if (mentor.profileImage?.url) {
        setPreview(mentor.profileImage.url);
      }
    } else if (user) {
      setName(user.name || "");
      setMobile(user.mobile || "");
      if (user.image) {
        setPreview(user.image);
      }
    }
  }, [mentor, user]);

  // Image Selection Handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large (maximum size is 5MB)");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCropImage(reader.result);
      setShowCropModal(true);
      setZoom(1);
      setRotation(0);
    };
    reader.readAsDataURL(file);
  };

  // Crop & Apply Handler
  const handleSaveCrop = () => {
    if (!editorRef.current) return;

    const canvas = editorRef.current.getImageScaledToCanvas();

    canvas.toBlob(
      (blob) => {
        const croppedFile = new File([blob], "mentor-profile.jpg", {
          type: "image/jpeg",
        });

        setSelectedFile(croppedFile);
        setPreview(canvas.toDataURL());
        setShowCropModal(false);
        setCropImage(null);
        toast.success("Image cropped! Click 'Save Photo' to confirm upload.");
      },
      "image/jpeg",
      0.9
    );
  };

  // Upload Photo to Server
  const handleSavePhoto = async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append("profileImage", selectedFile);

      const res = await updateProfileImage(formData).unwrap();
      dispatch(updateUserImage(res.profileImage));
      toast.success("Profile photo updated successfully!");
      setSelectedFile(null);
      refetchOverview();
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to update profile photo");
    }
  };

  // Delete Photo Handler
  const handleRemoveImage = async () => {
    try {
      await deleteProfileImage().unwrap();
      setSelectedFile(null);
      setPreview(null);
      dispatch(updateUserImage(null));
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.success("Profile photo removed");
      refetchOverview();
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to remove photo");
    }
  };

  // Profile Details Submit Handler
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Full name is required");
      return;
    }

    try {
      const payload = {
        name: name.trim(),
        mobile: mobile.trim(),
        expertise: expertise
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      await updateMentorProfile(payload).unwrap();
      dispatch(
        login({
          user: {
            ...user,
            name: payload.name,
            mobile: payload.mobile,
          },
        })
      );
      toast.success("Mentor profile updated successfully!");
      refetchOverview();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  // Password Submit Handler
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      await changePassword({
        currentPassword,
        newPassword,
      }).unwrap();

      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update password");
    }
  };

  const inputClass = isDark
    ? "w-full border border-dark_border rounded-xl px-4 py-3 text-sm bg-darklight text-white placeholder-gray focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
    : "w-full border border-border rounded-xl px-4 py-3 text-sm bg-light text-midnight_text placeholder-gray focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition";

  const menuItems = [
    { id: "profile", label: "Profile", icon: <User size={18} /> },
    { id: "security", label: "Security", icon: <ShieldAlert size={18} /> },
    {
      id: "programs",
      label: `Assigned Programs (${assignedCourses.length + assignedInternships.length})`,
      icon: <BookOpen size={18} />,
    },
  ];

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-2"
        >
          <div className="flex items-center gap-4">
            <div>
              <h1
                className={`text-3xl sm:text-3xl font-bold ${
                  isDark ? "text-white" : "text-midnight_text"
                }`}
              >
                Account Settings
              </h1>
              <p className="text-sm sm:text-base flex items-center gap-2 text-gray mt-1">
                <FiSettings className="w-4 h-4 text-primary" />
                Manage your profile, security, and account preferences.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 sm:gap-8">
          {/* Left Sidebar Card */}
          <div
            className={`${
              isDark ? "bg-semidark border-dark_border" : "bg-white border-border"
            } border rounded-2xl shadow-property p-4 sm:p-6 h-fit lg:sticky lg:top-8`}
          >
            <ProfileSidebar
              user={{
                ...user,
                name: mentor?.name || user?.name || "Mentor",
                email: mentor?.email || user?.email || "",
                role: "Mentor",
                image: preview || user?.image,
              }}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              isDark={isDark}
              menuItems={menuItems}
            />
          </div>

          {/* Right Content Card */}
          <div
            className={`${
              isDark ? "bg-semidark border-dark_border" : "bg-white border-border"
            } border rounded-2xl shadow-property p-6 sm:p-8`}
          >
            {/* Tab 1: Profile Information */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      isDark ? "bg-primary/20" : "bg-primary/10"
                    }`}
                  >
                    <FiUser className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2
                      className={`text-xl font-semibold ${
                        isDark ? "text-white" : "text-midnight_text"
                      }`}
                    >
                      Profile Information
                    </h2>
                    <p className="text-sm text-gray mt-0.5">
                      Update your personal details and profile photo
                    </p>
                  </div>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-6 pt-2">
                  {/* Avatar Section */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 pb-2">
                    <div
                      className={`relative w-24 h-24 rounded-full overflow-hidden cursor-pointer group shadow-lg ${
                        isDark ? "bg-darkmode" : "bg-section"
                      }`}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {preview ? (
                        <img
                          src={preview}
                          alt="Mentor Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary to-skyBlue text-white text-3xl font-semibold">
                          {(mentor?.name || user?.name || "M").charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <FiCamera className="text-white h-6 w-6" />
                      </div>
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <p
                        className={`font-semibold text-lg ${
                          isDark ? "text-white" : "text-midnight_text"
                        }`}
                      >
                        {mentor?.name || user?.name || "Mentor"}
                      </p>
                      <p className="text-sm text-gray mb-3">
                        {mentor?.email || user?.email}
                      </p>

                      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold btn-border transition cursor-pointer"
                        >
                          <FiCamera className="h-3.5 w-3.5" />
                          Change Photo
                        </button>

                        {selectedFile && (
                          <button
                            type="button"
                            onClick={handleSavePhoto}
                            disabled={isSavingImage}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold btn-border-save transition disabled:opacity-50 cursor-pointer"
                          >
                            <FiSave className="h-3.5 w-3.5" />
                            {isSavingImage ? "Saving..." : "Save Photo"}
                          </button>
                        )}

                        {preview && !selectedFile && (
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            disabled={isDeletingImage}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold btn-border-delete transition disabled:opacity-50 cursor-pointer"
                          >
                            <FiTrash2 className="h-3.5 w-3.5" />
                            {isDeletingImage ? "Removing..." : "Remove"}
                          </button>
                        )}
                      </div>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>

                  {/* Form Inputs */}
                  <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label
                        className={`block mb-2 text-sm font-medium ${
                          isDark ? "text-gray" : "text-midnight_text"
                        }`}
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className={inputClass}
                        required
                      />
                    </div>

                    {/* Email Address */}
                    <div>
                      <label
                        className={`block mb-2 text-sm font-medium ${
                          isDark ? "text-gray" : "text-midnight_text"
                        }`}
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={mentor?.email || user?.email || ""}
                          disabled
                          className={`${inputClass} ${
                            isDark
                              ? "bg-darkmode/50 text-gray cursor-not-allowed"
                              : "bg-section/50 text-gray cursor-not-allowed"
                          }`}
                        />
                        <FiMail className="absolute right-4 top-3.5 h-4 w-4 text-gray" />
                      </div>
                      <p className="text-xs text-gray mt-1">
                        Email cannot be changed. Contact support for assistance.
                      </p>
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label
                        className={`block mb-2 text-sm font-medium ${
                          isDark ? "text-gray" : "text-midnight_text"
                        }`}
                      >
                        Mobile Number
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          placeholder="e.g. +91 9876543210"
                          className={inputClass}
                        />
                        <FiPhone className="absolute right-4 top-3.5 h-4 w-4 text-gray" />
                      </div>
                    </div>

                    {/* Areas of Expertise */}
                    <div>
                      <label
                        className={`block mb-2 text-sm font-medium ${
                          isDark ? "text-gray" : "text-midnight_text"
                        }`}
                      >
                        Areas of Expertise (Comma separated)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={expertise}
                          onChange={(e) => setExpertise(e.target.value)}
                          placeholder="e.g. Performance Testing, React, Node.js, Web Development"
                          className={inputClass}
                        />
                        <FiAward className="absolute right-4 top-3.5 h-4 w-4 text-gray" />
                      </div>
                      <p className="text-xs text-gray mt-1">
                        Subjects and domains you specialize in for mentorship.
                      </p>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isUpdatingProfile}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl disabled:opacity-50 text-white font-medium transition shadow-md hover:shadow-lg btn-primary cursor-pointer"
                    >
                      <FiSave className="h-4 w-4" />
                      {isUpdatingProfile ? "Saving Changes..." : "Save Changes"}
                    </motion.button>
                  </div>
                </form>
              </div>
            )}

            {/* Tab 2: Security Settings */}
            {activeTab === "security" && (
              <div className="space-y-6 sm:space-y-8">
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        isDark ? "bg-primary/20" : "bg-primary/10"
                      }`}
                    >
                      <FiLock className="h-5 w-5 text-primary" />
                    </div>
                    <h2
                      className={`text-xl sm:text-2xl font-bold ${
                        isDark ? "text-white" : "text-midnight_text"
                      }`}
                    >
                      Security Settings
                    </h2>
                  </div>
                  <p className="text-sm text-gray">
                    Keep your account secure by updating your password regularly
                  </p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-5 sm:space-y-6">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <label
                      className={`text-sm font-semibold ${
                        isDark ? "text-gray" : "text-midnight_text"
                      }`}
                    >
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPass ? "text" : "password"}
                        placeholder="Enter your current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className={inputClass}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute right-4 top-3.5 transition text-gray hover:text-primary cursor-pointer"
                      >
                        {showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <label
                      className={`text-sm font-semibold ${
                        isDark ? "text-gray" : "text-midnight_text"
                      }`}
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPass ? "text" : "password"}
                        placeholder="Create a new password (8+ characters)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={inputClass}
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-4 top-3.5 transition text-gray hover:text-primary cursor-pointer"
                      >
                        {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label
                      className={`text-sm font-semibold ${
                        isDark ? "text-gray" : "text-midnight_text"
                      }`}
                    >
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPass ? "text" : "password"}
                        placeholder="Confirm your new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={inputClass}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute right-4 top-3.5 transition text-gray hover:text-primary cursor-pointer"
                      >
                        {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div
                    className={`p-4 rounded-xl ${
                      isDark
                        ? "bg-darkmode border-dark_border"
                        : "bg-section border-border"
                    } border`}
                  >
                    <p className="text-xs font-semibold mb-2 text-primary">
                      Password Requirements:
                    </p>
                    <ul className="space-y-1.5">
                      <li className="flex items-center gap-2 text-xs text-gray">
                        <FiCheckCircle className="h-3 w-3 text-primary" />
                        Minimum 8 characters
                      </li>
                      <li className="flex items-center gap-2 text-xs text-gray">
                        <FiCheckCircle className="h-3 w-3 text-primary" />
                        Use a mix of letters, numbers, and symbols
                      </li>
                      <li className="flex items-center gap-2 text-xs text-gray">
                        <FiCheckCircle className="h-3 w-3 text-primary" />
                        Avoid reusing previous passwords
                      </li>
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div
                    className={`flex gap-3 pt-4 border-t ${
                      isDark ? "border-dark_border" : "border-border"
                    }`}
                  >
                    <button
                      type="submit"
                      disabled={isChangingPassword}
                      className="flex-1 flex items-center justify-center gap-2 btn-primary py-3 sm:py-3.5 rounded-xl text-sm font-semibold transition shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50"
                    >
                      <FiSave className="h-4.5 w-4.5" />
                      {isChangingPassword ? "Updating Password..." : "Update Password"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCurrentPassword("");
                        setNewPassword("");
                        setConfirmPassword("");
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 sm:py-3.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                        isDark
                          ? "border-2 border-dark_border hover:border-primary hover:bg-darklight text-gray hover:text-white"
                          : "border-2 border-border hover:border-primary hover:bg-light text-gray hover:text-midnight_text"
                      }`}
                    >
                      <FiX className="h-4.5 w-4.5" />
                      Reset Fields
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tab 3: Assigned Programs */}
            {activeTab === "programs" && (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      isDark ? "bg-primary/20" : "bg-primary/10"
                    }`}
                  >
                    <FiBookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2
                      className={`text-xl font-semibold ${
                        isDark ? "text-white" : "text-midnight_text"
                      }`}
                    >
                      Assigned Teaching Programs
                    </h2>
                    <p className="text-sm text-gray mt-0.5">
                      Courses and Industrial Internship domains assigned to you by Administration
                    </p>
                  </div>
                </div>

                {isLoading ? (
                  <div className="p-12 text-center text-sm text-gray">
                    Loading your assigned programs...
                  </div>
                ) : assignedCourses.length === 0 && assignedInternships.length === 0 ? (
                  <div className="p-12 text-center text-gray space-y-2">
                    <FiBookOpen size={36} className="mx-auto text-primary opacity-30" />
                    <p className="font-semibold text-sm">No programs assigned yet</p>
                    <p className="text-xs">
                      Contact your Super Admin to be assigned to courses or internships.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Courses Section */}
                    {assignedCourses.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                            Assigned Courses ({assignedCourses.length})
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          {assignedCourses.map((c) => (
                            <div
                              key={c._id}
                              className={`p-4 rounded-2xl border transition ${
                                isDark
                                  ? "bg-darklight/40 border-dark_border hover:border-primary/40"
                                  : "bg-slate-50 border-border hover:border-primary/40"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="space-y-1">
                                  <h4 className="font-bold text-sm line-clamp-1">{c.name}</h4>
                                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-gray">
                                    {c.category && (
                                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
                                        {c.category}
                                      </span>
                                    )}
                                    {c.duration && <span>• {c.duration}</span>}
                                    {c.level && <span>• {c.level}</span>}
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3 pt-3 border-t border-border/30 flex items-center justify-between">
                                <Link
                                  to={`/dashboard/mentor/assignments?courseId=${c._id}`}
                                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                                >
                                  View Assessments <FiArrowRight size={12} />
                                </Link>
                                <Link
                                  to="/dashboard/mentor/live-classes"
                                  className="text-xs font-semibold text-gray hover:text-white"
                                >
                                  Live Classes
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Internships Section */}
                    {assignedInternships.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                            Assigned Industrial Internships ({assignedInternships.length})
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          {assignedInternships.map((d) => (
                            <div
                              key={d._id}
                              className={`p-4 rounded-2xl border transition ${
                                isDark
                                  ? "bg-darklight/40 border-dark_border hover:border-amber-500/40"
                                  : "bg-slate-50 border-border hover:border-amber-500/40"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="space-y-1">
                                  <h4 className="font-bold text-sm line-clamp-1">{d.name}</h4>
                                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-gray">
                                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 font-semibold border border-amber-500/20">
                                      {d.focus || "Industrial Internship"}
                                    </span>
                                    {d.level && <span>• {d.level}</span>}
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3 pt-3 border-t border-border/30 flex items-center justify-between">
                                <Link
                                  to={`/dashboard/mentor/assignments?domainId=${d._id}`}
                                  className="text-xs font-semibold text-amber-500 hover:underline flex items-center gap-1"
                                >
                                  View Assessments <FiArrowRight size={12} />
                                </Link>
                                <Link
                                  to="/dashboard/mentor/live-classes"
                                  className="text-xs font-semibold text-gray hover:text-white"
                                >
                                  Live Classes
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Avatar Cropping Modal */}
      {showCropModal && cropImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-2xl p-6 shadow-2xl max-w-md w-full ${
              isDark ? "bg-semidark border border-dark_border" : "bg-white border border-border"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3
                className={`text-lg font-semibold ${
                  isDark ? "text-white" : "text-midnight_text"
                }`}
              >
                Crop Profile Photo
              </h3>
              <button
                onClick={() => setShowCropModal(false)}
                className={`p-1 rounded-lg transition cursor-pointer ${
                  isDark ? "hover:bg-darklight text-gray" : "hover:bg-light text-gray"
                }`}
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="flex justify-center overflow-hidden rounded-xl">
              <AvatarEditor
                ref={editorRef}
                image={cropImage}
                width={250}
                height={250}
                border={40}
                borderRadius={125}
                scale={zoom}
                rotate={rotation}
              />
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className={isDark ? "text-gray" : "text-midnight_text"}>Zoom</span>
                <span className="text-primary font-bold">{Math.round(zoom * 100)}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="2.5"
                step="0.01"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-primary/20 accent-primary"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCropModal(false)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isDark
                    ? "text-gray hover:bg-darklight"
                    : "text-gray hover:bg-light"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCrop}
                className="px-5 py-2 text-white rounded-xl text-xs font-semibold transition shadow-md hover:shadow-lg btn-primary cursor-pointer"
              >
                Apply Crop
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MentorSettings;
