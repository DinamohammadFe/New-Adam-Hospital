/**
 * Modern Chatbot Functionality
 * Extracted from home.js for better modularity
 */

// Chatbot functionality
function initializeChatbot() {
  if (window.chatbotInitialized) {
    return;
  }
  
  setTimeout(() => {
    const chatbotToggle = document.getElementById("chatbotToggle");
    const chatbotWindow = document.getElementById("chatbotWindow");
    const chatbotClose = document.getElementById("chatbotClose");
    const chatbotInput = document.getElementById("chatbotInput");
    const sendButton = document.getElementById("chatbotSend");
    const chatbotMessages = document.getElementById("chatbotMessages");
    
    if (!chatbotToggle || !chatbotWindow) {
      return;
    }
    
    window.chatbotInitialized = true;
    let isOpen = false;
    let isTyping = false;

    function toggleChatbot() {
      isOpen = !isOpen;
      chatbotWindow.classList.toggle("open", isOpen);
      
      if (isOpen && chatbotInput) {
        setTimeout(() => {
          chatbotInput.focus();
        }, 300);
      }
    }
    
    function scrollToBottom() {
      if (chatbotMessages) {
        setTimeout(() => {
          chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }, 100);
      }
    }

    function addMessage(content, isUser = false, delay = 0) {
      if (!chatbotMessages) {
        return;
      }
      
      setTimeout(() => {
        const messageDiv = document.createElement("div");
        messageDiv.className = `message ${isUser ? "user-message" : "bot-message"}`;
        messageDiv.style.opacity = "0";
        messageDiv.style.transform = "translateY(10px)";
        
        messageDiv.innerHTML = `
          <div class="message-avatar">
            ${isUser ? "👤" : "🏥"}
          </div>
          <div class="message-content">
            <p>${content}</p>
          </div>
        `;
        
        chatbotMessages.appendChild(messageDiv);
        
        // Animate message appearance
        setTimeout(() => {
          messageDiv.style.transition = "all 0.3s ease";
          messageDiv.style.opacity = "1";
          messageDiv.style.transform = "translateY(0)";
        }, 50);
        
        scrollToBottom();
      }, delay);
    }

    function showTypingIndicator() {
      if (isTyping) return;
      
      isTyping = true;
      const typingDiv = document.createElement("div");
      typingDiv.className = "message bot-message typing-indicator";
      typingDiv.id = "typing-indicator";
      
      typingDiv.innerHTML = `
        <div class="message-avatar">🏥</div>
        <div class="message-content">
          <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      `;
      
      chatbotMessages.appendChild(typingDiv);
      scrollToBottom();
    }

    function hideTypingIndicator() {
      const typingIndicator = document.getElementById("typing-indicator");
      if (typingIndicator) {
        typingIndicator.remove();
      }
      isTyping = false;
    }

    function sendMessage() {
      if (!chatbotInput || isTyping) {
        return;
      }
      
      const message = chatbotInput.value.trim();
      if (message) {
        // Clear input immediately
        chatbotInput.value = "";
        
        // Add user message
        addMessage(message, true);
        
        // Show typing indicator
        setTimeout(() => {
          showTypingIndicator();
        }, 500);
        
        // Generate and show response
        setTimeout(() => {
          hideTypingIndicator();
          const response = generateResponse(message);
          addMessage(response, false);
        }, 1500);
      }
    }

    function generateResponse(message) {
      const lowerMessage = message.toLowerCase();
      
      // Check if i18n is available for translations
      if (typeof i18n !== 'undefined' && i18n.translate) {
        if (lowerMessage.includes("appointment") || lowerMessage.includes("book")) {
          return i18n.translate('chatbot.messages.appointment_response');
        }
        
        if (lowerMessage.includes("treatment") || lowerMessage.includes("service")) {
          return i18n.translate('chatbot.messages.treatments_response');
        }
        
        if (lowerMessage.includes("location") || lowerMessage.includes("address")) {
          return i18n.translate('chatbot.messages.locations_response');
        }
        
        if (lowerMessage.includes("contact") || lowerMessage.includes("phone")) {
          return i18n.translate('chatbot.messages.contact_response');
        }
        
        return i18n.translate('chatbot.messages.default_response');
      }
      
      // Fallback responses if i18n is not available
      if (lowerMessage.includes("appointment") || lowerMessage.includes("book")) {
        return "I'd be happy to help you schedule an appointment! Please call us at 16992 or you can book online. Our fertility specialists are available for consultations Monday through Saturday.";
      }
      
      if (lowerMessage.includes("treatment") || lowerMessage.includes("service")) {
        return "We offer comprehensive fertility treatments including IVF, ICSI, fertility preservation, and more. Our experienced team provides personalized care for each patient.";
      }
      
      if (lowerMessage.includes("location") || lowerMessage.includes("address")) {
        return "Adam International Hospital has multiple locations to serve you better. Please visit our website or call 16992 for specific location details and directions.";
      }
      
      if (lowerMessage.includes("contact") || lowerMessage.includes("phone")) {
        return "You can reach us at 16992 for appointments and inquiries. Our patient care team is available to assist you with any questions about our fertility services.";
      }
      
      return "Thank you for your message! For specific medical questions or to schedule an appointment, please call us at 16992. Our team is here to help with your fertility journey.";
    }

    // Event listeners
    if (chatbotToggle) {
      chatbotToggle.addEventListener("click", toggleChatbot);
    }
    
    if (chatbotClose) {
      chatbotClose.addEventListener("click", toggleChatbot);
    }
    
    if (sendButton) {
      sendButton.addEventListener("click", sendMessage);
    }
    
    if (chatbotInput) {
      chatbotInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
          sendMessage();
        }
      });
    }
    
    // Quick action buttons
    const quickActionButtons = document.querySelectorAll('.quick-action');
    quickActionButtons.forEach(button => {
      button.addEventListener('click', function() {
        const message = this.getAttribute('data-message');
        if (message && chatbotInput) {
          chatbotInput.value = message;
          sendMessage();
        }
      });
    });
    
    // Close chatbot when clicking outside
    document.addEventListener("click", function(e) {
      if (isOpen && 
          chatbotToggle && 
          chatbotWindow && 
          !chatbotToggle.contains(e.target) && 
          !chatbotWindow.contains(e.target)) {
        toggleChatbot();
      }
    });
    
    // Add welcome message
    const welcomeMessage = (typeof i18n !== 'undefined' && i18n.translate) 
      ? i18n.translate('chatbot.welcome.message')
      : "Hello! 👋 Welcome to Adam International Hospital. How can I assist you today?";
    addMessage(welcomeMessage);
    
  }, 100);
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initializeChatbot };
}

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeChatbot);
} else {
  initializeChatbot();
}