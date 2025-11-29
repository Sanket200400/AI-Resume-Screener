# 🤖 AI Resume Screening Agent - Streamlit App

A powerful AI-powered resume screening application built with Streamlit, featuring intelligent candidate analysis, interview scheduling, and comprehensive reporting.

## 🌟 Features

- **AI-Powered Analysis** - Smart resume screening using configurable AI models
- **Multiple Tech Stack Options**:
  - AI Models: OpenAI GPT-4, GPT-3.5, Claude 3
  - Vector Databases: Pinecone, ChromaDB, Weaviate, FAISS
  - Storage: Firebase, Supabase, Google Sheets
  - Frameworks: LangChain, CrewAI, LlamaIndex

- **Resume Upload** - Drag & drop files or paste text directly
- **Intelligent Scoring**:
  - Skills matching
  - Experience evaluation
  - Education assessment
  - Leadership detection

- **Visual Analytics** - Color-coded scores, statistics dashboard, detailed breakdowns
- **Interview Scheduling** - Integration with Google Calendar, Calendly, and Email
- **Export Options** - Download reports, CSV exports, share via multiple platforms
- **Sample Data** - 5 pre-loaded sample resumes for testing

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher installed
- pip package manager
- Windows, macOS, or Linux OS
- Internet connection

### Step-by-Step Installation & Setup

#### **Step 1: Download the Project**
```bash
# Option A: Clone from GitHub
git clone https://github.com/yourusername/resume-screening-agent.git
cd resume-screening-agent

# Option B: Download ZIP and extract
# Then navigate to the folder in terminal
cd path/to/Resume\ Screening\ Agent
```

#### **Step 2: Create Virtual Environment (Recommended)**
```bash
# On Windows (PowerShell)
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# On macOS/Linux
python3 -m venv .venv
source .venv/bin/activate
```

#### **Step 3: Install Dependencies**
```bash
# Upgrade pip first
pip install --upgrade pip setuptools wheel

# Install required packages
pip install -r requirements.txt

# Or install manually
pip install streamlit==1.29.0 pandas==2.1.4 python-dateutil==2.8.2
```

#### **Step 4: Run the Application**
```bash
# Navigate to project folder (if not already there)
cd path/to/Resume\ Screening\ Agent

# Run Streamlit app
streamlit run app.py
```

#### **Step 5: Access the Application**
- **Local URL**: Open your browser and go to `http://localhost:8501`
- **Network URL**: Access from other devices on your network at `http://[your-ip]:8501`
- The browser should open automatically

### Troubleshooting Installation

**Error: "Command not found: streamlit"**
- Ensure virtual environment is activated
- Reinstall: `pip install streamlit --upgrade`

**Error: "ModuleNotFoundError: No module named 'streamlit'"**
- Run `pip install -r requirements.txt` again
- Verify you're in the correct virtual environment

**Error: "Python not found"**
- Ensure Python 3.8+ is installed
- Check PATH environment variable
- Restart your terminal after installation

**Port 8501 already in use**
- Use different port: `streamlit run app.py --server.port 8502`
- Or close other Streamlit instances: `Kill-Process -Name streamlit` (PowerShell)

## 🌐 Deploy to Streamlit Cloud (FREE!)

### Get Your Working Demo Link in 3 Steps:

1. **Push to GitHub:**
   - Create a new GitHub repository
   - Upload `app.py` and `requirements.txt`

