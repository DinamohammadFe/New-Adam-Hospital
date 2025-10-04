// Initialize event bindings when DOM is ready (with readyState fallback)
function initChatbotBindings() {
  try {
    if (window.__chatbotInitDone) return;
    window.__chatbotInitDone = true;

    const fab = document.getElementById("chatbot-fab");
    const winEl = document.getElementById("chatbot-window");
    const langToggle = document.getElementById("chatbot-lang-toggle");

    if (fab && winEl) {
      fab.addEventListener("click", () => {
        const isOpen = winEl.classList.contains("open");
        if (isOpen) {
          if (typeof closeChatbot === "function") {
            closeChatbot();
          } else {
            winEl.classList.remove("open");
          }
        } else {
          if (typeof openChatbot === "function") {
            openChatbot();
          } else {
            winEl.classList.add("open");
          }
          if (typeof generateMainMenu === "function") {
            generateMainMenu();
          }
        }
      });
    }

    if (langToggle && typeof toggleLanguage === "function") {
      langToggle.addEventListener("click", toggleLanguage);
    }
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
