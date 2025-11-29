// Application State
const state = {
    resumes: [],
    results: []
};

// Sample resumes for demo
const sampleResumes = [
    {
        name: "Alex Johnson",
        email: "alex.johnson@email.com",
        content: `Full Stack Developer with 6 years of experience. Expert in React, Node.js, and Python. 
        Strong background in AWS cloud services. Built multiple SaaS applications from scratch. 
        Proficient in PostgreSQL, MongoDB, Docker. BS in Computer Science from MIT. 
        Led team of 4 developers. Implemented CI/CD pipelines using Jenkins.`
    },
    {
        name: "Sarah Chen",
        email: "sarah.chen@email.com",
        content: `Software Engineer with 3 years experience. Skilled in JavaScript, React, and Node.js.
        Some experience with Python. Working knowledge of AWS. Completed several web projects.
        Bachelor's in Software Engineering. Good team player and fast learner.`
    },
    {
        name: "Michael Rodriguez",
        email: "m.rodriguez@email.com",
        content: `Senior Developer with 8 years experience. Deep expertise in JavaScript, TypeScript, React, Node.js.
        Python and FastAPI for microservices. PostgreSQL and Redis expert. 
        AWS and GCP certified. Kubernetes and Docker in production. Led multiple teams.
        MS in Computer Science. Open source contributor.`
    },
    {
        name: "Emily Watson",
        email: "emily.w@email.com",
        content: `Front-end Developer with 4 years experience. Strong React and JavaScript skills.
        Basic Node.js knowledge. Worked with REST APIs. Some MongoDB experience.
        Good at UI/UX design. Bachelor's in Design. Team collaboration skills.`
    },
    {
        name: "David Kim",
        email: "d.kim@email.com",
        content: `Full Stack Engineer with 7 years experience. JavaScript, TypeScript, React expert.
        Node.js and Python backend development. FastAPI and Express. PostgreSQL and MongoDB.
        AWS infrastructure and Lambda. Docker containers. CI/CD with GitHub Actions.
        Bachelor's CS. Mentored junior developers.`
    }
];

// Current candidate for scheduling/sharing
let currentCandidate = null;

// Initialize
function init() {
    state.resumes = [...sampleResumes];
    updateUploadedFiles();
    setupDropZone();
}

// Setup drag and drop
function setupDropZone() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');

    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('border-purple-500');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('border-purple-500');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('border-purple-500');
        handleFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
}

