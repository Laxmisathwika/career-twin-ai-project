import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// ----------------------------------------------------
// Authentication & Database Models (In-Memory with Scrypt)
// ----------------------------------------------------

interface AuthCredential {
  id: string; // unique user ID
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
}

interface StudentProfile {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  rollNumber: string;
  college: string;
  department: string;
  academicYear: string;
  semester: string;
  cgpa: number;
  bio: string;
  targetRole: string;
  skills: string[];
  interests: string[];
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface Session {
  token: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
}

// Stores
const authCredentialsStore = new Map<string, AuthCredential>(); // keyed by email.toLowerCase()
const studentProfilesStore = new Map<string, StudentProfile>(); // keyed by userId
const sessionsStore = new Map<string, Session>(); // keyed by token

// Password hashing helper using scrypt
function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

// Seed default verified student account for Arjun Vardhan
const defaultSalt = 'vits_csm_salt_2026';
const defaultUserId = 'vits-csm-2026-001';
const defaultEmail = 'student.csm26@vignanits.ac.in';

authCredentialsStore.set(defaultEmail.toLowerCase(), {
  id: defaultUserId,
  email: defaultEmail,
  passwordHash: hashPassword('Vignan@2026', defaultSalt),
  salt: defaultSalt,
  createdAt: '2026-01-15T09:00:00Z',
});

studentProfilesStore.set(defaultUserId, {
  id: defaultUserId,
  userId: defaultUserId,
  email: defaultEmail,
  fullName: 'Arjun Vardhan',
  rollNumber: '23891A6601',
  college: 'Vignan Institute of Technology and Science, Deshmukhi',
  department: 'CSM (Computer Science & Machine Learning)',
  academicYear: '2026–2027',
  semester: 'VI Semester (3rd Year)',
  cgpa: 8.74,
  bio: 'Passionate 3rd-year CSM student aspiring to build AI-driven products and scalable distributed systems. Actively preparing for campus placements.',
  targetRole: 'AI & Machine Learning Engineer',
  skills: ['Python', 'PyTorch', 'TypeScript', 'React', 'FastAPI', 'PostgreSQL', 'Docker'],
  interests: ['Generative AI', 'Computer Vision', 'Full Stack Web Systems'],
  githubUrl: 'https://github.com/arjun-vits-csm',
  linkedinUrl: 'https://linkedin.com/in/arjun-vardhan-csm',
  portfolioUrl: 'https://arjunvardhan.dev',
  createdAt: '2026-01-15T09:00:00Z',
  updatedAt: '2026-01-15T09:00:00Z',
});

// Helper to authenticate request
function getAuthenticatedUser(req: express.Request): StudentProfile | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7).trim();
  const session = sessionsStore.get(token);
  if (!session) {
    return null;
  }
  if (Date.now() > session.expiresAt) {
    sessionsStore.delete(token);
    return null;
  }
  const profile = studentProfilesStore.get(session.userId);
  return profile || null;
}

// ----------------------------------------------------
// Authentication REST Endpoints
// ----------------------------------------------------

// Auth Config status
app.get('/api/auth/config', (req, res) => {
  res.json({
    status: 'configured',
    provider: 'Secure Scrypt Password Engine',
    supabaseConfigured: Boolean(process.env.SUPABASE_URL),
    info: 'Server enforces scrypt hashing with per-user salt. User profiles are stored separately from credentials.',
    notes: 'To attach external Supabase Auth, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
  });
});

