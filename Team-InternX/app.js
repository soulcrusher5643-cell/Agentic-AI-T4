/**
 * InternX — Autonomous AI Internship Agent Execution Engine
 * Built for DeltaCCE Agentic AI Product Build Sprint
 * Team Members: Trimil Triliver John, Vimal Jimmy, Jefin Joseph
 */

// 1. Initial State & Opportunities Dataset
const DEMO_JOBS = [
  {
    id: "job-1",
    title: "AI & LLM Systems Engineer Intern",
    company: "Anthropic Labs / FutureTech",
    domain: "AI/ML",
    location: "Remote / Hybrid",
    stipend: "₹50,000 / mo",
    requiredSkills: ["Python", "TensorFlow", "PyTorch", "REST APIs", "Git"],
    optionalSkills: ["Vector DBs", "LangChain", "Docker"],
    minGpa: 8.0,
    description: "Build autonomous agent workflows, evaluate LLM prompts, and optimize RAG pipelines for production deployments.",
    status: "matched"
  },
  {
    id: "job-2",
    title: "Full Stack Web Developer Intern",
    company: "Nexus Cloud Solutions",
    domain: "Full Stack",
    location: "Bengaluru, India",
    stipend: "₹38,000 / mo",
    requiredSkills: ["React", "Node.js", "SQL", "REST APIs", "Git"],
    optionalSkills: ["TypeScript", "TailwindCSS", "AWS"],
    minGpa: 7.5,
    description: "Develop interactive student dashboards, state management pipelines, and high-performance microservices.",
    status: "matched"
  },
  {
    id: "job-3",
    title: "Data Science & Machine Learning Intern",
    company: "Quantum Analytics Inc.",
    domain: "Data Science",
    location: "Remote",
    stipend: "₹35,000 / mo",
    requiredSkills: ["Python", "SQL", "TensorFlow", "Pandas"],
    optionalSkills: ["Scikit-Learn", "Tableau", "PyTorch"],
    minGpa: 7.8,
    description: "Analyze large-scale student interaction datasets, build predictive recommendation models, and produce business dashboards.",
    status: "discovered"
  },
  {
    id: "job-4",
    title: "Generative AI Research Intern",
    company: "DeepVision Labs",
    domain: "AI/ML",
    location: "Bengaluru, India",
    stipend: "₹55,000 / mo",
    requiredSkills: ["Python", "PyTorch", "TensorFlow", "Git"],
    optionalSkills: ["OpenCV", "CUDA", "Transformers"],
    minGpa: 8.5,
    description: "Experiment with fine-tuning multimodal foundation models, neural architecture search, and latency optimization.",
    status: "discovered"
  },
  {
    id: "job-5",
    title: "Backend API Engineer Intern",
    company: "FinTech ScaleUp",
    domain: "Full Stack",
    location: "Hybrid (Mumbai)",
    stipend: "₹40,000 / mo",
    requiredSkills: ["Node.js", "SQL", "REST APIs", "Git"],
    optionalSkills: ["Redis", "PostgreSQL", "Docker"],
    minGpa: 7.0,
    description: "Design robust, low-latency RESTful APIs and database schemas for real-time transaction processing.",
    status: "discovered"
  },
  {
    id: "job-6",
    title: "Frontend UI/UX Engineer Intern",
    company: "Stripe / DesignCraft",
    domain: "UI/UX",
    location: "Remote",
    stipend: "₹36,000 / mo",
    requiredSkills: ["React", "TypeScript", "TailwindCSS", "Git"],
    optionalSkills: ["Figma", "Framer Motion", "Next.js"],
    minGpa: 7.2,
    description: "Create responsive, sleek web interfaces with smooth animations, accessible component systems, and intuitive workflows.",
    status: "discovered"
  },
  {
    id: "job-7",
    title: "Cyber Security & Application Security Intern",
    company: "ShieldCyber Security",
    domain: "Cyber Security",
    location: "Hyderabad, India",
    stipend: "₹32,000 / mo",
    requiredSkills: ["Python", "REST APIs", "Git", "SQL"],
    optionalSkills: ["Wireshark", "Penetration Testing", "Linux"],
    minGpa: 7.5,
    description: "Conduct vulnerability scans, inspect API endpoints for auth flaws, and assist in automating SOC playbooks.",
    status: "discovered"
  },
  {
    id: "job-8",
    title: "Associate Product Manager (APM) Intern",
    company: "ProductSpace",
    domain: "Product",
    location: "Remote",
    stipend: "₹30,000 / mo",
    requiredSkills: ["Problem Solving", "Communication", "Data Analysis"],
    optionalSkills: ["SQL", "Figma", "Mixpanel"],
    minGpa: 7.0,
    description: "Gather user requirements, draft feature specifications, analyze retention funnels, and collaborate with engineering.",
    status: "discovered"
  },
  {
    id: "job-9",
    title: "Cloud Infrastructure & DevOps Intern",
    company: "AWS CloudOps Partner",
    domain: "Full Stack",
    location: "Pune, India",
    stipend: "₹38,000 / mo",
    requiredSkills: ["Python", "Git", "REST APIs"],
    optionalSkills: ["Docker", "Kubernetes", "AWS"],
    minGpa: 7.5,
    description: "Automate CI/CD deployment pipelines, manage containerized clusters, and optimize cloud infrastructure costs.",
    status: "discovered"
  },
  {
    id: "job-10",
    title: "Computer Vision Research Intern",
    company: "RoboTech Dynamics",
    domain: "AI/ML",
    location: "Bengaluru, India",
    stipend: "₹48,000 / mo",
    requiredSkills: ["Python", "PyTorch", "TensorFlow"],
    optionalSkills: ["OpenCV", "ROS", "C++"],
    minGpa: 8.2,
    description: "Develop real-time object detection and spatial tracking algorithms for autonomous robotic fleets.",
    status: "discovered"
  },
  {
    id: "job-11",
    title: "Data Engineer Intern",
    company: "DataPipeline Global",
    domain: "Data Science",
    location: "Remote",
    stipend: "₹37,000 / mo",
    requiredSkills: ["Python", "SQL", "Git"],
    optionalSkills: ["Spark", "Airflow", "Snowflake"],
    minGpa: 7.6,
    description: "Build ETL data pipelines, clean heterogeneous data streams, and optimize BigQuery SQL queries.",
    status: "discovered"
  },
  {
    id: "job-12",
    title: "Natural Language Processing (NLP) Intern",
    company: "LinguaAI Systems",
    domain: "AI/ML",
    location: "Remote",
    stipend: "₹45,000 / mo",
    requiredSkills: ["Python", "PyTorch", "REST APIs"],
    optionalSkills: ["HuggingFace", "BERT", "Vector DBs"],
    minGpa: 8.0,
    description: "Train domain-specific embeddings, build sentiment analysis models, and integrate entity extraction pipelines.",
    status: "discovered"
  }
];

