# 🚀 Explaina Complete Setup Guide

This guide will help you set up the complete Explaina system with both the browser extension and the AI backend.

## 📋 Prerequisites

- **Python 3.8+** installed on your system
- **Chrome/Edge browser** for the extension
- **AI Backend**: Choose one option:
  - **🆓 FREE**: Ollama (local LLM) - No API costs
  - **💰 PAID**: OpenAI API key (get one from https://platform.openai.com/api-keys)

## 🏗️ Project Structure

```
explaina-extension/
├── manifest.json          # Extension configuration
├── content.js             # Main content script
├── background.js          # Background service worker
├── popup.html/css/js      # Extension settings
├── styles.css             # Extension styling
├── test-page.html         # Test page for extension
├── backend/               # AI Backend API
│   ├── main.py           # FastAPI application
│   ├── models.py         # Data models
│   ├── openai_client.py  # OpenAI integration
│   ├── requirements.txt  # Python dependencies
│   ├── env.example       # Environment template
│   ├── run.sh           # Startup script
│   └── README.md        # Backend documentation
└── README.md             # Main documentation
```

## 🔧 Step 1: Setup the Backend

### Choose Your AI Backend

**🆓 Option A: Free Setup (Recommended for MVP)**
- Uses Ollama with local LLMs
- No API costs
- Requires 8GB+ RAM
- See `backend/OLLAMA_SETUP.md` for detailed instructions

**💰 Option B: OpenAI Setup (Paid)**
- Uses OpenAI GPT-3.5-turbo
- Requires API key and credits
- Better quality but costs money

### 1.1 Install Backend Dependencies

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 1.2 Configure AI Backend

**For Free Setup (Ollama):**
```bash
# Copy environment template
cp env.example .env

# Configure for free AI
echo "USE_OLLAMA=true" >> .env
echo "OLLAMA_MODEL=llama2" >> .env

# Install Ollama (see OLLAMA_SETUP.md for details)
curl -fsSL https://ollama.ai/install.sh | sh
ollama serve &
ollama pull llama2
```

**For OpenAI Setup (Paid):**
```bash
# Copy environment template
cp env.example .env

# Edit .env file and add your OpenAI API key
# OPENAI_API_KEY=your_actual_api_key_here
# USE_OLLAMA=false
```

### 1.3 Start the Backend Server

```bash
# Option 1: Use the startup script (recommended)
./run.sh

# Option 2: Run directly
python main.py

# Option 3: Use uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Expected output:**
```
🚀 Starting Explaina API server on port 8000
📡 API will be available at: http://localhost:8000
🔗 Extension endpoint: http://localhost:8000/explain
📖 API docs: http://localhost:8000/docs
```

### 1.4 Test the Backend

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test explanation endpoint
curl -X POST http://localhost:8000/explain \
  -H "Content-Type: application/json" \
  -d '{
    "text": "machine learning",
    "context": "Machine learning is a subset of AI.",
    "style": "simple"
  }'
```

## 🔌 Step 2: Setup the Browser Extension

### 2.1 Load the Extension

1. Open Chrome/Edge browser
2. Go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `explaina-extension` folder (not the backend folder)

### 2.2 Verify Extension Installation

- You should see "Explaina" in your extensions list
- The extension icon should appear in your browser toolbar
- Click the icon to open the settings popup

## 🧪 Step 3: Test the Complete System

### 3.1 Test with the Test Page

1. Open `test-page.html` in your browser
2. Select any text on the page
3. Click the "🤖 Explain" button that appears
4. You should see an AI-generated explanation in a tooltip

### 3.2 Test on Real Websites

1. Go to any website with technical content
2. Select technical terms or concepts
3. Click the explain button
4. Get AI-powered explanations!

### 3.3 Test Different Explanation Styles

1. Click the extension icon to open settings
2. Change the "Explanation Style" dropdown
3. Test with different styles:
   - **Simple**: Easy-to-understand explanations
   - **Technical**: Detailed technical explanations
   - **Detailed**: Comprehensive explanations with context

## 🔍 Step 4: Troubleshooting

### Backend Issues

**"OpenAI API not configured"**
```bash
# Check your .env file
cat backend/.env

# Make sure OPENAI_API_KEY is set
export OPENAI_API_KEY=your_key_here
```

**"Failed to generate explanation"**
```bash
# Check server logs
# Look for error messages in the console

# Test API directly
curl http://localhost:8000/health
```

**Port already in use**
```bash
# Change port in .env file
echo "PORT=8001" >> backend/.env

# Or kill existing process
lsof -ti:8000 | xargs kill -9
```

### Extension Issues

**Extension not working**
- Check if backend is running on http://localhost:8000
- Verify extension is enabled in chrome://extensions/
- Check browser console for errors

**Button not appearing**
- Make sure you're selecting text (not just clicking)
- Check if other extensions are interfering
- Try refreshing the page

**No explanations**
- Check if backend API is responding
- Look at browser console for API errors
- Verify CORS is working

## 📊 Step 5: Monitor and Debug

### Backend Logs

The backend logs all requests and responses:
```bash
# Watch server logs
tail -f backend/logs/app.log  # if logging to file
# Or watch console output
```

### Extension Debugging

1. Open browser console (F12)
2. Look for logs starting with "Explaina:"
3. Check Network tab for API requests
4. Use extension popup to test connection

### API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🎯 Step 6: Customization

### Backend Customization

**Add new explanation styles:**
1. Edit `backend/models.py` - add new style to `ExplanationStyle` enum
2. Edit `backend/openai_client.py` - add style-specific prompts
3. Restart the server

**Change OpenAI model:**
1. Edit `backend/openai_client.py`
2. Change `model="gpt-3.5-turbo"` to your preferred model
3. Restart the server

### Extension Customization

**Change API endpoint:**
1. Click extension icon → Settings
2. Change "API Endpoint" field
3. Click "Save Settings"

**Modify styling:**
1. Edit `styles.css` for visual changes
2. Refresh extension in chrome://extensions/

## 🚀 Production Deployment

### Backend Deployment

For production, consider:
- **Docker**: Containerize the application
- **Cloud hosting**: Deploy to AWS, Google Cloud, or Heroku
- **Environment variables**: Set production API keys
- **CORS**: Restrict origins to your domain
- **Rate limiting**: Add API rate limiting
- **Monitoring**: Add logging and monitoring

### Extension Distribution

For wider distribution:
- **Chrome Web Store**: Publish the extension
- **Firefox Add-ons**: Create Firefox version
- **Edge Add-ons**: Publish to Microsoft Store

## 🎉 Success!

You now have a complete AI-powered text explanation system! 

- **Backend**: FastAPI server with OpenAI integration
- **Frontend**: Browser extension with clean UI
- **Features**: Multiple explanation styles, context awareness, error handling

Happy explaining! 🤖✨ 