// Global variables

// Utility functions for better error handling and performance
const utils = {
  // Debounce function to limit function calls
  debounce: function(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) {
          func.apply(this, args);
        }
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        func.apply(this, args);
      }
    };
  },

  // Safe localStorage access with error handling
  safeLocalStorage: {
    getItem: function(key) {
      try {
        return localStorage.getItem(key);
      } catch {
        // localStorage not available - silently handle
        return null;
      }
    },
    setItem: function(key, value) {
      try {
        localStorage.setItem(key, value);
        return true;
      } catch {
        // localStorage not available - silently handle
        return false;
      }
    }
  },

  // Safe DOM element selection
  safeQuerySelector: function(selector) {
    try {
      return document.querySelector(selector);
    } catch {
      // Invalid selector - silently handle
      return null;
    }
  },

  // Error logging
  logError: function(error, context) {
    // In production, send this to an error tracking service
    if (window.errorTracker) {
      window.errorTracker.log(error, context);
    }
  }
};

// Polyfill for IntersectionObserver
if (!window.IntersectionObserver) {
  window.IntersectionObserver = class {
    constructor(callback) {
      this.callback = callback;
    }
    observe(element) {
      // Fallback: trigger callback immediately
      this.callback([{ isIntersecting: true, target: element }]);
    }
    unobserve() {}
    disconnect() {}
  };
}

// Early theme initialization to prevent flash of unstyled content
(function() {
  try {
    const savedTheme = utils.safeLocalStorage.getItem("theme") || "light";
    document.body.setAttribute("data-theme", savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  } catch (error) {
    utils.logError(error, 'theme initialization');
    // Fallback to light theme
    document.body.setAttribute("data-theme", "light");
    document.documentElement.setAttribute("data-theme", "light");
  }
})();



// Theme toggle functionality
function initializeThemeToggle() {
  try {
    const themeToggle = document.getElementById("themeToggle");
    const themeIconElement = utils.safeQuerySelector(".theme-icon i");
    
    const currentTheme = utils.safeLocalStorage.getItem("theme") || "light";
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
    
    // Initialize accordion theme toggle icon
    const accordionThemeIconEl = utils.safeQuerySelector(".accordion-theme-toggle .theme-icon");
    if (accordionThemeIconEl) {
      accordionThemeIconEl.textContent = currentTheme === "dark" ? "☀️" : "🌙";
    }
  } catch (error) {
    utils.logError(error, 'theme toggle initialization');
  }
}

function handleThemeToggle() {
  try {
    const themeToggle = document.getElementById("themeToggle");
    const themeIconElement = utils.safeQuerySelector(".theme-icon i");
    const body = document.body;
    
    if (!themeToggle) {
      return;
    }
    
    const newTheme = themeToggle.checked ? "dark" : "light";
    
    body.setAttribute("data-theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    utils.safeLocalStorage.setItem("theme", newTheme);
    
    if (themeIconElement) {
      themeIconElement.className = newTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
    }
    
    const accordionThemeIconEl = utils.safeQuerySelector(".accordion-theme-toggle .theme-icon");
    if (accordionThemeIconEl) {
      accordionThemeIconEl.textContent = newTheme === "dark" ? "☀️" : "🌙";
    }
  } catch (error) {
    utils.logError(error, 'theme toggle handling');
  }
}

// Chatbot functionality has been moved to chatbot.js for better modularity

// Accordion Menu Functionality
function openAccordionMenu() {
  try {
    const menu = document.getElementById("accordionMenu");
    if (menu) {
      menu.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  } catch (error) {
    utils.logError(error, 'opening accordion menu');
  }
}

// Ensure chatbot script loads on all pages that include home.js
(function ensureChatbotLoaded() {
  try {
    // Avoid duplicate injection
    if (!document.querySelector('script[src="chatbot.js"]')) {
      const s = document.createElement('script');
      s.src = 'chatbot.js';
      s.defer = true;
      s.setAttribute('data-auto', 'true');
      document.body.appendChild(s);
    }
  } catch (err) {
    utils.logError(err, 'ensureChatbotLoaded');
  }
})();

function closeAccordionMenu() {
  try {
    const menu = document.getElementById("accordionMenu");
    if (menu) {
      menu.classList.remove("active");
      document.body.style.overflow = "";

      // Close all accordion panels
      const panels = document.querySelectorAll(".accordion-panel");
      const toggles = document.querySelectorAll(".accordion-toggle");

      panels.forEach((panel) => panel.classList.remove("active"));
      toggles.forEach((toggle) => toggle.classList.remove("active"));
    }
  } catch (error) {
    utils.logError(error, 'closing accordion menu');
  }
}

function toggleAccordionPanel(targetId, toggleButton) {
  try {
    const panel = document.getElementById(targetId);
    if (!panel) {
      return;
    }
    
    const isActive = panel.classList.contains("active");

    // Close all other panels
    const allPanels = document.querySelectorAll(".accordion-panel");
    const allToggles = document.querySelectorAll(".accordion-toggle");

    allPanels.forEach((p) => {
      if (p !== panel) {
        p.classList.remove("active");
      }
    });

    allToggles.forEach((t) => {
      if (t !== toggleButton) {
        t.classList.remove("active");
      }
    });

    // Toggle current panel
    if (isActive) {
      panel.classList.remove("active");
      toggleButton.classList.remove("active");
    } else {
      panel.classList.add("active");
      toggleButton.classList.add("active");
    }
  } catch (error) {
    utils.logError(error, 'toggling accordion panel');
  }
}

function initializeHamburgerMenu() {
  try {
    // Menu toggle (custom accordion menu)
    const menuToggle = document.getElementById("menuToggle");
    if (menuToggle) {
      menuToggle.addEventListener("click", function () {
        try {
          this.classList.toggle("active");
          if (this.classList.contains("active")) {
            openAccordionMenu();
          } else {
            closeAccordionMenu();
          }
        } catch (error) {
          utils.logError(error, 'menu toggle click');
        }
      });
    }

    // Accordion toggles
    const accordionToggles = document.querySelectorAll(".accordion-toggle");
    accordionToggles.forEach((toggle) => {
      toggle.addEventListener("click", function () {
        try {
          const targetId = this.getAttribute("data-target");
          toggleAccordionPanel(targetId, this);
        } catch (error) {
          utils.logError(error, 'accordion toggle click');
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", function(event) {
      try {
        const menu = document.getElementById("accordionMenu");
        const menuToggle = document.getElementById("menuToggle");
        
        if (menu && menuToggle && 
            !menu.contains(event.target) && 
            !menuToggle.contains(event.target) && 
            menu.classList.contains("active")) {
          menuToggle.classList.remove("active");
          closeAccordionMenu();
        }
      } catch (error) {
        utils.logError(error, 'outside click handler');
      }
    });
  } catch (error) {
    utils.logError(error, 'hamburger menu initialization');
  }
}

// Statistics Counter Functions
function initCounters() {
  try {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    if (counters.length === 0) {
      return;
    }

    // Use Intersection Observer for better performance
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        try {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const counter = entry.target;
              if (!counter.classList.contains('counted')) {
                animateCounter(counter);
                counter.classList.add('counted');
              }
            }
          });
        } catch (error) {
          utils.logError(error, 'intersection observer callback');
        }
      }, {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
      });

      counters.forEach(counter => {
        observer.observe(counter);
      });
    } else {
      // Fallback for older browsers with debounced scroll
      const handleScroll = utils.debounce(() => {
        try {
          counters.forEach(counter => {
            if (!counter.classList.contains('counted')) {
              const rect = counter.getBoundingClientRect();
              if (rect.top < window.innerHeight && rect.bottom > 0) {
                animateCounter(counter);
                counter.classList.add('counted');
              }
            }
          });
        } catch (error) {
          utils.logError(error, 'scroll counter handler');
        }
      }, 100); // Debounce scroll events by 100ms

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Check initial state
    }
  } catch (error) {
    utils.logError(error, 'counter initialization');
  }
}

