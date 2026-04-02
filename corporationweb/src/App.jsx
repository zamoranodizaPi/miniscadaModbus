import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Bolt,
  BriefcaseBusiness,
  Building2,
  Cable,
  ChevronRight,
  Factory,
  Gauge,
  GraduationCap,
  Mail,
  MapPin,
  Moon,
  Phone,
  ShieldCheck,
  Sparkles,
  Sun,
  Wrench,
} from "lucide-react";
import { useMemo, useState } from "react";

const themePalettes = {
  orange: {
    name: "Orange",
    dark: {
      bg: "from-[#0f1115] via-[#18120f] to-[#090b0f]",
      panel: "bg-white/6",
      line: "border-white/10",
      accent: "from-orange-400 to-amber-300",
      accentSolid: "bg-orange-400",
      accentText: "text-orange-300",
      glow: "shadow-[0_0_120px_rgba(251,146,60,0.16)]",
      meshA: "bg-orange-500/18",
      meshB: "bg-amber-300/10",
      text: "text-white",
      subtext: "text-slate-300",
      muted: "text-slate-400",
      navBg: "bg-black/30",
      grid: "opacity-[0.08]",
    },
    light: {
      bg: "from-[#fff5eb] via-[#fff9f2] to-[#fffefb]",
      panel: "bg-white/80",
      line: "border-slate-900/8",
      accent: "from-orange-500 to-amber-400",
      accentSolid: "bg-orange-500",
      accentText: "text-orange-600",
      glow: "shadow-[0_0_120px_rgba(249,115,22,0.08)]",
      meshA: "bg-orange-500/10",
      meshB: "bg-amber-300/12",
      text: "text-slate-950",
      subtext: "text-slate-700",
      muted: "text-slate-500",
      navBg: "bg-white/70",
      grid: "opacity-[0.05]",
    },
  },
  blue: {
    name: "Blue",
    dark: {
      bg: "from-[#08111c] via-[#0c1624] to-[#05080f]",
      panel: "bg-white/6",
      line: "border-white/10",
      accent: "from-sky-400 to-cyan-300",
      accentSolid: "bg-sky-400",
      accentText: "text-sky-300",
      glow: "shadow-[0_0_120px_rgba(56,189,248,0.16)]",
      meshA: "bg-sky-500/18",
      meshB: "bg-cyan-300/10",
      text: "text-white",
      subtext: "text-slate-300",
      muted: "text-slate-400",
      navBg: "bg-black/30",
      grid: "opacity-[0.08]",
    },
    light: {
      bg: "from-[#edf6ff] via-[#f6fbff] to-[#ffffff]",
      panel: "bg-white/82",
      line: "border-slate-900/8",
      accent: "from-sky-500 to-cyan-400",
      accentSolid: "bg-sky-500",
      accentText: "text-sky-600",
      glow: "shadow-[0_0_120px_rgba(14,165,233,0.08)]",
      meshA: "bg-sky-500/10",
      meshB: "bg-cyan-300/12",
      text: "text-slate-950",
      subtext: "text-slate-700",
      muted: "text-slate-500",
      navBg: "bg-white/70",
      grid: "opacity-[0.05]",
    },
  },
  green: {
    name: "Green",
    dark: {
      bg: "from-[#08120e] via-[#0a1813] to-[#05070a]",
      panel: "bg-white/6",
      line: "border-white/10",
      accent: "from-emerald-400 to-lime-300",
      accentSolid: "bg-emerald-400",
      accentText: "text-emerald-300",
      glow: "shadow-[0_0_120px_rgba(52,211,153,0.18)]",
      meshA: "bg-emerald-500/18",
      meshB: "bg-lime-300/10",
      text: "text-white",
      subtext: "text-slate-300",
      muted: "text-slate-400",
      navBg: "bg-black/30",
      grid: "opacity-[0.08]",
    },
    light: {
      bg: "from-[#eefcf5] via-[#f6fff9] to-[#ffffff]",
      panel: "bg-white/82",
      line: "border-slate-900/8",
      accent: "from-emerald-500 to-lime-400",
      accentSolid: "bg-emerald-500",
      accentText: "text-emerald-600",
      glow: "shadow-[0_0_120px_rgba(16,185,129,0.08)]",
      meshA: "bg-emerald-500/10",
      meshB: "bg-lime-300/12",
      text: "text-slate-950",
      subtext: "text-slate-700",
      muted: "text-slate-500",
      navBg: "bg-white/70",
      grid: "opacity-[0.05]",
    },
  },
  black: {
    name: "Black",
    dark: {
      bg: "from-[#040404] via-[#0b0b0b] to-[#000000]",
      panel: "bg-white/[0.05]",
      line: "border-white/10",
      accent: "from-fuchsia-400 to-cyan-300",
      accentSolid: "bg-fuchsia-400",
      accentText: "text-fuchsia-300",
      glow: "shadow-[0_0_140px_rgba(217,70,239,0.16)]",
      meshA: "bg-fuchsia-500/16",
      meshB: "bg-cyan-300/10",
      text: "text-white",
      subtext: "text-slate-300",
      muted: "text-slate-400",
      navBg: "bg-black/30",
      grid: "opacity-[0.08]",
    },
    light: {
      bg: "from-[#f1f3f5] via-[#fafafa] to-[#ffffff]",
      panel: "bg-white/84",
      line: "border-slate-900/8",
      accent: "from-fuchsia-500 to-cyan-400",
      accentSolid: "bg-fuchsia-500",
      accentText: "text-fuchsia-600",
      glow: "shadow-[0_0_120px_rgba(192,38,211,0.08)]",
      meshA: "bg-fuchsia-500/10",
      meshB: "bg-cyan-300/12",
      text: "text-slate-950",
      subtext: "text-slate-700",
      muted: "text-slate-500",
      navBg: "bg-white/70",
      grid: "opacity-[0.05]",
    },
  },
  gray: {
    name: "Gray",
    dark: {
      bg: "from-[#121417] via-[#1a1d22] to-[#0a0b0d]",
      panel: "bg-white/6",
      line: "border-white/10",
      accent: "from-slate-300 to-zinc-100",
      accentSolid: "bg-slate-300",
      accentText: "text-slate-200",
      glow: "shadow-[0_0_120px_rgba(226,232,240,0.12)]",
      meshA: "bg-slate-300/12",
      meshB: "bg-white/8",
      text: "text-white",
      subtext: "text-slate-300",
      muted: "text-slate-400",
      navBg: "bg-black/30",
      grid: "opacity-[0.08]",
    },
    light: {
      bg: "from-[#f3f4f6] via-[#fbfbfb] to-[#ffffff]",
      panel: "bg-white/84",
      line: "border-slate-900/8",
      accent: "from-slate-500 to-zinc-400",
      accentSolid: "bg-slate-500",
      accentText: "text-slate-700",
      glow: "shadow-[0_0_120px_rgba(71,85,105,0.08)]",
      meshA: "bg-slate-400/10",
      meshB: "bg-slate-300/12",
      text: "text-slate-950",
      subtext: "text-slate-700",
      muted: "text-slate-500",
      navBg: "bg-white/70",
      grid: "opacity-[0.05]",
    },
  },
};

