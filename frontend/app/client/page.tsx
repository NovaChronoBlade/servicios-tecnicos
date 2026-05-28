import { SideNavBar } from "@/components/side-nav-bar";
import { DashboardFooter } from "@/components/dashboard-footer";

const availableServices = [
  {
    id: 1,
    title: "Mantenimiento de Servidor",
    category: "IT Ops",
    description:
      "Diagnóstico completo y reparación para hardware de servidor empresarial.",
    price: "Desde $150/hr",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAZeqZhMidZC-YGdmbmhHkyZM6l0-upHFCLk9VxBbUTKdpX3jvMKTXMoKpo-AmEuUiT2mqZdhTdZ35RRwm5Dk4IlmNlndOctDhldLc1u89QBnRZh0X9LpEV0MCwjCCHu_M8DfcZJoV_D4dweEMZj6tFcDVgBsb3R7wOkEMOvW2Nq54GZoizjmKRWXDMsDaBpcbcbGCPRLLfgaMojG0EGFG0dcbSOwgy9lESatuIdhiS2SgQPztYmrnX5hm-kNDZUCv2x4L66j6rXIxO",
  },
  {
    id: 2,
    title: "Configuración de Red",
    category: "Infra",
    description:
      "Instalación y configuración de redes robustas de grado empresarial.",
    price: "Desde $800/flat",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDGoNie7_tFLrpCfMqAIO3suFrc0uJHORFwKnrMXZ18ifJGO_2K7q39vONkgCevYUuZOW8SmWSqxGivF5JrlD72Zuixsf58jI7Pe5TYiO1En7amU1OcDkwVJYdSsHS9W6rwp7dUwM1USnd_ByJrdQn6GtDvJORygJmYl9BUmVsw7z__3M7np99IbFRDzy2IR6umrv3eUOlTLYcEOXJihOR9KWbiAFKprdTRCiidE2kDv6JVR972qJ1AmAfxxQnORyzd2R-KxMkYhclA",
  },
];

const activeRequests = [
  {
    id: "REQ-2049",
    service: "Diagnóstico de HVAC",
    tech: "JM",
    status: "ETA del Técnico: 45 mins",
    progress: 75,
    icon: "schedule",
  },
  {
    id: "REQ-2050",
    service: "Reemplazo de Router",
    tech: "AK",
    status: "En Progreso",
    progress: 50,
    icon: "sync",
  },
];

const serviceHistory = [
  {
    id: "#SH-102",
    service: "Auditoría del Sistema",
    date: "12 Oct, 2024",
    technician: "Sarah L.",
    status: "En Progreso",
    statusColor: "bg-secondary-container/20 text-secondary",
    amount: "$450.00",
  },
  {
    id: "#SH-101",
    service: "Parches de Emergencia",
    date: "10 Oct, 2024",
    technician: "Mike T.",
    status: "Completado",
    statusColor: "bg-surface-container text-on-surface-variant",
    amount: "$800.00",
  },
  {
    id: "#SH-100",
    service: "Inspección del Sitio",
    date: "08 Oct, 2024",
    technician: "Sin asignar",
    status: "Pendiente",
    statusColor: "border border-outline-variant text-on-surface-variant",
    amount: "$150.00",
  },
];

