import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazily initialize AI to prevent crash if environment variable is missing
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. AI API Endpoint: Explain Student Risk Score
app.post("/api/gemini/explain", async (req, res) => {
  try {
    const { studentName, riskScore, attendance, marksBySubject } = req.body;
    
    // Fallback if API key is not present (or for off-line testing)
    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        isMock: true,
        explanation: `You are tracking in the safe zone, but Computer Networks is the soft spot. Tighten attendance there and you will lock in a comfortable buffer above the threshold.`,
        focusSubject: "Computer Networks",
        actions: [
          "Aim for 90%+ attendance in Computer Networks next week.",
          "Pre-read the next chapter before each Computer Networks class.",
          "Try one full mock test in Computer Networks this weekend."
        ]
      });
    }

    const ai = getAI();
    const prompt = `You are the lead academic analyst at "EduShield AI", a predictive student intelligence platform.
Analyze this student's risk profile and provide highly engaging, motivating, and actionable advice.
Student Name: ${studentName || "Aarav Mehta"}
Academic Risk Score: ${riskScore} (Risk is medium. 0 is safe/excellent, 100 is critical danger of failing or dropping out).
Overall Attendance: ${attendance}%
Subject Marks & Attendance detail: ${JSON.stringify(marksBySubject || {})}

Please identify their *single most critical soft spot* subject (the one causing the most risk due to low marks or low attendance), and return a JSON object with this exact structure:
{
  "explanation": "A highly premium/encouraging 2-3 sentence personalized analysis of their academic risk, identifying their weakest spot.",
  "focusSubject": "Name of the single subject that needs immediate focus",
  "actions": ["Three specific, highly practical, bulleted action items for the upcoming week to improve in that subject"]
}
Compile strictly to the JSON schema. Return only the JSON content with no markdown formatting tags.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const resultText = response.text || "{}";
    const parsed = JSON.parse(resultText.trim());
    res.json({ ...parsed, success: true, isMock: false });
  } catch (error: any) {
    console.error("Error in /api/gemini/explain:", error);
    // Return friendly local fallback in case of rate limits or service disruptions
    res.json({
      success: true,
      isMock: true,
      explanation: `Your risk score is 48.4 (Medium). While Algorithms and Databases are strong, Computer Networks is your current soft spot due to low attendance (54%) and a dip in internal marks. Let's elevate this next week.`,
      focusSubject: "Computer Networks",
      actions: [
        "Attend all Computer Networks lectures to drive attendance above the 65% eligibility line.",
        "Solve practical networking lab assignments with a peer reviewer.",
        "Take a 15-minute diagnostic quiz on IP addressing and routing subnets."
      ]
    });
  }
});

// 2. AI API Endpoint: Smart Weekly Planner Generator
app.post("/api/gemini/generate-plan", async (req, res) => {
  try {
    const { focusSubject, currentWeekProgress } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      // Fallback
      return res.json({
        success: true,
        isMock: true,
        days: [
          { day: "MON", subject: "Computer Networks", action: "Watch chapter recap: Computer Networks", duration: "60m", completed: true },
          { day: "TUE", subject: "Algorithms", action: "Review key concepts: Algorithms complexity", duration: "90m", completed: false },
          { day: "WED", subject: "Operating Systems", action: "Solve practice set: Process Synchronization", duration: "75m", completed: false },
          { day: "THU", subject: "Data Structures", action: "Watch chapter recap: Tree Traversals", duration: "45m", completed: false },
          { day: "FRI", subject: "Databases", action: "Review key concepts: SQL Joins and Normalization", duration: "60m", completed: false },
          { day: "SAT", subject: "Computer Networks", action: "Solve practice set: IP Routing & Subnets", duration: "120m", completed: false },
          { day: "SUN", subject: "Algorithms", action: "Watch chapter recap: Dynamic Programming", duration: "30m", completed: false }
        ]
      });
    }

    const ai = getAI();
    const prompt = `Create a custom, highly optimized daily student study plan (Monday to Sunday) designed to rescue a student whose weakest focus subject is: "${focusSubject || "Computer Networks"}".
Generate exactly 7 days of items (MON, TUE, WED, THU, FRI, SAT, SUN), balancing workload but giving extra attention or complex tasks to the focus subject.
Return ONLY a JSON list with this structure:
{
  "days": [
    {
      "day": "MON", 
      "subject": "Name of Subject (e.g. Computer Networks)",
      "action": "A short, concise, highly descriptive task name like 'Watch chapter recap: Computer Networks'",
      "duration": "Duration like '60m' or '90m'",
      "completed": false
    },
    ...
  ]
}
Return only raw JSON. No markdown backticks.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse((response.text || "{}").trim());
    res.json({ ...parsed, success: true, isMock: false });
  } catch (error: any) {
    console.error("Error generating plan:", error);
    res.json({
      success: true,
      isMock: true,
      days: [
        { day: "MON", subject: "Computer Networks", action: "Watch chapter recap: Computer Networks subnets", duration: "60m", completed: true },
        { day: "TUE", subject: "Algorithms", action: "Review key concepts: Sorting algorithms", duration: "90m", completed: false },
        { day: "WED", subject: "Operating Systems", action: "Solve practice set: Deadlocks", duration: "75m", completed: false },
        { day: "THU", subject: "Data Structures", action: "Watch chapter recap: Graph depth-first search", duration: "45m", completed: false },
        { day: "FRI", subject: "Databases", action: "Review key concepts: Indexing structures", duration: "60m", completed: false },
        { day: "SAT", subject: "Computer Networks", action: "Solve practice set: TCP/IP flow control", duration: "120m", completed: false },
        { day: "SUN", subject: "Algorithms", action: "Watch chapter recap: Red-black tree rotation", duration: "30m", completed: false }
      ]
    });
  }
});

// 3. AI Portal Chat for guidance
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, previousChat } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        reply: "Hello! I am your EduShield AI Copilot. To enable real-time generation, please set up your GEMINI_API_KEY in the Secrets menu. Right now, I can tell you that keeping algorithms and data structures above 80% marks is crucial for your overall academic safety meter!"
      });
    }

    const ai = getAI();
    const prompt = `You are the EduShield AI Counselor, a friendly, ultra-professional and encouraging academic AI assistant. 
A student is asking for advice: "${message}".
Keep the reply concise, professional, beautifully formatted, under 3 short paragraphs, and focus purely on practical academic strategy (attendance, study steps, active memory, spaced repetition).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ success: true, reply: response.text || "I apologize, I wasn't able to compile a reply. Please try again." });
  } catch (error) {
    console.error("Error in AI chat:", error);
    res.json({ success: false, reply: "I'm having a little trouble connecting to my academic intelligence engine right now. Let's recall standard study tips: strive to study in blocks of 45 minutes, check your database notes weekly, and make sure to boost attendance in your lowest subject!" });
  }
});

// Integration with Vite
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EduShield AI Server running on http://localhost:${PORT}`);
  });
}

startServer();
