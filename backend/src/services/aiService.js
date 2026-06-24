import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

// Initialize Gemini if key is present
let geminiClient = null;
if (process.env.GEMINI_API_KEY) {
  try {
    geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('✅ Gemini AI service configured.');
  } catch (err) {
    console.error('Failed to configure Gemini Client:', err.message);
  }
}

// Initialize OpenAI if key is present
let openaiClient = null;
if (process.env.OPENAI_API_KEY) {
  try {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    console.log('✅ OpenAI service configured.');
  } catch (err) {
    console.error('Failed to configure OpenAI Client:', err.message);
  }
}

// Check active AI Provider
export function getActiveAiProvider() {
  if (geminiClient && process.env.GEMINI_API_KEY) return 'gemini';
  if (openaiClient && process.env.OPENAI_API_KEY) return 'openai';
  return 'mock';
}

/**
 * Generate full blog content, LinkedIn post, and Twitter thread.
 */
export async function generateBlog({ title, notes, keyLessons, style }) {
  const provider = getActiveAiProvider();
  console.log(`Generating blog using provider: ${provider} (Style: ${style})`);

  const prompt = `
You are an expert ghostwriter and content strategist. 
Write a high-quality blog post (Medium-ready), a LinkedIn post, and a Twitter/X thread based on these book notes:

Book Title: "${title}"
Writing Style: "${style}" (Use this style: Casual, Professional, or Storytelling)
Notes/Highlights:
${notes}

Key Lessons Learned:
${keyLessons.map(l => `- ${l}`).join('\n')}

Generate the output EXACTLY in JSON format with the following keys. Do not put markdown code fences around the JSON itself. Make sure it is valid JSON.

JSON Structure:
{
  "title": "A catchy, SEO-friendly, clickable title (do not use generic titles)",
  "introduction": "An engaging introduction that hooks the reader and introduces the core theme of the book.",
  "insights": "Detailed breakdown of the core insights, using bullet points or sub-headers where appropriate based on the book notes.",
  "reflections": "Personal reflections and actionable applications of these concepts to real life, career, or business.",
  "conclusion": "A compelling conclusion summarizing the core message and ending with an engaging question for readers.",
  "content": "The complete blog post formatted beautifully in Markdown, including headings (##, ###), blockquotes, lists, and bold text. The markdown content should weave together the introduction, insights, reflections, and conclusion into a cohesive 500-800 word article ready for Medium or Dev.to.",
  "linkedInPost": "An engaging, professional summary post optimized for LinkedIn. Use spaced paragraphs, bullet points, and appropriate hashtags. Keep it inspiring and professional.",
  "twitterThread": [
    "Tweet 1/4: Hook introducing the book and the thread. (under 280 chars)",
    "Tweet 2/4: Core lesson 1. (under 280 chars)",
    "Tweet 3/4: Core lesson 2. (under 280 chars)",
    "Tweet 4/4: Key takeaway & CTA. (under 280 chars)"
  ]
}
`;

  if (provider === 'gemini') {
    return generateWithGemini(prompt);
  } else if (provider === 'openai') {
    return generateWithOpenAI(prompt);
  } else {
    return generateMockBlog({ title, notes, keyLessons, style });
  }
}

/**
 * GEMINI API GENERATOR
 */
async function generateWithGemini(prompt) {
  try {
    const model = geminiClient.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini API call failed, falling back to Mock:', error);
    return generateMockBlog({ title: "API Fallback", notes: "API call failed", keyLessons: [], style: "Casual" });
  }
}

/**
 * OPENAI API GENERATOR
 */
async function generateWithOpenAI(prompt) {
  try {
    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });
    const text = response.choices[0].message.content;
    return JSON.parse(text);
  } catch (error) {
    console.error('OpenAI API call failed, falling back to Mock:', error);
    return generateMockBlog({ title: "API Fallback", notes: "API call failed", keyLessons: [], style: "Casual" });
  }
}

/**
 * DYNAMIC MOCK GENERATOR
 * Generates realistic content based on user inputs when API keys are absent.
 */
