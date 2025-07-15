/**
 * Explaina Content Script
 * Injected into web pages to detect text selection and provide AI explanations
 */

class ExplainaContentScript {
  constructor() {
    this.explainButton = null;
    this.tooltip = null;
    this.isLoading = false;
    this.selectedText = '';
    this.selectionContext = '';
    
    this.init();
  }

  /**
   * Initialize the content script
   */
  init() {
    // Listen for text selection events
    document.addEventListener('mouseup', this.handleTextSelection.bind(this));
    document.addEventListener('keyup', this.handleTextSelection.bind(this));
    
    // Listen for clicks to hide tooltip when clicking elsewhere
    document.addEventListener('click', this.handleDocumentClick.bind(this));
    
    // Listen for scroll to hide tooltip
    document.addEventListener('scroll', this.hideTooltip.bind(this));
    
    console.log('Explaina content script initialized');
  }

  /**
   * Handle text selection events
   */
  handleTextSelection(event) {
    // Don't recreate button if clicking on the button itself
    if (event.target && event.target.closest('.explaina-button')) {
      console.log('Explaina: Clicked on button, ignoring text selection');
      return;
    }
    
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    // Debug logging
    console.log('Explaina: Text selection detected:', selectedText);

    // Remove existing explain button
    this.removeExplainButton();

    // If there's selected text, show the explain button
    if (selectedText.length > 0) {
      this.selectedText = selectedText;
      this.selectionContext = this.getSelectionContext(selection);
      console.log('Explaina: Showing explain button for:', selectedText);
      this.showExplainButton(event);
    }
  }

  /**
   * Get context around the selected text (300 chars before and after)
   */
  getSelectionContext(selection) {
    if (!selection.rangeCount) return '';

    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    
    // Get the text content of the container
    let fullText = '';
    if (container.nodeType === Node.TEXT_NODE) {
      fullText = container.textContent;
    } else {
      fullText = container.textContent;
    }

    const startOffset = range.startOffset;
    const endOffset = range.endOffset;
    
    // Calculate context boundaries
    const contextBefore = Math.max(0, startOffset - 300);
    const contextAfter = Math.min(fullText.length, endOffset + 300);
    
    return fullText.substring(contextBefore, contextAfter);
  }

  /**
   * Show the explain button near the selected text
   */
  showExplainButton(event) {
    // Create explain button
    this.explainButton = document.createElement('div');
    this.explainButton.className = 'explaina-button';
    this.explainButton.innerHTML = '🤖 Explain';
    this.explainButton.title = 'Get AI explanation for selected text';
    
    // Add inline onclick as backup
    this.explainButton.onclick = (event) => {
      console.log('Explaina: Inline onclick triggered!');
      this.handleExplainClick(event);
    };
    
    // Add inline styles to ensure button is visible and clickable
    this.explainButton.style.cssText = `
      position: fixed !important;
      background: #ffffff !important;
      color: #374151 !important;
      border: 1px solid #e5e7eb !important;
      border-radius: 8px !important;
      padding: 6px 12px !important;
      font-size: 11px !important;
      font-weight: 500 !important;
      cursor: pointer !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06) !important;
      z-index: 2147483647 !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      user-select: none !important;
      pointer-events: auto !important;
      transition: all 0.15s ease !important;
      letter-spacing: 0.025em !important;
      backdrop-filter: blur(8px) !important;
    `;
    
    // Position the button near the cursor
    const rect = this.getSelectionRect();
    if (rect) {
      this.explainButton.style.position = 'fixed';
      this.explainButton.style.left = `${rect.right + 10}px`;
      this.explainButton.style.top = `${rect.top - 10}px`;
      this.explainButton.style.zIndex = '10000';
    } else {
      // Fallback positioning near mouse cursor
      this.explainButton.style.position = 'fixed';
      this.explainButton.style.left = `${event.clientX + 10}px`;
      this.explainButton.style.top = `${event.clientY - 30}px`;
      this.explainButton.style.zIndex = '10000';
    }

    // Add click event listener
    this.explainButton.addEventListener('click', (event) => {
      console.log('Explaina: Button clicked! Event:', event);
      this.handleExplainClick(event);
    });
    
    // Add mouseover effect to test if button is interactive
    this.explainButton.addEventListener('mouseover', () => {
      console.log('Explaina: Button mouseover detected');
      this.explainButton.style.transform = 'scale(1.1)';
    });
    
    this.explainButton.addEventListener('mouseout', () => {
      console.log('Explaina: Button mouseout detected');
      this.explainButton.style.transform = 'scale(1)';
    });
    
    // Add to page
    document.body.appendChild(this.explainButton);
    
    console.log('Explaina: Button created and positioned at:', {
      left: this.explainButton.style.left,
      top: this.explainButton.style.top,
      text: this.selectedText
    });
    
    // Test if button is actually in the DOM
    console.log('Explaina: Button in DOM:', document.body.contains(this.explainButton));
    console.log('Explaina: Button visible:', this.explainButton.offsetWidth > 0 && this.explainButton.offsetHeight > 0);
    console.log('Explaina: Button element:', this.explainButton);
    
    // Button is ready for user interaction
  }

  /**
   * Get the bounding rectangle of the current text selection
   */
  getSelectionRect() {
    const selection = window.getSelection();
    if (!selection.rangeCount) return null;

    const range = selection.getRangeAt(0);
    return range.getBoundingClientRect();
  }

