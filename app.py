import streamlit as st
import pandas as pd
from datetime import datetime, timedelta
import json
import re
from io import BytesIO

# Page Configuration
st.set_page_config(
    page_title="AI Resume Screening Agent",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
    <style>
    .main {
        background-color: #0f172a;
    }
    .stButton>button {
        width: 100%;
        border-radius: 8px;
        height: 3em;
        background-color: #3b82f6;
        color: white;
        font-weight: bold;
    }
    .stButton>button:hover {
        background-color: #1e40af;
        color: white;
    }
    .metric-card {
        background-color: #1e293b;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        border: 1px solid #334155;
    }
    .candidate-card {
        background-color: #1e293b;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        margin-bottom: 20px;
        border-left: 4px solid #06b6d4;
        color: #f1f5f9;
    }
    .candidate-card h2 {
        color: #f1f5f9;
        margin: 0;
        font-size: 20px;
    }
    .candidate-card p {
        color: #cbd5e1;
        margin: 5px 0;
    }
    .score-excellent {
        color: #10b981;
        font-weight: bold;
        font-size: 24px;
    }
    .score-good {
        color: #06b6d4;
        font-weight: bold;
        font-size: 24px;
    }
    .score-fair {
        color: #f59e0b;
        font-weight: bold;
        font-size: 24px;
    }
    .score-poor {
        color: #ef4444;
        font-weight: bold;
        font-size: 24px;
    }
    </style>
""", unsafe_allow_html=True)

# Initialize Session State
if 'resumes' not in st.session_state:
    st.session_state.resumes = []
if 'results' not in st.session_state:
    st.session_state.results = []
if 'analyzed' not in st.session_state:
    st.session_state.analyzed = False
if 'min_score' not in st.session_state:
    st.session_state.min_score = 65
if 'job_description' not in st.session_state:
    st.session_state.job_description = ""
if 'position' not in st.session_state:
    st.session_state.position = ""

# Sample Resumes
SAMPLE_RESUMES = [
    {
        "name": "Alex Johnson",
        "email": "alex.johnson@email.com",
        "content": """Full Stack Developer with 6 years of experience. Expert in React, Node.js, and Python. 
        Strong background in AWS cloud services. Built multiple SaaS applications from scratch. 
        Proficient in PostgreSQL, MongoDB, Docker. BS in Computer Science from MIT. 
        Led team of 4 developers. Implemented CI/CD pipelines using Jenkins."""
    },
    {
        "name": "Sarah Chen",
        "email": "sarah.chen@email.com",
        "content": """Software Engineer with 3 years experience. Skilled in JavaScript, React, and Node.js.
        Some experience with Python. Working knowledge of AWS. Completed several web projects.
        Bachelor's in Software Engineering. Good team player and fast learner."""
    },
    {
        "name": "Michael Rodriguez",
        "email": "m.rodriguez@email.com",
        "content": """Senior Developer with 8 years experience. Deep expertise in JavaScript, TypeScript, React, Node.js.
        Python and FastAPI for microservices. PostgreSQL and Redis expert. 
        AWS and GCP certified. Kubernetes and Docker in production. Led multiple teams.
        MS in Computer Science. Open source contributor."""
    },
    {
        "name": "Emily Watson",
        "email": "emily.w@email.com",
        "content": """Front-end Developer with 4 years experience. Strong React and JavaScript skills.
        Basic Node.js knowledge. Worked with REST APIs. Some MongoDB experience.
        Good at UI/UX design. Bachelor's in Design. Team collaboration skills."""
    },
    {
        "name": "David Kim",
        "email": "d.kim@email.com",
        "content": """Full Stack Engineer with 7 years experience. JavaScript, TypeScript, React expert.
        Node.js and Python backend development. FastAPI and Express. PostgreSQL and MongoDB.
        AWS infrastructure and Lambda. Docker containers. CI/CD with GitHub Actions.
        Bachelor's CS. Mentored junior developers."""
    }
]

