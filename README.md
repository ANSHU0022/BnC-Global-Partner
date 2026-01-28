# BnC Global Partner Page

A modern, responsive partner page for BnC Global featuring partnership opportunities and event management.

## Features

- **Partnership Types**: Strategic, Channel, and Technology partnerships
- **Events Section**: Recent and upcoming events display
- **Partner Application Form**: Interactive form for partnership applications
- **Responsive Design**: Works on all devices
- **Smooth Animations**: Scroll-based animations and transitions

## File Structure

```
BnC Partner/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Customization Guide

### 1. Update Company Information
- Edit the logo and company name in the header
- Update contact information in the footer
- Modify the hero section content

### 2. Add Your Events
In `index.html`, update the events section:
- Replace sample events with your actual events
- Update dates, locations, and descriptions
- Add registration/information links

### 3. Customize Partnership Types
- Modify the partnership cards in the partnerships section
- Update icons, titles, and descriptions
- Add or remove partnership categories

### 4. Form Integration
To make the form functional:
- Add a backend endpoint to handle form submissions
- Update the JavaScript in `script.js` to send data to your server
- Consider adding email notifications

### 5. Styling Customization
In `styles.css`:
- Update color scheme (currently uses blue #2c5aa0 as primary)
- Modify fonts and typography
- Adjust spacing and layout

## Quick Setup

1. Open `index.html` in a web browser to view the page
2. Customize content as needed
3. Deploy to your web server

## Integration with Main Website

To integrate with your main website (bncglobal.in):
1. Upload files to a subdirectory (e.g., `/partners/`)
2. Update navigation links in your main site
3. Ensure consistent branding and styling

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- Add CMS integration for easy event management
- Implement partner portal with login
- Add testimonials section
- Include partnership success stories
- Add multi-language support