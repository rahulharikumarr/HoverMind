"""
Explaina Backend API Example
A simple FastAPI server that provides AI explanations for text
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="Explaina API", version="1.0.0")

# Enable CORS for browser extensions
app.add_middleware(
    CORSMiddleware,
    allow_origins=["chrome-extension://*", "http://localhost:*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ExplanationRequest(BaseModel):
    text: str
    context: str
    style: str = "simple"

class ExplanationResponse(BaseModel):
    explanation: str

@app.get("/")
async def root():
    return {"message": "Explaina API is running! 🤖"}

@app.post("/explain", response_model=ExplanationResponse)
async def explain_text(request: ExplanationRequest):
    """
    Generate an AI explanation for the given text
    """
    try:
        # This is a simple mock explanation
        # In a real implementation, you would integrate with an AI service
        # like OpenAI, Anthropic, or your own model
        
        text = request.text.strip()
        context = request.context.strip()
        style = request.style.lower()
        
        if not text:
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        # Generate different explanations based on style
        if style == "simple":
            explanation = f"**Simple Explanation:** '{text}' refers to a concept or term that is commonly used in this context. Based on the surrounding text, it appears to be related to the topic being discussed."
        
        elif style == "technical":
            explanation = f"**Technical Analysis:** The term '{text}' in this context represents a specific technical concept. From the provided context, it can be analyzed as a component within the broader subject matter, demonstrating particular characteristics and applications."
        
        elif style == "detailed":
            explanation = f"**Detailed Explanation:** '{text}' is a comprehensive term that encompasses multiple aspects. In the context provided, it functions as a key element within the broader framework. The surrounding text suggests it plays a significant role in the overall discussion, with implications for understanding the subject matter more deeply."
        
        else:
            explanation = f"Here's an explanation of '{text}': This term appears in the context provided and relates to the topic being discussed."
        
        # Add context-aware information if available
        if context and len(context) > 50:
            explanation += f"\n\n**Context Note:** The surrounding text provides additional context that helps clarify the meaning and usage of this term."
        
        return ExplanationResponse(explanation=explanation)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating explanation: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "explaina-api"}

if __name__ == "__main__":
    print("🚀 Starting Explaina API server...")
    print("📡 API will be available at: http://localhost:8000")
    print("🔗 Extension endpoint: http://localhost:8000/explain")
    print("📖 API docs: http://localhost:8000/docs")
    print("\nPress Ctrl+C to stop the server")
    
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8000,
        log_level="info"
    ) 