"use client";

import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import MyProfile from "./_components/MyProfile";
import BookingHistory from "./_components/BookingHistory";
import Setting from "./_components/Setting";
import ClinicOwnerPortal from "./ClinicOwnerPortal";
import { ArrowLeftRight } from "lucide-react";

type Tab = "profile" | "booking" | "setting";

const UserAccount = () => {
  const user = useAuthStore((state) => state.user);
  const normalizedRole = user?.role?.toLowerCase() || "";
  const isClinicOwner =
    normalizedRole === "clinic_owner" || normalizedRole === "clinic owner";

  // Allow switching view between Patient and Clinic Owner for full testing flexibility
  const [viewRole, setViewRole] = useState<"PATIENT" | "CLINIC_OWNER">(
    isClinicOwner ? "CLINIC_OWNER" : "PATIENT"
  );

  const [activeTab, setActiveTab] = useState<Tab>("profile");

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
      id: "profile",
      label: "My profile",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      id: "booking",
      label: "Booking History",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: "setting",
      label: "Setting",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-32 min-h-screen">
      {/* Google Font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      {/* Role Switcher Toolbar (Testing & Role Simulation) */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-gray-50 border border-gray-200 rounded-2xl p-3 px-4">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span className="font-semibold text-gray-800">Account Portal:</span>
          <span className="bg-white border border-gray-200 px-2.5 py-0.5 rounded-md font-medium text-gray-700">
            {viewRole === "CLINIC_OWNER" ? "Clinic Owner Mode" : "Patient Mode"}
          </span>
          {user?.role && (
            <span className="text-gray-400">
              (Logged in as: {user.role})
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() =>
            setViewRole(viewRole === "CLINIC_OWNER" ? "PATIENT" : "CLINIC_OWNER")
          }
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-gray-200 hover:border-sky-300 text-sky-600 shadow-2xs hover:bg-sky-50 transition cursor-pointer"
        >
          <ArrowLeftRight size={13} />
          Switch to {viewRole === "CLINIC_OWNER" ? "Patient Account" : "Clinic Owner Portal"}
        </button>
      </div>

      {/* Render Portal based on View Role */}
      {viewRole === "CLINIC_OWNER" ? (
        <ClinicOwnerPortal />
      ) : (
        <div>
          {/* Patient Account Header */}
          <h1
            style={{
              color: "#38bdf8",
              fontWeight: 600,
              fontSize: "1.5rem",
              marginBottom: "4px",
            }}
          >
            User Account
          </h1>
          <p
            style={{
              color: "#6b7280",
              fontSize: "0.85rem",
              marginBottom: "24px",
            }}
          >
            Manage your account, bookings, and preferences.
          </p>

          {/* Tab Navigation */}
          <div
            style={{
              display: "flex",
              gap: "0px",
              borderBottom: "1px solid #e5e7eb",
              marginBottom: "24px",
            }}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "10px 20px",
                    fontSize: "0.875rem",
                    fontWeight: isActive ? 500 : 400,
                    color: isActive ? "#38bdf8" : "#6b7280",
                    background: "none",
                    border: "none",
                    borderBottom: isActive
                      ? "2px solid #38bdf8"
                      : "2px solid transparent",
                    marginBottom: "-1px",
                    cursor: "pointer",
                    transition: "color 0.2s",
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          {activeTab === "profile" && <MyProfile />}
          {activeTab === "booking" && <BookingHistory />}
          {activeTab === "setting" && <Setting />}
        </div>
      )}
    </div>
  );
};

export default UserAccount;