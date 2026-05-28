export function HowItWorksSection() {
  return (
    <section className="bg-surface-container-lowest py-xl border-y border-outline-variant/20">
      <div className="max-w-[1280px] mx-auto px-gutter">
        <div className="text-center mb-lg max-w-2xl mx-auto">
          <h2 className="text-[30px] leading-[38px] tracking-[-0.01em] font-semibold text-primary mb-sm">
            Proceso optimizado
          </h2>
          <p className="text-[16px] leading-[24px] text-on-surface-variant">
            {"Hemos diseñado un proceso fluido, desde la solicitud hasta la finalización."}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-outline-variant/30 z-0"></div>
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="w-24 h-24 rounded-full bg-surface border border-outline-variant/30 flex items-center justify-center mb-md shadow-sm">
              <span
                className="material-symbols-outlined text-[40px] text-primary"
                style={{ fontVariationSettings: "'FILL' 0" }}
              >
                manage_search
              </span>
            </div>
            <h3 className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold text-primary mb-xs">
              Selecciona tu Servicio
            </h3>
            <p className="text-[16px] leading-[24px] text-on-surface-variant">
              Elige entre nuestra selección de categorías técnicas y especifica tus requisitos.
            </p>
          </div>
          {/* Step 2 */}
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="w-24 h-24 rounded-full bg-surface border border-outline-variant/30 flex items-center justify-center mb-md shadow-sm">
              <span
                className="material-symbols-outlined text-[40px] text-primary"
                style={{ fontVariationSettings: "'FILL' 0" }}
              >
                handshake
              </span>
            </div>
            <h3 className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold text-primary mb-xs">
              Emparejamiento Inteligente
            </h3>
            <p className="text-[16px] leading-[24px] text-on-surface-variant">
              Nuestro algoritmo te empareja con un experto que posee las certificaciones precisas necesarias.
            </p>
          </div>
          {/* Step 3 */}
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="w-24 h-24 rounded-full bg-surface border border-outline-variant/30 flex items-center justify-center mb-md shadow-sm">
              <span
                className="material-symbols-outlined text-[40px] text-primary"
                style={{ fontVariationSettings: "'FILL' 0" }}
              >
                task_alt
              </span>
            </div>
            <h3 className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold text-primary mb-xs">
              Ejecución
            </h3>
            <p className="text-[16px] leading-[24px] text-on-surface-variant">
              Entrega precisa con seguimiento en tiempo real y facturación digital integral.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