function generateMockBlog({ title, notes, keyLessons, style }) {
  console.log('Using Mock Generation for:', title);
  
  // Clean lessons
  const lessonsList = keyLessons && keyLessons.length > 0 
    ? keyLessons 
    : ["Small choices compound over time", "Focus on identity instead of immediate outcomes", "Create friction-free environments for good habits"];

  // Pre-baked templates for famous books to make the demo look incredible
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('habit') || lowerTitle.includes('atomic')) {
    return getAtomicHabitsMock(style);
  } else if (lowerTitle.includes('deep work') || lowerTitle.includes('cal newport')) {
    return getDeepWorkMock(style);
  }

  // General Dynamic Mock
  const finalTitle = style === 'Storytelling' 
    ? `The Day I Started Applying ${title}: A Realistic Journey`
    : style === 'Professional'
      ? `Maximizing Executive Performance: Critical Lessons from "${title}"`
      : `Why You Need to Read "${title}" Right Now`;

  const introText = style === 'Storytelling'
    ? `I used to struggle with productivity until I picked up a copy of "${title}". I remember sitting in my local cafe, scrolling mindlessly, when a passage in this book hit me like a lightning bolt. It wasn't just advice; it was a roadmap.`
    : style === 'Professional'
      ? `In the modern business landscape, efficiency and clarity are paramount. "${title}" provides an excellent analytical framework to optimize workflows and redefine long-term strategic execution.`
      : `Let's be honest: we all want to get better, but most self-help or business advice is fluff. That is why "${title}" is such a breath of fresh air. It bypasses the jargon and gives you immediate tools.`;

  const insightsMarkdown = lessonsList.map((lesson, idx) => `### Insight ${idx + 1}: ${lesson}
This concept changes the game. Often, we focus too much on final results. "${title}" argues that we need to dissect the process itself. If you manage the micro-structures, the macro-results take care of themselves.`).join('\n\n');

  const reflectionText = `Looking at my own daily routine, I realized how much I was leaving to willpower. Willpower is a finite resource. Applying the lessons of "${title}", I started constructing my environments and systems to do the heavy lifting for me.`;
  
  const conclusionText = `At the end of the day, knowledge without action is just entertainment. "${title}" is a book that demands action. Which of these insights resonates most with your current projects? Let's discuss in the comments below!`;

  const fullMarkdown = `# ${finalTitle}

${introText}

---

## The Core Insights from ${title}

${insightsMarkdown}

---

## Personal Reflections & Applications

${reflectionText}

---

## Conclusion & Action Steps

${conclusionText}
`;

  return {
    title: finalTitle,
    introduction: introText,
    insights: lessonsList.map((l, i) => `Insight ${i+1}: ${l}`).join(' | '),
    reflections: reflectionText,
    conclusion: conclusionText,
    content: fullMarkdown,
    linkedInPost: `✍️ Just finished writing a deep dive on "${title}". 

Here are the 3 biggest shifts it caused in my workflow:
${lessonsList.map((l, i) => `${i + 1}️⃣ ${l}`).join('\n')}

Read the full breakdown of my takeaways here 👇
#ReadingList #PersonalGrowth #ContentCreation #BookNotes`,
    twitterThread: [
      `📚 Just finished reading "${title}" and it completely shifted my perspective. \n\nHere are the top lessons that you can apply immediately in your daily workflow: 👇 (1/4)`,
      `💡 Lesson 1: ${lessonsList[0] || 'Create systems, not goals.'}\n\nGoals tell you where you want to go. Systems are the actual processes that get you there. Shift your energy to building the machine. (2/4)`,
      `⚡ Lesson 2: ${lessonsList[1] || 'Identity-based change.'}\n\nTrue behavior change is identity change. You don't build habits to achieve a goal; you build habits to become the *type of person* who achieves that goal. (3/4)`,
      `🔥 Takeaway: Knowledge is only potential power. To make it real, choose ONE lesson from "${title}" and apply it today. \n\nWhat book should I read next? Drop your recs! (4/4)`
    ]
  };
}

// ----------------- Famous Book Templates for High Fidelity Demo -----------------

