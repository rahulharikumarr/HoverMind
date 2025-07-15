# 🚀 Quick Installation Guide

## Step 1: Load the Extension

1. Open Chrome or Edge
2. Go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `explaina-extension` folder

## Step 2: Start the Backend API

```bash
# Install Python dependencies
pip install -r requirements.txt

# Start the API server
python backend_example.py
```

The API will be available at `http://localhost:8000`

## Step 3: Test the Extension

1. Go to any webpage with text content
2. Select some text
3. Click the "🤖 Explain" button that appears
4. Get your AI explanation!

## Troubleshooting

- **Extension not working?** Check if the backend API is running
- **Button not appearing?** Make sure you're selecting text (not just clicking)
- **API errors?** Check the browser console for details

## Next Steps

- Customize the API endpoint in extension settings
- Integrate with your preferred AI service
- Add custom icons to the `icons/` folder

For detailed documentation, see [README.md](README.md) 