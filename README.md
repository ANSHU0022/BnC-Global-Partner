# BnC Global Partner Portal

A modern, secure partner portal for BnC Global with AI profiling, authentication, and comprehensive partner management.

## 🚀 Features

- **Multi-step Partner Registration**
- **Secure Authentication System**
- **AI Partner Profiling (5 Questions)**
- **Partner Dashboard**
- **Admin Dashboard**
- **Security Features** (CSRF, XSS Protection, Rate Limiting)
- **Responsive Design**
- **Google Apps Script Integration**

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript, Tailwind CSS
- **Build Tool**: Vite
- **Backend**: Google Apps Script
- **Database**: Google Sheets
- **Deployment**: Vercel

## 📦 Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd BnC-Partner
```

2. **Install dependencies**
```bash
npm install
```

3. **Development server**
```bash
npm run dev
```

4. **Build for production**
```bash
npm run build
```

## 🚀 Deployment to Vercel

### Method 1: Vercel CLI
```bash
npm install -g vercel
vercel --prod
```

### Method 2: GitHub Integration
1. Push code to GitHub
2. Connect repository to Vercel
3. Auto-deploy on push

### Method 3: Manual Upload
1. Run `npm run build`
2. Upload `dist` folder to Vercel

## 🔧 Configuration

### Environment Setup
- Development: `localhost:3000`
- Production: Auto-detected by domain

### Google Apps Script URL
Update in `config.js`:
```javascript
API_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'
```

## 🔒 Security Features

- **CSRF Protection**
- **XSS Prevention**
- **Input Sanitization**
- **Rate Limiting**
- **Session Management**
- **Content Security Policy**
- **Clickjacking Protection**

## 📁 File Structure

```
BnC Partner/
├── index.html              # Main landing page
├── login.html              # Login page
├── partner-dashboard.html   # Partner dashboard
├── admin-dashboard.html     # Admin dashboard
├── config.js               # Environment configuration
├── security.js             # Security utilities
├── auth-system.js          # Authentication system
├── partner-form.js         # Form handling
├── vercel.json             # Vercel configuration
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
└── dist/                   # Build output
```

## 🎯 Key Components

### 1. Partner Registration
- Multi-step form (3 steps)
- Email, phone, name validation
- Country/city selection
- Terms acceptance

### 2. AI Profiling
- 5 comprehensive questions
- Industry selection
- Experience assessment
- Meeting scheduling

### 3. Security System
- Input sanitization
- CSRF tokens
- Rate limiting
- Session validation

## 📊 Google Sheets Integration

### Sheets Created:
1. **Main Sheet**: Partner registration data
2. **Admin Sheet**: Admin credentials
3. **Partner Service Sheet**: Service selections
4. **AI Profile Sheet**: AI profiling responses

### Data Flow:
1. User submits form → JavaScript
2. JavaScript → Google Apps Script
3. Apps Script → Google Sheets
4. Response → User interface

## 🔍 Troubleshooting

### Common Issues:

1. **Buttons not working on Vercel**
   - Check CSP headers in `vercel.json`
   - Verify script loading order

2. **Google Apps Script errors**
   - Confirm script URL is correct
   - Check CORS settings
   - Verify deployment status

3. **Build failures**
   - Run `npm install` to update dependencies
   - Check Node.js version compatibility

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

© 2026 BnC Global Pvt. Ltd. All rights reserved.

## 📞 Support

For technical support, contact: support@bncglobal.in