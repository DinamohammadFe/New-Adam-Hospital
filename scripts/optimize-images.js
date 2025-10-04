#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Get image file sizes and create optimization report
async function optimizeImages() {
  console.log('🖼️  Starting image optimization analysis...');
  
  try {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const imageFiles = [];
    
    // Recursively find all image files
    function findImages(dir) {
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
          findImages(filePath);
        } else if (stat.isFile()) {
          const ext = path.extname(file).toLowerCase();
          if (imageExtensions.includes(ext)) {
            imageFiles.push({
              path: filePath,
              relativePath: path.relative(rootDir, filePath),
              size: stat.size,
              extension: ext
            });
          }
        }
      });
    }
    
    findImages(rootDir);
    
    console.log(`📊 Found ${imageFiles.length} image files`);
    
    // Sort by size (largest first)
    imageFiles.sort((a, b) => b.size - a.size);
    
    let totalSize = 0;
    const report = {
      timestamp: new Date().toISOString(),
      totalImages: imageFiles.length,
      images: [],
      recommendations: []
    };
    
    imageFiles.forEach(image => {
      totalSize += image.size;
      const sizeKB = (image.size / 1024).toFixed(2);
      
      report.images.push({
        path: image.relativePath,
        size: image.size,
        sizeKB: `${sizeKB} KB`,
        extension: image.extension
      });
      
      // Add recommendations for large images
      if (image.size > 500 * 1024) { // > 500KB
        report.recommendations.push({
          file: image.relativePath,
          issue: 'Large file size',
          suggestion: 'Consider compressing or converting to WebP format',
          currentSize: `${sizeKB} KB`
        });
      }
      
      if (image.extension === '.png' && image.size > 100 * 1024) { // PNG > 100KB
        report.recommendations.push({
          file: image.relativePath,
          issue: 'Large PNG file',
          suggestion: 'Consider converting to WebP or optimizing PNG compression',
          currentSize: `${sizeKB} KB`
        });
      }
    });
    
    report.totalSize = totalSize;
    report.totalSizeKB = `${(totalSize / 1024).toFixed(2)} KB`;
    report.totalSizeMB = `${(totalSize / (1024 * 1024)).toFixed(2)} MB`;
    
    // Save report
    const reportPath = path.join(rootDir, 'image-optimization-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📋 Total image size: ${report.totalSizeMB}`);
    console.log(`⚠️  Found ${report.recommendations.length} optimization opportunities`);
    console.log('📄 Image optimization report saved to image-optimization-report.json');
    
    // Create optimized versions for SVG files (minify)
    const svgFiles = imageFiles.filter(img => img.extension === '.svg');
    let svgOptimized = 0;
    
    svgFiles.forEach(svgFile => {
      try {
        const content = fs.readFileSync(svgFile.path, 'utf8');
        const optimized = content
          // Remove comments
          .replace(/<!--[\s\S]*?-->/g, '')
          // Remove unnecessary whitespace
          .replace(/>\s+</g, '><')
          // Remove leading/trailing whitespace
          .trim();
        
        if (optimized.length < content.length) {
          const optimizedPath = svgFile.path.replace('.svg', '.min.svg');
          fs.writeFileSync(optimizedPath, optimized);
          svgOptimized++;
          
          const savings = ((content.length - optimized.length) / content.length * 100).toFixed(2);
          console.log(`✅ Optimized ${svgFile.relativePath} (${savings}% reduction)`);
        }
      } catch (error) {
        console.warn(`⚠️  Could not optimize ${svgFile.relativePath}: ${error.message}`);
      }
    });
    
    if (svgOptimized > 0) {
      console.log(`🎉 Optimized ${svgOptimized} SVG files`);
    }
    
    console.log('✨ Image optimization analysis completed!');
    
  } catch (error) {
    console.error('❌ Error during image optimization:', error.message);
    process.exit(1);
  }
}

// Run optimization
optimizeImages();