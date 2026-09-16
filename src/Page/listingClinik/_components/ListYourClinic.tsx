import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Check,
  Building2,
  User,
  ShieldCheck,
  Upload,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Sparkles,
  Mail,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { signup, ApiError } from "../../../lib/authApi";
import { useAuthStore } from "../../../store/authStore";

// ─── Country Data ─────────────────────────────────────────────────────────────
const countries = [
  { code: "AE", name: "UAE", dial: "+971", flag: "🇦🇪" },
  { code: "US", name: "United States", dial: "+1", flag: "🇺🇸" },
  { code: "GB", name: "UK", dial: "+44", flag: "🇬🇧" },
  { code: "SG", name: "Singapore", dial: "+65", flag: "🇸🇬" },
  { code: "MY", name: "Malaysia", dial: "+60", flag: "🇲🇾" },
  { code: "TH", name: "Thailand", dial: "+66", flag: "🇹🇭" },
  { code: "IN", name: "India", dial: "+91", flag: "🇮🇳" },
  { code: "SA", name: "Saudi Arabia", dial: "+966", flag: "🇸🇦" },
  { code: "QA", name: "Qatar", dial: "+974", flag: "🇶🇦" },
  { code: "KW", name: "Kuwait", dial: "+965", flag: "🇰🇼" },
  { code: "DE", name: "Germany", dial: "+49", flag: "🇩🇪" },
  { code: "FR", name: "France", dial: "+33", flag: "🇫🇷" },
  { code: "AU", name: "Australia", dial: "+61", flag: "🇦🇺" },
  { code: "CA", name: "Canada", dial: "+1", flag: "🇨🇦" },
  { code: "TR", name: "Turkey", dial: "+90", flag: "🇹🇷" },
  { code: "BD", name: "Bangladesh", dial: "+880", flag: "🇧🇩" },
];

