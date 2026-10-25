import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google Gen AI client on the server if key is present
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
  const { answers, studentProfile } = req.body;

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

Return a valid JSON object with:
- topRecommendations: Array of 3-4 recommended career paths. Each item should have:
  - id: unique string slug (e.g. "ai-ml-engineer", "fullstack-developer")
  - title: job title (e.g. "Machine Learning Engineer")
  - matchScore: integer between 65 and 98 based on alignment
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
