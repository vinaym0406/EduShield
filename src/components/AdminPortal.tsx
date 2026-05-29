import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, Landmark, TrendingUp, AlertTriangle, FileText, Download, Users, 
  Settings, Filter, Plus, LogOut, CheckCircle, PieChart, BarChart3, Database 
} from "lucide-react";
import { 
  PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import { DEPARTMENT_STATS } from "../data";

interface AdminPortalProps {
  onLogout: () => void;
}

export default function AdminPortal({ onLogout }: AdminPortalProps) {
  const [reports, setReports] = useState([
    { id: "rp_1", name: "S5 Midterm Risk Assessment Report", created: "2026-05-24", dept: "CSE", status: "compiled" },
    { id: "rp_2", name: "ECE Attendance Rehab Summary", created: "2026-05-22", dept: "ECE", status: "compiled" },
    { id: "rp_3", name: "Institutional Regulatory Audit Logs", created: "2026-05-18", dept: "GLOBAL", status: "downloaded" },
  ]);

  const [activeReportDept, setActiveReportDept] = useState<"ALL" | "CSE" | "ECE" | "GLOBAL">("ALL");

  // Recharts Global Risk Distribution Pie data
  const GLOBAL_RISK_PIE_DATA = [
    { name: "Safe Status (Low Risk)", value: 7, color: "#10b981" },
    { name: "Monitored Status (Medium Risk)", value: 12, color: "#f59e0b" },
    { name: "Critical Status (High Risk)", value: 1, color: "#ef4444" },
  ];

  // Recharts Polar Radar dataset represents compliance vectors
  const RADAR_BRANCH_VECTORS = [
    { vector: "Average Attendance", CSE: 74, ECE: 77, MECH: 75, CIVIL: 78 },
    { vector: "Average Marks", CSE: 65, ECE: 58, MECH: 62, CIVIL: 60 },
    { vector: "Counselor Feedbacks", CSE: 81, ECE: 72, MECH: 84, CIVIL: 89 },
    { vector: "Assignment Submissions", CSE: 89, ECE: 81, MECH: 78, CIVIL: 85 },
    { vector: "Mood Assessments", CSE: 75, ECE: 71, MECH: 68, CIVIL: 80 },
  ];

  // Export dataset function
  const handleJSONExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      institution: "Indian Institute of Science and Tech",
      exportedAt: new Date().toISOString(),
      departmentStats: DEPARTMENT_STATS,
      globalRiskPieDistribution: GLOBAL_RISK_PIE_DATA,
      complianceVectors: RADAR_BRANCH_VECTORS,
    }, null, 2));
    
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "edushield_academic_intelligence_backup.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredReports = reports.filter(r => {
    if (activeReportDept === "ALL") return true;
    return r.dept === activeReportDept;
  });

  return (
    <div className="flex h-screen bg-transparent overflow-hidden">
      
      {/* LEFT SIDEBAR NAVBAR */}
      <aside className="hidden lg:flex flex-col w-64 bg-black/40 backdrop-blur-xl border-r border-white/5 pb-6">
        <div className="px-6 py-6 border-b border-white/5 flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400 glowing-purple">
            <Shield className="w-5 h-5 animate-pulse" />
          </div>
          <span className="font-display font-bold text-lg text-white">EduShield AI</span>
        </div>

        <div className="px-6 py-4">
          <span className="text-[10px] font-mono text-neutral-500 font-semibold tracking-widest uppercase block mb-1">
            Admin Portal
          </span>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-purple-600/10 text-purple-400 border border-purple-500/20">
            <Landmark className="w-4 h-4" />
            Admin Intelligence Overview
          </button>
        </nav>

        {/* Bottom profile login user summary */}
        <div className="px-4 mt-auto pt-4 border-t border-white/5">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 font-display font-semibold text-emerald-300 text-xs flex items-center justify-center">
                A
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-white">Director Rajeev Sen</div>
                <div className="text-[10px] font-mono text-neutral-500">director@edu.in</div>
              </div>
            </div>
            
            <button onClick={onLogout} className="p-1 text-neutral-500 hover:text-white transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ADMIN CONTROL PAGE WORKSPACE */}
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
            Institutional Admin Intelligence Center
          </h2>

          <button onClick={onLogout} className="lg:hidden p-2 px-3.5 rounded-xl bg-neutral-900 border border-white/5 text-xs text-neutral-400 flex items-center gap-2">
            <LogOut className="w-3.5 h-3.5 text-purple-400" />
            Logout
          </button>
        </header>

        {/* WORKSPACE DETAILED REPORT OVERVIEW */}
        <div className="p-6 md:p-8 space-y-8">
          
          <div className="text-left md:flex md:items-center md:justify-between gap-6">
            <div>
              <h3 className="font-display font-bold text-2.5xl text-white">Institutional Performance overview</h3>
              <p className="text-xs text-neutral-400 mt-1">Cross-department metrics, compliance trackers, and database backup catalogs.</p>
            </div>

            <button
              id="export-json-btn"
              onClick={handleJSONExport}
              className="mt-4 md:mt-0 px-4.5 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-white/5 hover:border-purple-500/20 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer shadow-xl"
            >
              <Download className="w-4 h-4 text-purple-400" />
              Export Institution Data as JSON
            </button>
          </div>

          {/* Institutional Counters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl text-left flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-500 block uppercase tracking-wide">Total Branches</span>
                <span className="text-xl font-bold text-white font-display mt-0.5">4 Departments</span>
              </div>
            </div>

            <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl text-left flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-500 block uppercase tracking-wide">Monitored Students</span>
                <span className="text-xl font-bold text-white font-display mt-0.5">20 Students</span>
              </div>
            </div>

            <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl text-left flex items-center gap-4">
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-500 block uppercase tracking-wide">High Critical Status</span>
                <span className="text-xl font-bold text-white font-display mt-0.5">4 Escalations</span>
              </div>
            </div>

            <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl text-left flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-500 block uppercase tracking-wide">Compliance Logs</span>
                <span className="text-xl font-bold text-white font-display mt-0.5">99.9% Uptime</span>
              </div>
            </div>
          </div>

          {/* Department Breakdown Matrix table */}
          <div className="p-5.5 bg-neutral-950 border border-white/5 rounded-2xl text-left">
            <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest block mb-4">
              Institutional Performance Heat Matrix
            </span>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs leading-normal">
                <thead>
                  <tr className="border-b border-white/5 text-neutral-500 font-mono font-bold uppercase tracking-wider text-[10px] pb-3 block sm:table-row">
                    <th className="py-2.5 px-4">Department / Branch</th>
                    <th className="py-2.5 px-4">Students count</th>
                    <th className="py-2.5 px-4">Average Attendance</th>
                    <th className="py-2.5 px-4">Average marks</th>
                    <th className="py-2.5 px-4">Active Critical Risk Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-sans text-neutral-300">
                  {DEPARTMENT_STATS.map((dept, i) => (
                    <tr key={i} className="hover:bg-white/[0.01]">
                      <td className="py-3 px-4 font-bold text-white font-display">{dept.branch}</td>
                      <td className="py-3 px-4 font-mono">{dept.students}</td>
                      <td className="py-3 px-4 font-mono">{dept.avgAttendance}%</td>
                      <td className="py-3 px-4 font-mono">{dept.avgMarks}%</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                          dept.highRisk > 0 ? "bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse" : "bg-emerald-500/10 text-emerald-400"
                        }`}>
                          {dept.highRisk}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Twin Recharts Chart Panels (Radar and Donut representation) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Pie Donut Chart Represents Global Risk parameter */}
            <div className="glass-card p-6 rounded-2xl text-left">
              <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest block mb-6">
                Institutional Risk Distribution Breakdowns
              </span>
              
              <div className="w-full h-64 md:flex items-center">
                <div className="flex-1 h-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Tooltip contentStyle={{ backgroundColor: "#08080d", borderColor: "rgba(139,92,246,0.15)", borderRadius: "8px" }} />
                      <Pie
                        data={GLOBAL_RISK_PIE_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {GLOBAL_RISK_PIE_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>

                <div className="text-left py-4 px-2 space-y-3 shrink-0">
                  {GLOBAL_RISK_PIE_DATA.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2.5 text-xs">
                      <span className="w-3 h-3 rounded-md shrink-0" style={{ backgroundColor: entry.color }} />
                      <span className="text-neutral-300 font-semibold">{entry.name}:</span>
                      <span className="font-mono text-white font-bold">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Polar Radar Chart Represents compliance vectors */}
            <div className="glass-card p-6 rounded-2xl text-left">
              <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest block mb-4">
                Multidimensional Compliance Vectors
              </span>

              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={RADAR_BRANCH_VECTORS}>
                    <PolarGrid stroke="rgba(255,255,255,0.03)" />
                    <PolarAngleAxis dataKey="vector" stroke="rgba(255,255,255,0.4)" fontSize={9} fontFamily="JetBrains Mono" />
                    <PolarRadiusAxis stroke="rgba(255,255,255,0.2)" fontSize={8} />
                    <Radar name="CSE" dataKey="CSE" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
                    <Radar name="ECE" dataKey="ECE" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} />
                    <Legend verticalAlign="bottom" height={24} iconSize={10} style={{ fontSize: "11px" }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Department Grouped Bar Chart representations */}
          <div className="glass-card p-6 rounded-2xl text-left">
            <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest block mb-6">
              Class metrics comparative analysis
            </span>
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DEPARTMENT_STATS} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.01)" />
                  <XAxis dataKey="branch" stroke="rgba(255,255,255,0.3)" fontSize={10} fontFamily="JetBrains Mono" />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} fontFamily="JetBrains Mono" />
                  <Tooltip contentStyle={{ backgroundColor: "#08080d", borderColor: "rgba(139,92,246,0.15)", borderRadius: "8px" }} />
                  <Legend iconSize={10} style={{ fontSize: "11px" }} />
                  <Bar dataKey="avgAttendance" name="Average Attendance %" fill="#a855f7" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="avgMarks" name="Average Marks %" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Report Logs table listing with manual download export triggers */}
          <div className="p-6 bg-neutral-950 border border-white/5 rounded-2xl text-left space-y-4">
            <div className="md:flex md:items-center md:justify-between border-b border-white/5 pb-3">
              <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest block">
                Compliance Reports Audit Ledger
              </span>

              {/* Filtering mechanism */}
              <div className="mt-3 md:mt-0 flex gap-2.5 text-xs font-semibold">
                {(["ALL", "CSE", "ECE", "GLOBAL"] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setActiveReportDept(f)}
                    className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      activeReportDept === f
                        ? "bg-purple-600/10 border-purple-500/30 text-purple-400"
                        : "bg-[#0d0d15] border-white/5 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3.5">
              {filteredReports.map(rp => (
                <div key={rp.id} className="p-4 bg-white/[0.01] border border-white/5 rounded-xl flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 bg-purple-500/5 text-purple-300 border border-purple-500/10 rounded-lg">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white font-display">{rp.name}</div>
                      <div className="text-[10px] text-neutral-500 mt-1 font-mono">Dept: {rp.dept} &bull; Created: {rp.created}</div>
                    </div>
                  </div>

                  <button
                    onClick={handleJSONExport}
                    className="p-2 bg-neutral-900 hover:bg-neutral-800 border border-white/5 hover:border-purple-300/30 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                    title="Download backup"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>

    </div>
  );
}
