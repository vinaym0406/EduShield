import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, Users, Activity, AlertTriangle, CheckCircle, Search, Filter, 
  Send, School, ArrowRight, Sparkles, BookOpen, Clock, Bell, LogOut 
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { MONITORED_STUDENTS, MENTORS_DATA } from "../data";
import { Student } from "../types";

interface FacultyPortalProps {
  onLogout: () => void;
}

export default function FacultyPortal({ onLogout }: FacultyPortalProps) {
  const [students, setStudents] = useState<Student[]>(MONITORED_STUDENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<"all" | "high" | "medium" | "safe">("all");
  
  // Custom Alert state
  const [selectedStudentForAlert, setSelectedStudentForAlert] = useState("");
  const [alertType, setAlertType] = useState<"info" | "warning" | "badge">("info");
  const [alertMessage, setAlertMessage] = useState("");
  const [sentAlerts, setSentAlerts] = useState<Array<{ id: string; target: string; message: string; timestamp: string }>>([
    { id: "sa_1", target: "Pooja Saxena", message: "You earned the Consistency Champion badge — keep it up.", timestamp: "Apr 29, 2026, 10:06 PM" },
    { id: "sa_2", target: "Dev Malhotra", message: "Your Attendance has fallen to critical levels in OS.", timestamp: "Apr 29, 2026, 09:12 PM" },
  ]);

  // Selected Student detail state for modal
  const [activeDetailsStudent, setActiveDetailsStudent] = useState<Student | null>(null);

  // Filter student dataset based on queries
  const filteredStudents = students.filter(std => {
    const matchesSearch = std.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          std.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          std.branch.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (riskFilter === "all") return matchesSearch;
    return matchesSearch && std.riskLevel === riskFilter;
  });

  // Action for sending counselor alert
  const handleSendAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForAlert || !alertMessage.trim()) return;

    const studentName = students.find(s => s.id === selectedStudentForAlert)?.name || "Selected Student";
    const newAlert = {
      id: `sa_${Date.now()}`,
      target: studentName,
      message: alertMessage,
      timestamp: new Date().toLocaleString(),
    };

    setSentAlerts(prev => [newAlert, ...prev]);
    setAlertMessage("");
    setSelectedStudentForAlert("");
  };

  // Recharts Subject performance summary datasets
  const SUBJECT_STANDINGS_DATA = [
    { subject: "Algorithms", Attendance: 74, Marks: 62 },
    { subject: "Computer Networks", Attendance: 68, Marks: 54 },
    { subject: "Microprocessors", Attendance: 71, Marks: 59 },
    { subject: "Thermodynamics", Attendance: 75, Marks: 66 },
    { subject: "Machine Design", Attendance: 78, Marks: 61 },
    { subject: "Geotechnical", Attendance: 72, Marks: 58 },
    { subject: "Concrete Tech", Attendance: 76, Marks: 64 },
  ];

  return (
    <div className="flex h-screen bg-transparent overflow-hidden">
      
      {/* LEFT SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 bg-black/40 backdrop-blur-xl border-r border-white/5 pb-6">
        <div className="px-6 py-6 border-b border-white/5 flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400 glowing-purple">
            <Shield className="w-5 h-5 animate-pulse" />
          </div>
          <span className="font-display font-bold text-lg text-white">EduShield AI</span>
        </div>

        <div className="px-6 py-4">
          <span className="text-[10px] font-mono text-neutral-500 font-semibold tracking-widest uppercase block mb-1">
            Faculty Portal
          </span>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-purple-600/10 text-purple-400 border border-purple-500/20">
            <School className="w-4 h-4" />
            Faculty Radar
          </button>
        </nav>

        {/* Bottom Profile details */}
        <div className="px-4 mt-auto pt-4 border-t border-white/5">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 font-display font-semibold text-indigo-300 text-xs flex items-center justify-center">
                P
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-white">Prof. Anil Kumar</div>
                <div className="text-[10px] font-mono text-neutral-500">anil.kumar@edu.in</div>
              </div>
            </div>
            
            <button onClick={onLogout} className="p-1 text-neutral-500 hover:text-white transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN LAYOUT HEADER AND MONITORS */}
      <main className="flex-1 flex flex-col min-w-0 bg-transparent overflow-y-auto">
        
        {/* TOP HEADER */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-6 md:px-8 py-5 border-b border-white/5 bg-black/20 backdrop-blur-md">
          <div className="flex items-center gap-4 lg:hidden">
            <div className="p-2 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400">
              <Shield className="w-5 h-5" />
            </div>
            <h1 className="font-display font-semibold text-base text-white">EduShield AI</h1>
          </div>

          <h2 className="hidden lg:block font-display font-bold text-xl text-white tracking-tight">
            Faculty Radar Dashboard
          </h2>

          <button onClick={onLogout} className="lg:hidden p-2 px-3.5 rounded-xl bg-neutral-900 border border-white/5 text-xs text-neutral-400 flex items-center gap-2">
            <LogOut className="w-3.5 h-3.5 text-purple-400" />
            Logout
          </button>
        </header>

        {/* MAIN RADAR BODY CONTENT */}
        <div className="p-6 md:p-8 space-y-8">
          
          {/* Welcome and Summary Banner blocks */}
          <div className="text-left">
            <h3 className="font-display font-bold text-2.5xl text-white">Faculty Radar Control Center</h3>
            <p className="text-xs text-neutral-400 mt-1">Monitor real-time student risk statistics and push targeted intervention actions.</p>
          </div>

          {/* Core high level summary metrics counters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Total Students Monitored */}
            <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl flex items-center gap-4.5 text-left">
              <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Total Students</span>
                <span className="text-2xl font-bold text-white font-display mt-0.5">20</span>
              </div>
            </div>

            {/* High Critical Risk Monitors */}
            <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl flex items-center gap-4.5 text-left border-red-500/20">
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 animate-pulse">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">High Risk Spotlights</span>
                <span className="text-2xl font-bold text-red-400 font-display mt-0.5">1</span>
              </div>
            </div>

            {/* Medium Danger Monitors */}
            <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl flex items-center gap-4.5 text-left border-amber-500/15">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Medium Risk Spotlights</span>
                <span className="text-2xl font-bold text-amber-400 font-display mt-0.5">12</span>
              </div>
            </div>

            {/* Low Risk Safe Monitors */}
            <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl flex items-center gap-4.5 text-left border-emerald-500/15">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Low Risk Spotlights</span>
                <span className="text-2xl font-bold text-emerald-400 font-display mt-0.5">7</span>
              </div>
            </div>

          </div>

          {/* Search, Filter controls and Monitored Students Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Student Search and Heatmap Table Grid (takes 2 cols) */}
            <div className="lg:col-span-2 space-y-4 text-left">
              <div className="md:flex md:items-center md:justify-between gap-4 py-2">
                <span className="text-sm font-semibold text-white font-display">Monitored Students Registry</span>
                
                {/* Search query box */}
                <div className="mt-3 md:mt-0 flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
                    <input
                      type="text"
                      placeholder="Search students or branches..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-neutral-900 border border-white/5 rounded-xl py-1.5 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-purple-500/50"
                    />
                  </div>

                  {/* Filter dropdown */}
                  <div className="flex items-center gap-1.5 bg-neutral-900 px-3 py-1.5 rounded-xl border border-white/5">
                    <Filter className="w-3 h-3 text-neutral-500" />
                    <select
                      value={riskFilter}
                      onChange={(e) => setRiskFilter(e.target.value as any)}
                      className="bg-transparent text-xs text-neutral-300 focus:outline-none cursor-pointer"
                    >
                      <option value="all" className="bg-neutral-950 text-neutral-300">All Risk Categories</option>
                      <option value="high" className="bg-neutral-950 text-red-400 font-semibold">High Critical</option>
                      <option value="medium" className="bg-neutral-950 text-amber-400">Medium Risk</option>
                      <option value="safe" className="bg-neutral-950 text-emerald-400">Low Safe</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Monitored student logs heat list styled after screenshots */}
              <div className="p-4 bg-neutral-950/80 border border-white/5 rounded-2xl overflow-x-auto">
                <table className="w-full text-left text-xs leading-normal">
                  <thead>
                    <tr className="border-b border-white/5 text-neutral-500 font-mono font-bold uppercase tracking-wider text-[10px] pb-3 block md:table-row">
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Branch / Sem</th>
                      <th className="py-3 px-4">Att %</th>
                      <th className="py-3 px-4">Marks %</th>
                      <th className="py-3 px-4">Risk Level</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-neutral-500 italic">No students match your query filters.</td>
                      </tr>
                    ) : (
                      filteredStudents.map(std => (
                        <tr key={std.id} className="hover:bg-white/[0.01] transition-all">
                          <td className="py-3.5 px-4 font-sans">
                            <div className="font-semibold text-white">{std.name}</div>
                            <div className="text-[10px] text-neutral-500">{std.email}</div>
                            <div className="text-[9px] text-purple-400 mt-1">Mentor: {std.mentor}</div>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-semibold text-neutral-300 uppercase">
                            {std.branch} <span className="text-[10px] text-neutral-500">({std.semester})</span>
                          </td>
                          <td className={`py-3.5 px-4 font-mono font-bold ${std.attendance < 65 ? "text-red-400" : "text-neutral-300"}`}>
                            {std.attendance}%
                          </td>
                          <td className="py-3.5 px-4 font-mono text-neutral-300">
                            {std.marks}%
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-block px-2 px-2.5 py-0.5 rounded-full text-[9px] font-semibold font-mono tracking-wide uppercase ${
                              std.riskLevel === "high"
                                ? "bg-red-500/10 border border-red-500/20 text-red-400"
                                : "bg-amber-500/10 border border-amber-500/20 text-amber-300"
                            }`}>
                              {std.riskScore} &bull; {std.riskLevel}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => {
                                setActiveDetailsStudent(std);
                                setSelectedStudentForAlert(std.id);
                              }}
                              className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-[10px] text-neutral-300 rounded-lg border border-white/5 hover:border-purple-500/25 transition-all"
                            >
                              View details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mini Heat dot widget for layout */}
              <div className="p-5 rounded-2xl bg-neutral-900/30 border border-white/5">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block mb-3">Risk Distribution Heatmap Matrix</span>
                <div className="flex flex-wrap gap-2">
                  {students.map((std, i) => (
                    <span 
                      key={i}
                      title={`${std.name} - ${std.riskScore}`}
                      className={`w-4 h-4 rounded-full ${
                        std.riskLevel === "high" 
                          ? "bg-red-500 glowing-purple" 
                          : std.riskLevel === "medium" 
                          ? "bg-amber-500" 
                          : "bg-emerald-500"
                      }`}
                    />
                  ))}
                </div>
              </div>

            </div>

            {/* Left Column: Recharts Subject performance matrix summary */}
            <div className="space-y-6">
              
              <div className="glass-card p-6 rounded-2xl text-left">
                <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest block mb-4">Class Performance by Subject</span>
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={SUBJECT_STANDINGS_DATA} layout="vertical" margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.01)" />
                      <XAxis type="number" stroke="rgba(255,255,255,0.3)" fontSize={10} fontFamily="JetBrains Mono" />
                      <YAxis dataKey="subject" type="category" stroke="rgba(255,255,255,0.3)" fontSize={9} fontFamily="JetBrains Mono" width={90} />
                      <Tooltip contentStyle={{ backgroundColor: "#08080d", borderColor: "rgba(139,92,246,0.15)", borderRadius: "8px" }} />
                      <Bar dataKey="Attendance" fill="#a855f7" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="Marks" fill="#6366f1" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Dynamic Alerts Push Box */}
              <div className="glass-card p-6.5 rounded-2xl text-left border-purple-500/10">
                <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Send className="w-4 h-4 text-purple-400" />
                  Push Custom Alert
                </h4>

                <form onSubmit={handleSendAlert} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wide">Target student</label>
                    <select
                      value={selectedStudentForAlert}
                      onChange={(e) => setSelectedStudentForAlert(e.target.value)}
                      className="w-full bg-neutral-900 border border-white/5 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                    >
                      <option value="">Select a student...</option>
                      {students.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.branch})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wide">Warning priority</label>
                    <select
                      value={alertType}
                      onChange={(e) => setAlertType(e.target.value as any)}
                      className="w-full bg-neutral-900 border border-white/5 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                    >
                      <option value="info">Info Accent (Purple)</option>
                      <option value="warning">Warning Escalation (Amber)</option>
                      <option value="badge">Badge/Achievement (Emerald)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wide">Message payload</label>
                    <textarea
                      rows={2}
                      placeholder="Input custom alert content..."
                      value={alertMessage}
                      onChange={(e) => setAlertMessage(e.target.value)}
                      className="w-full bg-neutral-900 border border-white/5 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/50"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/15 cursor-pointer text-center flex items-center justify-center gap-1.5"
                  >
                    <span>Send Alert</span>
                    <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                  </button>
                </form>
              </div>

            </div>

          </div>

          {/* Mentee allocation panels lists row */}
          <div className="space-y-4 text-left">
            <h3 className="text-sm font-semibold text-white font-display">Faculty Mentorship Allocations</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {MENTORS_DATA.map((mnt, idx) => (
                <div key={idx} className="p-4.5 bg-neutral-950 border border-white/5 rounded-2xl space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-xs text-white">{mnt.name}</span>
                    {mnt.activeAlert && (
                      <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-neutral-500 block uppercase font-bold">Mentees assigned ({mnt.mentees.length})</span>
                    <div className="space-y-1.5 max-h-24 overflow-y-auto">
                      {mnt.mentees.map((mntName, mIdx) => (
                        <div key={mIdx} className="text-xs text-neutral-400 flex items-center justify-between bg-white/[0.01] border border-white/5 p-1.5 rounded-md">
                          <span>{mntName}</span>
                          {/* If weak student Aarav is mentee, add active warning */}
                          {mntName === "Aarav Mehta" && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                          {mntName === "Diya Verma" && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Sent Alerts History */}
          <div className="p-6 bg-neutral-950 border border-white/5 rounded-2xl text-left">
            <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest block mb-4">Recent Sent Alerts Audit History</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sentAlerts.map(sa => (
                <div key={sa.id} className="p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-purple-400 font-semibold">{sa.target}</span>
                    <span className="text-[9px] font-mono text-neutral-500">{sa.timestamp}</span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-2 italic leading-relaxed">
                    "{sa.message}"
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>

      {/* DETAILED STUDENT MODAL DRILL DOWN */}
      <AnimatePresence>
        {activeDetailsStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#0a0a10] border border-white/5 p-8 rounded-2xl shadow-2xl glowing-purple text-left relative"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-display font-bold text-xl text-white">{activeDetailsStudent.name}</h3>
                  <span className="text-xs font-mono text-neutral-400 block mt-1">{activeDetailsStudent.email}</span>
                </div>
                <span className="inline-block px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg text-xs font-mono font-bold uppercase text-purple-400 tracking-wider">
                  Score: {activeDetailsStudent.riskScore}
                </span>
              </div>

              {/* Metrics table drilldown stats */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                    <span className="text-[10px] font-mono uppercase text-neutral-500">Overall Attendance</span>
                    <div className="text-lg font-bold text-white mt-1">{activeDetailsStudent.attendance}%</div>
                  </div>
                  <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                    <span className="text-[10px] font-mono uppercase text-neutral-500">Overall Marks Average</span>
                    <div className="text-lg font-bold text-white mt-1">{activeDetailsStudent.marks}%</div>
                  </div>
                </div>

                <div className="p-4 bg-purple-500/5 border border-purple-500/15 rounded-xl space-y-2">
                  <span className="text-[10px] font-mono text-purple-400 block uppercase">Student information logs</span>
                  <div className="text-xs text-neutral-300">Allocated Branch: {activeDetailsStudent.branch}</div>
                  <div className="text-xs text-[#8b5cf6] font-semibold">Active Mentor: {activeDetailsStudent.mentor}</div>
                  <div className="text-xs text-neutral-400 mt-1">Recommended intervention: Standard counseling check-in suite scheduled on dynamic study planner regeneration request.</div>
                </div>

                <div className="pt-4 border-t border-white/5 flex gap-3">
                  <button
                    onClick={() => {
                      setActiveDetailsStudent(null);
                    }}
                    className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl text-center cursor-pointer transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
