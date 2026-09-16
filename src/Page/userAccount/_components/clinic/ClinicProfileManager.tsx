import React, { useState } from "react";
import {
  Building2,
  MapPin,
  Image as ImageIcon,
  Check,
  Plus,
  Trash2,
  Save,
  DollarSign,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const defaultFacilities = [
  "Multilingual Staff",
  "Free High-Speed Wi-Fi",
  "Private Treatment Rooms",
  "Personal Entertainment TV",
  "24/7 On-Call Nephrologist",
  "Wheelchair Accessible",
  "Light Meals & Dietary Refreshments",
  "Emergency Intensive Care Unit",
  "Free Patient Parking",
  "Airport Transfer Assistance",
];

const defaultInsurances = [
  "European Health Insurance Card (EHIC)",
  "Global Health Insurance Card (GHIC)",
  "Allianz Care",
  "Bupa Global",
  "Cigna Global",
  "AXA International",
];

const defaultPaymentMethods = [
  "Credit / Debit Card",
  "Cash on Arrival",
  "Direct Bank Transfer",
  "International Travel Insurance Direct Billing",
];

export default function ClinicProfileManager() {
  const [form, setForm] = useState({
    name: "Al Rahman Advanced Dialysis & Kidney Care Centre",
    title: "World-Class International Dialysis Services with Dedicated Isolation Units",
    description:
      "We provide trusted, cutting-edge hemodialysis and hemodiafiltration treatments tailored for international travelers and holidaymakers. Equipped with modern Fresenius 5008S machines, multilingual nurses, and serene private treatment suites.",
    country: "Singapore",
    city: "Singapore",
    address: "123 Medical Boulevard, Novena Medical Hub #08-12",
    latitude: "1.3201",
    longitude: "103.8436",
    perTreatmentPrice: "280",
    distanceFromCenter: "2.4 km from Orchard Road",
  });

  const [facilities, setFacilities] = useState<string[]>([
    "Multilingual Staff",
    "Free High-Speed Wi-Fi",
    "Private Treatment Rooms",
    "Personal Entertainment TV",
    "24/7 On-Call Nephrologist",
    "Wheelchair Accessible",
  ]);

  const [insurances, setInsurances] = useState<string[]>([
    "European Health Insurance Card (EHIC)",
    "Global Health Insurance Card (GHIC)",
    "Bupa Global",
    "Cigna Global",
  ]);

  const [paymentMethods, setPaymentMethods] = useState<string[]>([
    "Credit / Debit Card",
    "Cash on Arrival",
    "Direct Bank Transfer",
  ]);

  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop",
  ]);

  const [isSaved, setIsSaved] = useState(false);

  const toggleItem = (list: string[], setList: (v: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Top Banner with Save Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Clinic Profile & Branding</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Update clinic photos, facilities, address, and patient amenities
          </p>
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-2.5 rounded-2xl shadow-xs transition-all cursor-pointer shrink-0"
        >
          <Save size={16} />
          {isSaved ? "Saved Successfully!" : "Save Changes"}
        </button>
      </div>

      <AnimatePresence>
        {isSaved && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2"
          >
            <Check size={16} className="text-emerald-600" />
            Clinic profile settings and facilities updated successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Basic Clinic Information */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-7 shadow-xs space-y-5">
        <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
          <Building2 size={18} className="text-sky-500" />
          General Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Clinic Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Headline / Tagline *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              About Clinic & Medical Care Description *
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition resize-none leading-relaxed"
              required
            />
          </div>
        </div>
      </div>

      {/* Location & Map Coordinates */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-7 shadow-xs space-y-5">
        <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
          <MapPin size={18} className="text-sky-500" />
          Location & Geo-Coordinates
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Country *
            </label>
            <input
              type="text"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              City *
            </label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Full Physical Address *
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Latitude
            </label>
            <input
              type="text"
              value={form.latitude}
              onChange={(e) => setForm({ ...form, latitude: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Longitude
            </label>
            <input
              type="text"
              value={form.longitude}
              onChange={(e) => setForm({ ...form, longitude: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Distance from City Center Landmark
            </label>
            <input
              type="text"
              value={form.distanceFromCenter}
              onChange={(e) => setForm({ ...form, distanceFromCenter: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition"
            />
          </div>
        </div>
      </div>

      {/* Clinic Photos & Gallery */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
            <ImageIcon size={18} className="text-sky-500" />
            Clinic Gallery & Cover Photos
          </h3>
          <span className="text-xs text-gray-400">{images.length} photos uploaded</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative group rounded-2xl overflow-hidden aspect-video bg-gray-100 border border-gray-200"
            >
              <img
                src={img}
                alt={`Clinic Photo ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  className="p-2 rounded-full bg-red-600/90 text-white hover:bg-red-700 transition"
                  aria-label="Remove photo"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              {idx === 0 && (
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-sky-500 text-white text-[10px] font-bold uppercase tracking-wider">
                  Cover Photo
                </span>
              )}
            </div>
          ))}

          <label className="border-2 border-dashed border-gray-200 hover:border-sky-400 rounded-2xl aspect-video flex flex-col items-center justify-center gap-2 cursor-pointer bg-gray-50/50 hover:bg-sky-50/30 transition">
            <Plus size={24} className="text-sky-500" />
            <span className="text-xs font-semibold text-gray-600">Upload New Photo</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImages([...images, URL.createObjectURL(file)]);
                }
              }}
            />
          </label>
        </div>
      </div>

      {/* Facilities & Amenities Selection */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-7 shadow-xs space-y-4">
        <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
          <Sparkles size={18} className="text-sky-500" />
          Facilities & Patient Amenities
        </h3>
        <p className="text-xs text-gray-500">
          Select all services and amenities available at your dialysis center
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {defaultFacilities.map((facility) => {
            const isSelected = facilities.includes(facility);
            return (
              <button
                key={facility}
                type="button"
                onClick={() => toggleItem(facilities, setFacilities, facility)}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-xs font-medium text-left transition-all ${
                  isSelected
                    ? "bg-sky-50/80 border-sky-300 text-sky-900 shadow-2xs"
                    : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border ${
                    isSelected
                      ? "bg-sky-500 border-sky-500 text-white"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {isSelected && <Check size={13} strokeWidth={3} />}
                </div>
                <span>{facility}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Insurances & Payment Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-7 shadow-xs space-y-4">
          <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
            <ShieldCheck size={18} className="text-sky-500" />
            Accepted Travel Insurances
          </h3>
          <div className="space-y-2.5">
            {defaultInsurances.map((ins) => {
              const isSelected = insurances.includes(ins);
              return (
                <button
                  key={ins}
                  type="button"
                  onClick={() => toggleItem(insurances, setInsurances, ins)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-xs font-medium text-left transition ${
                    isSelected
                      ? "bg-sky-50/80 border-sky-300 text-sky-900"
                      : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                      isSelected
                        ? "bg-sky-500 border-sky-500 text-white"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected && <Check size={11} strokeWidth={3} />}
                  </div>
                  <span>{ins}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-7 shadow-xs space-y-4">
          <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
            <DollarSign size={18} className="text-sky-500" />
            Accepted Payment Methods
          </h3>
          <div className="space-y-2.5">
            {defaultPaymentMethods.map((pay) => {
              const isSelected = paymentMethods.includes(pay);
              return (
                <button
                  key={pay}
                  type="button"
                  onClick={() => toggleItem(paymentMethods, setPaymentMethods, pay)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-xs font-medium text-left transition ${
                    isSelected
                      ? "bg-sky-50/80 border-sky-300 text-sky-900"
                      : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                      isSelected
                        ? "bg-sky-500 border-sky-500 text-white"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected && <Check size={11} strokeWidth={3} />}
                  </div>
                  <span>{pay}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </form>
  );
}