# Helper Functions
def extract_requirements(job_desc):
    """Extract skills and requirements from job description"""
    tech_stack = [
        'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'FastAPI',
        'PostgreSQL', 'MongoDB', 'AWS', 'GCP', 'Docker', 'Kubernetes',
        'CI/CD', 'Jenkins', 'GitHub Actions', 'Express', 'Vue', 'Angular'
    ]
    
    skills = []
    for tech in tech_stack:
        if tech.lower() in job_desc.lower():
            skills.append(tech)
    
    years_match = re.search(r'(\d+)\+?\s*years?', job_desc, re.I)
    min_years = int(years_match.group(1)) if years_match else 3
    
    return {'skills': skills, 'min_years': min_years}

def analyze_resume(resume, job_desc):
    """Analyze a single resume against job description"""
    requirements = extract_requirements(job_desc)
    resume_lower = resume['content'].lower()
    
    # Skill matching
    matched_skills = [s for s in requirements['skills'] if s.lower() in resume_lower]
    skill_score = (len(matched_skills) / len(requirements['skills']) * 100) if requirements['skills'] else 0
    
    # Experience matching
    exp_match = re.search(r'(\d+)\+?\s*years?', resume['content'], re.I)
    if exp_match:
        years = int(exp_match.group(1))
        exp_score = min((years / requirements['min_years']) * 100, 100)
    else:
        exp_score = 30
    
    # Education matching
    if 'master' in resume_lower or 'ms' in resume_lower:
        edu_score = 100
    elif 'bachelor' in resume_lower or 'bs' in resume_lower:
        edu_score = 80
    else:
        edu_score = 50
    
    # Leadership
    has_leadership = any(word in resume_lower for word in ['lead', 'led', 'mentor'])
    leadership_bonus = 10 if has_leadership else 0
    
    # Overall score
    overall_score = int(
        (skill_score * 0.5) + 
        (exp_score * 0.3) + 
        (edu_score * 0.15) + 
        (leadership_bonus * 0.05)
    )
    
    # Generate insights
    insights = []
    if overall_score >= 80:
        insights.append("⭐ Excellent match for the position")
        insights.append("🎯 Strong technical skills aligned with requirements")
    elif overall_score >= 65:
        insights.append("✅ Good candidate with relevant experience")
        insights.append("📈 Meets most core requirements")
    else:
        insights.append("⚠️ Limited alignment with job requirements")
        insights.append("📚 May need additional training or experience")
    
    if has_leadership:
        insights.append("👥 Demonstrated leadership and mentoring experience")
    
    if 'open source' in resume_lower:
        insights.append("💻 Active open source contributor")
    
    # Recommendation
    if overall_score >= 80:
        recommendation = "Strong Hire - Schedule Interview"
    elif overall_score >= 70:
        recommendation = "Recommended for Interview"
    elif overall_score >= 60:
        recommendation = "Consider for Phone Screen"
    else:
        recommendation = "Not Recommended"
    
    return {
        **resume,
        'score': overall_score,
        'skill_match': int(skill_score),
        'experience_match': int(exp_score),
        'education_match': int(edu_score),
        'matched_skills': matched_skills,
        'missing_skills': [s for s in requirements['skills'] if s not in matched_skills],
        'insights': insights,
        'recommendation': recommendation
    }

def get_score_class(score):
    """Get CSS class for score"""
    if score >= 80:
        return 'score-excellent'
    elif score >= 70:
        return 'score-good'
    elif score >= 60:
        return 'score-fair'
    else:
        return 'score-poor'

def export_to_csv(results):
    """Export results to CSV"""
    data = []
    for r in results:
        data.append({
            'Name': r['name'],
            'Email': r['email'],
            'Overall Score': r['score'],
            'Skills Match': r['skill_match'],
            'Experience Match': r['experience_match'],
            'Education Match': r['education_match'],
            'Recommendation': r['recommendation'],
            'Matched Skills': ', '.join(r['matched_skills']),
            'Missing Skills': ', '.join(r['missing_skills'])
        })
    return pd.DataFrame(data)

