#!/usr/bin/env python3
"""
Test script for Explaina Backend API
Tests the /explain endpoint with sample requests
"""

import asyncio
import aiohttp
import json
import sys
import os

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models import ExplanationRequest

async def test_explanation_api():
    """Test the explanation API endpoint"""
    
    base_url = "http://localhost:8000"
    
    async with aiohttp.ClientSession() as session:
        # Test 1: Health check
        print("🔍 Testing health endpoint...")
        try:
            async with session.get(f"{base_url}/health") as response:
                if response.status == 200:
                    data = await response.json()
                    print(f"✅ Health check passed: {data}")
                else:
                    print(f"❌ Health check failed: {response.status}")
                    return False
        except Exception as e:
            print(f"❌ Health check error: {e}")
            return False
        
        # Test 2: Explanation endpoint
        print("\n🔍 Testing explanation endpoint...")
        
        test_cases = [
            {
                "text": "machine learning",
                "context": "Machine learning is a subset of artificial intelligence that enables computers to learn from data.",
                "style": "simple"
            },
            {
                "text": "neural network",
                "context": "Neural networks are computing systems inspired by biological neural networks.",
                "style": "technical"
            },
            {
                "text": "blockchain",
                "context": "Blockchain technology provides a secure way to record transactions.",
                "style": "detailed"
            }
        ]
        
        for i, test_case in enumerate(test_cases, 1):
            print(f"\n📝 Test {i}: Explaining '{test_case['text']}' with {test_case['style']} style")
            
            try:
                async with session.post(
                    f"{base_url}/explain",
                    json=test_case,
                    headers={"Content-Type": "application/json"}
                ) as response:
                    
                    if response.status == 200:
                        data = await response.json()
                        print(f"✅ Success: {data['explanation'][:100]}...")
                    else:
                        error_data = await response.json()
                        print(f"❌ Failed: {response.status} - {error_data}")
                        
            except Exception as e:
                print(f"❌ Error: {e}")
        
        print("\n🎉 API testing completed!")

def main():
    """Main function"""
    print("🤖 Explaina Backend API Test")
    print("=" * 40)
    
    # Check if server is running
    print("Make sure the backend server is running on http://localhost:8000")
    print("You can start it with: python main.py")
    print()
    
    # Run the tests
    asyncio.run(test_explanation_api())

if __name__ == "__main__":
    main() 