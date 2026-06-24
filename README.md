<img width="667" height="699" alt="download" src="https://github.com/user-attachments/assets/dd37d153-f5d0-49f3-a863-5e5e28c6e0f8" />
# Book-to-Blog AI Converter & Reading Journey 📖✍️

A premium full-stack application designed to transform raw book notes, highlights, and lessons into well-structured, Medium-ready blog posts, LinkedIn cards, and Twitter/X threads using AI, while tracking reading growth along an interactive visual timeline.
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 667.4830000000001 699.29" width="667.4830000000001" height="699.29" style="--bg:#1F1F1F;--fg:#CCCCCC;--line:#CCCCCC;--accent:#0078D4;--muted:#CCCCCCCC;--surface:#181818;--border:#CCCCCC;background:var(--bg)">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap');
  text { font-family: 'Inter', system-ui, sans-serif; }
  svg {
    /* Derived from --bg and --fg (overridable via --line, --accent, etc.) */
    --_text:          var(--fg);
    --_text-sec:      var(--muted, color-mix(in srgb, var(--fg) 60%, var(--bg)));
    --_text-muted:    var(--muted, color-mix(in srgb, var(--fg) 40%, var(--bg)));
    --_text-faint:    color-mix(in srgb, var(--fg) 25%, var(--bg));
    --_line:          var(--line, color-mix(in srgb, var(--fg) 50%, var(--bg)));
    --_arrow:         var(--accent, color-mix(in srgb, var(--fg) 85%, var(--bg)));
    --_node-fill:     var(--surface, color-mix(in srgb, var(--fg) 3%, var(--bg)));
    --_node-stroke:   var(--border, color-mix(in srgb, var(--fg) 20%, var(--bg)));
    --_group-fill:    var(--bg);
    --_group-hdr:     color-mix(in srgb, var(--fg) 5%, var(--bg));
    --_inner-stroke:  color-mix(in srgb, var(--fg) 12%, var(--bg));
    --_key-badge:     color-mix(in srgb, var(--fg) 10%, var(--bg));
  }
</style>
<defs>
  <marker id="arrowhead" markerWidth="8" markerHeight="5" refX="7" refY="2.5" orient="auto">
    <polygon points="0 0, 8 2.5, 0 5" fill="var(--_arrow)" stroke="var(--_arrow)" stroke-width="0.75" stroke-linejoin="round" />
  </marker>
  <marker id="arrowhead-start" markerWidth="8" markerHeight="5" refX="1" refY="2.5" orient="auto-start-reverse">
    <polygon points="8 0, 0 2.5, 8 5" fill="var(--_arrow)" stroke="var(--_arrow)" stroke-width="0.75" stroke-linejoin="round" />
  </marker>