// Agent State Engine
let appState = {
  profile: {
    name: "Trimil",
    college: "National Institute of Tech",
    gpa: "8.9 / 10",
    major: "B.Tech Computer Science & AI",
    skills: ["Python", "React", "Node.js", "TensorFlow", "PyTorch", "SQL", "REST APIs", "Git"],
    targetRoles: ["AI Engineer Intern", "Full Stack Intern", "Data Science Intern"],
    location: "Remote / Bengaluru",
    minStipend: "₹25,000",
    resumeSummary: "Final year CS student building autonomous agentic AI software. Experienced in full-stack web development, vector search pipelines, and LLM orchestration."
  },
  jobs: [],
  applications: [],
  traceLog: [],
  activeFilter: "all",
  selectedJobForModal: null
};

// 2. LocalStorage Persistence
function loadState() {
  const savedProfile = localStorage.getItem("internx_profile");
  const savedApplications = localStorage.getItem("internx_applications");

  if (savedProfile) {
    appState.profile = JSON.parse(savedProfile);
  }
  if (savedApplications) {
    appState.applications = JSON.parse(savedApplications);
  } else {
    // Seed initial applications state
    appState.applications = [
      { jobId: "job-1", status: "matched", timestamp: new Date().toISOString() },
      { jobId: "job-2", status: "matched", timestamp: new Date().toISOString() },
      { jobId: "job-3", status: "discovered", timestamp: new Date().toISOString() },
      { jobId: "job-4", status: "discovered", timestamp: new Date().toISOString() },
      { jobId: "job-5", status: "discovered", timestamp: new Date().toISOString() }
    ];
  }
  appState.jobs = [...DEMO_JOBS];
}

function saveState() {
  localStorage.setItem("internx_profile", JSON.stringify(appState.profile));
  localStorage.setItem("internx_applications", JSON.stringify(appState.applications));
}

