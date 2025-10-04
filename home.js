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
        themeIconElement.className =
          currentTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
      }

      themeToggle.addEventListener("change", handleThemeToggle);
    }
    
  } catch (error) {
    console.error("Theme toggle initialization failed", error);
  }
}


    // Initialize accordion theme toggle icon
    const accordionThemeIconEl = utils.safeQuerySelector(
      ".accordion-theme-toggle .theme-icon"
    );
    if (accordionThemeIconEl) {
      accordionThemeIconEl.textContent = currentTheme === "dark" ? "☀️" : "🌙";
    }
  } catch (error) {
    utils.logError(error, "theme toggle initialization");
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
      themeIconElement.className =
        newTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
    }

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
    utils.logError(error, "opening accordion menu");
  }
}

// Remove legacy chatbot handlers; chatbot is fully managed by chatbot.js
