import Image from "next/image";
import Link from "next/link";

const serviceRequests = [
  {
    id: "REQ-8091",
    client: "Acme Corp HQ",
    serviceType: "HVAC Diagnostic",
    status: "In Progress",
    statusColor: "bg-emerald-100 text-emerald-800",
  },
  {
    id: "REQ-8092",
    client: "Stark Industries",
    serviceType: "Server Rack Install",
    status: "Pending",
    statusColor: "bg-amber-100 text-amber-800",
  },
  {
    id: "REQ-8093",
    client: "Wayne Enterprises",
    serviceType: "Security System Audit",
    status: "In Progress",
    statusColor: "bg-emerald-100 text-emerald-800",
  },
  {
    id: "REQ-8094",
    client: "Daily Planet",
    serviceType: "Network Troubleshooting",
    status: "Completed",
    statusColor: "bg-slate-100 text-slate-800",
  },
];

const technicians = [
  { initials: "JD", name: "John Doe", status: "En route to REQ-8091", eta: "2 min" },
  { initials: "AS", name: "Alice Smith", status: "On-site at REQ-8093", eta: "Engaged" },
];

export default function AdminDashboardPage() {
  return (
    <div className="bg-surface text-on-surface flex min-h-screen">
      {/* SideNavBar */}
      <nav className="hidden md:flex flex-col h-screen w-72 fixed left-0 top-0 border-r border-outline-variant/30 bg-surface py-md z-40">
        <div className="px-4 mb-8">
          <h1 className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold font-black text-primary">
            Admin Console
          </h1>
          <p className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant mt-1">
            Technical Operations
          </p>
        </div>
        <div className="px-4 mb-6">
          <button className="w-full py-2 px-4 bg-primary text-on-primary rounded-lg text-[14px] leading-[20px] tracking-[0.01em] font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
              add
            </span>
            New Service
          </button>
        </div>
        <ul className="flex-1 flex flex-col gap-1 px-2">
          <li>
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high transition-all hover:translate-x-1 duration-200 rounded-lg"
            >
              <span className="material-symbols-outlined">dashboard</span>
              <span className="text-[14px] leading-[20px] tracking-[0.01em] font-medium">
                Overview
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high transition-all hover:translate-x-1 duration-200 rounded-lg"
            >
              <span className="material-symbols-outlined">build</span>
              <span className="text-[14px] leading-[20px] tracking-[0.01em] font-medium">
                Service Requests
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high transition-all hover:translate-x-1 duration-200 rounded-lg"
            >
              <span className="material-symbols-outlined">engineering</span>
              <span className="text-[14px] leading-[20px] tracking-[0.01em] font-medium">
                Technicians
              </span>
            </Link>
          </li>
          {/* Active Tab */}
          <li>
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 text-secondary bg-secondary-container/10 border-r-4 border-secondary rounded-lg"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                monitoring
              </span>
              <span className="text-[14px] leading-[20px] tracking-[0.01em] font-medium font-semibold">
                Analytics
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high transition-all hover:translate-x-1 duration-200 rounded-lg"
            >
              <span className="material-symbols-outlined">inventory_2</span>
              <span className="text-[14px] leading-[20px] tracking-[0.01em] font-medium">
                Inventory
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high transition-all hover:translate-x-1 duration-200 rounded-lg"
            >
              <span className="material-symbols-outlined">settings</span>
              <span className="text-[14px] leading-[20px] tracking-[0.01em] font-medium">
                Settings
              </span>
            </Link>
          </li>
        </ul>
        <div className="mt-auto px-2 border-t border-outline-variant/30 pt-4">
          <ul className="flex flex-col gap-1">
            <li>
              <Link
                href="#"
                className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high transition-all rounded-lg"
              >
                <span className="material-symbols-outlined">help</span>
                <span className="text-[14px] leading-[20px] tracking-[0.01em] font-medium">
                  Support
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/login"
                className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high transition-all rounded-lg"
              >
                <span className="material-symbols-outlined">logout</span>
                <span className="text-[14px] leading-[20px] tracking-[0.01em] font-medium">
                  Sign Out
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-1 md:ml-72 p-gutter max-w-[1280px] mx-auto w-full">
        {/* Header */}
        <header className="flex justify-between items-center mb-lg">
          <div>
            <h2 className="text-[30px] leading-[38px] tracking-[-0.01em] font-semibold text-primary">
              Operations Analytics
            </h2>
            <p className="text-[16px] leading-[24px] text-on-surface-variant mt-1">
              Real-time metrics and service orchestration.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                search
              </span>
              <input
                className="pl-10 pr-4 py-2 border border-outline-variant/50 rounded-lg text-[16px] leading-[24px] focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none w-64 bg-surface-container-lowest widget-shadow"
                placeholder="Search resources..."
                type="text"
              />
            </div>
            <button className="w-10 h-10 rounded-full border border-outline-variant/50 flex items-center justify-center bg-surface-container-lowest hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">
                notifications
              </span>
            </button>
          </div>
        </header>

        {/* Analytics Widgets (Bento Grid) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
          {/* Widget 1: Revenue */}
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 widget-shadow hover-lift">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase tracking-wider">
                Total Revenue
              </h3>
              <span className="material-symbols-outlined text-secondary bg-secondary-container/20 p-2 rounded-lg">
                payments
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[48px] leading-[56px] tracking-[-0.02em] font-bold text-primary">
                $124,500
              </span>
              <span className="text-[14px] leading-[20px] tracking-[0.01em] font-medium text-emerald-600 flex items-center">
                <span className="material-symbols-outlined text-[16px]">
                  arrow_upward
                </span>{" "}
                12.5%
              </span>
            </div>
            <p className="text-[16px] leading-[24px] text-on-surface-variant/70 mt-2">
              vs. previous 30 days
            </p>
          </div>

          {/* Widget 2: Technicians */}
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 widget-shadow hover-lift">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase tracking-wider">
                Active Technicians
              </h3>
              <span className="material-symbols-outlined text-secondary bg-secondary-container/20 p-2 rounded-lg">
                engineering
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[48px] leading-[56px] tracking-[-0.02em] font-bold text-primary">
                48
              </span>
              <span className="text-[16px] leading-[24px] text-on-surface-variant">
                / 52 available
              </span>
            </div>
            <div className="w-full bg-surface-container-high rounded-full h-2 mt-4">
              <div
                className="bg-secondary h-2 rounded-full"
                style={{ width: "92%" }}
              ></div>
            </div>
          </div>

          {/* Widget 3: Pending Requests */}
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 widget-shadow hover-lift">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase tracking-wider">
                Pending Requests
              </h3>
              <span className="material-symbols-outlined text-error bg-error-container/50 p-2 rounded-lg">
                pending_actions
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[48px] leading-[56px] tracking-[-0.02em] font-bold text-primary">
                15
              </span>
              <span className="text-[14px] leading-[20px] tracking-[0.01em] font-medium text-error flex items-center">
                <span className="material-symbols-outlined text-[16px]">
                  arrow_upward
                </span>{" "}
                3 urgent
              </span>
            </div>
            <p className="text-[16px] leading-[24px] text-on-surface-variant/70 mt-2">
              Requires immediate dispatch
            </p>
          </div>
        </section>

        {/* Complex Layout Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-md mb-xl">
          {/* Service Management Table (Spans 2 columns) */}
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant/30 widget-shadow overflow-hidden flex flex-col">
            <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low/50">
              <h3 className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold text-primary">
                Service Management
              </h3>
              <button className="text-secondary text-[14px] leading-[20px] tracking-[0.01em] font-medium flex items-center gap-1 hover:underline">
                View All{" "}
                <span className="material-symbols-outlined text-[16px]">
                  arrow_forward
                </span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F1F5F9] border-b border-outline-variant/30">
                    <th className="p-4 text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase">
                      ID
                    </th>
                    <th className="p-4 text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase">
                      Client
                    </th>
                    <th className="p-4 text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase">
                      Service Type
                    </th>
                    <th className="p-4 text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase">
                      Status
                    </th>
                    <th className="p-4 text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {serviceRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="hover:bg-surface-container-low/30 transition-colors"
                    >
                      <td className="p-4 text-[14px] leading-[20px] tracking-[0.01em] font-medium text-on-surface-variant">
                        {request.id}
                      </td>
                      <td className="p-4 text-[16px] leading-[24px] text-primary font-medium">
                        {request.client}
                      </td>
                      <td className="p-4 text-[16px] leading-[24px] text-on-surface-variant">
                        {request.serviceType}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${request.statusColor}`}
                        >
                          {request.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button className="text-on-surface-variant hover:text-secondary">
                          <span className="material-symbols-outlined">
                            more_vert
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Technician Dispatch Map Widget */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 widget-shadow overflow-hidden flex flex-col">
            <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low/50">
              <h3 className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold text-primary">
                Live Dispatch
              </h3>
              <button className="text-on-surface-variant hover:text-secondary">
                <span className="material-symbols-outlined">filter_list</span>
              </button>
            </div>
            <div className="relative h-64 bg-surface-container-low w-full overflow-hidden">
              {/* Map Placeholder Image */}
              <Image
                alt="Map View"
                className="w-full h-full object-cover opacity-70 grayscale"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAeWzIckYyXzzmn1ekHRsNCcnFZyUxt6EH7yyHEXws1-28qj2bE3repWGI6VovAUsx7N0eSK87tne6a_LAc_T-BcFXEku44Ls7uEdLNhvA7A7ylFKnYigyy-4BpMz8ipznNxET96KFbThi-bGxqc5osyoQrTQ-S5xWFpcwscPe48j8KrnZN-GvKeVxSZY8iRuyAHmjAVz6PjKP3BpA1SMyX3tVGuzwi3epd7IXdvVutvwXODEAAWsexB09qAwASKq19dxzuPlVd-FY"
                fill
              />
              {/* Faux Map Markers */}
              <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-secondary rounded-full border-2 border-white shadow-md animate-pulse"></div>
              <div className="absolute top-1/2 left-2/3 w-4 h-4 bg-secondary rounded-full border-2 border-white shadow-md"></div>
              <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-md"></div>
            </div>
            <div className="p-4 flex flex-col gap-3">
              {technicians.map((tech) => (
                <div
                  key={tech.initials}
                  className="flex items-center gap-3 p-2 hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-secondary-container/30 flex items-center justify-center text-secondary text-[12px] leading-[16px] tracking-[0.05em] font-semibold">
                    {tech.initials}
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] leading-[20px] tracking-[0.01em] font-medium text-primary">
                      {tech.name}
                    </p>
                    <p className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant">
                      {tech.status}
                    </p>
                  </div>
                  <span className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-secondary">
                    {tech.eta}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
