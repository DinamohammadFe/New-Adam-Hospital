module.exports = {
  content: [
    './*.html',
    './js/*.js',
    './scripts/*.js'
  ],
  css: [
    './styles.css',
    './global.css',
    './layout.css',
    './components.css',
    './enhanced-mega-menu.css'
  ],
  output: './purged-css/',
  safelist: [
    // Bootstrap classes that might be added dynamically
    /^btn/,
    /^nav/,
    /^dropdown/,
    /^collapse/,
    /^modal/,
    /^carousel/,
    /^alert/,
    /^badge/,
    /^card/,
    /^form/,
    /^input/,
    /^table/,
    /^list/,
    // Animation classes
    /^animate/,
    /^fade/,
    /^slide/,
    // State classes
    /^active/,
    /^show/,
    /^hide/,
    /^open/,
    /^closed/,
    // Responsive classes
    /^d-/,
    /^flex/,
    /^justify/,
    /^align/,
    /^text/,
    /^bg/,
    /^border/,
    /^rounded/,
    /^shadow/,
    /^p-/,
    /^m-/,
    /^w-/,
    /^h-/
  ]
};