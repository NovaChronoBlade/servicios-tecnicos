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
          className={`min-h-screen flex transition-opacity duration-300 ease-in-out ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* Left: Brand Visual */}
          <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between bg-slate-900 p-10 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <Image
                alt="Brand Visual"
                className="object-cover opacity-90 mix-blend-multiply"
                src="https://twyzle-s3-1.s3.amazonaws.com/networks-v3/1/campaigns/14299/webp/javier-electric-and-plumbing-plomeria2-1000x600.webp"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="relative z-10">
              <h1 className="text-[48px] leading-[56px] tracking-[-0.02em] font-bold text-primary text-color: #fff">
                TechServe Pro
              </h1>
              <p className="text-[18px] leading-[28px] text-on-surface-variant mt-6 max-w-md">
                Ingeniería de precisión en la prestación de servicios. Accede a tu panel de 
                control centralizado para gestionar las operaciones técnicas.
              </p>
            </div>
            <div className="relative z-10 flex items-center gap-3 text-on-surface-variant">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified_user
              </span>
              <span className="text-[14px] leading-[20px] tracking-[0.01em] font-medium">
                Seguridad de nivel empresarial
              </span>
            </div>
          </div>

          {/* Right: Form */}
          <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12 lg:px-16 bg-white">
            <div className="w-full max-w-xl">

              {/* Mobile Brand Header */}
              <div className="lg:hidden mb-12">
                <h1 className="text-[30px] leading-[38px] tracking-[-0.01em] font-bold text-primary">
                  TechServe Pro
                </h1>
              </div>

              <div className="mb-10">
                <h2 className="text-[30px] leading-[38px] tracking-[-0.01em] font-semibold text-on-surface mb-2">
                  Bienvenido de vuelta
                </h2>
                <p className="text-[16px] leading-[24px] text-on-surface-variant">
                  Inicia sesión en tu cuenta para continuar.
                </p>
              </div>

              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>

                {/* Email */}
                <div>
                  <label
                    className="block text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant mb-1"
                    htmlFor="login-email"
                  >
                    Dirección de Email
                  </label>
                  <div className="relative">
                    <input
                      className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 text-[16px] leading-[24px] text-on-surface placeholder:text-outline transition-all duration-200 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
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

                {/* Password */}
                <div>
                  <label
                    className="block text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant mb-1"
                    htmlFor="login-password"
                  >
                    Contraseña
                  </label>
                  <input
                    className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 text-[16px] leading-[24px] text-on-surface placeholder:text-outline transition-all duration-200 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                    id="login-password"
                    required
                    type="password"
                  />
                </div>

                {/* Remember / Forgot */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input
                      className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20 transition-colors cursor-pointer"
                      type="checkbox"
                    />
                    <span className="text-[14px] leading-[20px] tracking-[0.01em] font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">
                      Recordarme
                    </span>
                  </label>
                  <Link
                    href="#"
                    className="text-[14px] leading-[20px] tracking-[0.01em] font-medium text-secondary hover:text-secondary-fixed-dim transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                {/* Submit */}
                <div className="pt-4">
                  <Link
                    href="/client"
                    className="w-full rounded-lg bg-primary text-on-primary py-3 text-[14px] leading-[20px] tracking-[0.01em] font-bold shadow-sm hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:bg-on-surface transition-all active:scale-[0.98] flex items-center justify-center"
                  >
                    Iniciar Sesión
                  </Link>
                </div>
              </form>

              <div className="mt-20 text-center">
                <p className="text-[16px] leading-[24px] text-on-surface-variant">
                  {"¿No tienes una cuenta? "}
                  <button
                    className="text-[14px] leading-[20px] tracking-[0.01em] font-bold text-primary hover:text-secondary transition-colors ml-1"
                    onClick={() => toggleView("register")}
                  >
                    Regístrate aquí
                  </button>
                </p>
              </div>
            </div>
          </div>
        </section>
      )}


      {/* REGISTER VIEW */}
      {view === "register" && (
        <section
          className={`min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-surface-container-low transition-opacity duration-300 ease-in-out ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="w-full max-w-2xl">

            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold text-primary mb-3">
                TechServe Pro
              </h1>
              <h2 className="text-[30px] leading-[38px] tracking-[-0.01em] font-semibold text-on-surface">
                Client Registration
              </h2>
              <p className="text-[16px] leading-[24px] text-on-surface-variant mt-1">
                Complete your profile to request and manage services.
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-surface-container-lowest rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] border border-outline-variant/50 overflow-hidden">
              <form
                className="p-12 space-y-12 divide-y divide-outline-variant/20"
                onSubmit={(e) => e.preventDefault()}
              >

                {/* Section 1: Identity */}
                <div className="pb-6">
                  <h3 className="text-[14px] leading-[20px] tracking-wider font-semibold text-on-surface-variant uppercase mb-6 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">person</span>
                    Identity
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant mb-1">
                        Full Name
                      </label>
                      <input
                        className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-2.5 text-[16px] leading-[24px] text-on-surface transition-all duration-200 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                        placeholder="e.g. Jane Doe"
                        required
                        type="text"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant mb-1">
                        National ID / Passport
                      </label>
                      <input
                        className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-2.5 text-[16px] leading-[24px] text-on-surface transition-all duration-200 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                        placeholder="ID Number"
                        required
                        type="text"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant mb-1">
                        Birth Date
                      </label>
                      <input
                        className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-2.5 text-[16px] leading-[24px] text-on-surface-variant transition-all duration-200 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                        required
                        type="date"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Contact */}
                <div className="pt-12 pb-6">
                  <h3 className="text-[14px] leading-[20px] tracking-wider font-semibold text-on-surface-variant uppercase mb-6 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">contact_mail</span>
                    Contact
                  </h3>
                  <div>
                    <label className="block text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant mb-1">
                      Email Address
                    </label>
                    <input
                      className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-2.5 text-[16px] leading-[24px] text-on-surface transition-all duration-200 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                      placeholder="name@company.com"
                      required
                      type="email"
                    />
                  </div>
                </div>

                {/* Section 3: Location */}
                <div className="pt-12 pb-3">
                  <h3 className="text-[14px] leading-[20px] tracking-wider font-semibold text-on-surface-variant uppercase mb-6 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                    Location
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-3">
                      <label className="block text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant mb-1">
                        Street Address
                      </label>
                      <input
                        className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-2.5 text-[16px] leading-[24px] text-on-surface transition-all duration-200 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                        placeholder="123 Engineering Blvd"
                        required
                        type="text"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant mb-1">
                        City
                      </label>
                      <input
                        className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-2.5 text-[16px] leading-[24px] text-on-surface transition-all duration-200 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                        placeholder="Metropolis"
                        required
                        type="text"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant mb-1">
                        ZIP Code
                      </label>
                      <input
                        className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-2.5 text-[16px] leading-[24px] text-on-surface transition-all duration-200 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                        placeholder="10001"
                        required
                        type="text"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-12 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <button
                    className="w-full sm:w-auto text-[14px] leading-[20px] tracking-[0.01em] font-medium text-on-surface-variant hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-surface-container-high"
                    onClick={() => toggleView("login")}
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className="w-full sm:w-auto rounded-lg bg-primary text-on-primary py-3 px-10 text-[14px] leading-[20px] tracking-[0.01em] font-bold shadow-sm hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:bg-on-surface transition-all active:scale-[0.98]"
                    type="submit"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-12 text-center">
              <p className="text-[16px] leading-[24px] text-on-surface-variant">
                Already registered?{" "}
                <button
                  className="text-[14px] leading-[20px] tracking-[0.01em] font-bold text-primary hover:text-secondary transition-colors ml-1"
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