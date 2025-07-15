# 🤖 Explaina Backend API

A lightweight FastAPI backend that provides AI-powered explanations for selected text using OpenAI's GPT-3.5-turbo.

## 🚀 Quick Start

### 1. Setup Environment

```bash
# Navigate to backend directory
cd backend

# Copy environment template
cp env.example .env

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=your_actual_api_key_here
```

### 2. Install Dependencies

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Start the Server

```bash
# Option 1: Use the startup script
./run.sh

# Option 2: Run directly
python main.py

# Option 3: Use uvicorn directly
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## 📡 API Endpoints

### POST /explain
Generate AI explanation for selected text

**Request:**
```json
{
  "text": "variational autoencoder",
  "context": "In machine learning, a variational autoencoder is a type of neural network that...",
  "style": "simple"
}
```

**Response:**
```json
{
  "explanation": "A variational autoencoder is a type of neural network that can learn to compress and reconstruct data by learning a probabilistic representation of the input."
}
```

### GET /health
Health check endpoint

**Response:**
```json
{
  "status": "healthy",
  "service": "explaina-api",
  "openai_configured": true
}
```

### GET /
Root endpoint with API information

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes | - |
| `PORT` | Server port | No | 8000 |
| `LOG_LEVEL` | Logging level | No | INFO |

### Explanation Styles

- **simple**: Easy-to-understand explanation in 1-2 sentences
- **technical**: Technical explanation with details in 2-3 sentences  
- **detailed**: Comprehensive explanation in 3-4 sentences

## AI Provider Selection

By default, Explaina uses **OpenAI GPT-3.5-turbo** for fast, high-quality explanations (requires an OpenAI API key).

If you want to use a free, local LLM (Ollama), set `USE_OLLAMA=true` in your `.env` file. Ollama is slower and less reliable, but does not require an API key.

**.env example:**

```
OPENAI_API_KEY=sk-...your-key-here...
USE_OLLAMA=false  # Use OpenAI (default, recommended)
```

- Set `USE_OLLAMA=false` to use OpenAI (default, fast, paid)
- Set `USE_OLLAMA=true` to use Ollama (local, free, slower)

## 🏗️ Architecture

```
backend/
├── main.py           # FastAPI app with endpoints
├── models.py         # Pydantic request/response models
├── openai_client.py  # OpenAI API integration
├── requirements.txt  # Python dependencies
├── env.example       # Environment variables template
├── run.sh           # Startup script
└── README.md        # This file
```

## 🔒 Security

- CORS configured for browser extensions
- Input validation with Pydantic models
- Error handling with proper HTTP status codes
- Environment variable configuration

## 🧪 Testing

### Test the API

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test explanation endpoint
curl -X POST http://localhost:8000/explain \
  -H "Content-Type: application/json" \
  -d '{
    "text": "machine learning",
    "context": "Machine learning is a subset of artificial intelligence.",
    "style": "simple"
  }'
```

### API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🐛 Troubleshooting

### Common Issues

1. **"OpenAI API not configured"**
   - Make sure you've set `OPENAI_API_KEY` in your `.env` file
   - Get your API key from https://platform.openai.com/api-keys

2. **"Failed to generate explanation"**
   - Check your OpenAI API key is valid
   - Verify you have sufficient API credits
   - Check the server logs for detailed error messages

3. **CORS errors from browser extension**
   - The API is configured to allow browser extensions
   - Make sure the extension is making requests to the correct URL

### Logs

The server logs all requests and errors. Check the console output for:
- Request details
- OpenAI API responses
- Error messages

## 🔮 Future Enhancements

- [ ] Support for other LLM providers (Anthropic, Google, etc.)
- [ ] Caching for repeated explanations
- [ ] Rate limiting
- [ ] Authentication
- [ ] Multiple language support
- [ ] Explanation history tracking

## 📝 License

This project is open source. Feel free to modify and distribute. 