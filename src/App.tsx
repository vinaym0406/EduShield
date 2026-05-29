import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";
import StudentPortal from "./components/StudentPortal";
import FacultyPortal from "./components/FacultyPortal";
import AdminPortal from "./components/AdminPortal";

type AppView = "landing" | "auth" | "student" | "faculty" | "admin";

export default function App() {
  const [view, setView] = useState<AppView>("landing");
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: "student" | "faculty" | "admin";
  } | null>(null);

  // Auto scroll to top on screen changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  // Handle successful login
  const handleLoginSuccess = (
    role: "student" | "faculty" | "admin",
    name: string,
    email: string
  ) => {
    setCurrentUser({ name, email, role });
    // Navigate immediately to appropriate portal view
    if (role === "student") {
      setView("student");
    } else if (role === "faculty") {
      setView("faculty");
    } else {
      setView("admin");
    }
  };

  // Handle logout trigger
  const handleLogout = () => {
    setCurrentUser(null);
    setView("landing");
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white overflow-x-hidden relative selection:bg-purple-600/30 selection:text-purple-300">
      
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-900/20 rounded-full blur-[100px]" />
      </div>

      {/* Dynamic Slide Transitions with AnimatePresence */}
      <div className="relative z-10 w-full min-h-screen">
        <AnimatePresence mode="wait">
          
          {view === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <LandingPage onNavigate={(target) => setView(target)} />
            </motion.div>
          )}

          {view === "auth" && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <AuthPage 
                onBack={() => setView("landing")} 
                onLogin={handleLoginSuccess} 
              />
            </motion.div>
          )}

          {view === "student" && (
            <motion.div
              key="student"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <StudentPortal onLogout={handleLogout} />
            </motion.div>
          )}

          {view === "faculty" && (
            <motion.div
              key="faculty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <FacultyPortal onLogout={handleLogout} />
            </motion.div>
          )}

          {view === "admin" && (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <AdminPortal onLogout={handleLogout} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
