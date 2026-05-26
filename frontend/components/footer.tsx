import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full py-xl bg-primary-container border-t border-outline-variant/20">
      <div className="max-w-[1280px] mx-auto px-gutter grid grid-cols-1 md:grid-cols-4 gap-lg">
        <div className="col-span-1 md:col-span-2 flex flex-col gap-md">
          <span className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold text-on-primary-container">
            TechServe Pro
          </span>
          <p className="text-[16px] leading-[24px] text-on-primary-container/80 max-w-sm">
            Elevating property maintenance through rigorous engineering
            standards and meticulously vetted technical experts.
          </p>
          <div className="flex gap-4 mt-auto">
            <Link
              href="#"
              className="w-10 h-10 rounded-full bg-surface-container/10 flex items-center justify-center text-on-primary-container hover:bg-surface-container/20 transition-colors"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                language
              </span>
            </Link>
            <Link
              href="#"
              className="w-10 h-10 rounded-full bg-surface-container/10 flex items-center justify-center text-on-primary-container hover:bg-surface-container/20 transition-colors"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                share
              </span>
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-sm">
          <h4 className="text-[14px] leading-[20px] tracking-[0.01em] font-medium text-on-primary-container font-bold mb-2">
            Legal &amp; Trust
          </h4>
          <Link
            href="#"
            className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-primary-container/80 hover:text-on-primary-container transition-colors py-1"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-primary-container/80 hover:text-on-primary-container transition-colors py-1"
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-primary-container/80 hover:text-on-primary-container transition-colors py-1"
          >
            Compliance
          </Link>
          <Link
            href="#"
            className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-primary-container/80 hover:text-on-primary-container transition-colors py-1"
          >
            SLA
          </Link>
        </div>
        <div className="flex flex-col gap-sm">
          <h4 className="text-[14px] leading-[20px] tracking-[0.01em] font-medium text-on-primary-container font-bold mb-2">
            Support
          </h4>
          <Link
            href="#"
            className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-primary-container/80 hover:text-on-primary-container transition-colors py-1"
          >
            Contact
          </Link>
          <Link
            href="#"
            className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-primary-container/80 hover:text-on-primary-container transition-colors py-1"
          >
            Help Center
          </Link>
          <Link
            href="#"
            className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-primary-container/80 hover:text-on-primary-container transition-colors py-1"
          >
            Provider Portal
          </Link>
        </div>
        <div className="col-span-1 md:col-span-4 mt-lg pt-md border-t border-outline-variant/10 text-center md:text-left">
          <p className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-primary-container/60">
            &copy; 2024 TechServe Pro. Precision Engineering in Service
            Delivery.
          </p>
        </div>
      </div>
    </footer>
  );
}
