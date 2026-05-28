import Image from "next/image";
import Link from "next/link";

const serviceRequests = [
  {
    id: "REQ-8091",
    client: "Acme Corp HQ",
    serviceType: "Diagnóstico de HVAC",
    status: "En Progreso",
    statusColor: "bg-emerald-100 text-emerald-800",
  },
  {
    id: "REQ-8092",
    client: "Stark Industries",
    serviceType: "Instalación de Rack de Servidores",
    status: "Pendiente",
    statusColor: "bg-amber-100 text-amber-800",
  },
  {
    id: "REQ-8093",
    client: "Wayne Enterprises",
    serviceType: "Auditoría de Sistema de Seguridad",
    status: "En Progreso",
    statusColor: "bg-emerald-100 text-emerald-800",
  },
  {
    id: "REQ-8094",
    client: "Daily Planet",
    serviceType: "Resolución de Problemas de Red",
    status: "Completado",
    statusColor: "bg-slate-100 text-slate-800",
  },
];

const technicians = [
  { initials: "JD", name: "John Doe", status: "En ruta hacia REQ-8091", eta: "2 min" },
  { initials: "AS", name: "Alice Smith", status: "En el sitio de REQ-8093", eta: "Comprometido" },
];

export default function AdminDashboardPage() {
  return (
    <div className="bg-surface text-on-surface flex min-h-screen">
      {/* SideNavBar */}
      <nav className="hidden md:flex flex-col h-[calc(100vh-2rem)] w-72 fixed left-0 top-4 border-r border-outline-variant/30 bg-surface py-md z-40 rounded-r-2xl">
        <div className="px-4 mb-8">
          <h1 className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold font-black text-primary">
            Consola de Administrador
          </h1>
          <p className="text-sm text-on-surface-variant">
            Operaciones Técnicas
          </p>
        </div>
        <div className="px-4 mb-6">
          <button className="w-full py-2 px-4 bg-primary text-on-primary rounded-lg text-[14px] leading-[20px] tracking-[0.01em] font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
              add
            </span>
            Nuevo Servicio
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
                Descripción General
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
                Solicitudes de Servicio
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
                Técnicos
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
                Analítica
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
                Inventario
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
                Configuración
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
                  Soporte
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
                  Cerrar Sesión
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-1 md:ml-72 px-8 py-10 lg:px-12 max-w-[1400px] mx-auto w-full">
        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 mb-10">
          <div>
            <h2 className="text-[30px] leading-[38px] tracking-[-0.01em] font-semibold text-primary">
              Analítica de Operaciones
            </h2>
            <p className="text-sm text-on-surface-variant">
              Métricas en tiempo real y orquestación de servicios.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                search
              </span>
              <input
                className="pl-10 pr-4 py-2 border border-outline-variant/50 rounded-lg text-[16px] leading-[24px] focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none w-64 bg-surface-container-lowest widget-shadow"
                placeholder="Buscar recursos..."
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
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Widget 1: Revenue */}
          <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 widget-shadow hover-lift">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase tracking-wider">
                Ingresos Totales
              </h3>
              <span className="material-symbols-outlined text-secondary bg-secondary-container/20 p-2 rounded-lg">
                payments
              </span>
            </div>
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-[48px] leading-[56px] tracking-[-0.02em] font-bold text-primary">
                $124,500
              </span>

              <span className="text-[14px] leading-[20px] tracking-[0.01em] font-medium text-emerald-600 flex items-center whitespace-nowrap">
                <span className="material-symbols-outlined text-[16px]">
                  arrow_upward
                </span>
                12.5%
              </span>
            </div>
            <p className="text-sm text-on-surface-variant">
              vs. últimos 30 días
            </p>
          </div>

          {/* Widget 2: Technicians */}
          <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 widget-shadow hover-lift">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase tracking-wider">
                Técnicos Activos
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
                / 52 disponibles
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
          <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 widget-shadow hover-lift">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase tracking-wider">
                Solicitudes Pendientes
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
                3 urgentes
              </span>
            </div>
            <p className="text-sm text-on-surface-variant">
              Requiere envío inmediato
            </p>
          </div>
        </section>

        {/* Complex Layout Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Service Management Table (Spans 2 columns) */}
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant/30 widget-shadow overflow-hidden flex flex-col">
            <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low/50">
              <h3 className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold text-primary">
                Gestión de Servicios
              </h3>
              <button className="text-secondary text-[14px] leading-[20px] tracking-[0.01em] font-medium flex items-center gap-1 hover:underline">
                Ver Todo{" "}
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
                      Cliente
                    </th>
                    <th className="p-4 text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase">
                      Tipo de Servicio
                    </th>
                    <th className="p-4 text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase">
                      Estado
                    </th>
                    <th className="p-4 text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase text-right">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {serviceRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="hover:bg-surface-container-low/30 transition-colors"
                    >
                      <td className="px-6 py-5 text-[14px] leading-[20px] tracking-[0.01em] font-medium text-on-surface-variant">
                        {request.id}
                      </td>
                      <td className="px-6 py-5 text-[16px] leading-[24px] text-primary font-medium">
                        {request.client}
                      </td>
                      <td className="px-6 py-5 text-[16px] leading-[24px] text-on-surface-variant">
                        {request.serviceType}
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${request.statusColor}`}
                        >
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
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
                Despacho en Vivo
              </h3>
              <button className="text-on-surface-variant hover:text-secondary">
                <span className="material-symbols-outlined">filter_list</span>
              </button>
            </div>
            <div className="relative h-64 bg-surface-container-low w-full overflow-hidden">
              {/* Map Placeholder Image */}
              <Image
                alt="Mapa"
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
                    <p className="text-sm text-on-surface-variant">
                      {tech.name}
                    </p>
                    <p className="text-sm text-on-surface-variant">
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
