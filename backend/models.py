"""
Pydantic models for Explaina API
Request and response models with validation
"""

from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum

class ExplanationStyle(str, Enum):
    """Available explanation styles"""
    SIMPLE = "simple"
    TECHNICAL = "technical"
    DETAILED = "detailed"

#we can use pydantic to validate the request and response
class ExplanationRequest(BaseModel):
    """
    Request model for explanation endpoint
    
    Attributes:
        text: The selected text to explain
        context: Surrounding context (optional)
        style: Explanation style preference (optional)
    """
    text: str = Field(
        ..., 
        min_length=1, 
        max_length=500,
        description="The selected text to explain"
    )
    context: Optional[str] = Field(
        default="",
        max_length=2000,
        description="Surrounding context to help with explanation"
    )
    style: Optional[ExplanationStyle] = Field(
        default=ExplanationStyle.SIMPLE,
        description="Preferred explanation style"
    )
    
    class Config:
        schema_extra = {
            "example": {
                "text": "variational autoencoder",
                "context": "In machine learning, a variational autoencoder is a type of neural network that can learn to compress and reconstruct data.",
                "style": "simple"
            }
        }

class ExplanationResponse(BaseModel):
    """
    Response model for explanation endpoint
    
    Attributes:
        explanation: The AI-generated explanation
    """
    explanation: str = Field(
        ...,
        description="AI-generated explanation of the selected text"
    )
    
    class Config:
        schema_extra = {
            "example": {
                "explanation": "A variational autoencoder is a type of neural network that can learn to compress and reconstruct data by learning a probabilistic representation of the input."
            }
        }

class ErrorResponse(BaseModel):
    """
    Error response model
    
    Attributes:
        error: Error message
        detail: Additional error details (optional)
    """
    error: str = Field(
        ...,
        description="Error message"
    )
    detail: Optional[str] = Field(
        default=None,
        description="Additional error details"
    )
    
    class Config:
        schema_extra = {
            "example": {
                "error": "Failed to generate explanation",
                "detail": "OpenAI API rate limit exceeded"
            }
        } 