</defs>
<polyline class="edge" data-from="A" data-to="B" data-style="solid" data-arrow-start="false" data-arrow-end="true" data-label="API client: api.js" points="352.73474999999996,76.9 352.73475,193.2" fill="none" stroke="var(--_line)" stroke-width="1" marker-end="url(#arrowhead)" />
<polyline class="edge" data-from="B" data-to="C" data-style="solid" data-arrow-start="false" data-arrow-end="true" data-label="Mongoose ORM" points="307.91625000000005,230.10000000000002 307.91625000000005,242.10000000000002 124.84499999999998,242.10000000000002 124.845,334.40000000000003" fill="none" stroke="var(--_line)" stroke-width="1" marker-end="url(#arrowhead)" />
<polyline class="edge" data-from="B" data-to="D" data-style="solid" data-arrow-start="false" data-arrow-end="true" data-label="Node fs/promises" points="337.79525,230.10000000000002 337.79525,528.09 283.69,528.09 283.69,596.39 233.48916666666662,596.39 233.48916666666662,600.0125" fill="none" stroke="var(--_line)" stroke-width="1" marker-end="url(#arrowhead)" />
<polyline class="edge" data-from="B" data-to="E" data-style="solid" data-arrow-start="false" data-arrow-end="true" data-label="Gemini/OpenAI SDKs" points="367.67425000000003,230.10000000000002 367.67425000000003,266.1 421.7795,266.1 421.7795,334.40000000000003" fill="none" stroke="var(--_line)" stroke-width="1" marker-end="url(#arrowhead)" />
<polyline class="edge" data-from="B" data-to="F" data-style="solid" data-arrow-start="false" data-arrow-end="true" data-label="Structured templates" points="397.55325000000005,230.10000000000002 397.55325000000005,254.10000000000002 567.7470000000001,254.10000000000002 567.7470000000001,579.635 522.9969166666667,579.635 522.9969166666667,600.0125" fill="none" stroke="var(--_line)" stroke-width="1" marker-end="url(#arrowhead)" />
<polyline class="edge" data-from="C" data-to="D" data-style="dotted" data-arrow-start="false" data-arrow-end="true" data-label="If Connection Fails" points="124.845,504.09000000000003 124.84499999999998,596.39 175.0458333333333,596.39 175.0458333333333,600.0125" fill="none" stroke="var(--_line)" stroke-width="1" stroke-dasharray="4 4" marker-end="url(#arrowhead)" />
<polyline class="edge" data-from="E" data-to="F" data-style="dotted" data-arrow-start="false" data-arrow-end="true" data-label="If Keys Omitted" points="421.7795,463.33500000000004 421.7795,579.635 466.52958333333333,579.635 466.52958333333333,600.0125" fill="none" stroke="var(--_line)" stroke-width="1" stroke-dasharray="4 4" marker-end="url(#arrowhead)" />
<g class="edge-label" data-from="A" data-to="B" data-label="API client: api.js">
  <rect x="307.23475" y="119.9" width="90.11800000000004" height="30.3" rx="2" ry="2" fill="var(--bg)" stroke="var(--_inner-stroke)" stroke-width="1" />
  <text x="352.29375000000005" y="135.05" text-anchor="middle" font-size="11" font-weight="400" fill="var(--_text-sec)" dy="3.8499999999999996">API client: api.js</text>
</g>
<g class="edge-label" data-from="B" data-to="C" data-label="Mongoose ORM">
  <rect x="77.84499999999997" y="249.1" width="93.08800000000001" height="30.3" rx="2" ry="2" fill="var(--bg)" stroke="var(--_inner-stroke)" stroke-width="1" />
  <text x="124.38899999999998" y="264.25" text-anchor="middle" font-size="11" font-weight="400" fill="var(--_text-sec)" dy="3.8499999999999996">Mongoose ORM</text>
</g>
<g class="edge-label" data-from="B" data-to="D" data-label="Node fs/promises">
  <rect x="233.68999999999997" y="535.09" width="99.62200000000001" height="30.3" rx="2" ry="2" fill="var(--bg)" stroke="var(--_inner-stroke)" stroke-width="1" />
  <text x="283.501" y="550.24" text-anchor="middle" font-size="11" font-weight="400" fill="var(--_text-sec)" dy="3.8499999999999996">Node fs/promises</text>
</g>
<g class="edge-label" data-from="B" data-to="E" data-label="Gemini/OpenAI SDKs">
  <rect x="363.7795" y="273.1" width="115.066" height="30.3" rx="2" ry="2" fill="var(--bg)" stroke="var(--_inner-stroke)" stroke-width="1" />
  <text x="421.3125" y="288.25" text-anchor="middle" font-size="11" font-weight="400" fill="var(--_text-sec)" dy="3.8499999999999996">Gemini/OpenAI SDKs</text>
</g>
<g class="edge-label" data-from="B" data-to="F" data-label="Structured templates">
  <rect x="510.24700000000007" y="518.335" width="114.47200000000004" height="30.3" rx="2" ry="2" fill="var(--bg)" stroke="var(--_inner-stroke)" stroke-width="1" />
  <text x="567.4830000000001" y="533.485" text-anchor="middle" font-size="11" font-weight="400" fill="var(--_text-sec)" dy="3.8499999999999996">Structured templates</text>
