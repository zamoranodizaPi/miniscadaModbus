import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bolt,
  Cable,
  Factory,
  Gauge,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  TowerControl,
  Wrench,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const content = {
  en: {
    brandTag: "Electrical Engineering",
    nav: ["Capabilities", "Sectors", "Strength", "Projects", "Contact"],
    quote: "Request a Quote",
    badge: "Heavy Industry & Power Systems",
    heroTitle: "Engineering Power Infrastructure with Precision and Reliability",
    heroText:
      "SIEZA delivers electrical engineering, testing, automation, and industrial execution for high-demand environments where uptime, safety, and technical confidence are non-negotiable.",
    contactUs: "Contact Us",
    viewExperience: "View Experience",
    highlights: [
      ["High Voltage Environments", "Substations, transmission, and power distribution execution."],
      ["Industrial Control", "Panels, PLC systems, and real-time plant visibility."],
      ["Field-Driven Engineering", "Solutions shaped by industrial reality, not generic assumptions."],
    ],
    capabilitiesLabel: "Capabilities",
    capabilitiesTitle: "Technical capability built for serious industrial and energy-sector execution.",
    capabilities: [
      {
        title: "Power Infrastructure Engineering",
        text: "Detailed engineering for substations, distribution systems, and critical industrial power networks.",
      },
      {
        title: "Electrical Testing & Commissioning",
        text: "Field validation, energized startup, protection checks, and technical assurance before operation.",
      },
      {
        title: "Industrial Automation & Control",
        text: "PLC, SCADA, monitoring, and electrical integration for high-availability industrial environments.",
      },
      {
        title: "Field Execution & Service",
        text: "On-site support, diagnostics, troubleshooting, and operational continuity under real plant conditions.",
      },
    ],
    sectorsLabel: "Industrial Sectors",
    sectorsTitle: "Sectors where power reliability and technical execution directly impact operations.",
    sectors: [
      {
        title: "Energy & Utilities",
        text: "Grid-connected infrastructure, substations, and medium-voltage execution.",
      },
      {
        title: "Industrial Plants",
        text: "Electrical systems for process continuity, safety, and heavy-duty operations.",
      },
      {
        title: "Control & Monitoring",
        text: "Panels, PLC architecture, supervision, and plant-level visibility.",
      },
    ],
    strengthLabel: "Engineering Strength",
    strengthTitle: "Built for trust in high-stakes electrical and industrial environments.",
    strengthText:
      "Our value is defined by technical depth, field experience, and disciplined execution in environments where failure is not an option.",
    metrics: [
      ["24/7", "Industrial readiness and technical response"],
      ["HV/MV", "Power infrastructure and substation focus"],
      ["End-to-end", "Engineering, execution, testing, and support"],
      ["Safety-first", "Compliance-driven delivery culture"],
    ],
    projectsLabel: "Projects",
    projectsTitle: "Project profiles designed for industrial confidence and power-system resilience.",
    projects: [
      {
        type: "High Voltage Engineering",
        title: "Substation Modernization Package",
        text: "Engineering, testing, and energized commissioning for mission-critical incoming power infrastructure.",
      },
      {
        type: "Industrial Automation",
        title: "Motor Control & Monitoring Retrofit",
        text: "Panel integration, control redesign, and plant-level visibility for reliability-driven operations.",
      },
      {
        type: "Field Execution",
        title: "Electrical Distribution Expansion",
        text: "Industrial installation, startup, and power system execution for production growth and operational resilience.",
      },
    ],
    ctaLabel: "Start the Conversation",
    ctaTitle:
      "Talk to an engineering team prepared for industrial power, field execution, and critical infrastructure.",
    ctaText:
      "Contact SIEZA to discuss electrical engineering, testing, automation, field services, and project support for heavy industry and energy systems.",
    footerTitle: "Serious electrical engineering for heavy industry, energy, and automation environments.",
    footerContact: "Contact",
    footerFocus: "Core Focus",
    footerFocusItems: [
      "Substations and power infrastructure",
      "Industrial plants and heavy operations",
      "Automation, monitoring, and execution",
    ],
  },
  es: {
    brandTag: "Ingeniería Eléctrica",
    nav: ["Capacidades", "Sectores", "Fortaleza", "Proyectos", "Contacto"],
    quote: "Solicitar cotización",
    badge: "Industria pesada y sistemas de potencia",
    heroTitle: "Ingeniería de infraestructura eléctrica con precisión y confiabilidad",
    heroText:
      "SIEZA desarrolla ingeniería eléctrica, pruebas, automatización y ejecución industrial para entornos de alta exigencia donde la continuidad, la seguridad y la confianza técnica no son negociables.",
    contactUs: "Contáctanos",
    viewExperience: "Ver experiencia",
    highlights: [
      ["Entornos de alto voltaje", "Subestaciones, transmisión y ejecución en distribución eléctrica."],
      ["Control industrial", "Tableros, PLC y visibilidad de planta en tiempo real."],
      ["Ingeniería orientada a campo", "Soluciones definidas por la realidad industrial, no por supuestos genéricos."],
    ],
    capabilitiesLabel: "Capacidades",
    capabilitiesTitle: "Capacidad técnica diseñada para proyectos industriales y del sector energético.",
    capabilities: [
      {
        title: "Ingeniería de infraestructura eléctrica",
        text: "Ingeniería detallada para subestaciones, sistemas de distribución y redes eléctricas industriales críticas.",
      },
      {
        title: "Pruebas y comisionamiento",
        text: "Validación en campo, arranque energizado, verificación de protecciones y aseguramiento técnico antes de operar.",
      },
      {
        title: "Automatización y control industrial",
        text: "PLC, SCADA, monitoreo e integración eléctrica para entornos industriales de alta disponibilidad.",
      },
      {
        title: "Ejecución y servicio en campo",
        text: "Soporte en sitio, diagnóstico, solución de fallas y continuidad operativa en condiciones reales de planta.",
      },
    ],
    sectorsLabel: "Sectores industriales",
    sectorsTitle: "Sectores donde la confiabilidad eléctrica y la ejecución técnica impactan directamente la operación.",
    sectors: [
      {
        title: "Energía y utilities",
        text: "Infraestructura conectada a red, subestaciones y ejecución en media tensión.",
      },
      {
        title: "Plantas industriales",
        text: "Sistemas eléctricos para continuidad de proceso, seguridad y operación de alta exigencia.",
      },
      {
        title: "Control y monitoreo",
        text: "Tableros, arquitectura PLC, supervisión y visibilidad a nivel planta.",
      },
    ],
    strengthLabel: "Fortaleza de ingeniería",
    strengthTitle: "Construido para generar confianza en entornos eléctricos e industriales de alta exigencia.",
    strengthText:
      "Nuestro valor se define por profundidad técnica, experiencia de campo y ejecución disciplinada en ambientes donde fallar no es opción.",
    metrics: [
      ["24/7", "Disponibilidad industrial y respuesta técnica"],
      ["AT/MT", "Enfoque en infraestructura eléctrica y subestaciones"],
      ["Integral", "Ingeniería, ejecución, pruebas y soporte"],
      ["Seguridad", "Cultura de entrega basada en cumplimiento"],
    ],
    projectsLabel: "Proyectos",
    projectsTitle: "Perfiles de proyecto diseñados para confianza industrial y resiliencia del sistema eléctrico.",
    projects: [
      {
        type: "Ingeniería de alto voltaje",
        title: "Modernización de subestación",
        text: "Ingeniería, pruebas y comisionamiento energizado para infraestructura crítica de alimentación.",
      },
      {
        type: "Automatización industrial",
        title: "Retrofit de control y monitoreo",
        text: "Integración de tableros, rediseño de control y visibilidad de planta para mejorar confiabilidad.",
      },
      {
        type: "Ejecución en campo",
        title: "Ampliación de distribución eléctrica",
        text: "Instalación industrial, arranque y ejecución del sistema eléctrico para crecimiento productivo y resiliencia operativa.",
      },
    ],
    ctaLabel: "Inicia la conversación",
    ctaTitle:
      "Habla con un equipo de ingeniería preparado para potencia industrial, ejecución en campo e infraestructura crítica.",
    ctaText:
      "Contacta a SIEZA para proyectos de ingeniería eléctrica, pruebas, automatización, servicios de campo y soporte para industria pesada y sistemas de energía.",
    footerTitle: "Ingeniería eléctrica seria para industria pesada, energía y automatización.",
    footerContact: "Contacto",
    footerFocus: "Enfoque principal",
    footerFocusItems: [
      "Subestaciones e infraestructura eléctrica",
      "Plantas industriales y operación pesada",
      "Automatización, monitoreo y ejecución",
    ],
  },
};

