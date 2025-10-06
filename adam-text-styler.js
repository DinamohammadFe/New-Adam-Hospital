// Enhanced function to make all text containing 'adam' dark red
function styleAdamText() {
    // Function to recursively walk through text nodes
    function walkTextNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            if (text.toLowerCase().includes('adam')) {
                // Create a new span element with dark red styling
                const span = document.createElement('span');
                span.style.color = '#8B0000';
                span.style.fontWeight = 'bold';
                
                // Replace the text content with styled version
                const newText = text.replace(/(adam)/gi, '<span style="color: #8B0000; font-weight: bold;">$1</span>');
                span.innerHTML = newText;
                
                // Replace the text node with the styled span
                node.parentNode.replaceChild(span, node);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Skip script and style elements
            if (node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
                // Process child nodes
                const children = Array.from(node.childNodes);
                children.forEach(child => walkTextNodes(child));
            }
        }
    }

    // Start from the body element
    walkTextNodes(document.body);
}

// Enhanced function to style elements that contain 'adam' in their class or ID
function styleAdamElements() {
    // Target elements with 'adam' in class or ID
    const adamElements = document.querySelectorAll('[class*="adam"], [id*="adam"]');
    adamElements.forEach(element => {
        element.style.color = '#8B0000';
        element.style.setProperty('color', '#8B0000', 'important');
    });

    // Target specific selectors with more comprehensive coverage
    const specificSelectors = [
        '.navbar-brand span:first-child',
        '.footer-logo span:first-child',
        '.hospital-name',
        '.brand-text',
        '.footer-title',
        'h1, h2, h3, h4, h5, h6',
        'p, span, strong, a, div'
    ];

    specificSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (element.textContent.toLowerCase().includes('adam')) {
                // Check if element has inline styles that need to be overridden
                const spans = element.querySelectorAll('span');
                spans.forEach(span => {
                    if (span.textContent.toLowerCase().includes('adam')) {
                        span.style.color = '#8B0000';
                        span.style.setProperty('color', '#8B0000', 'important');
                    }
                });
                
                // Also apply to the parent element
                element.style.color = '#8B0000';
                element.style.setProperty('color', '#8B0000', 'important');
            }
        });
    });
}

// Function to override any existing inline styles for Adam text
function overrideAdamStyles() {
    // Find all elements with inline styles containing color
    const allElements = document.querySelectorAll('*[style*="color"]');
    allElements.forEach(element => {
        if (element.textContent.toLowerCase().includes('adam')) {
            element.style.setProperty('color', '#8B0000', 'important');
        }
    });
    
    // Specifically target spans that might contain Adam text
    const spans = document.querySelectorAll('span');
    spans.forEach(span => {
        if (span.textContent.toLowerCase().includes('adam')) {
            span.style.setProperty('color', '#8B0000', 'important');
        }
    });
    
    // Specifically target the hero section
    const heroTitle = document.querySelector('.hero-main-title');
    if (heroTitle) {
        const allSpans = heroTitle.querySelectorAll('span');
        allSpans.forEach(span => {
            if (span.textContent.toLowerCase().includes('adam')) {
                // Style Adam spans in dark red
                span.style.setProperty('color', '#8B0000', 'important');
                span.style.setProperty('font-weight', '700', 'important');
            } else {
                // Style non-Adam spans in white
                span.style.setProperty('color', 'white', 'important');
            }
        });
    }
    
    // Target hero subtitle to ensure it's white
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        heroSubtitle.style.setProperty('color', 'white', 'important');
    }
    
    // Target any h1 elements that might contain Adam
    const h1Elements = document.querySelectorAll('h1');
    h1Elements.forEach(h1 => {
        const adamSpans = h1.querySelectorAll('span');
        adamSpans.forEach(span => {
            if (span.textContent.toLowerCase().includes('adam')) {
                span.style.setProperty('color', '#8B0000', 'important');
                span.style.setProperty('font-weight', '700', 'important');
            } else {
                // Make non-Adam spans white in hero section
                if (h1.classList.contains('hero-main-title')) {
                    span.style.setProperty('color', 'white', 'important');
                }
            }
        });
    });
}

// Run the styling functions when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        styleAdamElements();
        styleAdamText();
        overrideAdamStyles();
    });
} else {
    styleAdamElements();
    styleAdamText();
    overrideAdamStyles();
}

// Also run when page is fully loaded (for dynamic content)
window.addEventListener('load', function() {
    styleAdamElements();
    styleAdamText();
    overrideAdamStyles();
});

// Apply styles after a short delay to ensure all content is loaded
setTimeout(function() {
    styleAdamText();
    styleAdamElements();
    overrideAdamStyles();
}, 1000);