// Register endpoint
app.post('/api/auth/register', (req, res) => {
  const {
    fullName,
    email,
    password,
    rollNumber,
    college,
    department,
    semester,
    cgpa,
    targetRole,
    skills,
    interests,
  } = req.body;

  // Validation
  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
    return res.status(400).json({ error: 'Full Name must be at least 2 characters long.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Check duplicate email early
  if (authCredentialsStore.has(normalizedEmail)) {
    return res.status(409).json({
      error: 'An account with this email address already exists. Please log in instead.',
    });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  if (!hasLetter || !hasNumber) {
    return res.status(400).json({
      error: 'Password must contain at least one letter and one number.',
    });
  }

  if (!rollNumber || typeof rollNumber !== 'string' || rollNumber.trim().length < 3) {
    return res.status(400).json({ error: 'Please provide a valid college roll number.' });
  }

  const parsedCgpa = (cgpa !== undefined && cgpa !== null && cgpa !== '')
    ? (typeof cgpa === 'number' ? cgpa : parseFloat(cgpa))
    : 8.00;
  if (isNaN(parsedCgpa) || parsedCgpa < 0 || parsedCgpa > 10) {
    return res.status(400).json({ error: 'CGPA must be a number between 0.00 and 10.00.' });
  }

  // Create new credentials with cryptographically secure salt
  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);
  const userId = 'usr_' + crypto.randomUUID();

  const authRecord: AuthCredential = {
    id: userId,
    email: normalizedEmail,
    passwordHash,
    salt,
    createdAt: new Date().toISOString(),
  };

  const profileRecord: StudentProfile = {
    id: userId,
    userId: userId,
    email: normalizedEmail,
    fullName: fullName.trim(),
    rollNumber: rollNumber.trim().toUpperCase(),
    college: college?.trim() || 'Vignan Institute of Technology and Science, Deshmukhi',
    department: department?.trim() || 'CSM (Computer Science & Machine Learning)',
    academicYear: '2026–2027',
    semester: semester?.trim() || 'VI Semester (3rd Year)',
    cgpa: Number(parsedCgpa.toFixed(2)),
    bio: `Passionate ${department || 'CSM'} engineering student at VITS preparing for 2026–2027 placements.`,
    targetRole: targetRole?.trim() || 'AI & Machine Learning Engineer',
    skills: Array.isArray(skills) ? skills : ['Python', 'Data Structures', 'SQL'],
    interests: Array.isArray(interests) ? interests : ['Software Engineering', 'Artificial Intelligence'],
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Persist records separately
  authCredentialsStore.set(normalizedEmail, authRecord);
  studentProfilesStore.set(userId, profileRecord);

  // Generate session token (valid 7 days)
  const sessionToken = 'tok_' + crypto.randomBytes(32).toString('hex');
  sessionsStore.set(sessionToken, {
    token: sessionToken,
    userId: userId,
    createdAt: Date.now(),
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(201).json({
    success: true,
    message: 'Student account created successfully.',
    token: sessionToken,
    user: profileRecord,
  });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const authRecord = authCredentialsStore.get(normalizedEmail);

  if (!authRecord) {
    return res.status(401).json({ error: 'Invalid email or password. Please check your credentials.' });
  }

  const checkHash = hashPassword(password, authRecord.salt);
  if (checkHash !== authRecord.passwordHash) {
    return res.status(401).json({ error: 'Invalid email or password. Please check your credentials.' });
  }

  const profile = studentProfilesStore.get(authRecord.id);
  if (!profile) {
    return res.status(500).json({ error: 'User profile record not found.' });
  }

  const sessionToken = 'tok_' + crypto.randomBytes(32).toString('hex');
  sessionsStore.set(sessionToken, {
    token: sessionToken,
    userId: authRecord.id,
    createdAt: Date.now(),
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });

  return res.json({
    success: true,
    message: 'Login successful.',
    token: sessionToken,
    user: profile,
  });
});

// Get currently authenticated user
app.get('/api/auth/me', (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized or session expired.' });
  }
  res.json({ user });
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    sessionsStore.delete(token);
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

// Update Profile endpoint
app.put('/api/auth/profile', (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
  }

  const {
    fullName,
    rollNumber,
    college,
    department,
    semester,
    cgpa,
    bio,
    targetRole,
    skills,
    interests,
    githubUrl,
    linkedinUrl,
    portfolioUrl,
  } = req.body;

  if (fullName !== undefined) {
    if (typeof fullName !== 'string' || fullName.trim().length < 2) {
      return res.status(400).json({ error: 'Full Name must be at least 2 characters long.' });
    }
    user.fullName = fullName.trim();
  }

  if (rollNumber !== undefined) {
    user.rollNumber = String(rollNumber).trim().toUpperCase();
  }

  if (college !== undefined) user.college = String(college).trim();
  if (department !== undefined) user.department = String(department).trim();
  if (semester !== undefined) user.semester = String(semester).trim();

  if (cgpa !== undefined) {
    const parsedCgpa = typeof cgpa === 'number' ? cgpa : parseFloat(cgpa);
    if (isNaN(parsedCgpa) || parsedCgpa < 0 || parsedCgpa > 10) {
      return res.status(400).json({ error: 'CGPA must be a number between 0.00 and 10.00.' });
    }
    user.cgpa = Number(parsedCgpa.toFixed(2));
  }

  if (bio !== undefined) user.bio = String(bio).trim();
  if (targetRole !== undefined) user.targetRole = String(targetRole).trim();

  if (skills !== undefined) {
    user.skills = Array.isArray(skills)
      ? skills
      : String(skills).split(',').map((s) => s.trim()).filter(Boolean);
  }

  if (interests !== undefined) {
    user.interests = Array.isArray(interests)
      ? interests
      : String(interests).split(',').map((s) => s.trim()).filter(Boolean);
  }

  if (githubUrl !== undefined) user.githubUrl = String(githubUrl).trim();
  if (linkedinUrl !== undefined) user.linkedinUrl = String(linkedinUrl).trim();
  if (portfolioUrl !== undefined) user.portfolioUrl = String(portfolioUrl).trim();

  user.updatedAt = new Date().toISOString();
  studentProfilesStore.set(user.userId, user);

  res.json({
    success: true,
    message: 'Profile updated successfully.',
    user,
  });
});

// ----------------------------------------------------
// AI Integration Endpoints
// ----------------------------------------------------

const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    aiConfigured: Boolean(aiClient),
    authConfigured: true,
    institution: 'Vignan Institute of Technology and Science, Deshmukhi',
    department: 'CSM (Computer Science & Machine Learning)',
    academicYear: '2026–2027',
    serverTime: new Date().toISOString(),
  });
});

// AI Chatbot endpoint
app.post('/api/chat', async (req, res) => {
  const { message, history, context } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (!aiClient) {
    return res.status(503).json({
      error: 'Gemini API key is not configured on the server.',
      mode: 'demo_required',
      message: 'Server-side Gemini API is unavailable. Using verified local career knowledge base.',
    });
  }

  try {
    const systemPrompt = `You are "Career Twin AI", the personalized career mentor and career counselor for college students at Vignan Institute of Technology and Science, Deshmukhi (CSM Department, 2026-2027).
Your goal is to guide students in tech careers (AI/ML, Software Development, Cloud/DevOps, Data Science, Cybersecurity, Product Management, etc.).
Student Context: ${JSON.stringify(context || {})}
Guidelines:
- Give concrete, actionable advice with specific technical skills, project ideas, portfolio tips, and resume keywords.
- Structure answers with clear bullet points and bold highlights.
- Keep the tone encouraging, realistic, and mentor-like.
- Never invent fake company placement guarantees; focus on skill mastery and authentic interview prep.`;

    const contents = [];
    if (Array.isArray(history)) {
      for (const item of history.slice(-6)) {
        contents.push({
          role: item.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: item.content || '' }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    const replyText = response.text || 'I apologize, but I could not formulate a response. Please try again.';
    res.json({ reply: replyText, isLiveAI: true });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate response from Gemini API',
      isLiveAI: false,
    });
  }
});

// AI Interview Practice Evaluator endpoint
app.post('/api/interview/feedback', async (req, res) => {
  const { role, question, answer, difficulty } = req.body;
  if (!question || !answer) {
    return res.status(400).json({ error: 'Question and student answer are required' });
  }

  if (!aiClient) {
    return res.status(503).json({
      error: 'Gemini API key not configured',
      mode: 'demo_required',
    });
  }

  try {
    const prompt = `Evaluate the student's interview response for the role of "${role || 'Software Engineer'}" (${difficulty || 'Intermediate'} level).
Question: "${question}"
Student's Answer: "${answer}"

Provide a thorough, constructive assessment in JSON format with:
- scoreOverall (0-100)
- scores: { relevance: 0-100, clarity: 0-100, completeness: 0-100, technicalDepth: 0-100 }
- strengths: array of 2-3 specific things the candidate did well
- areasForImprovement: array of 2-3 concrete ways to elevate the answer
- sampleAnswer: A polished, high-scoring benchmark answer (STAR technique or structured approach)
- followUpQuestion: A smart follow-up question the interviewer might ask next

Return ONLY valid JSON.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const jsonText = response.text?.trim() || '{}';
    const parsed = JSON.parse(jsonText);
    res.json({ feedback: parsed, isLiveAI: true });
  } catch (error: any) {
    console.error('Gemini interview feedback error:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate interview feedback',
      isLiveAI: false,
    });
  }
});

// AI Career Assessment Evaluator endpoint
app.post('/api/career/assess', async (req, res) => {
  const { answers, studentProfile, dimensions } = req.body;

  if (!aiClient) {
    return res.status(503).json({
      error: 'Gemini API key not configured',
      mode: 'demo_required',
    });
  }

  try {
    const prompt = `You are the lead career guidance expert at Vignan Institute of Technology & Science, CSM Department.
Analyze the following student assessment answers and profile to generate personalized career recommendations.

Student Profile: ${JSON.stringify(studentProfile || {})}
Assessment Responses: ${JSON.stringify(answers || {})}
Calculated Dimension Scores: ${JSON.stringify(dimensions || {})}

Return a valid JSON object with:
- topRecommendations: Array of 3-4 recommended career paths. Each item should have:
  - id: unique string slug (e.g. "ai-ml-engineer", "fullstack-developer")
  - title: job title (e.g. "Machine Learning Engineer")
  - matchScore: integer between 65 and 98 based on alignment with the student's actual responses
  - rationale: 2-3 sentences explaining why this matches their specific answers
  - requiredSkills: array of 5 key skills
  - typicalResponsibilities: array of 3 daily responsibilities
  - startingSalaryRange: realistic fresher/entry-level compensation package (e.g. "₹6,00,000 - ₹12,00,000 / year")
  - immediateNextSteps: array of 3 actionable steps for the next 30 days
- personalitySummary: 2 sentences on the student's cognitive and problem-solving profile
- recommendedFocusElectives: 3 recommended university subjects/tracks (e.g. "Deep Learning & NLP", "Cloud Computing")

Return ONLY valid JSON.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.5,
      },
    });

    const jsonText = response.text?.trim() || '{}';
    const parsed = JSON.parse(jsonText);
    res.json({ result: parsed, isLiveAI: true });
  } catch (error: any) {
    console.error('Career assess error:', error);
    res.status(500).json({
      error: error.message || 'Failed to analyze career assessment',
      isLiveAI: false,
    });
  }
});

// AI Resume Bullet Improver
app.post('/api/resume/improve', async (req, res) => {
  const { bulletPoint, targetRole } = req.body;
  if (!bulletPoint) {
    return res.status(400).json({ error: 'bulletPoint is required' });
  }

  if (!aiClient) {
    return res.status(503).json({
      error: 'Gemini API key not configured',
      mode: 'demo_required',
    });
  }

  try {
    const prompt = `Rewrite this student resume bullet point to make it high-impact, action-driven, and ATS-friendly for a "${targetRole || 'Software Engineer'}" role.
Original Bullet: "${bulletPoint}"

Rules:
- Start with a strong action verb (Architected, Engineered, Streamlined, Spearheaded, Built, Optimized).
- Include quantified impact or realistic metric placeholders (e.g., "[X]% latency reduction", "[Y] active users").
- NEVER fabricate false qualifications; only enhance phrasing and impact.

Return JSON:
{
  "improvedBullets": [3 variations from direct to metrics-focused],
  "keywordsAdded": ["keyword1", "keyword2"],
  "tips": "Quick advice on how to verify numbers"
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    res.json({ result: parsed, isLiveAI: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Setup Vite or static serving
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Career Twin AI server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Error starting server:', err);
});
