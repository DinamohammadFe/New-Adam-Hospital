module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/genetic-testing.html',
        'http://localhost:3000/ivf.html',
        'http://localhost:3000/ivf-icsi.html',
        'http://localhost:3000/endometriosis.html',
        'http://localhost:3000/embryo-freezing.html',
        'http://localhost:3000/female-fertility.html',
        'http://localhost:3000/male-fertility.html',
        'http://localhost:3000/pcos.html'
      ],
      startServerCommand: 'npm run dev',
      startServerReadyPattern: 'ready in',
      startServerReadyTimeout: 30000,
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
        preset: 'desktop',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0
        }
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.8 }],
        'categories:seo': ['warn', { minScore: 0.8 }],
        'categories:pwa': ['warn', { minScore: 0.6 }],
        
        // Core Web Vitals
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        'speed-index': ['warn', { maxNumericValue: 3000 }],
        
        // Healthcare-specific performance metrics
        'interactive': ['warn', { maxNumericValue: 3000 }],
        'server-response-time': ['warn', { maxNumericValue: 600 }],
        'render-blocking-resources': ['warn', { maxLength: 3 }],
        'unused-css-rules': ['warn', { maxLength: 5 }],
        'unused-javascript': ['warn', { maxLength: 5 }],
        
        // Accessibility for healthcare
        'color-contrast': 'error',
        'image-alt': 'error',
        'label': 'error',
        'link-name': 'error',
        'button-name': 'error',
        'aria-allowed-attr': 'error',
        'aria-required-attr': 'error',
        'aria-valid-attr': 'error',
        'aria-valid-attr-value': 'error',
        'heading-order': 'warn',
        'landmark-one-main': 'warn',
        'meta-viewport': 'error'
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};