// Handle file upload
function handleFiles(files) {
    for (let file of files) {
        const reader = new FileReader();
        reader.onload = function(e) {
            state.resumes.push({
                name: file.name.replace(/\.[^/.]+$/, ""),
                email: `${file.name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
                content: e.target.result
            });
            updateUploadedFiles();
            showNotification(`${file.name} uploaded`, 'success');
        };
        reader.readAsText(file);
    }
}

// Add resume from text
function addResumeText() {
    const text = document.getElementById('resumeText').value.trim();
    if (!text) {
        showNotification('Please enter resume text', 'error');
        return;
    }

    state.resumes.push({
        name: `Candidate ${state.resumes.length + 1}`,
        email: `candidate${state.resumes.length + 1}@email.com`,
        content: text
    });

    document.getElementById('resumeText').value = '';
    updateUploadedFiles();
    showNotification('Resume added', 'success');
}

// Update uploaded files display
function updateUploadedFiles() {
    const container = document.getElementById('uploadedFiles');
    container.innerHTML = `
        <div class="text-sm font-semibold mb-2">
            ${state.resumes.length} Resume(s) Ready for Analysis
        </div>
        ${state.resumes.map((r, i) => `
            <div class="flex items-center justify-between bg-gray-100 px-4 py-2 rounded">
                <div class="flex items-center">
                    <i class="fas fa-file-alt text-blue-500 mr-2"></i>
                    <span class="text-sm">${r.name}</span>
                </div>
                <button onclick="removeResume(${i})" class="text-red-500 hover:text-red-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('')}
    `;
}

// Remove resume
function removeResume(index) {
    state.resumes.splice(index, 1);
    updateUploadedFiles();
}

// Analyze resumes with AI
async function analyzeResumes() {
    if (state.resumes.length === 0) {
        showNotification('Please upload or add resumes first', 'error');
        return;
    }

    const jobDesc = document.getElementById('jobDescription').value.trim();
    if (!jobDesc) {
        showNotification('Please enter job description', 'error');
        return;
    }

    showProcessing();
    state.results = [];

    for (let i = 0; i < state.resumes.length; i++) {
        updateProgress((i / state.resumes.length) * 100);
        await sleep(1000); // Simulate API call

        const result = await analyzeResume(state.resumes[i], jobDesc);
        state.results.push(result);
    }

    updateProgress(100);
    await sleep(500);
    hideProcessing();

    displayResults();
    showNotification('Analysis complete!', 'success');
}

// Analyze single resume (simulated AI)
async function analyzeResume(resume, jobDesc) {
    // Extract requirements
    const requirements = extractRequirements(jobDesc);
    const resumeLower = resume.content.toLowerCase();
    
    // Calculate matches
    let skillScore = 0;
    let expScore = 0;
    let eduScore = 0;
    
    // Skill matching
    const skillMatches = requirements.skills.filter(skill => 
        resumeLower.includes(skill.toLowerCase())
    );
    skillScore = (skillMatches.length / requirements.skills.length) * 100;
    
    // Experience matching
    const expMatch = resume.content.match(/(\d+)\+?\s*years?/i);
    if (expMatch) {
        const years = parseInt(expMatch[1]);
        expScore = Math.min((years / requirements.minYears) * 100, 100);
    } else {
        expScore = 30;
    }
    
    // Education matching
    if (resumeLower.includes('master') || resumeLower.includes('ms')) eduScore = 100;
    else if (resumeLower.includes('bachelor') || resumeLower.includes('bs')) eduScore = 80;
    else eduScore = 50;
    
    // Leadership
    const hasLeadership = resumeLower.includes('lead') || resumeLower.includes('led') || resumeLower.includes('mentor');
    const leadershipBonus = hasLeadership ? 10 : 0;
    
    // Overall score
    const overallScore = Math.round(
        (skillScore * 0.5) + 
        (expScore * 0.3) + 
        (eduScore * 0.15) + 
        leadershipBonus * 0.05
    );
    
    return {
        ...resume,
        score: overallScore,
        skillMatch: Math.round(skillScore),
        experienceMatch: Math.round(expScore),
        educationMatch: Math.round(eduScore),
        matchedSkills: skillMatches,
        missingSkills: requirements.skills.filter(s => !skillMatches.includes(s)),
        insights: generateInsights(resume, overallScore, hasLeadership),
        recommendation: getRecommendation(overallScore)
    };
}

// Extract requirements from job description
function extractRequirements(jobDesc) {
    const skills = [];
    const techStack = [
        'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'FastAPI',
        'PostgreSQL', 'MongoDB', 'AWS', 'GCP', 'Docker', 'Kubernetes',
        'CI/CD', 'Jenkins', 'GitHub Actions', 'Express', 'Vue', 'Angular'
    ];
    
    techStack.forEach(tech => {
        if (jobDesc.toLowerCase().includes(tech.toLowerCase())) {
            skills.push(tech);
        }
    });
    
    // Extract years of experience
    const yearsMatch = jobDesc.match(/(\d+)\+?\s*years?/i);
    const minYears = yearsMatch ? parseInt(yearsMatch[1]) : 3;
    
    return { skills, minYears };
}

// Generate AI insights
function generateInsights(resume, score, hasLeadership) {
    const insights = [];
    
    if (score >= 80) {
        insights.push("⭐ Excellent match for the position");
        insights.push("🎯 Strong technical skills aligned with requirements");
    } else if (score >= 65) {
        insights.push("✅ Good candidate with relevant experience");
        insights.push("📈 Meets most core requirements");
    } else {
        insights.push("⚠️ Limited alignment with job requirements");
        insights.push("📚 May need additional training or experience");
    }
    
    if (hasLeadership) {
        insights.push("👥 Demonstrated leadership and mentoring experience");
    }
    
    if (resume.content.toLowerCase().includes('open source')) {
        insights.push("💻 Active open source contributor");
    }
    
    return insights;
}

// Get recommendation
function getRecommendation(score) {
    if (score >= 80) return "Strong Hire - Schedule Interview";
    if (score >= 70) return "Recommended for Interview";
    if (score >= 60) return "Consider for Phone Screen";
    return "Not Recommended";
}

// Display results
function displayResults() {
    state.results.sort((a, b) => b.score - a.score);
    
    // Update stats
    document.getElementById('totalResumes').textContent = state.results.length;
    const minScore = parseInt(document.getElementById('minScore').value);
    document.getElementById('qualified').textContent = state.results.filter(r => r.score >= minScore).length;
    
    const avg = state.results.reduce((sum, r) => sum + r.score, 0) / state.results.length;
    document.getElementById('avgScore').textContent = Math.round(avg) + '%';
    
    const top = Math.max(...state.results.map(r => r.score));
    document.getElementById('topScore').textContent = top + '%';
    
    // Display results
    const resultsList = document.getElementById('resultsList');
    resultsList.innerHTML = state.results.map((result, index) => `
        <div class="border-l-4 ${getScoreBorderColor(result.score)} bg-gray-50 p-6 mb-4 rounded fade-in" style="animation-delay: ${index * 0.1}s">
            <div class="flex justify-between items-start mb-4">
                <div class="flex-1">
                    <h3 class="text-2xl font-bold mb-2">${result.name}</h3>
                    <div class="text-gray-600 space-y-1">
                        <p><i class="fas fa-envelope mr-2"></i>${result.email}</p>
                    </div>
                </div>
                <div class="score-circle ${getScoreClass(result.score)}">
                    ${result.score}%
                </div>
            </div>
            
            <div class="grid grid-cols-3 gap-4 mb-4">
                <div class="bg-white p-3 rounded text-center">
                    <div class="text-2xl font-bold text-blue-600">${result.skillMatch}%</div>
                    <div class="text-sm text-gray-600">Skills Match</div>
                </div>
                <div class="bg-white p-3 rounded text-center">
                    <div class="text-2xl font-bold text-purple-600">${result.experienceMatch}%</div>
                    <div class="text-sm text-gray-600">Experience</div>
                </div>
                <div class="bg-white p-3 rounded text-center">
                    <div class="text-2xl font-bold text-green-600">${result.educationMatch}%</div>
                    <div class="text-sm text-gray-600">Education</div>
                </div>
            </div>
            
            <div class="mb-4">
                <div class="font-semibold mb-2">✅ Matched Skills:</div>
                <div class="flex flex-wrap gap-2">
                    ${result.matchedSkills.map(skill => 
                        `<span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">${skill}</span>`
                    ).join('')}
                </div>
            </div>
            
            ${result.missingSkills.length > 0 ? `
                <div class="mb-4">
                    <div class="font-semibold mb-2">❌ Missing Skills:</div>
                    <div class="flex flex-wrap gap-2">
                        ${result.missingSkills.map(skill => 
                            `<span class="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">${skill}</span>`
                        ).join('')}
                    </div>
                </div>
            ` : ''}
            
            <div class="mb-4">
                <div class="font-semibold mb-2">🤖 AI Insights:</div>
                <div class="space-y-1">
                    ${result.insights.map(insight => 
                        `<div class="text-sm text-gray-700">${insight}</div>`
                    ).join('')}
                </div>
            </div>
            
            <div class="flex justify-between items-center pt-4 border-t">
                <div class="font-bold text-lg ${getScoreTextColor(result.score)}">
                    ${result.recommendation}
                </div>
                <div class="flex gap-2">
                    <button onclick="scheduleInterview('${result.email}')" 
                        class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                        <i class="fas fa-calendar mr-2"></i>Schedule Interview
                    </button>
                    <button onclick="exportCandidate(${index})" 
                        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        <i class="fas fa-share mr-2"></i>Share
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    document.getElementById('resultsSection').classList.remove('hidden');
}

// Helper functions
function getScoreClass(score) {
    if (score >= 80) return 'score-excellent';
    if (score >= 70) return 'score-good';
    if (score >= 60) return 'score-fair';
    return 'score-poor';
}

function getScoreBorderColor(score) {
    if (score >= 80) return 'border-green-500';
    if (score >= 70) return 'border-blue-500';
    if (score >= 60) return 'border-yellow-500';
    return 'border-red-500';
}

function getScoreTextColor(score) {
    if (score >= 80) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
}

// Schedule Interview Functions
function scheduleInterview(email) {
    const candidate = state.results.find(r => r.email === email);
    if (!candidate) return;
    
    currentCandidate = candidate;
    
    // Populate modal with candidate info
    document.getElementById('scheduleCandidateName').textContent = candidate.name;
    document.getElementById('scheduleCandidateEmail').textContent = candidate.email;
    document.getElementById('scheduleCandidateScore').textContent = `Match Score: ${candidate.score}% - ${candidate.recommendation}`;
    
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('interviewDate').value = tomorrow.toISOString().split('T')[0];
    
    // Set default time to 10 AM
    document.getElementById('interviewTime').value = '10:00';
    
    // Show modal
    document.getElementById('scheduleModal').classList.remove('hidden');
}

function closeScheduleModal() {
    document.getElementById('scheduleModal').classList.add('hidden');
    currentCandidate = null;
}

function sendCalendarInvite(platform) {
    const date = document.getElementById('interviewDate').value;
    const time = document.getElementById('interviewTime').value;
    const duration = document.getElementById('interviewDuration').value;
    const type = document.getElementById('interviewType').value;
    const meetingLink = document.getElementById('meetingLink').value;
    const notes = document.getElementById('interviewNotes').value;
    
    if (!date || !time) {
        showNotification('Please select date and time', 'error');
        return;
    }
    
    const interviewData = {
        candidate: currentCandidate.name,
        email: currentCandidate.email,
        date: date,
        time: time,
        duration: duration + ' minutes',
        type: type,
        meetingLink: meetingLink,
        notes: notes,
        position: document.getElementById('position').value
    };
    
    // Simulate different platform integrations
    switch(platform) {
        case 'google':
            createGoogleCalendarEvent(interviewData);
            break;
        case 'calendly':
            createCalendlyEvent(interviewData);
            break;
        case 'email':
            sendEmailInvite(interviewData);
            break;
    }
    
    closeScheduleModal();
}

function createGoogleCalendarEvent(data) {
    // In production: Use Google Calendar API
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Interview: ${encodeURIComponent(data.candidate)}&dates=${data.date.replace(/-/g,'')}T${data.time.replace(':','')}00/${data.date.replace(/-/g,'')}T${data.time.replace(':','')}00&details=${encodeURIComponent('Position: ' + data.position + '\n\nNotes: ' + data.notes)}&add=${encodeURIComponent(data.email)}`;
    
    window.open(calendarUrl, '_blank');
    showNotification(`Google Calendar invite created for ${data.candidate}`, 'success');
}

function createCalendlyEvent(data) {
    // In production: Use Calendly API
    showNotification(`Calendly invite sent to ${data.candidate} (${data.email})`, 'success');
    console.log('Calendly Event:', data);
}

function sendEmailInvite(data) {
    // Create email with interview details
    const subject = encodeURIComponent(`Interview Invitation - ${data.position}`);
    const body = encodeURIComponent(`Dear ${data.candidate},

We are pleased to invite you for an interview for the position of ${data.position}.

Interview Details:
- Date: ${data.date}
- Time: ${data.time}
- Duration: ${data.duration}
- Type: ${data.type}
${data.meetingLink ? `- Meeting Link: ${data.meetingLink}` : ''}

${data.notes ? `Additional Notes:\n${data.notes}` : ''}

We look forward to speaking with you!

Best regards`);
    
    window.location.href = `mailto:${data.email}?subject=${subject}&body=${body}`;
    showNotification(`Email draft created for ${data.candidate}`, 'success');
}

// Share Candidate Functions
function exportCandidate(index) {
    const candidate = state.results[index];
    if (!candidate) return;
    
    currentCandidate = candidate;
    
    // Populate share modal
    document.getElementById('shareCandidateName').textContent = candidate.name;
    document.getElementById('shareCandidateEmail').textContent = candidate.email;
    document.getElementById('shareCandidateScore').textContent = `Match Score: ${candidate.score}% - ${candidate.recommendation}`;
    
    // Show modal
    document.getElementById('shareModal').classList.remove('hidden');
}

function closeShareModal() {
    document.getElementById('shareModal').classList.add('hidden');
    currentCandidate = null;
}

function downloadCandidatePDF() {
    if (!currentCandidate) return;
    
    // Create downloadable report
    const report = `
CANDIDATE ANALYSIS REPORT
========================

Name: ${currentCandidate.name}
Email: ${currentCandidate.email}
Position: ${document.getElementById('position').value}

OVERALL SCORE: ${currentCandidate.score}%
Recommendation: ${currentCandidate.recommendation}

DETAILED SCORES:
- Skills Match: ${currentCandidate.skillMatch}%
- Experience Match: ${currentCandidate.experienceMatch}%
- Education Match: ${currentCandidate.educationMatch}%

MATCHED SKILLS:
${currentCandidate.matchedSkills.map(s => '✓ ' + s).join('\n')}

MISSING SKILLS:
${currentCandidate.missingSkills.map(s => '✗ ' + s).join('\n')}

AI INSIGHTS:
${currentCandidate.insights.join('\n')}

RESUME:
${currentCandidate.content}

---
Generated by AI Resume Screener
Date: ${new Date().toLocaleString()}
    `;
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentCandidate.name.replace(/\s+/g, '_')}_analysis.txt`;
    a.click();
    
    showNotification('Candidate report downloaded', 'success');
}

function copyToClipboard() {
    if (!currentCandidate) return;
    
    const text = `${currentCandidate.name} (${currentCandidate.email})
Score: ${currentCandidate.score}%
Recommendation: ${currentCandidate.recommendation}

Skills Match: ${currentCandidate.skillMatch}%
Experience Match: ${currentCandidate.experienceMatch}%
Education Match: ${currentCandidate.educationMatch}%

Matched Skills: ${currentCandidate.matchedSkills.join(', ')}
Missing Skills: ${currentCandidate.missingSkills.join(', ')}

AI Insights:
${currentCandidate.insights.join('\n')}`;
    
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Candidate details copied to clipboard', 'success');
    });
}

function exportToFirebase() {
    if (!currentCandidate) return;
    
    // In production: Save to Firebase
    const firebaseData = {
        ...currentCandidate,
        position: document.getElementById('position').value,
        exportedAt: new Date().toISOString()
    };
    
    console.log('Firebase Export:', firebaseData);
    showNotification(`${currentCandidate.name} saved to Firebase`, 'success');
    
    // Simulate saving
    setTimeout(() => {
        closeShareModal();
    }, 1000);
}

function exportToSheets() {
    if (!currentCandidate) return;
    
    // In production: Use Google Sheets API
    const sheetsData = [
        currentCandidate.name,
        currentCandidate.email,
        currentCandidate.score,
        currentCandidate.skillMatch,
        currentCandidate.experienceMatch,
        currentCandidate.educationMatch,
        currentCandidate.recommendation,
        currentCandidate.matchedSkills.join(', '),
        currentCandidate.missingSkills.join(', ')
    ];
    
    console.log('Google Sheets Export:', sheetsData);
    showNotification(`${currentCandidate.name} added to Google Sheets`, 'success');
    
    setTimeout(() => {
        closeShareModal();
    }, 1000);
}

function shareViaEmail() {
    if (!currentCandidate) return;
    
    const subject = encodeURIComponent(`Candidate Review: ${currentCandidate.name}`);
    const body = encodeURIComponent(`Hi,

I wanted to share this candidate profile with you:

Name: ${currentCandidate.name}
Email: ${currentCandidate.email}
Position: ${document.getElementById('position').value}
Match Score: ${currentCandidate.score}%
Recommendation: ${currentCandidate.recommendation}

Key Highlights:
- Skills Match: ${currentCandidate.skillMatch}%
- Experience Match: ${currentCandidate.experienceMatch}%
- Education Match: ${currentCandidate.educationMatch}%

Matched Skills: ${currentCandidate.matchedSkills.join(', ')}

AI Insights:
${currentCandidate.insights.join('\n')}

Please review and let me know your thoughts.

Best regards`);
    
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    showNotification('Email draft created', 'success');
}

function exportResults() {
    showNotification('Exporting all results to Google Sheets', 'success');
    // In production: Export to Google Sheets API
    
    // Download JSON
    const dataStr = JSON.stringify(state.results, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `screening-results-${new Date().toISOString()}.json`;
    a.click();
}

// UI Functions
function showProcessing() {
    document.getElementById('processingOverlay').classList.remove('hidden');
}

function hideProcessing() {
    document.getElementById('processingOverlay').classList.add('hidden');
}

function updateProgress(percent) {
    document.getElementById('progressBar').style.width = percent + '%';
    document.getElementById('progressText').textContent = Math.round(percent) + '%';
}

function clearAll() {
    if (confirm('Clear all resumes and results?')) {
        state.resumes = [...sampleResumes];
        state.results = [];
        updateUploadedFiles();
        document.getElementById('resultsSection').classList.add('hidden');
        showNotification('Reset complete', 'info');
    }
}

function showNotification(message, type) {
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    };
    
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 fade-in`;
    notification.innerHTML = `<i class="fas fa-info-circle mr-2"></i>${message}`;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Initialize app
init();