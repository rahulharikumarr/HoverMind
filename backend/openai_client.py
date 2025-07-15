# openai_client.py
"""
OpenAI client for generating explanations
Compatible with openai==1.3.7
"""

import os
import openai
from dotenv import load_dotenv

load_dotenv()
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class OpenAIExplainer:
    def __init__(self):
        pass

    def is_configured(self) -> bool:
        return os.getenv("OPENAI_API_KEY") is not None

    def explain(self, selected_text: str, context: str = "", style: str = "simple") -> str:
        base_prompt = f"Explain the term or phrase '{selected_text}'"
        if context and context.strip():
            base_prompt += f" based on the following context:\n\n{context}\n\n"
        else:
            base_prompt += ":\n\n"
        if style == "simple":
            base_prompt += "Provide a simple, easy-to-understand explanation in 1-2 sentences. Use everyday language and avoid technical jargon."
        elif style == "technical":
            base_prompt += "Provide a technical explanation in 2-3 sentences. Include relevant technical details and concepts."
        elif style == "detailed":
            base_prompt += "Provide a comprehensive explanation in 3-4 sentences. Include context, examples, and related concepts."
        else:
            base_prompt += "Provide a clear explanation in 2-3 sentences."
        base_prompt += "\n\nExplanation:"
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful AI assistant that provides clear, accurate explanations of terms and concepts. Keep explanations concise and relevant to the context provided."},
                    {"role": "user", "content": base_prompt}
                ],
                max_tokens=200,
                temperature=0.7,
                timeout=30
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"[OpenAI Error] {e}")
            return "Sorry, I couldn't generate an explanation right now."
