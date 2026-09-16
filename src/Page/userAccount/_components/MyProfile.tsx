"use client";

import { useState, useRef } from "react";

const MyProfile = () => {
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const dobRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    fullName: "Sarah Johnson",
    gender: "Female",
    dob: "2004-10-12",
    nationality: "United States",
    address: "123 Medical Plaza, Suite 456, New York, NY 10001",
    email: "sarah.johnson@email.com",
  });

  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatar(URL.createObjectURL(file));
  };

  const validate = () => {
    const newErrors: Partial<typeof form> = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!form.gender.trim()) newErrors.gender = "Gender is required.";
    if (!form.dob) newErrors.dob = "Date of birth is required.";
    if (!form.nationality.trim()) newErrors.nationality = "Nationality is required.";
    if (!form.address.trim()) newErrors.address = "Address is required.";
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    console.log("Form submitted:", form);
    alert("Profile saved successfully!");
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-[14px] py-[10px] text-sm text-gray-700 border rounded-lg outline-none bg-white transition ${
      hasError
        ? "border-red-400 focus:border-red-400"
        : "border-gray-200 focus:border-sky-400"
    }`;

  return (
    <div className="bg-gray-100 rounded-xl p-7">

      {/* Header */}
      <h2 className="text-base font-semibold text-gray-900 mb-1">My Profile</h2>
      <p className="text-xs text-gray-500 mb-6">
        Manage your personal information and keep your profile up to date.
      </p>

      {/* Avatar */}
      <div className="mb-7">
        <p className="text-[0.82rem] font-medium text-gray-700 mb-2.5">Profile Photo</p>
        <div className="flex items-end">
          <div className="relative w-14 h-14">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-300">
              <img
                src={avatar || "https://i.pravatar.cc/56?img=47"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-0.5 -right-0.5 bg-white border border-gray-200 rounded-full w-5.5 h-5.5 flex items-center justify-center cursor-pointer p-0"
            >
              <svg width="11" height="11" fill="none" stroke="#6b7280" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
          <span className="text-[0.72rem] text-gray-500 ml-1.5 mb-0.5">Edit</span>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8">

          {/* Full Name */}
          <div>
            <label className="block text-[0.8rem] font-medium text-gray-700 mb-1.5">Full Name</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={inputClass(!!errors.fullName)}
            />
            {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-[0.8rem] font-medium text-gray-700 mb-1.5">Gender</label>
            <div className="relative">
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className={`${inputClass(!!errors.gender)} appearance-none cursor-pointer pr-9`}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option> 
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender}</p>}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-[0.8rem] font-medium text-gray-700 mb-1.5">Date of Birth</label>
            <div className="relative">
              <input
                ref={dobRef}
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
                className={`${inputClass(!!errors.dob)} pr-10 scheme-ligh`}
              />
            </div>
            {errors.dob && <p className="text-xs text-red-500 mt-1">{errors.dob}</p>}
          </div>

          {/* Nationality */}
          <div>
            <label className="block text-[0.8rem] font-medium text-gray-700 mb-1.5">Nationality</label>
            <input
              name="nationality"
              value={form.nationality}
              onChange={handleChange}
              placeholder="Enter your nationality"
              className={inputClass(!!errors.nationality)}
            />
            {errors.nationality && <p className="text-xs text-red-500 mt-1">{errors.nationality}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="block text-[0.8rem] font-medium text-gray-700 mb-1.5">Address</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter your address"
              className={inputClass(!!errors.address)}
            />
            {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-[0.8rem] font-medium text-gray-700 mb-1.5">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={inputClass(!!errors.email)}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

        </div>

        {/* Save Button */}
        <div className="mt-7">
          <button
            type="submit"
            className="bg-sky-400 hover:bg-sky-500 active:bg-sky-600 text-white rounded-lg px-6 py-2 text-sm font-medium transition"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default MyProfile;