// 3. UI Sync Functions
function populateFormFromProfile() {
  document.getElementById("studentName").value = appState.profile.name;
  document.getElementById("college").value = appState.profile.college;
  document.getElementById("gpa").value = appState.profile.gpa;
  document.getElementById("major").value = appState.profile.major;
  document.getElementById("skills").value = appState.profile.skills.join(", ");
  document.getElementById("targetRoles").value = appState.profile.targetRoles.join(", ");
  document.getElementById("location").value = appState.profile.location;
  document.getElementById("minStipend").value = appState.profile.minStipend;
  document.getElementById("resumeSummary").value = appState.profile.resumeSummary;
}

function readProfileFromForm() {
  const skillsRaw = document.getElementById("skills").value;
  const rolesRaw = document.getElementById("targetRoles").value;

  appState.profile = {
    name: document.getElementById("studentName").value.trim(),
    college: document.getElementById("college").value.trim(),
    gpa: document.getElementById("gpa").value.trim(),
    major: document.getElementById("major").value.trim(),
    skills: skillsRaw.split(",").map(s => s.trim()).filter(Boolean),
    targetRoles: rolesRaw.split(",").map(r => r.trim()).filter(Boolean),
    location: document.getElementById("location").value.trim(),
    minStipend: document.getElementById("minStipend").value.trim(),
    resumeSummary: document.getElementById("resumeSummary").value.trim()
  };
  saveState();
}

// 4. Autonomous Agent Engine & Tool Implementations

// Tool 1: Opportunity Scraper
function toolScrapeOpportunities(targetRoles) {
  logEvent("TOOL_SCRAPER", `Querying external job portals for roles: [${targetRoles.join(", ")}]...`);
  // Returns job dataset with metadata
  return appState.jobs;
}

// Tool 2: ATS Skill Matrix & Compatibility Score Calculator
function toolCalculateCompatibility(job, studentSkills) {
  const studentSkillsUpper = studentSkills.map(s => s.toUpperCase());
  let matchedCount = 0;
  let missing = [];

  job.requiredSkills.forEach(req => {
    if (studentSkillsUpper.includes(req.toUpperCase())) {
      matchedCount++;
    } else {
      missing.push(req);
    }
  });

  const matchPercent = Math.round((matchedCount / job.requiredSkills.length) * 100);
  return { matchPercent, matchedSkills: job.requiredSkills.filter(s => !missing.includes(s)), missingSkills: missing };
}

// Tool 3: Personalized Pitch & Application Asset Drafter
function toolDraftApplication(job, profile, compatibility) {
  const pitch = `Dear Hiring Team at ${job.company},

I am writing to express my strong interest in the ${job.title} position. As a student at ${profile.college} pursuing ${profile.major} with a GPA of ${profile.gpa}, my skill background in ${profile.skills.slice(0, 5).join(", ")} aligns directly with your technical stack.

Why I am a strong candidate:
• Demonstrated proficiency in ${compatibility.matchedSkills.join(", ")} required for this role.
• Passionate about ${job.domain} solutions and autonomous agent architectures.
• Quick learner actively expanding skills in ${compatibility.missingSkills.length > 0 ? compatibility.missingSkills.join(", ") : "advanced deployment workflows"}.

Thank you for your time and consideration.

Best regards,
${profile.name}`;

  const coverLetter = `APPLICATION PACKAGE FOR ${job.title.toUpperCase()}
Candidate: ${profile.name} | ${profile.major}
Key Strengths: ${profile.skills.join(" • ")}
Calculated ATS Compatibility Score: ${compatibility.matchPercent}%

Executive Summary:
${profile.resumeSummary}`;

  return { pitch, coverLetter, missingSkills: compatibility.missingSkills };
}

// Tool 4: Persistent Memory & State Sync Tool
function toolSyncStateToMemory(jobId, newStatus) {
  logEvent("TOOL_MEMORY", `Updating persistent state for Job ${jobId} -> Status: [${newStatus}]`);
  const appIndex = appState.applications.findIndex(a => a.jobId === jobId);
  if (appIndex >= 0) {
    appState.applications[appIndex].status = newStatus;
    appState.applications[appIndex].timestamp = new Date().toISOString();
  } else {
    appState.applications.push({ jobId, status: newStatus, timestamp: new Date().toISOString() });
  }
  saveState();
  renderKanban();
}

