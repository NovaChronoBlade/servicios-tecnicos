"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [view, setView] = useState<"login" | "register">("login");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const toggleView = (targetView: "login" | "register") => {
    setIsTransitioning(true);
    setTimeout(() => {
      setView(targetView);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <main className="relative min-h-screen w-full bg-background text-on-surface antialiased overflow-x-hidden">
      {/* LOGIN VIEW */}
      {view === "login" && (
        <section
          className={`grid min-h-screen grid-cols-1 lg:grid-cols-2 transition-opacity duration-300 ease-in-out ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* Left: Brand Visual */}
          <div className="relative hidden lg:flex flex-col justify-between bg-surface-container-highest p-xl overflow-hidden">
            <div className="absolute inset-0 z-0">
              <Image
                alt="Brand Visual"
                className="object-cover w-full h-full opacity-60 mix-blend-multiply"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIknf-_lBSzsPKzWdutQm6ZI9i7ktuW-KWL4xtz2J9qYKvoPLJUYMxDgoByXeeb_WNBw1eeHZ5ahtoDhQhYBllxQDmFi1DgLHMtwrLg3PUg0Vpr4MdxxQWuhDPLhROKvB5khjNK4QKubG47pjXwVZkgd7-w_vcpu-GtEFLfHcNWiWjnrDYbhHTsyEoBJYU5pLxljkYIWi0KEIsZRA-EmCGVYTKVaBw-RnVfrUDjJWdwkb81TOQCyV82LDdD2LY647RLiLpPcaY8Ipk"
                fill
              />
            </div>
            <div className="relative z-10">
              <h1 className="text-[48px] leading-[56px] tracking-[-0.02em] font-bold text-primary">
                TechServe Pro
              </h1>
              <p className="text-[18px] leading-[28px] text-on-surface-variant mt-md max-w-md">
                Precision engineering in service delivery. Access your
                centralized dashboard to manage technical operations.
              </p>
            </div>
            <div className="relative z-10 flex items-center gap-sm text-on-surface-variant">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified_user
              </span>
              <span className="text-[14px] leading-[20px] tracking-[0.01em] font-medium">
                Enterprise Grade Security
              </span>
            </div>
          </div>

          {/* Right: Minimalist Form */}
          <div className="flex items-center justify-center p-gutter lg:p-xl bg-surface-container-lowest">
            <div className="w-full max-w-md">
              {/* Mobile Brand Header */}
              <div className="lg:hidden mb-lg">
                <h1 className="text-[30px] leading-[38px] tracking-[-0.01em] font-semibold text-primary font-bold">
                  TechServe Pro
                </h1>
              </div>
              <div className="mb-lg">
                <h2 className="text-[30px] leading-[38px] tracking-[-0.01em] font-semibold text-on-surface mb-xs">
                  Welcome back
                </h2>
                <p className="text-[16px] leading-[24px] text-on-surface-variant">
                  Sign in to your account to continue.
                </p>
              </div>
              <form
                className="space-y-md"
                onSubmit={(e) => e.preventDefault()}
              >
                {/* Email Input */}
                <div>
                  <label
                    className="block text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant mb-xs"
                    htmlFor="login-email"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      className="input-ring-transition w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 text-[16px] leading-[24px] text-on-surface placeholder:text-outline focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                      id="login-email"
                      required
                      type="email"
                      defaultValue="admin@techserve.pro"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-secondary">
                      <span
                        className="material-symbols-outlined text-[20px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                    </div>
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label
                    className="block text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant mb-xs"
                    htmlFor="login-password"
                  >
                    Password
                  </label>
                  <input
                    className="input-ring-transition w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 text-[16px] leading-[24px] text-on-surface placeholder:text-outline focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                    id="login-password"
                    required
                    type="password"
                  />
                </div>

                {/* Utilities */}
                <div className="flex items-center justify-between pt-xs">
                  <label className="flex items-center gap-xs cursor-pointer group">
                    <input
                      className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20 transition-colors cursor-pointer"
                      type="checkbox"
                    />
                    <span className="text-[14px] leading-[20px] tracking-[0.01em] font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">
                      Remember me
                    </span>
                  </label>
                  <Link
                    href="#"
                    className="text-[14px] leading-[20px] tracking-[0.01em] font-medium text-secondary hover:text-secondary-fixed-dim transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Actions */}
                <div className="pt-sm">
                  <Link
                    href="/client"
                    className="w-full rounded-lg bg-primary text-on-primary py-3 text-[14px] leading-[20px] tracking-[0.01em] font-medium font-bold shadow-sm hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:bg-on-surface transition-all active:scale-[0.98] flex items-center justify-center"
                  >
                    Sign In
                  </Link>
                </div>
              </form>
              <div className="mt-xl text-center">
                <p className="text-[16px] leading-[24px] text-on-surface-variant">
                  {"Don't have a client account? "}
                  <button
                    className="text-[14px] leading-[20px] tracking-[0.01em] font-medium text-primary font-bold hover:text-secondary transition-colors ml-xs"
                    onClick={() => toggleView("register")}
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* REGISTRATION VIEW */}
      {view === "register" && (
        <section
          className={`min-h-screen flex flex-col items-center justify-center p-gutter py-xl bg-surface-container-low transition-opacity duration-300 ease-in-out ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="w-full max-w-2xl">
            {/* Header */}
            <div className="text-center mb-lg">
              <h1 className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold text-primary mb-sm">
                TechServe Pro
              </h1>
              <h2 className="text-[30px] leading-[38px] tracking-[-0.01em] font-semibold text-on-surface">
                Client Registration
              </h2>
              <p className="text-[16px] leading-[24px] text-on-surface-variant mt-xs">
                Complete your profile to request and manage services.
              </p>
            </div>

            {/* Bento-style Form Container */}
            <div className="bg-surface-container-lowest rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] border border-outline-variant/50 overflow-hidden">
              <form
                className="p-lg space-y-lg divide-y divide-outline-variant/20"
                onSubmit={(e) => e.preventDefault()}
              >
                {/* Section 1: Personal Details */}
                <div className="pb-md">
                  <h3 className="text-[14px] leading-[20px] tracking-[0.01em] font-medium text-on-surface-variant uppercase tracking-wider mb-md flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[18px]">
                      person
                    </span>
                    Identity
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div className="md:col-span-2">
                      <label className="block text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant mb-xs">
                        Full Name
                      </label>
                      <input
                        className="input-ring-transition w-full rounded-lg border border-outline-variant bg-surface px-4 py-2.5 text-[16px] leading-[24px] text-on-surface focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                        placeholder="e.g. Jane Doe"
                        required
                        type="text"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant mb-xs">
                        National ID / Passport
                      </label>
                      <input
                        className="input-ring-transition w-full rounded-lg border border-outline-variant bg-surface px-4 py-2.5 text-[16px] leading-[24px] text-on-surface focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                        placeholder="ID Number"
                        required
                        type="text"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant mb-xs">
                        Birth Date
                      </label>
                      <input
                        className="input-ring-transition w-full rounded-lg border border-outline-variant bg-surface px-4 py-2.5 text-[16px] leading-[24px] text-on-surface text-on-surface-variant focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                        required
                        type="date"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Contact Information */}
                <div className="pt-lg pb-md">
                  <h3 className="text-[14px] leading-[20px] tracking-[0.01em] font-medium text-on-surface-variant uppercase tracking-wider mb-md flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[18px]">
                      contact_mail
                    </span>
                    Contact
                  </h3>
                  <div className="grid grid-cols-1 gap-md">
                    <div>
                      <label className="block text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant mb-xs">
                        Email Address
                      </label>
                      <input
                        className="input-ring-transition w-full rounded-lg border border-outline-variant bg-surface px-4 py-2.5 text-[16px] leading-[24px] text-on-surface focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                        placeholder="name@company.com"
                        required
                        type="email"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Address */}
                <div className="pt-lg pb-sm">
                  <h3 className="text-[14px] leading-[20px] tracking-[0.01em] font-medium text-on-surface-variant uppercase tracking-wider mb-md flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[18px]">
                      location_on
                    </span>
                    Location
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                    <div className="md:col-span-3">
                      <label className="block text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant mb-xs">
                        Street Address
                      </label>
                      <input
                        className="input-ring-transition w-full rounded-lg border border-outline-variant bg-surface px-4 py-2.5 text-[16px] leading-[24px] text-on-surface focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                        placeholder="123 Engineering Blvd"
                        required
                        type="text"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant mb-xs">
                        City
                      </label>
                      <input
                        className="input-ring-transition w-full rounded-lg border border-outline-variant bg-surface px-4 py-2.5 text-[16px] leading-[24px] text-on-surface focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                        placeholder="Metropolis"
                        required
                        type="text"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant mb-xs">
                        ZIP Code
                      </label>
                      <input
                        className="input-ring-transition w-full rounded-lg border border-outline-variant bg-surface px-4 py-2.5 text-[16px] leading-[24px] text-on-surface focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                        placeholder="10001"
                        required
                        type="text"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions within Card */}
                <div className="pt-lg flex flex-col sm:flex-row items-center justify-between gap-md">
                  <button
                    className="w-full sm:w-auto text-[14px] leading-[20px] tracking-[0.01em] font-medium text-on-surface-variant hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-surface-container-high"
                    onClick={() => toggleView("login")}
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className="w-full sm:w-auto rounded-lg bg-primary text-on-primary py-3 px-xl text-[14px] leading-[20px] tracking-[0.01em] font-medium font-bold shadow-sm hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:bg-on-surface transition-all active:scale-[0.98]"
                    type="submit"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            </div>
            <div className="mt-lg text-center">
              <p className="text-[16px] leading-[24px] text-on-surface-variant">
                Already registered?{" "}
                <button
                  className="text-[14px] leading-[20px] tracking-[0.01em] font-medium text-primary font-bold hover:text-secondary transition-colors ml-xs"
                  onClick={() => toggleView("login")}
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
