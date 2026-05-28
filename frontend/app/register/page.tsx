"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col md:flex-row">
      {/* Left Screen: Branding & Visuals (Hidden on Mobile) */}
      <div className="hidden md:flex md:w-5/12 lg:w-1/2 relative bg-primary-container overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            alt="TechServe Pro Architectural Background"
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-bwdZjv_GP1XctNC8MUekXzXf75Ay4ZSbg0n3kfE5sJCcu8lFRaRgdN72ouWuTyEId23TqffqNAKbyYyAhSUV5ySPlM2L1CHMOULCKhralwxktqc3iysCGhrqHcySJfDrSb1CVCRpX4IgMScgtjtRoB4dAp83ogaPMOdDfzhXEZtODE6yyu8UAx68TELJY_62xc9ALskdAr59vHlOs1PiSANZPmITIqkYo4o9LM4PkkCbWxaWOjJc_Al_pVNTQ-AWkZFkh-tPR3T9"
            fill
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-container/80 to-primary-container/95"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-between p-lg h-full w-full">
          <div className="flex items-center gap-sm">
            <span
              className="material-symbols-outlined text-[32px] text-secondary-container"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              precision_manufacturing
            </span>
            <span className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold text-on-primary">
              TechServe Pro
            </span>
          </div>
          <div className="max-w-md">
            <h1 className="text-[48px] leading-[56px] tracking-[-0.02em] font-bold text-on-primary mb-md">
              Precision engineering in service delivery.
            </h1>
            <p className="text-[18px] leading-[28px] text-on-primary-container">
              Join an elite network of vetted technical professionals. Elevate
              your practice with our comprehensive management tools.
            </p>
          </div>
          <div className="flex items-center gap-sm">
            <div className="flex -space-x-4">
              <div className="w-10 h-10 rounded-full bg-surface-container-high border-2 border-primary-container flex items-center justify-center text-on-surface-variant text-[12px] leading-[16px] tracking-[0.05em] font-semibold">
                TS
              </div>
              <div className="w-10 h-10 rounded-full bg-secondary border-2 border-primary-container flex items-center justify-center text-on-primary text-[12px] leading-[16px] tracking-[0.05em] font-semibold">
                PR
              </div>
            </div>
            <span className="text-[14px] leading-[20px] tracking-[0.01em] font-medium text-on-primary-container ml-sm">
              Trusted by 5,000+ professionals
            </span>
          </div>
        </div>
      </div>

      {/* Right Screen: Registration Form */}
      <div className="w-full md:w-7/12 lg:w-1/2 flex items-center justify-center p-gutter sm:p-lg min-h-screen bg-surface">
        <div className="w-full max-w-[520px]">
          {/* Mobile Header (Visible only on mobile) */}
          <div className="md:hidden flex items-center gap-sm mb-xl">
            <span
              className="material-symbols-outlined text-[28px] text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              precision_manufacturing
            </span>
            <span className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold text-primary tracking-tight font-black">
              TechServe Pro
            </span>
          </div>
          <div className="mb-lg">
            <h2 className="text-[30px] leading-[38px] tracking-[-0.01em] font-semibold text-on-surface mb-xs">
              Create an Account
            </h2>
            <p className="text-[16px] leading-[24px] text-on-surface-variant">
              Enter your details to apply for the professional network.
            </p>
          </div>
          <form className="space-y-md" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
              {/* Full Name */}
              <div className="space-y-xs">
                <label
                  className="block text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase tracking-widest"
                  htmlFor="fullName"
                >
                  Full Name
                </label>
                <input
                  className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/50 rounded-lg text-[16px] leading-[24px] text-on-surface placeholder-on-surface-variant/50 input-ring-transition focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                  id="fullName"
                  name="fullName"
                  placeholder="Jane Doe"
                  required
                  type="text"
                />
              </div>
              {/* Email */}
              <div className="space-y-xs">
                <label
                  className="block text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase tracking-widest"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/50 rounded-lg text-[16px] leading-[24px] text-on-surface placeholder-on-surface-variant/50 input-ring-transition focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                  id="email"
                  name="email"
                  placeholder="jane@example.com"
                  required
                  type="email"
                />
              </div>
              {/* Phone Number */}
              <div className="space-y-xs">
                <label
                  className="block text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase tracking-widest"
                  htmlFor="phone"
                >
                  Phone Number
                </label>
                <input
                  className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/50 rounded-lg text-[16px] leading-[24px] text-on-surface placeholder-on-surface-variant/50 input-ring-transition focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                  id="phone"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  required
                  type="tel"
                />
              </div>
              {/* Birth Date */}
              <div className="space-y-xs">
                <label
                  className="block text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase tracking-widest"
                  htmlFor="dob"
                >
                  Birth Date
                </label>
                <input
                  className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/50 rounded-lg text-[16px] leading-[24px] text-on-surface placeholder-on-surface-variant/50 input-ring-transition focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                  id="dob"
                  name="dob"
                  required
                  type="date"
                />
              </div>
            </div>
            {/* Identity Document */}
            <div className="space-y-xs">
              <label
                className="block text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase tracking-widest"
                htmlFor="identityDoc"
              >
                Identity Document Number (SSN/Tax ID)
              </label>
              <input
                className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/50 rounded-lg text-[16px] leading-[24px] text-on-surface placeholder-on-surface-variant/50 input-ring-transition focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                id="identityDoc"
                name="identityDoc"
                placeholder="XXX-XX-XXXX"
                required
                type="text"
              />
            </div>
            {/* Address */}
            <div className="space-y-xs">
              <label
                className="block text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase tracking-widest"
                htmlFor="address"
              >
                Business Address
              </label>
              <textarea
                className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/50 rounded-lg text-[16px] leading-[24px] text-on-surface placeholder-on-surface-variant/50 input-ring-transition resize-none focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                id="address"
                name="address"
                placeholder={`123 Tech Lane, Suite 100\nSan Francisco, CA 94105`}
                required
                rows={2}
              />
            </div>
            {/* Password */}
            <div className="space-y-xs">
              <label
                className="block text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase tracking-widest"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/50 rounded-lg text-[16px] leading-[24px] text-on-surface placeholder-on-surface-variant/50 input-ring-transition focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type={showPassword ? "text" : "password"}
                />
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant hover:text-on-surface"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility" : "visibility_off"}
                  </span>
                </button>
              </div>
              <p className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-outline mt-1 font-normal tracking-normal text-[11px]">
                Must be at least 8 characters, including a number and symbol.
              </p>
            </div>
            {/* CTA */}
            <div className="pt-sm">
              <button
                className="w-full bg-primary-container text-on-primary py-4 rounded-lg text-[14px] leading-[20px] tracking-[0.01em] font-medium shadow-sm hover:shadow-md hover:bg-tertiary-container transition-all duration-200 flex items-center justify-center gap-2"
                type="submit"
              >
                Sign Up
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </button>
            </div>
          </form>
          <div className="mt-xl text-center">
            <p className="text-[16px] leading-[24px] text-on-surface-variant">
              Already have an account?{" "}
              <Link
                className="text-[14px] leading-[20px] tracking-[0.01em] font-medium text-secondary hover:text-secondary-container transition-colors ml-1"
                href="/login"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
