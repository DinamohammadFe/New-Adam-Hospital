# Chatbot Module

This directory contains the modular chatbot functionality that has been extracted from the main application for better organization and maintainability.

## Files

### 1. `chatbot.js`
Contains all the JavaScript functionality for the chatbot including:
- Message handling and display
- User interaction management
- Response generation
- Event listeners
- Auto-initialization

### 2. `chatbot.css`
Contains all the styling for the chatbot including:
- Modern gradient design
- Responsive layout
- Animations and transitions
- Dark theme support
- High contrast mode support

### 3. `chatbot.html`
Contains the HTML structure for the chatbot including:
- Toggle button
- Chat window
- Message area
- Quick action buttons
- Input field

## Integration

To integrate the chatbot into any HTML page:

### 1. Include the CSS file
```html
<link rel="stylesheet" href="chatbot.css">
```

### 2. Include the HTML structure
Copy the contents of `chatbot.html` into your HTML file, or include it directly:
```html
<!-- Include chatbot HTML structure here -->
```

### 3. Include the JavaScript file
```html
<script src="chatbot.js"></script>
```

### Complete Integration Example
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Page</title>
    
    <!-- Include chatbot CSS -->
    <link rel="stylesheet" href="chatbot.css">
</head>
<body>
    <!-- Your page content -->
    
    <!-- Include chatbot HTML structure -->
    <div class="chatbot-container">
        <button class="chatbot-toggle" id="chatbotToggle" aria-label="Open chat">
            💬
        </button>
        
        <div class="chatbot-window" id="chatbotWindow">
            <!-- ... rest of chatbot HTML ... -->
        </div>
    </div>
    
    <!-- Include chatbot JavaScript -->
    <script src="chatbot.js"></script>
</body>
</html>
```

## Features

### 🎨 Modern Design
- Gradient backgrounds
- Smooth animations
- Responsive layout
- Professional appearance

### 🌙 Theme Support
- Automatic dark mode detection
- High contrast mode support
- Consistent with site theming

### 💬 Smart Responses
- Keyword-based response system
- Support for internationalization (i18n)
- Contextual medical responses

### 📱 Mobile Friendly
- Responsive design
- Touch-friendly interface
- Optimized for small screens

### ♿ Accessibility
- ARIA labels
- Keyboard navigation
- High contrast support
- Screen reader friendly

## Customization

### Response System
The chatbot uses a keyword-based response system. You can customize responses by modifying the `generateResponse()` function in `chatbot.js`.

### Styling
All visual aspects can be customized through `chatbot.css`. The design uses CSS custom properties for easy theming.

### Internationalization
The chatbot supports i18n through the global `i18n` object. Make sure your translation files include the following keys:

```json
{
  "chatbot": {
    "title": "Medical Assistant",
    "welcome": {
      "message": "Hello! Welcome to Adam International Hospital. How can I assist you today?"
    },
    "messages": {
      "appointment_response": "I'd be happy to help you schedule an appointment!",
      "treatments_response": "We offer comprehensive fertility treatments...",
      "locations_response": "Adam International Hospital has multiple locations...",
      "contact_response": "You can reach us at 16992...",
      "default_response": "Thank you for your message!"
    },
    "quick_actions": {
      "appointment": "Book Appointment",
      "treatments": "Treatments",
      "locations": "Locations",
      "contact": "Contact"
    },
    "input": {
      "placeholder": "Type your message..."
    }
  }
}
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Dependencies

- No external dependencies required
- Works with or without i18n system
- Compatible with modern JavaScript environments

## Performance

- Lightweight (~15KB total)
- Lazy initialization
- Efficient DOM manipulation
- Optimized animations

## Troubleshooting

### Chatbot not appearing
1. Ensure all files are properly linked
2. Check browser console for errors
3. Verify HTML structure is complete

### Styling issues
1. Check CSS file is loaded
2. Verify no conflicting styles
3. Ensure proper viewport meta tag

### JavaScript errors
1. Check browser compatibility
2. Verify proper script loading order
3. Ensure DOM is ready before initialization

## Future Enhancements

- [ ] AI-powered responses
- [ ] File upload support
- [ ] Voice message support
- [ ] Chat history persistence
- [ ] Admin dashboard
- [ ] Analytics integration