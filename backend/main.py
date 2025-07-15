"""
Explaina Backend API
FastAPI server for AI-powered text explanations
"""

import os
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from models import ExplanationRequest, ExplanationResponse, ErrorResponse
from openai_client import OpenAIExplainer

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Explaina API",
    description="AI-powered explanations for selected text",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "chrome-extension://*",
        "http://localhost:*",
        "https://localhost:*",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

openai_explainer = OpenAIExplainer()

@app.get("/")
def root():
    return {
        "message": "Explaina API is running! 🤖",
        "version": "1.0.0",
        "endpoints": {
            "explain": "/explain",
            "health": "/health"
        }
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "explaina-api",
        "openai_configured": openai_explainer.is_configured(),
        "current_explainer": "openai"
    }

@app.post("/explain", response_model=ExplanationResponse)
def explain_text(request: ExplanationRequest):
    try:
        logger.info(f"Received explanation request for: '{request.text}'")
        if not request.text or not request.text.strip():
            raise HTTPException(status_code=400, detail="Selected text cannot be empty")
        explanation = openai_explainer.explain(
            selected_text=request.text,
            context=request.context,
            style=request.style
        )
        logger.info(f"Successfully generated explanation for: '{request.text}'")
        return ExplanationResponse(explanation=explanation)
    except Exception as e:
        logger.error(f"Failed to generate explanation for '{request.text}': {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate explanation")

@app.exception_handler(Exception)
def global_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {str(exc)}")
    return ErrorResponse(
        error="Internal server error",
        detail=str(exc)
    )

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    logger.info(f"🚀 Starting Explaina API server on port {port}")
    logger.info(f"📡 API will be available at: http://localhost:{port}")
    logger.info(f"🔗 Extension endpoint: http://localhost:{port}/explain")
    logger.info(f"📖 API docs: http://localhost:{port}/docs")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    ) 