function CountryDropdown({
  selected,
  onChange,
}: {
  selected: (typeof countries)[0];
  onChange: (c: (typeof countries)[0]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial.includes(search)
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs text-gray-700 hover:border-sky-400 focus:outline-none transition"
      >
        <span className="flex items-center gap-2">
          <span className="text-base">{selected.flag}</span>
          <span className="font-medium">{selected.name}</span>
          <span className="text-gray-400 text-[11px]">{selected.dial}</span>
        </span>
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute z-30 top-full left-0 right-0 mt-1 bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden"
          >
            <div className="p-2 border-b border-gray-100">
              <input
                ref={searchRef}
                type="text"
                placeholder="Search country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-gray-50 text-xs text-gray-700 placeholder-gray-400 outline-none"
              />
            </div>
            <div className="max-h-48 overflow-y-auto pb-1">
              {filtered.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    onChange(c);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-sky-50 text-left transition ${
                    c.code === selected.code ? "bg-sky-50 text-sky-600 font-semibold" : "text-gray-700"
                  }`}
                >
                  <span>{c.flag}</span>
                  <span className="flex-1">{c.name}</span>
                  <span className="text-gray-400 text-[11px]">{c.dial}</span>
                  {c.code === selected.code && <Check size={12} className="text-sky-500" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ListYourClinic() {
  const navigate = useNavigate();
  const setPendingVerificationEmail = useAuthStore(
    (state) => state.setPendingVerificationEmail
  );

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // Step 1: Owner Credentials
  const [ownerData, setOwnerData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [country, setCountry] = useState(countries[3]); // Default Singapore

  // Step 2: Clinic & Facility
  const [clinicData, setClinicData] = useState({
    clinicName: "",
    clinicGroup: "",
    city: "Singapore",
    address: "",
    bedCount: "12",
    treatmentHD: true,
    treatmentHDF: true,
    isolationHIV: true,
    isolationHBV: true,
    isolationHCV: true,
  });

  // Step 3: Medical Accreditation & Licensing
  const [licenseData, setLicenseData] = useState({
    licenseNumber: "",
    accreditationBody: "Ministry of Health (MOH)",
    documentFileName: "",
    agreeTerms: true,
    agreeMedicalCompliance: true,
  });

  const signupMutation = useMutation({
    mutationFn: (payload: any) => signup(payload),
    onSuccess: (res, vars) => {
      const email = res.data.email || vars.email;
      setPendingVerificationEmail(email);
      // Display the dedicated Under Review & Check Mail confirmation screen
      setIsSubmittedSuccess(true);
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError) setErrorMsg(err.message);
      else if (err instanceof Error) setErrorMsg(err.message);
      else setErrorMsg("Clinic registration failed. Please try again.");
    },
  });

  const validateStep1 = () => {
    setErrorMsg("");
    if (!ownerData.fullName.trim() || ownerData.fullName.trim().length < 3) {
      setErrorMsg("Please enter your full legal name.");
      return false;
    }
    if (!ownerData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerData.email)) {
      setErrorMsg("Please enter a valid work email address.");
      return false;
    }
    if (!ownerData.password || ownerData.password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return false;
    }
    if (ownerData.password !== ownerData.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return false;
    }
    if (!ownerData.phone.trim()) {
      setErrorMsg("Please provide your contact phone number.");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    setErrorMsg("");
    if (!clinicData.clinicName.trim()) {
      setErrorMsg("Please enter your official clinic or center name.");
      return false;
    }
    if (!clinicData.address.trim()) {
      setErrorMsg("Please enter the physical address of the facility.");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    setErrorMsg("");
    if (!licenseData.licenseNumber.trim()) {
      setErrorMsg("Please enter your medical facility registration/license number.");
      return false;
    }
    if (!licenseData.agreeTerms || !licenseData.agreeMedicalCompliance) {
      setErrorMsg("You must accept the terms of service and healthcare compliance policies.");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setPendingVerificationEmail(ownerData.email.trim());
    setIsSubmittedSuccess(true);

    signupMutation.mutate({
      fullName: ownerData.fullName.trim(),
      email: ownerData.email.trim(),
      password: ownerData.password,
      confirmPassword: ownerData.confirmPassword,
      termAndCondition: licenseData.agreeTerms,
      privacyPolicy: licenseData.agreeMedicalCompliance,
      accountType: "CLINIC_OWNER",
    });
  };

  // ─── POST-SUBMISSION UNDER REVIEW & CHECK MAIL CONFIRMATION VIEW ───
  if (isSubmittedSuccess) {
    return (
      <section className="min-h-screen w-full bg-gradient-to-b from-sky-50/50 via-white to-gray-50 flex items-center justify-center px-4 py-16 mt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 sm:p-10 text-center space-y-6"
        >
          {/* Animated Success Badge */}
          <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 size={40} className="stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
              <Clock size={13} /> Application Received • Under Review
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Your Request Has Been Submitted!
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto leading-relaxed">
              Your clinic registration and medical documents are currently under review by our Medical Compliance Team.
              <strong className="text-gray-900 block mt-1">
                For further assessment, review updates, and email verification, please check your mail.
              </strong>
            </p>
          </div>

          {/* Submission Info Box */}
          <div className="bg-gray-50/90 rounded-2xl p-5 border border-gray-200 text-left text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200/60 pb-2.5">
              <span className="text-gray-500 font-medium">Submitted Clinic</span>
              <span className="font-bold text-gray-900">{clinicData.clinicName || "Medical Center"}</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-200/60 pb-2.5">
              <span className="text-gray-500 font-medium">Contact Email</span>
              <span className="font-semibold text-sky-600 flex items-center gap-1">
                <Mail size={13} /> {ownerData.email}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-200/60 pb-2.5">
              <span className="text-gray-500 font-medium">Facility License No.</span>
              <span className="font-semibold text-gray-800">{licenseData.licenseNumber || "Submitted"}</span>
            </div>
            <div className="flex items-center justify-between pt-0.5">
              <span className="text-gray-500 font-medium">Estimated Assessment Time</span>
              <span className="font-bold text-amber-700">24 – 48 Hours</span>
            </div>
          </div>

          {/* Steps Timeline Box */}
          <div className="bg-sky-50/70 border border-sky-100 rounded-2xl p-4 text-xs text-left text-sky-950 space-y-2">
            <p className="font-bold text-sky-900 flex items-center gap-1.5">
              <Sparkles size={14} className="text-sky-600" /> What happens next?
            </p>
            <ol className="list-decimal list-inside space-y-1 text-sky-800 text-[11px] leading-relaxed">
              <li>Open your inbox and verify your email address using the confirmation code.</li>
              <li>Our medical administration team audits your facility license and serology safety protocols.</li>
              <li>Once approved by Super Admin, your clinic will go live on the MedBook search marketplace!</li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() =>
                navigate(`/varification?email=${encodeURIComponent(ownerData.email)}&type=clinic`)
              }
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs shadow-md shadow-sky-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Mail size={15} />
              Verify Email OTP Now
            </button>
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs transition text-center"
            >
              Return to Homepage
            </Link>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="min-h-screen w-full bg-gradient-to-b from-sky-50/40 via-white to-gray-50 flex items-center justify-center px-4 py-12 mt-28">
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Col: Healthcare Provider Value Proposition */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck size={14} className="text-emerald-700" />
            MedBook Healthcare Partner Network
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
            Connect your Dialysis Clinic with Global Kidney Patients
          </h1>

          <p className="text-gray-600 text-sm leading-relaxed">
            Join our verified network of certified dialysis and nephrology centers.
            Accept international holidaymaker bookings, coordinate seamless treatments,
            and expand your clinic’s global reach.
          </p>

          <div className="space-y-3 pt-2">
            {[
              "Verified international medical travel patient bookings",
              "Super Admin certification & quality trust badge",
              "Full shift schedule & machine capacity controls",
              "Pre-arrival patient serology & medical record review",
            ].map((text, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Check size={13} strokeWidth={3} />
                </div>
                <span className="text-xs sm:text-sm text-gray-700 font-medium">
                  {text}
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-sky-900 text-xs flex items-start gap-3">
            <Sparkles size={18} className="text-sky-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Manual Compliance Review</p>
              <p className="text-sky-700 mt-0.5">
                Every listed facility is verified by our medical administration team
                before going live to ensure patient safety standards.
              </p>
            </div>
          </div>
        </div>

        {/* Right Col: 3-Step Healthcare Onboarding Wizard */}
        <div className="lg:col-span-7 bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8">
          {/* Stepper Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
              <span className={step >= 1 ? "text-sky-600" : ""}>
                1. Owner Account
              </span>
              <span className={step >= 2 ? "text-sky-600" : ""}>
                2. Clinic Profile
              </span>
              <span className={step >= 3 ? "text-sky-600" : ""}>
                3. Verification & Documents
              </span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-sky-500 h-full rounded-full transition-all duration-300"
                style={{ width: step === 1 ? "33%" : step === 2 ? "66%" : "100%" }}
              />
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {/* ── STEP 1: OWNER ACCOUNT CREDENTIALS ── */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <User size={18} className="text-sky-500" />
                      Clinic Owner Credentials
                    </h2>
                    <p className="text-xs text-gray-500">
                      Create your administrator login to manage your medical center.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Arthur Vance"
                      value={ownerData.fullName}
                      onChange={(e) =>
                        setOwnerData({ ...ownerData, fullName: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Official Work / Clinic Email *
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. director@novenadialysis.com"
                      value={ownerData.email}
                      onChange={(e) =>
                        setOwnerData({ ...ownerData, email: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Min. 8 characters"
                          value={ownerData.password}
                          onChange={(e) =>
                            setOwnerData({ ...ownerData, password: e.target.value })
                          }
                          className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 text-xs text-gray-800 outline-none focus:border-sky-400"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Repeat password"
                          value={ownerData.confirmPassword}
                          onChange={(e) =>
                            setOwnerData({
                              ...ownerData,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 text-xs text-gray-800 outline-none focus:border-sky-400"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={15} />
                          ) : (
                            <Eye size={15} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Country
                      </label>
                      <CountryDropdown selected={country} onChange={setCountry} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Contact Phone *
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. 6789 0123"
                        value={ownerData.phone}
                        onChange={(e) =>
                          setOwnerData({ ...ownerData, phone: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 outline-none focus:border-sky-400"
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 2: CLINIC & FACILITY PROFILE ── */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Building2 size={18} className="text-sky-500" />
                      Clinic & Facility Details
                    </h2>
                    <p className="text-xs text-gray-500">
                      Provide details about your dialysis stations and serology isolation units.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Clinic / Hospital Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Al Rahman Advanced Kidney Care"
                        value={clinicData.clinicName}
                        onChange={(e) =>
                          setClinicData({
                            ...clinicData,
                            clinicName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 outline-none focus:border-sky-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Healthcare Group / Chain (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Parkway Healthcare Group"
                        value={clinicData.clinicGroup}
                        onChange={(e) =>
                          setClinicData({
                            ...clinicData,
                            clinicGroup: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 outline-none focus:border-sky-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Singapore"
                        value={clinicData.city}
                        onChange={(e) =>
                          setClinicData({ ...clinicData, city: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 outline-none focus:border-sky-400"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Full Street Address *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 123 Medical Boulevard, Novena #08-12"
                        value={clinicData.address}
                        onChange={(e) =>
                          setClinicData({
                            ...clinicData,
                            address: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 outline-none focus:border-sky-400"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Total Active Dialysis Stations / Beds
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={clinicData.bedCount}
                      onChange={(e) =>
                        setClinicData({ ...clinicData, bedCount: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 outline-none focus:border-sky-400 font-semibold"
                    />
                  </div>

                  <div>
                    <span className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Accepted Infectious Conditions (Dedicated Isolation Bays):
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: "isolationHIV", label: "HIV+" },
                        { key: "isolationHBV", label: "Hepatitis B" },
                        { key: "isolationHCV", label: "Hepatitis C" },
                      ].map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() =>
                            setClinicData({
                              ...clinicData,
                              [item.key]:
                                !clinicData[item.key as keyof typeof clinicData],
                            })
                          }
                          className={`p-2 rounded-xl border text-xs font-medium transition ${
                            clinicData[item.key as keyof typeof clinicData]
                              ? "bg-amber-50 border-amber-300 text-amber-950"
                              : "bg-gray-50 border-gray-200 text-gray-400"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 3: MEDICAL ACCREDITATION & DOCUMENTS ── */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <ShieldCheck size={18} className="text-emerald-600" />
                      Medical Accreditation & Verification
                    </h2>
                    <p className="text-xs text-gray-500">
                      Submit healthcare regulatory documents for Super Admin review.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Facility License / Reg. Number *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. MOH-SG-2026-8910"
                        value={licenseData.licenseNumber}
                        onChange={(e) =>
                          setLicenseData({
                            ...licenseData,
                            licenseNumber: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 outline-none focus:border-sky-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Accreditation Authority
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ministry of Health"
                        value={licenseData.accreditationBody}
                        onChange={(e) =>
                          setLicenseData({
                            ...licenseData,
                            accreditationBody: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 outline-none focus:border-sky-400"
                      />
                    </div>
                  </div>

                  {/* Document Upload Area */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Upload Medical License / Certification (PDF, JPG, PNG)
                    </label>
                    <label className="border-2 border-dashed border-gray-200 hover:border-sky-400 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer bg-gray-50/50 hover:bg-sky-50/30 transition">
                      <Upload size={22} className="text-sky-500" />
                      <span className="text-xs font-semibold text-gray-700">
                        {licenseData.documentFileName || "Select Certificate / Operating License"}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        Upload official facility registration for Super Admin review
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setLicenseData({
                              ...licenseData,
                              documentFileName: file.name,
                            });
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* Agreements */}
                  <div className="space-y-2.5 pt-2">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-gray-600">
                      <input
                        type="checkbox"
                        checked={licenseData.agreeTerms}
                        onChange={(e) =>
                          setLicenseData({
                            ...licenseData,
                            agreeTerms: e.target.checked,
                          })
                        }
                        className="mt-0.5 w-4 h-4 text-sky-600 rounded cursor-pointer"
                      />
                      <span>
                        I confirm that the clinic operates in compliance with international dialysis safety standards and patient hygiene protocols.
                      </span>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-gray-600">
                      <input
                        type="checkbox"
                        checked={licenseData.agreeMedicalCompliance}
                        onChange={(e) =>
                          setLicenseData({
                            ...licenseData,
                            agreeMedicalCompliance: e.target.checked,
                          })
                        }
                        className="mt-0.5 w-4 h-4 text-sky-600 rounded cursor-pointer"
                      />
                      <span>
                        I understand that our clinic listing will be reviewed by MedBook's medical administration team before public activation.
                      </span>
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation & Submit Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s - 1) as 1 | 2)}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition cursor-pointer"
                >
                  <ArrowLeft size={14} /> Back
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-xl shadow-xs transition cursor-pointer"
                >
                  Continue <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={signupMutation.isPending}
                  className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
                >
                  {signupMutation.isPending ? "Submitting Application..." : "Submit Clinic for Verification"}
                  <Check size={15} />
                </button>
              )}
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
            Already have a verified clinic account?{" "}
            <Link to="/signin" className="font-semibold text-sky-600 hover:underline">
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}