const content = {
  en: {
    brandLong: "Sistemas Eléctricos Zaragoza",
    nav: [["About", "#about"], ["Services", "#services"], ["Industries", "#industries"], ["Projects", "#projects"], ["Contact", "#contact"]],
    contactUs: "Contact us",
    requestQuote: "Request a quote",
    badge: "Industrial Electrical Engineering",
    heroTitle: "Engineering confidence for critical electrical and energy systems.",
    heroCopy:
      "SIEZA delivers reliable electrical engineering, industrial services, automation, and power-sector execution with a disciplined, high-performance approach for demanding clients.",
    heroPoints: [
      ["Industrial Focus", "Power, automation, and engineering execution."],
      ["Field Experience", "Technical delivery shaped by real operating conditions."],
      ["Mexican Company", "100% Mexican engineering company serving industry."],
    ],
    heroCardTitle: "Reliable engineering for industrial continuity",
    heroCardItems: [
      "Power system engineering and technical studies",
      "Testing, commissioning, and field verification",
      "Automation, monitoring, and panel integration",
      "Industrial support focused on uptime and safety",
    ],
    heroStatA: ["Execution", "End-to-end", "From engineering to manufacturing, startup, and service support."],
    heroStatB: ["Safety", "Compliance", "Technical discipline aligned with industrial safety expectations."],
    aboutEyebrow: "About SIEZA",
    aboutTitle: "A modern engineering partner for electrical infrastructure, industry, and energy.",
    aboutCopy:
      "SIEZA is a 100% Mexican company specialized in electrical engineering, industrial services, automation, testing, and technical execution. We work with industrial clients that value reliability, technical depth, and disciplined delivery.",
    aboutBody:
      "We combine engineering precision, industrial understanding, and field experience to deliver solutions that support continuity, safety, and performance. Our focus is not only what we build, but the operational value it creates.",
    aboutCards: [
      ["100% Mexican Company", "Engineering and industrial execution developed with local capability and ownership."],
      ["Industrial Reliability", "Solutions designed to support critical assets, uptime, and maintainability."],
      ["Technical Expertise", "Electrical systems, automation, testing, and integrated project delivery."],
    ],
    servicesEyebrow: "Services",
    servicesTitle: "Engineering and industrial services built around business value.",
    servicesCopy: "Every service is structured to improve reliability, control risk, and support critical operations.",
    valueDelivered: "Value Delivered",
    industriesEyebrow: "Industries",
    industriesTitle: "Sector-focused engineering for demanding industrial environments.",
    industriesCopy: "Our experience is aligned with sectors where reliability, safety, and technical confidence are not optional.",
    whyEyebrow: "Why Choose Us",
    whyTitle: "A corporate engineering partner built for industrial trust.",
    whyCopy: "SIEZA is structured to give industrial clients confidence across engineering, execution, and service continuity.",
    whyChooseUs: [
      "Reliability in industrial execution and long-term service support.",
      "Engineering expertise grounded in field reality and safety discipline.",
      "End-to-end solutions from design to commissioning and maintenance.",
      "Compliance-driven work culture aligned with operational safety.",
    ],
    projectsEyebrow: "Projects & Experience",
    projectsTitle: "Industrial project profiles that reflect our execution model.",
    projectsCopy:
      "Representative project types that demonstrate how we support electrical infrastructure, automation, and industrial continuity.",
    ctaEyebrow: "Let’s Build with Confidence",
    ctaTitle: "Ready to strengthen your electrical infrastructure and industrial operations?",
    ctaCopy: "Partner with a technical team focused on engineering quality, industrial reliability, and disciplined execution.",
    footerTitle: "Energy, electrical, and industrial engineering with corporate discipline.",
    footerCopy:
      "Sistemas Eléctricos Zaragoza S.A. de C.V. delivers technical confidence for energy, automation, testing, field execution, and industrial electrical systems.",
    footerContact: "Contact",
    footerReach: "Industrial Reach",
    location: "Monterrey, Nuevo León, Mexico",
  },
  es: {
    brandLong: "Sistemas Eléctricos Zaragoza",
    nav: [["Nosotros", "#about"], ["Servicios", "#services"], ["Industrias", "#industries"], ["Proyectos", "#projects"], ["Contacto", "#contact"]],
    contactUs: "Contáctanos",
    requestQuote: "Solicitar cotización",
    badge: "Ingeniería eléctrica industrial",
    heroTitle: "Confianza de ingeniería para sistemas eléctricos y energéticos críticos.",
    heroCopy:
      "SIEZA ofrece ingeniería eléctrica, servicios industriales, automatización y ejecución para el sector energético con un enfoque disciplinado, moderno y confiable para clientes industriales exigentes.",
    heroPoints: [
      ["Enfoque industrial", "Potencia, automatización y ejecución de ingeniería."],
      ["Experiencia en campo", "Entrega técnica basada en condiciones reales de operación."],
      ["Empresa mexicana", "Compañía 100% mexicana orientada a la industria."],
    ],
    heroCardTitle: "Ingeniería confiable para la continuidad industrial",
    heroCardItems: [
      "Ingeniería de sistemas eléctricos y estudios técnicos",
      "Pruebas, puesta en marcha y verificación en campo",
      "Automatización, monitoreo e integración de tableros",
      "Soporte industrial enfocado en disponibilidad y seguridad",
    ],
    heroStatA: ["Ejecución", "De punta a punta", "Desde ingeniería hasta fabricación, arranque y soporte en servicio."],
    heroStatB: ["Seguridad", "Cumplimiento", "Disciplina técnica alineada con las exigencias de seguridad industrial."],
    aboutEyebrow: "Sobre SIEZA",
    aboutTitle: "Un socio moderno de ingeniería para infraestructura eléctrica, industria y energía.",
    aboutCopy:
      "SIEZA es una empresa 100% mexicana especializada en ingeniería eléctrica, servicios industriales, automatización, pruebas y ejecución técnica. Trabajamos con clientes industriales que valoran confiabilidad, profundidad técnica y entrega disciplinada.",
    aboutBody:
      "Combinamos precisión de ingeniería, entendimiento industrial y experiencia en campo para entregar soluciones que soportan continuidad, seguridad y desempeño. Nuestro enfoque no es solo lo que construimos, sino el valor operativo que genera.",
    aboutCards: [
      ["Empresa 100% mexicana", "Ingeniería y ejecución industrial desarrolladas con capacidad local y propiedad técnica."],
      ["Confiabilidad industrial", "Soluciones diseñadas para activos críticos, disponibilidad y mantenibilidad."],
      ["Experiencia técnica", "Sistemas eléctricos, automatización, pruebas y entrega integral de proyectos."],
    ],
    servicesEyebrow: "Servicios",
    servicesTitle: "Ingeniería y servicios industriales construidos alrededor del valor de negocio.",
    servicesCopy: "Cada servicio está estructurado para mejorar confiabilidad, controlar riesgos y soportar operaciones críticas.",
    valueDelivered: "Valor entregado",
    industriesEyebrow: "Industrias",
    industriesTitle: "Ingeniería enfocada en sectores para entornos industriales exigentes.",
    industriesCopy: "Nuestra experiencia está alineada con sectores donde la confiabilidad, la seguridad y la confianza técnica no son opcionales.",
    whyEyebrow: "Por qué elegirnos",
    whyTitle: "Un socio corporativo de ingeniería construido para generar confianza industrial.",
    whyCopy: "SIEZA está estructurada para dar confianza a clientes industriales en ingeniería, ejecución y continuidad operativa.",
    whyChooseUs: [
      "Confiabilidad en la ejecución industrial y soporte de servicio de largo plazo.",
      "Experiencia de ingeniería basada en realidad de campo y disciplina de seguridad.",
      "Soluciones integrales desde diseño hasta puesta en marcha y mantenimiento.",
      "Cultura de trabajo orientada al cumplimiento y la seguridad operacional.",
    ],
    projectsEyebrow: "Proyectos y experiencia",
    projectsTitle: "Perfiles de proyectos industriales que reflejan nuestro modelo de ejecución.",
    projectsCopy: "Tipos de proyecto representativos que muestran cómo apoyamos infraestructura eléctrica, automatización y continuidad industrial.",
    ctaEyebrow: "Construyamos con confianza",
    ctaTitle: "¿Listo para fortalecer tu infraestructura eléctrica y tus operaciones industriales?",
    ctaCopy: "Trabaja con un equipo técnico enfocado en calidad de ingeniería, confiabilidad industrial y ejecución disciplinada.",
    footerTitle: "Ingeniería energética, eléctrica e industrial con disciplina corporativa.",
    footerCopy:
      "Sistemas Eléctricos Zaragoza S.A. de C.V. entrega confianza técnica para energía, automatización, pruebas, ejecución en campo y sistemas eléctricos industriales.",
    footerContact: "Contacto",
    footerReach: "Alcance industrial",
    location: "Monterrey, Nuevo León, México",
  },
};

