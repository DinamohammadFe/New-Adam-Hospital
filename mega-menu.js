/**
 * Hospital Mega Menu System
 * Enhanced navigation with accessibility, mobile responsiveness, and smooth interactions
 */

class HospitalMegaMenu {
  constructor() {
    this.activeDropdown = null;
    this.touchStartTime = 0;
    this.isAnimating = false;
    this.mobileAccordions = new Map();
    this.isInitialized = false;
    this.isMobile = window.innerWidth <= 767.98;
    this.hoverTimeout = null;
    this.init();
  }

  init() {
    if (this.isInitialized) {
      return;
    }
    
    this.setupEventListeners();
    this.setupMobileAccordions();
    this.setupKeyboardNavigation();
    this.setupAccessibility();
    this.isInitialized = true;
  }

  setupEventListeners() {
    // Desktop dropdown toggles
    const dropdownToggles = document.querySelectorAll('.mega-dropdown .nav-link');
    
    dropdownToggles.forEach(toggle => {
      // Mouse events for desktop
      toggle.addEventListener('mouseenter', (e) => {
        if (!this.isMobile) {
          this.showMegaMenu(e.target);
        }
      });

      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.isMobile) {
          this.toggleMegaMenu(e.target);
        } else {
          this.showMegaMenu(e.target);
        }
      });
    });

    // Close on mouse leave for desktop with delay
    const megaDropdowns = document.querySelectorAll('.mega-dropdown');
    megaDropdowns.forEach(dropdown => {
      dropdown.addEventListener('mouseenter', () => {
        if (!this.isMobile && this.hoverTimeout) {
          clearTimeout(this.hoverTimeout);
          this.hoverTimeout = null;
        }
      });
      
      dropdown.addEventListener('mouseleave', () => {
        if (!this.isMobile) {
          // Add a delay before closing to allow moving between menu items
          this.hoverTimeout = setTimeout(() => {
            this.hideMegaMenu();
            this.hoverTimeout = null;
          }, 300); // 300ms delay
        }
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.mega-dropdown')) {
        this.hideMegaMenu();
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      const wasMobile = this.isMobile;
      this.isMobile = window.innerWidth <= 767.98;
      
      if (wasMobile !== this.isMobile) {
        this.hideMegaMenu();
        if (this.isMobile) {
          this.setupMobileAccordion();
        }
      }
    });
  }

  setupKeyboardNavigation() {
    // Enhanced keyboard navigation for WCAG compliance
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllMenus();
        // Return focus to the trigger element
        const activeElement = document.activeElement;
        if (activeElement && activeElement.closest('.mega-dropdown')) {
          const toggle = activeElement.closest('.mega-dropdown').querySelector('.dropdown-toggle');
          if (toggle) {
            toggle.focus();
          }
        }
      }
      
      if (e.key === 'Tab') {
        this.handleTabNavigation(e);
      }
      
      // Arrow key navigation within mega menus
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        this.handleArrowNavigation(e);
      }
      
      // Enter and Space key handling
      if (e.key === 'Enter' || e.key === ' ') {
        this.handleEnterSpaceNavigation(e);
      }
    });
  }

  handleTabNavigation(e) {
    const activeDropdown = document.querySelector('.mega-dropdown.show');
    if (!activeDropdown) {
      return;
    }
    
    const focusableElements = activeDropdown.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) {
      return;
    }
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Trap focus within the mega menu
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }

  handleArrowNavigation(e) {
    const activeElement = document.activeElement;
    if (!activeElement || !activeElement.closest('.mega-menu')) {
      return;
    }
    
    const megaMenu = activeElement.closest('.mega-menu');
    const focusableElements = Array.from(megaMenu.querySelectorAll(
      '.dropdown-item, .mega-menu-header'
    ));
    
    const currentIndex = focusableElements.indexOf(activeElement);
    if (currentIndex === -1) {
      return;
    }
    
    e.preventDefault();
    
    let nextIndex;
    if (e.key === 'ArrowDown') {
      nextIndex = currentIndex + 1;
      if (nextIndex >= focusableElements.length) {
        nextIndex = 0;
      }
    } else {
      nextIndex = currentIndex - 1;
      if (nextIndex < 0) {
        nextIndex = focusableElements.length - 1;
      }
    }
    
    focusableElements[nextIndex].focus();
  }

  handleEnterSpaceNavigation(e) {
    const activeElement = document.activeElement;
    if (!activeElement) {
      return;
    }
    
    // Handle accordion toggles
    if (activeElement.classList.contains('mega-menu-header')) {
      e.preventDefault();
      activeElement.click();
    }
    
    // Handle dropdown toggles
    if (activeElement.classList.contains('dropdown-toggle')) {
      e.preventDefault();
      activeElement.click();
    }
  }

  setupMobileAccordions() {
    // Enhanced mobile accordion functionality for mega menus
    const megaMenuHeaders = document.querySelectorAll('.mega-menu h6');
    
    megaMenuHeaders.forEach(header => {
      const list = header.nextElementSibling;
      if (list && list.tagName === 'UL') {
        // Convert header to button for accessibility
        const button = document.createElement('button');
        button.className = 'mega-menu-header';
        button.textContent = header.textContent;
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-controls', list.id || `list-${Math.random().toString(36).substr(2, 9)}`);
        
        if (!list.id) {
          list.id = button.getAttribute('aria-controls');
        }
        
        header.parentNode.replaceChild(button, header);
        
        // Add click handler
        button.addEventListener('click', (e) => {
          e.preventDefault();
          this.toggleMobileAccordion(button, list);
        });
        
        this.mobileAccordions.set(button, list);
      }
    });
    
    // Setup existing accordion menu
    const accordionToggles = document.querySelectorAll('.accordion-toggle');
    
    accordionToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = toggle.getAttribute('data-target');
        const panel = document.getElementById(targetId);
        
        if (panel) {
          this.toggleAccordionPanel(panel, toggle);
        }
      });
    });
  }

  toggleMobileAccordion(button, list) {
    const isActive = list.classList.contains('show');
    
    // Close other accordions in the same mega menu
    const megaMenu = button.closest('.mega-menu');
    if (megaMenu) {
      const otherButtons = megaMenu.querySelectorAll('.mega-menu-header');
      otherButtons.forEach(otherButton => {
        if (otherButton !== button) {
          const otherList = this.mobileAccordions.get(otherButton);
          if (otherList) {
            otherList.classList.remove('show');
            otherButton.classList.remove('active');
            otherButton.setAttribute('aria-expanded', 'false');
          }
        }
      });
    }
    
    // Toggle current accordion
    if (isActive) {
      list.classList.remove('show');
      button.classList.remove('active');
      button.setAttribute('aria-expanded', 'false');
    } else {
      list.classList.add('show');
      button.classList.add('active');
      button.setAttribute('aria-expanded', 'true');
    }
  }

  setupAccessibility() {
    // Add ARIA attributes
    const dropdownToggles = document.querySelectorAll('.mega-dropdown .nav-link');
    const megaMenus = document.querySelectorAll('.mega-menu');

    dropdownToggles.forEach((toggle, index) => {
      toggle.setAttribute('aria-haspopup', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-controls', `mega-menu-${index}`);
    });

    megaMenus.forEach((menu, index) => {
      menu.setAttribute('id', `mega-menu-${index}`);
      menu.setAttribute('role', 'menu');
      
      // Add role to menu items
      const menuItems = menu.querySelectorAll('.dropdown-item');
      menuItems.forEach(item => {
        item.setAttribute('role', 'menuitem');
        item.setAttribute('tabindex', '-1');
      });
    });
  }

  showMegaMenu(trigger) {
    // Hide any currently active menu
    this.hideMegaMenu();

    const dropdown = trigger.closest('.mega-dropdown');
    const megaMenu = dropdown.querySelector('.mega-menu');
    
    if (!megaMenu) {
      return;
    }

    // Show the menu
    dropdown.classList.add('show');
    megaMenu.classList.add('show');
    
    // Update ARIA attributes
    trigger.setAttribute('aria-expanded', 'true');
    
    // Add body class to prevent horizontal scroll
    document.body.classList.add('mega-menu-open');
    
    // Set active dropdown
    this.activeDropdown = dropdown;
    
    // Focus first menu item for keyboard users
    setTimeout(() => {
      const firstMenuItem = megaMenu.querySelector('.dropdown-item');
      if (firstMenuItem && document.activeElement === trigger) {
        firstMenuItem.focus();
      }
    }, 100);

    // Trigger staggered animations
    this.triggerStaggeredAnimations(megaMenu);
  }

  hideMegaMenu() {
    if (!this.activeDropdown) {
      return;
    }

    const megaMenu = this.activeDropdown.querySelector('.mega-menu');
    const trigger = this.activeDropdown.querySelector('.nav-link');
    
    // Hide the menu
    this.activeDropdown.classList.remove('show');
    if (megaMenu) {
      megaMenu.classList.remove('show');
    }
    
    // Update ARIA attributes
    if (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
    }
    
    // Remove body class
    document.body.classList.remove('mega-menu-open');
    
    // Clear active dropdown
    this.activeDropdown = null;
  }

  toggleMegaMenu(trigger) {
    const dropdown = trigger.closest('.mega-dropdown');
    const isActive = dropdown.classList.contains('show');
    
    if (isActive) {
      this.hideMegaMenu();
    } else {
      this.showMegaMenu(trigger);
    }
  }

  toggleAccordionSection(header) {
    const listContainer = header.nextElementSibling;
    if (!listContainer) {
      return;
    }

    const isActive = header.classList.contains('active');
    
    // Close all other sections
    const allHeaders = document.querySelectorAll('.mega-menu .mega-menu-header');
    allHeaders.forEach(h => {
      if (h !== header) {
        h.classList.remove('active');
        const list = h.nextElementSibling;
        if (list) {
          list.classList.remove('show');
        }
      }
    });

    // Toggle current section
    if (isActive) {
      header.classList.remove('active');
      listContainer.classList.remove('show');
    } else {
      header.classList.add('active');
      listContainer.classList.add('show');
    }
  }

  closeAllMenus() {
    this.hideMegaMenu();
  }

  triggerStaggeredAnimations(megaMenu) {
    const items = megaMenu.querySelectorAll('.dropdown-item');
    items.forEach((item, index) => {
      item.style.animationDelay = `${0.1 + (index * 0.05)}s`;
    });
  }

  // Public methods for external control
  closeAll() {
    this.hideMegaMenu();
  }

  isOpen() {
    return this.activeDropdown !== null;
  }
}

