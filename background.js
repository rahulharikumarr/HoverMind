/**
 * Explaina Background Service Worker
 * Handles background tasks and messaging between content scripts and popup
 */

// Extension installation handler
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Explaina extension installed');
    
    // Set default settings
    chrome.storage.sync.set({
      explainaSettings: {
        apiUrl: 'http://localhost:8000/explain',
        explanationStyle: 'simple',
        autoHide: true,
        enableCaching: false
      }
    });
  } else if (details.reason === 'update') {
    console.log('Explaina extension updated');
  }
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'getSettings':
      handleGetSettings(sendResponse);
      return true; // Keep message channel open for async response
      
    case 'updateSettings':
      handleUpdateSettings(request.settings, sendResponse);
      return true;
      
    case 'testApiConnection':
      handleTestApiConnection(request.apiUrl, sendResponse);
      return true;
      
    case 'logError':
      console.error('Explaina Error:', request.error);
      break;
      
    default:
      console.warn('Unknown message action:', request.action);
  }
});

/**
 * Handle getting settings from storage
 */
async function handleGetSettings(sendResponse) {
  try {
    const result = await chrome.storage.sync.get(['explainaSettings']);
    const settings = result.explainaSettings || {
      apiUrl: 'http://localhost:8000/explain',
      explanationStyle: 'simple',
      autoHide: true,
      enableCaching: false
    };
    sendResponse({ success: true, settings });
  } catch (error) {
    console.error('Error getting settings:', error);
    sendResponse({ success: false, error: error.message });
  }
}

/**
 * Handle updating settings in storage
 */
async function handleUpdateSettings(newSettings, sendResponse) {
  try {
    await chrome.storage.sync.set({
      explainaSettings: newSettings
    });
    sendResponse({ success: true });
  } catch (error) {
    console.error('Error updating settings:', error);
    sendResponse({ success: false, error: error.message });
  }
}

/**
 * Handle testing API connection
 */
async function handleTestApiConnection(apiUrl, sendResponse) {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'test',
        context: 'test context'
      })
    });

    if (response.ok) {
      sendResponse({ success: true, status: 'connected' });
    } else {
      sendResponse({ success: false, status: 'error', code: response.status });
    }
  } catch (error) {
    console.error('API connection test failed:', error);
    sendResponse({ success: false, status: 'disconnected', error: error.message });
  }
}

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // This will open the popup automatically due to manifest configuration
  console.log('Explaina extension icon clicked');
});

// Handle tab updates to ensure content script is injected
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
    // Content script will be automatically injected via manifest
    console.log('Tab updated, content script ready:', tab.url);
  }
});

// Handle extension startup
chrome.runtime.onStartup.addListener(() => {
  console.log('Explaina extension started');
});

// Handle extension shutdown
chrome.runtime.onSuspend.addListener(() => {
  console.log('Explaina extension suspended');
}); 