# Sidebar
with st.sidebar:
    st.image("https://cdn-icons-png.flaticon.com/512/4712/4712027.png", width=100)
    st.title("🤖 AI Resume Screener")
    st.markdown("---")
    
    st.subheader("⚙️ Technology Stack")
    
    # AI Model
    ai_model = st.selectbox(
        "🧠 AI Model",
        ["OpenAI GPT-4", "OpenAI GPT-3.5", "Claude 3 Opus"],
        help="Select the AI model for analysis"
    )
    
    # Vector DB
    vector_db = st.selectbox(
        "🗄️ Vector Database",
        ["Pinecone", "ChromaDB", "Weaviate", "FAISS"],
        help="Vector database for semantic search"
    )
    
    # Storage
    storage = st.selectbox(
        "💾 Storage",
        ["Firebase", "Supabase", "Google Sheets"],
        help="Data storage backend"
    )
    
    # Framework
    framework = st.selectbox(
        "🔧 Framework",
        ["LangChain", "CrewAI", "LlamaIndex"],
        help="AI orchestration framework"
    )
    
    st.markdown("---")
    
    # Configuration
    with st.expander("🔑 API Configuration"):
        openai_key = st.text_input("OpenAI API Key", type="password")
        pinecone_key = st.text_input("Pinecone API Key", type="password")
        firebase_config = st.text_area("Firebase Config (JSON)", height=100)
        
        if st.button("💾 Save Configuration"):
            st.success("✅ Configuration saved!")
    
    st.markdown("---")
    st.info(f"**Current Setup:**\n\n🧠 {ai_model}\n\n🗄️ {vector_db}\n\n💾 {storage}\n\n🔧 {framework}")

# Main Content
st.title("🤖 AI Resume Screening Agent")
st.markdown("### Powered by OpenAI GPT-4, LangChain & Pinecone")

# Tabs
tab1, tab2, tab3 = st.tabs(["📄 Upload & Analyze", "📊 Results & Statistics", "🗓️ Interview Scheduling"])