</g>
<g class="edge-label" data-from="C" data-to="D" data-label="If Connection Fails">
  <rect x="72.84499999999997" y="535.09" width="103.18600000000002" height="30.3" rx="2" ry="2" fill="var(--bg)" stroke="var(--_inner-stroke)" stroke-width="1" />
  <text x="124.43799999999999" y="550.24" text-anchor="middle" font-size="11" font-weight="400" fill="var(--_text-sec)" dy="3.8499999999999996">If Connection Fails</text>
</g>
<g class="edge-label" data-from="E" data-to="F" data-label="If Keys Omitted">
  <rect x="379.2795" y="518.335" width="84.17800000000003" height="30.3" rx="2" ry="2" fill="var(--bg)" stroke="var(--_inner-stroke)" stroke-width="1" />
  <text x="421.3685" y="533.485" text-anchor="middle" font-size="11" font-weight="400" fill="var(--_text-sec)" dy="3.8499999999999996">If Keys Omitted</text>
</g>
<g class="node" data-id="A" data-label="React Frontend" data-shape="rectangle">
  <rect x="286.18825" y="40" width="133.09300000000002" height="36.900000000000006" rx="0" ry="0" fill="var(--_node-fill)" stroke="var(--_node-stroke)" stroke-width="0.75" />
  <text x="352.73474999999996" y="58.45" text-anchor="middle" font-size="13" font-weight="500" fill="var(--_text)" dy="4.55">React Frontend</text>
</g>
<g class="node" data-id="B" data-label="Express Backend" data-shape="rectangle">
  <rect x="278.03725000000003" y="193.2" width="149.39499999999998" height="36.900000000000006" rx="0" ry="0" fill="var(--_node-fill)" stroke="var(--_node-stroke)" stroke-width="0.75" />
  <text x="352.73475" y="211.64999999999998" text-anchor="middle" font-size="13" font-weight="500" fill="var(--_text)" dy="4.55">Express Backend</text>
</g>
<g class="node" data-id="C" data-label="MongoDB Server" data-shape="diamond">
  <polygon points="124.845,334.4 209.69,419.245 124.845,504.09000000000003 40,419.245" fill="var(--_node-fill)" stroke="var(--_node-stroke)" stroke-width="0.75" />
  <text x="124.845" y="419.245" text-anchor="middle" font-size="13" font-weight="500" fill="var(--_text)" dy="4.55">MongoDB Server</text>
</g>
<g class="node" data-id="D" data-label="Local db.json Fallback" data-shape="cylinder">
  <rect x="116.60249999999998" y="607.0125" width="175.32999999999998" height="36.900000000000006" fill="var(--_node-fill)" stroke="none" />
  <line x1="116.60249999999998" y1="607.0125" x2="116.60249999999998" y2="643.9125" stroke="var(--_node-stroke)" stroke-width="0.75" />
  <line x1="291.93249999999995" y1="607.0125" x2="291.93249999999995" y2="643.9125" stroke="var(--_node-stroke)" stroke-width="0.75" />
  <ellipse cx="204.26749999999998" cy="643.9125" rx="87.66499999999999" ry="7" fill="var(--_node-fill)" stroke="var(--_node-stroke)" stroke-width="0.75" />
  <ellipse cx="204.26749999999998" cy="607.0125" rx="87.66499999999999" ry="7" fill="var(--_node-fill)" stroke="var(--_node-stroke)" stroke-width="0.75" />
  <text x="204.26749999999998" y="625.4625000000001" text-anchor="middle" font-size="13" font-weight="500" fill="var(--_text)" dy="4.55">Local db.json Fallback</text>
</g>
<g class="node" data-id="E" data-label="AI Engines" data-shape="diamond">
  <polygon points="421.7795,334.4000000000001 486.24699999999996,398.86750000000006 421.7795,463.33500000000004 357.312,398.86750000000006" fill="var(--_node-fill)" stroke="var(--_node-stroke)" stroke-width="0.75" />
  <text x="421.7795" y="398.86750000000006" text-anchor="middle" font-size="13" font-weight="500" fill="var(--_text)" dy="4.55">AI Engines</text>