const services = {
  en: [
    {
      title: "Electrical Engineering",
      icon: Bolt,
      description: "Conceptual, basic, and detailed engineering for industrial electrical systems and power infrastructure.",
      value: "Reduces project risk with disciplined design, technical rigor, and constructible documentation.",
    },
    {
      title: "Field Services",
      icon: Wrench,
      description: "On-site commissioning, troubleshooting, maintenance support, and operational assistance.",
      value: "Improves continuity and response time in critical plant environments.",
    },
    {
      title: "Electrical Testing",
      icon: Gauge,
      description: "Testing, diagnostics, and verification of electrical assets and protection schemes.",
      value: "Delivers reliable evidence for safe energization and long-term asset performance.",
    },
    {
      title: "Panel Manufacturing",
      icon: Cable,
      description: "Custom low-voltage panels, control cabinets, and integration-ready assemblies.",
      value: "Ensures quality, traceability, and fit-for-purpose execution from workshop to field.",
    },
    {
      title: "Automation & Monitoring",
      icon: Sparkles,
      description: "Automation, SCADA, monitoring, instrumentation, and industrial visibility solutions.",
      value: "Transforms operational data into control, efficiency, and decision-making capability.",
    },
    {
      title: "Training",
      icon: GraduationCap,
      description: "Technical training for operations, maintenance teams, and electrical personnel.",
      value: "Strengthens internal capability and reduces dependence on emergency intervention.",
    },
  ],
  es: [
    {
      title: "Ingeniería eléctrica",
      icon: Bolt,
      description: "Ingeniería conceptual, básica y de detalle para sistemas eléctricos industriales e infraestructura de potencia.",
      value: "Reduce el riesgo del proyecto con diseño disciplinado, rigor técnico y documentación construible.",
    },
    {
      title: "Servicios en campo",
      icon: Wrench,
      description: "Puesta en marcha, solución de fallas, soporte de mantenimiento y asistencia operativa en sitio.",
      value: "Mejora continuidad y capacidad de respuesta en ambientes críticos de planta.",
    },
    {
      title: "Pruebas eléctricas",
      icon: Gauge,
      description: "Pruebas, diagnóstico y verificación de activos eléctricos y esquemas de protección.",
      value: "Entrega evidencia confiable para energización segura y desempeño de largo plazo.",
    },
    {
      title: "Fabricación de tableros",
      icon: Cable,
      description: "Tableros de baja tensión, gabinetes de control y ensambles listos para integración.",
      value: "Asegura calidad, trazabilidad y ejecución adecuada desde taller hasta campo.",
    },
    {
      title: "Automatización y monitoreo",
      icon: Sparkles,
      description: "Automatización, SCADA, monitoreo, instrumentación y visibilidad industrial.",
      value: "Convierte datos operativos en control, eficiencia y capacidad de decisión.",
    },
    {
      title: "Capacitación",
      icon: GraduationCap,
      description: "Capacitación técnica para operación, mantenimiento y personal eléctrico.",
      value: "Fortalece la capacidad interna y reduce dependencia de intervención de emergencia.",
    },
  ],
};

