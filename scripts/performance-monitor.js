#!/usr/bin/env node

/**
 * Performance Monitoring Script for Adam International Hospital
 * Monitors Core Web Vitals and healthcare-specific metrics
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Healthcare-specific performance thresholds
const PERFORMANCE_THRESHOLDS = {
  // Core Web Vitals
  LCP: 2500, // Largest Contentful Paint (ms)
  FID: 100,  // First Input Delay (ms)
  CLS: 0.1,  // Cumulative Layout Shift
  FCP: 2000, // First Contentful Paint (ms)
  TTI: 3000, // Time to Interactive (ms)
  
  // Healthcare-specific
  ACCESSIBILITY: 90,    // Accessibility score (%)
  PERFORMANCE: 80,      // Performance score (%)
  SEO: 80,             // SEO score (%)
  BEST_PRACTICES: 80,  // Best Practices score (%)
  
  // Medical content specific
  FORM_RESPONSE: 200,   // Form interaction response time (ms)
  APPOINTMENT_LOAD: 1500, // Appointment booking load time (ms)
  SEARCH_RESPONSE: 300   // Medical information search response (ms)
};

// Pages to monitor
const PAGES_TO_MONITOR = [
  { url: '/', name: 'Homepage', critical: true },
  { url: '/genetic-testing.html', name: 'Genetic Testing', critical: true },
  { url: '/ivf.html', name: 'IVF Services', critical: true },
  { url: '/ivf-icsi.html', name: 'IVF-ICSI', critical: false },
  { url: '/endometriosis.html', name: 'Endometriosis', critical: false },
  { url: '/embryo-freezing.html', name: 'Embryo Freezing', critical: false },
  { url: '/female-fertility.html', name: 'Female Fertility', critical: true },
  { url: '/male-fertility.html', name: 'Male Fertility', critical: true },
  { url: '/pcos.html', name: 'PCOS Treatment', critical: false }
];

class PerformanceMonitor {
  constructor() {
    this.results = [];
    this.timestamp = new Date().toISOString();
  }

  async runLighthouse(url, preset = 'desktop') {
    console.log(`🔍 Analyzing ${url} (${preset})...`);
    
    try {
      const command = `npx lighthouse ${url} --preset=${preset} --output=json --quiet --chrome-flags="--headless --no-sandbox"`;
      const result = execSync(command, { encoding: 'utf8' });
      return JSON.parse(result);
    } catch (error) {
      console.error(`❌ Error analyzing ${url}:`, error.message);
      return null;
    }
  }

  analyzeResults(lighthouseResult, pageName) {
    if (!lighthouseResult) return null;

    const { categories, audits } = lighthouseResult;
    
    const metrics = {
      pageName,
      timestamp: this.timestamp,
      scores: {
        performance: Math.round(categories.performance.score * 100),
        accessibility: Math.round(categories.accessibility.score * 100),
        bestPractices: Math.round(categories['best-practices'].score * 100),
        seo: Math.round(categories.seo.score * 100)
      },
      coreWebVitals: {
        LCP: audits['largest-contentful-paint']?.numericValue || 0,
        FID: audits['max-potential-fid']?.numericValue || 0,
        CLS: audits['cumulative-layout-shift']?.numericValue || 0,
        FCP: audits['first-contentful-paint']?.numericValue || 0,
        TTI: audits['interactive']?.numericValue || 0
      },
      healthcareMetrics: {
        serverResponseTime: audits['server-response-time']?.numericValue || 0,
        renderBlockingResources: audits['render-blocking-resources']?.details?.items?.length || 0,
        unusedCss: audits['unused-css-rules']?.details?.items?.length || 0,
        imageOptimization: audits['uses-optimized-images']?.score || 0,
        accessibilityIssues: this.countAccessibilityIssues(audits)
      }
    };

    return metrics;
  }

  countAccessibilityIssues(audits) {
    const a11yAudits = [
      'color-contrast', 'image-alt', 'label', 'link-name', 'button-name',
      'aria-allowed-attr', 'aria-required-attr', 'aria-valid-attr'
    ];
    
    return a11yAudits.reduce((count, auditName) => {
      const audit = audits[auditName];
      return count + (audit && audit.score < 1 ? 1 : 0);
    }, 0);
  }

  checkThresholds(metrics) {
    const issues = [];
    
    // Check Core Web Vitals
    if (metrics.coreWebVitals.LCP > PERFORMANCE_THRESHOLDS.LCP) {
      issues.push(`⚠️  LCP too slow: ${Math.round(metrics.coreWebVitals.LCP)}ms (target: <${PERFORMANCE_THRESHOLDS.LCP}ms)`);
    }
    
    if (metrics.coreWebVitals.CLS > PERFORMANCE_THRESHOLDS.CLS) {
      issues.push(`⚠️  CLS too high: ${metrics.coreWebVitals.CLS.toFixed(3)} (target: <${PERFORMANCE_THRESHOLDS.CLS})`);
    }
    
    if (metrics.coreWebVitals.FCP > PERFORMANCE_THRESHOLDS.FCP) {
      issues.push(`⚠️  FCP too slow: ${Math.round(metrics.coreWebVitals.FCP)}ms (target: <${PERFORMANCE_THRESHOLDS.FCP}ms)`);
    }
    
    // Check scores
    if (metrics.scores.accessibility < PERFORMANCE_THRESHOLDS.ACCESSIBILITY) {
      issues.push(`🚨 Accessibility score too low: ${metrics.scores.accessibility}% (target: >${PERFORMANCE_THRESHOLDS.ACCESSIBILITY}%)`);
    }
    
    if (metrics.scores.performance < PERFORMANCE_THRESHOLDS.PERFORMANCE) {
      issues.push(`⚠️  Performance score too low: ${metrics.scores.performance}% (target: >${PERFORMANCE_THRESHOLDS.PERFORMANCE}%)`);
    }

    return issues;
  }

  generateReport() {
    const reportPath = path.join(__dirname, '..', 'reports', `performance-${Date.now()}.json`);
    const reportDir = path.dirname(reportPath);
    
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    const report = {
      timestamp: this.timestamp,
      thresholds: PERFORMANCE_THRESHOLDS,
      results: this.results,
      summary: this.generateSummary()
    };
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📊 Report saved to: ${reportPath}`);
    
    return report;
  }

  generateSummary() {
    const totalPages = this.results.length;
    const passedPages = this.results.filter(r => r.issues.length === 0).length;
    const criticalIssues = this.results.reduce((sum, r) => sum + r.issues.length, 0);
    
    return {
      totalPages,
      passedPages,
      failedPages: totalPages - passedPages,
      criticalIssues,
      averagePerformance: Math.round(this.results.reduce((sum, r) => sum + r.metrics.scores.performance, 0) / totalPages),
      averageAccessibility: Math.round(this.results.reduce((sum, r) => sum + r.metrics.scores.accessibility, 0) / totalPages)
    };
  }

  async run() {
    console.log('🏥 Adam International Hospital - Performance Monitor');
    console.log('=' .repeat(60));
    console.log(`📅 Started at: ${this.timestamp}`);
    console.log(`🔍 Monitoring ${PAGES_TO_MONITOR.length} pages`);
    console.log('');

    for (const page of PAGES_TO_MONITOR) {
      const fullUrl = `http://localhost:3000${page.url}`;
      
      // Run both desktop and mobile tests for critical pages
      const presets = page.critical ? ['desktop', 'mobile'] : ['desktop'];
      
      for (const preset of presets) {
        const lighthouseResult = await this.runLighthouse(fullUrl, preset);
        const metrics = this.analyzeResults(lighthouseResult, `${page.name} (${preset})`);
        
        if (metrics) {
          const issues = this.checkThresholds(metrics);
          
          this.results.push({
            page: page.name,
            url: page.url,
            preset,
            critical: page.critical,
            metrics,
            issues,
            passed: issues.length === 0
          });
          
          // Display results
          console.log(`📄 ${page.name} (${preset})`);
          console.log(`   Performance: ${metrics.scores.performance}%`);
          console.log(`   Accessibility: ${metrics.scores.accessibility}%`);
          console.log(`   LCP: ${Math.round(metrics.coreWebVitals.LCP)}ms`);
          console.log(`   CLS: ${metrics.coreWebVitals.CLS.toFixed(3)}`);
          
          if (issues.length > 0) {
            console.log(`   Issues:`);
            issues.forEach(issue => console.log(`     ${issue}`));
          } else {
            console.log(`   ✅ All checks passed`);
          }
          console.log('');
        }
      }
    }

    const report = this.generateReport();
    
    console.log('📊 SUMMARY');
    console.log('=' .repeat(60));
    console.log(`✅ Passed: ${report.summary.passedPages}/${report.summary.totalPages} pages`);
    console.log(`⚠️  Issues: ${report.summary.criticalIssues} total`);
    console.log(`📈 Avg Performance: ${report.summary.averagePerformance}%`);
    console.log(`♿ Avg Accessibility: ${report.summary.averageAccessibility}%`);
    
    if (report.summary.criticalIssues > 0) {
      console.log('');
      console.log('🚨 Action required: Performance issues detected');
      process.exit(1);
    } else {
      console.log('');
      console.log('🎉 All performance checks passed!');
    }
  }
}

// Run the monitor
if (require.main === module) {
  const monitor = new PerformanceMonitor();
  monitor.run().catch(console.error);
}

module.exports = PerformanceMonitor;