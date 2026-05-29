import Link from "next/link";

export function DashboardFooter() {
  return (
    <footer className="mt-auto w-full py-xl border-t border-outline-variant/20 bg-primary-container">
      <div className="max-w-[1280px] mx-auto px-gutter grid grid-cols-1 md:grid-cols-4 gap-lg">
        <div className="col-span-1 md:col-span-4 flex flex-col items-center md:items-start mb-6">
          <span className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold text-on-primary-container">
            TechServe Pro
          </span>
        </div>
        <div className="col-span-1 md:col-span-4 flex flex-wrap justify-center md:justify-start gap-4">
          <Link
            href="#"
            className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-primary-container/80 hover:text-on-primary-container transition-colors hover:opacity-80"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-primary-container/80 hover:text-on-primary-container transition-colors hover:opacity-80"
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-primary-container/80 hover:text-on-primary-container transition-colors hover:opacity-80"
          >
            Compliance
          </Link>
          <Link
            href="#"
            className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-primary-container/80 hover:text-on-primary-container transition-colors hover:opacity-80"
          >
            SLA
          </Link>
          <Link
            href="#"
            className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-primary-container/80 hover:text-on-primary-container transition-colors hover:opacity-80"
          >
            Contact
          </Link>
        </div>
        <div className="col-span-1 md:col-span-4 mt-8 text-center md:text-left text-[16px] leading-[24px] text-on-primary-container/80">
          &copy; 2024 TechServe Pro. Precision Engineering in Service Delivery.
        </div>
      </div>
    </footer>
  );
}