const capabilityIcons = [Bolt, Gauge, Cable, Wrench];
const sectorImages = [
  "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1600&q=80",
];
const footerIcons = [TowerControl, Factory, Sparkles];

export default function App() {
  const [language, setLanguage] = useState("en");
  const t = content[language];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#04070b] text-white">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(30,144,255,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,128,0,0.14),transparent_26%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.06]" />
      </div>

      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#04070b]/72 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 lg:px-8">
          <div className="flex items-center gap-4">
            <img
              src="/branding/logo_dark.png"
              alt="SIEZA"
              className="h-12 w-auto object-contain"
            />
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-slate-400">{t.brandTag}</p>
              <div className="mt-1 text-lg font-semibold tracking-[0.24em] text-white">SIEZA</div>
            </div>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {t.nav.map((label, index) => (
              <a
                key={label}
                href={["#capabilities", "#sectors", "#strength", "#projects", "#contact"][index]}
                className="text-sm text-slate-300 transition hover:text-white"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1 text-xs">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`rounded-full px-3 py-1.5 transition ${language === "en" ? "bg-white text-slate-950" : "text-slate-300"}`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage("es")}
                className={`rounded-full px-3 py-1.5 transition ${language === "es" ? "bg-white text-slate-950" : "text-slate-300"}`}
              >
                ES
              </button>
            </div>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:translate-y-[-1px]"
            >
              {t.quote}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </header>

      <main>
        <section
          className="relative flex min-h-screen items-end overflow-hidden"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(4,7,11,0.16) 0%, rgba(4,7,11,0.66) 52%, rgba(4,7,11,0.96) 100%), url('https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1900&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(251,146,60,0.14),transparent_20%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-36 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:pb-24">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-300">
                <ShieldCheck className="h-4 w-4 text-sky-300" />
                {t.badge}
              </div>

              <h1 className="mt-7 max-w-5xl text-5xl font-semibold leading-[0.92] tracking-tight text-white md:text-6xl xl:text-7xl">
                {t.heroTitle}
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">{t.heroText}</p>

              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:translate-y-[-1px]"
                >
                  {t.contactUs}
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  {t.viewExperience}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="grid gap-4 self-end"
            >
              {t.highlights.map(([title, text]) => (
                <div key={title} className="rounded-[1.8rem] border border-white/10 bg-black/35 p-5 backdrop-blur-md">
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="capabilities" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-120px" }} variants={fadeUp} transition={{ duration: 0.6 }}>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">{t.capabilitiesLabel}</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">{t.capabilitiesTitle}</h2>
          </motion.div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {t.capabilities.map((item, index) => {
              const Icon = capabilityIcons[index];
              return (
                <motion.article
                  key={item.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-120px" }}
                  variants={fadeUp}
                  transition={{ duration: 0.55, delay: index * 0.06 }}
                  className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(14,20,28,0.92),rgba(7,10,14,0.98))] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.32)]"
                >
                  <div className="inline-flex rounded-2xl border border-white/10 bg-white/5 p-3">
                    <Icon className="h-6 w-6 text-orange-300" />
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{item.text}</p>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section id="sectors" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-120px" }} variants={fadeUp} transition={{ duration: 0.6 }}>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-300">{t.sectorsLabel}</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">{t.sectorsTitle}</h2>
          </motion.div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {t.sectors.map((sector, index) => (
              <motion.article
                key={sector.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-120px" }}
                variants={fadeUp}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                className="group relative overflow-hidden rounded-[2rem] border border-white/10"
              >
                <div
                  className="h-[30rem] bg-cover bg-center transition duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(4,8,14,0.10) 0%, rgba(4,8,14,0.68) 60%, rgba(4,8,14,0.96) 100%), url('${sectorImages[index]}')`,
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <h3 className="text-2xl font-semibold text-white">{sector.title}</h3>
                  <p className="mt-3 max-w-sm text-sm leading-7 text-slate-300">{sector.text}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="strength" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-120px" }} variants={fadeUp} transition={{ duration: 0.6 }}>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">{t.strengthLabel}</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">{t.strengthTitle}</h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">{t.strengthText}</p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-120px" }}
              variants={fadeUp}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="grid gap-4 sm:grid-cols-2"
            >
              {t.metrics.map(([value, label]) => (
                <div key={label} className="rounded-[1.8rem] border border-white/10 bg-white/5 p-7">
                  <div className="text-4xl font-semibold text-white">{value}</div>
                  <div className="mt-3 text-sm leading-6 text-slate-300">{label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="projects" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-120px" }} variants={fadeUp} transition={{ duration: 0.6 }}>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-300">{t.projectsLabel}</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">{t.projectsTitle}</h2>
          </motion.div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {t.projects.map((project, index) => (
              <motion.article
                key={project.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-120px" }}
                variants={fadeUp}
                transition={{ duration: 0.55, delay: index * 0.07 }}
                className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(14,20,28,0.94),rgba(7,9,13,0.98))] p-7"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">{project.type}</p>
                <h3 className="mt-4 text-2xl font-semibold text-white">{project.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">{project.text}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[2.4rem] border border-white/10 bg-[linear-gradient(135deg,rgba(7,14,22,0.96),rgba(5,7,10,0.98))] p-8 md:p-12"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.16),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(251,146,60,0.14),transparent_22%)]" />
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">{t.ctaLabel}</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">{t.ctaTitle}</h2>
                <p className="mt-5 text-base leading-8 text-slate-300">{t.ctaText}</p>
              </div>

              <div className="flex flex-wrap gap-4">
                <a
                  href="mailto:juan.alvarez@siezasa.com"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:translate-y-[-1px]"
                >
                  {t.contactUs}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-black/30">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">SIEZA</p>
            <h3 className="mt-4 text-3xl font-semibold tracking-tight text-white">{t.footerTitle}</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-semibold text-white">{t.footerContact}</p>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <p className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 text-sky-300" />
                  juan.alvarez@siezasa.com
                </p>
                <p className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 text-sky-300" />
                  +52 735 108 0882
                </p>
                <p className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-sky-300" />
                  Los Pinos 8-A, Col. Francisco I. Madero, Cuautla, Mexico, 62744
                </p>
                <p className="flex items-start gap-3">
                  <ArrowRight className="mt-0.5 h-4 w-4 text-sky-300" />
                  <a
                    href="https://www.facebook.com/p/Siezasa-100063526303993/"
                    target="_blank"
                    rel="noreferrer"
                    className="transition hover:text-white"
                  >
                    Facebook
                  </a>
                </p>
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-semibold text-white">{t.footerFocus}</p>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                {t.footerFocusItems.map((item, index) => {
                  const Icon = footerIcons[index];
                  return (
                    <p key={item} className="flex items-start gap-3">
                      <Icon className="mt-0.5 h-4 w-4 text-orange-300" />
                      {item}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