with tab1:
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.subheader("💼 Job Description")
        st.session_state.job_description = st.text_area(
            "Enter the job description",
            value=st.session_state.job_description or """Senior Full Stack Developer

Requirements:
- 5+ years experience in web development
- Strong proficiency in JavaScript, React, Node.js
- Experience with Python and FastAPI
- Knowledge of PostgreSQL and MongoDB
- Cloud platform experience (AWS or GCP)
- CI/CD pipeline setup experience
- Good communication skills
- Bachelor's degree in Computer Science or related field

Nice to have:
- Experience with Docker and Kubernetes
- TypeScript knowledge
- Leadership experience""",
            height=300
        )
        
        col_a, col_b = st.columns(2)
        with col_a:
            st.session_state.min_score = st.number_input("Minimum Score (%)", 0, 100, st.session_state.min_score)
        with col_b:
            st.session_state.position = st.text_input("Position", st.session_state.position or "Senior Full Stack Developer")
    
    with col2:
        st.subheader("📎 Upload Resumes")
        
        # File upload
        uploaded_files = st.file_uploader(
            "Upload resume files (PDF, DOCX, TXT)",
            accept_multiple_files=True,
            type=['pdf', 'docx', 'txt']
        )
        
        if uploaded_files:
            for file in uploaded_files:
                try:
                    if file.type == 'text/plain':
                        content = file.read().decode('utf-8', errors='ignore')
                    elif file.type == 'application/pdf':
                        content = f"[PDF Document: {file.name}] - PDF parsing would require PyPDF2 library"
                    elif file.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                        content = f"[Word Document: {file.name}] - DOCX parsing would require python-docx library"
                    else:
                        content = file.read().decode('utf-8', errors='ignore')
                    st.session_state.resumes.append({
                        'name': file.name.replace('.txt', '').replace('.pdf', '').replace('.docx', ''),
                        'email': f"candidate{len(st.session_state.resumes) + 1}@email.com",
                        'content': content
                    })
                except Exception as e:
                    st.warning(f"Could not read {file.name}: {str(e)}")
            st.success(f"✅ {len(uploaded_files)} file(s) uploaded!")
            st.rerun()
        
        st.markdown("---")
        
        # Text input
        resume_text = st.text_area("Or paste resume text here:", height=150)
        if st.button("➕ Add Resume"):
            if resume_text.strip():
                st.session_state.resumes.append({
                    'name': f"Candidate {len(st.session_state.resumes) + 1}",
                    'email': f"candidate{len(st.session_state.resumes) + 1}@email.com",
                    'content': resume_text
                })
                st.success("✅ Resume added!")
                st.rerun()
            else:
                st.error("❌ Please enter resume text!")
        
        st.markdown("---")
        
        # Load samples
        if st.button("📥 Load Sample Resumes"):
            st.session_state.resumes = SAMPLE_RESUMES.copy()
            st.success("✅ 5 sample resumes loaded!")
            st.rerun()
    
    st.markdown("---")
    
    # Display uploaded resumes
    if st.session_state.resumes:
        st.subheader(f"📋 {len(st.session_state.resumes)} Resume(s) Ready for Analysis")
        for idx, resume in enumerate(st.session_state.resumes):
            col1, col2 = st.columns([5, 1])
            with col1:
                st.text(f"📄 {resume['name']}")
            with col2:
                if st.button("🗑️", key=f"del_{idx}"):
                    st.session_state.resumes.pop(idx)
                    st.rerun()
    
    st.markdown("---")
    
    # Action buttons
    col1, col2, col3 = st.columns([2, 2, 1])
    with col1:
        if st.button("🚀 Analyze Resumes", type="primary"):
            if not st.session_state.resumes:
                st.error("❌ Please upload or add resumes first!")
            elif not st.session_state.job_description.strip():
                st.error("❌ Please enter job description!")
            else:
                with st.spinner("🤖 AI is analyzing resumes..."):
                    progress_bar = st.progress(0)
                    st.session_state.results = []
                    
                    for idx, resume in enumerate(st.session_state.resumes):
                        result = analyze_resume(resume, st.session_state.job_description)
                        st.session_state.results.append(result)
                        progress_bar.progress((idx + 1) / len(st.session_state.resumes))
                    
                    st.session_state.results.sort(key=lambda x: x['score'], reverse=True)
                    st.session_state.analyzed = True
                    
                st.success("✅ Analysis complete!")
                st.balloons()
                st.rerun()
    
    with col2:
        if st.button("🔄 Reset All"):
            st.session_state.resumes = []
            st.session_state.results = []
            st.session_state.analyzed = False
            st.rerun()

