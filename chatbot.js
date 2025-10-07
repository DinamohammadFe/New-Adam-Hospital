// Chatbot functionality
let chatbotLanguage = 'en';

// Open chatbot window
function openChatbot() {
  try {
    const winEl = document.getElementById("chatbot-window");
    const backdrop = document.getElementById("chatbot-backdrop");
    
    if (winEl) {
      winEl.classList.add("open");
      if (backdrop) {
        backdrop.classList.add("open");
      }
      generateMainMenu();
    }
  } catch (error) {
    console.error("Error opening chatbot:", error);
  }
}

// Close chatbot window
function closeChatbot() {
  try {
    const winEl = document.getElementById("chatbot-window");
    const backdrop = document.getElementById("chatbot-backdrop");
    
    if (winEl) {
      winEl.classList.remove("open");
      if (backdrop) {
        backdrop.classList.remove("open");
      }
    }
  } catch (error) {
    console.error("Error closing chatbot:", error);
  }
}

// Generate main menu for chatbot
function generateMainMenu() {
  try {
    const messagesContainer = document.getElementById("chatbot-messages");
    if (!messagesContainer) return;

    // Clear existing messages
    messagesContainer.innerHTML = '';

    // Add welcome message
    const welcomeMessage = chatbotLanguage === 'ar' 
      ? 'مرحباً بك في مستشفى آدم الدولي! كيف يمكنني مساعدتك اليوم؟'
      : 'Welcome to Adam International Hospital! How can I help you today?';
    
    addBotMessage(welcomeMessage);

    // Add quick action buttons
    const quickActions = chatbotLanguage === 'ar' 
      ? [
          { id: 'btn-location', text: 'الموقع', action: () => showLocationInfo() },
          { id: 'btn-contact', text: 'اتصل بنا', action: () => showContactInfo() },
          { id: 'btn-treatments', text: 'العلاجات', action: () => showTreatmentInfo() },
          { id: 'btn-services', text: 'الخدمات', action: () => showServicesInfo() }
        ]
      : [
          { id: 'btn-location', text: 'Location', action: () => showLocationInfo() },
          { id: 'btn-contact', text: 'Contact', action: () => showContactInfo() },
          { id: 'btn-treatments', text: 'Treatments', action: () => showTreatmentInfo() },
          { id: 'btn-services', text: 'Services', action: () => showServicesInfo() }
        ];

    // Update button texts and add event listeners
    quickActions.forEach(action => {
      const button = document.getElementById(action.id);
      if (button) {
        button.textContent = action.text;
        button.onclick = action.action;
      }
    });

  } catch (error) {
    console.error("Error generating main menu:", error);
  }
}

// Toggle chatbot language
function toggleLanguage() {
  try {
    chatbotLanguage = chatbotLanguage === 'en' ? 'ar' : 'en';
    
    // Update language toggle button
    const langToggle = document.getElementById("chatbot-lang-toggle");
    if (langToggle) {
      langToggle.textContent = chatbotLanguage === 'en' ? 'AR' : 'EN';
    }

    // Update chatbot window direction
    const chatbotWindow = document.getElementById("chatbot-window");
    if (chatbotWindow) {
      chatbotWindow.setAttribute('dir', chatbotLanguage === 'ar' ? 'rtl' : 'ltr');
    }

    // Regenerate main menu with new language
    generateMainMenu();
  } catch (error) {
    console.error("Error toggling language:", error);
  }
}

// Helper function to add bot message
function addBotMessage(text) {
  const messagesContainer = document.getElementById("chatbot-messages");
  if (!messagesContainer) return;

  const messageDiv = document.createElement('div');
  messageDiv.className = 'msg bot';
  messageDiv.innerHTML = `<div class="bubble">${text}</div>`;
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Quick action functions
function showLocationInfo() {
  const locationText = chatbotLanguage === 'ar' 
    ? 'مستشفى آدم الدولي يقع في قلب المدينة. يمكنك العثور علينا في العنوان التالي أو الاتصال بنا للحصول على الاتجاهات.'
    : 'Adam International Hospital is located in the heart of the city. You can find us at our main address or contact us for directions.';
  addBotMessage(locationText);
}

function showContactInfo() {
  const contactText = chatbotLanguage === 'ar' 
    ? 'يمكنك الاتصال بنا على الرقم: 16992 أو زيارة موقعنا الإلكتروني لمزيد من المعلومات.'
    : 'You can contact us at: 16992 or visit our website for more information.';
  addBotMessage(contactText);
}

function showTreatmentInfo() {
  const treatmentText = chatbotLanguage === 'ar' 
    ? 'نحن نقدم مجموعة واسعة من علاجات الخصوبة بما في ذلك أطفال الأنابيب، الحقن المجهري، وتجميد البويضات.'
    : 'We offer a wide range of fertility treatments including IVF, ICSI, egg freezing, and more.';
  addBotMessage(treatmentText);
}

function showServicesInfo() {
  const servicesText = chatbotLanguage === 'ar' 
    ? 'خدماتنا تشمل استشارات الخصوبة، الفحوصات التشخيصية، والدعم النفسي للمرضى.'
    : 'Our services include fertility consultations, diagnostic tests, and psychological support for patients.';
  addBotMessage(servicesText);
}

// Initialize event bindings when DOM is ready (with readyState fallback)
function initChatbotBindings() {
  try {
    if (window.__chatbotInitDone) return;
    window.__chatbotInitDone = true;

    const fab = document.getElementById("chatbot-fab");
    const winEl = document.getElementById("chatbot-window");
    const langToggle = document.getElementById("chatbot-lang-toggle");
    const closeBtn = document.getElementById("chatbot-close");
    const backdrop = document.getElementById("chatbot-backdrop");

    if (fab && winEl) {
      fab.addEventListener("click", () => {
        const isOpen = winEl.classList.contains("open");
        if (isOpen) {
          closeChatbot();
        } else {
          openChatbot();
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", closeChatbot);
    }

    if (backdrop) {
      backdrop.addEventListener("click", closeChatbot);
    }

    if (langToggle) {
      langToggle.addEventListener("click", toggleLanguage);
    }

    // Initialize with default language
    generateMainMenu();
  } catch (err) {
    console.error("Chatbot initialization failed", err);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initChatbotBindings, { once: true });
} else {
  // DOM is already parsed; initialize immediately
  initChatbotBindings();
}
