"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface SideNavBarProps {
  userType: "client" | "admin";
  activeTab: string;
}

const clientNavItems = [
  { icon: "dashboard", label: "Overview", href: "/client", id: "overview" },
  {
    icon: "build",
    label: "Service Requests",
    href: "/client/requests",
    id: "requests",
  },
  {
    icon: "engineering",
    label: "Technicians",
    href: "/client/technicians",
    id: "technicians",
  },
  {
    icon: "monitoring",
    label: "Analytics",
    href: "/client/analytics",
    id: "analytics",
  },
  {
    icon: "inventory_2",
    label: "Inventory",
    href: "/client/inventory",
    id: "inventory",
  },
  {
    icon: "settings",
    label: "Settings",
    href: "/client/settings",
    id: "settings",
  },
];

const adminNavItems = [
  { icon: "dashboard", label: "Overview", href: "/admin", id: "overview" },
  {
    icon: "build",
    label: "Service Requests",
    href: "/admin/requests",
    id: "requests",
  },
  {
    icon: "engineering",
    label: "Technicians",
    href: "/admin/technicians",
    id: "technicians",
  },
  {
    icon: "monitoring",
    label: "Analytics",
    href: "/admin/analytics",
    id: "analytics",
  },
  {
    icon: "inventory_2",
    label: "Inventory",
    href: "/admin/inventory",
    id: "inventory",
  },
  {
    icon: "settings",
    label: "Settings",
    href: "/admin/settings",
    id: "settings",
  },
];

export function SideNavBar({ userType, activeTab }: SideNavBarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navItems = userType === "admin" ? adminNavItems : clientNavItems;

  return (
    <>
      {/* Mobile Nav Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-4 bg-surface border-b border-outline-variant/30 sticky top-0 z-50">
        <h1 className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold font-black text-primary">
          TechServe Pro
        </h1>
        <button
          className="p-2 text-primary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      </header>

      {/* Sidebar */}
      <nav
        className={`h-screen w-72 fixed left-0 top-0 bg-surface border-r border-outline-variant/30 flex flex-col py-md z-40 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex items-center justify-between px-4 mb-8">
          <div className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold font-black text-primary">
            TechServe Pro
          </div>
          <button
            className="md:hidden p-2 text-primary"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="px-4 mb-6">
          <div className="flex items-center gap-3 p-3 bg-surface-container rounded-lg">
            <Image
              alt="User Profile"
              className="w-10 h-10 rounded-full border border-outline-variant"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUdP1NiGUlK4CwuqJ6PQBhNBTSQD9psJcOzv8vHyDl4DxEEBEPFcQbSpH6mPBfuk8Dw1nFNCAt3AJMiBSjOyBpaOdE-xwdsy3WQTng1w2qHTavYych9wo0Eu8y4qiiN3bZQIA-WQdOUzBt_He7xnHYXy1RK_eRniFhyw5L2Uw2I5Y-FbnXp9D2S27LuESIA6MlsGUbWq1UquckgLDXhVUrtaGbW57Yx-bLe57QSF4anxS761DoVqhuPlM84QQWYqZ1-HcEtKd0wIMs"
              width={40}
              height={40}
            />
            <div>
              <p className="text-[14px] leading-[20px] tracking-[0.01em] font-medium text-primary">
                {userType === "admin" ? "Admin Console" : "Client Dashboard"}
              </p>
              <p className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant">
                Technical Operations
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 mb-6">
          <button className="w-full bg-primary text-on-primary text-[14px] leading-[20px] tracking-[0.01em] font-medium py-3 rounded-lg hover:bg-on-tertiary-fixed transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Service
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 px-4">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:translate-x-1 duration-200 active:scale-95 ${
                activeTab === item.id
                  ? "text-secondary bg-secondary-container/10 border-r-4 border-secondary rounded-l-lg"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontVariationSettings:
                    activeTab === item.id ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {item.icon}
              </span>
              <span className="text-[14px] leading-[20px] tracking-[0.01em] font-medium">
                {item.label}
              </span>
            </Link>
          ))}
        </div>

        <div className="px-4 mt-auto pt-4 border-t border-outline-variant/30 space-y-1">
          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high transition-all rounded-lg hover:translate-x-1 duration-200 active:scale-95"
          >
            <span className="material-symbols-outlined">help</span>
            <span className="text-[14px] leading-[20px] tracking-[0.01em] font-medium">
              Support
            </span>
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high transition-all rounded-lg hover:translate-x-1 duration-200 active:scale-95"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="text-[14px] leading-[20px] tracking-[0.01em] font-medium">
              Sign Out
            </span>
          </Link>
        </div>
      </nav>
    </>
  );
}
