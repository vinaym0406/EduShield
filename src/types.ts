export interface Student {
  id: string;
  name: string;
  email: string;
  branch: string;
  semester: string;
  attendance: number;
  marks: number;
  riskScore: number;
  riskLevel: "safe" | "medium" | "high";
  mentor: string;
  avatar?: string;
}

export interface Assignment {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  status: "pending" | "submitted" | "late";
}

export interface SubjectState {
  name: string;
  attendance: number;
  attendanceColor: string;
  marks: number;
  percentage: number;
  aiInsight: string;
}

export interface StudyDay {
  day: string;
  subject: string;
  action: string;
  duration: string;
  completed: boolean;
}

export interface MoodLog {
  day: string;
  mood: "Thriving" | "Good" | "Neutral" | "Struggling" | "Overwhelmed";
  note?: string;
  dateStr: string;
}

export interface AlertNotification {
  id: string;
  type: "marks" | "attendance" | "badge";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}
