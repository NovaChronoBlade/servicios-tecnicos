import Image from "next/image";
import Link from "next/link";

export function FeaturedServicesSection() {
  return (
    <section className="max-w-[1280px] mx-auto px-gutter py-xl">
      <div className="flex flex-col md:flex-row justify-between items-end mb-lg gap-sm">
        <div className="max-w-2xl">
          <h2 className="text-[30px] leading-[38px] tracking-[-0.01em] font-semibold text-primary mb-sm">
            Servicios Técnicos de Primera Calidad
          </h2>
          <p className="text-[16px] leading-[24px] text-on-surface-variant">
            Profesionales rigurosamente verificados para necesidades complejas de infraestructura.
          </p>
        </div>
        <button className="text-secondary text-[14px] leading-[20px] tracking-[0.01em] font-medium hover:text-secondary-fixed-dim transition-colors flex items-center gap-2 whitespace-nowrap">
          Conoce todos los servicios{" "}
          <span className="material-symbols-outlined text-[18px]">
            arrow_forward
          </span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-md auto-rows-[minmax(300px,auto)]">
        {/* Service 1: Large Feature (Plumbing) */}
        <div className="md:col-span-8 bg-surface rounded-xl border border-outline-variant/30 p-md flex flex-col justify-between service-card-hover relative overflow-hidden group bento-card">
          <div className="flex justify-between items-start z-10 relative">
            <div className="w-14 h-14 rounded-lg bg-surface-container-low flex items-center justify-center border border-outline-variant/20 mb-sm">
              <span
                className="material-symbols-outlined text-[28px] text-primary service-icon transition-colors"
                style={{ fontVariationSettings: "'FILL' 0" }}
              >
                plumbing
              </span>
            </div>
            <span className="bg-surface text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant px-3 py-1 rounded-full border border-outline-variant/30 shadow-sm">
              Desde $80000/hr
            </span>
          </div>
          {/*Aca empiza todo el DIV de Plomeria*/ }
          <div className="mt-xl z-10 relative w-full md:w-[50%] pr-4">
            <h3 className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold text-primary mb-xs">
              Plomería especializada
            </h3>
            <p className="text-[16px] leading-[24px] text-on-surface-variant mb-md line-clamp-3">
              Diagnósticos completos, 
              detección de fugas y mantenimiento de sistemas de alta presión a cargo de técnicos certificados.
            </p>
            <button className="bg-primary text-on-primary text-[14px] leading-[20px] tracking-[0.01em] font-medium px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors shadow-sm inline-flex items-center gap-2 w-max">
              Solicitar servicio
            </button>
          </div>
          {/* Decorative Image overlay */}
          <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-60 group-hover:opacity-30 transition-opacity duration-500 z-0">
            <Image
              alt="Plumbing background"
              className="object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA35clvisyRzG_4frZXEqwL_5oo0BqzrIeZ-0lu6jViWUrIUd5DayHgY2vO4YQHB-p04J_FnqjfQM4r9DrJhe1WJzP2Dr_FSg1McAHqB1QxfLwlWhdRLU_a0dfvHUqGWzVQ-5k_aQOMiyWh0xcgXMMInRNxjSaVJrfZ1wFOfcTlVGUj7qmXXA0oAVW9kSgoM84rdn2jDsVcPnND34EE0FdHgEQEK6U9I-IQ2TBf8nZvfkizUJoDbc_7yqh1LRScr9zBYLhZVWQUBoNA"
              fill
            />
          </div>
        </div>

        {/* Service 2: Standard Card (Electrical) */}
        <div className="md:col-span-4 bg-surface rounded-xl border border-outline-variant/30 p-md flex flex-col justify-between service-card-hover bento-card relative">
          <div className="flex justify-between items-start mb-sm">
            <div className="w-14 h-14 rounded-lg bg-surface-container-low flex items-center justify-center border border-outline-variant/20">
              <span
                className="material-symbols-outlined text-[28px] text-primary service-icon transition-colors"
                style={{ fontVariationSettings: "'FILL' 0" }}
              >
                bolt
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold text-primary mb-xs">
              Arquitectura Eléctrica
            </h3>
            <p className="text-[16px] leading-[24px] text-on-surface-variant mb-md text-sm">
              Integración de hogar inteligente, actualizaciones de paneles y aislamiento de fallas.
            </p>
              <div className="w-full h-[180px] opacity-60 relative rounded-xl overflow-hidden mb-md group">                <Image
                  src="https://files.123inventatuweb.com/acens110417/image/4656-9076212.jpg"
                  alt="Servicio eléctrico"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
          </div>
          <div className="flex items-center justify-between border-t border-outline-variant/20 pt-sm mt-auto">
            <span className="text-[14px] leading-[20px] tracking-[0.01em] font-medium text-on-surface-variant font-bold">
              Desde $150000/hr
            </span>
            <button className="text-primary hover:text-secondary transition-colors text-[14px] leading-[20px] tracking-[0.01em] font-medium font-bold flex items-center gap-1">
              Agregar{" "}
              <span className="material-symbols-outlined text-[18px]">
                add_circle
              </span>
            </button>
          </div>
        </div>

        {/* Service 3: Standard Card (Carpentry) */}
        <div className="md:col-span-4 bg-surface rounded-xl border border-outline-variant/30 p-md flex flex-col justify-between service-card-hover bento-card relative">
          <div className="flex justify-between items-start mb-sm">
            <div className="w-14 h-14 rounded-lg bg-surface-container-low flex items-center justify-center border border-outline-variant/20">
              <span
                className="material-symbols-outlined text-[28px] text-primary service-icon transition-colors"
                style={{ fontVariationSettings: "'FILL' 0" }}
              >
                carpenter
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold text-primary mb-xs">
              Carpintería
            </h3>
            <p className="text-[16px] leading-[24px] text-on-surface-variant mb-md text-sm">
              Fabricación personalizada, modificaciones estructurales y acabados premium.
            </p>
            <div className="w-full h-[180px] opacity-60 relative rounded-xl overflow-hidden mb-md group">                <Image
                  src="https://constructor.lacuarta.com/wp-content/uploads/2022/03/Carpinteria-Muebleria-Madera.jpg"
                  alt="Servicio de carpintería"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
          </div>
          <div className="flex items-center justify-between border-t border-outline-variant/20 pt-sm mt-auto">
            <span className="text-[14px] leading-[20px] tracking-[0.01em] font-medium text-on-surface-variant font-bold">
              Desde $90000/hr
            </span>
            <button className="text-primary hover:text-secondary transition-colors text-[14px] leading-[20px] tracking-[0.01em] font-medium font-bold flex items-center gap-1">
              Agregar{" "}
              <span className="material-symbols-outlined text-[18px]">
                add_circle
              </span>
            </button>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="md:col-span-8 bg-primary text-on-primary rounded-xl p-md flex flex-col md:flex-row md:items-center gap-lg relative overflow-hidden shadow-sm">          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-container z-0"></div>
          <div className="absolute right-0 top-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 z-0"></div>
          <div className="relative z-10 flex-1">
            <h3 className="text-[30px] leading-[38px] tracking-[-0.01em] font-semibold mb-xs text-on-primary">
              Soluciones Empresariales
            </h3>
            <p className="text-[16px] leading-[24px] text-on-primary/80">
              Administre múltiples propiedades con soporte técnico respaldado por SLA dedicado y despacho prioritario.
            </p>
          </div>
          <button className="relative z-10 bg-surface text-primary text-[14px] leading-[20px] tracking-[0.01em] font-medium px-8 py-4 rounded-lg hover:bg-surface-container-low transition-colors shadow-sm whitespace-nowrap flex-shrink-0">
            Contactar Ventas
          </button>
        </div>
      </div>
    </section>
  );
}
