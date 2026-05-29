import { motion } from "motion/react";
import { Shield, Cpu, Activity, Award, ArrowRight } from "lucide-react";

interface LandingPageProps {
  onNavigate: (view: "landing" | "auth" | "student" | "faculty" | "admin") => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  // Generate random positions for floating stars/particles
  const stars = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 6 + 4,
    delay: Math.random() * 3,
  }));

  return (
    <div className="relative min-h-screen bg-transparent overflow-hidden">
      {/* Background Star Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star-particle bg-purple-500/40"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}

        {/* Ambient Purple Blur Spotlights */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] rounded-full bg-purple-900/15 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] rounded-full bg-indigo-950/20 blur-[130px]" />
      </div>

      {/* Header / Navbar */}
      <nav id="landing-navbar" className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/5 bg-transparent">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-600/15 border border-purple-500/20 glow">
            <Shield className="w-6 h-6 text-purple-400" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            EduShield AI
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-neutral-400 font-medium">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-4">
          <button
            id="btn-nav-signin"
            onClick={() => onNavigate("auth")}
            className="text-sm font-medium text-neutral-300 hover:text-white transition-colors px-4 py-2"
          >
            Sign In
          </button>
          <button
            id="btn-nav-getstarted"
            onClick={() => onNavigate("auth")}
            className="relative group overflow-hidden rounded-xl p-[1px] font-medium transition-transform active:scale-95"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl" />
            <span className="relative block px-4 py-2 rounded-xl bg-black/80 text-sm text-white group-hover:bg-transparent transition-colors">
              Get Started
            </span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-16 md:pt-28 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 font-medium tracking-wide mb-8 uppercase"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          Next-Generation Student Risk Intelligence
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="font-display text-5xl md:text-8xl font-bold tracking-tight text-white mb-6"
        >
          Predict. Protect.{" "}
          <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-indigo-500 bg-clip-text text-transparent">
            Empower.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-2xl mx-auto text-base md:text-lg text-neutral-400 leading-relaxed mb-12"
        >
          Mission-control for academic safety. Identify at-risk students before they fail,
          coordinate interventions, and build data-driven study plans.
        </motion.p>

        {/* CTA and Floating Stat Cards Row */}
        <div className="relative max-w-3xl mx-auto flex flex-col items-center justify-center gap-8 mb-20">
          <motion.button
            id="hero-view-demo"
            onClick={() => onNavigate("auth")}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40 glow transition-all duration-300 active:scale-95 cursor-pointer"
          >
            <span>View Live Demo</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          {/* Stat 1: Prediction Accuracy */}
          <motion.div
            initial={{ opacity: 0, x: -30, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="md:absolute md:left-4 md:-top-12 flex items-center gap-3.5 px-4.5 py-3 rounded-xl bg-neutral-900/60 border border-white/5 backdrop-blur-md"
          >
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-left">
              <div className="text-xs text-neutral-400">Prediction Accuracy</div>
              <div className="text-lg font-bold text-white font-display">94%</div>
            </div>
          </motion.div>

          {/* Stat 2: Faster Intervention */}
          <motion.div
            initial={{ opacity: 0, x: 30, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="md:absolute md:right-4 md:bottom-2 flex items-center gap-3.5 px-4.5 py-3 rounded-xl bg-neutral-900/60 border border-white/5 backdrop-blur-md"
          >
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <Award className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-left">
              <div className="text-xs text-neutral-400">Faster Intervention</div>
              <div className="text-lg font-bold text-white font-display">3x</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
            Command Center Architecture
          </h2>
          <p className="max-w-xl mx-auto text-neutral-400 text-sm md:text-base">
            Intelligent design modules targeted for students, faculty advisors, and institution leadership.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Student Copilot */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card glass-card-hover p-8 rounded-2xl flex flex-col gap-5 text-left group"
          >
            <div className="self-start p-3.5 rounded-xl bg-purple-600/15 border border-purple-500/20 group-hover:border-purple-400/50 transition-colors">
              <Cpu className="w-6 h-6 text-purple-400 rgb-glowing" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-xl text-white mb-2">Student Copilot</h3>
              <p className="text-sm text-neutral-400 leading-relaxed mb-4">
                Personalized checklists, responsive forecasts, daily study habits tracking, and reactive mood diagnostics.
              </p>
              <ul className="text-xs text-neutral-500 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-purple-400" />
                  Personalized forecasts
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-purple-400" />
                  Dynamic study plans
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-purple-400" />
                  Pulse check-ins
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Card 2: Faculty Radar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card glass-card-hover p-8 rounded-2xl flex flex-col gap-5 text-left group"
          >
            <div className="self-start p-3.5 rounded-xl bg-purple-600/15 border border-purple-500/20 group-hover:border-purple-400/50 transition-colors">
              <Activity className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-xl text-white mb-2">Faculty Radar</h3>
              <p className="text-sm text-neutral-400 leading-relaxed mb-4">
                Command center heatmap trackers, warning indicators, class-wide dashboards, and customizable student notification conduits.
              </p>
              <ul className="text-xs text-neutral-500 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-purple-400" />
                  Real-time risk heatmaps
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-purple-400" />
                  Smart alerts
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-purple-400" />
                  Intervention scheduling
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Card 3: Admin Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card glass-card-hover p-8 rounded-2xl flex flex-col gap-5 text-left group"
          >
            <div className="self-start p-3.5 rounded-xl bg-purple-600/15 border border-purple-500/20 group-hover:border-purple-400/50 transition-colors">
              <Shield className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-xl text-white mb-2">Admin Overview</h3>
              <p className="text-sm text-neutral-400 leading-relaxed mb-4">
                Branch performance statistics, institutional level maps, compliance report filters, and JSON data exports.
              </p>
              <ul className="text-xs text-neutral-500 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-purple-400" />
                  Predictive analytics
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-purple-400" />
                  Automated reporting
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-purple-400" />
                  Department insights
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 text-center text-neutral-500 font-mono text-xs border-t border-white/5">
        &copy; {new Date().getFullYear()} EduShield AI. Designed for modern predictive student intelligence.
      </footer>
    </div>
  );
}