  /**
   * Handle explain button click
   */
  async handleExplainClick(event) {
    event.preventDefault();
    event.stopPropagation();

    console.log('Explaina: Button clicked for text:', this.selectedText);

    if (this.isLoading) {
      console.log('Explaina: Already loading, ignoring click');
      return;
    }

    console.log('Explaina: Starting explanation process...');
    this.isLoading = true;
    this.explainButton.innerHTML = '⏳ Loading...';
    this.explainButton.style.opacity = '0.7';

    try {
      console.log('Explaina: Calling API...');
      const explanation = await this.callExplanationAPI(this.selectedText, this.selectionContext);
      console.log('Explaina: Got explanation:', explanation.substring(0, 100) + '...');
      console.log('Explaina: About to show tooltip...');
      this.showTooltip(explanation, event);
      console.log('Explaina: Tooltip should be visible now');
      
      // Remove button after showing tooltip
      this.removeExplainButton();
    } catch (error) {
      console.error('Explaina: Error getting explanation:', error);
      this.showTooltip('Sorry, I couldn\'t explain that. Please try again.', event, true);
      this.removeExplainButton();
    } finally {
      console.log('Explaina: Cleanup - setting loading to false');
      this.isLoading = false;
    }
  }

  /**
   * Call the explanation API
   * @param {string} text - The selected text to explain
   * @param {string} context - Surrounding context
   * @returns {Promise<string>} - The explanation
   */
  async callExplanationAPI(text, context) {
    console.log('Explaina: Calling API for text:', text);
    
    try {
      const response = await fetch('http://localhost:8000/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          context: context,
          style: 'simple' // Default to simple style
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API request failed: ${response.status} - ${errorData.detail || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('Explaina: Received API response:', data);
      return data.explanation || 'No explanation available.';
    } catch (error) {
      console.error('Explaina: API call failed:', error);
      
      // Fallback response if API is not available
      return `**Explaina AI Response:** "${text}" appears to be a term or concept that could benefit from further explanation. Based on the context provided, this seems to be related to the topic being discussed. Please ensure the backend API is running at http://localhost:8000.`;
    }
  }

  /**
   * Show the explanation tooltip
   */
  showTooltip(explanation, event, isError = false) {
    console.log('Explaina: Creating tooltip with explanation:', explanation.substring(0, 50) + '...');
    
    // Remove existing tooltip
    this.removeTooltip();

    // Create tooltip
    this.tooltip = document.createElement('div');
    this.tooltip.className = `explaina-tooltip ${isError ? 'explaina-error' : ''}`;
    
    // Add inline styles as backup to ensure visibility
    this.tooltip.style.cssText = `
      position: fixed !important;
      background: #ffffff !important;
      border: 1px solid #e5e7eb !important;
      border-radius: 8px !important;
      padding: 0 !important;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05) !important;
      z-index: 10001 !important;
      max-width: 380px !important;
      min-width: 280px !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 13px !important;
      color: #374151 !important;
      line-height: 1.6 !important;
      overflow: hidden !important;
      backdrop-filter: blur(12px) !important;
    `;
    
    // Create simple tooltip content
    this.tooltip.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #f9fafb; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">
        <span>${isError ? '❌ Error' : '🤖 AI Explanation'}</span>
        <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: #9ca3af; font-size: 16px; font-weight: 400; cursor: pointer; padding: 0; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; border-radius: 4px; transition: all 0.15s ease;">×</button>
      </div>
      <div style="padding: 16px; max-height: 280px; overflow-y: auto; word-wrap: break-word; white-space: pre-wrap; color: #4b5563; line-height: 1.6;">
        ${explanation}
      </div>
    `;
    
    // Position tooltip near the button
    const buttonRect = this.explainButton.getBoundingClientRect();
    this.tooltip.style.position = 'fixed';
    this.tooltip.style.left = `${buttonRect.right + 10}px`;
    this.tooltip.style.top = `${buttonRect.top}px`;
    this.tooltip.style.zIndex = '10001';
    
    console.log('Explaina: Tooltip positioned near button at:', {
      left: this.tooltip.style.left,
      top: this.tooltip.style.top
    });
    
    console.log('Explaina: Tooltip positioned at:', {
      left: this.tooltip.style.left,
      top: this.tooltip.style.top,
      zIndex: this.tooltip.style.zIndex
    });
    
    // Close button is handled by inline onclick
    
    // Add to page
    document.body.appendChild(this.tooltip);
    
    console.log('Explaina: Tooltip added to page, element:', this.tooltip);
    console.log('Explaina: Tooltip visible:', this.tooltip.offsetWidth > 0 && this.tooltip.offsetHeight > 0);
    
    // Auto-hide after 10 seconds (unless it's an error)
    if (!isError) {
      setTimeout(() => {
        this.hideTooltip();
      }, 10000);
    }
  }

  /**
   * Handle document clicks to hide tooltip when clicking elsewhere
   */
  handleDocumentClick(event) {
    // Don't hide if clicking on explaina elements
    if (event.target.closest('.explaina-button') || 
        event.target.closest('.explaina-tooltip')) {
      return;
    }
    
    this.hideTooltip();
  }

  /**
   * Hide the tooltip
   */
  hideTooltip() {
    if (this.tooltip) {
      this.tooltip.remove();
      this.tooltip = null;
    }
  }

  /**
   * Remove the explain button
   */
  removeExplainButton() {
    if (this.explainButton) {
      this.explainButton.remove();
      this.explainButton = null;
    }
  }

  /**
   * Remove the tooltip
   */
  removeTooltip() {
    if (this.tooltip) {
      this.tooltip.remove();
      this.tooltip = null;
    }
  }
}

// Initialize the content script when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ExplainaContentScript();
  });
} else {
  new ExplainaContentScript();
} 