export default function ClientDashboardPage() {
  return (
    <div className="flex h-screen bg-surface">
      <SideNavBar userType="client" activeTab="overview" />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-80 flex flex-col min-w-0 bg-background overflow-y-auto">
        {/* Top Bar (Cart Preview) */}
        <div className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-outline-variant/20 px-12 py-5 hidden md:flex justify-end items-center">
          <button className="relative flex items-center gap-2 p-2 rounded-lg hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-primary">
              shopping_cart
            </span>
            <span className="text-[14px] leading-[20px] tracking-[0.01em] font-medium text-primary">
              Carrito
            </span>
            <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-secondary text-on-secondary text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              2
            </span>
          </button>
        </div>

        <div className="p-6 md:p-10 max-w-[1440px] mx-auto w-full space-y-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h2 className="text-[36px] leading-[44px] md:text-[48px] md:leading-[56px] tracking-[-0.02em] font-bold text-primary">
                
              </h2>
              <p className="text-[16px] leading-[24px] text-on-surface-variant mt-2">
                Administra tus servicios técnicos y solicitudes activas.
              </p>
            </div>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Available Services (Spans 2 columns on lg) */}
            <div className="lg:col-span-2 space-y-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold text-primary">
                  Servicios Disponibles
                </h3>
                <a
                  href="#"
                  className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-secondary hover:underline"
                >
                  VER TODO
                </a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableServices.map((service) => (
                  <div
                    key={service.id}
                    className="service-card bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 flex flex-col h-full cursor-pointer hover-lift"
                  >
                    <div
                      className="h-44 rounded-xl mb-5 bg-cover bg-center"
                      style={{ backgroundImage: `url('${service.image}')` }}
                    ></div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-[18px] leading-[26px] font-semibold leading-[20px] tracking-[0.01em] font-medium text-primary">
                        {service.title}
                      </h4>
                      <span className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant bg-surface-container px-2 py-1 rounded">
                        {service.category}
                      </span>
                    </div>
                    <p className="text-[15px] leading-[26px] text-on-surface-variant flex-1 mb-4">
                      {service.description}
                    </p>
                    <div className="flex justify-between items-center mt-auto border-t border-outline-variant/30 pt-3">
                      <span className="text-[14px] leading-[20px] tracking-[0.01em] font-medium text-primary font-semibold">
                        {service.price}
                      </span>
                      <button className="text-secondary hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">
                          add_circle
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Active Requests Sidebar Widget */}
            <div className="lg:col-span-1 space-y-md">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                <h3 className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase tracking-wider mb-4">
                  Solicitudes Activas
                </h3>
                <div className="space-y-6">
                  {activeRequests.map((request) => (
                    <div
                      key={request.id}
                      className="p-5 border border-outline-variant/50 rounded-xl hover:border-secondary-container transition-colors cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-[14px] leading-[20px] tracking-[0.01em] font-medium text-primary">
                            {request.id}
                          </p>
                          <p className="text-[16px] leading-[24px] text-[13px] text-on-surface-variant">
                            {request.service}
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-secondary text-sm">
                          {request.icon}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <div className="w-6 h-6 bg-surface-container rounded-full flex items-center justify-center text-xs font-bold text-on-surface-variant">
                          {request.tech}
                        </div>
                        <div className="flex-1">
                          <p className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant">
                            {request.status}
                          </p>
                          {request.progress && (
                            <div className="w-full bg-surface-container h-1.5 rounded-full mt-1 overflow-hidden">
                              <div
                                className="bg-secondary h-full rounded-full"
                                style={{ width: `${request.progress}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2 border border-outline text-primary text-[14px] leading-[20px] tracking-[0.01em] font-medium rounded-lg hover:bg-surface-container-low transition-colors">
                  Ver Mapa
                </button>
              </div>
            </div>
          </div>

          {/* Service History Table */}
          <div className="mt-lg">
            <h3 className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold text-primary mb-4">
              Historial de Servicios
            </h3>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-surface-container-low border-b border-outline-variant/30">
                    <tr>
                      <th className="p-6 text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase tracking-wider">
                        ID
                      </th>
                      <th className="p-6 text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase tracking-wider">
                        Servicio
                      </th>
                      <th className="p-6 text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase tracking-wider hidden md:table-cell">
                        Fecha
                      </th>
                      <th className="p-6 text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase tracking-wider hidden md:table-cell">
                        Técnico
                      </th>
                      <th className="p-6 text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="p-6 text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase tracking-wider text-right">
                        Cantidad
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {serviceHistory.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-surface-container-lowest/50 transition-colors"
                      >
                        <td className="p-4 text-[16px] leading-[24px] text-primary">
                          {item.id}
                        </td>
                        <td className="p-4 text-[14px] leading-[20px] tracking-[0.01em] font-medium text-primary">
                          {item.service}
                        </td>
                        <td className="p-4 text-[16px] leading-[24px] text-on-surface-variant hidden md:table-cell">
                          {item.date}
                        </td>
                        <td className="p-4 text-[16px] leading-[24px] text-on-surface-variant hidden md:table-cell">
                          {item.technician}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${item.statusColor}`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="p-4 text-[16px] leading-[24px] text-primary text-right">
                          {item.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <DashboardFooter />
      </main>
    </div>
  );
}
