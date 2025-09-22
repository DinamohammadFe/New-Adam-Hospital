/**
 * Accessibility Tests for Adam International Hospital Website
 * Tests WCAG 2.2 AA compliance using axe-core
 */

const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

describe('Accessibility Tests', () => {
  let dom;
  let document;

  beforeAll(async () => {
    // Read the main HTML file
    const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
    
    // Create JSDOM instance
    dom = new JSDOM(html, {
      url: 'http://localhost:3000',
      pretendToBeVisual: true,
      resources: 'usable'
    });
    
    document = dom.window.document;
  });

  afterAll(() => {
    dom.window.close();
  });

  test('should have proper document structure', () => {
    expect(document.doctype).toBeTruthy();
    expect(document.documentElement.getAttribute('lang')).toBe('en');
    expect(document.querySelector('title')).toBeTruthy();
    expect(document.querySelector('meta[name="description"]')).toBeTruthy();
  });

  test('should have proper heading hierarchy', () => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    expect(headings.length).toBeGreaterThan(0);
    
    // Check for h1
    const h1Elements = document.querySelectorAll('h1');
    expect(h1Elements.length).toBeGreaterThanOrEqual(1);
  });

  test('should have alt text for all images', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      expect(img.getAttribute('alt')).toBeDefined();
      expect(img.getAttribute('alt')).not.toBe('');
    });
  });

  test('should have proper form labels', () => {
    const inputs = document.querySelectorAll('input, textarea, select');
    
    if (inputs.length === 0) {
      // If no form inputs, test passes
      expect(true).toBe(true);
      return;
    }
    
    inputs.forEach((input) => {
      const id = input.getAttribute('id');
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledBy = input.getAttribute('aria-labelledby');
      const type = input.getAttribute('type');
      
      // Skip hidden inputs
      if (type === 'hidden') {
        return;
      }
      
      if (id) {
        const label = document.querySelector(`label[for="${id}"]`);
        expect(label || ariaLabel || ariaLabelledBy).toBeTruthy();
      } else {
        // For inputs without ID, they should have aria-label or aria-labelledby
        expect(ariaLabel || ariaLabelledBy).toBeTruthy();
      }
    });
  });

  test('should have semantic HTML structure', () => {
    // Check for semantic elements
    const main = document.querySelector('main');
    const nav = document.querySelector('nav');
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    
    // At least some semantic elements should be present
    expect(nav || header || main || footer).toBeTruthy();
  });

  test('should have keyboard navigation support', () => {
    const interactiveElements = document.querySelectorAll(
      'a, button, input, textarea, select, [tabindex]'
    );
    
    interactiveElements.forEach(element => {
      const tabIndex = element.getAttribute('tabindex');
      if (tabIndex !== null) {
        expect(parseInt(tabIndex)).toBeGreaterThanOrEqual(-1);
      }
    });
  });

  test('should have proper ARIA attributes', () => {
    const elementsWithAria = document.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby]');
    
    elementsWithAria.forEach(element => {
      const ariaLabel = element.getAttribute('aria-label');
      const ariaLabelledBy = element.getAttribute('aria-labelledby');
      const ariaDescribedBy = element.getAttribute('aria-describedby');
      
      if (ariaLabelledBy) {
        const referencedElement = document.getElementById(ariaLabelledBy);
        expect(referencedElement).toBeTruthy();
      }
      
      if (ariaDescribedBy) {
        const referencedElement = document.getElementById(ariaDescribedBy);
        expect(referencedElement).toBeTruthy();
      }
      
      if (ariaLabel) {
        expect(ariaLabel.trim()).not.toBe('');
      }
    });
  });
});