</g>
<g class="node" data-id="F" data-label="Local Mock AI Engine" data-shape="cylinder">
  <rect x="410.06225" y="607.0125" width="169.402" height="36.900000000000006" fill="var(--_node-fill)" stroke="none" />
  <line x1="410.06225" y1="607.0125" x2="410.06225" y2="643.9125" stroke="var(--_node-stroke)" stroke-width="0.75" />
  <line x1="579.46425" y1="607.0125" x2="579.46425" y2="643.9125" stroke="var(--_node-stroke)" stroke-width="0.75" />
  <ellipse cx="494.76324999999997" cy="643.9125" rx="84.701" ry="7" fill="var(--_node-fill)" stroke="var(--_node-stroke)" stroke-width="0.75" />
  <ellipse cx="494.76324999999997" cy="607.0125" rx="84.701" ry="7" fill="var(--_node-fill)" stroke="var(--_node-stroke)" stroke-width="0.75" />
  <text x="494.76324999999997" y="625.4625000000001" text-anchor="middle" font-size="13" font-weight="500" fill="var(--_text)" dy="4.55">Local Mock AI Engine</text>
</g>
</svg>
---

## ⚡ Highlights & Features
- **AI Blog Generator:** Weave notes into structured blog posts with options for **Casual**, **Professional**, or **Storytelling** tones.
- **Social Media Expander:** Extract copy-ready LinkedIn posts and custom-compiled Twitter threads (with individual character trackers).
- **Split-Screen Markdown Editor:** Side-by-side WYSIWYG editor and previewer replicating Medium's typography.
- **Reading Journey Timeline:** Dynamic, vertical SVG journey tracker mapping out book-start dates, completions, and written articles.
- **Personal Knowledge Archive:** Searchable vault with semantic-like filtering across book notes, metadata, and blog content.
- **Zero-Config Resilient Mode:** Automatic fallbacks to a local file-based database store (`backend/data/db.json`) and high-fidelity Mock AI templates if MongoDB is offline or API keys are missing.

---

## 🚀 How to Run the App Locally

### Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### Step 1: Start the Backend Express Server
1. Open a terminal in the root directory and navigate to `backend`:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Boot the backend server in development mode (watches for file changes):
   ```bash
   npm run dev
   ```
   *The backend will start on **`http://localhost:5000`** and log either `[LOCAL JSON]` or `[MONGODB]` mode.*

### Step 2: Start the Frontend React App
1. Open a **new, separate terminal** in the root directory and navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Launch the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the displayed URL (usually **`http://localhost:3000`**) in your web browser.

---

## 🛠️ Configuration (Real AI & MongoDB Setup)

To unlock live AI generation (Gemini or OpenAI) and store your bookshelf on MongoDB:

1. Locate the file `backend/.env`.
2. Add your credentials:
   ```env
   # Add your preferred AI key (Gemini is recommended for free tiers)
   GEMINI_API_KEY=AIzaSy...
   
   # Optional: OpenAI API Key
   OPENAI_API_KEY=sk-proj-...

   # Optional: MongoDB Connection URI (Leave blank to keep using the local db.json file)
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/booktoblog
   ```
3. Save the file and **restart the backend server** (`npm run dev`). The status badge in the sidebar will update in real-time to reflect your active keys and database!

---

## 📂 Project Structure
```
d:\book to blog\
├── backend/                  # Node.js + Express Backend
│   ├── data/                 # Local JSON database storage
│   ├── src/
│   │   ├── config/           # Database setup (Mongoose + JSON fallback)
│   │   ├── routes/           # REST endpoints (books, blogs, stats)
│   │   ├── services/         # Gemini & OpenAI adapters
│   │   └── index.js          # Express entry point
│   ├── .env                  # Port, DB, and API Key configuration
│   └── package.json
└── frontend/                 # React + Vite + Tailwind CSS v4 Frontend
    ├── src/
    │   ├── components/       # Layout widgets
    │   ├── pages/            # Dashboard, Editor, Generator, Archive
    │   ├── utils/            # API fetch client
    │   ├── App.jsx           # Sidebar and Router
    │   ├── index.css         # Styling system & custom animations
    │   └── main.jsx
    ├── index.html            # Web template with custom fonts
    ├── package.json
    └── vite.config.js        # Vite build & proxy configurations
```
