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
  Phone,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { useMemo, useState } from "react";

const themes = {
  orange: {
    name: "Orange",
    bg: "from-[#0f1115] via-[#18120f] to-[#090b0f]",
    panel: "bg-white/6",
    line: "border-white/10",
    accent: "from-orange-400 to-amber-300",
    accentSolid: "bg-orange-400",
    accentText: "text-orange-300",
    glow: "shadow-[0_0_120px_rgba(251,146,60,0.16)]",
    meshA: "bg-orange-500/18",
    meshB: "bg-amber-300/10",
  },
  blue: {
    name: "Blue",
    bg: "from-[#08111c] via-[#0c1624] to-[#05080f]",
    panel: "bg-white/6",
    line: "border-white/10",
    accent: "from-sky-400 to-cyan-300",
    accentSolid: "bg-sky-400",
    accentText: "text-sky-300",
    glow: "shadow-[0_0_120px_rgba(56,189,248,0.16)]",
    meshA: "bg-sky-500/18",
    meshB: "bg-cyan-300/10",
  },
  green: {
    name: "Green",
    bg: "from-[#08120e] via-[#0a1813] to-[#05070a]",
    panel: "bg-white/6",
    line: "border-white/10",
    accent: "from-emerald-400 to-lime-300",
    accentSolid: "bg-emerald-400",
    accentText: "text-emerald-300",
    glow: "shadow-[0_0_120px_rgba(52,211,153,0.18)]",
    meshA: "bg-emerald-500/18",
    meshB: "bg-lime-300/10",
  },
  black: {
    name: "Black",
    bg: "from-[#040404] via-[#0b0b0b] to-[#000000]",
    panel: "bg-white/[0.05]",
    line: "border-white/10",
    accent: "from-fuchsia-400 to-cyan-300",
    accentSolid: "bg-fuchsia-400",
    accentText: "text-fuchsia-300",
    glow: "shadow-[0_0_140px_rgba(217,70,239,0.16)]",
    meshA: "bg-fuchsia-500/16",
    meshB: "bg-cyan-300/10",
  },
  gray: {
    name: "Gray",
    bg: "from-[#121417] via-[#1a1d22] to-[#0a0b0d]",
    panel: "bg-white/6",
    line: "border-white/10",
    accent: "from-slate-300 to-zinc-100",
    accentSolid: "bg-slate-300",
    accentText: "text-slate-200",
    glow: "shadow-[0_0_120px_rgba(226,232,240,0.12)]",
    meshA: "bg-slate-300/12",
    meshB: "bg-white/8",
  },
};

const services = [
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
];

const industries = [
  { title: "Energy", text: "Generation, substations, medium-voltage systems, and power quality environments.", icon: Bolt },
  { title: "Industrial Plants", text: "Critical electrical infrastructure for continuous industrial operation.", icon: Factory },
  { title: "Infrastructure", text: "Reliable electrical backbone for large-scale institutional and public assets.", icon: Building2 },
  { title: "Manufacturing", text: "Automation, distribution, and monitoring for production-intensive facilities.", icon: BriefcaseBusiness },
];

const projects = [
  {
    title: "Substation Modernization",
    category: "Power Infrastructure",
    description: "Protection, testing, and commissioning package for an industrial incoming power node.",
  },
  {
    title: "Motor Control & Automation Upgrade",
    category: "Industrial Automation",
    description: "Electrical control redesign and remote monitoring for process-critical equipment.",
  },
  {
    title: "Panel Fabrication Program",
    category: "Manufacturing",
    description: "Engineered panel assemblies for plant expansion and energy distribution reliability.",
  },
];

