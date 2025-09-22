// Global variables

// Early theme initialization to prevent flash of unstyled content
(function() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.body.setAttribute("data-theme", savedTheme);
  document.documentElement.setAttribute("data-theme", savedTheme);
})();



// Theme toggle functionality
function initializeThemeToggle() {
  const themeToggle = document.getElementById("themeToggle");
  const themeIconElement = document.querySelector(".theme-icon i");
  
  const currentTheme = localStorage.getItem("theme") || "light";
  document.body.setAttribute("data-theme", currentTheme);
  document.documentElement.setAttribute("data-theme", currentTheme);
  
  if (themeToggle) {
    themeToggle.removeEventListener("change", handleThemeToggle);
    themeToggle.checked = currentTheme === "dark";
    
    if (themeIconElement) {
      themeIconElement.className = currentTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
    }
    
    themeToggle.addEventListener("change", handleThemeToggle);
  }
}

function handleThemeToggle() {
  const themeToggle = document.getElementById("themeToggle");
  const themeIconElement = document.querySelector(".theme-icon i");
  const body = document.body;
  const newTheme = themeToggle.checked ? "dark" : "light";
  
  body.setAttribute("data-theme", newTheme);
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  
  if (themeIconElement) {
    themeIconElement.className = newTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
  }
  
  const accordionThemeIconEl = document.querySelector(".accordion-theme-toggle .theme-icon");
  if (accordionThemeIconEl) {
    accordionThemeIconEl.textContent = newTheme === "dark" ? "☀️" : "🌙";
  }
}

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
    
    function toggleChatbot() {
      isOpen = !isOpen;
      chatbotWindow.classList.toggle("open", isOpen);
      
      if (isOpen && chatbotInput) {
        chatbotInput.focus();
      }
    }
    
    function addMessage(content, isUser = false) {
      if (!chatbotMessages) {
        return;
      }
      
      const messageDiv = document.createElement("div");
      messageDiv.className = `message ${isUser ? "user-message" : "bot-message"}`;
      
      messageDiv.innerHTML = `
        <div class="message-avatar">
          ${isUser ? "👤" : "🏥"}
        </div>
        <div class="message-content">
          <p>${content}</p>
        </div>
      `;
      
      chatbotMessages.appendChild(messageDiv);
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    function sendMessage() {
      if (!chatbotInput) {
        return;
      }
      
      const message = chatbotInput.value.trim();
      if (message) {
        addMessage(message, true);
        chatbotInput.value = "";
        
        setTimeout(() => {
          addMessage("Thank you for your message. Our team will get back to you soon!");
        }, 1000);
      }
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
    addMessage("Hello! How can I help you today?");
    
  }, 100);
}

// Statistics Counter Functions
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  
  if (counters.length === 0) {
    console.log('No counters found');
    return;
  }

  // Use Intersection Observer for better performance
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          if (!counter.classList.contains('counted')) {
            animateCounter(counter);
            counter.classList.add('counted');
          }
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '0px 0px -50px 0px'
    });

    counters.forEach(counter => {
      observer.observe(counter);
    });
  } else {
    // Fallback for older browsers
    const handleScroll = () => {
      counters.forEach(counter => {
        if (!counter.classList.contains('counted')) {
          const rect = counter.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            animateCounter(counter);
            counter.classList.add('counted');
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
  }
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'));
  const duration = 2000; // 2 seconds
  const increment = target / (duration / 16); // 60fps
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    
    // Format number with commas for thousands
    const formattedNumber = Math.floor(current).toLocaleString();
    element.textContent = formattedNumber;
  }, 16);
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
  setTimeout(() => {
    initializeThemeToggle();
    initializeChatbot();
    initCounters();
  }, 100);
});

// Initialize on window load as backup
window.addEventListener("load", function() {
  setTimeout(() => {
    initializeThemeToggle();
    initializeChatbot();
    initCounters();
  }, 100);
});