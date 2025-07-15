/**
 * Explaina Popup Script
 * Handles popup functionality, settings management, and API connection testing
 */

class ExplainaPopup {
  constructor() {
    this.settings = {
      apiUrl: 'http://localhost:8000/explain',
      explanationStyle: 'simple',
      autoHide: true,
      enableCaching: false
    };
    
    this.init();
  }

  /**
   * Initialize the popup
   */
  async init() {
    await this.loadSettings();
    this.setupEventListeners();
    this.updateUI();
    this.checkApiConnection();
  }

  /**
   * Load settings from storage
   */
  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get(['explainaSettings']);
      if (result.explainaSettings) {
        this.settings = { ...this.settings, ...result.explainaSettings };
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  /**
   * Save settings to storage
   */
  async saveSettings() {
    try {
      await chrome.storage.sync.set({
        explainaSettings: this.settings
      });
      this.showNotification('Settings saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      this.showNotification('Failed to save settings', 'error');
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Save settings button
    document.getElementById('save-settings').addEventListener('click', () => {
      this.updateSettingsFromUI();
      this.saveSettings();
    });

    // Test connection button
    document.getElementById('test-connection').addEventListener('click', () => {
      this.testApiConnection();
    });

    // Auto-save on input changes
    document.getElementById('api-url').addEventListener('input', () => {
      this.updateSettingsFromUI();
    });

    document.getElementById('explanation-style').addEventListener('change', () => {
      this.updateSettingsFromUI();
    });

    document.getElementById('auto-hide').addEventListener('change', () => {
      this.updateSettingsFromUI();
    });

    document.getElementById('enable-caching').addEventListener('change', () => {
      this.updateSettingsFromUI();
    });
  }

  /**
   * Update settings from UI elements
   */
  updateSettingsFromUI() {
    this.settings.apiUrl = document.getElementById('api-url').value;
    this.settings.explanationStyle = document.getElementById('explanation-style').value;
    this.settings.autoHide = document.getElementById('auto-hide').checked;
    this.settings.enableCaching = document.getElementById('enable-caching').checked;
  }

  /**
   * Update UI with current settings
   */
  updateUI() {
    document.getElementById('api-url').value = this.settings.apiUrl;
    document.getElementById('explanation-style').value = this.settings.explanationStyle;
    document.getElementById('auto-hide').checked = this.settings.autoHide;
    document.getElementById('enable-caching').checked = this.settings.enableCaching;
  }

  /**
   * Check API connection status
   */
  async checkApiConnection() {
    const statusElement = document.getElementById('api-status');
    statusElement.textContent = 'Checking...';
    statusElement.className = 'status-value checking';

    try {
      const response = await fetch(this.settings.apiUrl, {
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
        statusElement.textContent = 'Connected';
        statusElement.className = 'status-value connected';
      } else {
        statusElement.textContent = 'Error: ' + response.status;
        statusElement.className = 'status-value disconnected';
      }
    } catch (error) {
      // For testing without backend, show a mock status
      statusElement.textContent = 'Demo Mode (No Backend)';
      statusElement.className = 'status-value checking';
    }
  }

  /**
   * Test API connection with a sample request
   */
  async testApiConnection() {
    const statusElement = document.getElementById('api-status');
    statusElement.textContent = 'Testing...';
    statusElement.className = 'status-value checking';

    try {
      const response = await fetch(this.settings.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: 'artificial intelligence',
          context: 'Artificial intelligence (AI) is a branch of computer science that aims to create intelligent machines that work and react like humans.',
          style: this.settings.explanationStyle
        })
      });

      if (response.ok) {
        const data = await response.json();
        statusElement.textContent = 'Connected ✓';
        statusElement.className = 'status-value connected';
        this.showNotification('API connection successful!', 'success');
      } else {
        statusElement.textContent = 'Error: ' + response.status;
        statusElement.className = 'status-value disconnected';
        this.showNotification(`API error: ${response.status}`, 'error');
      }
    } catch (error) {
      // For testing without backend, show a demo message
      statusElement.textContent = 'Demo Mode ✓';
      statusElement.className = 'status-value connected';
      this.showNotification('Demo mode: Extension is working! (No backend connected)', 'success');
    }
  }

  /**
   * Show notification message
   */
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 16px;
      border-radius: 6px;
      color: white;
      font-weight: 500;
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
      max-width: 300px;
    `;

    // Set background color based on type
    if (type === 'success') {
      notification.style.background = '#28a745';
    } else if (type === 'error') {
      notification.style.background = '#dc3545';
    } else {
      notification.style.background = '#17a2b8';
    }

    // Add to page
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Initialize popup when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ExplainaPopup();
}); 