import { useState, useRef } from "react";

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200 transition-all duration-200";

const inputSmClass =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200 transition-all duration-200";

function LoginView({ onToggle }) {
  return (
    <section className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left: Brand Visual */}
      <div className="relative hidden lg:flex flex-col justify-between bg-gray-200 p-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt="Brand Visual"
            className="object-cover w-full h-full opacity-60 mix-blend-multiply"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIknf-_lBSzsPKzWdutQm6ZI9i7ktuW-KWL4xtz2J9qYKvoPLJUYMxDgoByXeeb_WNBw1eeHZ5ahtoDhQhYBllxQDmFi1DgLHMtwrLg3PUg0Vpr4MdxxQWuhDPLhROKvB5khjNK4QKubG47pjXwVZkgd7-w_vcpu-GtEFLfHcNWiWjnrDYbhHTsyEoBJYU5pLxljkYIWi0KEIsZRA-EmCGVYTKVaBw-RnVfrUDjJWdwkb81TOQCyV82LDdD2LY647RLiLpPcaY8Ipk"
          />
        </div>
        <div className="relative z-10">
          <h1 className="text-5xl font-bold text-black tracking-tight">TechServe Pro</h1>
          <p className="text-lg text-gray-500 mt-6 max-w-md">
            Precision engineering in service delivery. Access your centralized dashboard to manage
            technical operations.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-3 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
          </svg>
          <span className="text-sm font-medium tracking-wide">Enterprise Grade Security</span>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex items-center justify-center p-6 lg:p-20 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile header */}
          <div className="lg:hidden mb-12">
            <h1 className="text-3xl font-bold text-black">TechServe Pro</h1>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-1">Welcome back</h2>
            <p className="text-sm text-gray-500">Sign in to your account to continue.</p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1" htmlFor="login-email">
                Email Address
              </label>
              <div className="relative">
                <input
                  className={inputClass}
                  id="login-email"
                  required
                  type="email"
                  defaultValue="admin@techserve.pro"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-cyan-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1" htmlFor="login-password">
                Password
              </label>
              <input
                className={inputClass}
                id="login-password"
                required
                type="password"
              />
            </div>

            {/* Utilities */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  className="w-4 h-4 rounded border-gray-300 text-black focus:ring-gray-200 cursor-pointer"
                  type="checkbox"
                />
                <span className="text-sm text-gray-500 group-hover:text-gray-900 transition-colors">
                  Remember me
                </span>
              </label>
              <a className="text-sm font-medium text-cyan-600 hover:text-cyan-400 transition-colors" href="#">
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <div className="pt-3">
              <button
                className="w-full rounded-lg bg-black text-white py-3 text-sm font-bold shadow-sm hover:shadow-md hover:bg-gray-900 transition-all active:scale-[0.98]"
                type="submit"
              >
                Sign In
              </button>
            </div>
          </form>

          <div className="mt-20 text-center">
            <p className="text-sm text-gray-500">
              Don't have a client account?{" "}
              <button
                className="text-sm font-bold text-black hover:text-cyan-600 transition-colors ml-1"
                onClick={() => onToggle("register")}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function RegisterView({ onToggle }) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-6 py-20 bg-gray-50">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black tracking-tight mb-3">TechServe Pro</h1>
          <h2 className="text-2xl font-semibold text-gray-900">Client Registration</h2>
          <p className="text-sm text-gray-500 mt-1">
            Complete your profile to request and manage services.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <form
            className="p-12 space-y-12 divide-y divide-gray-100"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Section 1: Identity */}
            <div className="pb-6">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                Identity
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    Full Name
                  </label>
                  <input className={inputSmClass} placeholder="e.g. Jane Doe" required type="text" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    National ID / Passport
                  </label>
                  <input className={inputSmClass} placeholder="ID Number" required type="text" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    Birth Date
                  </label>
                  <input className={inputSmClass} required type="date" />
                </div>
              </div>
            </div>

            {/* Section 2: Contact */}
            <div className="pt-12 pb-6">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                Contact
              </h3>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  Email Address
                </label>
                <input className={inputSmClass} placeholder="name@company.com" required type="email" />
              </div>
            </div>

            {/* Section 3: Location */}
            <div className="pt-12 pb-3">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                Location
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    Street Address
                  </label>
                  <input className={inputSmClass} placeholder="123 Engineering Blvd" required type="text" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    City
                  </label>
                  <input className={inputSmClass} placeholder="Metropolis" required type="text" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    ZIP Code
                  </label>
                  <input className={inputSmClass} placeholder="10001" required type="text" />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-12 flex flex-col sm:flex-row items-center justify-between gap-6">
              <button
                className="w-full sm:w-auto text-sm font-medium text-gray-500 hover:text-black transition-colors py-2 px-4 rounded-lg hover:bg-gray-100"
                onClick={() => onToggle("login")}
                type="button"
              >
                Cancel
              </button>
              <button
                className="w-full sm:w-auto rounded-lg bg-black text-white py-3 px-20 text-sm font-bold shadow-sm hover:shadow-md hover:bg-gray-900 transition-all active:scale-[0.98]"
                type="submit"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Already registered?{" "}
            <button
              className="text-sm font-bold text-black hover:text-cyan-600 transition-colors ml-1"
              onClick={() => onToggle("login")}
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}

export default function TechServePro() {
  const [view, setView] = useState("login");
  const [opacity, setOpacity] = useState(1);
  const timeoutRef = useRef(null);

  const toggleView = (target) => {
    setOpacity(0);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setView(target);
      setOpacity(1);
    }, 300);
  };

  return (
    <main
      className="relative min-h-screen w-full transition-opacity duration-300"
      style={{ opacity }}
    >
      {view === "login" ? (
        <LoginView onToggle={toggleView} />
      ) : (
        <RegisterView onToggle={toggleView} />
      )}
    </main>
  );
}