// Enhanced hover effects for navigation links
class NavigationEnhancer {
  constructor() {
    this.init();
  }

  init() {
    this.setupHoverEffects();
    this.setupFocusEffects();
  }

  setupHoverEffects() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
      link.addEventListener('mouseenter', (e) => {
        this.addHoverEffect(e.target);
      });
      
      link.addEventListener('mouseleave', (e) => {
        this.removeHoverEffect(e.target);
      });
    });
  }

  setupFocusEffects() {
    const focusableElements = document.querySelectorAll('.dropdown-item, .nav-link');
    
    focusableElements.forEach(element => {
      element.addEventListener('focus', (e) => {
        e.target.classList.add('focused');
      });
      
      element.addEventListener('blur', (e) => {
        e.target.classList.remove('focused');
      });
    });
  }

  addHoverEffect(element) {
    element.style.transform = 'translateY(-1px)';
  }

  removeHoverEffect(element) {
    element.style.transform = '';
  }
}

// Performance optimization for smooth animations
class AnimationOptimizer {
  constructor() {
    this.init();
  }

  init() {
    // Use requestAnimationFrame for smooth animations
    this.setupRAFAnimations();
    
    // Optimize for reduced motion preference
    this.handleReducedMotion();
  }

  setupRAFAnimations() {
    const animatedElements = document.querySelectorAll('.mega-menu .dropdown-item');
    
    animatedElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        requestAnimationFrame(() => {
          element.style.willChange = 'transform, box-shadow';
        });
      });
      
      element.addEventListener('mouseleave', () => {
        requestAnimationFrame(() => {
          element.style.willChange = 'auto';
        });
      });
    });
  }

  handleReducedMotion() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.style.setProperty('--transition-smooth', 'none');
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new HospitalMegaMenu();
  });
} else {
  new HospitalMegaMenu();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HospitalMegaMenu, NavigationEnhancer, AnimationOptimizer };
}