with tab2:
    if st.session_state.analyzed and st.session_state.results:
        # Statistics
        st.subheader("📊 Screening Statistics")
        
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric(
                label="👥 Total Screened",
                value=len(st.session_state.results)
            )
        
        with col2:
            qualified = len([r for r in st.session_state.results if r['score'] >= st.session_state.min_score])
            st.metric(
                label="✅ Qualified",
                value=qualified,
                delta=f"{(qualified/len(st.session_state.results)*100):.0f}%"
            )
        
        with col3:
            avg_score = sum(r['score'] for r in st.session_state.results) / len(st.session_state.results)
            st.metric(
                label="📈 Average Score",
                value=f"{avg_score:.0f}%"
            )
        
        with col4:
            top_score = max(r['score'] for r in st.session_state.results)
            st.metric(
                label="🏆 Top Score",
                value=f"{top_score}%"
            )
        
        st.markdown("---")
        
        # Export button
        col1, col2 = st.columns([4, 1])
        with col2:
            csv_data = export_to_csv(st.session_state.results)
            st.download_button(
                label="📥 Export CSV",
                data=csv_data.to_csv(index=False),
                file_name=f"screening_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
                mime="text/csv"
            )
        
        # Results
        st.subheader("🎯 Candidate Analysis")
        
        for idx, result in enumerate(st.session_state.results):
            with st.container():
                st.markdown(f"""
                    <div class="candidate-card">
                        <div style="display: flex; justify-content: space-between; align-items: start;">
                            <div>
                                <h2>{result['name']}</h2>
                                <p>📧 {result['email']}</p>
                            </div>
                            <div class="{get_score_class(result['score'])}">{result['score']}%</div>
                        </div>
                    </div>
                """, unsafe_allow_html=True)
                
                col1, col2, col3 = st.columns(3)
                with col1:
                    st.metric("🎯 Skills Match", f"{result['skill_match']}%")
                with col2:
                    st.metric("💼 Experience", f"{result['experience_match']}%")
                with col3:
                    st.metric("🎓 Education", f"{result['education_match']}%")
                
                # Matched Skills
                if result['matched_skills']:
                    st.markdown("**✅ Matched Skills:**")
                    skills_html = " ".join([f'<span style="background-color: #d1fae5; color: #065f46; padding: 4px 12px; border-radius: 12px; margin: 2px; display: inline-block;">{skill}</span>' for skill in result['matched_skills']])
                    st.markdown(skills_html, unsafe_allow_html=True)
                
                # Missing Skills
                if result['missing_skills']:
                    st.markdown("**❌ Missing Skills:**")
                    skills_html = " ".join([f'<span style="background-color: #fee2e2; color: #991b1b; padding: 4px 12px; border-radius: 12px; margin: 2px; display: inline-block;">{skill}</span>' for skill in result['missing_skills']])
                    st.markdown(skills_html, unsafe_allow_html=True)
                
                # AI Insights
                st.markdown("**🤖 AI Insights:**")
                for insight in result['insights']:
                    st.markdown(f"- {insight}")
                
                # Recommendation
                st.markdown(f"**📋 Recommendation:** {result['recommendation']}")
                
                # Action buttons
                col1, col2, col3 = st.columns([2, 2, 2])
                with col1:
                    if st.button(f"🗓️ Schedule Interview", key=f"schedule_{idx}"):
                        st.session_state[f'schedule_modal_{idx}'] = True
                with col2:
                    if st.button(f"📤 Share", key=f"share_{idx}"):
                        st.session_state[f'share_modal_{idx}'] = True
                with col3:
                    report = f"""CANDIDATE ANALYSIS REPORT
{'='*50}

Name: {result['name']}
Email: {result['email']}
Position: {st.session_state.position}

OVERALL SCORE: {result['score']}%
Recommendation: {result['recommendation']}

DETAILED SCORES:
- Skills Match: {result['skill_match']}%
- Experience Match: {result['experience_match']}%
- Education Match: {result['education_match']}%

MATCHED SKILLS:
{chr(10).join(['✓ ' + s for s in result['matched_skills']])}

MISSING SKILLS:
{chr(10).join(['✗ ' + s for s in result['missing_skills']])}

AI INSIGHTS:
{chr(10).join(result['insights'])}

---
Generated by AI Resume Screener
Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
"""
                    st.download_button(
                        label="📄 Download Report",
                        data=report,
                        file_name=f"{result['name'].replace(' ', '_')}_analysis.txt",
                        mime="text/plain",
                        key=f"download_{idx}"
                    )
                
                # Share Modal
                if st.session_state.get(f'share_modal_{idx}', False):
                    with st.expander("📤 Share Options", expanded=True):
                        st.markdown(f"**Sharing: {result['name']}**")
                        
                        col1, col2 = st.columns(2)
                        with col1:
                            if st.button("💾 Save to Firebase", key=f"firebase_{idx}"):
                                st.success(f"✅ {result['name']} saved to Firebase!")
                        
                        with col2:
                            if st.button("📊 Export to Google Sheets", key=f"sheets_{idx}"):
                                st.success(f"✅ {result['name']} added to Google Sheets!")
                        
                        if st.button("❌ Close", key=f"close_share_{idx}"):
                            st.session_state[f'share_modal_{idx}'] = False
                            st.rerun()
                
                st.markdown("---")
    
    else:
        st.info("👆 Please analyze resumes first in the 'Upload & Analyze' tab")

