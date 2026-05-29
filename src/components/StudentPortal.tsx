import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, LayoutGrid, Award, Calendar, Activity, TrendingUp, Bell, LogOut, 
  Smile, Meh, Frown, CheckCircle, Clock, AlertTriangle, Play, ChevronRight, 
  BookOpen, Sparkles, Send, Brain, Compass, Users 
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from "recharts";
import { 
  DEFAULT_STUDENT, INITIAL_ASSIGNMENTS, INITIAL_SUBJECTS, 
  INITIAL_STUDY_PLAN, LEADERBOARD_STUDENTS, INITIAL_MOOD_HISTORY, 
  RECENT_ALERTS, RECHARTS_TREND_DATA 
} from "../data";
import { Student, Assignment, SubjectState, StudyDay, MoodLog, AlertNotification } from "../types";

interface StudentPortalProps {
  onLogout: () => void;
}

export default function StudentPortal({ onLogout }: StudentPortalProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "forecast" | "study-plan" | "leaderboard" | "pulse-check">("dashboard");
  const [student, setStudent] = useState<Student>(DEFAULT_STUDENT);
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [subjects, setSubjects] = useState<SubjectState[]>(INITIAL_SUBJECTS);
  const [planner, setPlanner] = useState<StudyDay[]>(INITIAL_STUDY_PLAN);
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>(INITIAL_MOOD_HISTORY);
  const [notifications, setNotifications] = useState<AlertNotification[]>(RECENT_ALERTS);
  const [showNotifications, setShowNotifications] = useState(false);

  // Student specific reactive indicators
  const [selectedMood, setSelectedMood] = useState<"Thriving" | "Good" | "Neutral" | "Struggling" | "Overwhelmed" | "">("");
  const [moodDiaryText, setMoodDiaryText] = useState("");
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const [explanationLoading, setExplanationLoading] = useState(false);
  const [explanationData, setExplanationData] = useState<{
    explanation: string;
    focusSubject: string;
    actions: string[];
  }>({
    explanation: "You are tracking in the safe zone, but Computer Networks is the soft spot. Tighten attendance there and you will lock in a comfortable buffer above the threshold.",
    focusSubject: "Computer Networks",
    actions: [
      "Aim for 90%+ attendance in Computer Networks next week.",
      "Pre-read the next chapter before each class of Computer Networks.",
      "Try one full mock test in Computer Networks this weekend."
    ]
  });

  // Smart Study Planner generation details
  const [isRegeneratingPlan, setIsRegeneratingPlan] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatBotLogs, setChatBotLogs] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    { sender: "ai", text: "Hello Aarav! I am your EduShield AI Copilot. Ask me anything about improving your weak areas or optimizing your attendance!" }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Synchronize student risk score if subject statistics change in simulation
  useEffect(() => {
    // Basic reactive calculation to support simulation
    const avgAtt = subjects.reduce((sum, s) => sum + s.attendance, 0) / subjects.length;
    const avgMarks = subjects.reduce((sum, s) => sum + s.marks, 0) / subjects.length;
    // Lower attendance + lower marks = higher risk score
    const calculatedRisk = Math.max(0, Math.min(100, Math.round(((100 - avgAtt) * 1.2 + (60 - avgMarks) * 1.5) * 10) / 10));
    setStudent(prev => ({
      ...prev,
      attendance: Math.round(avgAtt),
      marks: Math.round(avgMarks),
      riskScore: calculatedRisk,
      riskLevel: calculatedRisk > 55 ? "high" : calculatedRisk > 35 ? "medium" : "safe"
    }));
  }, [subjects]);

  // AI Explanation Handler via Real Server API or local safe fallback
  const fetchRiskExplanation = async () => {
    setShowExplanationModal(true);
    setExplanationLoading(true);
    try {
      const res = await fetch("/api/gemini/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: student.name,
          riskScore: student.riskScore,
          attendance: student.attendance,
          marksBySubject: subjects.map(s => ({ name: s.name, attendance: s.attendance, marks: s.marks }))
        })
      });
      const data = await res.json();
      if (data.success) {
        setExplanationData({
          explanation: data.explanation,
          focusSubject: data.focusSubject,
          actions: data.actions
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setExplanationLoading(false);
    }
  };

  // Planner Regeneration Handler via Real Server API
  const handleRegeneratePlan = async () => {
    setIsRegeneratingPlan(true);
    try {
      const res = await fetch("/api/gemini/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          focusSubject: explanationData.focusSubject,
          currentWeekProgress: Math.round((planner.filter(p => p.completed).length / planner.length) * 100)
        })
      });
      const data = await res.json();
      if (data.success && data.days) {
        setPlanner(data.days);
      }
    } catch (e) {
      console.error("Failed to regenerate planner:", e);
    } finally {
      setIsRegeneratingPlan(false);
    }
  };

  // Copilot Quick Chat Handler
  const handleChatSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userText = chatMessage;
    setChatMessage("");
    setChatBotLogs(prev => [...prev, { sender: "user", text: userText }]);
    setIsChatLoading(true);

    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          previousChat: chatBotLogs
        })
      });
      const data = await res.json();
      if (data.success) {
        setChatBotLogs(prev => [...prev, { sender: "ai", text: data.reply }]);
      } else {
        setChatBotLogs(prev => [...prev, { sender: "ai", text: data.reply || "Something went wrong. Let's practice spaced learning!" }]);
      }
    } catch (e) {
      setChatBotLogs(prev => [...prev, { sender: "ai", text: "Connection issues. Please try study strategies like the Pomodoro technique to double down!" }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Toggle tasks completion inside Weekly planner
  const togglePlannerItem = (index: number) => {
    setPlanner(prev => prev.map((day, dIdx) => dIdx === index ? { ...day, completed: !day.completed } : day));
  };

  // Submit Mood logs
  const submitMoodCheckIn = () => {
    if (!selectedMood) return;
    const newLog: MoodLog = {
      day: "Today",
      mood: selectedMood,
      dateStr: "29/05/2026",
      note: moodDiaryText || undefined
    };
    setMoodLogs(prev => [newLog, ...prev]);
    setSelectedMood("");
    setMoodDiaryText("");
  };

  // Kanban tasks progress advancement
  const cycleAssignmentStatus = (id: string) => {
    setAssignments(prev => prev.map(a => {
      if (a.id === id) {
        const nextStatus: "pending" | "submitted" | "late" = 
          a.status === "pending" ? "submitted" : a.status === "submitted" ? "late" : "pending";
        return { ...a, status: nextStatus };
      }
      return a;
    }));
  };

  return (
    <div className="flex h-screen bg-transparent overflow-hidden">
      
      {/* 1. LEFT SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 bg-black/40 backdrop-blur-xl border-r border-white/5 pb-6">
        
        {/* Banner Logo */}
        <div className="px-6 py-6 border-b border-white/5 flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400 glowing-purple animate-pulse">
            <Shield className="w-5 h-5" />
          </div>
          <span className="font-display font-bold text-lg text-white">EduShield AI</span>
        </div>

        {/* Portal Scope indicator */}
        <div className="px-6 py-4">
          <span className="text-[10px] font-mono text-neutral-500 font-semibold tracking-widest uppercase block mb-1">
            Student Portal
          </span>
        </div>

        {/* Navigation Categories */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          {/* Dashboard Item */}
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === "dashboard"
                ? "bg-purple-600/10 text-purple-400 border border-purple-500/20"
                : "text-neutral-400 hover:text-white hover:bg-white/[0.02]"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Dashboard
          </button>

          {/* Grade Forecast Item */}
          <button
            onClick={() => setActiveTab("forecast")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === "forecast"
                ? "bg-purple-600/10 text-purple-400 border border-purple-500/20"
                : "text-neutral-400 hover:text-white hover:bg-white/[0.02]"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Grade Forecast
          </button>

          {/* Study Planner Item */}
          <button
            onClick={() => setActiveTab("study-plan")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === "study-plan"
                ? "bg-purple-600/10 text-purple-400 border border-purple-500/20"
                : "text-neutral-400 hover:text-white hover:bg-white/[0.02]"
            }`}
          >
            <Calendar className="w-4 h-4" />
            Study Plan
          </button>

          {/* Leaderboard Item */}
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === "leaderboard"
                ? "bg-purple-600/10 text-purple-400 border border-purple-500/20"
                : "text-neutral-400 hover:text-white hover:bg-white/[0.02]"
            }`}
          >
            <Award className="w-4 h-4" />
            Leaderboard
          </button>

          {/* Pulse check-in Item */}
          <button
            onClick={() => setActiveTab("pulse-check")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === "pulse-check"
                ? "bg-purple-600/10 text-purple-400 border border-purple-500/20"
                : "text-neutral-400 hover:text-white hover:bg-white/[0.02]"
            }`}
          >
            <Activity className="w-4 h-4" />
            Pulse Check-in
          </button>
        </nav>

        {/* Bottom User Profile card */}
        <div className="px-4 mt-auto pt-4 border-t border-white/5 space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 font-display font-semibold text-purple-300 text-xs flex items-center justify-center">
                A
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-white">{student.name}</div>
                <div className="text-[10px] font-mono text-neutral-500">{student.email}</div>
              </div>
            </div>
            
            <button
              onClick={onLogout}
              className="p-1 text-neutral-500 hover:text-white transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>

      {/* 2. MAIN CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0 bg-transparent overflow-y-auto">
        
        {/* TOP HEADER */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-6 md:px-8 py-5 border-b border-white/5 bg-black/20 backdrop-blur-md">
          
          <div className="flex items-center gap-4 lg:hidden">
            {/* Mobile Title Logo */}
            <div className="p-11.5 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400">
              <Shield className="w-5 h-5 animate-pulse" />
            </div>
            <h1 className="font-display font-semibold text-base text-white">EduShield AI</h1>
          </div>

          <div className="hidden lg:block text-left">
            <h1 className="font-display font-bold text-xl text-white tracking-tight">
              {activeTab === "dashboard" && "Student Overview Center"}
              {activeTab === "forecast" && "Grade & Compliance Forecast"}
              {activeTab === "study-plan" && "Smart Academic Planner"}
              {activeTab === "leaderboard" && "Class Intelligence Standings"}
              {activeTab === "pulse-check" && "Daily Well-being & Mood Tracker"}
            </h1>
          </div>

          {/* Widgets and alerts row */}
          <div className="flex items-center gap-4.5">
            
            {/* Mood Reaction quick check */}
            <div className="hidden md:flex items-center gap-2 bg-neutral-900/40 p-2 border border-white/5 rounded-xl">
              <span className="text-[10px] font-mono text-neutral-400 uppercase px-2">How are you?</span>
              <button 
                onClick={() => { setActiveTab("pulse-check"); setSelectedMood("Thriving"); }}
                className="p-1 rounded-md text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                title="Thriving"
              >
                <Smile className="w-4 h-4" />
              </button>
              <button 
                onClick={() => { setActiveTab("pulse-check"); setSelectedMood("Neutral"); }}
                className="p-1 rounded-md text-amber-400 hover:bg-amber-500/10 transition-colors"
                title="Neutral"
              >
                <Meh className="w-4 h-4" />
              </button>
              <button 
                onClick={() => { setActiveTab("pulse-check"); setSelectedMood("Overwhelmed"); }}
                className="p-1 rounded-md text-red-400 hover:bg-red-500/10 transition-colors"
                title="Overwhelmed"
              >
                <Frown className="w-4 h-4" />
              </button>
            </div>

            {/* Notifications Alert Panel */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-xl bg-neutral-900/60 border border-white/5 text-neutral-400 hover:text-white transition-all hover:border-purple-500/20 active:scale-95"
              >
                <Bell className="w-4 h-4" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full animator-ping" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 bg-[#0d0d15]/95 border border-white/5 backdrop-blur-3xl rounded-xl p-4 shadow-2xl glowing-purple z-50 text-left"
                  >
                    <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-white/5">
                      <span className="font-display font-semibold text-xs text-white">Notifications Log</span>
                      <button 
                        onClick={() => setNotifications([])}
                        className="text-[10px] font-mono text-neutral-400 hover:text-white"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="text-center py-6 text-xs text-neutral-500">No new alerts found</div>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} className="p-2.5 rounded-lg bg-neutral-900/50 border border-white/5 flex gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                            <div>
                              <div className="text-xs font-semibold text-white">{n.title}</div>
                              <div className="text-[10px] text-neutral-400 mt-1 leading-relaxed">{n.message}</div>
                              <div className="text-[9px] font-mono text-neutral-500 mt-1">{n.timestamp}</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Micro Logout for layouts */}
            <button 
              onClick={onLogout}
              className="lg:hidden p-2.5 rounded-xl bg-neutral-900/60 border border-[#8b5cf6]/20 text-neutral-400 hover:text-white transition-all"
            >
              <LogOut className="w-4 h-4 text-purple-400" />
            </button>
          </div>
        </header>

        {/* Tab content panel */}
        <div className="p-6 md:p-8 space-y-8">
          
          <AnimatePresence mode="wait">
            
            {/* TAB 1: GENERAL DASHBOARD */}
            {activeTab === "dashboard" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8 text-left"
              >
                
                {/* 1. Welcome Section */}
                <div className="md:flex md:items-center md:justify-between p-6.5 rounded-2xl bg-gradient-to-r from-purple-900/10 to-indigo-950/5 border border-white/5 backdrop-blur-sm">
                  <div>
                    <h2 className="font-display font-bold text-2.5xl text-white">Welcome back, Aarav Mehta</h2>
                    <p className="text-xs md:text-sm text-neutral-400 mt-1">Here is your academic intelligence overview.</p>
                  </div>
                  <div className="mt-4 md:mt-0 px-4 py-2.5 rounded-xl bg-[#0d0d15]/50 border border-purple-500/15 text-xs text-purple-300 font-mono flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-400 animator-pulse" />
                    Interactive Advisor Active
                  </div>
                </div>

                {/* 2. Top Metric Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Risk Meter Card */}
                  <div className="glass-card p-6.5 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
                    <div className="absolute top-3 left-4 text-neutral-400 text-xs font-mono flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-purple-400" />
                      Risk Intelligence
                    </div>

                    <div className="relative w-40 h-40 flex items-center justify-center mt-4">
                      {/* Circle Gauge SVG */}
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="80" cy="80" r="58" strokeLinecap="round" strokeWidth="10" stroke="rgba(255,255,255,0.03)" fill="transparent" />
                        <circle cx="80" cy="80" r="58" strokeLinecap="round" strokeWidth="10" 
                          stroke="url(#purpleGradient)" 
                          strokeDasharray="364" 
                          strokeDashoffset={364 - (364 * 48.4) / 100} 
                          fill="transparent" 
                        />
                        <defs>
                          <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#c084fc" />
                            <stop offset="100%" stopColor="#818cf8" />
                          </linearGradient>
                        </defs>
                      </svg>
                      
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-4xl font-display font-extrabold text-white">48.4</span>
                        <span className="text-[10px] font-mono tracking-wider font-semibold uppercase text-amber-400 mt-0.5">
                          Medium Risk
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={fetchRiskExplanation}
                      className="w-full mt-5 px-4 py-2 text-xs font-medium rounded-xl bg-purple-600/15 text-purple-300 hover:text-white hover:bg-purple-600/30 transition-all border border-purple-500/15 flex items-center justify-center gap-1.5"
                    >
                      <span>Why this score?</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* AI Suggestion Area */}
                  <div className="glass-card p-6.5 rounded-2xl flex flex-col justify-between text-left border-purple-500/10">
                    <div className="text-neutral-400 text-xs font-mono flex items-center gap-1.5 mb-4">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      AI Copilot Suggestion
                    </div>

                    <div className="flex-1 space-y-3.5">
                      <p className="text-sm text-neutral-300 leading-relaxed font-sans font-medium">
                        You are tracking in the safe zone, but <span className="bg-purple-500/10 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/15">Computer Networks</span> is the soft spot. Tighten attendance there and lock in a comfortable buffer.
                      </p>

                      <div className="inline-block px-2.5 py-1 rounded-md bg-purple-500/5 border border-purple-500/15 text-[10px] text-purple-400 font-mono">
                        Focus: {explanationData.focusSubject}
                      </div>

                      <div className="space-y-2">
                        {explanationData.actions.slice(0, 3).map((act, i) => (
                          <div key={i} className="flex gap-2 text-xs text-neutral-400">
                            <span className="text-purple-400 shrink-0 font-bold">&#8226;</span>
                            <span>{act}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={handleRegeneratePlan}
                      className="w-full mt-4 py-2 rounded-xl text-center text-xs font-mono text-neutral-400 hover:text-purple-300 transition-colors border border-white/5 flex items-center justify-center gap-1"
                    >
                      <Brain className="w-3.5 h-3.5" />
                      Generate Study Plan for Weak Spot
                    </button>
                  </div>

                  {/* Time to Crisis widget */}
                  <div className="glass-card p-6.5 rounded-2xl flex flex-col justify-between text-left">
                    <div className="text-neutral-400 text-xs font-mono flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                      Time to Crisis
                    </div>

                    <div className="my-8 text-center">
                      <div className="text-6xl md:text-7xl font-display font-extrabold text-white tracking-tighter">29</div>
                      <div className="text-xs font-semibold text-red-400 mt-2 tracking-wide uppercase font-mono">Days Remaining</div>
                    </div>

                    <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                      Currently below the 75% threshold. Approximately 29 days remain until exam ineligibility if attendance does not improve.
                    </p>
                  </div>

                </div>

                {/* 3. Recharts Trend Graph and Recent Alerts list block */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Smooth Area Chart */}
                  <div className="glass-card lg:col-span-2 p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-left">
                        <span className="text-sm font-semibold text-white block">Performance Trend</span>
                        <span className="text-xs text-neutral-400">Weekly performance intelligence metrics (W1 to W8)</span>
                      </div>
                      <div className="flex items-center gap-6 text-xs font-mono text-neutral-400">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded bg-purple-500" />
                          Attendance %
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded bg-indigo-500" />
                          Marks %
                        </div>
                      </div>
                    </div>

                    <div className="w-full h-64">
                      {/* Responsive area chart */}
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={RECHARTS_TREND_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <defs>
                            <linearGradient id="gradientAtt" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="gradientMarks" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                          <XAxis dataKey="week" stroke="rgba(255,255,255,0.3)" fontSize={10} fontFamily="JetBrains Mono" />
                          <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} fontFamily="JetBrains Mono" limit={[0, 100]} />
                          <Tooltip contentStyle={{ backgroundColor: "#08080d", borderColor: "rgba(139,92,246,0.15)", borderRadius: "8px" }} />
                          <Area type="monotone" dataKey="Attendance" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#gradientAtt)" />
                          <Area type="monotone" dataKey="Marks" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#gradientMarks)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Recent system Alerts */}
                  <div className="glass-card p-6 rounded-2xl flex flex-col justify-between text-left">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Recent Alerts
                    </h3>

                    <div className="space-y-4 flex-1">
                      {notifications.map(a => (
                        <div key={a.id} className="p-3.5 rounded-xl border border-white/5 bg-white/[0.01]">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                            {a.type === "marks" ? "Marks Slippage" : "Attendance Slippage"}
                          </div>
                          <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                            {a.message}
                          </p>
                          <div className="text-[10px] font-mono text-neutral-500 mt-2">{a.timestamp}</div>
                        </div>
                      ))}
                    </div>

                    <p className="text-[10px] font-mono text-neutral-500 mt-4">
                      Academic counselors have been notified automatically.
                    </p>
                  </div>

                </div>

                {/* 4. Kanban Assignment Tracker */}
                <div className="space-y-4">
                  <h3 id="assignment-tracker-heading" className="text-lg font-display font-semibold text-white">Assignment Tracker</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Column 1: Pending */}
                    <div className="p-4.5 rounded-2xl bg-[#08080d] border border-white/5">
                      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/5">
                        <span className="text-xs font-semibold text-white flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-neutral-400" />
                          Pending
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-neutral-900 border border-white/5 px-2 py-0.5 rounded-full text-slate-400">
                          {assignments.filter(a => a.status === "pending").length}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {assignments.filter(a => a.status === "pending").map(asg => (
                          <div 
                            key={asg.id}
                            onClick={() => cycleAssignmentStatus(asg.id)}
                            className="p-4.5 bg-[#0d0d15]/50 border border-white/5 hover:border-purple-500/25 transition-all text-left rounded-xl cursor-pointer hover:translate-y-[-2px] group"
                          >
                            <span className="inline-block px-2.5 py-0.5 rounded bg-slate-500/10 text-slate-300 text-[10px] font-mono font-semibold uppercase tracking-wider mb-2.5">
                              {asg.subject}
                            </span>
                            <div className="text-sm font-semibold text-white mb-2 leading-snug group-hover:text-purple-400 transition-colors">
                              {asg.title}
                            </div>
                            <div className="text-[10px] font-mono text-neutral-500">
                              Due: {asg.dueDate}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Column 2: Submitted */}
                    <div className="p-4.5 rounded-2xl bg-[#08080d] border border-white/5">
                      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/5">
                        <span className="text-xs font-semibold text-white flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-purple-400" />
                          Submitted
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-neutral-900 border border-white/5 px-2 py-0.5 rounded-full text-slate-400">
                          {assignments.filter(a => a.status === "submitted").length}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {assignments.filter(a => a.status === "submitted").map(asg => (
                          <div 
                            key={asg.id}
                            onClick={() => cycleAssignmentStatus(asg.id)}
                            className="p-4.5 bg-[#0d0d15]/50 border border-white/5 hover:border-purple-500/25 transition-all text-left rounded-xl cursor-pointer hover:translate-y-[-2px] group"
                          >
                            <span className="inline-block px-2.5 py-0.5 rounded bg-purple-500/10 text-purple-300 text-[10px] font-mono font-semibold uppercase tracking-wider mb-2.5">
                              {asg.subject}
                            </span>
                            <div className="text-sm font-semibold text-white/50 line-through mb-2 leading-snug">
                              {asg.title}
                            </div>
                            <div className="text-[10px] font-mono text-neutral-500">
                              Submitted on: {asg.dueDate}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Column 3: Late */}
                    <div className="p-4.5 rounded-2xl bg-[#08080d] border border-white/5">
                      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/5">
                        <span className="text-xs font-semibold text-white flex items-center gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                          Late
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-neutral-900 border border-white/5 px-2 py-0.5 rounded-full text-slate-400">
                          {assignments.filter(a => a.status === "late").length}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {assignments.filter(a => a.status === "late").map(asg => (
                          <div 
                            key={asg.id}
                            onClick={() => cycleAssignmentStatus(asg.id)}
                            className="p-4.5 bg-red-950/15 border border-red-500/10 hover:border-red-500/30 transition-all text-left rounded-xl cursor-pointer hover:translate-y-[-2px]"
                          >
                            <span className="inline-block px-2.5 py-0.5 rounded bg-red-400/10 text-red-300 text-[10px] font-mono font-semibold uppercase tracking-wider mb-2.5">
                              {asg.subject}
                            </span>
                            <div className="text-sm font-semibold text-red-300/80 mb-2 leading-snug">
                              {asg.title}
                            </div>
                            <div className="text-[10px] font-mono text-red-400/50">
                              Delayed: {asg.dueDate}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Subject Performance section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-display font-semibold text-white">Subject Performance Analytics</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjects.map((sub, i) => (
                      <div key={i} className="glass-card p-5.5 rounded-2xl space-y-4 text-left">
                        <div className="flex items-center justify-between">
                          <h4 className="font-display font-bold text-sm text-white">{sub.name}</h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-white/5 text-purple-400">
                            Predictive Index
                          </span>
                        </div>

                        {/* Slide bars */}
                        <div className="space-y-3">
                          {/* Attendance bar */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs text-neutral-400">
                              <span>Attendance</span>
                              <span className={sub.attendance < 65 ? "text-red-400 font-mono font-bold" : "text-neutral-300 font-mono"}>
                                {sub.attendance}%
                              </span>
                            </div>
                            <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden">
                              <div className={`h-full ${sub.attendanceColor}`} style={{ width: `${sub.attendance}%` }} />
                            </div>
                          </div>

                          {/* Marks bar */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs text-neutral-400">
                              <span>Internal Marks</span>
                              <span className="text-neutral-300 font-mono">{sub.marks}/100</span>
                            </div>
                            <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden">
                              <div className="h-full bg-purple-500" style={{ width: `${sub.marks}%` }} />
                            </div>
                          </div>
                        </div>

                        {/* AI insight log */}
                        <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl font-sans text-xs text-neutral-400 leading-normal">
                          <span className="text-purple-400 font-semibold block mb-1">AI Copilot Analysis:</span>
                          {sub.aiInsight}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Portal Active Consultant Chat Drawer/Block */}
                <div className="glass-card p-6 rounded-2xl grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1 text-left flex flex-col justify-between">
                    <div>
                      <div className="inline-flex p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-4 animate-pulse">
                        <Compass className="w-6 h-6" />
                      </div>
                      <h4 className="font-display font-bold text-lg text-white mb-2">Academic Copilot Chat</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                        Chat directly with our academic wellness engine. Discuss remedial schedules, exam strategies, and complex concepts instantly.
                      </p>
                    </div>

                    <div className="p-3.5 bg-neutral-950 rounded-xl border border-white/5">
                      <span className="text-[10px] font-mono text-neutral-500 block uppercase mb-1">Suggested prompts</span>
                      <button 
                        onClick={() => setChatMessage("How can I prepare Database indexes for next week's test?")}
                        className="text-left text-[11px] text-purple-400 hover:text-white block truncate w-full mt-1.5"
                      >
                        &#8250; Plan diagnostic quizzes for Database indexing.
                      </button>
                      <button 
                        onClick={() => setChatMessage("Tell me an active memory strategy for subnets.")}
                        className="text-left text-[11px] text-purple-400 hover:text-white block truncate w-full mt-1.5"
                      >
                        &#8250; What are spaced study models for IP routing?
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-2 border border-white/5 bg-neutral-950/60 rounded-xl flex flex-col h-80">
                    <div className="flex-1 p-4.5 overflow-y-auto space-y-3.5 min-h-0 text-left">
                      {chatBotLogs.map((chat, idx) => (
                        <div 
                          key={idx} 
                          className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`p-3 rounded-xl max-w-[85%] text-xs leading-relaxed ${
                            chat.sender === "user" 
                              ? "bg-purple-600/25 border border-purple-500/35 text-white rounded-tr-none" 
                              : "bg-white/[0.02] border border-white/5 text-neutral-300 rounded-tl-none"
                          }`}>
                            {chat.text}
                          </div>
                        </div>
                      ))}
                      {isChatLoading && (
                        <div className="text-xs text-neutral-500 font-mono italic animate-pulse">EduShield AI is pondering study tactics...</div>
                      )}
                    </div>

                    <form onSubmit={handleChatSend} className="p-3 border-t border-white/5 flex gap-2.5">
                      <input
                        type="text"
                        placeholder="Discuss curriculum hurdles, exam planning, or attendance paths..."
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        className="flex-1 bg-neutral-900 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500/50"
                      />
                      <button
                        type="submit"
                        className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-all active:scale-95 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                </div>

              </motion.div>
            )}

            {/* TAB 2: GRADE FORECAST DETAIL */}
            {activeTab === "forecast" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8 text-left"
              >
                <div className="p-6.5 rounded-2xl bg-neutral-950 border border-white/5">
                  <h3 className="font-display font-medium text-lg text-white mb-2">Academic Risk Simulator</h3>
                  <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
                    Test different attendance percentages and projected performance levels to see simulated updates inside your risk score index in real time. Sliding metrics below 65% triggers high-risk limits.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Slider dashboard */}
                  <div className="p-6.5 rounded-2xl bg-[#08080d] border border-white/5 space-y-6">
                    <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest block pb-2 border-b border-white/5">
                      Curve Calibration Sliders
                    </span>

                    {subjects.map((sub, idx) => (
                      <div key={idx} className="space-y-3.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-white">{sub.name}</span>
                          <span className="text-purple-400 font-mono font-semibold">
                            Att: {sub.attendance}% | Marks: {sub.marks}/100
                          </span>
                        </div>

                        {/* Attendance slider */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] text-neutral-400">
                            <span>Projected Attendance</span>
                          </div>
                          <input 
                            type="range"
                            min="10"
                            max="100"
                            value={sub.attendance}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              setSubjects(prev => prev.map((s, sIdx) => sIdx === idx ? { 
                                ...s, 
                                attendance: value, 
                                attendanceColor: value < 65 ? "bg-red-500" : value < 75 ? "bg-amber-500" : "bg-emerald-500"
                              } : s));
                            }}
                            className="w-full accent-purple-500 cursor-ew-resize h-1 bg-neutral-900 rounded-lg appearance-none"
                          />
                        </div>

                        {/* Marks slider */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] text-neutral-400">
                            <span>Estimated Mid-term Score</span>
                          </div>
                          <input 
                            type="range"
                            min="10"
                            max="100"
                            value={sub.marks}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              setSubjects(prev => prev.map((s, sIdx) => sIdx === idx ? { ...s, marks: value } : s));
                            }}
                            className="w-full accent-indigo-500 cursor-ew-resize h-1 bg-neutral-900 rounded-lg appearance-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Simulated output prediction */}
                  <div className="flex flex-col justify-between gap-6">
                    <div className="glass-card p-8 rounded-2xl flex-1 flex flex-col items-center justify-center text-center relative overflow-hidden">
                      <div className="absolute top-4 left-5 text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Brain className="w-4 h-4 text-purple-400" />
                        Simulated Indicator Output
                      </div>

                      <div className="text-8xl font-display font-extrabold text-white tracking-tighter mt-4">
                        {student.riskScore}
                      </div>

                      <div className={`mt-3.5 px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest border ${
                        student.riskLevel === "high" 
                          ? "bg-red-500/10 border-red-500/30 text-red-400 text-shadow-glow"
                          : student.riskLevel === "medium"
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                          : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      }`}>
                        {student.riskLevel} academic risk index
                      </div>

                      <div className="mt-6 flex gap-6 text-xs text-neutral-400">
                        <div>
                          <div className="font-mono text-neutral-500 uppercase text-[10px]">Overall Attendance</div>
                          <div className="font-bold text-white text-lg mt-0.5">{student.attendance}%</div>
                        </div>
                        <div className="w-[1px] bg-white/5" />
                        <div>
                          <div className="font-mono text-neutral-500 uppercase text-[10px]">Average Marks</div>
                          <div className="font-bold text-white text-lg mt-0.5">{student.marks}/100</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5.5 rounded-2xl bg-neutral-950 border border-white/5 space-y-3">
                      <span className="text-purple-400 text-xs font-mono font-bold block uppercase tracking-wider">
                        Predictive Intelligence Engine Note:
                      </span>
                      <p className="text-xs text-neutral-400 leading-normal">
                        Your real-time forecast updates dynamically by feeding these simulated curves through a multi-factor regression model. To synchronize these simulated targets with counselors, submit your request through the "Study Planner" generation suite.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 3: SMART STUDY PLANNER */}
            {activeTab === "study-plan" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8 text-left"
              >
                
                <div className="md:flex md:items-center md:justify-between p-6 rounded-2xl bg-neutral-950 border border-white/5 gap-6">
                  <div>
                    <h2 className="font-display font-medium text-lg text-white">Smart Study Planner</h2>
                    <p className="text-xs text-neutral-400 mt-1">AI-generated schedule optimized for your high-risk areas.</p>
                  </div>
                  
                  <button
                    onClick={handleRegeneratePlan}
                    disabled={isRegeneratingPlan}
                    className="mt-4 md:mt-0 px-4.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-medium text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-purple-600/20 active:scale-95"
                  >
                    <Sparkles className="w-4 h-4" />
                    {isRegeneratingPlan ? "Regenerating plan..." : "Regenerate Plan"}
                  </button>
                </div>

                {/* Progress bar info */}
                <div className="p-6.5 rounded-2xl bg-[#08080d] border border-white/5 relative overflow-hidden">
                  <div className="absolute top-2 right-4 text-[9px] font-mono text-neutral-500 uppercase">
                    Sync status: 100% cloud backup
                  </div>

                  <div className="flex justify-between text-xs font-mono font-semibold text-neutral-400 mb-2">
                    <span>Weekly Study Progress</span>
                    <span className="text-purple-300">
                      {Math.round((planner.filter(p => p.completed).length / planner.length) * 100)}%
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-neutral-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500" 
                      style={{ width: `${(planner.filter(p => p.completed).length / planner.length) * 100}%` }}
                    />
                  </div>

                  <div className="text-[10px] text-neutral-500 mt-3.5 flex items-center gap-1.5 font-mono">
                    <CheckCircle className="w-3.5 h-3.5 text-purple-400" />
                    Dynamic plan synchronized with Counselor advisory logs on Friday 29/05/2026.
                  </div>
                </div>

                {/* Week Column list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  {planner.map((day, idx) => (
                    <div 
                      key={idx}
                      onClick={() => togglePlannerItem(idx)}
                      className={`p-4 bg-neutral-900/50 border rounded-xl flex flex-col justify-between text-left transition-all cursor-pointer h-48 hover:translate-y-[-3px] ${
                        day.completed 
                          ? "border-emerald-500/25 bg-emerald-950/5 text-slate-400" 
                          : "border-white/5 hover:border-purple-500/25 text-neutral-200"
                      }`}
                    >
                      <div>
                        {/* Day indicator */}
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[10px] font-mono font-extrabold text-neutral-400 uppercase tracking-widest">
                            {day.day}
                          </span>
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            day.completed ? "border-emerald-400 text-emerald-400 bg-emerald-500/20" : "border-white/20"
                          }`}>
                            {day.completed && <span className="text-[9px]">&#10004;</span>}
                          </span>
                        </div>

                        <span className="text-[10px] font-mono text-purple-400 mb-2.5 block uppercase tracking-wider">
                          {day.subject}
                        </span>

                        <p className={`text-[11px] leading-relaxed mb-4 ${day.completed ? "line-through text-neutral-500" : ""}`}>
                          {day.action}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-500">
                        <Clock className="w-3.5 h-3.5 text-neutral-600" />
                        {day.duration}
                      </div>
                    </div>
                  ))}
                </div>

              </motion.div>
            )}

            {/* TAB 4: LEADERBOARD PAGE */}
            {activeTab === "leaderboard" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8 text-left"
              >
                
                <div className="p-6.5 rounded-2xl bg-neutral-950 border border-white/5">
                  <h3 className="font-display font-medium text-lg text-white mb-2">Class Leaderboard</h3>
                  <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
                    Anonymized rankings based on attendance, marks, and engagement. Complete study logs and submit checks to earn academic score points.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Top Performers Rank List */}
                  <div className="lg:col-span-2 p-6 rounded-2xl bg-[#08080d] border border-white/5 space-y-4">
                    <div className="flex items-center justify-between pb-3.5 border-b border-white/5">
                      <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">
                        Ranks standings
                      </span>
                      <span className="text-xs text-purple-400 font-semibold font-mono">
                        Your Rank: #4 of 4
                      </span>
                    </div>

                    <div className="space-y-3">
                      {LEADERBOARD_STUDENTS.map(ls => (
                        <div 
                          key={ls.rank}
                          className={`p-4 rounded-xl flex items-center justify-between border ${
                            ls.isCurrentUser 
                              ? "bg-purple-600/10 border-purple-500/35 text-white glowing-purple" 
                              : "bg-[#0d0d15]/50 border-white/5 text-neutral-300"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            {/* Rank circle */}
                            <div className={`w-8 h-8 rounded-lg font-mono font-bold flex items-center justify-center text-sm ${
                              ls.rank === 1 ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                              : ls.rank === 2 ? "bg-slate-300/20 text-slate-300 border border-slate-300/30"
                              : ls.rank === 3 ? "bg-orange-600/20 text-orange-400 border border-orange-600/30"
                              : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            }`}>
                              {ls.rank}
                            </div>

                            <div className="text-left">
                              <div className="text-sm font-semibold">{ls.name}</div>
                              <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
                                Att: {ls.attendance}% | Marks: {ls.marks}%
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-sm font-display font-extrabold text-white">{ls.score}</div>
                            <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider block">
                              Edu Points
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Achievements and Badges catalog */}
                  <div className="space-y-6">
                    {/* Earned Badges widget */}
                    <div className="glass-card p-6 rounded-2xl">
                      <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <Award className="w-4 h-4 text-purple-400" />
                        Earned Badges
                      </h4>

                      <div className="text-center py-8 text-xs text-neutral-500 font-sans border border-dashed border-white/5 rounded-xl">
                        No badges earned yet. Keep studying!
                      </div>
                    </div>

                    {/* Available badges catalogue */}
                    <div className="p-6 rounded-2xl bg-neutral-950 border border-white/5">
                      <h4 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest mb-4">
                        Available to Earn
                      </h4>

                      <div className="space-y-4">
                        {[
                          { title: "Perfect Attendance Week", spec: "Hit 100% attendance across all subjects in a week." },
                          { title: "Most Improved", spec: "Improve your risk score by 15+ points." },
                          { title: "Comeback King", spec: "Move from high to medium risk in a single cycle." },
                          { title: "Consistency Champion", spec: "Submit every assignment on time for a month." },
                          { title: "Subject Topper", spec: "Score above 85% in any subject." }
                        ].map((bdg, i) => (
                          <div key={i} className="flex gap-3.5 text-left text-xs opacity-65 hover:opacity-100 transition-opacity">
                            <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-white/5 shrink-0 flex items-center justify-center font-bold text-neutral-500 font-mono text-xs">
                              &#8226;
                            </div>
                            <div>
                              <div className="font-semibold text-white">{bdg.title}</div>
                              <p className="text-[10px] text-neutral-400 mt-0.5 leading-normal">{bdg.spec}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

              </motion.div>
            )}

            {/* TAB 5: PULSE CHECK-IN PAGE */}
            {activeTab === "pulse-check" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8 text-left"
              >
                
                <div className="p-6.5 rounded-2xl bg-neutral-950 border border-white/5">
                  <h3 className="font-display font-medium text-lg text-white mb-2">Pulse Check-in</h3>
                  <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
                    Log how you're feeling and track your academic well-being over time. Chronic high stress levels negatively impact performance indices.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Log emotions box */}
                  <div className="lg:col-span-2 p-6.5 rounded-2xl bg-[#08080d] border border-white/5 space-y-6">
                    <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest block pb-2 border-b border-white/5">
                      Today's Check-in
                    </span>

                    <div className="space-y-2">
                      <div className="text-xs font-medium text-white mb-3">How are you feeling today?</div>
                      
                      <div className="grid grid-cols-5 gap-3">
                        {(["Thriving", "Good", "Neutral", "Struggling", "Overwhelmed"] as const).map(m => (
                          <button
                            key={m}
                            onClick={() => setSelectedMood(m)}
                            className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                              selectedMood === m
                                ? "bg-purple-600/15 border-purple-500 text-white"
                                : "bg-[#0d0d15] border-white/5 text-neutral-400 hover:text-white"
                            }`}
                          >
                            {m === "Thriving" && <Smile className="w-5 h-5 text-emerald-400" />}
                            {m === "Good" && <Smile className="w-5 h-5 text-purple-400" />}
                            {m === "Neutral" && <Meh className="w-5 h-5 text-amber-400" />}
                            {m === "Struggling" && <Frown className="w-5 h-5 text-orange-400" />}
                            {m === "Overwhelmed" && <Frown className="w-5 h-5 text-red-400" />}
                            <span className="text-[10px] font-mono font-semibold">{m}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-neutral-300 font-medium block">Note (optional)</label>
                      <textarea
                        rows={3}
                        placeholder="What's on your mind? Curriculum stress, team project blockers, or focus limits?"
                        value={moodDiaryText}
                        onChange={(e) => setMoodDiaryText(e.target.value)}
                        className="w-full bg-[#0d0d15] border border-white/5 rounded-xl p-4 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/50"
                      />
                    </div>

                    <button
                      onClick={submitMoodCheckIn}
                      className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20 active:scale-95 cursor-pointer text-center"
                    >
                      Submit Check-In
                    </button>
                  </div>

                  {/* AI insights and summary indicators */}
                  <div className="glass-card p-6.5 rounded-2xl flex flex-col justify-between text-left">
                    <div className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      AI Insight
                    </div>

                    <p className="text-sm text-neutral-300 leading-relaxed font-sans font-medium mb-12">
                      Students who report low mood 11+ days show 23% lower attendance on average. Double down on wellness checklists to protect consistency.
                    </p>

                    <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl text-xs text-neutral-500 leading-normal font-mono">
                      Last wellness assessment: 29/05/2026. Stress indicator verified as stable.
                    </div>
                  </div>
                </div>

                {/* Mood Timeline Line Graph and Historical logs review */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Timeline Chart */}
                  <div className="glass-card lg:col-span-2 p-6.5 rounded-2xl">
                    <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest block mb-4">
                      Mood Timeline Trend
                    </span>

                    <div className="w-full h-48 flex items-end justify-between font-mono text-[10px] text-neutral-500 py-3 px-1 border-b border-white/5">
                      {moodLogs.slice().reverse().map((lg, i) => (
                        <div key={i} className="flex flex-col items-center gap-3">
                          {/* Circle state representation */}
                          <div className={`w-8 p-1.5 rounded-full flex items-center justify-center font-bold border ${
                            lg.mood === "Thriving" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : lg.mood === "Good" ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                            : lg.mood === "Neutral" ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : lg.mood === "Struggling" ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                          }`}>
                            {lg.mood.slice(0, 2)}
                          </div>
                          <span>{lg.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Check-ins catalog review */}
                  <div className="p-6.5 rounded-2xl bg-neutral-950 border border-white/5">
                    <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest block mb-4">
                      Recent Check-ins
                    </span>

                    <div className="space-y-3.5 max-h-48 overflow-y-auto">
                      {moodLogs.map((log, idx) => (
                        <div key={idx} className="p-3 bg-white/[0.01] border border-white/5 rounded-xl text-left">
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                              log.mood === "Thriving" || log.mood === "Good" 
                                ? "bg-emerald-500/10 text-emerald-400" 
                                : "bg-amber-500/10 text-amber-400"
                            }`}>
                              {log.mood}
                            </span>
                            <span className="text-[9px] font-mono text-neutral-500">{log.dateStr || "May 2026"}</span>
                          </div>
                          <p className="text-xs text-neutral-400 mt-2 italic leading-relaxed">
                            {log.note || "No note provided"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </main>

      {/* 3. DYNAMIC EXPLANATION DIALOG MODAL */}
      <AnimatePresence>
        {showExplanationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#0d0d15] border border-white/5 p-8 rounded-2xl shadow-2xl glowing-purple text-left relative"
            >
              <div className="flex items-center gap-3.5 mb-6">
                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <Brain className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg text-white">Risk Intelligence Calibration</h3>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wide">
                    Live Counselor Advice Feed
                  </span>
                </div>
              </div>

              {explanationLoading ? (
                <div className="space-y-4 py-8 text-center flex flex-col items-center justify-center">
                  <div className="w-8 h-8 rounded-full border-4 border-purple-500 border-t-transparent animate-spin mb-4" />
                  <p className="text-xs font-mono text-neutral-400 animate-pulse">Running advanced regression profiles & querying Gemini...</p>
                </div>
              ) : (
                <div className="space-y-5">
                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans">
                    {explanationData.explanation}
                  </p>

                  <div className="p-4 bg-purple-500/5 rounded-xl border border-purple-500/15">
                    <span className="text-[10px] font-mono text-purple-400 block uppercase tracking-wider mb-2">Focus Subject Spotlight</span>
                    <span className="text-sm font-semibold text-white">{explanationData.focusSubject}</span>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[10px] font-mono text-neutral-400 block uppercase tracking-wide">Suggested Correction Path</span>
                    {explanationData.actions.map((act, i) => (
                      <div key={i} className="flex gap-2 text-xs text-neutral-400 leading-normal">
                        <CheckCircle className="w-4 h-4 text-purple-400 shrink-0" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 mt-6 pt-6 border-t border-white/5">
                    <button 
                      onClick={() => handleRegeneratePlan()}
                      className="flex-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold py-3 rounded-xl transition-colors cursor-pointer text-center"
                    >
                      Regenerate Planner
                    </button>
                    <button
                      onClick={() => setShowExplanationModal(false)}
                      className="px-6 bg-white/5 hover:bg-white/10 text-neutral-300 text-xs py-3 rounded-xl border border-white/5 transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