2. **Deploy on Streamlit Cloud:**
   - Go to [share.streamlit.io](https://share.streamlit.io)
   - Click "New app"
   - Select your GitHub repository
   - Set main file to `app.py`
   - Click "Deploy"

3. **Get Your Demo Link:**
   - Your app will be live at: `https://[your-app-name].streamlit.app`
   - Share this link anywhere!

## 📖 How to Use the Application

### Getting Started

#### **Step 1: Load Sample Resumes (Demo Mode)**
1. Go to the **"📄 Upload & Analyze"** tab
2. Click the **"📥 Load Sample Resumes"** button
3. You'll see 5 pre-loaded sample candidates
4. Skip to Step 3 below

#### **Step 2: Upload Your Own Resumes**

**Option A - Upload Files:**
1. Click **"📎 Upload Resumes"** section
2. Click **"Browse files"** to select files
3. Choose resume files (PDF, DOCX, or TXT)
4. You can upload multiple files at once
5. Files appear in the "Resume(s) Ready for Analysis" section

**Option B - Paste Resume Text:**
1. Scroll down to **"Or paste resume text here"**
2. Copy and paste a resume into the text area
3. Click **"➕ Add Resume"** button
4. Resume is added to your list

#### **Step 3: Configure Job Requirements**
1. In the **left panel**, enter your **Job Description**
   - Example: Include required skills, years of experience, education
   - Be specific about technologies needed (React, Node.js, Python, etc.)

2. Set **Minimum Score (%)** 
   - Range: 0-100%
   - Default: 65%
   - Only candidates meeting this score will be marked as "Qualified"

3. Enter **Position Title**
   - Example: "Senior Full Stack Developer"
   - Used in interview invitations and reports

#### **Step 4: Analyze Resumes**
1. Ensure you have:
   - ✅ At least one resume added
   - ✅ Job description filled in
2. Click **"🚀 Analyze Resumes"** button (blue)
3. Wait for analysis to complete (progress bar shows status)
4. See **"✅ Analysis complete!"** message

#### **Step 5: View Results & Statistics**
1. Click the **"📊 Results & Statistics"** tab
2. See dashboard with:
   - 👥 Total Screened (number of candidates)
   - ✅ Qualified (candidates above minimum score)
   - 📈 Average Score (average of all scores)
   - 🏆 Top Score (highest score)

#### **Step 6: Review Candidate Details**
For each candidate, you'll see:
- **Overall Score** - Match percentage (0-100%)
- **Skills Match** - How many required skills they have
- **Experience Match** - Years of experience rating
- **Education Match** - Education level score
- **✅ Matched Skills** - Green badges of skills they have
- **❌ Missing Skills** - Red badges of skills they lack
- **🤖 AI Insights** - Smart analysis of candidate fit
- **📋 Recommendation** - Interview stage recommendation

#### **Step 7: Take Action**

**Download Individual Report:**
1. Scroll to candidate
2. Click **"📄 Download Report"** button
3. Get a detailed text file with all analysis

**Schedule Interview:**
1. Click **"🗓️ Schedule Interview"** button
2. Fill in interview details:
   - Date and time
   - Interview type (Technical, HR, Cultural, Final)
   - Duration
   - Meeting link (optional)
   - Additional notes
3. Click one of the send options:
   - 📅 Google Calendar
   - 🔗 Calendly
   - ✉️ Email Invite

**Share Candidate:**
1. Click **"📤 Share"** button
2. Choose destination:
   - 💾 Firebase - Save to database
   - 📊 Google Sheets - Add to spreadsheet

**Export All Results:**
1. Click **"📥 Export CSV"** button at top
2. Download all candidates as spreadsheet
3. Open in Excel or Google Sheets

#### **Step 8: Configure Technology Stack (Optional)**
1. Open **Sidebar** on the left
2. Expand each section:
   - 🧠 **AI Model** - Choose GPT-4, GPT-3.5, or Claude 3
   - 🗄️ **Vector Database** - Select Pinecone, ChromaDB, etc.
   - 💾 **Storage** - Choose Firebase, Supabase, etc.
   - 🔧 **Framework** - Select LangChain, CrewAI, etc.

3. Expand **"🔑 API Configuration"**
   - Add your OpenAI API Key
   - Add your Pinecone API Key
   - Add Firebase Configuration (JSON)
   - Click **"💾 Save Configuration"**

#### **Step 9: Reset and Start Over**
1. Click **"🔄 Reset All"** button
2. All resumes and results are cleared
3. Start fresh with new batch

### Use Case Workflows

**Quick Demo (5 minutes):**
```
1. Click "Load Sample Resumes"
2. Review job description (already filled)
3. Click "Analyze Resumes"
4. View results in "Results & Statistics" tab
```

**Screen Real Candidates (15 minutes):**
```
1. Upload your resume files
2. Paste your job description
3. Set minimum score threshold
4. Run analysis
5. Download CSV report
6. Schedule interviews for top candidates
```

**Bulk Processing (30 minutes):**
```
1. Upload 20+ resume files
2. Configure job requirements
3. Run analysis
4. Export CSV
5. Share qualified candidates to Google Sheets
6. Send interview invites in bulk
```

## 🛠️ Technology Stack

### Frontend
- **Streamlit** - Interactive web interface
- **Pandas** - Data manipulation

### AI & ML (Configurable)
- **AI Models**: OpenAI GPT-4, Claude 3
- **Frameworks**: LangChain, CrewAI, LlamaIndex
- **Vector DBs**: Pinecone, ChromaDB, Weaviate, FAISS

### Integrations
- Google Calendar API
- Calendly
- Firebase
- Google Sheets

## 📊 Features Breakdown

### Analysis Metrics
- ✅ Overall Match Score (0-100%)
- 🎯 Skills Match Percentage
- 💼 Experience Match Rating
- 🎓 Education Level Score
- 👥 Leadership Indicators

### Export Options
- 📄 Individual candidate reports (TXT)
- 📊 Bulk CSV export
- 💾 Firebase storage
- 📈 Google Sheets integration

### Interview Scheduling
- 📅 Date/time picker
- ⏱️ Duration selector
- 🎯 Interview type (Technical, HR, Cultural, Final)
- 🔗 Meeting link integration
- 📧 Email invite generation

## 🔐 API Configuration

In the sidebar, expand "🔑 API Configuration" to add:
- OpenAI API Key
- Pinecone API Key
- Firebase Configuration (JSON)

*Note: The demo works without API keys using simulated analysis.*

## 📝 Example Use Cases

1. **HR Teams** - Screen hundreds of resumes quickly
2. **Recruiters** - Identify top candidates efficiently
3. **Hiring Managers** - Get AI-powered recommendations
4. **Startups** - Automate initial screening process
5. **Agencies** - Manage multiple client requirements

## 🎨 Customization

### Modify Sample Resumes
Edit the `SAMPLE_RESUMES` list in `app.py` to add your own test data.

### Adjust Scoring Weights
Modify the `analyze_resume()` function to change how scores are calculated:
```python
overall_score = int(
    (skill_score * 0.5) +      # Skills: 50%
    (exp_score * 0.3) +        # Experience: 30%
    (edu_score * 0.15) +       # Education: 15%
    (leadership_bonus * 0.05)  # Leadership: 5%
)
```

### Add More Tech Stack
Expand the `tech_stack` list in `extract_requirements()` to detect more technologies.

## 🐛 Troubleshooting

**Issue: App won't start**
- Ensure Python 3.8+ is installed
- Run `pip install -r requirements.txt` again

**Issue: File upload not working**
- Check file format (PDF, DOCX, TXT)
- Ensure file is text-readable

**Issue: Analysis takes too long**
- Reduce number of resumes
- Simplify job description

## 📦 Dependencies

- `streamlit` - Web framework
- `pandas` - Data handling
- `python-dateutil` - Date utilities

## 🤝 Contributing

Feel free to fork this project and customize it for your needs!

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🎯 Next Steps

To connect real AI models:
1. Add your OpenAI API key in the configuration
2. Install additional packages: `openai`, `langchain`, `pinecone-client`
3. Modify the `analyze_resume()` function to use real AI calls
4. Add vector database integration for semantic search

## 🔗 Useful Links

- [Streamlit Documentation](https://docs.streamlit.io)
- [Streamlit Cloud](https://share.streamlit.io)
- [OpenAI API](https://openai.com/api)
- [LangChain](https://langchain.com)
- [Pinecone](https://www.pinecone.io)

---

**Built with ❤️ using Streamlit**

**🌟 Star this repo if you find it useful!**