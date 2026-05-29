import { Student, Assignment, SubjectState, StudyDay, MoodLog, AlertNotification } from "./types";

export const DEFAULT_STUDENT: Student = {
  id: "aarav_mehta",
  name: "Aarav Mehta",
  email: "aarav.mehta@edu.in",
  branch: "CSE",
  semester: "S5",
  attendance: 56,
  marks: 42,
  riskScore: 48.4,
  riskLevel: "medium",
  mentor: "Prof. Anil Kumar",
};

export const MONITORED_STUDENTS: Student[] = [
  {
    id: "diya_verma",
    name: "Diya Verma",
    email: "diya.verma@edu.in",
    branch: "ECE",
    semester: "S5",
    attendance: 51,
    marks: 36,
    riskScore: 37.3, // note: high risk in screenshot: "37.3 - high"
    riskLevel: "high",
    mentor: "Dr. Meena Iyer",
  },
  {
    id: "vihaan_kapoor",
    name: "Vihaan Kapoor",
    email: "vihaan.kapoor@edu.in",
    branch: "CSE",
    semester: "S7",
    attendance: 58,
    marks: 33,
    riskScore: 42.1,
    riskLevel: "medium",
    mentor: "Prof. Anil Kumar",
  },
  {
    id: "kabir_singh",
    name: "Kabir Singh",
    email: "kabir.singh@edu.in",
    branch: "MECH",
    semester: "S5",
    attendance: 55,
    marks: 40,
    riskScore: 43.4,
    riskLevel: "medium",
    mentor: "Prof. Ravi Shankar",
  },
  {
    id: "ananya_reddy",
    name: "Ananya Reddy",
    email: "ananya.reddy@edu.in",
    branch: "CIVIL",
    semester: "S5",
    attendance: 54,
    marks: 34,
    riskScore: 45.1,
    riskLevel: "medium",
    mentor: "Dr. Sunita Rao",
  },
  {
    id: "aarav_mehta",
    name: "Aarav Mehta",
    email: "aarav.mehta@edu.in",
    branch: "CSE",
    semester: "S5",
    attendance: 56,
    marks: 42,
    riskScore: 48.4,
    riskLevel: "medium",
    mentor: "Prof. Anil Kumar",
  },
  {
    id: "rohan_joshi",
    name: "Rohan Joshi",
    email: "rohan.joshi@edu.in",
    branch: "MECH",
    semester: "S5",
    attendance: 76,
    marks: 56,
    riskScore: 59.0,
    riskLevel: "medium",
    mentor: "Prof. Ravi Shankar",
  },
  {
    id: "meera_pillai",
    name: "Meera Pillai",
    email: "meera.pillai@edu.in",
    branch: "CSE",
    semester: "S7",
    attendance: 75,
    marks: 57,
    riskScore: 62.5,
    riskLevel: "medium",
    mentor: "Prof. Vikram Joshi",
  },
];

export const MENTORS_DATA = [
  {
    name: "Prof. Anil Kumar",
    mentees: ["Aarav Mehta", "Vihaan Kapoor", "Isha Patel"],
    activeAlert: false,
  },
  {
    name: "Dr. Meena Iyer",
    mentees: ["Diya Verma", "Arjun Nair", "Priya Khanna"],
    activeAlert: true,
  },
  {
    name: "Prof. Ravi Shankar",
    mentees: ["Kabir Singh", "Rohan Joshi", "Karthik Rao"],
    activeAlert: false,
  },
  {
    name: "Dr. Sunita Rao",
    mentees: ["Ananya Reddy", "Aditya Desai", "Zara Khan"],
    activeAlert: false,
  },
  {
    name: "Prof. Vikram Joshi",
    mentees: ["Sara Iyer", "Meera Pillai", "Nikhil Bansal"],
    activeAlert: true,
  },
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  { id: "a1", subject: "Data Structures", title: "Data Structures Assignment 1", dueDate: "Apr 29", status: "pending" },
  { id: "a2", subject: "Algorithms", title: "Algorithms Assignment 2", dueDate: "Apr 28", status: "submitted" },
  { id: "a3", subject: "Databases", title: "Databases Assignment 3", dueDate: "Apr 30", status: "late" },
  { id: "a4", subject: "Operating Systems", title: "Operating Systems Assignment 4", dueDate: "Apr 26", status: "submitted" },
  { id: "a5", subject: "Computer Networks", title: "Computer Networks Assignment 5", dueDate: "Apr 25", status: "late" },
  { id: "a6", subject: "Data Structures", title: "Data Structures Assignment 6", dueDate: "Apr 24", status: "submitted" },
  { id: "a7", subject: "Algorithms", title: "Algorithms Assignment 7", dueDate: "Apr 23", status: "submitted" },
  { id: "a8", subject: "Databases", title: "Databases Assignment 8", dueDate: "Apr 22", status: "late" },
];