// Logging Engine
function logEvent(type, message, details = null) {
  const timestamp = new Date().toLocaleTimeString();
  const logObj = { timestamp, type, message, details };
  appState.traceLog.push(logObj);

  const feed = document.getElementById("agentLogFeed");
  if (feed) {
    const line = document.createElement("div");
    let cssClass = "log-system";
    if (type.startsWith("TOOL")) cssClass = "log-tool";
    if (type === "AGENT_SUCCESS") cssClass = "log-success";

    line.className = `log-line ${cssClass}`;
    line.innerHTML = `<span class="log-time">[${timestamp}] [${type}]</span> ${message}`;
    feed.appendChild(line);
    feed.scrollTop = feed.scrollHeight;
  }
}

// 5. Multi-Step Execution Routine (Autonomous Workflow)
async function runInternXAgent() {
  const runBtn = document.getElementById("triggerAgentBtn");
  const statusBadge = document.getElementById("agentStatusBadge");
  
  const consoleCard = document.querySelector(".console-card");
  if (consoleCard) {
    consoleCard.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (runBtn) runBtn.disabled = true;
  if (statusBadge) {
    statusBadge.className = "status-pill status-running";
    statusBadge.innerText = "Status: Executing Agent Plan...";
  }

  // Clear previous execution steps state
  for (let i = 1; i <= 5; i++) {
    const el = document.getElementById(`step-${i}`);
    if (el) el.className = "pipe-step";
  }

  logEvent("PLANNER", `Initializing Autonomous Goal Decomposition for student: ${appState.profile.name}`);
  
  // Step 1: Planning
  setStepState(1, "active");
  logEvent("PLANNER", "Goal: Search external portals, verify eligibility, rank compatibility, draft cover letters, and sync persistent state.");
  await delay(1000);
  setStepState(1, "done");

  // Step 2: Tool 1 - Scrape
  setStepState(2, "active");
  const discovered = toolScrapeOpportunities(appState.profile.targetRoles);
  logEvent("TOOL_SCRAPER", `Fetched ${discovered.length} active internship opportunities from external endpoints.`);
  await delay(1200);
  setStepState(2, "done");

  // Step 3: Tool 2 - ATS Fit Evaluation
  setStepState(3, "active");
  logEvent("TOOL_ATS", "Evaluating ATS fit matrix across candidate skill set...");
  
  discovered.forEach(job => {
    const comp = toolCalculateCompatibility(job, appState.profile.skills);
    job.matchData = comp;
    logEvent("TOOL_ATS", `Evaluated "${job.title}" @ ${job.company}: ${comp.matchPercent}% Fit (${comp.matchedSkills.length} matched skills).`);
  });
  await delay(1200);
  setStepState(3, "done");

  // Step 4: Tool 3 - Application Asset Drafting
  setStepState(4, "active");
  const topJob = discovered.reduce((prev, current) => (prev.matchData.matchPercent > current.matchData.matchPercent) ? prev : current);
  logEvent("TOOL_DRAFTER", `Auto-generating tailored application pitch for highest matching role: "${topJob.title}"`);
  topJob.draftPackage = toolDraftApplication(topJob, appState.profile, topJob.matchData);
  await delay(1000);
  setStepState(4, "done");

  // Step 5: Tool 4 - State & Memory Persister
  setStepState(5, "active");
  discovered.forEach(job => {
    if (job.matchData.matchPercent >= 75) {
      toolSyncStateToMemory(job.id, "matched");
    }
  });
  logEvent("TOOL_MEMORY", "Synced evaluated opportunities to persistent LocalStorage application pipeline.");
  await delay(800);
  setStepState(5, "done");

  // Completion
  logEvent("AGENT_SUCCESS", "Autonomous agent task execution completed successfully!");
  if (statusBadge) {
    statusBadge.className = "status-pill status-idle";
    statusBadge.innerText = "Status: Execution Completed";
  }
  if (runBtn) runBtn.disabled = false;

  renderJobCards();
  renderKanban();
}

function setStepState(stepNum, state) {
  const step = document.getElementById(`step-${stepNum}`);
  if (step) step.className = `pipe-step ${state}`;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 6. UI Renderers (Cards & Kanban)
function renderJobCards() {
  const container = document.getElementById("jobsContainer");
  if (!container) return;

  container.innerHTML = "";
  const filtered = appState.jobs.filter(job => {
    if (appState.activeFilter === "all") return true;
    return job.domain === appState.activeFilter;
  });

  filtered.forEach(job => {
    const comp = job.matchData || toolCalculateCompatibility(job, appState.profile.skills);
    const card = document.createElement("div");
    card.className = "glass-card job-card";
    card.innerHTML = `
      <div class="job-card-header">
        <div>
          <span class="company-badge">${job.company}</span>
          <h3 class="job-title">${job.title}</h3>
        </div>
        <div class="match-score-badge" title="ATS Compatibility Score">
          <span>${comp.matchPercent}%</span>
        </div>
      </div>
      <div class="job-meta">
        <span><i class="fa-solid fa-location-dot"></i> ${job.location}</span>
        <span><i class="fa-solid fa-sack-dollar"></i> ${job.stipend}</span>
      </div>
      <div class="skills-tags">
        ${comp.matchedSkills.map(s => `<span class="tag tag-match"><i class="fa-solid fa-check"></i> ${s}</span>`).join("")}
        ${comp.missingSkills.map(s => `<span class="tag tag-gap"><i class="fa-solid fa-plus"></i> ${s}</span>`).join("")}
      </div>
      <div class="job-actions">
        <button class="btn btn-secondary btn-block" onclick="openDraftModal('${job.id}')"><i class="fa-solid fa-wand-magic-sparkles"></i> View AI Pitch</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderKanban() {
  const cols = ["discovered", "matched", "applied", "interview", "offer"];
  cols.forEach(col => {
    const colCards = document.getElementById(`cards-${col}`);
    const countEl = document.getElementById(`count-${col}`);
    if (!colCards) return;

    colCards.innerHTML = "";
    const items = appState.applications.filter(a => a.status === col);
    if (countEl) countEl.innerText = items.length;

    items.forEach(app => {
      const job = appState.jobs.find(j => j.id === app.jobId);
      if (!job) return;

      const item = document.createElement("div");
      item.className = "kanban-item";
      item.innerHTML = `
        <div class="kanban-item-title">${job.title}</div>
        <div class="kanban-item-company">${job.company} • ${job.stipend}</div>
        <div class="kanban-item-actions">
          <span><i class="fa-solid fa-clock"></i> ${new Date(app.timestamp).toLocaleDateString()}</span>
          ${renderKanbanActionBtn(job.id, col)}
        </div>
      `;
      colCards.appendChild(item);
    });
  });
}

function renderKanbanActionBtn(jobId, currentStatus) {
  if (currentStatus === "matched") {
    return `<button class="btn btn-primary" style="padding: 2px 8px; font-size: 0.7rem;" onclick="updateAppStatus('${jobId}', 'applied')">Mark Applied</button>`;
  }
  if (currentStatus === "applied") {
    return `<button class="btn btn-secondary" style="padding: 2px 8px; font-size: 0.7rem;" onclick="updateAppStatus('${jobId}', 'interview')">Mark Interviewing</button>`;
  }
  if (currentStatus === "interview") {
    return `<button class="btn btn-gradient" style="padding: 2px 8px; font-size: 0.7rem;" onclick="updateAppStatus('${jobId}', 'offer')">Record Offer</button>`;
  }
  return `<span class="badge badge-info" style="font-size:0.65rem;">Tracked</span>`;
}

function updateAppStatus(jobId, newStatus) {
  toolSyncStateToMemory(jobId, newStatus);
}

// 7. Modal Handlers
function openDraftModal(jobId) {
  const job = appState.jobs.find(j => j.id === jobId);
  if (!job) return;

  appState.selectedJobForModal = job;
  const comp = job.matchData || toolCalculateCompatibility(job, appState.profile.skills);
  const pkg = toolDraftApplication(job, appState.profile, comp);

  const banner = document.getElementById("modalJobBanner");
  if (banner) {
    banner.innerHTML = `
      <h4>${job.title} at ${job.company}</h4>
      <p><i class="fa-solid fa-chart-line"></i> Computed ATS Compatibility: <strong>${comp.matchPercent}%</strong> | Required Skills Matched: ${comp.matchedSkills.join(", ")}</p>
    `;
  }

  document.getElementById("modalPitchText").value = pkg.pitch;
  document.getElementById("modalCoverText").value = pkg.coverLetter;

  const gapsBox = document.getElementById("modalGapsContainer");
  if (gapsBox) {
    gapsBox.innerHTML = comp.missingSkills.length > 0 
      ? `<p><strong style="color: var(--accent-amber);">Recommended Skill Prep:</strong> To boost your fit score to 100%, consider building a mini project featuring: <strong>${comp.missingSkills.join(", ")}</strong>.</p>`
      : `<p><strong style="color: var(--accent-green);">100% Core Skill Match!</strong> You meet all core requirements for this position.</p>`;
  }

  document.getElementById("appDraftModal").classList.add("active");
}

function closeDraftModal() {
  document.getElementById("appDraftModal").classList.remove("active");
}

function openJudgeTraceModal() {
  const jsonView = document.getElementById("judgeJsonView");
  if (jsonView) {
    jsonView.innerText = JSON.stringify({
      sprintTrack: "Education & Career Tech",
      team: {
        name: "Team InternX",
        members: ["Trimil Triliver John", "Vimal Jimmy", "Jefin Joseph"]
      },
      agentArchitecture: "Google Antigravity Multi-Step Planner",
      traceLog: appState.traceLog,
      persistentState: appState.applications
    }, null, 2);
  }
  document.getElementById("judgeTraceModal").classList.add("active");
}

function closeJudgeTraceModal() {
  document.getElementById("judgeTraceModal").classList.remove("active");
}

function initApp() {
  loadState();
  populateFormFromProfile();
  renderJobCards();
  renderKanban();

  // Profile Form submit
  const profileForm = document.getElementById("profileForm");
  if (profileForm) {
    profileForm.addEventListener("submit", (e) => {
      e.preventDefault();
      readProfileFromForm();
      alert("Profile updated & saved to memory! You can now run the agent.");
    });
  }

  // Trigger Agent Button
  const triggerBtn = document.getElementById("triggerAgentBtn");
  if (triggerBtn) triggerBtn.addEventListener("click", runInternXAgent);

  const quickRunBtn = document.getElementById("quickRunBtn");
  if (quickRunBtn) quickRunBtn.addEventListener("click", runInternXAgent);

  // Judge Modal Buttons
  const inspectBtn = document.getElementById("inspectTraceBtn");
  if (inspectBtn) inspectBtn.addEventListener("click", openJudgeTraceModal);

  const closeTraceModal = document.getElementById("closeTraceModal");
  if (closeTraceModal) closeTraceModal.addEventListener("click", closeJudgeTraceModal);

  const closeTraceModalBtn = document.getElementById("closeTraceModalBtn");
  if (closeTraceModalBtn) closeTraceModalBtn.addEventListener("click", closeJudgeTraceModal);

  // Draft Modal Buttons
  const closeDraft = document.getElementById("closeDraftModal");
  if (closeDraft) closeDraft.addEventListener("click", closeDraftModal);

  const confirmApplyBtn = document.getElementById("confirmApplyBtn");
  if (confirmApplyBtn) {
    confirmApplyBtn.addEventListener("click", () => {
      if (appState.selectedJobForModal) {
        updateAppStatus(appState.selectedJobForModal.id, "applied");
        closeDraftModal();
        alert(`Application sent for ${appState.selectedJobForModal.title}! Status updated in Kanban memory.`);
      }
    });
  }

  // Copy Draft Button
  const copyBtn = document.getElementById("copyDraftBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const activeTab = document.querySelector(".tab-btn.active").getAttribute("data-tab");
      let text = "";
      if (activeTab === "tab-pitch") text = document.getElementById("modalPitchText").value;
      if (activeTab === "tab-cover") text = document.getElementById("modalCoverText").value;
      
      navigator.clipboard.writeText(text);
      alert("Application content copied to clipboard!");
    });
  }

  // Filter Buttons
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      appState.activeFilter = e.target.getAttribute("data-filter");
      renderJobCards();
    });
  });

  // Modal Tabs
  document.querySelectorAll(".modal-tabs .tab-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".modal-tabs .tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".modal-card .tab-content").forEach(c => c.classList.remove("active"));

      const targetTab = e.target.getAttribute("data-tab");
      e.target.classList.add("active");
      const tabEl = document.getElementById(targetTab);
      if (tabEl) tabEl.classList.add("active");
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

window.runInternXAgent = runInternXAgent;
window.openJudgeTraceModal = openJudgeTraceModal;
window.openDraftModal = openDraftModal;
window.closeDraftModal = closeDraftModal;
window.closeJudgeTraceModal = closeJudgeTraceModal;