function getAtomicHabitsMock(style) {
  const isStory = style === 'Storytelling';
  const isProf = style === 'Professional';
  
  const title = isStory 
    ? "The Tiny 1% Changes That Completely Rebuilt My Life" 
    : isProf 
      ? "Systemic Growth: An Executive Summary of Atomic Habits" 
      : "Why Atomic Habits is the Only Productivity Book You Actually Need";

  const intro = isStory
    ? "A few years ago, I was trapped in a cycle of setting massive New Year resolutions and abandoning them by February. I thought I lacked motivation. Then I read James Clear's Atomic Habits, and I realized I didn't need motivation; I needed a system."
    : isProf
      ? "James Clear's 'Atomic Habits' offers a robust framework for organizational growth by optimizing the smallest variables. In a business context, compounding marginal gains represent a sustainable strategy for driving productivity."
      : "Let's face it: habits are hard. We want to read more, work out daily, and drink more water, but life gets in the way. 'Atomic Habits' by James Clear shows us that big goals aren't the answer—tiny 1% daily changes are.";

  const content = `# ${title}

${intro}

## 1. Focus on Systems, Not Goals
Almost every productivity guide tells you to focus on the end goal. Clear flips this on its head: **"You do not rise to the level of your goals. You fall to the level of your systems."** 

If you are a writer, your goal is to write a book. Your system is the writing routine you follow each morning. If you focus solely on the goal, you feel overwhelmed. If you focus on the system, the book writes itself.

> "A goal is a target; a system is a mechanism."

## 2. Identity-Based Habits
Behavior change is divided into three layers: outcomes, processes, and identity. Most people start by focusing on what they want to achieve (outcomes). Instead, start by focusing on *who* you want to become (identity).
- **Outcome-based:** "I want to run a marathon."
- **Identity-based:** "I want to become a runner."

Once you embrace the identity, your habits follow naturally. Every action you take is a vote for the type of person you wish to become.

## 3. Make Good Habits Frictionless
Human nature chooses the path of least resistance. To build good habits, design your environment to make the cues obvious and the execution easy. 
- Want to read more? Put a book on your pillow.
- Want to practice guitar? Place the guitar stand in the center of the living room.

## My Personal Takeaway
I stopped tracking my ultimate weight-loss goals and focused strictly on the identity of "being a healthy person." I started packing my gym bag the night before (reducing friction). The compounding results were dramatic.

## What is your 1%?
What is one tiny habit you can start today that takes less than two minutes? Let me know in the comments!
`;

  return {
    title,
    introduction: intro,
    insights: "Systems over goals | Identity-based habits | Environment design",
    reflections: "Focusing on the identity of a 'writer' rather than word counts helped me stay consistent.",
    conclusion: "Habits compound. Start your 1% change today.",
    content,
    linkedInPost: `🚀 "You do not rise to the level of your goals. You fall to the level of your systems." 

James Clear's Atomic Habits completely transformed how I think about professional growth. Instead of focusing on massive milestones, I've spent the last quarter focus on micro-habits:
1️⃣ Pre-planning my calendar the night before.
2️⃣ Isolating deep work blocks for 90 minutes.
3️⃣ Automating administrative friction.

The compounding effect of these 1% changes has been game-changing. 

What's one tiny system you've implemented that had a disproportionate return? 👇
#AtomicHabits #SystemsThinking #ProfessionalGrowth #Productivity`,
    twitterThread: [
      `🧵 Most people fail their goals because they focus on the outcome, not the system. \n\nHere are 3 key takeaways from James Clear's "Atomic Habits" that will upgrade your productivity: 👇 (1/4)`,
      `1/ Stop setting goals; build systems instead. \n\nWinners and losers have the exact same goals (e.g. win the championship). The differentiator is the system—the daily repeatable processes that make success inevitable. (2/4)`,
      `2/ Change your identity, not your behavior.\n\nDon't say "I am trying to write a blog." Say "I am a writer." Every action is a vote for the identity you want to adopt. Act like the person you want to become. (3/4)`,
      `3/ Design your environment.\n\nMake the cues of good habits obvious (put a book on your pillow) and bad habits invisible (put the phone in another room). Motivation is overrated; environment design rules. \n\nWhat habit are you building? ⬇️ (4/4)`
    ]
  };
}