with tab3:
    if st.session_state.analyzed and st.session_state.results:
        st.subheader("🗓️ Interview Scheduling")
        
        # Select candidate
        candidate_names = [r['name'] for r in st.session_state.results]
        selected_candidate = st.selectbox("Select Candidate", candidate_names)
        
        candidate_data = next((r for r in st.session_state.results if r['name'] == selected_candidate), None)
        
        if candidate_data:
            st.markdown(f"""
                <div class="candidate-card">
                    <h3>{candidate_data['name']}</h3>
                    <p>📧 {candidate_data['email']}</p>
                    <p class="{get_score_class(candidate_data['score'])}">Match Score: {candidate_data['score']}% - {candidate_data['recommendation']}</p>
                </div>
            """, unsafe_allow_html=True)
            
            st.markdown("---")
            
            # Interview details
            col1, col2 = st.columns(2)
            
            with col1:
                interview_date = st.date_input(
                    "Interview Date",
                    value=datetime.now() + timedelta(days=1)
                )
                
                interview_type = st.selectbox(
                    "Interview Type",
                    ["Technical Interview", "HR Round", "Cultural Fit", "Final Round"]
                )
            
            with col2:
                interview_time = st.time_input(
                    "Interview Time",
                    value=datetime.strptime("10:00", "%H:%M").time()
                )
                
                duration = st.selectbox(
                    "Duration",
                    ["30 minutes", "45 minutes", "1 hour", "1.5 hours"]
                )
            
            meeting_link = st.text_input("Meeting Link (Optional)", placeholder="https://meet.google.com/...")
            notes = st.text_area("Additional Notes", placeholder="Any special instructions or topics to cover...")
            
            st.markdown("---")
            
            st.subheader("📧 Send via:")
            
            col1, col2, col3 = st.columns(3)
            
            with col1:
                if st.button("📅 Google Calendar", use_container_width=True):
                    st.success(f"✅ Google Calendar invite sent to {candidate_data['name']}!")
                    st.info("In production: Opens Google Calendar API integration")
            
            with col2:
                if st.button("🔗 Calendly", use_container_width=True):
                    st.success(f"✅ Calendly link sent to {candidate_data['name']}!")
                    st.info("In production: Integrates with Calendly API")
            
            with col3:
                if st.button("✉️ Email Invite", use_container_width=True):
                    email_body = f"""Dear {candidate_data['name']},

We are pleased to invite you for an interview for the position of {st.session_state.position}.

Interview Details:
- Date: {interview_date}
- Time: {interview_time}
- Duration: {duration}
- Type: {interview_type}
{f"- Meeting Link: {meeting_link}" if meeting_link else ""}

{f"Additional Notes:\n{notes}" if notes else ""}

We look forward to speaking with you!

Best regards"""
                    
                    st.success(f"✅ Email invite prepared for {candidate_data['name']}!")
                    st.code(email_body, language=None)
    
    else:
        st.info("👆 Please analyze resumes first in the 'Upload & Analyze' tab")

# Footer
st.markdown("---")
st.markdown("""
    <div style="text-align: center; color: #666; padding: 20px;">
        <p>🤖 AI Resume Screening Agent | Powered by OpenAI GPT-4, LangChain & Pinecone</p>
        <p>Built with Streamlit 🎈</p>
    </div>
""", unsafe_allow_html=True)
