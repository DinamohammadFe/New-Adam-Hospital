# Performance Monitoring - Adam International Hospital

This document outlines the performance monitoring setup for the Adam International Hospital website, focusing on Core Web Vitals and healthcare-specific metrics.

## 🎯 Performance Targets

### Core Web Vitals
- **Largest Contentful Paint (LCP)**: < 2.5 seconds
- **First Input Delay (FID)**: < 100 milliseconds  
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Contentful Paint (FCP)**: < 2.0 seconds
- **Time to Interactive (TTI)**: < 3.0 seconds

### Healthcare-Specific Requirements
- **Accessibility Score**: > 90% (Critical for medical websites)
- **Performance Score**: > 80%
- **SEO Score**: > 80%
- **Best Practices Score**: > 80%

### Medical Content Specific
- **Form Response Time**: < 200ms (Appointment booking, contact forms)
- **Appointment Load Time**: < 1.5 seconds
- **Search Response**: < 300ms (Medical information search)

## 🛠️ Tools & Setup

### Lighthouse CI
Automated performance testing using Google Lighthouse CI.

**Configuration**: `lighthouserc.js`
- Tests 9 critical pages
- Runs on both desktop and mobile
- Monitors Core Web Vitals and accessibility

### Performance Monitor Script
Custom Node.js script for comprehensive monitoring.

**Location**: `scripts/performance-monitor.js`
- Healthcare-specific thresholds
- Detailed reporting
- Critical page prioritization

## 📊 Running Performance Tests

### Local Testing
```bash
# Start development server
npm run dev

# Run Lighthouse CI (all pages)
npm run lighthouse

# Run custom performance monitor
npm run monitor

# Run desktop-only tests
npm run lighthouse:desktop

# Run mobile-only tests  
npm run lighthouse:mobile

# Run complete audit suite
npm run audit
```

### Continuous Integration
Performance tests run automatically on:
- Pull requests to main branch
- Pushes to main/develop branches
- Manual workflow dispatch

**GitHub Actions**: `.github/workflows/lighthouse-ci.yml`

## 📈 Monitoring Critical Pages

### High Priority (Desktop + Mobile)
1. **Homepage** (`/`) - First impression, critical for conversions
2. **Genetic Testing** (`/genetic-testing.html`) - Key service page
3. **IVF Services** (`/ivf.html`) - Primary treatment offering
4. **Female Fertility** (`/female-fertility.html`) - Major patient segment
5. **Male Fertility** (`/male-fertility.html`) - Major patient segment

### Standard Priority (Desktop Only)
6. **IVF-ICSI** (`/ivf-icsi.html`) - Specialized treatment
7. **Endometriosis** (`/endometriosis.html`) - Condition-specific
8. **Embryo Freezing** (`/embryo-freezing.html`) - Additional service
9. **PCOS Treatment** (`/pcos.html`) - Condition-specific

## 🚨 Performance Alerts

### Critical Issues (Fail CI)
- Accessibility score < 90%
- LCP > 2.5 seconds
- CLS > 0.1

### Warning Issues (Log but Pass)
- Performance score < 80%
- FCP > 2.0 seconds
- TTI > 3.0 seconds

## 📋 Healthcare Compliance

### Accessibility Requirements
- WCAG 2.1 AA compliance
- Screen reader compatibility
- Keyboard navigation support
- Color contrast ratios
- Alternative text for medical images

### Performance Requirements
- Fast loading for emergency information
- Reliable appointment booking system
- Mobile-first responsive design
- Offline capability for critical content

## 🔧 Optimization Strategies

### Implemented
- ✅ Vite build optimization
- ✅ Image compression and lazy loading
- ✅ CSS/JS minification
- ✅ Gzip compression
- ✅ Service worker caching
- ✅ Dark mode for accessibility

### Planned
- 🔄 WebP image format adoption
- 🔄 Critical CSS inlining
- 🔄 Resource preloading
- 🔄 CDN implementation
- 🔄 Database query optimization

## 📊 Reporting

### Automated Reports
- **Location**: `reports/` directory
- **Format**: JSON with detailed metrics
- **Frequency**: Every CI run
- **Retention**: 30 days in GitHub Actions

### Report Contents
- Page-by-page performance scores
- Core Web Vitals measurements
- Accessibility audit results
- Healthcare-specific metrics
- Trend analysis over time

## 🎯 Performance Budget

### Bundle Size Limits
- **Main Bundle**: < 250KB (gzipped)
- **CSS Bundle**: < 50KB (gzipped)
- **Images**: WebP format, < 100KB each
- **Fonts**: Subset, < 30KB total

### Network Limits
- **Total Page Weight**: < 1MB
- **HTTP Requests**: < 50 per page
- **Third-party Scripts**: < 100KB

## 🔍 Debugging Performance Issues

### Common Issues
1. **Slow LCP**: Large images, render-blocking resources
2. **High CLS**: Images without dimensions, dynamic content
3. **Poor Accessibility**: Missing alt text, low contrast
4. **Slow TTI**: Heavy JavaScript, blocking resources

### Debugging Tools
- Chrome DevTools Performance tab
- Lighthouse DevTools panel
- WebPageTest.org
- GTmetrix
- PageSpeed Insights

## 📞 Support

For performance-related issues:
1. Check the latest performance report
2. Run local performance tests
3. Review the optimization checklist
4. Contact the development team

---

*Last updated: January 2025*
*Next review: Quarterly*