export const INITIAL_SUBJECTS: SubjectState[] = [
  {
    name: "Data Structures",
    attendance: 55.9,
    attendanceColor: "bg-red-500",
    marks: 46,
    percentage: 46,
    aiInsight: "Unresolved homework sets are keeping conceptual scores down. Spend time debugging Tree implementations.",
  },
  {
    name: "Algorithms",
    attendance: 51.8,
    attendanceColor: "bg-red-500",
    marks: 41,
    percentage: 41,
    aiInsight: "Subconscious block on Big-O calculation is stalling exams. Needs active visual tracing sessions.",
  },
  {
    name: "Databases",
    attendance: 64.1,
    attendanceColor: "bg-amber-500",
    marks: 43,
    percentage: 43,
    aiInsight: "Intermediate score decay due to failing subqueries assignments. Practice nested queries with mock datasets.",
  },
  {
    name: "Operating Systems",
    attendance: 71.3,
    attendanceColor: "bg-emerald-500",
    marks: 50,
    percentage: 50,
    aiInsight: "Above safe threshold but Process Synchronization challenges linger. Schedule a quick group study session.",
  },
  {
    name: "Computer Networks",
    attendance: 54.0,
    attendanceColor: "bg-red-500",
    marks: 32,
    percentage: 32,
    aiInsight: "Critical sub-60% attendance causing system-level danger. Immediate attendance rehabilitation plan advised.",
  },
];

export const INITIAL_STUDY_PLAN: StudyDay[] = [
  { day: "MON", subject: "Computer Network", action: "Watch chapter recap: Computer Networks", duration: "60m", completed: true },
  { day: "TUE", subject: "Algorithms", action: "Review key concepts: Algorithms Complexity", duration: "90m", completed: false },
  { day: "WED", subject: "Operating Systems", action: "Solve practice set: Operating Systems Deadlocks", duration: "75m", completed: false },
  { day: "THU", subject: "Data Structures", action: "Watch chapter recap: Data Structures Trees", duration: "45m", completed: false },
  { day: "FRI", subject: "Databases", action: "Review key concepts: Databases Indexes", duration: "60m", completed: false },
  { day: "SAT", subject: "Computer Network", action: "Solve practice set: Computer Networks Routing", duration: "120m", completed: false },
  { day: "SUN", subject: "Algorithms", action: "Watch chapter recap: Algorithms Recursion", duration: "30m", completed: false },
];

export const LEADERBOARD_STUDENTS = [
  { rank: 1, name: "Student A", attendance: 91.9, marks: 82.2, score: 86.2, isCurrentUser: false },
  { rank: 2, name: "Student B", attendance: 76.5, marks: 60.8, score: 68.0, isCurrentUser: false },
  { rank: 3, name: "Student C", attendance: 74.8, marks: 59.0, score: 63.0, isCurrentUser: false },
  { rank: 4, name: "Student D (You)", attendance: 55.9, marks: 42.0, score: 48.4, isCurrentUser: true },
];

export const INITIAL_MOOD_HISTORY: MoodLog[] = [
  { day: "Thu 16 Apr", mood: "Overwhelmed", dateStr: "16/04/2026" },
  { day: "Sat 18 Apr", mood: "Neutral", dateStr: "18/04/2026" },
  { day: "Mon 20 Apr", mood: "Overwhelmed", dateStr: "20/04/2026" },
  { day: "Wed 22 Apr", mood: "Neutral", dateStr: "22/04/2026" },
  { day: "Fri 24 Apr", mood: "Overwhelmed", dateStr: "24/04/2026", note: "Overwhelmed with networking concepts." },
  { day: "Sun 26 Apr", mood: "Neutral", dateStr: "26/04/2026" },
  { day: "Tue 28 Apr", mood: "Overwhelmed", dateStr: "28/04/2026" },
  { day: "Thu 30 Apr", mood: "Good", dateStr: "30/04/2026" },
];

export const RECENT_ALERTS: AlertNotification[] = [
  {
    id: "al_1",
    type: "marks",
    title: "Marks Drop Alert",
    message: "Internal marks slipped in 2+ subjects this cycle.",
    timestamp: "27/04/2026",
    read: false,
  },
  {
    id: "al_2",
    type: "attendance",
    title: "Attendance Slippage Warnings",
    message: "Attendance has dropped below the 65% safety line — eligibility is at risk.",
    timestamp: "25/04/2026",
    read: false,
  },
];

// Recharts Performance Trend Mock Data
export const RECHARTS_TREND_DATA = [
  { week: "W1", Attendance: 65, Marks: 45 },
  { week: "W2", Attendance: 60, Marks: 38 },
  { week: "W3", Attendance: 62, Marks: 41 },
  { week: "W4", Attendance: 63, Marks: 39 },
  { week: "W5", Attendance: 61, Marks: 37 },
  { week: "W6", Attendance: 59, Marks: 36 },
  { week: "W7", Attendance: 57, Marks: 35 },
  { week: "W8", Attendance: 56, Marks: 42 },
];

// Department statistics for Admin view
export const DEPARTMENT_STATS = [
  { branch: "CSE", students: 7, highRisk: 0, avgAttendance: 74, avgMarks: 65 },
  { branch: "ECE", students: 5, highRisk: 1, avgAttendance: 77, avgMarks: 58 },
  { branch: "MECH", students: 4, highRisk: 0, avgAttendance: 75, avgMarks: 62 },
  { branch: "CIVIL", students: 4, highRisk: 0, avgAttendance: 78, avgMarks: 60 },
];
