// Global variables

// Utility functions for better error handling and performance
const utils = {
  // Debounce function to limit function calls
  debounce: function (func, wait, immediate) {
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
    getItem: function (key) {
      try {
        return localStorage.getItem(key);
      } catch {
        // localStorage not available - silently handle
        return null;
      }
    },
    setItem: function (key, value) {
      try {
        localStorage.setItem(key, value);
        return true;
      } catch {
        // localStorage not available - silently handle
        return false;
      }
    },
  },

  // Safe DOM element selection
  safeQuerySelector: function (selector) {
    try {
      return document.querySelector(selector);
    } catch {
      // Invalid selector - silently handle
      return null;
    }
  },

  // Error logging
  logError: function (error, context) {
    // In production, send this to an error tracking service
    if (window.errorTracker) {
      window.errorTracker.log(error, context);
    }
  },
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
(function () {
  try {
    const savedTheme = utils.safeLocalStorage.getItem("theme") || "light";
    document.body.setAttribute("data-theme", savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  } catch (error) {
    utils.logError(error, "theme initialization");
    // Fallback to light theme
    document.body.setAttribute("data-theme", "light");
    document.documentElement.setAttribute("data-theme", "light");
  }
})();

// Theme toggle functionality


function handleThemeToggle(event) {
  try {
    const themeToggle = document.getElementById("themeToggle");
    const mobileThemeToggle = document.getElementById("mobileThemeToggle");
    const body = document.body;

    // Determine which toggle was clicked
    const clickedToggle = event ? event.target : themeToggle;
    
    if (!clickedToggle) {
      return;
    }

    const newTheme = clickedToggle.checked ? "dark" : "light";

    // Sync both toggles
    if (themeToggle && themeToggle !== clickedToggle) {
      themeToggle.checked = clickedToggle.checked;
    }
    if (mobileThemeToggle && mobileThemeToggle !== clickedToggle) {
      mobileThemeToggle.checked = clickedToggle.checked;
    }

    body.setAttribute("data-theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    utils.safeLocalStorage.setItem("theme", newTheme);

    const accordionThemeIconEl = utils.safeQuerySelector(
      ".accordion-theme-toggle .theme-icon"
    );
    if (accordionThemeIconEl) {
      accordionThemeIconEl.textContent = newTheme === "dark" ? "☀️" : "🌙";
    }
  } catch (error) {
    utils.logError(error, "theme toggle handling");
  }
}

// Animated Counter Function
function initCounters() {
  const counters = document.querySelectorAll("[data-target]");
  const options = {
    threshold: 0.5,
    rootMargin: "0px 0px -100px 0px",
  };

  if (typeof IntersectionObserver === 'undefined') {
    // Fallback for browsers without IntersectionObserver support
    counters.forEach(counter => {
      const targetAttr = counter.getAttribute("data-target");
      const target = parseFloat(targetAttr);
      if (targetAttr && !isNaN(target)) {
        animateCounter(counter, target);
      }
    });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const targetAttr = counter.getAttribute("data-target");
        const target = parseFloat(targetAttr);

        // Only animate if we have a valid target
        if (targetAttr && !isNaN(target)) {
          animateCounter(counter, target);
        } else {
          // Invalid or missing data-target attribute
          counter.textContent = "0";
        }
        observer.unobserve(counter);
      }
    });
  }, options);

  counters.forEach((counter) => {
    observer.observe(counter);
  });
}

function animateCounter(element, target) {
  // Check if target is a valid number
  if (isNaN(target) || target === null || target === undefined) {
    // Invalid target value for counter
    element.textContent = "0";
    return;
  }

  let current = 0;
  const increment = target / 100;
  const duration = 2000; // 2 seconds
  const stepTime = duration / 100;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }

    // Format the number based on target value
    if (target >= 1000) {
      element.textContent = Math.floor(current).toLocaleString();
    } else if (target % 1 !== 0) {
      element.textContent = current.toFixed(1);
    } else {
      element.textContent = Math.floor(current);
    }
  }, stepTime);
}

// Initialize theme and counters when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initCounters();
  initTheme();
});

// Theme initialization function
function initTheme() {
  try {
    const themeToggle = document.getElementById("themeToggle");
    const mobileThemeToggle = document.getElementById("mobileThemeToggle");
    
    // Get saved theme or default to light
    const savedTheme = utils.safeLocalStorage.getItem("theme") || "light";
    const isDark = savedTheme === "dark";
    
    // Apply theme to both body and html
    document.body.setAttribute("data-theme", savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
    
    // Set toggle states
    if (themeToggle) {
      themeToggle.checked = isDark;
      themeToggle.addEventListener('change', handleThemeToggle);
    }
    
    if (mobileThemeToggle) {
      mobileThemeToggle.checked = isDark;
      mobileThemeToggle.addEventListener('change', handleThemeToggle);
    }
    
    // Update accordion theme icon if it exists
    const accordionThemeIconEl = utils.safeQuerySelector(
      ".accordion-theme-toggle .theme-icon"
    );
    if (accordionThemeIconEl) {
      accordionThemeIconEl.textContent = isDark ? "☀️" : "🌙";
    }
    
    // Handle accordion theme toggle if it exists
    const accordionThemeToggle = document.getElementById("accordionThemeToggle");
    if (accordionThemeToggle) {
      accordionThemeToggle.addEventListener('click', function() {
        // Toggle the theme
        const currentTheme = document.body.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        
        // Apply new theme
        document.body.setAttribute("data-theme", newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
        utils.safeLocalStorage.setItem("theme", newTheme);
        
        // Update all toggles
        const isDark = newTheme === "dark";
        if (themeToggle) themeToggle.checked = isDark;
        if (mobileThemeToggle) mobileThemeToggle.checked = isDark;
        
        // Update accordion icon
        this.querySelector('.theme-icon').textContent = isDark ? "☀️" : "🌙";
      });
    }
    
  } catch (error) {
    utils.logError(error, "theme initialization");
  }
}

// Chatbot functionality has been moved to chatbot.js for better modularity

// Accordion Menu Functionality


// Remove legacy chatbot handlers; chatbot is fully managed by chatbot.js
