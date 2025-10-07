#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Simple CSS minifier
function minifyCSS(css) {
  return css
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove unnecessary whitespace
    .replace(/\s+/g, ' ')
    // Remove whitespace around certain characters
    .replace(/\s*([{}:;,>+~])\s*/g, '$1')
    // Remove trailing semicolons
    .replace(/;}/g, '}')
    // Remove leading/trailing whitespace
    .trim();
}

// Remove unused CSS (basic implementation)
function removeUnusedCSS(css, htmlFiles) {
  const usedClasses = new Set();
  const usedIds = new Set();
  
  // Extract classes and IDs from HTML files
  htmlFiles.forEach(htmlFile => {
    const htmlContent = fs.readFileSync(htmlFile, 'utf8');
    
    // Extract classes
    const classMatches = htmlContent.match(/class\s*=\s*["'][^"']*["']/g);
    if (classMatches) {
      classMatches.forEach(match => {
        const classes = match.match(/["']([^"']*)["']/)[1].split(/\s+/);
        classes.forEach(cls => cls && usedClasses.add(cls));
      });
    }
    
    // Extract IDs
    const idMatches = htmlContent.match(/id\s*=\s*["'][^"']*["']/g);
    if (idMatches) {
      idMatches.forEach(match => {
        const id = match.match(/["']([^"']*)["']/)[1];
        id && usedIds.add(id);
      });
    }
    
    // Extract data-i18n attributes (for our i18n system)
    const i18nMatches = htmlContent.match(/data-i18n[^=]*=\s*["'][^"']*["']/g);
    if (i18nMatches) {
      // Keep all i18n related styles
      usedClasses.add('i18n');
    }
  });
  
  // Keep essential classes that might be added dynamically
  const essentialClasses = [
    'active', 'show', 'hide', 'open', 'closed', 'loading', 'error', 'success',
    'btn', 'nav', 'dropdown', 'modal', 'carousel', 'alert', 'card', 'form',
    'chatbot', 'dark-theme', 'rtl'
  ];
  
  essentialClasses.forEach(cls => usedClasses.add(cls));
  
  console.log(`Found ${usedClasses.size} used classes and ${usedIds.size} used IDs`);
  
  return css; // For now, return original CSS (basic implementation)
}

// Optimize performance
async function optimizePerformance() {
  console.log('🚀 Starting performance optimization...');
  
  try {
    // Get all HTML files
    const htmlFiles = fs.readdirSync(rootDir)
      .filter(file => file.endsWith('.html'))
      .map(file => path.join(rootDir, file));
    
    console.log(`📄 Found ${htmlFiles.length} HTML files`);
    
    // Read main CSS file
    const cssPath = path.join(rootDir, 'styles.css');
    const originalCSS = fs.readFileSync(cssPath, 'utf8');
    const originalSize = originalCSS.length;
    
    console.log(`📊 Original CSS size: ${(originalSize / 1024).toFixed(2)} KB`);
    
    // Remove unused CSS
    let optimizedCSS = removeUnusedCSS(originalCSS, htmlFiles);
    
    // Minify CSS
    optimizedCSS = minifyCSS(optimizedCSS);
    const optimizedSize = optimizedCSS.length;
    
    // Create optimized CSS file
    const optimizedCSSPath = path.join(rootDir, 'styles.min.css');
    fs.writeFileSync(optimizedCSSPath, optimizedCSS);
    
    const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2);
    console.log(`✅ Optimized CSS size: ${(optimizedSize / 1024).toFixed(2)} KB`);
    console.log(`💾 Size reduction: ${savings}%`);
    
    // Create performance report
    const report = {
      timestamp: new Date().toISOString(),
      originalSize: originalSize,
      optimizedSize: optimizedSize,
      savings: `${savings}%`,
      files: {
        original: 'styles.css',
        optimized: 'styles.min.css'
      }
    };
    
    const reportPath = path.join(rootDir, 'performance-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('📋 Performance report saved to performance-report.json');
    console.log('🎉 Performance optimization completed!');
    
  } catch (error) {
    console.error('❌ Error during optimization:', error.message);
    process.exit(1);
  }
}

// Run optimization
optimizePerformance();