function animateCounter(element) {
  try {
    const target = parseInt(element.getAttribute('data-target'));
    if (isNaN(target)) {
      // Invalid counter target - silently handle
      return;
    }
    
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
      try {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        
        // Format number with commas for thousands
        const formattedNumber = Math.floor(current).toLocaleString();
        element.textContent = formattedNumber;
      } catch (error) {
        utils.logError(error, 'counter animation');
        clearInterval(timer);
      }
    }, 16);
  } catch (error) {
    utils.logError(error, 'animate counter');
  }
}

// Accordion theme toggle functionality
function initializeAccordionThemeToggle() {
  try {
    const accordionThemeToggle = document.getElementById("accordionThemeToggle");
    
    if (accordionThemeToggle) {
      // Remove existing event listener to prevent duplicates
      accordionThemeToggle.removeEventListener("click", handleAccordionThemeToggle);
      
      // Add event listener
      accordionThemeToggle.addEventListener("click", handleAccordionThemeToggle);
    }
  } catch (error) {
    utils.logError(error, 'accordion theme toggle initialization');
  }
}

function handleAccordionThemeToggle() {
  try {
    const currentTheme = utils.safeLocalStorage.getItem("theme") || "light";
    const accordionThemeIconEl = utils.safeQuerySelector(".accordion-theme-toggle .theme-icon");
    
    // Toggle theme
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    
    // Apply theme
    document.body.setAttribute("data-theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    utils.safeLocalStorage.setItem("theme", newTheme);
    
    // Update accordion theme icon
    if (accordionThemeIconEl) {
      accordionThemeIconEl.textContent = newTheme === "dark" ? "☀️" : "🌙";
    }
    
    // Update main theme toggle if it exists
    const mainThemeToggle = document.getElementById("themeToggle");
    
    if (mainThemeToggle) {
      mainThemeToggle.checked = newTheme === "dark";
    }
  } catch (error) {
    utils.logError(error, 'accordion theme toggle handling');
  }
}

// Main initialization function with error handling
function initializeApp() {
  try {
    initializeThemeToggle();
    initializeAccordionThemeToggle();
    initCounters();
    initializeHamburgerMenu();
  } catch (error) {
    utils.logError(error, 'app initialization');
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
  try {
    // Small delay to ensure all elements are rendered
    setTimeout(initializeApp, 100);
  } catch (error) {
    utils.logError(error, 'DOM content loaded');
  }
});

// Initialize on window load as backup
window.addEventListener("load", function() {
  try {
    // Backup initialization in case DOMContentLoaded didn't fire
    setTimeout(initializeApp, 100);
  } catch (error) {
    utils.logError(error, 'window load');
  }
});

// Add global error handler for unhandled errors
window.addEventListener('error', function(event) {
  utils.logError(event.error, 'global error handler');
});

// Add global handler for unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
  utils.logError(event.reason, 'unhandled promise rejection');
});