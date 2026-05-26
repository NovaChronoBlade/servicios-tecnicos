"use client";

import Link from "next/link";

export function TopNavBar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md shadow-sm border-b border-outline-variant/30 transition-all duration-300 ease-in-out">
      <div className="flex justify-between items-center h-20 px-gutter max-w-[1280px] mx-auto">
        <Link
          href="/"
          className="text-[48px] leading-[56px] tracking-[-0.02em] font-bold text-primary hidden md:block"
        >
          TechServe Pro
        </Link>
        <Link
          href="/"
          className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold text-primary md:hidden"
        >
          TechServe Pro
        </Link>
        <nav className="hidden md:flex items-center gap-md">
          <Link
            href="/"
            className="text-[14px] leading-[20px] tracking-[0.01em] font-medium text-secondary font-bold border-b-2 border-secondary pb-1"
          >
            Marketplace
          </Link>
          <Link
            href="#"
            className="text-[14px] leading-[20px] tracking-[0.01em] font-medium text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container-low rounded-lg px-3 py-2"
          >
            Services
          </Link>
          <Link
            href="#"
            className="text-[14px] leading-[20px] tracking-[0.01em] font-medium text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container-low rounded-lg px-3 py-2"
          >
            Pricing
          </Link>
          <Link
            href="#"
            className="text-[14px] leading-[20px] tracking-[0.01em] font-medium text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container-low rounded-lg px-3 py-2"
          >
            Enterprise
          </Link>
        </nav>
        <div className="flex items-center gap-sm">
          <Link
            href="/login"
            className="hidden lg:block text-[14px] leading-[20px] tracking-[0.01em] font-medium text-primary bg-transparent border border-outline px-4 py-2 rounded-lg hover:bg-surface-container-low transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/login"
            className="text-[14px] leading-[20px] tracking-[0.01em] font-medium text-on-primary bg-primary px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Get Started
          </Link>
          <button className="md:hidden text-on-surface-variant">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              menu
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