const whyChooseUs = [
  "Reliability in industrial execution and long-term service support.",
  "Engineering expertise grounded in field reality and safety discipline.",
  "End-to-end solutions from design to commissioning and maintenance.",
  "Compliance-driven work culture aligned with operational safety.",
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

function SectionHeading({ eyebrow, title, copy, accentText }) {
  return (
    <div className="max-w-3xl">
      <p className={`mb-3 text-xs font-semibold uppercase tracking-[0.28em] ${accentText}`}>{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">{title}</h2>
      {copy ? <p className="mt-4 text-base leading-7 text-slate-300 md:text-lg">{copy}</p> : null}
    </div>
  );
}

export default function App() {
  const [themeKey, setThemeKey] = useState("green");
  const theme = themes[themeKey];

  const nav = useMemo(
    () => [
      ["About", "#about"],
      ["Services", "#services"],
      ["Industries", "#industries"],
      ["Projects", "#projects"],
      ["Contact", "#contact"],
    ],
    [],
  );

  return (
    <div className={`min-h-screen overflow-x-hidden bg-gradient-to-br ${theme.bg} text-white`}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className={`absolute -left-24 top-0 h-80 w-80 rounded-full blur-3xl ${theme.meshA}`} />
        <div className={`absolute right-0 top-40 h-72 w-72 rounded-full blur-3xl ${theme.meshB}`} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.08]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-slate-400">Sistemas Eléctricos Zaragoza</p>
            <h1 className="text-lg font-semibold tracking-[0.18em] text-white">SIEZA</h1>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            {nav.map(([label, href]) => (
              <a key={label} href={href} className="text-sm text-slate-300 transition hover:text-white">
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 sm:flex">
              {Object.entries(themes).map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  aria-label={item.name}
                  onClick={() => setThemeKey(key)}
                  className={`h-7 w-7 rounded-full transition ${key === themeKey ? "scale-110 ring-2 ring-white/30" : "opacity-75 hover:opacity-100"} ${
                    key === "orange"
                      ? "bg-orange-400"
                      : key === "blue"
                        ? "bg-sky-400"
                        : key === "green"
                          ? "bg-emerald-400"
                          : key === "black"
                            ? "bg-fuchsia-400"
                            : "bg-slate-300"
                  }`}
                />
              ))}
            </div>
            <a
              href="#contact"
              className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:translate-y-[-1px] ${theme.accent}`}
            >
              Contact us
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="relative">
          <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
              <div className={`inline-flex items-center gap-2 rounded-full border border-white/10 ${theme.panel} px-4 py-2 text-xs uppercase tracking-[0.26em] text-slate-300`}>
                <ShieldCheck className={`h-4 w-4 ${theme.accentText}`} />
                Industrial Electrical Engineering
              </div>
              <h2 className="mt-7 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-tight text-white md:text-6xl xl:text-7xl">
                Engineering confidence for critical electrical and energy systems.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
                SIEZA delivers reliable electrical engineering, industrial services, automation, and power-sector execution with a
                disciplined, high-performance approach for demanding clients.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#contact"
                  className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-6 py-3 text-sm font-semibold text-slate-950 transition hover:translate-y-[-1px] ${theme.accent}`}
                >
                  Contact us
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Request a quote
                  <ChevronRight className="h-4 w-4" />
                </a>
              </div>
              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                {[
                  ["Industrial Focus", "Power, automation, and engineering execution."],
                  ["Field Experience", "Technical delivery shaped by real operating conditions."],
                  ["Mexican Company", "100% Mexican engineering company serving industry."],
                ].map(([title, text]) => (
                  <div key={title} className={`rounded-3xl border ${theme.line} ${theme.panel} p-5`}>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="relative"
            >
              <div className={`absolute inset-0 rounded-[2rem] bg-gradient-to-br ${theme.accent} opacity-10 blur-2xl`} />
              <div className={`relative overflow-hidden rounded-[2rem] border ${theme.line} ${theme.panel} p-7 ${theme.glow}`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_28%)]" />
                <div className="relative">
                  <div className="flex items-center justify-between border-b border-white/10 pb-5">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Operational Value</p>
                      <p className="mt-2 text-2xl font-semibold">Reliable engineering for industrial continuity</p>
                    </div>
                    <div className={`rounded-2xl p-3 ${theme.panel} border ${theme.line}`}>
                      <Bolt className={`h-7 w-7 ${theme.accentText}`} />
                    </div>
                  </div>
                  <div className="mt-6 grid gap-4">
                    {[
                      "Power system engineering and technical studies",
                      "Testing, commissioning, and field verification",
                      "Automation, monitoring, and panel integration",
                      "Industrial support focused on uptime and safety",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-black/15 p-4">
                        <BadgeCheck className={`mt-0.5 h-5 w-5 flex-none ${theme.accentText}`} />
                        <p className="text-sm leading-6 text-slate-200">{item}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Execution</p>
                      <p className="mt-2 text-3xl font-semibold">End-to-end</p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">From engineering to manufacturing, startup, and service support.</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Safety</p>
                      <p className="mt-2 text-3xl font-semibold">Compliance</p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">Technical discipline aligned with industrial safety expectations.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-120px" }} variants={fadeUp} transition={{ duration: 0.6 }}>
            <SectionHeading
              eyebrow="About SIEZA"
              title="A modern engineering partner for electrical infrastructure, industry, and energy."
              copy="SIEZA is a 100% Mexican company specialized in electrical engineering, industrial services, automation, testing, and technical execution. We work with industrial clients that value reliability, technical depth, and disciplined delivery."
              accentText={theme.accentText}
            />
          </motion.div>
          <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-120px" }}
              variants={fadeUp}
              transition={{ duration: 0.7, delay: 0.1 }}
              className={`rounded-[2rem] border ${theme.line} ${theme.panel} p-8`}
            >
              <p className="text-lg leading-8 text-slate-300">
                We combine engineering precision, industrial understanding, and field experience to deliver solutions that support continuity,
                safety, and performance. Our focus is not only what we build, but the operational value it creates.
              </p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-120px" }}
              variants={fadeUp}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="grid gap-4"
            >
              {[
                ["100% Mexican Company", "Engineering and industrial execution developed with local capability and ownership."],
                ["Industrial Reliability", "Solutions designed to support critical assets, uptime, and maintainability."],
                ["Technical Expertise", "Electrical systems, automation, testing, and integrated project delivery."],
              ].map(([title, copy]) => (
                <div key={title} className={`rounded-3xl border ${theme.line} ${theme.panel} p-6`}>
                  <p className="text-lg font-semibold text-white">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{copy}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="services" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-120px" }} variants={fadeUp} transition={{ duration: 0.6 }}>
            <SectionHeading
              eyebrow="Services"
              title="Engineering and industrial services built around business value."
              copy="Every service is structured to improve reliability, control risk, and support critical operations."
              accentText={theme.accentText}
            />
          </motion.div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.article
                  key={service.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-120px" }}
                  variants={fadeUp}
                  transition={{ duration: 0.55, delay: index * 0.06 }}
                  className={`group rounded-[2rem] border ${theme.line} ${theme.panel} p-7 transition hover:-translate-y-1 hover:border-white/20`}
                >
                  <div className={`inline-flex rounded-2xl border ${theme.line} bg-white/5 p-3`}>
                    <Icon className={`h-6 w-6 ${theme.accentText}`} />
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold text-white">{service.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{service.description}</p>
                  <div className="mt-6 border-t border-white/10 pt-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Value Delivered</p>
                    <p className="mt-3 text-sm leading-7 text-slate-200">{service.value}</p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section id="industries" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-120px" }} variants={fadeUp} transition={{ duration: 0.6 }}>
            <SectionHeading
              eyebrow="Industries"
              title="Sector-focused engineering for demanding industrial environments."
              copy="Our experience is aligned with sectors where reliability, safety, and technical confidence are not optional."
              accentText={theme.accentText}
            />
          </motion.div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {industries.map((industry, index) => {
              const Icon = industry.icon;
              return (
                <motion.div
                  key={industry.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-120px" }}
                  variants={fadeUp}
                  transition={{ duration: 0.55, delay: index * 0.06 }}
                  className={`rounded-[2rem] border ${theme.line} ${theme.panel} p-6`}
                >
                  <Icon className={`h-8 w-8 ${theme.accentText}`} />
                  <h3 className="mt-5 text-xl font-semibold text-white">{industry.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{industry.text}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-120px" }} variants={fadeUp} transition={{ duration: 0.6 }}>
            <SectionHeading
              eyebrow="Why Choose Us"
              title="A corporate engineering partner built for industrial trust."
              copy="SIEZA is structured to give industrial clients confidence across engineering, execution, and service continuity."
              accentText={theme.accentText}
            />
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            variants={fadeUp}
            transition={{ duration: 0.65, delay: 0.1 }}
            className={`rounded-[2rem] border ${theme.line} ${theme.panel} p-8`}
          >
            <div className="grid gap-5">
              {whyChooseUs.map((point) => (
                <div key={point} className="flex gap-4 border-b border-white/8 pb-5 last:border-b-0 last:pb-0">
                  <div className={`mt-1 rounded-full p-2 ${theme.accentSolid}`}>
                    <BadgeCheck className="h-4 w-4 text-slate-950" />
                  </div>
                  <p className="text-base leading-7 text-slate-200">{point}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <section id="projects" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-120px" }} variants={fadeUp} transition={{ duration: 0.6 }}>
            <SectionHeading
              eyebrow="Projects & Experience"
              title="Industrial project profiles that reflect our execution model."
              copy="Representative project types that demonstrate how we support electrical infrastructure, automation, and industrial continuity."
              accentText={theme.accentText}
            />
          </motion.div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {projects.map((project, index) => (
              <motion.article
                key={project.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-120px" }}
                variants={fadeUp}
                transition={{ duration: 0.55, delay: index * 0.07 }}
                className={`group overflow-hidden rounded-[2rem] border ${theme.line} ${theme.panel}`}
              >
                <div className={`h-48 bg-gradient-to-br ${theme.accent} opacity-80`} />
                <div className="p-7">
                  <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${theme.accentText}`}>{project.category}</p>
                  <h3 className="mt-3 text-2xl font-semibold text-white">{project.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{project.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className={`relative overflow-hidden rounded-[2.25rem] border ${theme.line} ${theme.panel} p-8 md:p-12`}
          >
            <div className={`absolute -right-10 top-0 h-52 w-52 rounded-full blur-3xl ${theme.meshA}`} />
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${theme.accentText}`}>Let’s Build with Confidence</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                  Ready to strengthen your electrical infrastructure and industrial operations?
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
                  Partner with a technical team focused on engineering quality, industrial reliability, and disciplined execution.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#contact"
                  className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-6 py-3 text-sm font-semibold text-slate-950 transition hover:translate-y-[-1px] ${theme.accent}`}
                >
                  Contact us
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Request a quote
                  <ChevronRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <footer id="contact" className="border-t border-white/10 bg-black/30">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1fr_0.8fr] lg:px-8">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${theme.accentText}`}>SIEZA</p>
            <h3 className="mt-4 text-3xl font-semibold tracking-tight text-white">Energy, electrical, and industrial engineering with corporate discipline.</h3>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Sistemas Eléctricos Zaragoza S.A. de C.V. delivers technical confidence for energy, automation, testing, field execution, and industrial electrical systems.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className={`rounded-3xl border ${theme.line} ${theme.panel} p-6`}>
              <p className="text-sm font-semibold text-white">Contact</p>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <p className="flex items-start gap-3"><Mail className={`mt-0.5 h-4 w-4 ${theme.accentText}`} /> contacto@sieza.com.mx</p>
                <p className="flex items-start gap-3"><Phone className={`mt-0.5 h-4 w-4 ${theme.accentText}`} /> +52 (81) 0000 0000</p>
                <p className="flex items-start gap-3"><MapPin className={`mt-0.5 h-4 w-4 ${theme.accentText}`} /> Monterrey, Nuevo León, México</p>
              </div>
            </div>
            <div className={`rounded-3xl border ${theme.line} ${theme.panel} p-6`}>
              <p className="text-sm font-semibold text-white">Industrial Reach</p>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <p className="flex items-start gap-3"><Bolt className={`mt-0.5 h-4 w-4 ${theme.accentText}`} /> Energy and power systems</p>
                <p className="flex items-start gap-3"><Factory className={`mt-0.5 h-4 w-4 ${theme.accentText}`} /> Industrial plants and manufacturing</p>
                <p className="flex items-start gap-3"><Building2 className={`mt-0.5 h-4 w-4 ${theme.accentText}`} /> Infrastructure and engineering services</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
