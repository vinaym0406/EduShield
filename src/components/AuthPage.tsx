import React, { useState } from "react";
import { motion } from "motion/react";
import { Lock, Mail, Shield, User, School, ArrowLeft } from "lucide-react";

interface AuthPageProps {
  onBack: () => void;
  onLogin: (role: "student" | "faculty" | "admin", username: string, email: string) => void;
}

export default function AuthPage({ onBack, onLogin }: AuthPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    // Assign roles based on text triggers, matching demo emails or simple keywords
    const lowerEmail = email.toLowerCase();
    if (lowerEmail.includes("aarav") || lowerEmail.includes("student")) {
      onLogin("student", "Aarav Mehta", email);
    } else if (lowerEmail.includes("anil") || lowerEmail.includes("faculty") || lowerEmail.includes("prof")) {
      onLogin("faculty", "Prof. Anil Kumar", email);
    } else if (lowerEmail.includes("director") || lowerEmail.includes("admin") || lowerEmail.includes("sen")) {
      onLogin("admin", "Director Rajeev Sen", email);
    } else {
      // Default fallback
      onLogin("student", "Aarav Mehta", email);
    }
  };

  const handleDemoClick = (role: "student" | "faculty" | "admin") => {
    if (role === "student") {
      setEmail("aarav.mehta@edu.in");
      setPassword("********");
      setTimeout(() => {
        onLogin("student", "Aarav Mehta", "aarav.mehta@edu.in");
      }, 400);
    } else if (role === "faculty") {
      setEmail("anil.kumar@edu.in");
      setPassword("********");
      setTimeout(() => {
        onLogin("faculty", "Prof. Anil Kumar", "anil.kumar@edu.in");
      }, 400);
    } else {
      setEmail("director@edu.in");
      setPassword("********");
      setTimeout(() => {
        onLogin("admin", "Director Rajeev Sen", "director@edu.in");
      }, 400);
    }
  };

  // Starry particle arrays
  const particles = Array.from({ length: 25 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 5 + 5,
  }));

  return (
    <div className="relative min-h-screen bg-transparent flex flex-col justify-center items-center p-6 overflow-hidden">
      {/* Floating Sparkles in Auth background */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="star-particle bg-purple-500/20"
            style={{
              top: p.top,
              left: p.left,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-purple-600/10 blur-[100px]" />
      </div>

      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/5 transition-all"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Home
      </button>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative w-full max-w-md bg-black/40 border border-white/10 backdrop-blur-3xl px-8 py-10 rounded-2xl shadow-2xl glowing-purple"
      >
        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 mb-4 text-purple-400">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="font-display font-bold text-3xl text-white">Welcome Back</h2>
          <p className="text-xs font-mono text-neutral-400 mt-2 tracking-wide uppercase">
            Sign in to your EduShield portal
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
            {error}
          </div>
        )}

        {/* Auth form */}
        <form onSubmit={handleManualLogin} className="space-y-5">
          <div className="space-y-2 text-left">
            <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider block">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="email"
                placeholder="name@college.edu"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className="w-full bg-neutral-900/60 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/50 transition-all font-sans"
              />
            </div>
          </div>

          <div className="space-y-2 text-left">
            <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="w-full bg-neutral-900/60 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/50 transition-all font-sans"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-purple-600 hover:bg-purple-500 active:scale-95 text-white text-sm font-medium py-3 rounded-xl transition-all shadow-lg shadow-purple-600/10 cursor-pointer text-center"
          >
            Sign In
          </button>
        </form>

        {/* Demo profiles quick login */}
        <div className="mt-8 pt-8 border-t border-white/5">
          <span className="text-[10px] font-mono text-neutral-500 block uppercase tracking-widest text-center mb-4">
            Quick Demo Login
          </span>
          <div className="space-y-2.5">
            {/* Student */}
            <button
              onClick={() => handleDemoClick("student")}
              className="w-full flex items-center justify-between text-left p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-purple-500/20 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/5 border border-purple-500/10 text-purple-400 group-hover:bg-purple-500/15">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-medium text-neutral-300 group-hover:text-white">
                  Students Demo
                </span>
              </div>
              <span className="text-[10px] font-mono text-neutral-500 group-hover:text-purple-400">
                aarav.mehta@edu.in
              </span>
            </button>

            {/* Faculty */}
            <button
              onClick={() => handleDemoClick("faculty")}
              className="w-full flex items-center justify-between text-left p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-purple-500/20 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/5 border border-purple-500/10 text-purple-400 group-hover:bg-purple-500/15">
                  <School className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-medium text-neutral-300 group-hover:text-white">
                  Faculty Demo
                </span>
              </div>
              <span className="text-[10px] font-mono text-neutral-500 group-hover:text-purple-400">
                anil.kumar@edu.in
              </span>
            </button>

            {/* Admin */}
            <button
              onClick={() => handleDemoClick("admin")}
              className="w-full flex items-center justify-between text-left p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-purple-500/20 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/5 border border-purple-500/10 text-purple-400 group-hover:bg-purple-500/15">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-medium text-neutral-300 group-hover:text-white">
                  Admins Demo
                </span>
              </div>
              <span className="text-[10px] font-mono text-neutral-500 group-hover:text-purple-400">
                director@edu.in
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