const industries = {
  en: [
    { title: "Energy", text: "Generation, substations, medium-voltage systems, and power quality environments.", icon: Bolt },
    { title: "Industrial Plants", text: "Critical electrical infrastructure for continuous industrial operation.", icon: Factory },
    { title: "Infrastructure", text: "Reliable electrical backbone for large-scale institutional and public assets.", icon: Building2 },
    { title: "Manufacturing", text: "Automation, distribution, and monitoring for production-intensive facilities.", icon: BriefcaseBusiness },
  ],
  es: [
    { title: "Energía", text: "Generación, subestaciones, sistemas de media tensión y entornos de calidad de energía.", icon: Bolt },
    { title: "Plantas industriales", text: "Infraestructura eléctrica crítica para operación industrial continua.", icon: Factory },
    { title: "Infraestructura", text: "Columna vertebral eléctrica confiable para activos institucionales y públicos a gran escala.", icon: Building2 },
    { title: "Manufactura", text: "Automatización, distribución y monitoreo para instalaciones intensivas en producción.", icon: BriefcaseBusiness },
  ],
};

const projects = {
  en: [
    { title: "Substation Modernization", category: "Power Infrastructure", description: "Protection, testing, and commissioning package for an industrial incoming power node." },
    { title: "Motor Control & Automation Upgrade", category: "Industrial Automation", description: "Electrical control redesign and remote monitoring for process-critical equipment." },
    { title: "Panel Fabrication Program", category: "Manufacturing", description: "Engineered panel assemblies for plant expansion and energy distribution reliability." },
  ],
  es: [
    { title: "Modernización de subestación", category: "Infraestructura eléctrica", description: "Paquete de protección, pruebas y puesta en marcha para un nodo industrial de alimentación principal." },
    { title: "Actualización de control y automatización", category: "Automatización industrial", description: "Rediseño de control eléctrico y monitoreo remoto para equipos críticos de proceso." },
    { title: "Programa de fabricación de tableros", category: "Manufactura", description: "Ensambles de tableros diseñados para ampliación de planta y confiabilidad en distribución de energía." },
  ],
};

