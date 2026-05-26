import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="max-w-[1280px] mx-auto px-gutter py-xl lg:py-24 flex flex-col lg:flex-row items-center gap-xl relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -z-10 w-full h-full overflow-hidden opacity-30 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-secondary-container/20 blur-3xl"></div>
        <div className="absolute top-40 -left-20 w-72 h-72 rounded-full bg-primary-fixed/20 blur-3xl"></div>
      </div>

      <div className="lg:w-1/2 flex flex-col gap-lg z-10">
        <div className="space-y-sm">
          <span className="inline-block px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-[12px] leading-[16px] tracking-[0.05em] font-semibold uppercase border border-outline-variant/30">
            Precision Engineering
          </span>
          <h1 className="text-[36px] leading-[44px] md:text-[48px] md:leading-[56px] tracking-[-0.02em] font-bold text-primary">
            Absolute Reliability in Service Delivery.
          </h1>
          <p className="text-[18px] leading-[28px] text-on-surface-variant max-w-2xl">
            Connect with rigorously vetted technical experts for your high-end
            property needs. Quality and efficiency, guaranteed by our
            proprietary matching algorithm.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-md">
          <button className="bg-primary text-on-primary text-[14px] leading-[20px] tracking-[0.01em] font-medium px-8 py-4 rounded-lg hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-2">
            Explore Marketplace
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              arrow_forward
            </span>
          </button>
          <button className="bg-surface text-primary border border-outline-variant text-[14px] leading-[20px] tracking-[0.01em] font-medium px-8 py-4 rounded-lg hover:bg-surface-container-low transition-colors shadow-sm flex items-center justify-center gap-2">
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              play_circle
            </span>
            See How It Works
          </button>
        </div>
        <div className="flex items-center gap-sm pt-sm border-t border-outline-variant/20">
          <div className="flex -space-x-3">
            <Image
              alt="Professional 1"
              className="w-10 h-10 rounded-full border-2 border-surface object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjJUHJ1MEzgMUCSHOYa_ozNPlnMh1teh8TMLgPz3IdJmyVhzx0lc8ESN7CC6lLasNMUXO8v7UhXeehMUC6A2xROTjFovyrsJyPQlpoOX-ZUk9p_SuCBHWwhwMfrBG9N0hSb-9cAwShipx-CiNzrt9ajZ5RcimjumRqYT94lbkFqkV43mvaRwry-eDJWfUNegjndGHDVUlzUXgJucFnqNan9F6pT7_9gjx1i1cqzNLkLHNHoocNcW6JMW1znXOtceHXYqP0pvk0GmqM"
              width={40}
              height={40}
            />
            <Image
              alt="Professional 2"
              className="w-10 h-10 rounded-full border-2 border-surface object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6sLCZxV8Bh2qu0gA_gfXI1p-d2BA6yQB3jXQ_Oj-2h3pxI0ahUJH7_noi4Z1GN1sNlWzgIRHBRjALwlHOwDHr8Ou8NdmV2Wwtla7UZnDS03KKYGAwBArEjX8InGyyKBEFMhUhvbHSzJPxBvjLMq36g5vNp2Gd1wurlKa2QprAaHvkKi9jFbFH0nN3TVWM8PgXq5sGM4t3zIxUBkOX6j5XL3FxP-gkXQTrg5NdUB1rMHeVBUwg6ZmaebN0v7mg4U7YcU1iFXPDCKv6"
              width={40}
              height={40}
            />
            <Image
              alt="Professional 3"
              className="w-10 h-10 rounded-full border-2 border-surface object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkExlNU5J1cVLD3TH35Tnj0cOjmUiElDpnFbcadAYUdmPoPrDtBNbyw8zFdfjU_o_qiean8K9MfYi3WLGa5RDA__oxLrpl_eKtHWF70ach0km4q5JGZo4Zqfrkb3LSFAtRPOUI4uGEmPHbdcxOPv3-IMypRta_aCFmA7OmPERLc6P2iJqkUHr7wwYUxsKVVwTOVZtEht6bK93isWl-3-87rfB_QSFnB4Us1jE8XY46blBdf3r6BdFA08bZe4NiT8MbqB6erJw5nJ7S"
              width={40}
              height={40}
            />
          </div>
          <div className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant flex flex-col justify-center">
            <span className="text-primary font-bold">500+ Vetted Experts</span>
            <span className="flex items-center text-[#fbbf24]">
              <span
                className="material-symbols-outlined text-[16px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>{" "}
              4.9/5 Average Rating
            </span>
          </div>
        </div>
      </div>

      <div className="lg:w-1/2 w-full relative z-10">
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-outline-variant/30 group">
          <Image
            alt="Technical Service Illustration"
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBzOYaGWzw8bn6MouMUcwvAQK2NdNLbj7mAxPFqUXgdu2VzYTLH7VYmIrV1Bkv286JT-K0aqI6t14SzZ0cXMJzCLkRjZoqpIenBwC7LQzhh-hEwRK1prXaOaBUAbaSEXG1g_yiO9k1TDm6rgpaF5I3r6Sj2-FjJc6dvyGAoyiE0R4VvSeVu2J4n-zWNo-nX9S3y5KQjtGlW1tbiQ3HMVPe2WIpPy4eXJobOnHyy8yNc6OEYd2gzTmJl8BxXaoAT6jH-E__F6JEWf0B"
            fill
          />
          {/* Floating UI Card overlay */}
          <div className="absolute bottom-6 left-6 right-6 bg-surface/95 backdrop-blur-md p-md rounded-lg border border-outline-variant/30 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary">
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
              </div>
              <div>
                <h3 className="text-[14px] leading-[20px] tracking-[0.01em] font-medium text-primary font-bold">
                  Verified Professional
                </h3>
                <p className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant">
                  Diagnostics &amp; Repair
                </p>
              </div>
            </div>
            <span className="bg-[#10b981]/10 text-[#10b981] text-[12px] leading-[16px] tracking-[0.05em] font-semibold px-3 py-1 rounded-full border border-[#10b981]/20">
              Available Now
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