function getDeepWorkMock(style) {
  const title = style === 'Storytelling'
    ? "How I Reclaimed My Focus in a Distracted World"
    : style === 'Professional'
      ? "Deep Work: Core Frameworks for Cognitive Focus and Output"
      : "The Ultimate Guide to Cal Newport's Deep Work";

  const intro = "In an age of constant Slack notifications, endless emails, and social media feeds, the ability to focus intensely is becoming a rare superpower. Cal Newport's Deep Work explains why focus is the key to extraordinary output.";

  const content = `# ${title}

${intro}

## The Difference Between Deep and Shallow Work
Newport divides all work into two categories:
1. **Deep Work:** Professional activities performed in a state of distraction-free concentration that push your cognitive capabilities to their limit. These efforts create new value, improve your skill, and are hard to replicate.
2. **Shallow Work:** Non-cognitively demanding, logistical-style tasks, often performed while distracted. These efforts tend not to create much new value in the world and are easy to replicate.

If you spend your entire day responding to emails and attending status meetings, you are doing shallow work. You will remain replaceable.

## The Rule of Focus: Attention Residue
When you switch from Task A to Task B, your attention doesn't immediately follow. A portion of your cognitive capacity remains stuck on Task A. Newport calls this **Attention Residue**. 
If you check your email every 10 minutes, you are working in a constant state of attention residue, reducing your effective IQ.

> "To produce at your peak level you need to work for extended periods with full concentration on a single task."

## Strategies to Implement Deep Work
- **The Bimodal Approach:** Divide your time between deep blocks (e.g., a weekend retreat or two dedicated deep days a week) and shallow blocks.
- **The Rhythmic Approach:** Build a daily habit of deep work at the same time every day (e.g., 8:00 AM to 10:00 AM).
- **The Shutdown Ritual:** Create a strict end-of-day routine to completely detach from work, allowing your brain to recharge.

## Conclusion
Deep work is not easy. It requires training your brain like a muscle. But the professionals who can master focus will rule the future.
`;

  return {
    title,
    introduction: intro,
    insights: "Deep vs Shallow work | Attention residue | Ritualizing focus",
    reflections: "Implementing a 2-hour morning deep work block doubled my coding output.",
    conclusion: "Train your brain to resist distraction. Focus is a superpower.",
    content,
    linkedInPost: `🧠 In a distracted world, focus is a competitive superpower. 

Cal Newport's "Deep Work" argues that the ability to concentrate deeply is becoming increasingly valuable, yet increasingly rare. 

Are we spending too much time on "shallow work" (emails, chats, meetings) just to look busy? 

Here's how I restructured my schedule:
🛡️ Blocked 8 AM - 10 AM daily for distraction-free coding/writing.
📴 Closed all messaging apps during deep blocks.
🌅 Set a strict shutdown ritual at 6 PM.

The quality of my output has soared, and my burnout has plummeted. 

How do you protect your focus during the workday? 👇
#DeepWork #Focus #Productivity #MentalPerformance`,
    twitterThread: [
      `🧵 Constant multitasking is killing your cognitive capacity. \n\nHere's a breakdown of Cal Newport's "Deep Work" and how to reclaim your focus: 👇 (1/4)`,
      `1/ The Concept of "Attention Residue". \n\nWhen you switch from writing code to checking Slack, your brain doesn't switch instantly. A portion of your focus remains stuck on the message. Constant checking keeps you in a state of cognitive deficit. (2/4)`,
      `2/ Deep vs. Shallow Work. \n\nDeep work: Distraction-free, pushes cognitive limits, creates new value. \nShallow work: Logistical, easy to replicate, done while distracted (e.g. emails). \n\nShallow work keeps you employed. Deep work gets you promoted. (3/4)`,
      `3/ How to start: \n- Establish a rhythmic habit (same time every day).\n- Build a shutdown ritual to let your brain rest.\n- Treat focus like a muscle: practice boredom without checking your phone. \n\nFocus deep, win big. 🧠 (4/4)`
    ]
  };
}
