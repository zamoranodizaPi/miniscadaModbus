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

const capabilities = [
  {
    title: "Power Infrastructure Engineering",
    icon: Bolt,
    text: "Detailed engineering for substations, distribution systems, and critical industrial power networks.",
  },
  {
    title: "Electrical Testing & Commissioning",
    icon: Gauge,
    text: "Field validation, energized startup, protection checks, and technical assurance before operation.",
  },
  {
    title: "Industrial Automation & Control",
    icon: Cable,
    text: "PLC, SCADA, monitoring, and electrical integration for high-availability industrial environments.",
  },
  {
    title: "Field Execution & Service",
    icon: Wrench,
    text: "On-site support, diagnostics, troubleshooting, and operational continuity under real plant conditions.",
  },
];

const sectors = [
  {
    title: "Energy & Utilities",
    copy: "Grid-connected infrastructure, substations, and medium-voltage execution.",
    image:
      "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Industrial Plants",
    copy: "Electrical systems for process continuity, safety, and heavy-duty operations.",
    image:
      "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Control & Monitoring",
    copy: "Panels, PLC architecture, supervision, and plant-level visibility.",
    image:
      "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1600&q=80",
  },
];

const projects = [
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
];

const metrics = [
  { value: "24/7", label: "Industrial readiness and technical response" },
  { value: "HV/MV", label: "Power infrastructure and substation focus" },
  { value: "End-to-end", label: "Engineering, execution, testing, and support" },
  { value: "Safety-first", label: "Compliance-driven delivery culture" },
];

export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#04070b] text-white">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(30,144,255,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,128,0,0.14),transparent_26%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.06]" />
      </div>

      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#04070b]/72 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-slate-400">Electrical Engineering</p>
            <div className="mt-1 text-lg font-semibold tracking-[0.24em] text-white">SIEZA</div>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {[
              ["Capabilities", "#capabilities"],
              ["Sectors", "#sectors"],
              ["Strength", "#strength"],
              ["Projects", "#projects"],
              ["Contact", "#contact"],
            ].map(([label, href]) => (
              <a key={label} href={href} className="text-sm text-slate-300 transition hover:text-white">
                {label}
              </a>
            ))}
          </nav>

          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:translate-y-[-1px]"
          >
            Request a Quote
            <ArrowRight className="h-4 w-4" />
          </a>
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
                Heavy Industry & Power Systems
              </div>

              <h1 className="mt-7 max-w-5xl text-5xl font-semibold leading-[0.92] tracking-tight text-white md:text-6xl xl:text-7xl">
                Engineering Power Infrastructure with Precision and Reliability
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
                SIEZA delivers electrical engineering, testing, automation, and industrial execution for high-demand environments where
                uptime, safety, and technical confidence are non-negotiable.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:translate-y-[-1px]"
                >
                  Contact Us
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  View Experience
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
              {[
                ["High Voltage Environments", "Substations, transmission, and power distribution execution."],
                ["Industrial Control", "Panels, PLC systems, and real-time plant visibility."],
                ["Field-Driven Engineering", "Solutions shaped by industrial reality, not generic assumptions."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-[1.8rem] border border-white/10 bg-black/35 p-5 backdrop-blur-md">
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="capabilities" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">Capabilities</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">
              Technical capability built for serious industrial and energy-sector execution.
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {capabilities.map((item, index) => {
              const Icon = item.icon;
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
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-300">Industrial Sectors</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">
              Sectors where power reliability and technical execution directly impact operations.
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {sectors.map((sector, index) => (
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
                    backgroundImage: `linear-gradient(180deg, rgba(4,8,14,0.10) 0%, rgba(4,8,14,0.68) 60%, rgba(4,8,14,0.96) 100%), url('${sector.image}')`,
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <h3 className="text-2xl font-semibold text-white">{sector.title}</h3>
                  <p className="mt-3 max-w-sm text-sm leading-7 text-slate-300">{sector.copy}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="strength" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-120px" }}
              variants={fadeUp}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">Engineering Strength</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">
                Built for trust in high-stakes electrical and industrial environments.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Our value is defined by technical depth, field experience, and disciplined execution in environments where failure is not an option.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-120px" }}
              variants={fadeUp}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="grid gap-4 sm:grid-cols-2"
            >
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-[1.8rem] border border-white/10 bg-white/5 p-7">
                  <div className="text-4xl font-semibold text-white">{metric.value}</div>
                  <div className="mt-3 text-sm leading-6 text-slate-300">{metric.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="projects" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-300">Projects</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">
              Project profiles designed for industrial confidence and power-system resilience.
            </h2>
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
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">Start the Conversation</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                  Talk to an engineering team prepared for industrial power, field execution, and critical infrastructure.
                </h2>
                <p className="mt-5 text-base leading-8 text-slate-300">
                  Contact SIEZA to discuss electrical engineering, testing, automation, field services, and project support for heavy industry and energy systems.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <a
                  href="mailto:contacto@sieza.com.mx"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:translate-y-[-1px]"
                >
                  Contact Us
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
            <h3 className="mt-4 text-3xl font-semibold tracking-tight text-white">
              Serious electrical engineering for heavy industry, energy, and automation environments.
            </h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-semibold text-white">Contact</p>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <p className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 text-sky-300" />
                  contacto@sieza.com.mx
                </p>
                <p className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 text-sky-300" />
                  +52 (81) 0000 0000
                </p>
                <p className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-sky-300" />
                  Monterrey, Nuevo León, México
                </p>
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-semibold text-white">Core Focus</p>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <p className="flex items-start gap-3">
                  <TowerControl className="mt-0.5 h-4 w-4 text-orange-300" />
                  Substations and power infrastructure
                </p>
                <p className="flex items-start gap-3">
                  <Factory className="mt-0.5 h-4 w-4 text-orange-300" />
                  Industrial plants and heavy operations
                </p>
                <p className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-4 w-4 text-orange-300" />
                  Automation, monitoring, and execution
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
