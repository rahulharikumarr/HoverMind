#!/bin/bash

# Explaina Backend Server Startup Script

echo "🤖 Starting Explaina Backend Server..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "📝 Please copy env.example to .env and add your OpenAI API key"
    echo "   cp env.example .env"
    echo "   Then edit .env and add your OPENAI_API_KEY"
    echo ""
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Start the server
echo "🚀 Starting server..."
echo "📡 API will be available at: http://localhost:8000"
echo "🔗 Extension endpoint: http://localhost:8000/explain"
echo "📖 API docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python main.py 