const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } };

function SectionHeading({ eyebrow, title, copy, accentText, textClass, subtextClass }) {
  return (
    <div className="max-w-3xl">
      <p className={`mb-3 text-xs font-semibold uppercase tracking-[0.28em] ${accentText}`}>{eyebrow}</p>
      <h2 className={`text-3xl font-semibold tracking-tight md:text-4xl ${textClass}`}>{title}</h2>
      {copy ? <p className={`mt-4 text-base leading-7 md:text-lg ${subtextClass}`}>{copy}</p> : null}
    </div>
  );
}

export default function App() {
  const [themeKey, setThemeKey] = useState("green");
  const [mode, setMode] = useState("dark");
  const [language, setLanguage] = useState("en");
  const palette = themePalettes[themeKey][mode];
  const t = content[language];
  const logoSrc = mode === "dark" ? "/branding/logo_dark.png" : "/branding/logo_light.png";

  const nav = useMemo(() => t.nav, [t]);

  return (
    <div className={`min-h-screen overflow-x-hidden bg-gradient-to-br ${palette.bg} ${palette.text}`}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className={`absolute -left-24 top-0 h-80 w-80 rounded-full blur-3xl ${palette.meshA}`} />
        <div className={`absolute right-0 top-40 h-72 w-72 rounded-full blur-3xl ${palette.meshB}`} />
        <div className={`absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] ${palette.grid}`} />
      </div>

      <header className={`sticky top-0 z-50 border-b ${palette.line} ${palette.navBg} backdrop-blur-xl`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
          <div className="flex items-center gap-4">
            <img src={logoSrc} alt="SIEZA" className="h-11 w-auto object-contain" onError={(e) => { e.currentTarget.style.display = "none"; }} />
            <div>
              <p className={`text-xs font-medium uppercase tracking-[0.28em] ${palette.muted}`}>{t.brandLong}</p>
              <h1 className={`text-lg font-semibold tracking-[0.18em] ${palette.text}`}>SIEZA</h1>
            </div>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            {nav.map(([label, href]) => (
              <a key={label} href={href} className={`text-sm transition hover:opacity-100 ${palette.subtext} opacity-90`}>
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div className={`hidden items-center gap-1 rounded-full border ${palette.line} ${palette.panel} p-1 sm:flex`}>
              <button type="button" onClick={() => setLanguage("en")} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${language === "en" ? "bg-white/15 text-white" : palette.subtext}`}>EN</button>
              <button type="button" onClick={() => setLanguage("es")} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${language === "es" ? "bg-white/15 text-white" : palette.subtext}`}>ES</button>
            </div>
            <button type="button" onClick={() => setMode(mode === "dark" ? "light" : "dark")} className={`inline-flex h-10 w-10 items-center justify-center rounded-full border ${palette.line} ${palette.panel}`}>
              {mode === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <div className={`hidden items-center gap-2 rounded-full border ${palette.line} ${palette.panel} p-1 sm:flex`}>
              {Object.entries(themePalettes).map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  aria-label={item.name}
                  onClick={() => setThemeKey(key)}
                  className={`h-7 w-7 rounded-full transition ${key === themeKey ? "scale-110 ring-2 ring-white/30" : "opacity-75 hover:opacity-100"} ${
                    key === "orange" ? "bg-orange-400" : key === "blue" ? "bg-sky-400" : key === "green" ? "bg-emerald-400" : key === "black" ? "bg-fuchsia-400" : "bg-slate-400"
                  }`}
                />
              ))}
            </div>
            <a href="#contact" className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:translate-y-[-1px] ${palette.accent}`}>
              {t.contactUs}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="relative">
          <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
              <div className={`inline-flex items-center gap-2 rounded-full border ${palette.line} ${palette.panel} px-4 py-2 text-xs uppercase tracking-[0.26em] ${palette.subtext}`}>
                <ShieldCheck className={`h-4 w-4 ${palette.accentText}`} />
                {t.badge}
              </div>
              <h2 className={`mt-7 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-tight md:text-6xl xl:text-7xl ${palette.text}`}>{t.heroTitle}</h2>
              <p className={`mt-6 max-w-2xl text-lg leading-8 md:text-xl ${palette.subtext}`}>{t.heroCopy}</p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a href="#contact" className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-6 py-3 text-sm font-semibold text-slate-950 transition hover:translate-y-[-1px] ${palette.accent}`}>{t.contactUs}<ArrowRight className="h-4 w-4" /></a>
                <a href="#contact" className={`inline-flex items-center gap-2 rounded-full border ${palette.line} ${palette.panel} px-6 py-3 text-sm font-semibold transition hover:bg-white/10`}>{t.requestQuote}<ChevronRight className="h-4 w-4" /></a>
              </div>
              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                {t.heroPoints.map(([title, text]) => (
                  <div key={title} className={`rounded-3xl border ${palette.line} ${palette.panel} p-5`}>
                    <p className={`text-sm font-semibold ${palette.text}`}>{title}</p>
                    <p className={`mt-2 text-sm leading-6 ${palette.subtext}`}>{text}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }} className="relative">
              <div className={`absolute inset-0 rounded-[2rem] bg-gradient-to-br ${palette.accent} opacity-10 blur-2xl`} />
              <div className={`relative overflow-hidden rounded-[2rem] border ${palette.line} ${palette.panel} p-7 ${palette.glow}`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_28%)]" />
                <div className="relative">
                  <div className={`flex items-center justify-between border-b ${palette.line} pb-5`}>
                    <div>
                      <p className={`text-xs uppercase tracking-[0.24em] ${palette.muted}`}>Operational Value</p>
                      <p className={`mt-2 text-2xl font-semibold ${palette.text}`}>{t.heroCardTitle}</p>
                    </div>
                    <div className={`rounded-2xl p-3 ${palette.panel} border ${palette.line}`}>
                      <Bolt className={`h-7 w-7 ${palette.accentText}`} />
                    </div>
                  </div>
                  <div className="mt-6 grid gap-4">
                    {t.heroCardItems.map((item) => (
                      <div key={item} className={`flex items-start gap-3 rounded-2xl border ${palette.line} bg-black/15 p-4`}>
                        <BadgeCheck className={`mt-0.5 h-5 w-5 flex-none ${palette.accentText}`} />
                        <p className={`text-sm leading-6 ${palette.subtext}`}>{item}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    {[t.heroStatA, t.heroStatB].map(([eyebrow, stat, copy]) => (
                      <div key={eyebrow} className={`rounded-3xl border ${palette.line} bg-white/5 p-5`}>
                        <p className={`text-xs uppercase tracking-[0.24em] ${palette.muted}`}>{eyebrow}</p>
                        <p className={`mt-2 text-3xl font-semibold ${palette.text}`}>{stat}</p>
                        <p className={`mt-2 text-sm leading-6 ${palette.subtext}`}>{copy}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-120px" }} variants={fadeUp} transition={{ duration: 0.6 }}>
            <SectionHeading eyebrow={t.aboutEyebrow} title={t.aboutTitle} copy={t.aboutCopy} accentText={palette.accentText} textClass={palette.text} subtextClass={palette.subtext} />
          </motion.div>
          <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-120px" }} variants={fadeUp} transition={{ duration: 0.7, delay: 0.1 }} className={`rounded-[2rem] border ${palette.line} ${palette.panel} p-8`}>
              <p className={`text-lg leading-8 ${palette.subtext}`}>{t.aboutBody}</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-120px" }} variants={fadeUp} transition={{ duration: 0.7, delay: 0.15 }} className="grid gap-4">
              {t.aboutCards.map(([title, copy]) => (
                <div key={title} className={`rounded-3xl border ${palette.line} ${palette.panel} p-6`}>
                  <p className={`text-lg font-semibold ${palette.text}`}>{title}</p>
                  <p className={`mt-2 text-sm leading-6 ${palette.subtext}`}>{copy}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="services" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-120px" }} variants={fadeUp} transition={{ duration: 0.6 }}>
            <SectionHeading eyebrow={t.servicesEyebrow} title={t.servicesTitle} copy={t.servicesCopy} accentText={palette.accentText} textClass={palette.text} subtextClass={palette.subtext} />
          </motion.div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services[language].map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.article key={service.title} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-120px" }} variants={fadeUp} transition={{ duration: 0.55, delay: index * 0.06 }} className={`group rounded-[2rem] border ${palette.line} ${palette.panel} p-7 transition hover:-translate-y-1 hover:border-white/20`}>
                  <div className={`inline-flex rounded-2xl border ${palette.line} bg-white/5 p-3`}><Icon className={`h-6 w-6 ${palette.accentText}`} /></div>
                  <h3 className={`mt-6 text-2xl font-semibold ${palette.text}`}>{service.title}</h3>
                  <p className={`mt-3 text-sm leading-7 ${palette.subtext}`}>{service.description}</p>
                  <div className={`mt-6 border-t ${palette.line} pt-5`}>
                    <p className={`text-xs uppercase tracking-[0.24em] ${palette.muted}`}>{t.valueDelivered}</p>
                    <p className={`mt-3 text-sm leading-7 ${palette.subtext}`}>{service.value}</p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section id="industries" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-120px" }} variants={fadeUp} transition={{ duration: 0.6 }}>
            <SectionHeading eyebrow={t.industriesEyebrow} title={t.industriesTitle} copy={t.industriesCopy} accentText={palette.accentText} textClass={palette.text} subtextClass={palette.subtext} />
          </motion.div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {industries[language].map((industry, index) => {
              const Icon = industry.icon;
              return (
                <motion.div key={industry.title} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-120px" }} variants={fadeUp} transition={{ duration: 0.55, delay: index * 0.06 }} className={`rounded-[2rem] border ${palette.line} ${palette.panel} p-6`}>
                  <Icon className={`h-8 w-8 ${palette.accentText}`} />
                  <h3 className={`mt-5 text-xl font-semibold ${palette.text}`}>{industry.title}</h3>
                  <p className={`mt-3 text-sm leading-7 ${palette.subtext}`}>{industry.text}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-120px" }} variants={fadeUp} transition={{ duration: 0.6 }}>
            <SectionHeading eyebrow={t.whyEyebrow} title={t.whyTitle} copy={t.whyCopy} accentText={palette.accentText} textClass={palette.text} subtextClass={palette.subtext} />
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-120px" }} variants={fadeUp} transition={{ duration: 0.65, delay: 0.1 }} className={`rounded-[2rem] border ${palette.line} ${palette.panel} p-8`}>
            <div className="grid gap-5">
              {t.whyChooseUs.map((point) => (
                <div key={point} className={`flex gap-4 border-b ${palette.line} pb-5 last:border-b-0 last:pb-0`}>
                  <div className={`mt-1 rounded-full p-2 ${palette.accentSolid}`}><BadgeCheck className="h-4 w-4 text-slate-950" /></div>
                  <p className={`text-base leading-7 ${palette.subtext}`}>{point}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <section id="projects" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-120px" }} variants={fadeUp} transition={{ duration: 0.6 }}>
            <SectionHeading eyebrow={t.projectsEyebrow} title={t.projectsTitle} copy={t.projectsCopy} accentText={palette.accentText} textClass={palette.text} subtextClass={palette.subtext} />
          </motion.div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {projects[language].map((project, index) => (
              <motion.article key={project.title} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-120px" }} variants={fadeUp} transition={{ duration: 0.55, delay: index * 0.07 }} className={`group overflow-hidden rounded-[2rem] border ${palette.line} ${palette.panel}`}>
                <div className={`h-48 bg-gradient-to-br ${palette.accent} opacity-80`} />
                <div className="p-7">
                  <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${palette.accentText}`}>{project.category}</p>
                  <h3 className={`mt-3 text-2xl font-semibold ${palette.text}`}>{project.title}</h3>
                  <p className={`mt-3 text-sm leading-7 ${palette.subtext}`}>{project.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-120px" }} variants={fadeUp} transition={{ duration: 0.6 }} className={`relative overflow-hidden rounded-[2.25rem] border ${palette.line} ${palette.panel} p-8 md:p-12`}>
            <div className={`absolute -right-10 top-0 h-52 w-52 rounded-full blur-3xl ${palette.meshA}`} />
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${palette.accentText}`}>{t.ctaEyebrow}</p>
                <h2 className={`mt-4 text-4xl font-semibold tracking-tight md:text-5xl ${palette.text}`}>{t.ctaTitle}</h2>
                <p className={`mt-5 max-w-2xl text-base leading-8 ${palette.subtext}`}>{t.ctaCopy}</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <a href="#contact" className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-6 py-3 text-sm font-semibold text-slate-950 transition hover:translate-y-[-1px] ${palette.accent}`}>{t.contactUs}<ArrowRight className="h-4 w-4" /></a>
                <a href="#contact" className={`inline-flex items-center gap-2 rounded-full border ${palette.line} ${palette.panel} px-6 py-3 text-sm font-semibold transition hover:bg-white/10`}>{t.requestQuote}<ChevronRight className="h-4 w-4" /></a>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <footer id="contact" className={`border-t ${palette.line} ${palette.navBg}`}>
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1fr_0.8fr] lg:px-8">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${palette.accentText}`}>SIEZA</p>
            <h3 className={`mt-4 text-3xl font-semibold tracking-tight ${palette.text}`}>{t.footerTitle}</h3>
            <p className={`mt-4 max-w-2xl text-base leading-7 ${palette.subtext}`}>{t.footerCopy}</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className={`rounded-3xl border ${palette.line} ${palette.panel} p-6`}>
              <p className={`text-sm font-semibold ${palette.text}`}>{t.footerContact}</p>
              <div className={`mt-4 space-y-3 text-sm ${palette.subtext}`}>
                <p className="flex items-start gap-3"><Mail className={`mt-0.5 h-4 w-4 ${palette.accentText}`} /> contacto@sieza.com.mx</p>
                <p className="flex items-start gap-3"><Phone className={`mt-0.5 h-4 w-4 ${palette.accentText}`} /> +52 (81) 0000 0000</p>
                <p className="flex items-start gap-3"><MapPin className={`mt-0.5 h-4 w-4 ${palette.accentText}`} /> {t.location}</p>
              </div>
            </div>
            <div className={`rounded-3xl border ${palette.line} ${palette.panel} p-6`}>
              <p className={`text-sm font-semibold ${palette.text}`}>{t.footerReach}</p>
              <div className={`mt-4 space-y-3 text-sm ${palette.subtext}`}>
                <p className="flex items-start gap-3"><Bolt className={`mt-0.5 h-4 w-4 ${palette.accentText}`} /> Energy and power systems</p>
                <p className="flex items-start gap-3"><Factory className={`mt-0.5 h-4 w-4 ${palette.accentText}`} /> Industrial plants and manufacturing</p>
                <p className="flex items-start gap-3"><Building2 className={`mt-0.5 h-4 w-4 ${palette.accentText}`} /> Infrastructure and engineering services</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
